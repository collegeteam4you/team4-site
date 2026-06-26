const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rootDir = __dirname;
const dataDir = process.env.DATA_DIR || path.join(rootDir, '.data');
const authFile = path.join(dataDir, 'admin-auth.json');
const manualOrdersFile = path.join(dataDir, 'manual-orders.json');
const receiptsDir = path.join(dataDir, 'receipts');
const port = Number(process.env.PORT || 4173);
const isProduction = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);

const adminUsername = process.env.ADMIN_USERNAME || 'TEAM4ADMIN';
const defaultPassword = process.env.ADMIN_PASSWORD || (isProduction ? '' : '123456789ns@');
const adminEmail = process.env.ADMIN_EMAIL || 'collegeteam4you@gmail.com';
const sessionSecret = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
const bookPriceGel = Number(process.env.BOOK_PRICE_GEL || 14.9);
const manualPaymentReceiver = process.env.MANUAL_PAYMENT_RECEIVER || 'ლაშა ხურციძე';
const manualPaymentAccount = process.env.MANUAL_PAYMENT_ACCOUNT || 'GE12BG0000000536600132';

const sessions = new Map();
const resetCodes = new Map();
const contactRateLimit = new Map();

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.pdf': 'application/pdf',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' https://cdn.tailwindcss.com https://unpkg.com https://cdn.jsdelivr.net https://connect.facebook.net",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https:",
  "connect-src 'self' https://api.emailjs.com https://connect.facebook.net https://www.facebook.com",
  'frame-src https://www.facebook.com https://web.facebook.com',
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  'upgrade-insecure-requests',
].join('; ');

const sendJson = (res, status, data, extraHeaders = {}) => {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...extraHeaders,
  });
  res.end(JSON.stringify(data));
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 8 * 1024 * 1024) {
        reject(new Error('Request body is too large.'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Invalid JSON body.'));
      }
    });
    req.on('error', reject);
  });

const ensureAuthStore = () => {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (fs.existsSync(authFile)) return JSON.parse(fs.readFileSync(authFile, 'utf8'));
  if (!defaultPassword) {
    throw new Error('ADMIN_PASSWORD must be set in production before admin login can be used.');
  }
  const record = createPasswordRecord(defaultPassword);
  fs.writeFileSync(authFile, JSON.stringify(record, null, 2));
  return record;
};

const ensureDataDir = () => {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
};

const readJsonFile = (filePath, fallback) => {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
};

const writeJsonFile = (filePath, value) => {
  ensureDataDir();
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
};

const normalizeEmail = (value) => String(value || '').trim().toLowerCase();

const publicBaseUrl = (req) => {
  const proto = req.headers['x-forwarded-proto'] || (isProduction ? 'https' : 'http');
  return `${proto}://${req.headers.host || `localhost:${port}`}`;
};

const getManualOrders = () => readJsonFile(manualOrdersFile, []);

const setManualOrders = (orders) => writeJsonFile(manualOrdersFile, orders);

const generatePaymentCode = (orders) => {
  let code = '';
  do {
    code = `TEAM4-${crypto.randomInt(1000, 10000)}`;
  } while (orders.some((order) => order.paymentCode === code));
  return code;
};

const toPublicOrder = (order, req) => ({
  orderNumber: order.orderNumber,
  paymentCode: order.paymentCode,
  firstName: order.firstName,
  lastName: order.lastName,
  email: order.email,
  phone: order.phone,
  amount: order.amount,
  currency: order.currency,
  itemId: order.itemId,
  itemTitle: order.itemTitle,
  status: order.status,
  rejectReason: order.rejectReason || '',
  createdAt: order.createdAt,
  approvedAt: order.approvedAt || '',
  rejectedAt: order.rejectedAt || '',
  receiptUrl: order.receiptFile ? `${publicBaseUrl(req)}/api/admin/receipts/${encodeURIComponent(order.receiptFile)}` : '',
});

const saveReceipt = (order, receipt) => {
  const dataUrl = String(receipt?.dataUrl || '');
  const match = dataUrl.match(/^data:([a-zA-Z0-9/+.-]+);base64,(.+)$/);
  if (!match) throw new Error('Receipt file is invalid.');

  const mimeType = match[1].toLowerCase();
  const allowed = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/webp': 'webp',
    'application/pdf': 'pdf',
  };
  const ext = allowed[mimeType];
  if (!ext) throw new Error('Receipt must be a PNG, JPG, WEBP, or PDF file.');

  const bytes = Buffer.from(match[2], 'base64');
  if (!bytes.length || bytes.length > 6 * 1024 * 1024) {
    throw new Error('Receipt file must be smaller than 6MB.');
  }

  if (!fs.existsSync(receiptsDir)) fs.mkdirSync(receiptsDir, { recursive: true });
  const fileName = `${order.paymentCode}-${Date.now()}.${ext}`;
  fs.writeFileSync(path.join(receiptsDir, fileName), bytes);
  return { fileName, mimeType, size: bytes.length, originalName: String(receipt?.name || `receipt.${ext}`).slice(0, 160) };
};

const createPasswordRecord = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 64, 'sha512').toString('hex');
  return { username: adminUsername, salt, hash, iterations: 120000, digest: 'sha512', updatedAt: new Date().toISOString() };
};

const verifyPassword = (password, record) => {
  const hash = crypto
    .pbkdf2Sync(password, record.salt, record.iterations || 120000, 64, record.digest || 'sha512')
    .toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(record.hash, 'hex'));
};

const writePasswordRecord = (password) => {
  const record = createPasswordRecord(password);
  fs.writeFileSync(authFile, JSON.stringify(record, null, 2));
  return record;
};

const parseCookies = (req) =>
  Object.fromEntries(
    String(req.headers.cookie || '')
      .split(';')
      .map((part) => part.trim().split('='))
      .filter(([key, value]) => key && value)
  );

const createSession = () => {
  const id = crypto.randomBytes(32).toString('hex');
  const signature = crypto.createHmac('sha256', sessionSecret).update(id).digest('hex');
  sessions.set(id, { createdAt: Date.now() });
  return `${id}.${signature}`;
};

const getSessionId = (req) => {
  const token = parseCookies(req).team4_admin_session;
  if (!token) return null;
  const [id, signature] = token.split('.');
  if (!id || !signature) return null;
  const expected = crypto.createHmac('sha256', sessionSecret).update(id).digest('hex');
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  return sessions.has(id) ? id : null;
};

const sessionCookie = (value, maxAge = 60 * 60 * 8) =>
  `team4_admin_session=${value}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${isProduction ? '; Secure' : ''}`;

const requireSession = (req, res) => {
  if (getSessionId(req)) return true;
  sendJson(res, 401, { ok: false, message: 'Not authenticated.' });
  return false;
};

const isStrongPassword = (password) => password.length >= 8 && /\d/.test(password) && /[^A-Za-z0-9]/.test(password);

const postEmailJs = async (payload) => {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  if (!serviceId || !templateId || !publicKey) {
    return { skipped: true, message: 'EmailJS environment variables are not configured.' };
  }

  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: payload,
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(text || `EmailJS request failed with status ${response.status}`);
  }
  return { sent: true };
};

const handleAdminApi = async (req, res, pathname) => {
  if (pathname === '/api/admin/session') {
    sendJson(res, 200, { ok: true, authenticated: Boolean(getSessionId(req)) });
    return;
  }

  if (pathname === '/api/admin/login' && req.method === 'POST') {
    const body = await readBody(req);
    const record = ensureAuthStore();
    const usernameOk = String(body.username || '').trim() === (record.username || adminUsername);
    const passwordOk = body.password && verifyPassword(String(body.password), record);
    if (!usernameOk || !passwordOk) {
      sendJson(res, 401, { ok: false, message: 'Invalid username or password.' });
      return;
    }
    sendJson(res, 200, { ok: true, authenticated: true }, { 'Set-Cookie': sessionCookie(createSession()) });
    return;
  }

  if (pathname === '/api/admin/logout' && req.method === 'POST') {
    const id = getSessionId(req);
    if (id) sessions.delete(id);
    sendJson(res, 200, { ok: true }, { 'Set-Cookie': sessionCookie('', 0) });
    return;
  }

  if (pathname === '/api/admin/change-password' && req.method === 'POST') {
    if (!requireSession(req, res)) return;
    const body = await readBody(req);
    const record = ensureAuthStore();
    if (!verifyPassword(String(body.currentPassword || ''), record)) {
      sendJson(res, 400, { ok: false, message: 'Current password is incorrect.' });
      return;
    }
    if (!isStrongPassword(String(body.newPassword || ''))) {
      sendJson(res, 400, { ok: false, message: 'Password must be at least 8 characters and include a number and special symbol.' });
      return;
    }
    writePasswordRecord(String(body.newPassword));
    sessions.clear();
    sendJson(res, 200, { ok: true, message: 'Password changed successfully. Please log in again.' }, { 'Set-Cookie': sessionCookie('', 0) });
    return;
  }

  if (pathname === '/api/admin/request-reset' && req.method === 'POST') {
    const code = String(crypto.randomInt(100000, 1000000));
    resetCodes.set(code, { expiresAt: Date.now() + 10 * 60 * 1000 });
    await postEmailJs({
      title: 'Team4 Admin Reset Code',
      name: 'Team4 Admin',
      email: adminEmail,
      phone: '',
      program: 'Admin password reset',
      message: `Your Team4 admin reset code is ${code}. It expires in 10 minutes.`,
      to_email: adminEmail,
    });
    sendJson(res, 200, { ok: true, message: `Verification code sent to ${adminEmail}.` });
    return;
  }

  if (pathname === '/api/admin/reset-password' && req.method === 'POST') {
    const body = await readBody(req);
    const code = String(body.code || '').trim();
    const record = resetCodes.get(code);
    if (!record || record.expiresAt < Date.now()) {
      sendJson(res, 400, { ok: false, message: 'Invalid or expired verification code.' });
      return;
    }
    if (!isStrongPassword(String(body.newPassword || ''))) {
      sendJson(res, 400, { ok: false, message: 'Password must be at least 8 characters and include a number and special symbol.' });
      return;
    }
    resetCodes.delete(code);
    writePasswordRecord(String(body.newPassword));
    sessions.clear();
    sendJson(res, 200, { ok: true, message: 'Password changed. You can log in now.' }, { 'Set-Cookie': sessionCookie('', 0) });
    return;
  }

  if (pathname === '/api/admin/purchases') {
    if (!requireSession(req, res)) return;
    const orders = getManualOrders();
    sendJson(res, 200, { ok: true, purchases: orders.map((order) => toPublicOrder(order, req)) });
    return;
  }

  if (pathname === '/api/admin/orders') {
    if (!requireSession(req, res)) return;
    const orders = getManualOrders();
    sendJson(res, 200, { ok: true, orders: orders.map((order) => toPublicOrder(order, req)) });
    return;
  }

  if (pathname === '/api/admin/orders/approve' && req.method === 'POST') {
    if (!requireSession(req, res)) return;
    const body = await readBody(req);
    const orderCode = String(body.orderCode || '').trim();
    const orders = getManualOrders();
    const index = orders.findIndex((order) => order.paymentCode === orderCode || order.orderNumber === orderCode);
    if (index < 0) {
      sendJson(res, 404, { ok: false, message: 'Order not found.' });
      return;
    }
    orders[index] = {
      ...orders[index],
      status: 'Approved',
      approvedAt: new Date().toISOString(),
      rejectReason: '',
      updatedAt: new Date().toISOString(),
    };
    setManualOrders(orders);
    await postEmailJs({
      title: 'Team4 Payment Approved',
      name: `${orders[index].firstName} ${orders[index].lastName}`.trim(),
      email: orders[index].email,
      phone: orders[index].phone,
      program: orders[index].itemTitle,
      message: 'თქვენი გადახდა დადასტურდა. წიგნის წაკითხვა უკვე შეგიძლიათ თქვენს კაბინეტში.',
      to_email: orders[index].email,
    });
    sendJson(res, 200, { ok: true, order: toPublicOrder(orders[index], req) });
    return;
  }

  if (pathname === '/api/admin/orders/reject' && req.method === 'POST') {
    if (!requireSession(req, res)) return;
    const body = await readBody(req);
    const orderCode = String(body.orderCode || '').trim();
    const reason = String(body.reason || '').trim();
    const orders = getManualOrders();
    const index = orders.findIndex((order) => order.paymentCode === orderCode || order.orderNumber === orderCode);
    if (index < 0) {
      sendJson(res, 404, { ok: false, message: 'Order not found.' });
      return;
    }
    orders[index] = {
      ...orders[index],
      status: 'Rejected',
      rejectReason: reason || 'გადახდა ვერ დადასტურდა.',
      rejectedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setManualOrders(orders);
    await postEmailJs({
      title: 'Team4 Payment Rejected',
      name: `${orders[index].firstName} ${orders[index].lastName}`.trim(),
      email: orders[index].email,
      phone: orders[index].phone,
      program: orders[index].itemTitle,
      message: `თქვენი გადახდა ვერ დადასტურდა. მიზეზი: ${orders[index].rejectReason}`,
      to_email: orders[index].email,
    });
    sendJson(res, 200, { ok: true, order: toPublicOrder(orders[index], req) });
    return;
  }

  if (pathname.startsWith('/api/admin/receipts/')) {
    if (!requireSession(req, res)) return;
    const receiptFile = decodeURIComponent(pathname.replace('/api/admin/receipts/', ''));
    if (!/^[A-Za-z0-9_.-]+$/.test(receiptFile)) {
      sendJson(res, 400, { ok: false, message: 'Invalid receipt file.' });
      return;
    }
    const receiptPath = path.join(receiptsDir, receiptFile);
    if (!receiptPath.startsWith(receiptsDir) || !fs.existsSync(receiptPath)) {
      sendJson(res, 404, { ok: false, message: 'Receipt not found.' });
      return;
    }
    serveFile(res, receiptPath);
    return;
  }

  sendJson(res, 404, { ok: false, message: 'Admin API route not found.' });
};

const handleManualPaymentApi = async (req, res, pathname) => {
  if (pathname === '/api/manual-payment/orders' && req.method === 'POST') {
    const body = await readBody(req);
    const firstName = String(body.firstName || '').trim();
    const lastName = String(body.lastName || '').trim();
    const email = normalizeEmail(body.email);
    const phone = String(body.phone || '').trim();
    if (!firstName || !lastName || !email || !email.includes('@') || !phone) {
      sendJson(res, 400, { ok: false, message: 'Please fill in first name, last name, email, and phone.' });
      return;
    }

    const orders = getManualOrders();
    const paymentCode = generatePaymentCode(orders);
    const now = new Date().toISOString();
    const order = {
      id: crypto.randomUUID(),
      orderNumber: paymentCode,
      paymentCode,
      firstName,
      lastName,
      email,
      phone,
      amount: bookPriceGel,
      currency: 'GEL',
      itemId: 'i-am-the-answer',
      itemTitle: 'მე ვარ პასუხი',
      itemType: 'book',
      status: 'Pending',
      createdAt: now,
      updatedAt: now,
      receiptFile: '',
      receiptName: '',
      receiptMimeType: '',
      receiptSize: 0,
      rejectReason: '',
    };
    orders.unshift(order);
    setManualOrders(orders);
    sendJson(res, 200, {
      ok: true,
      order: toPublicOrder(order, req),
      bankDetails: {
        receiver: manualPaymentReceiver,
        account: manualPaymentAccount,
        amount: bookPriceGel,
        currency: 'GEL',
        purpose: paymentCode,
      },
    });
    return;
  }

  if (pathname === '/api/manual-payment/receipt' && req.method === 'POST') {
    const body = await readBody(req);
    const orderCode = String(body.orderCode || '').trim();
    const orders = getManualOrders();
    const index = orders.findIndex((order) => order.paymentCode === orderCode || order.orderNumber === orderCode);
    if (index < 0) {
      sendJson(res, 404, { ok: false, message: 'Order not found.' });
      return;
    }
    const receipt = saveReceipt(orders[index], body.receipt);
    orders[index] = {
      ...orders[index],
      receiptFile: receipt.fileName,
      receiptName: receipt.originalName,
      receiptMimeType: receipt.mimeType,
      receiptSize: receipt.size,
      updatedAt: new Date().toISOString(),
    };
    setManualOrders(orders);
    sendJson(res, 200, { ok: true, order: toPublicOrder(orders[index], req) });
    return;
  }

  if (pathname === '/api/manual-payment/status') {
    const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const email = normalizeEmail(requestUrl.searchParams.get('email'));
    const orders = getManualOrders().filter((order) => order.email === email);
    sendJson(res, 200, { ok: true, orders: orders.map((order) => toPublicOrder(order, req)) });
    return;
  }

  sendJson(res, 404, { ok: false, message: 'Manual payment route not found.' });
};

const handleContactApi = async (req, res, clientIp) => {
  if (req.method !== 'POST') {
    sendJson(res, 405, { ok: false, message: 'Method not allowed.' });
    return;
  }

  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const attempts = (contactRateLimit.get(clientIp) || []).filter((timestamp) => now - timestamp < windowMs);
  if (attempts.length >= 5) {
    sendJson(res, 429, { ok: false, message: 'Too many messages. Please try again later.' });
    return;
  }
  attempts.push(now);
  contactRateLimit.set(clientIp, attempts);

  const body = await readBody(req);
  const fields = ['name', 'email', 'phone', 'program', 'message'];
  const missing = fields.filter((field) => !String(body[field] || '').trim());
  if (missing.length) {
    sendJson(res, 400, { ok: false, message: 'Please fill in all required fields.' });
    return;
  }

  await postEmailJs({
    title: 'Team4 Contact',
    name: String(body.name).trim(),
    email: String(body.email).trim(),
    phone: String(body.phone).trim(),
    program: String(body.program).trim(),
    message: String(body.message).trim(),
    to_email: adminEmail,
  });
  sendJson(res, 200, { ok: true, message: 'Message sent successfully.' });
};

const serveFile = (res, filePath) => {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      sendJson(res, 404, { ok: false, message: 'File not found.' });
      return;
    }
    res.writeHead(200, {
      'Content-Type': mimeTypes[path.extname(filePath)] || 'application/octet-stream',
      'Content-Security-Policy': csp,
      'X-Content-Type-Options': 'nosniff',
    });
    res.end(data);
  });
};

const resolveStaticFile = (pathname) => {
  if (pathname === '/' || pathname === '') return path.join(rootDir, 'index.html');
  if (pathname === '/admin') return path.join(rootDir, 'admin.html');
  if (pathname === '/privacy') return path.join(rootDir, 'privacy.html');
  if (pathname === '/terms') return path.join(rootDir, 'terms.html');
  if (pathname === '/refund') return path.join(rootDir, 'refund.html');

  const normalizedPath = path.normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
  const candidate = path.join(rootDir, normalizedPath);
  if (!candidate.startsWith(rootDir)) return null;
  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  return path.join(rootDir, 'index.html');
};

const server = http.createServer(async (req, res) => {
  try {
    const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = requestUrl.pathname;
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';

    if (pathname.startsWith('/api/admin/')) {
      await handleAdminApi(req, res, pathname);
      return;
    }

    if (pathname.startsWith('/api/manual-payment/')) {
      await handleManualPaymentApi(req, res, pathname);
      return;
    }

    if (pathname === '/api/contact/send') {
      await handleContactApi(req, res, clientIp);
      return;
    }

    if (pathname === '/api/library/entitlements') {
      const email = normalizeEmail(requestUrl.searchParams.get('email'));
      const orders = getManualOrders().filter((order) => order.email === email && order.status === 'Approved');
      sendJson(res, 200, {
        ok: true,
        items: orders.map((order) => ({
          itemId: order.itemId,
          itemTitle: order.itemTitle,
          itemType: order.itemType,
          status: order.status,
          approvedAt: order.approvedAt || order.updatedAt || order.createdAt,
        })),
      });
      return;
    }

    const filePath = resolveStaticFile(pathname);
    if (!filePath) {
      sendJson(res, 403, { ok: false, message: 'Forbidden.' });
      return;
    }
    serveFile(res, filePath);
  } catch (error) {
    console.error(error);
    sendJson(res, 500, { ok: false, message: error.message || 'Server error.' });
  }
});

server.listen(port, () => {
  console.log(`Team4 site running at http://localhost:${port}`);
  if (!isProduction) {
    console.log(`Local admin login: ${adminUsername} / ${defaultPassword}`);
  }
});

const crypto = require('crypto');
const { sql } = require('@vercel/postgres');
const { put } = require('@vercel/blob');

const adminUsername = process.env.ADMIN_USERNAME || 'TEAM4ADMIN';
const adminPassword = process.env.ADMIN_PASSWORD || '123456789ns@';
const adminEmail = process.env.ADMIN_EMAIL || 'collegeteam4you@gmail.com';
const sessionSecret = process.env.SESSION_SECRET || 'team4-local-session-secret-change-me';
const bookPriceGel = Number(process.env.BOOK_PRICE_GEL || 14.9);
const manualPaymentReceiver = process.env.MANUAL_PAYMENT_RECEIVER || 'ლაშა ხურციძე';
const manualPaymentAccount = process.env.MANUAL_PAYMENT_ACCOUNT || 'GE12BG0000000536600132';

const sendJson = (res, status, data, extraHeaders = {}) => {
  Object.entries({
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...extraHeaders,
  }).forEach(([key, value]) => res.setHeader(key, value));
  res.status(status).json(data);
};

const normalizeEmail = (value) => String(value || '').trim().toLowerCase();

const createPasswordRecord = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 64, 'sha512').toString('hex');
  return { salt, hash, iterations: 120000, digest: 'sha512', updatedAt: new Date().toISOString() };
};

const verifyPassword = (password, record) => {
  const hash = crypto
    .pbkdf2Sync(password, record.salt, Number(record.iterations || 120000), 64, record.digest || 'sha512')
    .toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(record.hash, 'hex'));
};

const isStrongPassword = (password) => password.length >= 8 && /\d/.test(password) && /[^A-Za-z0-9]/.test(password);

const parseCookies = (req) =>
  Object.fromEntries(
    String(req.headers.cookie || '')
      .split(';')
      .map((part) => part.trim().split('='))
      .filter(([key, value]) => key && value)
  );

const signSession = (payload) => crypto.createHmac('sha256', sessionSecret).update(payload).digest('hex');

const createSessionCookieValue = () => {
  const expiresAt = Date.now() + 8 * 60 * 60 * 1000;
  const nonce = crypto.randomBytes(16).toString('hex');
  const payload = `${adminUsername}.${expiresAt}.${nonce}`;
  return `${payload}.${signSession(payload)}`;
};

const hasSession = (req) => {
  const token = parseCookies(req).team4_admin_session;
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 4) return false;
  const [username, expiresAt, nonce, signature] = parts;
  const payload = `${username}.${expiresAt}.${nonce}`;
  const expected = signSession(payload);
  if (username !== adminUsername || Number(expiresAt) < Date.now()) return false;
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
};

const sessionCookie = (value, maxAge = 60 * 60 * 8) =>
  `team4_admin_session=${value}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}; Secure`;

const requireSession = (req, res) => {
  if (hasSession(req)) return true;
  sendJson(res, 401, { ok: false, message: 'Not authenticated.' });
  return false;
};

const ensureSchema = async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS admin_auth (
      id INT PRIMARY KEY DEFAULT 1,
      username TEXT NOT NULL,
      salt TEXT NOT NULL,
      hash TEXT NOT NULL,
      iterations INT NOT NULL,
      digest TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT admin_auth_singleton CHECK (id = 1)
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS manual_orders (
      id TEXT PRIMARY KEY,
      order_number TEXT NOT NULL UNIQUE,
      payment_code TEXT NOT NULL UNIQUE,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      amount NUMERIC(10,2) NOT NULL,
      currency TEXT NOT NULL,
      item_id TEXT NOT NULL,
      item_title TEXT NOT NULL,
      item_type TEXT NOT NULL,
      status TEXT NOT NULL,
      receipt_url TEXT,
      receipt_name TEXT,
      receipt_mime_type TEXT,
      receipt_size INT DEFAULT 0,
      reject_reason TEXT DEFAULT '',
      approved_at TIMESTAMPTZ,
      rejected_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS manual_orders_email_idx ON manual_orders (email)`;
};

const getAuthRecord = async () => {
  await ensureSchema();
  const existing = await sql`SELECT * FROM admin_auth WHERE id = 1`;
  if (existing.rows[0]) return existing.rows[0];
  const record = createPasswordRecord(adminPassword);
  await sql`
    INSERT INTO admin_auth (id, username, salt, hash, iterations, digest)
    VALUES (1, ${adminUsername}, ${record.salt}, ${record.hash}, ${record.iterations}, ${record.digest})
  `;
  return (await sql`SELECT * FROM admin_auth WHERE id = 1`).rows[0];
};

const updateAuthPassword = async (password) => {
  const record = createPasswordRecord(password);
  await sql`
    INSERT INTO admin_auth (id, username, salt, hash, iterations, digest, updated_at)
    VALUES (1, ${adminUsername}, ${record.salt}, ${record.hash}, ${record.iterations}, ${record.digest}, NOW())
    ON CONFLICT (id)
    DO UPDATE SET username = EXCLUDED.username, salt = EXCLUDED.salt, hash = EXCLUDED.hash,
      iterations = EXCLUDED.iterations, digest = EXCLUDED.digest, updated_at = NOW()
  `;
};

const rowToOrder = (row) => ({
  orderNumber: row.order_number,
  paymentCode: row.payment_code,
  firstName: row.first_name,
  lastName: row.last_name,
  email: row.email,
  phone: row.phone,
  amount: Number(row.amount),
  currency: row.currency,
  itemId: row.item_id,
  itemTitle: row.item_title,
  status: row.status,
  rejectReason: row.reject_reason || '',
  createdAt: row.created_at ? new Date(row.created_at).toISOString() : '',
  approvedAt: row.approved_at ? new Date(row.approved_at).toISOString() : '',
  rejectedAt: row.rejected_at ? new Date(row.rejected_at).toISOString() : '',
  receiptUrl: row.receipt_url || '',
});

const generatePaymentCode = async () => {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const code = `TEAM4-${crypto.randomInt(1000, 10000)}`;
    const existing = await sql`SELECT 1 FROM manual_orders WHERE payment_code = ${code} LIMIT 1`;
    if (!existing.rows.length) return code;
  }
  throw new Error('Could not generate payment code.');
};

const postEmailJs = async (payload) => {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  if (!serviceId || !templateId || !publicKey) return { skipped: true };

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

  if (!response.ok) throw new Error((await response.text().catch(() => '')) || 'EmailJS failed.');
  return { sent: true };
};

const saveReceipt = async (order, receipt) => {
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
  if (!bytes.length || bytes.length > 4 * 1024 * 1024) throw new Error('Receipt file must be smaller than 4MB on Vercel.');
  const fileName = `receipts/${order.payment_code}-${Date.now()}.${ext}`;
  const blob = await put(fileName, bytes, {
    access: 'public',
    contentType: mimeType,
    addRandomSuffix: false,
  });
  return {
    url: blob.url,
    mimeType,
    size: bytes.length,
    originalName: String(receipt?.name || `receipt.${ext}`).slice(0, 160),
  };
};

const handleAdminApi = async (req, res, pathname) => {
  if (pathname === '/api/admin/session') {
    sendJson(res, 200, { ok: true, authenticated: hasSession(req) });
    return;
  }

  if (pathname === '/api/admin/login' && req.method === 'POST') {
    const body = req.body || {};
    const record = await getAuthRecord();
    const usernameOk = String(body.username || '').trim() === (record.username || adminUsername);
    const passwordOk = body.password && verifyPassword(String(body.password), record);
    if (!usernameOk || !passwordOk) {
      sendJson(res, 401, { ok: false, message: 'Invalid username or password.' });
      return;
    }
    sendJson(res, 200, { ok: true, authenticated: true }, { 'Set-Cookie': sessionCookie(createSessionCookieValue()) });
    return;
  }

  if (pathname === '/api/admin/logout' && req.method === 'POST') {
    sendJson(res, 200, { ok: true }, { 'Set-Cookie': sessionCookie('', 0) });
    return;
  }

  if (pathname === '/api/admin/change-password' && req.method === 'POST') {
    if (!requireSession(req, res)) return;
    const body = req.body || {};
    const record = await getAuthRecord();
    if (!verifyPassword(String(body.currentPassword || ''), record)) {
      sendJson(res, 400, { ok: false, message: 'Current password is incorrect.' });
      return;
    }
    if (!isStrongPassword(String(body.newPassword || ''))) {
      sendJson(res, 400, { ok: false, message: 'Password must be at least 8 characters and include a number and special symbol.' });
      return;
    }
    await updateAuthPassword(String(body.newPassword));
    sendJson(res, 200, { ok: true, message: 'Password changed successfully. Please log in again.' }, { 'Set-Cookie': sessionCookie('', 0) });
    return;
  }

  if (pathname === '/api/admin/orders' || pathname === '/api/admin/purchases') {
    if (!requireSession(req, res)) return;
    await ensureSchema();
    const result = await sql`SELECT * FROM manual_orders ORDER BY created_at DESC`;
    const orders = result.rows.map(rowToOrder);
    sendJson(res, 200, pathname.endsWith('/purchases') ? { ok: true, purchases: orders } : { ok: true, orders });
    return;
  }

  if (pathname === '/api/admin/orders/approve' && req.method === 'POST') {
    if (!requireSession(req, res)) return;
    const orderCode = String(req.body?.orderCode || '').trim();
    const result = await sql`
      UPDATE manual_orders
      SET status = 'Approved', approved_at = NOW(), rejected_at = NULL, reject_reason = '', updated_at = NOW()
      WHERE payment_code = ${orderCode} OR order_number = ${orderCode}
      RETURNING *
    `;
    if (!result.rows[0]) {
      sendJson(res, 404, { ok: false, message: 'Order not found.' });
      return;
    }
    const order = rowToOrder(result.rows[0]);
    await postEmailJs({
      title: 'Team4 Payment Approved',
      name: `${order.firstName} ${order.lastName}`.trim(),
      email: order.email,
      phone: order.phone,
      program: order.itemTitle,
      message: 'თქვენი გადახდა დადასტურდა. წიგნის წაკითხვა უკვე შეგიძლიათ თქვენს კაბინეტში.',
      to_email: order.email,
    });
    sendJson(res, 200, { ok: true, order });
    return;
  }

  if (pathname === '/api/admin/orders/reject' && req.method === 'POST') {
    if (!requireSession(req, res)) return;
    const orderCode = String(req.body?.orderCode || '').trim();
    const reason = String(req.body?.reason || '').trim() || 'გადახდა ვერ დადასტურდა.';
    const result = await sql`
      UPDATE manual_orders
      SET status = 'Rejected', rejected_at = NOW(), approved_at = NULL, reject_reason = ${reason}, updated_at = NOW()
      WHERE payment_code = ${orderCode} OR order_number = ${orderCode}
      RETURNING *
    `;
    if (!result.rows[0]) {
      sendJson(res, 404, { ok: false, message: 'Order not found.' });
      return;
    }
    const order = rowToOrder(result.rows[0]);
    await postEmailJs({
      title: 'Team4 Payment Rejected',
      name: `${order.firstName} ${order.lastName}`.trim(),
      email: order.email,
      phone: order.phone,
      program: order.itemTitle,
      message: `თქვენი გადახდა ვერ დადასტურდა. მიზეზი: ${order.rejectReason}`,
      to_email: order.email,
    });
    sendJson(res, 200, { ok: true, order });
    return;
  }

  sendJson(res, 404, { ok: false, message: 'Admin API route not found.' });
};

const handleManualPaymentApi = async (req, res, pathname) => {
  if (pathname === '/api/manual-payment/orders' && req.method === 'POST') {
    await ensureSchema();
    const body = req.body || {};
    const firstName = String(body.firstName || '').trim();
    const lastName = String(body.lastName || '').trim();
    const email = normalizeEmail(body.email);
    const phone = String(body.phone || '').trim();
    if (!firstName || !lastName || !email || !email.includes('@') || !phone) {
      sendJson(res, 400, { ok: false, message: 'Please fill in first name, last name, email, and phone.' });
      return;
    }
    const paymentCode = await generatePaymentCode();
    const id = crypto.randomUUID();
    const result = await sql`
      INSERT INTO manual_orders (
        id, order_number, payment_code, first_name, last_name, email, phone, amount,
        currency, item_id, item_title, item_type, status
      )
      VALUES (
        ${id}, ${paymentCode}, ${paymentCode}, ${firstName}, ${lastName}, ${email}, ${phone}, ${bookPriceGel},
        'GEL', 'i-am-the-answer', 'მე ვარ პასუხი', 'book', 'Pending'
      )
      RETURNING *
    `;
    sendJson(res, 200, {
      ok: true,
      order: rowToOrder(result.rows[0]),
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
    await ensureSchema();
    const orderCode = String(req.body?.orderCode || '').trim();
    const found = await sql`SELECT * FROM manual_orders WHERE payment_code = ${orderCode} OR order_number = ${orderCode} LIMIT 1`;
    if (!found.rows[0]) {
      sendJson(res, 404, { ok: false, message: 'Order not found.' });
      return;
    }
    const receipt = await saveReceipt(found.rows[0], req.body?.receipt);
    const result = await sql`
      UPDATE manual_orders
      SET receipt_url = ${receipt.url}, receipt_name = ${receipt.originalName},
        receipt_mime_type = ${receipt.mimeType}, receipt_size = ${receipt.size}, updated_at = NOW()
      WHERE id = ${found.rows[0].id}
      RETURNING *
    `;
    sendJson(res, 200, { ok: true, order: rowToOrder(result.rows[0]) });
    return;
  }

  if (pathname === '/api/manual-payment/status') {
    await ensureSchema();
    const requestUrl = new URL(req.url, `https://${req.headers.host || 'localhost'}`);
    const email = normalizeEmail(requestUrl.searchParams.get('email'));
    const result = await sql`SELECT * FROM manual_orders WHERE email = ${email} ORDER BY created_at DESC`;
    sendJson(res, 200, { ok: true, orders: result.rows.map(rowToOrder) });
    return;
  }

  sendJson(res, 404, { ok: false, message: 'Manual payment route not found.' });
};

const handleContactApi = async (req, res) => {
  if (req.method !== 'POST') {
    sendJson(res, 405, { ok: false, message: 'Method not allowed.' });
    return;
  }
  const body = req.body || {};
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

const handleEntitlements = async (req, res) => {
  await ensureSchema();
  const requestUrl = new URL(req.url, `https://${req.headers.host || 'localhost'}`);
  const email = normalizeEmail(requestUrl.searchParams.get('email'));
  const result = await sql`
    SELECT * FROM manual_orders
    WHERE email = ${email} AND status = 'Approved'
    ORDER BY approved_at DESC NULLS LAST, updated_at DESC
  `;
  sendJson(res, 200, {
    ok: true,
    items: result.rows.map((row) => ({
      itemId: row.item_id,
      itemTitle: row.item_title,
      itemType: row.item_type,
      status: row.status,
      approvedAt: row.approved_at || row.updated_at || row.created_at,
    })),
  });
};

module.exports = async function handler(req, res) {
  try {
    const requestUrl = new URL(req.url, `https://${req.headers.host || 'localhost'}`);
    const pathname = requestUrl.pathname;
    if (pathname.startsWith('/api/admin/')) {
      await handleAdminApi(req, res, pathname);
      return;
    }
    if (pathname.startsWith('/api/manual-payment/')) {
      await handleManualPaymentApi(req, res, pathname);
      return;
    }
    if (pathname === '/api/contact/send') {
      await handleContactApi(req, res);
      return;
    }
    if (pathname === '/api/library/entitlements') {
      await handleEntitlements(req, res);
      return;
    }
    sendJson(res, 404, { ok: false, message: 'API route not found.' });
  } catch (error) {
    console.error(error);
    sendJson(res, 500, { ok: false, message: error.message || 'Server error.' });
  }
};

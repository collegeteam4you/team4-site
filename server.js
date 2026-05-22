const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const root = __dirname;
const port = Number(process.env.PORT || 4173);
const dataDir = path.join(root, '.data');
const authFile = path.join(dataDir, 'admin-auth.json');
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'TEAM4ADMIN';
const ADMIN_DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || '123456789ns@';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'collegeteam4you@gmail.com';
const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID || 'service_btd5z5f';
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID || 'template_zhupw7t';
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY || 'JYW59QyKlid0i-wU8';
const SESSION_COOKIE = 'team4_admin_session';
const sessions = new Map();
const resetCodes = new Map();
const contactRateLimits = new Map();
const CONTACT_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const CONTACT_RATE_LIMIT_MAX = 5;

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

const securityHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' https://cdn.tailwindcss.com https://unpkg.com https://cdn.jsdelivr.net https://connect.facebook.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://api.emailjs.com https://connect.facebook.net https://www.facebook.com",
    "frame-src https://www.facebook.com https://web.facebook.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    'upgrade-insecure-requests',
  ].join('; '),
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

const send = (res, status, headers, body) => {
  res.writeHead(status, { ...securityHeaders, ...headers });
  res.end(body);
};

const sendJson = (res, status, payload, extraHeaders = {}) => {
  send(res, status, { 'Content-Type': 'application/json; charset=utf-8', ...extraHeaders }, JSON.stringify(payload));
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        req.destroy();
        reject(new Error('Request body too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });

const hashPassword = (password, salt = crypto.randomBytes(16).toString('hex')) => {
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 64, 'sha512').toString('hex');
  return { salt, hash };
};

const isStrongPassword = (password) => typeof password === 'string' && password.length >= 8 && /\d/.test(password) && /[^A-Za-z0-9]/.test(password);

const ensureAuth = () => {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(authFile)) {
    const { salt, hash } = hashPassword(ADMIN_DEFAULT_PASSWORD);
    fs.writeFileSync(authFile, JSON.stringify({ username: ADMIN_USERNAME, salt, hash, updatedAt: new Date().toISOString() }, null, 2));
  }
  return JSON.parse(fs.readFileSync(authFile, 'utf8'));
};

const saveAuthPassword = (password) => {
  const { salt, hash } = hashPassword(password);
  fs.writeFileSync(authFile, JSON.stringify({ username: ADMIN_USERNAME, salt, hash, updatedAt: new Date().toISOString() }, null, 2));
};

const verifyPassword = (password) => {
  const auth = ensureAuth();
  const { hash } = hashPassword(password, auth.salt);
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(auth.hash, 'hex'));
};

const parseCookies = (cookieHeader = '') =>
  cookieHeader.split(';').reduce((cookies, item) => {
    const [key, ...valueParts] = item.trim().split('=');
    if (key) cookies[key] = decodeURIComponent(valueParts.join('='));
    return cookies;
  }, {});

const getSession = (req) => {
  const token = parseCookies(req.headers.cookie || '')[SESSION_COOKIE];
  if (!token) return null;
  const session = sessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    sessions.delete(token);
    return null;
  }
  return { token, ...session };
};

const requireSession = (req, res) => {
  const session = getSession(req);
  if (!session) {
    sendJson(res, 401, { ok: false, message: 'Unauthorized' });
    return null;
  }
  return session;
};

const createSession = (res) => {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, { username: ADMIN_USERNAME, expiresAt: Date.now() + 1000 * 60 * 60 * 8 });
  return `Set-Cookie: ${SESSION_COOKIE}=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=28800`;
};

const clearSessionCookie = `${SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`;

const sendEmailJs = (templateParams) =>
  new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: templateParams,
    });

    const request = https.request(
      {
        hostname: 'api.emailjs.com',
        path: '/api/v1.0/email/send',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      (response) => {
        let data = '';
        response.on('data', (chunk) => {
          data += chunk;
        });
        response.on('end', () => {
          if (response.statusCode >= 200 && response.statusCode < 300) resolve(data);
          else reject(new Error(data || `EmailJS failed with status ${response.statusCode}`));
        });
      }
    );

    request.on('error', reject);
    request.write(payload);
    request.end();
  });

const sendEmailJsMessage = (message) =>
  sendEmailJs({
    title: 'Team4 Admin Password Reset',
    name: 'Team4 Admin',
    email: ADMIN_EMAIL,
    phone: '',
    program: 'Admin password reset',
    message,
    to_email: ADMIN_EMAIL,
  });

const getClientIp = (req) => {
  const forwardedFor = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return forwardedFor || req.socket.remoteAddress || 'unknown';
};

const checkRateLimit = (key, limitMap, max, windowMs) => {
  const now = Date.now();
  const current = limitMap.get(key);
  if (!current || current.resetAt <= now) {
    limitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (current.count >= max) {
    return { allowed: false, retryAfter: Math.ceil((current.resetAt - now) / 1000) };
  }

  current.count += 1;
  limitMap.set(key, current);
  return { allowed: true };
};

const handleAdminApi = async (req, res, cleanUrl) => {
  try {
    if (req.method === 'GET' && cleanUrl === '/api/admin/session') {
      const session = getSession(req);
      sendJson(res, 200, { ok: true, authenticated: Boolean(session), username: session?.username || null });
      return true;
    }

    if (req.method === 'POST' && cleanUrl === '/api/admin/login') {
      const body = await readBody(req);
      if (body.username === ADMIN_USERNAME && verifyPassword(String(body.password || ''))) {
        sendJson(res, 200, { ok: true, username: ADMIN_USERNAME }, { 'Set-Cookie': createSession(res).replace(/^Set-Cookie: /, '') });
        return true;
      }
      sendJson(res, 401, { ok: false, message: 'Invalid username or password.' });
      return true;
    }

    if (req.method === 'POST' && cleanUrl === '/api/admin/logout') {
      const session = getSession(req);
      if (session) sessions.delete(session.token);
      sendJson(res, 200, { ok: true }, { 'Set-Cookie': clearSessionCookie });
      return true;
    }

    if (req.method === 'POST' && cleanUrl === '/api/admin/change-password') {
      if (!requireSession(req, res)) return true;
      const body = await readBody(req);
      if (!verifyPassword(String(body.currentPassword || ''))) {
        sendJson(res, 400, { ok: false, message: 'Current password is incorrect.' });
        return true;
      }
      if (!isStrongPassword(String(body.newPassword || ''))) {
        sendJson(res, 400, { ok: false, message: 'Password must be at least 8 characters and include a number and special symbol.' });
        return true;
      }
      saveAuthPassword(String(body.newPassword));
      sessions.clear();
      sendJson(res, 200, { ok: true, message: 'Password changed successfully.' }, { 'Set-Cookie': clearSessionCookie });
      return true;
    }

    if (req.method === 'POST' && cleanUrl === '/api/admin/request-reset') {
      const code = String(Math.floor(100000 + Math.random() * 900000));
      const codeHash = crypto.createHash('sha256').update(code).digest('hex');
      resetCodes.set(ADMIN_EMAIL, { codeHash, expiresAt: Date.now() + 1000 * 60 * 10 });
      await sendEmailJsMessage(`Your Team4 admin verification code is: ${code}`);
      sendJson(res, 200, { ok: true, message: `Verification code sent to ${ADMIN_EMAIL}.` });
      return true;
    }

    if (req.method === 'POST' && cleanUrl === '/api/admin/reset-password') {
      const body = await readBody(req);
      const saved = resetCodes.get(ADMIN_EMAIL);
      if (!saved || saved.expiresAt < Date.now()) {
        resetCodes.delete(ADMIN_EMAIL);
        sendJson(res, 400, { ok: false, message: 'Verification code expired. Send a new code.' });
        return true;
      }
      const codeHash = crypto.createHash('sha256').update(String(body.code || '').trim()).digest('hex');
      if (codeHash !== saved.codeHash) {
        sendJson(res, 400, { ok: false, message: 'Verification code is incorrect.' });
        return true;
      }
      if (!isStrongPassword(String(body.newPassword || ''))) {
        sendJson(res, 400, { ok: false, message: 'Password must be at least 8 characters and include a number and special symbol.' });
        return true;
      }
      saveAuthPassword(String(body.newPassword));
      resetCodes.delete(ADMIN_EMAIL);
      sessions.clear();
      sendJson(res, 200, { ok: true, message: 'Password changed. You can log in now.' }, { 'Set-Cookie': clearSessionCookie });
      return true;
    }

    return false;
  } catch (error) {
    sendJson(res, 500, { ok: false, message: error.message || 'Server error' });
    return true;
  }
};

ensureAuth();

const handleContactApi = async (req, res, cleanUrl) => {
  if (req.method !== 'POST' || cleanUrl !== '/api/contact/send') return false;

  try {
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(ip, contactRateLimits, CONTACT_RATE_LIMIT_MAX, CONTACT_RATE_LIMIT_WINDOW_MS);
    if (!rateLimit.allowed) {
      sendJson(
        res,
        429,
        {
          ok: false,
          message: `Too many messages. Please try again in ${rateLimit.retryAfter} seconds.`,
        },
        { 'Retry-After': String(rateLimit.retryAfter) }
      );
      return true;
    }

    const body = await readBody(req);
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim();
    const phone = String(body.phone || '').trim();
    const program = String(body.program || '').trim();
    const message = String(body.message || '').trim();

    if (!name || !email || !phone || !program || !message) {
      sendJson(res, 400, { ok: false, message: 'All fields are required.' });
      return true;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      sendJson(res, 400, { ok: false, message: 'Invalid email address.' });
      return true;
    }

    await sendEmailJs({
      title: 'Team4 Website Contact',
      name,
      email,
      phone,
      program,
      message,
      to_email: ADMIN_EMAIL,
    });

    sendJson(res, 200, { ok: true, message: 'Message sent successfully.' });
    return true;
  } catch (error) {
    sendJson(res, 500, { ok: false, message: error.message || 'Message could not be sent.' });
    return true;
  }
};

const server = http.createServer(async (req, res) => {
  const cleanUrl = decodeURIComponent(req.url.split('?')[0]);
  if (cleanUrl.startsWith('/api/admin/')) {
    const handled = await handleAdminApi(req, res, cleanUrl);
    if (handled) return;
  }
  if (cleanUrl.startsWith('/api/contact/')) {
    const handled = await handleContactApi(req, res, cleanUrl);
    if (handled) return;
  }

  const routes = {
    '/terms': '/terms.html',
    '/terms/': '/terms.html',
    '/privacy': '/privacy.html',
    '/privacy/': '/privacy.html',
    '/refund': '/refund.html',
    '/refund/': '/refund.html',
    '/admin': '/admin.html',
    '/admin/': '/admin.html',
  };
  const requested = cleanUrl === '/' || cleanUrl.startsWith('/program/') ? '/index.html' : routes[cleanUrl] || cleanUrl;
  const filePath = path.normalize(path.join(root, requested));

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      send(res, 404, {}, 'Not found');
      return;
    }

    const ext = path.extname(filePath);
    const noCacheHeaders = ['.html', '.js', '.css'].includes(ext)
      ? {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        }
      : {};
    send(res, 200, { 'Content-Type': types[ext] || 'application/octet-stream', ...noCacheHeaders }, data);
  });
});

server.listen(port, () => {
  console.log(`Team4 site running at http://localhost:${port}`);
});

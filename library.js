(function () {
  const STORAGE_KEYS = {
    user: 'team4LibraryUser',
    devices: 'team4LibraryDevices',
  };

  const bookContent = window.Team4BookContent || {};

  const catalog = [
    {
      id: 'i-am-the-answer',
      type: 'book',
      title: bookContent.title || 'მე ვარ პასუხი',
      titleEng: 'I Am The Answer',
      description: bookContent.description || 'დაცული ონლაინ წიგნი Team4-ის მყიდველებისთვის.',
      cover: bookContent.cover || '/assets/book-gallery-01.webp',
      price: 14.9,
      blocks: bookContent.blocks || [],
      body: '',
    },
  ];

  const readJson = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  };

  const writeJson = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const normalizeEmail = (value) => String(value || '').trim().toLowerCase();

  const getDeviceId = () => {
    let id = localStorage.getItem('team4DeviceId');
    if (!id) {
      id = `device-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      localStorage.setItem('team4DeviceId', id);
    }
    return id;
  };

  const registerDevice = (email) => {
    const normalizedEmail = normalizeEmail(email);
    const deviceId = getDeviceId();
    const devices = readJson(STORAGE_KEYS.devices, {});
    const userDevices = Array.isArray(devices[normalizedEmail]) ? devices[normalizedEmail] : [];

    if (!userDevices.includes(deviceId) && userDevices.length >= 2) {
      return { ok: false, message: 'ერთ მომხმარებელს მაქსიმუმ 2 მოწყობილობაზე შეუძლია შესვლა.' };
    }

    if (!userDevices.includes(deviceId)) {
      userDevices.push(deviceId);
      devices[normalizedEmail] = userDevices;
      writeJson(STORAGE_KEYS.devices, devices);
    }

    return { ok: true, deviceId, count: userDevices.length };
  };

  const getUser = () => readJson(STORAGE_KEYS.user, null);

  const login = ({ firstName, lastName, name, email, phone }) => {
    const normalizedEmail = normalizeEmail(email);
    const cleanFirstName = String(firstName || name || '').trim();
    const cleanLastName = String(lastName || '').trim();
    const cleanName = `${cleanFirstName} ${cleanLastName}`.trim() || normalizedEmail;

    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      return { ok: false, message: 'შეიყვანე სწორი ელფოსტა.' };
    }

    const deviceResult = registerDevice(normalizedEmail);
    if (!deviceResult.ok) return deviceResult;

    const user = {
      firstName: cleanFirstName,
      lastName: cleanLastName,
      name: cleanName,
      email: normalizedEmail,
      phone: String(phone || '').trim(),
    };
    writeJson(STORAGE_KEYS.user, user);
    return { ok: true, user };
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.user);
  };

  const requestJson = async (path, options = {}) => {
    const response = await fetch(path, {
      credentials: 'same-origin',
      headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
      ...options,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.ok === false) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }
    return data;
  };

  const createManualOrder = async (payload) =>
    requestJson('/api/manual-payment/orders', {
      method: 'POST',
      body: payload,
    });

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('ქვითრის ფაილი ვერ ჩაიტვირთა.'));
      reader.readAsDataURL(file);
    });

  const uploadReceipt = async (orderCode, file) => {
    if (!file) throw new Error('აირჩიე ქვითრის ფაილი.');
    const dataUrl = await fileToDataUrl(file);
    return requestJson('/api/manual-payment/receipt', {
      method: 'POST',
      body: {
        orderCode,
        receipt: {
          name: file.name,
          dataUrl,
        },
      },
    });
  };

  const fetchUserOrders = async (email = getUser()?.email) => {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) return { ok: true, orders: [] };
    return requestJson(`/api/manual-payment/status?email=${encodeURIComponent(normalizedEmail)}`);
  };

  const fetchEntitlements = async (email = getUser()?.email) => {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) return { ok: true, items: [] };
    return requestJson(`/api/library/entitlements?email=${encodeURIComponent(normalizedEmail)}`);
  };

  const progressKey = (email, itemId) => `team4ReaderProgress:${normalizeEmail(email)}:${itemId}`;

  const getProgress = (email, itemId) => readJson(progressKey(email, itemId), { percent: 0, scrollY: 0 });

  const setProgress = (email, itemId, value) => writeJson(progressKey(email, itemId), value);

  const hasAccessFromEntitlements = (itemId, entitlements = []) =>
    entitlements.some((entry) => entry.itemId === itemId && entry.status === 'Approved');

  window.Team4Library = {
    catalog,
    getUser,
    login,
    logout,
    createManualOrder,
    uploadReceipt,
    fetchUserOrders,
    fetchEntitlements,
    getProgress,
    setProgress,
    hasAccessFromEntitlements,
    lockedMessage: 'ეს მასალა ხელმისაწვდომია მხოლოდ ავტორიზებული და დადასტურებული მყიდველებისთვის.',
  };
})();

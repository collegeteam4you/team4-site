(function () {
  const STORAGE_KEYS = {
    user: 'team4LibraryUser',
    devices: 'team4LibraryDevices',
  };

  const bookContent = window.Team4BookContent || {};

  const urlParams = new URLSearchParams(window.location.search);
  const activeOffer = urlParams.get('offer');
  const hasCoachOffer = activeOffer === 'coach10';

  const catalog = [
    {
      id: 'i-am-the-answer',
      type: 'book',
      title: 'მე ვარ პასუხი',
      titleEng: 'I Am The Answer',
      description: 'დაცული ონლაინ წიგნი Team4-ის მყიდველებისთვის.',
      cover: '/assets/book-gallery-01.webp',
      price: 14.9,
      blocks: window.Team4BookContent?.blocks || [],
      body: '',
    },

    {
      id: 'why-others-get-rich',
      type: 'book',
      title:
        window.Team4WhyOthersGetRichContent?.title ||
        'რატომ მდიდრდებიან სხვები',
      titleEng: 'Why Others Get Rich',
      description:
        window.Team4WhyOthersGetRichContent?.description ||
        'დაცული ონლაინ წიგნი Team4-ის მყიდველებისთვის.',
      cover:
        window.Team4WhyOthersGetRichContent?.cover ||
        '/assets/ყდა.jpg',

      price: hasCoachOffer ? 10 : 14.9,
      originalPrice: hasCoachOffer ? 14.9 : null,
      offerCode: hasCoachOffer ? 'coach10' : null,
      offerLabel: hasCoachOffer
        ? 'Team4 Coach-ის სპეციალური ფასი'
        : null,

      blocks:
        window.Team4WhyOthersGetRichContent?.blocks || [],
      body:
        window.Team4WhyOthersGetRichContent?.body || '',
    },

    {
      id: 'book-bundle',
      type: 'bundle',
      title: ' ორივე წიგნი ერთად',
      titleEng: 'Both Books Bundle',
      description: 'მე ვარ პასუხი + რატომ მდიდრდებიან სხვები',
      cover: '/assets/bundle.jpg',
      price: 24.9,
      itemIds: ['i-am-the-answer', 'why-others-get-rich'],
      blocks: [],
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

  const normalizeEmail = (value) =>
    String(value || '').trim().toLowerCase();

  const getDeviceId = () => {
    let id = localStorage.getItem('team4DeviceId');

    if (!id) {
      id = `device-${Date.now()}-${Math.random()
        .toString(16)
        .slice(2)}`;

      localStorage.setItem('team4DeviceId', id);
    }

    return id;
  };

  const registerDevice = (email) => {
    const normalizedEmail = normalizeEmail(email);
    const deviceId = getDeviceId();
    const devices = readJson(STORAGE_KEYS.devices, {});

    const userDevices = Array.isArray(devices[normalizedEmail])
      ? devices[normalizedEmail]
      : [];

    if (
      !userDevices.includes(deviceId) &&
      userDevices.length >= 2
    ) {
      return {
        ok: false,
        message:
          'ერთ მომხმარებელს მაქსიმუმ 2 მოწყობილობაზე შეუძლია შესვლა.',
      };
    }

    if (!userDevices.includes(deviceId)) {
      userDevices.push(deviceId);
      devices[normalizedEmail] = userDevices;
      writeJson(STORAGE_KEYS.devices, devices);
    }

    return {
      ok: true,
      deviceId,
      count: userDevices.length,
    };
  };

  const getUser = () =>
    readJson(STORAGE_KEYS.user, null);

  const login = ({
    firstName,
    lastName,
    name,
    email,
    phone,
  }) => {
    const normalizedEmail = normalizeEmail(email);
    const cleanFirstName = String(
      firstName || name || ''
    ).trim();

    const cleanLastName = String(
      lastName || ''
    ).trim();

    const cleanName =
      `${cleanFirstName} ${cleanLastName}`.trim() ||
      normalizedEmail;

    if (
      !normalizedEmail ||
      !normalizedEmail.includes('@')
    ) {
      return {
        ok: false,
        message: 'შეიყვანე სწორი ელფოსტა.',
      };
    }

    const deviceResult =
      registerDevice(normalizedEmail);

    if (!deviceResult.ok) {
      return deviceResult;
    }

    const user = {
      firstName: cleanFirstName,
      lastName: cleanLastName,
      name: cleanName,
      email: normalizedEmail,
      phone: String(phone || '').trim(),
    };

    writeJson(STORAGE_KEYS.user, user);

    return {
      ok: true,
      user,
    };
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.user);
  };

  const requestJson = async (
    path,
    options = {}
  ) => {
    const response = await fetch(path, {
      credentials: 'same-origin',
      headers: options.body
        ? {
            'Content-Type': 'application/json',
          }
        : undefined,
      ...options,
      body: options.body
        ? JSON.stringify(options.body)
        : undefined,
    });

    const data = await response
      .json()
      .catch(() => ({}));

    if (
      !response.ok ||
      data.ok === false
    ) {
      throw new Error(
        data.message ||
          `Request failed with status ${response.status}`
      );
    }

    return data;
  };

  const createManualOrder = async (
    payload
  ) =>
    requestJson(
      '/api/manual-payment/orders',
      {
        method: 'POST',
        body: payload,
      }
    );

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () =>
        resolve(reader.result);

      reader.onerror = () =>
        reject(
          new Error(
            'ქვითრის ფაილი ვერ ჩაიტვირთა.'
          )
        );

      reader.readAsDataURL(file);
    });

  const uploadReceipt = async (
    orderCode,
    file
  ) => {
    if (!file) {
      throw new Error(
        'აირჩიე ქვითრის ფაილი.'
      );
    }

    const dataUrl =
      await fileToDataUrl(file);

    return requestJson(
      '/api/manual-payment/receipt',
      {
        method: 'POST',
        body: {
          orderCode,
          receipt: {
            name: file.name,
            dataUrl,
          },
        },
      }
    );
  };

  const fetchUserOrders = async (
    email = getUser()?.email
  ) => {
    const normalizedEmail =
      normalizeEmail(email);

    if (!normalizedEmail) {
      return {
        ok: true,
        orders: [],
      };
    }

    return requestJson(
      `/api/manual-payment/status?email=${encodeURIComponent(
        normalizedEmail
      )}`
    );
  };

  const fetchEntitlements = async (
    email = getUser()?.email
  ) => {
    const normalizedEmail =
      normalizeEmail(email);

    if (!normalizedEmail) {
      return {
        ok: true,
        items: [],
      };
    }

    return requestJson(
      `/api/library/entitlements?email=${encodeURIComponent(
        normalizedEmail
      )}`
    );
  };

  const progressKey = (
    email,
    itemId
  ) =>
    `team4ReaderProgress:${normalizeEmail(
      email
    )}:${itemId}`;

  const getProgress = (
    email,
    itemId
  ) =>
    readJson(
      progressKey(email, itemId),
      {
        percent: 0,
        scrollY: 0,
      }
    );

  const setProgress = (
    email,
    itemId,
    value
  ) =>
    writeJson(
      progressKey(email, itemId),
      value
    );

  const hasAccessFromEntitlements = (
    itemId,
    entitlements = []
  ) =>
    entitlements.some(
      (entry) =>
        entry.itemId === itemId &&
        entry.status === 'Approved'
    );

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

    activeOffer,
    hasCoachOffer,

    lockedMessage:
      'ეს მასალა ხელმისაწვდომია მხოლოდ ავტორიზებული და დადასტურებული მყიდველებისთვის.',
  };
})();

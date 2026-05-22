const ADMIN_CONTENT_KEY = 'team4AdminContent';
const TESTIMONIALS_KEY = 'team4Testimonials';
const ADMIN_DEFAULT_USERNAME = 'TEAM4ADMIN';
const ADMIN_EMAIL = 'collegeteam4you@gmail.com';

const defaultContent = {
  navItems: [
    ['about', 'WHY TEAM4', 'რატომ თიმ ფორი'],
    ['book', 'I Am The Answer', '„მე ვარ პასუხი“'],
    ['programs', 'PROGRAMS', 'პროგრამები'],
    ['winspace', 'WinSpace', 'ვინსფეისი'],
    ['testimonials', 'Testimonials', 'შეფასებები'],
  ],
  copy: {
    ENG: {
      heroKicker: 'LASHA KHURTSIDZE / TEAM4 SALES COLLEGE',
      heroSubtitle: 'Sales • Negotiation • NLP • Digital Marketing',
      aboutTitle: 'Team4',
      contactMe: 'SEND',
    },
    GEO: {
      heroKicker: 'ლაშა ხურციძე / თიმ ფორი გაყიდვების კოლეჯი',
      heroSubtitle: 'გაყიდვები • მოლაპარაკება • NLP • ციფრული მარკეტინგი',
      aboutTitle: 'თიმ ფორი',
      contactMe: 'გაგზავნა',
    },
  },
  contactInfo: {
    phone: '+995 577 208 606',
    email: 'collegeteam4you@gmail.com',
  },
  socialLinks: [
    ['Facebook', '@team4', 'https://www.facebook.com/profile.php?id=61571797572892', 'facebook'],
    ['TikTok', 'collegeteam4you', 'https://www.tiktok.com/@collegeteam4you?lang=en', 'tiktok'],
    ['Instagram', '__team.4', 'https://www.instagram.com/__team.4/', 'instagram'],
    ['LinkedIn', 'Team4 - თიმ ფორი', 'https://www.linkedin.com/company/117234753/admin/dashboard/', 'linkedin'],
  ],
  footerLinks: [
    { GEO: 'მომსახურების პირობები', ENG: 'Terms of Service', href: '/terms' },
    { GEO: 'კონფიდენციალურობა', ENG: 'Privacy Policy', href: '/privacy' },
    { GEO: 'თანხის დაბრუნება', ENG: 'Refund Policy', href: '/refund' },
  ],
  heroCardTitles: {
    ENG: ['Professional Sales Manager', 'Coach', 'Sales Strategist'],
    GEO: ['პროფესიონალი გაყიდვების მენეჯერი', 'ქოუჩი', 'გაყიდვების სტრატეგი'],
  },
  bookGalleryImages: [
    './assets/book-gallery-01.webp',
    './assets/book-gallery-02.webp',
    './assets/book-gallery-03.webp',
    './assets/book-gallery-04.webp',
    './assets/book-gallery-05.webp',
  ],
  buttonLinks: {
    winspace: 'https://www.youtube.com/@janamagalashvili',
    commercialProjects: 'https://www.youtube.com/watch?v=hajmhs-cEq0&list=PLvcv-qMu_USis3A_DL5-aoGZgDDr9gCJk',
    whatsapp: 'https://wa.me/995577208606',
  },
  assetUrls: {
    team4Logo: './assets/team4-logo-hero.webp',
    heroImage: './assets/lasha-hero-personal.webp',
    winspaceLogo: './assets/winspace-logo.webp',
  },
  programs: [],
};

const defaultTestimonials = [
  {
    id: 'default-1',
    name: 'Nino G.',
    quoteGeo: '“Team4-მა შეცვალა ის, როგორ ვესაუბრებით კლიენტებს.”',
    quoteEng: '"Team4 changed the way our team speaks with clients."',
    roleGeo: 'ბიზნესის მფლობელი',
    roleEng: 'Business Owner',
  },
  {
    id: 'default-2',
    name: 'Irakli M.',
    quoteGeo: '“მოლაპარაკების ტრენინგმა ერთი კონტრაქტით ამოიღო საკუთარი ღირებულება.”',
    quoteEng: '"The negotiation training paid for itself in one contract."',
    roleGeo: 'კომერციული მენეჯერი',
    roleEng: 'Commercial Manager',
  },
  {
    id: 'default-3',
    name: 'Mariam K.',
    quoteGeo: '“ლაშას მოაქვს სიცხადე, ენერგია და რეალური სისტემა.”',
    quoteEng: '"Lasha brings clarity, energy, and a real system."',
    roleGeo: 'გაყიდვების ლიდი',
    roleEng: 'Sales Lead',
  },
];

const root = document.getElementById('admin-root');

const passwordMessage = 'Password must be at least 8 characters and include a number and special symbol.';

const isStrongPassword = (password) => password.length >= 8 && /\d/.test(password) && /[^A-Za-z0-9]/.test(password);

const showStatus = (node, message, isError = false) => {
  node.textContent = message;
  node.classList.toggle('admin-error', isError);
  node.style.display = 'block';
};

const apiRequest = async (path, body) => {
  const response = await fetch(path, {
    method: body ? 'POST' : 'GET',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    credentials: 'same-origin',
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok === false) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }
  return data;
};

const checkSession = async () => {
  const data = await apiRequest('/api/admin/session');
  return Boolean(data.authenticated);
};

const loadContent = () => {
  try {
    return JSON.parse(localStorage.getItem(ADMIN_CONTENT_KEY)) || defaultContent;
  } catch {
    return defaultContent;
  }
};

const saveContent = (content) => {
  localStorage.setItem(ADMIN_CONTENT_KEY, JSON.stringify(content));
};

const pretty = (value) => JSON.stringify(value, null, 2);

const normalizeTestimonial = (item, index = 0) => {
  if (!item || typeof item !== 'object') return null;
  const name = String(item.name || '').trim();
  const quoteGeo = String(item.quoteGeo || item.quote || '').trim();
  const quoteEng = String(item.quoteEng || item.quote || quoteGeo).trim();
  const roleGeo = String(item.roleGeo || item.role || '').trim();
  const roleEng = String(item.roleEng || item.role || roleGeo).trim();
  if (!name || !quoteGeo || !quoteEng) return null;
  return {
    id: String(item.id || `comment-${Date.now()}-${index}`),
    name,
    quoteGeo,
    quoteEng,
    roleGeo,
    roleEng,
  };
};

const loadTestimonials = () => {
  try {
    const raw = localStorage.getItem(TESTIMONIALS_KEY);
    if (raw === null) return defaultTestimonials;
    const value = JSON.parse(raw);
    const normalized = Array.isArray(value) ? value.map(normalizeTestimonial).filter(Boolean) : [];
    return normalized;
  } catch {
    return defaultTestimonials;
  }
};

const saveTestimonials = (items) => {
  localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(items));
};

const el = (tag, attrs = {}, children = []) => {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'className') node.className = value;
    else if (key === 'text') node.textContent = value;
    else if (key.startsWith('on')) node.addEventListener(key.slice(2).toLowerCase(), value);
    else node.setAttribute(key, value);
  });
  children.forEach((child) => node.append(child));
  return node;
};

const renderForgotPassword = () => {
  root.innerHTML = '';
  const status = el('p', { className: 'admin-status', text: '' });
  status.style.display = 'none';

  const codeInput = el('input', { className: 'admin-input', placeholder: '6-digit verification code', inputmode: 'numeric', maxlength: '6' });
  const newPassword = el('input', { className: 'admin-input', placeholder: 'New password', type: 'password', autocomplete: 'new-password' });
  const confirmPassword = el('input', { className: 'admin-input', placeholder: 'Confirm new password', type: 'password', autocomplete: 'new-password' });
  const sendCodeButton = el('button', { className: 'admin-btn admin-btn-dark', type: 'button', text: 'Send Code' });
  const resetButton = el('button', { className: 'admin-btn admin-btn-red', type: 'submit', text: 'Reset Password' });

  sendCodeButton.addEventListener('click', async () => {
    try {
      sendCodeButton.disabled = true;
      sendCodeButton.textContent = 'Sending...';
      const result = await apiRequest('/api/admin/request-reset', {});
      showStatus(status, result.message || `Verification code sent to ${ADMIN_EMAIL}.`);
    } catch (error) {
      console.error('Admin reset EmailJS error:', error);
      showStatus(status, `Could not send reset code: ${error?.text || error?.message || 'EmailJS failed.'}`, true);
    } finally {
      sendCodeButton.disabled = false;
      sendCodeButton.textContent = 'Send Code';
    }
  });

  const form = el('form', { className: 'admin-form' }, [
    el('p', { className: 'admin-kicker', text: 'Team4 Admin' }),
    el('h1', { className: 'admin-title', text: 'Forgot Password' }),
    el('p', { className: 'admin-muted', text: `A 6-digit verification code will be sent to ${ADMIN_EMAIL}.` }),
    sendCodeButton,
    codeInput,
    newPassword,
    confirmPassword,
    resetButton,
    el('button', { className: 'admin-btn admin-btn-dark', type: 'button', text: 'Back To Login', onClick: renderLogin }),
    status,
  ]);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      if (!isStrongPassword(newPassword.value)) {
        showStatus(status, passwordMessage, true);
        return;
      }
      if (newPassword.value !== confirmPassword.value) {
        showStatus(status, 'Passwords do not match.', true);
        return;
      }
      const result = await apiRequest('/api/admin/reset-password', {
        code: codeInput.value.trim(),
        newPassword: newPassword.value,
      });
      showStatus(status, result.message || 'Password changed. You can log in now.');
      setTimeout(renderLogin, 900);
    } catch (error) {
      showStatus(status, `Could not reset password: ${error.message}`, true);
    }
  });

  root.append(el('div', { className: 'admin-login' }, [el('section', { className: 'admin-card admin-login-card' }, [form])]));
};

const renderLogin = () => {
  root.innerHTML = '';
  const status = el('p', { className: 'admin-status admin-error', text: '' });
  status.style.display = 'none';

  const username = el('input', { className: 'admin-input', placeholder: 'Username', autocomplete: 'username' });
  username.value = ADMIN_DEFAULT_USERNAME;
  const password = el('input', { className: 'admin-input', placeholder: 'Password', type: 'password', autocomplete: 'current-password' });
  const form = el('form', { className: 'admin-form' }, [
    el('p', { className: 'admin-kicker', text: 'Team4 Admin' }),
    el('h1', { className: 'admin-title', text: 'Login' }),
    el('p', { className: 'admin-muted', text: 'Edit website content locally before deployment.' }),
    username,
    password,
    el('button', { className: 'admin-btn admin-btn-red', type: 'submit', text: 'Login' }),
    el('button', { className: 'admin-btn admin-btn-dark', type: 'button', text: 'Forgot Password', onClick: renderForgotPassword }),
    status,
  ]);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      await apiRequest('/api/admin/login', {
        username: username.value.trim(),
        password: password.value,
      });
      renderDashboard();
      return;
    } catch (error) {
      status.textContent = error.message || 'Invalid username or password.';
      status.style.display = 'block';
    }
  });

  root.append(el('div', { className: 'admin-login' }, [el('section', { className: 'admin-card admin-login-card' }, [form])]));
};

const jsonField = (label, key, value) => {
  const textarea = el('textarea', { className: 'admin-textarea', id: key });
  textarea.value = pretty(value);
  return el('label', { className: 'admin-label' }, [document.createTextNode(label), textarea]);
};

const collapsibleJsonField = (field) => {
  const label = field.firstChild?.textContent || 'Editable Section';
  return el('details', { className: 'admin-card admin-section admin-details' }, [
    el('summary', { className: 'admin-details-summary' }, [
      el('span', { text: label }),
      el('small', { text: 'Open / edit / save JSON' }),
    ]),
    field,
  ]);
};

const renderTestimonialsManager = () => {
  const wrap = el('details', { className: 'admin-card admin-section admin-details admin-comments-section', open: 'open' });
  const status = el('p', { className: 'admin-status', text: '' });
  status.style.display = 'none';
  const list = el('div', { className: 'admin-comments-list' });
  let editingId = null;

  const nameInput = el('input', { className: 'admin-input', placeholder: 'Name' });
  const roleGeoInput = el('input', { className: 'admin-input', placeholder: 'Position / Company GEO' });
  const roleEngInput = el('input', { className: 'admin-input', placeholder: 'Position / Company ENG' });
  const quoteGeoInput = el('textarea', { className: 'admin-textarea admin-textarea-small', placeholder: 'Comment GEO' });
  const quoteEngInput = el('textarea', { className: 'admin-textarea admin-textarea-small', placeholder: 'Comment ENG' });

  const showMessage = (message, isError = false) => {
    showStatus(status, message, isError);
  };

  const clearForm = () => {
    editingId = null;
    nameInput.value = '';
    roleGeoInput.value = '';
    roleEngInput.value = '';
    quoteGeoInput.value = '';
    quoteEngInput.value = '';
  };

  const fillForm = (item) => {
    editingId = item.id;
    nameInput.value = item.name || '';
    roleGeoInput.value = item.roleGeo || '';
    roleEngInput.value = item.roleEng || '';
    quoteGeoInput.value = item.quoteGeo || '';
    quoteEngInput.value = item.quoteEng || '';
    nameInput.focus();
  };

  const draw = () => {
    const items = loadTestimonials();
    list.innerHTML = '';
    if (!items.length) {
      list.append(el('p', { className: 'admin-muted', text: 'No visitor comments saved yet.' }));
      return;
    }

    items.forEach((item, index) => {
      const editButton = el('button', {
        className: 'admin-btn admin-btn-dark admin-btn-small',
        type: 'button',
        text: 'Edit',
      });
      editButton.addEventListener('click', () => {
        fillForm(item);
        showMessage(`Editing comment ${index + 1}. Save when ready.`);
      });

      const deleteButton = el('button', {
        className: 'admin-btn admin-btn-danger admin-btn-small',
        type: 'button',
        text: 'Delete',
      });
      deleteButton.addEventListener('click', () => {
        if (!window.confirm(`Delete comment from ${item.name || 'this visitor'}?`)) return;
        const nextItems = loadTestimonials().filter((current) => current.id !== item.id);
        saveTestimonials(nextItems);
        draw();
        showMessage('Comment deleted. Refresh the website preview to see changes.');
      });

      list.append(
        el('article', { className: 'admin-comment-item' }, [
          el('div', { className: 'admin-comment-copy' }, [
            el('strong', { text: `${index + 1}. ${item.name || 'Unnamed'}` }),
            el('span', { text: `${item.roleGeo || 'No GEO role'} / ${item.roleEng || 'No ENG role'}` }),
            el('p', { text: item.quoteGeo || 'No GEO comment text' }),
            el('p', { text: item.quoteEng || 'No ENG comment text' }),
          ]),
          el('div', { className: 'admin-comment-actions' }, [
            editButton,
            deleteButton,
          ]),
        ])
      );
    });
  };

  const saveCommentButton = el('button', { className: 'admin-btn admin-btn-red', type: 'button', text: 'Save Comment' });
  saveCommentButton.addEventListener('click', () => {
    const nextItem = normalizeTestimonial({
      id: editingId || `admin-${Date.now()}`,
      name: nameInput.value,
      roleGeo: roleGeoInput.value,
      roleEng: roleEngInput.value,
      quoteGeo: quoteGeoInput.value,
      quoteEng: quoteEngInput.value,
    });
    if (!nextItem) {
      showMessage('Name, GEO comment and ENG comment are required.', true);
      return;
    }
    const items = loadTestimonials();
    const nextItems = editingId
      ? items.map((item) => (item.id === editingId ? nextItem : item))
      : [nextItem, ...items];
    saveTestimonials(nextItems);
    clearForm();
    draw();
    showMessage('Comment saved. Refresh the website preview to see changes.');
  });

  const newButton = el('button', { className: 'admin-btn admin-btn-dark', type: 'button', text: 'New Comment' });
  newButton.addEventListener('click', () => {
    clearForm();
    showMessage('Ready to add a new comment.');
  });

  const refreshButton = el('button', { className: 'admin-btn admin-btn-dark', type: 'button', text: 'Refresh Comments' });
  refreshButton.addEventListener('click', () => {
    draw();
    showMessage('Comment list refreshed.');
  });

  const deleteAllButton = el('button', { className: 'admin-btn admin-btn-danger', type: 'button', text: 'Delete All Comments' });
  deleteAllButton.addEventListener('click', () => {
    if (!window.confirm('Delete all visitor comments?')) return;
    saveTestimonials([]);
    draw();
    showMessage('All visitor comments deleted. Refresh the website preview to see changes.');
  });

  const resetDefaultsButton = el('button', { className: 'admin-btn admin-btn-dark', type: 'button', text: 'Restore Default Comments' });
  resetDefaultsButton.addEventListener('click', () => {
    if (!window.confirm('Restore the original default comments? Current custom comments will be replaced.')) return;
    saveTestimonials(defaultTestimonials);
    clearForm();
    draw();
    showMessage('Default comments restored.');
  });

  wrap.append(
    el('summary', { className: 'admin-details-summary' }, [
      el('span', { text: 'Comments / Testimonials Manager' }),
      el('small', { text: 'Add, edit, delete, restore' }),
    ]),
    el('p', { className: 'admin-muted', text: 'Manage every public testimonial/comment here. GEO and ENG fields are saved separately, and the public site can display 100+ comments.' }),
    el('div', { className: 'admin-comment-editor' }, [
      nameInput,
      el('div', { className: 'admin-two' }, [roleGeoInput, roleEngInput]),
      el('div', { className: 'admin-two' }, [quoteGeoInput, quoteEngInput]),
      el('div', { className: 'admin-button-row' }, [saveCommentButton, newButton]),
    ]),
    el('div', { className: 'admin-button-row' }, [refreshButton, resetDefaultsButton, deleteAllButton]),
    status,
    list
  );
  draw();
  return wrap;
};

const renderDashboard = () => {
  root.innerHTML = '';
  const content = loadContent();
  const status = el('p', { className: 'admin-status', text: '' });
  status.style.display = 'none';
  const passwordStatus = el('p', { className: 'admin-status', text: '' });
  passwordStatus.style.display = 'none';

  const currentPassword = el('input', { className: 'admin-input', placeholder: 'Current password', type: 'password', autocomplete: 'current-password' });
  const newPassword = el('input', { className: 'admin-input', placeholder: 'New password', type: 'password', autocomplete: 'new-password' });
  const confirmPassword = el('input', { className: 'admin-input', placeholder: 'Confirm new password', type: 'password', autocomplete: 'new-password' });

  const fields = [
    jsonField('Header menu GEO/ENG', 'navItems', content.navItems || []),
    jsonField('Hero, About, Footer, Buttons GEO/ENG Copy', 'copy', content.copy || {}),
    jsonField('Programs / Service Cards / Syllabuses / Images', 'programs', content.programs || []),
    jsonField('Contact Info', 'contactInfo', content.contactInfo || {}),
    jsonField('Social Links', 'socialLinks', content.socialLinks || []),
    jsonField('Footer Policy Links', 'footerLinks', content.footerLinks || []),
    jsonField('Button Links / CTA URLs / WhatsApp Number', 'buttonLinks', content.buttonLinks || {}),
    jsonField('Images / Logo URLs', 'assetUrls', content.assetUrls || {}),
    jsonField('Hero Image Titles GEO/ENG', 'heroCardTitles', content.heroCardTitles || {}),
    jsonField('Book Gallery / Image URLs', 'bookGalleryImages', content.bookGalleryImages || []),
  ];

  const save = () => {
    try {
      const nextContent = fields.reduce((acc, field) => {
        const textarea = field.querySelector('textarea');
        acc[textarea.id] = JSON.parse(textarea.value);
        return acc;
      }, {});
      saveContent(nextContent);
      status.classList.remove('admin-error');
      status.textContent = 'Saved. Refresh the website preview to see changes.';
      status.style.display = 'block';
    } catch (error) {
      status.classList.add('admin-error');
      status.textContent = `Could not save: ${error.message}`;
      status.style.display = 'block';
    }
  };

  const reset = () => {
    localStorage.removeItem(ADMIN_CONTENT_KEY);
    renderDashboard();
  };

  const logout = async () => {
    await apiRequest('/api/admin/logout', {});
    renderLogin();
  };

  const changePasswordForm = el('form', { className: 'admin-form admin-password-form' }, [
    el('h2', { className: 'admin-section-title', text: 'Change Password' }),
    el('p', { className: 'admin-muted', text: 'Minimum 8 characters. Use at least one number and one special symbol.' }),
    el('div', { className: 'admin-two' }, [currentPassword, newPassword]),
    confirmPassword,
    el('button', { className: 'admin-btn admin-btn-red', type: 'submit', text: 'Change Password' }),
    passwordStatus,
  ]);

  changePasswordForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!isStrongPassword(newPassword.value)) {
      showStatus(passwordStatus, passwordMessage, true);
      return;
    }
    if (newPassword.value !== confirmPassword.value) {
      showStatus(passwordStatus, 'Passwords do not match.', true);
      return;
    }
    try {
      const result = await apiRequest('/api/admin/change-password', {
        currentPassword: currentPassword.value,
        newPassword: newPassword.value,
      });
      currentPassword.value = '';
      newPassword.value = '';
      confirmPassword.value = '';
      showStatus(passwordStatus, result.message || 'Password changed successfully. Please log in again.');
      setTimeout(renderLogin, 900);
    } catch (error) {
      showStatus(passwordStatus, error.message || 'Could not change password.', true);
    }
  });

  root.append(
    el('div', { className: 'admin-shell' }, [
      el('p', { className: 'admin-kicker', text: 'Team4 Sales College' }),
      el('h1', { className: 'admin-title', text: 'Admin Dashboard' }),
      el('p', {
        className: 'admin-muted',
        text: 'Edit JSON fields, save, then preview the website. GEO and ENG content are separate inside the copy/program objects.',
      }),
      el('div', { className: 'admin-button-row' }, [
        el('button', { className: 'admin-btn admin-btn-red', type: 'button', text: 'Save', onClick: save }),
        el('button', { className: 'admin-btn admin-btn-dark', type: 'button', text: 'Preview Website', onClick: () => window.open('/index.html', '_blank') }),
        el('button', { className: 'admin-btn admin-btn-dark', type: 'button', text: 'Reset Local Edits', onClick: reset }),
        el('button', { className: 'admin-btn admin-btn-dark', type: 'button', text: 'Logout', onClick: logout }),
      ]),
      status,
      el('section', { className: 'admin-card admin-section admin-password-card' }, [changePasswordForm]),
      renderTestimonialsManager(),
      el('div', { className: 'admin-grid' }, fields.map(collapsibleJsonField)),
    ])
  );
};

(async () => {
  if (await checkSession()) {
    renderDashboard();
  } else {
    renderLogin();
  }
})();

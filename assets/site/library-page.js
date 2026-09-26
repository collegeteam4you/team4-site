(function () {
  const { createElement: h } = React;

  function trackCommerceEvent(eventName, item, extra) {
    const eventData = {
      content_ids: item?.id ? [item.id] : [],
      content_name: item?.title || '',
      content_type: 'product',
      value: Number(item?.price || 0),
      currency: 'GEL',
      ...(extra || {}),
    };

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      content_id: item?.id || '',
      content_name: item?.title || '',
      content_type: item?.type || 'book',
      value: Number(item?.price || 0),
      currency: 'GEL',
      ...(extra || {}),
    });

    if (typeof window.fbq !== 'function') return;

    const metaEventNames = {
      begin_checkout: 'InitiateCheckout',
      email_submitted: 'Lead',
      order_created: 'AddPaymentInfo',
    };
    const metaEventName = metaEventNames[eventName];

    if (metaEventName) {
      window.fbq('track', metaEventName, eventData);
      return;
    }

    if (eventName === 'sample_start' || eventName === 'sample_complete') {
      window.fbq('trackCustom', eventName, eventData);
    }
  }

  function getBookBenefit(item) {
    if (item?.id === 'i-am-the-answer') {
      return 'იპოვე ძალა საკუთარ თავში და დაიწყე მოქმედება.';
    }
    if (item?.id === 'why-others-get-rich') {
      return 'შეცვალე ფულზე აზროვნება და დაინახე ახალი შესაძლებლობები.';
    }
    return 'ორი წიგნი, ორი ძლიერი ცვლილება — საკუთარ თავთან და ფულთან.';
  }

  function getPurchaseLabel(item) {
    return item?.type === 'bundle'
      ? `მიიღე ორივე — ${item.price.toFixed(2)} ₾`
      : `დაიწყე კითხვა — ${item.price.toFixed(2)} ₾`;
  }

  function getPreviewBlocks(item) {
    if (!item || item.type !== 'book' || !Array.isArray(item.blocks)) return [];

    if (item.id === 'i-am-the-answer') {
      return item.blocks.slice(341, 349);
    }

    if (item.id === 'why-others-get-rich') {
      return item.blocks.slice(0, 55);
    }

    return item.blocks.slice(0, 18);
  }

  function SampleReader({ item, onClose, onContinue }) {
    const previewBlocks = getPreviewBlocks(item);
    const endRef = React.useRef(null);
    const completionTracked = React.useRef(false);

    React.useEffect(() => {
      trackCommerceEvent('sample_start', item);

      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting) || completionTracked.current) return;
          completionTracked.current = true;
          trackCommerceEvent('sample_complete', item);
        },
        { threshold: 0.35 }
      );

      if (endRef.current) observer.observe(endRef.current);

      return () => {
        observer.disconnect();
        document.body.style.overflow = previousOverflow;
      };
    }, [item]);

    return h(
      'section',
      { className: 'library-sample-overlay', role: 'dialog', 'aria-modal': 'true', 'aria-label': `${item.title} — უფასო ნაწყვეტი` },
      h(
        'div',
        { className: 'library-sample-shell' },
        h(
          'header',
          { className: 'library-sample-header' },
          h('div', null, h('span', null, 'უფასო ნაწყვეტი'), h('strong', null, item.title)),
          h('button', { type: 'button', onClick: onClose, 'aria-label': 'დახურვა' }, '×')
        ),
        h(
          'div',
          { className: 'library-sample-scroll' },
          h(
            'article',
            { className: 'library-sample-pages' },
            previewBlocks.map((block, index) =>
              block.type === 'heading'
                ? h('h2', { key: `sample-heading-${index}` }, block.text)
                : block.type === 'image'
                  ? h('figure', { key: `sample-image-${index}` }, h('img', { src: block.src, alt: block.alt || item.title }))
                  : h('p', { key: `sample-paragraph-${index}` }, block.text)
            )
          ),
          h(
            'div',
            { className: 'library-sample-offer', ref: endRef },
            h('span', null, 'ნაწყვეტი აქ სრულდება'),
            h('h2', null, 'გინდა გაიგო, რა მოხდა შემდეგ?'),
            h('p', null, `გააგრძელე სრული წიგნის კითხვა — ${item.price.toFixed(2)} ₾`),
            h(
              'button',
              { type: 'button', className: 'library-action library-action-primary', onClick: onContinue },
              `გააგრძელე კითხვა — ${item.price.toFixed(2)} ₾`
            )
          )
        )
      )
    );
  }

  function LibraryLogin({ onLogin, item }) {
    const [email, setEmail] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const submit = async (event) => {
      event.preventDefault();
      setIsSubmitting(true);
      setMessage('');

      try {
        const result = window.Team4Library.login({ email });
        if (!result.ok) {
          setMessage(result.message);
          return;
        }

        trackCommerceEvent('email_submitted', item, {
          checkout_step: 'email',
        });

        const ordersResult = await window.Team4Library.fetchUserOrders(result.user.email);
        const existingOrder = (ordersResult.orders || []).some(
          (order) => order.itemId === item?.id
        );

        if (item && !existingOrder) {
          await window.Team4Library.createManualOrder({
            email: result.user.email,
            itemId: item.id,
          });
          trackCommerceEvent('order_created', item, {
            payment_method: 'bank_transfer',
          });
        }

        onLogin(result.user);
      } catch (error) {
        setMessage(error.message || 'შეკვეთის შექმნა ვერ მოხერხდა.');
      } finally {
        setIsSubmitting(false);
      }
    };

    return h(
      'form',
      { className: 'library-login-panel', onSubmit: submit },
      h('p', { className: 'library-kicker' }, 'Team4 · უსაფრთხო გადახდა'),
      h('h1', { className: 'library-title' }, 'სად გამოგიგზავნოთ წიგნი?'),
      h('p', { className: 'library-muted' }, 'შეიყვანე მხოლოდ ელფოსტა. გადახდის დადასტურების შემდეგ წიგნზე წვდომას ამავე ელფოსტით მიიღებ.'),
      h('input', {
        className: 'library-input',
        value: email,
        placeholder: 'ელფოსტა',
        type: 'email',
        onChange: (event) => setEmail(event.target.value),
        autoComplete: 'email',
        required: true,
      }),
      h(
        'button',
        {
          className: 'library-action library-action-primary',
          type: 'submit',
          disabled: isSubmitting,
        },
        isSubmitting ? 'იტვირთება...' : 'გადახდაზე გადასვლა'
      ),
      message && h('p', { className: 'library-error' }, message)
    );
  }

  function OrderPanel({ user, orders, item, onChanged }) {
    const [form] = React.useState({
      email: user?.email || '',
    });
    const [createdOrder, setCreatedOrder] = React.useState(null);
    const [bankDetails, setBankDetails] = React.useState(null);
    const [status, setStatus] = React.useState(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [selectedBank, setSelectedBank] = React.useState('bog');
    const [copiedField, setCopiedField] = React.useState('');
    const activeOrder =
  createdOrder ||
  orders.find(
    (order) =>
      order.itemId === item?.id &&
      order.status !== 'Approved'
  ) ||
  null;

    const copyPaymentValue = async (field, value) => {
      try {
        await navigator.clipboard.writeText(String(value || ''));
        setCopiedField(field);
        window.setTimeout(() => setCopiedField(''), 1600);
      } catch (error) {
        setStatus({ type: 'error', text: 'კოპირება ვერ მოხერხდა. მონიშნე და დააკოპირე ხელით.' });
      }
    };

    const submitOrder = async (event) => {
      event.preventDefault();
      setIsSubmitting(true);
      setStatus(null);
      try {
        const result = await window.Team4Library.createManualOrder({
  ...form,
  itemId: item.id,
});
        setCreatedOrder(result.order);
        setBankDetails(result.bankDetails);
        trackCommerceEvent('order_created', item, {
          payment_method: 'bank_transfer',
        });
        setStatus({ type: 'success', text: 'შეკვეთა შეიქმნა. გადარიცხვისას დანიშნულებაში მიუთითე გადახდის კოდი.' });
        onChanged();
      } catch (error) {
        setStatus({ type: 'error', text: error.message || 'შეკვეთა ვერ შეიქმნა.' });
      } finally {
        setIsSubmitting(false);
      }
    };

    return h(
      'section',
      { className: 'library-order-panel library-checkout-panel' },
      h(
        'div',
        { className: 'library-checkout-header' },
        h('div', { className: 'library-checkout-brand' }, h('span', null, 'T4'), h('div', null, h('strong', null, 'Team4'), h('small', null, 'უსაფრთხო გადახდა'))),
        h('div', { className: 'library-checkout-secure' }, '✓ დაცული შეკვეთა')
      ),
      h(
        'div',
        { className: 'library-checkout-steps', 'aria-label': 'გადახდის ეტაპები' },
        ['1. შეკვეთა', '2. გადახდა', '3. წვდომა'].map((label, index) =>
          h('div', { key: label, className: `library-checkout-step ${index < (activeOrder ? 2 : 1) ? 'is-active' : ''}` }, h('i', null), h('span', null, label))
        )
      ),
      h(
        'div',
        { className: 'library-checkout-summary' },
        h('div', null, h('p', { className: 'library-kicker' }, 'შენი შეკვეთა'), h('h2', null, item.title), h('span', null, item.type === 'bundle' ? 'ორი ციფრული წიგნი' : 'ციფრული წიგნი')),
        h('strong', null, `${item.price.toFixed(2)} ₾`)
      ),
      h('p', { className: 'library-muted library-checkout-intro' }, activeOrder ? 'აირჩიე ბანკი, დააკოპირე რეკვიზიტები და გადარიცხვის დანიშნულებაში აუცილებლად მიუთითე შეკვეთის კოდი.' : 'დაადასტურე ელფოსტა და შემდეგ გამოჩნდება საბანკო რეკვიზიტები და უნიკალური გადახდის კოდი.'),
      activeOrder &&
        h(
          'div',
          { className: 'library-order-status' },
          h('strong', null, `${activeOrder.paymentCode} / ${activeOrder.status}`),
          activeOrder.rejectReason && h('span', null, activeOrder.rejectReason)
        ),
      !activeOrder &&
        h(
          'form',
          { className: 'library-order-form', onSubmit: submitOrder },
          h('input', {
            className: 'library-input',
            required: true,
            readOnly: true,
            type: 'email',
            'aria-label': 'ელფოსტა',
            value: form.email,
          }),
          h(
  'button',
  {
    className: 'library-action library-action-primary',
    disabled: isSubmitting,
    type: 'submit',
  },
  isSubmitting
    ? 'იგზავნება...'
    : `შეიძინე ${item.price.toFixed(2)} ლარად`
)
        ),
      (bankDetails || activeOrder) &&
        h(
          React.Fragment,
          null,
          h('h3', { className: 'library-bank-heading' }, 'აირჩიე შენი ბანკი'),
          h(
            'div',
            { className: 'library-bank-choice', role: 'group', 'aria-label': 'ბანკის არჩევა' },
            h('button', { type: 'button', className: selectedBank === 'bog' ? 'is-selected' : '', 'aria-pressed': selectedBank === 'bog', onClick: () => setSelectedBank('bog') }, 'საქართველოს ბანკი'),
            h('button', { type: 'button', className: selectedBank === 'tbc' ? 'is-selected' : '', 'aria-pressed': selectedBank === 'tbc', onClick: () => setSelectedBank('tbc') }, 'TBC ბანკი')
          ),
          h(
            'div',
            { className: 'library-bank-details' },
            h('div', { className: 'library-payment-row' }, h('span', null, 'მიმღები'), h('strong', null, bankDetails?.receiver || 'ლაშა ხურციძე · Team4')),
            h(
              'div',
              { className: 'library-payment-row' },
              h('span', null, 'ანგარიშის ნომერი'),
              h(
                'strong',
                null,
                selectedBank === 'bog'
                  ? bankDetails?.bogAccount || 'GE12BG0000000536600132'
                  : bankDetails?.tbcAccount || 'GE96TB7044645064300059',
                h('button', { type: 'button', className: 'library-copy-button', onClick: () => copyPaymentValue('account', selectedBank === 'bog' ? bankDetails?.bogAccount || 'GE12BG0000000536600132' : bankDetails?.tbcAccount || 'GE96TB7044645064300059') }, copiedField === 'account' ? 'დაკოპირდა ✓' : 'კოპირება')
              )
            ),
            h('div', { className: 'library-payment-row' }, h('span', null, 'გადასახდელი თანხა'), h('strong', null, `${bankDetails?.amount || item.price} ₾`)),
            h(
              'div',
              { className: 'library-payment-row' },
              h('span', null, 'დანიშნულება'),
              h('strong', null, bankDetails?.purpose || activeOrder?.paymentCode, h('button', { type: 'button', className: 'library-copy-button', onClick: () => copyPaymentValue('purpose', bankDetails?.purpose || activeOrder?.paymentCode) }, copiedField === 'purpose' ? 'დაკოპირდა ✓' : 'კოპირება'))
            )
          ),
          h('div', { className: 'library-payment-notice' }, h('strong', null, 'მნიშვნელოვანია: '), 'გადარიცხვის დანიშნულებაში აუცილებლად მიუთითე შეკვეთის კოდი.')
        ),
      status && h('p', { className: status.type === 'error' ? 'library-error' : 'library-success' }, status.text)
    );
  }

  function ProtectedReader({ user, item }) {
    const readerBlocks = Array.isArray(item.blocks) && item.blocks.length ? item.blocks : null;
    const readerBody = item.body || '';
    const watermark = user?.email || '';
    const chapters = (readerBlocks || [])
      .map((block, index) => (block.type === 'heading' ? { text: block.text, index } : null))
      .filter(Boolean);
    const [progress, setProgress] = React.useState(() => window.Team4Library.getProgress(user?.email, item.id).percent || 0);

    React.useEffect(() => {
      const stop = (event) => {
        event.preventDefault();
        return false;
      };
      const stopKeys = (event) => {
        const key = String(event.key || '').toLowerCase();
        if ((event.ctrlKey || event.metaKey) && ['c', 'p', 's'].includes(key)) event.preventDefault();
      };
      document.addEventListener('copy', stop);
      document.addEventListener('cut', stop);
      document.addEventListener('selectstart', stop);
      document.addEventListener('contextmenu', stop);
      document.addEventListener('keydown', stopKeys);
      return () => {
        document.removeEventListener('copy', stop);
        document.removeEventListener('cut', stop);
        document.removeEventListener('selectstart', stop);
        document.removeEventListener('contextmenu', stop);
        document.removeEventListener('keydown', stopKeys);
      };
    }, []);

    React.useEffect(() => {
      const saved = window.Team4Library.getProgress(user?.email, item.id);
      const restore = window.setTimeout(() => {
        if (saved.scrollY > 0) window.scrollTo({ top: saved.scrollY, behavior: 'auto' });
      }, 120);
      const updateProgress = () => {
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const nextPercent = Math.min(100, Math.max(0, Math.round((window.scrollY / maxScroll) * 100)));
        setProgress(nextPercent);
        window.Team4Library.setProgress(user?.email, item.id, { percent: nextPercent, scrollY: window.scrollY });
      };
      updateProgress();
      window.addEventListener('scroll', updateProgress, { passive: true });
      return () => {
        window.clearTimeout(restore);
        window.removeEventListener('scroll', updateProgress);
      };
    }, [item.id, user?.email]);

    const jumpToBlock = (index) => {
      const node = document.getElementById(`book-block-${index}`);
      if (node) node.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return h(
      'section',
      { className: 'library-reader-shell' },
      h(
        'aside',
        { className: 'library-books-panel' },
        h('p', { className: 'library-kicker' }, 'ჩემი წიგნები'),
        h('article', { className: 'library-book-card' }, h('img', { src: item.cover, alt: item.title, className: 'library-book-cover', loading: 'lazy' }), h('div', null, h('h2', null, item.title), h('p', { className: 'library-card-benefit' }, getBookBenefit(item))), h('span', { className: 'library-status is-open' }, 'წვდომა აქტიურია')),
        h('div', { className: 'library-progress' }, h('span', null, `წაკითხულია ${progress}%`), h('div', null, h('i', { style: { width: `${progress}%` } }))),
        chapters.length > 0 &&
          h('nav', { className: 'library-chapters' }, h('strong', null, 'თავები'), chapters.map((chapter) => h('button', { key: `chapter-${chapter.index}`, type: 'button', onClick: () => jumpToBlock(chapter.index) }, chapter.text)))
      ),
      h(
        'article',
        { className: 'library-reader is-protected', style: { '--reader-watermark': `"${watermark}"` } },
        h('h1', { className: 'library-title' }, item.title),
        h(
          'div',
          { className: 'library-book-body' },
          readerBlocks
            ? readerBlocks.map((block, index) =>
                block.type === 'image'
                  ? h('figure', { key: `book-image-${index}`, id: `book-block-${index}`, className: 'library-book-figure' }, h('img', { src: block.src, alt: block.alt || item.title, loading: 'lazy' }))
                  : block.type === 'heading'
                    ? h('h2', { key: `book-heading-${index}`, id: `book-block-${index}`, className: 'library-book-heading' }, block.text)
                    : h('p', { key: `book-paragraph-${index}`, id: `book-block-${index}` }, block.text)
              )
            : readerBody.split('\n\n').map((paragraph, index) => h('p', { key: `book-paragraph-${index}` }, paragraph))
        )
      )
    );
  }

 function LibraryPage({ lang, setLang, Header, Footer }) {
  const catalog = window.Team4Library.catalog;
  const bookItems = catalog.filter((item) => item.type === 'book');
  const [selectedItemId, setSelectedItemId] = React.useState('');
  const [user, setUser] = React.useState(() => window.Team4Library.getUser());
  const [orders, setOrders] = React.useState([]);
  const [entitlements, setEntitlements] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);
   const [showLogin, setShowLogin] = React.useState(false);
  const [sampleItemId, setSampleItemId] = React.useState('');

  React.useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'book_view',
      content_ids: catalog.map((item) => item.id),
      content_type: 'product_group',
    });

    if (typeof window.fbq === 'function') {
      window.fbq('track', 'ViewContent', {
        content_ids: catalog.map((item) => item.id),
        content_name: 'Team4 Digital Library',
        content_type: 'product_group',
        currency: 'GEL',
      });
    }
  }, []);

const selectedItem =
  catalog.find((item) => item.id === selectedItemId) ||
  null;

  const sampleItem =
    catalog.find((item) => item.id === sampleItemId) ||
    null;

  const beginPurchase = (item) => {
    trackCommerceEvent('begin_checkout', item, {
      source: sampleItemId ? 'free_sample' : 'catalog',
    });
    setSampleItemId('');
    setSelectedItemId(item.id);

    if (!user) {
      setShowLogin(true);
    }

    setTimeout(() => {
      const panel = document.querySelector(
        user ? '.library-order-panel' : '.library-login-panel'
      );

      if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 180);
  };

  const hasApprovedOrder = (itemId) =>
  orders.some((order) => {
    const isApproved =
      String(order.status || '').toLowerCase() === 'approved';

    if (!isApproved) return false;

    // ცალკე შეძენილი წიგნი
    if (order.itemId === itemId) return true;

    // პაკეტის შეძენისას ორივე წიგნის გახსნა
    const orderedItem = catalog.find(
      (catalogItem) => catalogItem.id === order.itemId
    );

    return (
      orderedItem?.type === 'bundle' &&
      Array.isArray(orderedItem.itemIds) &&
      orderedItem.itemIds.includes(itemId)
    );
  });

const hasAccess = (itemId) =>
  window.Team4Library.hasAccessFromEntitlements(
    itemId,
    entitlements
  ) || hasApprovedOrder(itemId);

  const selectedBookHasAccess =
    selectedItem?.type === 'book' &&
    hasAccess(selectedItem.id);

  React.useEffect(() => {
    if (!user) return undefined;

    let active = true;
    setIsLoading(true);

    Promise.all([
      window.Team4Library.fetchUserOrders(user.email),
      window.Team4Library.fetchEntitlements(user.email),
    ])
      .then(([orderResult, entitlementResult]) => {
        if (!active) return;
        setOrders(orderResult.orders || []);
        setEntitlements(entitlementResult.items || []);
      })
      .catch(() => {
        if (!active) return;
        setOrders([]);
        setEntitlements([]);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user, refreshKey]);

  const logout = () => {
    window.Team4Library.logout();
    setUser(null);
    setOrders([]);
    setEntitlements([]);
  };

  return h(
    React.Fragment,
    null,
    h('div', {
      className: 'luxury-light-field',
      'aria-hidden': 'true',
    }),
    h(Header, { lang, setLang }),
    h(
      'main',
      { className: 'library-page' },
      h(
        'style',
        null,
        `
        .library-conversion-hero{max-width:1180px;margin:0 auto 30px;padding:34px 22px 22px;position:relative;overflow:hidden;border-radius:28px;background:radial-gradient(circle at 72% 34%,rgba(218,38,38,.20),transparent 34%),linear-gradient(145deg,#17191d 0%,#090a0c 72%);border:1px solid rgba(255,255,255,.08);box-shadow:0 28px 80px rgba(0,0,0,.34)}
        .library-conversion-grid{display:grid;grid-template-columns:1.08fr .92fr;gap:28px;align-items:center}
        .library-conversion-copy{position:relative;z-index:2}
        .library-conversion-kicker{margin:0 0 12px;color:#ff3b30;font-size:14px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
        .library-conversion-title{margin:0;color:#fff;font-size:clamp(36px,5vw,70px);line-height:1.03;font-weight:900;letter-spacing:-.04em}
        .library-conversion-title em{display:block;color:#ff2d2d;font-style:normal}
        .library-conversion-subtitle{max-width:650px;margin:18px 0 22px;color:#d7d7da;font-size:19px;line-height:1.55}
        .library-conversion-cta{display:inline-flex;align-items:center;justify-content:center;min-height:58px;padding:0 28px;border:0;border-radius:14px;background:linear-gradient(135deg,#ff3131,#d60f19);color:#fff;font-size:18px;font-weight:900;box-shadow:0 14px 36px rgba(225,20,30,.28);cursor:pointer}
        .library-conversion-note{margin:11px 0 0;color:#96989d;font-size:13px}
        .library-conversion-cover-wrap{min-height:360px;display:flex;align-items:center;justify-content:center;position:relative}
        .library-conversion-cover-wrap:before{content:'';position:absolute;width:260px;height:260px;border-radius:50%;background:rgba(224,26,34,.18);filter:blur(55px)}
        .library-conversion-cover{position:relative;z-index:1;width:min(280px,78%);max-height:390px;object-fit:contain;filter:drop-shadow(0 24px 28px rgba(0,0,0,.58));transform:perspective(900px) rotateY(-8deg) rotateZ(1deg)}
        .library-conversion-benefits{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:28px;padding-top:20px;border-top:1px solid rgba(255,255,255,.08)}
        .library-conversion-benefit{display:flex;gap:9px;align-items:center;color:#eee;font-size:13px;font-weight:700}
        .library-conversion-benefit b{display:grid;place-items:center;flex:0 0 32px;height:32px;border-radius:50%;background:#e21c26;color:#fff;font-size:15px}
        .library-featured-stack{display:grid;gap:22px;max-width:1180px;margin:0 auto 30px}
        .library-featured-stack .library-conversion-hero{margin:0;width:100%;box-sizing:border-box}
        @media(max-width:700px){
          .library-page{padding-top:12px!important}
          .library-conversion-hero{margin:0 10px 22px;padding:22px 18px 18px;border-radius:22px}
          .library-conversion-grid{grid-template-columns:1fr;gap:4px}
          .library-conversion-copy{text-align:left}
          .library-conversion-kicker{font-size:11px;margin-bottom:8px}
          .library-conversion-title{font-size:38px;line-height:1.02}
          .library-conversion-hero{scroll-margin-top:145px}
          .library-conversion-copy{padding-top:14px}
          .library-conversion-subtitle{font-size:15px;line-height:1.45;margin:12px 0 15px}
          .library-conversion-cta{width:100%;min-height:54px;font-size:17px}
          .library-conversion-note{text-align:center;font-size:11px}
          .library-conversion-cover-wrap{min-height:220px;margin-top:4px}
          .library-conversion-cover{width:170px;max-height:225px}
          .library-conversion-benefits{grid-template-columns:1fr 1fr;gap:12px 8px;margin-top:8px;padding-top:15px}
          .library-conversion-benefit{font-size:11px}
          .library-conversion-benefit b{flex-basis:27px;height:27px;font-size:12px}
          .library-featured-stack{gap:16px;margin:0 10px 22px}
          .library-featured-stack .library-conversion-hero{margin:0}
        }
        `
      ),
      h(
        'div',
        { className: 'library-featured-stack' },
      h(
        'section',
        { className: 'library-conversion-hero', 'aria-label': 'მე ვარ პასუხი — უფასო ნაწყვეტი' },
        h(
          'div',
          { className: 'library-conversion-grid' },
          h(
            'div',
            { className: 'library-conversion-copy' },
            h('p', { className: 'library-conversion-kicker' }, 'Team4 · ციფრული ბიბლიოთეკა'),
            h('h1', { className: 'library-conversion-title' }, 'შენი ცხოვრება', h('em', null, 'შენს ხელშია.')),
            h('p', { className: 'library-conversion-subtitle' }, '„მე ვარ პასუხი“ — რეალური გამოცდილება, პრაქტიკული გაკვეთილები და გზა ცვლილებისკენ. დაიწყე პირველი 2 გვერდით.'),
            h('button', { type: 'button', className: 'library-conversion-cta', onClick: () => setSampleItemId('i-am-the-answer') }, 'წაიკითხე უფასოდ'),
            h('p', { className: 'library-conversion-note' }, 'რეგისტრაცია არ არის საჭირო · 2 გვერდი უფასოდ')
          ),
          h(
            'div',
            { className: 'library-conversion-cover-wrap' },
            h('img', { className: 'library-conversion-cover', src: catalog.find((item) => item.id === 'i-am-the-answer')?.cover || '', alt: 'მე ვარ პასუხი' })
          )
        ),
        h(
          'div',
          { className: 'library-conversion-benefits' },
          h('div', { className: 'library-conversion-benefit' }, h('b', null, '✓'), h('span', null, 'რეალური გამოცდილება')),
          h('div', { className: 'library-conversion-benefit' }, h('b', null, '↗'), h('span', null, 'პრაქტიკული ნაბიჯები')),
          h('div', { className: 'library-conversion-benefit' }, h('b', null, '★'), h('span', null, 'აზროვნების ცვლილება')),
          h('div', { className: 'library-conversion-benefit' }, h('b', null, '₾'), h('span', null, 'ფინანსური თავისუფლება'))
        )
      ),
      h(
        'section',
        { className: 'library-conversion-hero', 'aria-label': 'რატომ მდიდრდებიან სხვები — უფასო ნაწყვეტი' },
        h(
          'div',
          { className: 'library-conversion-grid' },
          h(
            'div',
            { className: 'library-conversion-copy' },
            h('p', { className: 'library-conversion-kicker' }, 'Team4 · ციფრული ბიბლიოთეკა'),
            h('h1', { className: 'library-conversion-title' }, 'რატომ მდიდრდებიან', h('em', null, 'სხვები?')),
            h('p', { className: 'library-conversion-subtitle' }, 'შეცვალე ფულზე აზროვნება და დაინახე ახალი შესაძლებლობები. დაიწყე პირველი 2 გვერდით.'),
            h('button', { type: 'button', className: 'library-conversion-cta', onClick: () => setSampleItemId('why-others-get-rich') }, 'წაიკითხე უფასოდ'),
            h('p', { className: 'library-conversion-note' }, 'რეგისტრაცია არ არის საჭირო · 2 გვერდი უფასოდ')
          ),
          h(
            'div',
            { className: 'library-conversion-cover-wrap' },
            h('img', { className: 'library-conversion-cover', src: catalog.find((item) => item.id === 'why-others-get-rich')?.cover || '', alt: 'რატომ მდიდრდებიან სხვები' })
          )
        ),
        h(
          'div',
          { className: 'library-conversion-benefits' },
          h('div', { className: 'library-conversion-benefit' }, h('b', null, '✓'), h('span', null, 'ფულზე ახალი ხედვა')),
          h('div', { className: 'library-conversion-benefit' }, h('b', null, '↗'), h('span', null, 'პრაქტიკული ნაბიჯები')),
          h('div', { className: 'library-conversion-benefit' }, h('b', null, '★'), h('span', null, 'აზროვნების ცვლილება')),
          h('div', { className: 'library-conversion-benefit' }, h('b', null, '₾'), h('span', null, 'შემოსავლის ზრდა'))
        )
      )
      ),
      user
        ? h(
            React.Fragment,
            null,

            h(
              'div',
              { className: 'library-userbar' },
              h('span', null, user.email),
              h(
                'button',
                {
                  type: 'button',
                  onClick: logout,
                },
                'ელფოსტის შეცვლა'
              )
            ),

            isLoading &&
              h(
                'p',
                { className: 'library-loading' },
                'იტვირთება...'
              ),

selectedBookHasAccess
  ? h(
      React.Fragment,
      null,
      h(
        'button',
        {
          type: 'button',
          className: 'library-action',
          onClick: () => setSelectedItemId(''),
        },
        '← ყველა წიგნი'
      ),
      h(ProtectedReader, {
        user,
        item: selectedItem,
      })
    )
              : h(
                  'section',
                  { className: 'library-cabinet-shell' },

                  h(
                    'div',
                    { className: 'library-books-panel' },

                    catalog.filter((item) => !['i-am-the-answer','why-others-get-rich'].includes(item.id)).map((item) => {
                      const itemHasAccess =
                        item.type === 'book' &&
                        hasAccess(item.id);

                      return h(
                        'article',
                        {
                          key: item.id,
                          className: 'library-book-card',
                        },

                        h('img', {
                          src: item.cover,
                          alt: item.title,
                          className: 'library-book-cover',
                          loading: 'lazy',
                        }),

                        h(
                          'div',
                          null,
                          h('h2', null, item.title),
                          h('p', { className: 'library-card-benefit' }, getBookBenefit(item)),
                          item.type !== 'book' &&
                            h(
                              'strong',
                              null,
                              `${item.price.toFixed(2)} ლარი`
                            )
                        ),

                        itemHasAccess
                          ? h(
                              'button',
                              {
                                type: 'button',
                                className:
                                  'library-action library-action-primary',
                                onClick: () =>
                                  setSelectedItemId(item.id),
                              },
                              'წაკითხვა'
                            )
                          : item.type === 'book'
                            ? h(
                                'div',
                                { className: 'library-card-actions' },
                                h('button', { type: 'button', className: 'library-action library-action-preview', onClick: () => setSampleItemId(item.id) }, 'წაიკითხე 2 გვერდი უფასოდ'),
                                h('button', { type: 'button', className: 'library-action library-action-primary', onClick: () => beginPurchase(item) }, `შეიძინე — ${item.price.toFixed(2)} ₾`)
                              )
                            : h(
  'button',
  {
    type: 'button',
    className:
      selectedItemId === item.id
        ? 'library-action library-action-primary'
        : 'library-action',
    onClick: () => {
  beginPurchase(item);

  setTimeout(() => {
    const panel = document.querySelector('.library-order-panel');

    if (panel) {
      panel.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, 150);
},
  },
  getPurchaseLabel(item)
)
                      );
                    }),

                    orders.length
                      ? h(
                          'div',
                          { className: 'library-order-list' },
                          orders.map((order) =>
                            h(
                              'p',
                              { key: order.paymentCode },
                              `${order.itemTitle} — ${order.paymentCode} / ${order.status}`
                            )
                          )
                        )
                      : h(
                          'p',
                          { className: 'library-muted' },
                          'ჯერ შეკვეთა არ გაქვს.'
                        )
                  ),

                  selectedItem &&
                    !selectedBookHasAccess &&
                    h(OrderPanel, {
                      user,
                      orders,
                      item: selectedItem,
                      onChanged: () =>
                        setRefreshKey((value) => value + 1),
                    })
                )
          )
        : h(
    React.Fragment,
    null,

    h(
      'section',
      { className: 'library-cabinet-shell' },

      h(
        'div',
        { className: 'library-books-panel' },

        catalog.filter((item) => !['i-am-the-answer','why-others-get-rich'].includes(item.id)).map((item) =>
          h(
            'article',
            {
              key: item.id,
              className: 'library-book-card',
            },

            h('img', {
              src: item.cover,
              alt: item.title,
              className: 'library-book-cover',
              loading: 'lazy',
            }),

            h(
              'div',
              null,
              h('h2', null, item.title),
              h('p', { className: 'library-card-benefit' }, getBookBenefit(item)),
              item.type !== 'book' &&
                h(
                  'strong',
                  null,
                  `${item.price.toFixed(2)} ლარი`
                )
            ),

            item.type === 'book'
              ? h(
                  'div',
                  { className: 'library-card-actions' },
                  h('button', { type: 'button', className: 'library-action library-action-preview', onClick: () => setSampleItemId(item.id) }, 'წაიკითხე 2 გვერდი უფასოდ'),
                  h('button', { type: 'button', className: 'library-action library-action-primary', onClick: () => beginPurchase(item) }, `შეიძინე — ${item.price.toFixed(2)} ₾`)
                )
              : h(
                  'button',
                  {
                    type: 'button',
                    className:
                      selectedItemId === item.id
                        ? 'library-action library-action-primary'
                        : 'library-action',
                    onClick: () => beginPurchase(item),
                  },
                  getPurchaseLabel(item)
                )
          )
        )
      )
    ),

    showLogin &&
      h(LibraryLogin, {
        item: selectedItem,
        onLogin: (loggedUser) => {
          setUser(loggedUser);
          setShowLogin(false);

          setTimeout(() => {
            const orderPanel =
              document.querySelector(
                '.library-order-panel'
              );

            if (orderPanel) {
              orderPanel.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
            }
          }, 250);
        },
      })
  )
    ),
    sampleItem &&
      h(SampleReader, {
        item: sampleItem,
        onClose: () => setSampleItemId(''),
        onContinue: () => beginPurchase(sampleItem),
      }),
    h(Footer, { lang })
  );
}
  window.Team4ManualLibraryPage = LibraryPage;
})();
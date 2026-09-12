(function () {
  const { createElement: h } = React;

  function trackCommerceEvent(eventName, item, extra) {
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
    const [receiptFile, setReceiptFile] = React.useState(null);
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

    const uploadReceipt = async (event) => {
      event.preventDefault();
      if (!activeOrder?.paymentCode) return;
      setIsSubmitting(true);
      setStatus(null);
      try {
        await window.Team4Library.uploadReceipt(activeOrder.paymentCode, receiptFile);
        setReceiptFile(null);
        setStatus({ type: 'success', text: 'ქვითარი აიტვირთა. ადმინისტრატორი გადახდას შეამოწმებს და დაგიდასტურებთ.' });
        onChanged();
      } catch (error) {
        setStatus({ type: 'error', text: error.message || 'ქვითარი ვერ აიტვირთა.' });
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
      h('p', { className: 'library-muted library-checkout-intro' }, activeOrder ? 'აირჩიე ბანკი, დააკოპირე რეკვიზიტები და გადახდის შემდეგ ატვირთე ქვითარი.' : 'დაადასტურე ელფოსტა და შემდეგ გამოჩნდება საბანკო რეკვიზიტები და უნიკალური გადახდის კოდი.'),
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
      activeOrder &&
        h(
          'form',
          { className: 'library-order-form', onSubmit: uploadReceipt },
          h('label', { className: 'library-file-label' }, 'ქვითრის ფაილი', h('input', { type: 'file', accept: 'image/png,image/jpeg,image/webp,application/pdf', onChange: (event) => setReceiptFile(event.target.files?.[0] || null), required: true })),
          h('button', { className: 'library-action library-action-primary library-receipt-button', disabled: isSubmitting, type: 'submit' }, isSubmitting ? 'იტვირთება...' : 'გადავიხადე — ქვითრის გაგზავნა')
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
        h('article', { className: 'library-book-card' }, h('img', { src: item.cover, alt: item.title, className: 'library-book-cover', loading: 'lazy' }), h('div', null, h('h2', null, item.title), h('p', null, item.description)), h('span', { className: 'library-status is-open' }, 'წვდომა აქტიურია')),
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

  React.useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'book_view',
      content_ids: catalog.map((item) => item.id),
      content_type: 'product_group',
    });
  }, []);

  React.useEffect(() => {
    orders.forEach((order) => {
      if (String(order.status || '').toLowerCase() !== 'approved') return;

      const purchaseKey = 'team4_purchase_tracked_' + order.paymentCode;
      if (window.localStorage.getItem(purchaseKey)) return;

      const orderedItem = catalog.find((item) => item.id === order.itemId);
      trackCommerceEvent('purchase', orderedItem, {
        transaction_id: order.paymentCode,
      });
      window.localStorage.setItem(purchaseKey, '1');
    });
  }, [orders]);

const selectedItem =
  catalog.find((item) => item.id === selectedItemId) ||
  null;

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

                    h(
                      'p',
                      { className: 'library-kicker' },
                      'წიგნები და პაკეტები'
                    ),

                    catalog.map((item) => {
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
                          h('p', null, item.description),
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
                          : h(
  'button',
  {
    type: 'button',
    className:
      selectedItemId === item.id
        ? 'library-action library-action-primary'
        : 'library-action',
    onClick: () => {
  trackCommerceEvent('begin_checkout', item);
  setSelectedItemId(item.id);

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
  'შეძენა'
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

        h(
          'p',
          { className: 'library-kicker' },
          'წიგნები და პაკეტები'
        ),

        catalog.map((item) =>
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
              h('p', null, item.description),
              h(
                'strong',
                null,
                `${item.price.toFixed(2)} ლარი`
              )
            ),

            h(
              'button',
              {
                type: 'button',
                className:
                  selectedItemId === item.id
                    ? 'library-action library-action-primary'
                    : 'library-action',

                onClick: () => {
                  trackCommerceEvent('begin_checkout', item);
                  setSelectedItemId(item.id);
                  setShowLogin(true);

                  setTimeout(() => {
                    const loginPanel =
                      document.querySelector(
                        '.library-login-panel'
                      );

                    if (loginPanel) {
                      loginPanel.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                      });
                    }
                  }, 150);
                },
              },
              'შეძენა'
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
    h(Footer, { lang })
  );
}
  window.Team4ManualLibraryPage = LibraryPage;
})();

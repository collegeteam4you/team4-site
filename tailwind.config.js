(function () {
  const { createElement: h } = React;

  function LibraryLogin({ onLogin }) {
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [message, setMessage] = React.useState('');

    const submit = (event) => {
      event.preventDefault();
      const result = window.Team4Library.login({ firstName, lastName, email, phone });
      if (!result.ok) {
        setMessage(result.message);
        return;
      }
      setMessage('');
      onLogin(result.user);
    };

    return h(
      'form',
      { className: 'library-login-panel', onSubmit: submit },
      h('p', { className: 'library-kicker' }, 'Team4 Library'),
      h('h1', { className: 'library-title' }, 'Login / Register'),
      h('p', { className: 'library-muted' }, 'წიგნის სანახავად შედი ან დარეგისტრირდი ელფოსტით. დამტკიცებული გადახდის შემდეგ წიგნი გამოჩნდება გვერდზე „ჩემი წიგნები“.'),
      h(
        'div',
        { className: 'library-two' },
        h('input', { className: 'library-input', value: firstName, placeholder: 'სახელი', onChange: (event) => setFirstName(event.target.value), autoComplete: 'given-name', required: true }),
        h('input', { className: 'library-input', value: lastName, placeholder: 'გვარი', onChange: (event) => setLastName(event.target.value), autoComplete: 'family-name', required: true })
      ),
      h('input', { className: 'library-input', value: email, placeholder: 'ელფოსტა', type: 'email', onChange: (event) => setEmail(event.target.value), autoComplete: 'email', required: true }),
      h('input', { className: 'library-input', value: phone, placeholder: 'ტელეფონი', type: 'tel', onChange: (event) => setPhone(event.target.value), autoComplete: 'tel', required: true }),
      h('button', { className: 'library-action library-action-primary', type: 'submit' }, 'შესვლა / რეგისტრაცია'),
      message && h('p', { className: 'library-error' }, message)
    );
  }

  function OrderPanel({ user, orders, onChanged }) {
    const [form, setForm] = React.useState({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    const [createdOrder, setCreatedOrder] = React.useState(null);
    const [bankDetails, setBankDetails] = React.useState(null);
    const [receiptFile, setReceiptFile] = React.useState(null);
    const [status, setStatus] = React.useState(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const activeOrder = createdOrder || orders.find((order) => order.status !== 'Approved') || null;

    const updateField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

    const submitOrder = async (event) => {
      event.preventDefault();
      setIsSubmitting(true);
      setStatus(null);
      try {
        const result = await window.Team4Library.createManualOrder(form);
        setCreatedOrder(result.order);
        setBankDetails(result.bankDetails);
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
      { className: 'library-order-panel' },
      h('p', { className: 'library-kicker' }, 'Manual Payment'),
      h('h2', null, 'შეიძინე 14.90 ლარად'),
      h('p', { className: 'library-muted' }, 'შეკვეთის შემდეგ გამოჩნდება საბანკო რეკვიზიტები და უნიკალური გადახდის კოდი. ქვითრის ატვირთვის შემდეგ შეკვეთა Pending სტატუსით გადავა ადმინისტრატორთან.'),
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
          h('div', { className: 'library-two' },
            h('input', { className: 'library-input', required: true, placeholder: 'სახელი', value: form.firstName, onChange: (event) => updateField('firstName', event.target.value) }),
            h('input', { className: 'library-input', required: true, placeholder: 'გვარი', value: form.lastName, onChange: (event) => updateField('lastName', event.target.value) })
          ),
          h('input', { className: 'library-input', required: true, type: 'email', placeholder: 'ელფოსტა', value: form.email, onChange: (event) => updateField('email', event.target.value) }),
          h('input', { className: 'library-input', required: true, type: 'tel', placeholder: 'ტელეფონი', value: form.phone, onChange: (event) => updateField('phone', event.target.value) }),
          h('button', { className: 'library-action library-action-primary', disabled: isSubmitting, type: 'submit' }, isSubmitting ? 'იგზავნება...' : 'შეიძინე 14.90 ლარად')
        ),
      (bankDetails || activeOrder) &&
        h(
          'div',
          { className: 'library-bank-details' },
          h('p', null, h('strong', null, 'მიმღები: '), bankDetails?.receiver || 'ლაშა ხურციძე'),
          h('p', null, h('strong', null, 'ანგარიში: '), bankDetails?.account || 'GE12BG0000000536600132'),
          h('p', null, h('strong', null, 'თანხა: '), '14.90 ლარი'),
          h('p', null, h('strong', null, 'დანიშნულება: '), bankDetails?.purpose || activeOrder?.paymentCode)
        ),
      activeOrder &&
        h(
          'form',
          { className: 'library-order-form', onSubmit: uploadReceipt },
          h('label', { className: 'library-file-label' }, 'ქვითრის ატვირთვა', h('input', { type: 'file', accept: 'image/png,image/jpeg,image/webp,application/pdf', onChange: (event) => setReceiptFile(event.target.files?.[0] || null), required: true })),
          h('button', { className: 'library-action library-action-primary', disabled: isSubmitting, type: 'submit' }, isSubmitting ? 'იტვირთება...' : 'ქვითრის გაგზავნა')
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
    const catalogItem = window.Team4Library.catalog[0];
    const [user, setUser] = React.useState(() => window.Team4Library.getUser());
    const [orders, setOrders] = React.useState([]);
    const [entitlements, setEntitlements] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [refreshKey, setRefreshKey] = React.useState(0);
    const hasAccess = window.Team4Library.hasAccessFromEntitlements(catalogItem.id, entitlements);

    React.useEffect(() => {
      if (!user) return undefined;
      let active = true;
      setIsLoading(true);
      Promise.all([window.Team4Library.fetchUserOrders(user.email), window.Team4Library.fetchEntitlements(user.email)])
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
      h('div', { className: 'luxury-light-field', 'aria-hidden': 'true' }),
      h(Header, { lang, setLang }),
      h(
        'main',
        { className: 'library-page' },
        user
          ? h(
              React.Fragment,
              null,
              h('div', { className: 'library-userbar' }, h('span', null, `${user.name} / ${user.email}`), h('button', { type: 'button', onClick: logout }, 'გასვლა')),
              isLoading && h('p', { className: 'library-loading' }, 'იტვირთება...'),
              hasAccess
                ? h(ProtectedReader, { user, item: catalogItem })
                : h(
                    'section',
                    { className: 'library-cabinet-shell' },
                    h(
                      'div',
                      { className: 'library-books-panel' },
                      h('p', { className: 'library-kicker' }, 'ჩემი წიგნები'),
                      h('article', { className: 'library-book-card' }, h('img', { src: catalogItem.cover, alt: catalogItem.title, className: 'library-book-cover', loading: 'lazy' }), h('div', null, h('h2', null, catalogItem.title), h('p', null, 'Approved სტატუსის შემდეგ წიგნი აქ გაიხსნება.'))),
                      orders.length ? h('div', { className: 'library-order-list' }, orders.map((order) => h('p', { key: order.paymentCode }, `${order.paymentCode} / ${order.status}`))) : h('p', { className: 'library-muted' }, 'ჯერ დადასტურებული წიგნი არ გაქვს.')
                    ),
                    h(OrderPanel, { user, orders, onChanged: () => setRefreshKey((value) => value + 1) })
                  )
            )
          : h(LibraryLogin, { onLogin: setUser })
      ),
      h(Footer, { lang })
    );
  }

  window.Team4ManualLibraryPage = LibraryPage;
})();

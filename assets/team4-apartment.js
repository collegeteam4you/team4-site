// ==========================================
// TEAM4 APARTMENT SYSTEM
// ==========================================

(function () {
  const { createElement: h } = React;

  // ==========================================
  // APARTMENT PAGE
  // ==========================================

  function Team4ApartmentPage({ lang, setLang }) {
    const isGeo = lang === 'GEO';
    const [negotiationApartment, setNegotiationApartment] =
  React.useState(null);

const [negotiationStep, setNegotiationStep] =
  React.useState('start');
    const [negotiationScore, setNegotiationScore] =
  React.useState(0);
const [avatar, setAvatar] =
  React.useState(null);

React.useEffect(function () {
  try {
    const savedUser =
      localStorage.getItem('team4LabUser');

    if (savedUser) {
      const user =
        JSON.parse(savedUser);

      if (user.avatar) {
        setAvatar(user.avatar);
        return;
      }
    }

    setAvatar({
      gender:
        localStorage.getItem('team4AvatarGender') ||
        'male',

      look:
        localStorage.getItem('team4AvatarLook') ||
        'team4-look',

      hair:
        localStorage.getItem('team4AvatarHair') ||
        'none',

      beard:
        localStorage.getItem('team4AvatarBeard') ||
        'none',

      accessory:
        localStorage.getItem('team4AvatarAccessory') ||
        'none',

      hairX:
        Number(
          localStorage.getItem('team4AvatarHairX')
        ) || 0,

      hairY:
        Number(
          localStorage.getItem('team4AvatarHairY')
        ) || 0,

      hairScale:
        Number(
          localStorage.getItem('team4AvatarHairScale')
        ) || 1,

      beardX:
        Number(
          localStorage.getItem('team4AvatarBeardX')
        ) || 0,

      beardY:
        Number(
          localStorage.getItem('team4AvatarBeardY')
        ) || 0,

      beardScale:
        Number(
          localStorage.getItem(
            'team4AvatarBeardScale'
          )
        ) || 1,

      accessoryX:
        Number(
          localStorage.getItem(
            'team4AvatarAccessoryX'
          )
        ) || 0,

      accessoryY:
        Number(
          localStorage.getItem(
            'team4AvatarAccessoryY'
          )
        ) || 0,

      accessoryScale:
        Number(
          localStorage.getItem(
            'team4AvatarAccessoryScale'
          )
        ) || 1,
    });
  } catch (error) {
    console.error(
      'Apartment avatar load error:',
      error
    );
  }
}, []);
    // ==========================================
    // APARTMENTS
    // ==========================================

    const apartments = [
      {
        id: 'economy',

        image:
          '/assets/team4-lab/apartment/Economy.png',

        titleGeo:
          'Apartment #1 — Economy',

        titleEng:
          'Apartment #1 — Economy',

        districtGeo:
          'გლდანი',

        districtEng:
          'Gldani',

        rent: 650,
        deposit: 650,

        locked: false,

        metroGeo:
          'მეტრო: 12 წუთი ფეხით',

        metroEng:
          'Metro: 12 min walk',

        officeGeo:
          'ოფისამდე: დაახლოებით 40 წუთი',

        officeEng:
          'Office commute: about 40 min',

        descriptionGeo:
          'პატარა და მარტივი ბინა. დაბალი ქირა, მაგრამ ოფისამდე უფრო დიდი გზა.',

        descriptionEng:
          'A small and simple apartment. Lower rent, but a longer commute to the office.',
      },

      {
        id: 'comfort',

        image:
          '/assets/team4-lab/apartment/Comfort.png',

        titleGeo:
          'Apartment #2 — Comfort',

        titleEng:
          'Apartment #2 — Comfort',

        districtGeo:
          'საბურთალო',

        districtEng:
          'Saburtalo',

        rent: 900,
        deposit: 900,

        locked: false,

        metroGeo:
          'მეტრო: 5 წუთი ფეხით',

        metroEng:
          'Metro: 5 min walk',

        officeGeo:
          'ოფისამდე: დაახლოებით 18 წუთი',

        officeEng:
          'Office commute: about 18 min',

        descriptionGeo:
          'უკეთესი მდებარეობა და პირობები. უფრო ძვირია, მაგრამ ყოველდღიურად დროს ზოგავ.',

        descriptionEng:
          'Better location and living conditions. More expensive, but saves time every day.',
      },

      {
        id: 'own',

        image:
          '/assets/team4-lab/apartment/Own%20Apartment.png',

        titleGeo:
          'Apartment #3 — საკუთარი ბინა',

        titleEng:
          'Apartment #3 — Own Apartment',

        districtGeo:
          'ვაკე',

        districtEng:
          'Vake',

        rent: null,
        deposit: null,

        locked: true,

        metroGeo:
          'პრემიუმ ლოკაცია',

        metroEng:
          'Premium location',

        officeGeo:
          'საკუთარი უძრავი ქონება',

        officeEng:
          'Your own property',

        descriptionGeo:
          'ეს ბინა არ ქირავდება — მისი შეძენა შესაძლებელი გახდება კარიერული და ფინანსური პროგრესის შემდეგ.',

        descriptionEng:
          'This apartment is not for rent. It becomes available for purchase after career and financial progress.',
      },
    ];

    // ==========================================
    // START NEGOTIATION
    // ==========================================

   function startNegotiation(apartment) {
  if (apartment.locked) {
    return;
  }

  localStorage.setItem(
    'team4SelectedApartment',
    JSON.stringify(apartment)
  );

  setNegotiationApartment(apartment);

  setNegotiationStep('q1');

  setNegotiationScore(0);
}
function renderApartmentAvatar() {
  if (!avatar) {
    return null;
  }
const playerName =
  localStorage.getItem('team4PlayerName') ||
  (isGeo ? 'შენი პერსონაჟი' : 'YOUR CHARACTER');
  const hairAdjustments = {
    male: {
      'hair-m-01': { width: '29%', top: '0.8%', x: '0%' },
      'hair-m-02': { width: '28%', top: '0.1%', x: '0%' },
      'hair-m-03': { width: '29%', top: '0.1%', x: '0%' },
      'hair-m-04': { width: '26%', top: '0.1%', x: '0%' },
      'hair-m-05': { width: '29%', top: '0.1%', x: '0%' },
      'hair-m-06': { width: '29%', top: '0.1%', x: '0%' },
      'hair-m-09': { width: '30%', top: '0.1%', x: '0%' },
      'hair-m-10': { width: '28%', top: '0.1%', x: '0%' },
      'hair-m-12': { width: '29%', top: '-2%', x: '0%' },
      'hair-m-13': { width: '30%', top: '0.1%', x: '0%' },
      'hair-m-14': { width: '26%', top: '0.1%', x: '0%' },
      'hair-m-16': { width: '28%', top: '0.1%', x: '0%' },
      'hair-m-18': { width: '31%', top: '0.1%', x: '0%' },
    },

    female: {
      'hair-f-01': { width: '32.5%', top: '2%', x: '0%' },
      'hair-f-02': { width: '33%', top: '5%', x: '0%' },
      'hair-f-03': { width: '34%', top: '5%', x: '0%' },
      'hair-f-05': { width: '34%', top: '3%', x: '0%' },
      'hair-f-06': { width: '33%', top: '5%', x: '0%' },
      'hair-f-08': { width: '34%', top: '5%', x: '0%' },
      'hair-f-09': { width: '34%', top: '5%', x: '0%' },
      'hair-f-10': { width: '32%', top: '3%', x: '0%' },
      'hair-f-11': { width: '32%', top: '5%', x: '0%' },
      'hair-f-12': { width: '32%', top: '5%', x: '0%' },
      'hair-f-15': { width: '35%', top: '5%', x: '0%' },
      'hair-f-18': { width: '34%', top: '4%', x: '0%' },
    },
  };

  const beardAdjustments = {
    'beard-01': {
      width: '29%',
      top: '14%',
      x: '0%',
    },

    'beard-02': {
      width: '29%',
      top: '15%',
      x: '0%',
    },

    'beard-03': {
      width: '32%',
      top: '15%',
      x: '0%',
    },
  };

  const hairStyle =
    hairAdjustments[avatar.gender]?.[
      avatar.hair
    ] || {
      width:
        avatar.gender === 'male'
          ? '28%'
          : '33%',

      top:
        avatar.gender === 'male'
          ? '7%'
          : '5%',

      x: '0%',
    };

  const beardStyle =
    beardAdjustments[avatar.beard] || {
      width: '19%',
      top: '13%',
      x: '0%',
    };

  return h(
    'div',
    {
      style: {
        width: '220px',
        height: '520px',

        flexShrink: 0,

        position: 'relative',

        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      },
    },

    h(
      'div',
      {
        style: {
          width: '460px',
          height: '680px',

          position: 'absolute',

          left: '50%',
          bottom: '0',

          transform:
            'translateX(-50%) scale(.62) scaleY(.90)',

          transformOrigin:
            'bottom center',
        },
      },

      // LOOK / BODY
      h('img', {
        src:
          '/assets/avatar-v2/looks/' +
          avatar.gender +
          '/' +
          avatar.look +
          '.png',

        alt: '',

        style: {
          position: 'absolute',
          inset: 0,

          width: '100%',
          height: '100%',

          objectFit: 'contain',

          zIndex: 1,
        },
      }),

      // BEARD
      avatar.gender === 'male' &&
      avatar.beard !== 'none' &&
      h('img', {
        src:
          '/assets/avatar-v2/beard/' +
          avatar.beard +
          '.png',

        alt: '',

        style: {
          position: 'absolute',

          width:
            beardStyle.width,

          height: 'auto',

          left: '50%',
          top:
            beardStyle.top,

          transform:
            'translateX(calc(-50% + ' +
            beardStyle.x +
            ')) ' +
            'translate(' +
            (avatar.beardX || 0) +
            'px, ' +
            (avatar.beardY || 0) +
            'px) ' +
            'scale(' +
            (avatar.beardScale || 1) +
            ')',

          transformOrigin:
            'center top',

          zIndex: 7,
        },
      }),

      // HAIR
      avatar.hair !== 'none' &&
      h('img', {
        src:
          avatar.gender === 'male'
            ? '/assets/avatar-v2/hair/male/' +
              avatar.hair +
              '.png'
            : '/assets/avatar-v2/hair/female/' +
              avatar.hair +
              '.png',

        alt: '',

        style: {
          position: 'absolute',

          width:
            hairStyle.width,

          height: 'auto',

          left: '50%',
          top:
            hairStyle.top,

          transform:
            'translateX(calc(-50% + ' +
            hairStyle.x +
            ')) ' +
            'translate(' +
            (avatar.hairX || 0) +
            'px, ' +
            (avatar.hairY || 0) +
            'px) ' +
            'scale(' +
            (avatar.hairScale || 1) +
            ')',

          transformOrigin:
            'center top',

          zIndex: 8,
        },
      }),

      // ACCESSORY
      avatar.accessory !== 'none' &&
      h('img', {
        src:
          '/assets/avatar-v2/accessories/' +
          avatar.accessory +
          '.png',

        alt: '',

        style: {
          position: 'absolute',

          width: '24%',
          height: 'auto',

          left: '50%',
          top: '16%',

          transform:
            'translateX(-50%) ' +
            'translate(' +
            (avatar.accessoryX || 0) +
            'px, ' +
            (avatar.accessoryY || 0) +
            'px) ' +
            'scale(' +
            (avatar.accessoryScale || 1) +
            ')',

          transformOrigin:
            'center top',

          zIndex: 9,
        },
      })
    ),

   // ==========================================
// PLAYER LABEL
// ==========================================

h(
  'div',
  {
    style: {
      position: 'absolute',

      bottom: '8px',
      left: '50%',

      transform: 'translateX(-50%)',

      padding: '8px 18px',

      borderRadius: '999px',

      background: 'rgba(0,0,0,.78)',

      border:
        '1px solid rgba(255,255,255,.12)',

      color: '#ffffff',

      fontSize: '12px',

      fontWeight: '900',

      letterSpacing: '1px',

      whiteSpace: 'nowrap',

      zIndex: 20,
    },
  },

  playerName
)
);
}
    // ==========================================
    // RENDER
    // ==========================================

    return h(
      React.Fragment,
      null,

      // ========================================
      // HEADER
      // ========================================

      h(Header, {
        lang,
        setLang,
      }),

      // ========================================
      // MAIN
      // ========================================

      h(
        'main',
        {
          style: {
            minHeight:
              '100vh',

            padding:
              '130px 24px 80px',

            background:
              '#050507',

            color:
              '#ffffff',
          },
        },

        h(
          'section',
          {
            style: {
              maxWidth:
                '1180px',

              margin:
                '0 auto',
            },
          },

          // ====================================
          // KICKER
          // ====================================

          h(
            'div',
            {
              style: {
                marginBottom:
                  '10px',

                color:
                  '#ef1b13',

                fontSize:
                  '13px',

                fontWeight:
                  '900',

                letterSpacing:
                  '.12em',

                textTransform:
                  'uppercase',
              },
            },

            isGeo
              ? 'ახალი ეტაპი'
              : 'NEW CHAPTER'
          ),

          // ====================================
          // TITLE
          // ====================================

          h(
            'h1',
            {
              style: {
                margin:
                  '0 0 12px',

                fontSize:
                  'clamp(34px,5vw,58px)',

                fontWeight:
                  '900',
              },
            },

            isGeo
              ? 'შენი ახალი ცხოვრება იწყება.'
              : 'Your new life starts now.'
          ),

          // ====================================
          // SUBTITLE
          // ====================================

          h(
            'p',
            {
              style: {
                maxWidth:
                  '760px',

                margin:
                  '0 0 34px',

                color:
                  'rgba(255,255,255,.65)',

                fontSize:
                  '16px',

                lineHeight:
                  '1.6',
              },
            },

            isGeo
              ? 'აირჩიე სად იცხოვრებ. გაითვალისწინე არა მხოლოდ ქირა, არამედ დრო, ლოკაცია და ყოველდღიური ხარჯები.'
              : 'Choose where you will live. Consider not only rent, but also time, location and daily expenses.'
          ),

          // ====================================
          // STARTING CASH
          // ====================================

          h(
            'div',
            {
              style: {
                marginBottom:
                  '24px',

                padding:
                  '14px 18px',

                display:
                  'inline-flex',

                alignItems:
                  'center',

                gap:
                  '10px',

                borderRadius:
                  '12px',

                background:
                  'rgba(40,180,90,.10)',

                border:
                  '1px solid rgba(40,180,90,.30)',

                fontSize:
                  '15px',

                fontWeight:
                  '900',
              },
            },

            isGeo
              ? '💰 საწყისი თანხა: 2,450 ₾'
              : '💰 Starting Cash: 2,450 ₾'
          ),

          // ====================================
          // APARTMENT GRID
          // ====================================

          h(
            'div',
            {
              style: {
                display:
                  'grid',

                gridTemplateColumns:
                  'repeat(auto-fit, minmax(320px, 1fr))',

                gap:
                  '22px',
              },
            },

            apartments.map(
              function (apartment) {
                return h(
                  'div',
                  {
                    key:
                      apartment.id,

                    style: {
                      overflow:
                        'hidden',

                      borderRadius:
                        '22px',

                      background:
                        '#111319',

                      border:
                        '1px solid rgba(255,255,255,.10)',

                      boxShadow:
                        '0 20px 55px rgba(0,0,0,.30)',

                      transition:
                        'transform .2s ease, border-color .2s ease',

                      opacity:
                        apartment.locked
                          ? 0.82
                          : 1,
                    },

                    onMouseEnter:
                      function (event) {
                        if (
                          apartment.locked
                        ) {
                          return;
                        }

                        event.currentTarget.style.transform =
                          'translateY(-4px)';

                        event.currentTarget.style.borderColor =
                          'rgba(239,27,19,.35)';
                      },

                    onMouseLeave:
                      function (event) {
                        if (
                          apartment.locked
                        ) {
                          return;
                        }

                        event.currentTarget.style.transform =
                          'translateY(0)';

                        event.currentTarget.style.borderColor =
                          'rgba(255,255,255,.10)';
                      },
                  },

                  // =================================
                  // APARTMENT IMAGE
                  // =================================

                  h(
                    'div',
                    {
                      style: {
                        width:
                          '100%',

                        height:
                          '280px',

                        overflow:
                          'hidden',

                        position:
                          'relative',

                        background:
                          '#090a0d',

                        borderBottom:
                          '1px solid rgba(255,255,255,.08)',
                      },
                    },

                    h('img', {
                      src:
                        apartment.image,

                      alt:
                        isGeo
                          ? apartment.titleGeo
                          : apartment.titleEng,

                      onError:
                        function (event) {
                          console.error(
                            'Apartment image failed:',
                            apartment.image
                          );

                          event.currentTarget.style.display =
                            'none';
                        },

                      style: {
                        width:
                          '100%',

                        height:
                          '100%',

                        display:
                          'block',

                        objectFit:
                          'cover',

                        filter:
                          apartment.locked
                            ? 'brightness(.42) saturate(.65)'
                            : 'none',
                      },
                    }),

                    // =================================
                    // LOCK OVERLAY
                    // =================================

                    apartment.locked &&
                      h(
                        'div',
                        {
                          style: {
                            position:
                              'absolute',

                            inset:
                              0,

                            display:
                              'flex',

                            flexDirection:
                              'column',

                            alignItems:
                              'center',

                            justifyContent:
                              'center',

                            gap:
                              '10px',

                            background:
                              'rgba(0,0,0,.18)',

                            pointerEvents:
                              'none',
                          },
                        },

                        h(
                          'div',
                          {
                            style: {
                              fontSize:
                                '54px',
                            },
                          },

                          '🔒'
                        ),

                        h(
                          'div',
                          {
                            style: {
                              padding:
                                '8px 14px',

                              borderRadius:
                                '10px',

                              background:
                                'rgba(0,0,0,.55)',

                              color:
                                '#ffffff',

                              fontSize:
                                '14px',

                              fontWeight:
                                '900',
                            },
                          },

                          isGeo
                            ? 'ჯერ ჩაკეტილია'
                            : 'Currently Locked'
                        )
                      )
                  ),

                  // =================================
                  // APARTMENT CONTENT
                  // =================================

                  h(
                    'div',
                    {
                      style: {
                        padding:
                          '24px',
                      },
                    },

                    // ===============================
                    // TITLE
                    // ===============================

                    h(
                      'h2',
                      {
                        style: {
                          margin:
                            '0 0 8px',

                          fontSize:
                            '25px',

                          fontWeight:
                            '900',
                        },
                      },

                      isGeo
                        ? apartment.titleGeo
                        : apartment.titleEng
                    ),

                    // ===============================
                    // DISTRICT
                    // ===============================

                    h(
                      'div',
                      {
                        style: {
                          marginBottom:
                            '20px',

                          color:
                            '#ef1b13',

                          fontSize:
                            '17px',

                          fontWeight:
                            '900',
                        },
                      },

                      '📍 ' +
                        (
                          isGeo
                            ? apartment.districtGeo
                            : apartment.districtEng
                        )
                    ),

                    // ===============================
                    // RENT / LOCK
                    // ===============================

                    h(
                      'div',
                      {
                        style: {
                          marginBottom:
                            '8px',

                          fontSize:
                            '20px',

                          fontWeight:
                            '900',

                          color:
                            apartment.locked
                              ? '#f6c744'
                              : '#ffffff',
                        },
                      },

                      apartment.locked
                        ? (
                            isGeo
                              ? '🔒 ჯერ მიუწვდომელია'
                              : '🔒 Currently Locked'
                          )
                        : (
                            isGeo
                              ? 'ქირა: ' +
                                apartment.rent +
                                ' ₾ / თვე'
                              : 'Rent: ' +
                                apartment.rent +
                                ' ₾ / month'
                          )
                    ),

                    // ===============================
                    // DEPOSIT / CAPITAL MESSAGE
                    // ===============================

                    h(
                      'div',
                      {
                        style: {
                          marginBottom:
                            '18px',

                          color:
                            apartment.locked
                              ? '#f6c744'
                              : 'rgba(255,255,255,.72)',

                          fontWeight:
                            '700',
                        },
                      },

                      apartment.locked
                        ? (
                            isGeo
                              ? 'გაზარდე შემოსავალი და დააგროვე კაპიტალი'
                              : 'Increase your income and build capital'
                          )
                        : (
                            isGeo
                              ? 'დეპოზიტი: ' +
                                apartment.deposit +
                                ' ₾'
                              : 'Deposit: ' +
                                apartment.deposit +
                                ' ₾'
                          )
                    ),

                    // ===============================
                    // INFO BOX
                    // ===============================

                    h(
                      'div',
                      {
                        style: {
                          marginBottom:
                            '18px',

                          padding:
                            '15px',

                          display:
                            'grid',

                          gap:
                            '9px',

                          borderRadius:
                            '12px',

                          background:
                            'rgba(255,255,255,.04)',

                          border:
                            '1px solid rgba(255,255,255,.07)',

                          color:
                            'rgba(255,255,255,.76)',

                          fontSize:
                            '14px',
                        },
                      },

                      h(
                        'div',
                        null,

                        '🚇 ' +
                          (
                            isGeo
                              ? apartment.metroGeo
                              : apartment.metroEng
                          )
                      ),

                      h(
                        'div',
                        null,

                        '🏢 ' +
                          (
                            isGeo
                              ? apartment.officeGeo
                              : apartment.officeEng
                          )
                      )
                    ),

                    // ===============================
                    // DESCRIPTION
                    // ===============================

                    h(
                      'p',
                      {
                        style: {
                          minHeight:
                            '52px',

                          margin:
                            '0 0 22px',

                          color:
                            'rgba(255,255,255,.62)',

                          lineHeight:
                            '1.6',
                        },
                      },

                      isGeo
                        ? apartment.descriptionGeo
                        : apartment.descriptionEng
                    ),

                    // ===============================
                    // BUTTON
                    // ===============================

                    h(
                      'button',
                      {
                        type:
                          'button',

                        disabled:
                          apartment.locked,

                        onClick:
                          function () {
                            if (
                              apartment.locked
                            ) {
                              return;
                            }

                            startNegotiation(
                              apartment
                            );
                          },

                        style: {
                          width:
                            '100%',

                          padding:
                            '15px 18px',

                          border:
                            'none',

                          borderRadius:
                            '12px',

                          background:
                            apartment.locked
                              ? '#292c33'
                              : '#ef1b13',

                          color:
                            '#ffffff',

                          fontSize:
                            '14px',

                          fontWeight:
                            '900',

                          cursor:
                            apartment.locked
                              ? 'not-allowed'
                              : 'pointer',

                          opacity:
                            apartment.locked
                              ? 0.65
                              : 1,

                          transition:
                            'transform .18s ease, background .18s ease',
                        },

                        onMouseEnter:
                          function (event) {
                            if (
                              apartment.locked
                            ) {
                              return;
                            }

                            event.currentTarget.style.transform =
                              'translateY(-2px)';

                            event.currentTarget.style.background =
                              '#ff2118';
                          },

                        onMouseLeave:
                          function (event) {
                            if (
                              apartment.locked
                            ) {
                              return;
                            }

                            event.currentTarget.style.transform =
                              'translateY(0)';

                            event.currentTarget.style.background =
                              '#ef1b13';
                          },
                      },

                      apartment.locked
                        ? (
                            isGeo
                              ? '🔒 ჩაკეტილია'
                              : '🔒 Locked'
                          )
                        : (
                            isGeo
                              ? 'მოლაპარაკება მეპატრონესთან →'
                              : 'Negotiate with Landlord →'
                          )
                    )
                  )
                );
              }
            )
          ),
          negotiationApartment &&
          h(
            'div',
            {
              style: {
                position: 'fixed',
                inset: 0,
                zIndex: 9999,

                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
gap: '30px',
                padding: '24px',

                background: 'rgba(0,0,0,.82)',
                backdropFilter: 'blur(10px)',
              },
            },
// ==========================================
// LANDLORD CHARACTER
// ==========================================

h(
  'div',
  {
    style: {
      width: '260px',
      height: '560px',
      flexShrink: 0,

      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-end',

      position: 'relative',
    },
  },

  h('img', {
    src:
      '/assets/team4-lab/apartment/landlord-female.png',

    alt:
      isGeo
        ? 'მეპატრონე'
        : 'Landlord',

    style: {
      width: '100%',
      height: '100%',

      objectFit: 'contain',
      objectPosition: 'bottom center',

      display: 'block',

      filter:
        'drop-shadow(0 20px 35px rgba(0,0,0,.65))',
    },
  }),

  h(
    'div',
    {
      style: {
        position: 'absolute',

        bottom: '8px',
        left: '50%',

        transform:
          'translateX(-50%)',

        padding:
          '8px 18px',

        borderRadius:
          '999px',

        background:
          'rgba(0,0,0,.78)',

        border:
          '1px solid rgba(255,255,255,.12)',

        color:
          '#ffffff',

        fontSize:
          '12px',

        fontWeight:
          '900',

        letterSpacing:
          '1px',

        whiteSpace:
          'nowrap',
      },
    },

    isGeo
      ? 'მეპატრონე'
      : 'LANDLORD'
  )
),
            h(
              'div',
              {
                style: {
                  width: '100%',
                  maxWidth: '760px',

                  padding: '30px',

                  borderRadius: '22px',

                  background: '#111319',

                  border:
                    '1px solid rgba(255,255,255,.12)',

                  boxShadow:
                    '0 30px 90px rgba(0,0,0,.55)',
                },
              },

              h(
                'div',
                {
                  style: {
                    marginBottom: '10px',

                    color: '#ef1b13',

                    fontSize: '13px',
                    fontWeight: '900',

                    letterSpacing: '.12em',
                  },
                },

                'NEGOTIATION MISSION'
              ),

              h(
                'h2',
                {
                  style: {
                    margin: '0 0 18px',

                    fontSize: '30px',
                    fontWeight: '900',
                  },
                },

                isGeo
                  ? 'მოლაპარაკება მეპატრონესთან'
                  : 'Negotiate with the Landlord'
              ),

              h(
                'div',
                {
                  style: {
                    marginBottom: '22px',
                    padding: '20px',

                    borderRadius: '16px',

                    background:
                      'rgba(255,255,255,.04)',

                    border:
                      '1px solid rgba(255,255,255,.08)',
                  },
                },

                h(
                  'div',
                  {
                    style: {
                      marginBottom: '8px',

                      color: '#f6c744',

                      fontSize: '13px',
                      fontWeight: '900',
                    },
                  },

                  isGeo
                    ? 'მეპატრონე'
                    : 'Landlord'
                ),

                h(
                  'div',
                  {
                    style: {
                      fontSize: '17px',
                      lineHeight: '1.65',
                    },
                  },

                  negotiationApartment.id === 'economy'
                    ? (
                        isGeo
                          ? 'ქირა 650 ₾-ია. დეპოზიტიც 650 ₾. პირველი თვე და დეპოზიტი წინასწარ.'
                          : 'The rent is 650 ₾. The deposit is also 650 ₾. The first month and deposit are due upfront.'
                      )
                    : (
                        isGeo
                          ? 'ქირა 900 ₾-ია. დეპოზიტიც 900 ₾. ბინა კარგ ლოკაციაზეა და პირობებიც უკეთესია.'
                          : 'The rent is 900 ₾. The deposit is also 900 ₾. The apartment is in a better location and has better conditions.'
                      )
                )
              ),

              h(
                'div',
                {
                  style: {
                    display: 'grid',
                    gap: '12px',
                  },
                },

                h(
                  'button',
                  {
                    type: 'button',

                    onClick: function () {
                      setNegotiationStep('accepted');
                    },

                    style: {
                      width: '100%',
                      padding: '15px 16px',

                      border:
                        '1px solid rgba(255,255,255,.10)',

                      borderRadius: '12px',

                      background: '#0d0f14',
                      color: '#ffffff',

                      textAlign: 'left',

                      fontSize: '14px',
                      fontWeight: '800',

                      cursor: 'pointer',
                    },
                  },

                  isGeo
                    ? 'A. კარგი, თანახმა ვარ.'
                    : 'A. Okay, I agree.'
                ),

                h(
                  'button',
                  {
                    type: 'button',

                    onClick: function () {
                      setNegotiationStep('counter');
                    },

                    style: {
                      width: '100%',
                      padding: '15px 16px',

                      border:
                        '1px solid rgba(255,255,255,.10)',

                      borderRadius: '12px',

                      background: '#0d0f14',
                      color: '#ffffff',

                      textAlign: 'left',

                      fontSize: '14px',
                      fontWeight: '800',

                      cursor: 'pointer',
                    },
                  },

                  negotiationApartment.id === 'economy'
                    ? (
                        isGeo
                          ? 'B. თუ დღესვე გავაფორმებთ, 600 ₾-ზე შევთანხმდეთ?'
                          : 'B. If we sign today, can we agree on 600 ₾?'
                      )
                    : (
                        isGeo
                          ? 'B. თუ დღესვე გავაფორმებთ, 850 ₾-ზე შევთანხმდეთ?'
                          : 'B. If we sign today, can we agree on 850 ₾?'
                      )
                ),

                h(
                  'button',
                  {
                    type: 'button',

                    onClick: function () {
                      setNegotiationStep('deposit');
                    },

                    style: {
                      width: '100%',
                      padding: '15px 16px',

                      border:
                        '1px solid rgba(255,255,255,.10)',

                      borderRadius: '12px',

                      background: '#0d0f14',
                      color: '#ffffff',

                      textAlign: 'left',

                      fontSize: '14px',
                      fontWeight: '800',

                      cursor: 'pointer',
                    },
                  },

                  isGeo
                    ? 'C. ქირას ვეთანხმები, მაგრამ დეპოზიტი ორ ნაწილად გადავიხადო.'
                    : 'C. I agree to the rent, but can I split the deposit into two payments?'
                ),

                h(
                  'button',
                  {
                    type: 'button',

                    onClick: function () {
                      setNegotiationStep('aggressive');
                    },

                    style: {
                      width: '100%',
                      padding: '15px 16px',

                      border:
                        '1px solid rgba(255,255,255,.10)',

                      borderRadius: '12px',

                      background: '#0d0f14',
                      color: '#ffffff',

                      textAlign: 'left',

                      fontSize: '14px',
                      fontWeight: '800',

                      cursor: 'pointer',
                    },
                  },

                  negotiationApartment.id === 'economy'
                    ? (
                        isGeo
                          ? 'D. ამ ბინაში 650 ₾ ბევრია. მაქსიმუმ 500 ₾.'
                          : 'D. 650 ₾ is too much for this apartment. Maximum 500 ₾.'
                      )
                    : (
                        isGeo
                          ? 'D. 900 ₾ ზედმეტია. მაქსიმუმ 700 ₾.'
                          : 'D. 900 ₾ is too much. Maximum 700 ₾.'
                      )
                )
              ),

              h(
                'button',
                {
                  type: 'button',

                  onClick: function () {
                    setNegotiationApartment(null);
                    setNegotiationStep('start');
                  },

                  style: {
                    marginTop: '20px',

                    padding: '11px 16px',

                    border:
                      '1px solid rgba(255,255,255,.12)',

                    borderRadius: '10px',

                    background: 'transparent',
                    color: '#ffffff',

                    fontWeight: '800',

                    cursor: 'pointer',
                  },
                },

                               isGeo
                  ? 'დახურვა'
                  : 'Close'
              )
            ),

            // ==========================================
            // PLAYER AVATAR - RIGHT SIDE
            // ==========================================

            renderApartmentAvatar()
          ),

          // ====================================
          // INFO
          // ====================================
          // ====================================
          // INFO
          // ====================================

          h(
            'div',
            {
              style: {
                marginTop:
                  '26px',

                padding:
                  '18px',

                borderRadius:
                  '14px',

                background:
                  'rgba(255,215,0,.06)',

                border:
                  '1px solid rgba(255,215,0,.16)',

                color:
                  'rgba(255,255,255,.72)',

                fontSize:
                  '14px',

                lineHeight:
                  '1.6',
              },
            },

            isGeo
              ? '💡 ბინის ფასი საბოლოო არ არის. მეპატრონესთან შეგიძლია ივაჭრო ქირაზე, დეპოზიტზე და გადახდის პირობებზე.'
              : '💡 The listed price is not necessarily final. You can negotiate rent, deposit, and payment terms with the landlord.'
          )
        )
      )
    );
  }

  // ==========================================
  // EXPORT
  // ==========================================

  window.Team4ApartmentPage =
    Team4ApartmentPage;
})();

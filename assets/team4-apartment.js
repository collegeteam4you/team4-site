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
    function negotiationAnswerStyle() {
  return {
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

    transition:
      'transform .18s ease, border-color .18s ease, background .18s ease',
  };
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

             

               
             // ==========================================
// COMPLETE NEGOTIATION ENGINE
// ==========================================

(function () {
  const isEconomy =
    negotiationApartment.id === 'economy';

  function txt(geo, eng) {
    return isGeo ? geo : eng;
  }

  function go(nextStep, points) {
    setNegotiationScore(function (current) {
      return current + (points || 0);
    });

    setNegotiationStep(nextStep);
  }

  function finishDeal(finalRent, deposit, result) {
    const deal = {
      apartmentId: negotiationApartment.id,
      apartment:
        isGeo
          ? negotiationApartment.titleGeo
          : negotiationApartment.titleEng,

      rent: finalRent,
      deposit: deposit,
      result: result,

      score: negotiationScore,
    };

    localStorage.setItem(
      'team4ApartmentDeal',
      JSON.stringify(deal)
    );

    localStorage.setItem(
      'team4SelectedApartment',
      JSON.stringify(
        Object.assign(
          {},
          negotiationApartment,
          {
            finalRent: finalRent,
            finalDeposit: deposit,
            negotiated: true,
          }
        )
      )
    );
  }

  // ==========================================
  // ALL NEGOTIATION SCENES
  // ==========================================

  const scenes = {

    // ========================================
    // QUESTION 1
    // ========================================

    q1: {
      text:
        isEconomy
          ? txt(
              'ქირა 650 ₾-ია. დეპოზიტიც 650 ₾. პირველი თვე და დეპოზიტი წინასწარ უნდა გადაიხადო.',
              'The rent is 650 ₾. The deposit is also 650 ₾. The first month and deposit must be paid upfront.'
            )
          : txt(
              'ქირა 900 ₾-ია. დეპოზიტიც 900 ₾. პირველი თვე და დეპოზიტი წინასწარ უნდა გადაიხადო.',
              'The rent is 900 ₾. The deposit is also 900 ₾. The first month and deposit must be paid upfront.'
            ),

      answers: [
        {
          text: txt(
            'A. კარგი, თანახმა ვარ. ყველაფერს გადავიხდი.',
            'A. Okay, I agree. I will pay everything.'
          ),
          next: 'direct_1',
          score: 0,
        },

        {
          text:
            isEconomy
              ? txt(
                  'B. თუ დღესვე გავაფორმებთ, 600 ₾-ზე შევთანხმდეთ?',
                  'B. If we sign today, can we agree on 600 ₾?'
                )
              : txt(
                  'B. თუ დღესვე გავაფორმებთ, 850 ₾-ზე შევთანხმდეთ?',
                  'B. If we sign today, can we agree on 850 ₾?'
                ),

          next: 'price_1',
          score: 2,
        },

        {
          text: txt(
            'C. ქირას ვეთანხმები, მაგრამ შეიძლება დეპოზიტი ორ ნაწილად გადავიხადო?',
            'C. I agree to the rent, but can I split the deposit into two payments?'
          ),

          next: 'deposit_1',
          score: 2,
        },

        {
          text:
            isEconomy
              ? txt(
                  'D. 650 ₾ ძალიან ბევრია. მაქსიმუმ 500 ₾.',
                  'D. 650 ₾ is too much. Maximum 500 ₾.'
                )
              : txt(
                  'D. 900 ₾ ძალიან ბევრია. მაქსიმუმ 700 ₾.',
                  'D. 900 ₾ is too much. Maximum 700 ₾.'
                ),

          next: 'aggressive_1',
          score: -1,
        },
      ],
    },

    // ========================================
    // A PATH — ACCEPT IMMEDIATELY
    // ========================================

    direct_1: {
      text: txt(
        'კარგი. მაშინ პირობები უცვლელია. პირველი თვის ქირა და სრული დეპოზიტი დღესვე უნდა გადაიხადო.',
        'Good. Then the terms remain unchanged. The first month and full deposit must be paid today.'
      ),

      answers: [
        {
          text: txt(
            'A. გასაგებია. გადავიხდი.',
            'A. Understood. I will pay.'
          ),
          next: 'direct_2',
          score: 0,
        },

        {
          text: txt(
            'B. სანამ გადავიხდი, შეიძლება დეპოზიტის პირობებზე მაინც ვისაუბროთ?',
            'B. Before I pay, can we at least discuss the deposit terms?'
          ),
          next: 'direct_2',
          score: 1,
        },

        {
          text: txt(
            'C. თუ დღესვე გადავიხდი, რაიმე შეღავათს ხომ ვერ გამიკეთებთ?',
            'C. If I pay today, could you offer me any concession?'
          ),
          next: 'direct_2',
          score: 2,
        },
      ],
    },

    direct_2: {
      text: txt(
        'ფასზე უკვე შევთანხმდით, მაგრამ თუ დღესვე აფორმებ, დეპოზიტზე მცირე მოქნილობა შეიძლება.',
        'We already agreed on the price, but if you sign today, I may be flexible on the deposit.'
      ),

      answers: [
        {
          text: txt(
            'A. მაშინ დეპოზიტი ორ ნაწილად გადავიხადო.',
            'A. Then let me split the deposit into two payments.'
          ),
          next: 'direct_3',
          score: 2,
        },

        {
          text: txt(
            'B. არა, ყველაფერი დღესვე გადავიხდი.',
            'B. No, I will pay everything today.'
          ),
          next: 'direct_3',
          score: 0,
        },

        {
          text: txt(
            'C. დეპოზიტის ნახევარი დღეს და ნახევარი შემდეგ თვეში?',
            'C. Half the deposit today and half next month?'
          ),
          next: 'direct_3',
          score: 2,
        },
      ],
    },

    direct_3: {
      text: txt(
        'კარგი. შეგვიძლია დეპოზიტი ორ ნაწილად გავყოთ. ქირის ფასი უცვლელი რჩება.',
        'Okay. We can split the deposit into two payments. The rent remains unchanged.'
      ),

      answers: [
        {
          text: txt(
            'შევთანხმდით →',
            'Deal →'
          ),
          next: 'direct_success',
          score: 1,
        },
      ],
    },

    // ========================================
    // B PATH — PRICE NEGOTIATION
    // ========================================

    price_1: {
      text:
        isEconomy
          ? txt(
              '600 ₾ ცოტაა. 630 ₾ შემიძლია შემოგთავაზო, თუ დღესვე გადავწყვეტთ.',
              '600 ₾ is too low. I can offer 630 ₾ if we close today.'
            )
          : txt(
              '850 ₾ ცოტაა. 875 ₾ შემიძლია შემოგთავაზო, თუ დღესვე გადავწყვეტთ.',
              '850 ₾ is too low. I can offer 875 ₾ if we close today.'
            ),

      answers: [
        {
          text:
            isEconomy
              ? txt(
                  'A. 630 ₾ მისაღებია.',
                  'A. 630 ₾ works for me.'
                )
              : txt(
                  'A. 875 ₾ მისაღებია.',
                  'A. 875 ₾ works for me.'
                ),

          next: 'price_2',
          score: 1,
        },

        {
          text:
            isEconomy
              ? txt(
                  'B. 620 ₾ და ახლავე გადავიხდი.',
                  'B. 620 ₾ and I will pay right now.'
                )
              : txt(
                  'B. 860 ₾ და ახლავე გადავიხდი.',
                  'B. 860 ₾ and I will pay right now.'
                ),

          next: 'price_2_strong',
          score: 3,
        },

        {
          text:
            isEconomy
              ? txt(
                  'C. არა. 600 ₾ ჩემი ბოლო შეთავაზებაა.',
                  'C. No. 600 ₾ is my final offer.'
                )
              : txt(
                  'C. არა. 850 ₾ ჩემი ბოლო შეთავაზებაა.',
                  'C. No. 850 ₾ is my final offer.'
                ),

          next: 'price_2_hard',
          score: -1,
        },
      ],
    },

    price_2: {
      text: txt(
        'კარგი. ფასზე შევთანხმდით. ახლა დეპოზიტი უნდა გადავწყვიტოთ.',
        'Good. We have agreed on the rent. Now we need to settle the deposit.'
      ),

      answers: [
        {
          text: txt(
            'A. დეპოზიტსაც სრულად გადავიხდი.',
            'A. I will pay the full deposit.'
          ),
          next: 'price_3',
          score: 0,
        },

        {
          text: txt(
            'B. დეპოზიტი ორ ნაწილად გავყოთ.',
            'B. Let us split the deposit into two payments.'
          ),
          next: 'price_3_split',
          score: 2,
        },

        {
          text: txt(
            'C. თუ დღეს ვაფორმებთ, დეპოზიტის შემცირება შეიძლება?',
            'C. If we sign today, can you reduce the deposit?'
          ),
          next: 'price_3_split',
          score: 3,
        },
      ],
    },

    price_2_strong: {
      text:
        isEconomy
          ? txt(
              '620 ₾ დაბალია, მაგრამ თუ ახლავე გადაიხდი და დღესვე გავაფორმებთ, დავთანხმდები.',
              '620 ₾ is low, but if you pay now and sign today, I will accept.'
            )
          : txt(
              '860 ₾ დაბალია, მაგრამ თუ ახლავე გადაიხდი და დღესვე გავაფორმებთ, დავთანხმდები.',
              '860 ₾ is low, but if you pay now and sign today, I will accept.'
            ),

      answers: [
        {
          text: txt(
            'A. შევთანხმდით. დეპოზიტსაც სრულად გადავიხდი.',
            'A. Deal. I will pay the full deposit.'
          ),
          next: 'price_3_best',
          score: 2,
        },

        {
          text: txt(
            'B. შევთანხმდით, მაგრამ დეპოზიტი ორ ნაწილად გავყოთ.',
            'B. Deal, but let us split the deposit into two payments.'
          ),
          next: 'price_3_best_split',
          score: 3,
        },

        {
          text: txt(
            'C. კიდევ ცოტა დააკელით და მაშინვე გადავიხდი.',
            'C. Reduce it a little more and I will pay immediately.'
          ),
          next: 'price_overplay',
          score: -2,
        },
      ],
    },

    price_2_hard: {
      text: txt(
        'ამ ფასზე ვერ დაგთანხმდები. ჩემი შეთავაზება უკვე მაქსიმალური შეღავათია.',
        'I cannot agree to that price. My offer is already the maximum discount.'
      ),

      answers: [
        {
          text: txt(
            'A. კარგი, თქვენს ბოლო შეთავაზებას დავთანხმდები.',
            'A. Okay, I will accept your last offer.'
          ),
          next: 'price_3',
          score: 0,
        },

        {
          text: txt(
            'B. მაშინ ვერ შევთანხმდებით.',
            'B. Then we cannot make a deal.'
          ),
          next: 'failed',
          score: -2,
        },

        {
          text: txt(
            'C. მოდი შუაში შევხვდეთ და დღესვე გავაფორმოთ.',
            'C. Let us meet in the middle and sign today.'
          ),
          next: 'price_3',
          score: 2,
        },
      ],
    },

    price_3: {
      text: txt(
        'კარგი. ეს პირობები ჩემთვის მისაღებია. შეგვიძლია ხელშეკრულება გავაფორმოთ.',
        'Good. These terms work for me. We can sign the agreement.'
      ),

      answers: [
        {
          text: txt(
            'ხელშეკრულების გაფორმება →',
            'Sign Agreement →'
          ),
          next: 'price_success',
          score: 1,
        },
      ],
    },

    price_3_split: {
      text: txt(
        'კარგი. დეპოზიტის ნახევარს დღეს გადაიხდი, მეორე ნახევარს კი შემდეგ თვეში.',
        'Okay. You will pay half of the deposit today and the other half next month.'
      ),

      answers: [
        {
          text: txt(
            'შევთანხმდით →',
            'Deal →'
          ),
          next: 'price_success_split',
          score: 2,
        },
      ],
    },

    price_3_best: {
      text: txt(
        'შევთანხმდით. კარგი მოლაპარაკება იყო.',
        'We have a deal. Good negotiation.'
      ),

      answers: [
        {
          text: txt(
            'ხელშეკრულების გაფორმება →',
            'Sign Agreement →'
          ),
          next: 'best_success',
          score: 2,
        },
      ],
    },

    price_3_best_split: {
      text: txt(
        'კარგი. ფასზეც შევთანხმდით და დეპოზიტსაც ორ ნაწილად გავყოფთ.',
        'Good. We agreed on the rent and we will split the deposit into two payments.'
      ),

      answers: [
        {
          text: txt(
            'ხელშეკრულების გაფორმება →',
            'Sign Agreement →'
          ),
          next: 'best_split_success',
          score: 3,
        },
      ],
    },

    price_overplay: {
      text: txt(
        'არა. უკვე საკმაოდ დაგითმე. თუ კიდევ ფასს აკლებ, შეთანხმებას ვეღარ გავაგრძელებ.',
        'No. I have already made a significant concession. If you push the price lower, I cannot continue the deal.'
      ),

      answers: [
        {
          text: txt(
            'A. კარგი, წინა შეთავაზებას დავუბრუნდეთ.',
            'A. Okay, let us return to the previous offer.'
          ),
          next: 'price_3_best',
          score: 0,
        },

        {
          text: txt(
            'B. მაშინ გარიგება არ შედგება.',
            'B. Then there is no deal.'
          ),
          next: 'failed',
          score: -2,
        },
      ],
    },

    // ========================================
    // C PATH — DEPOSIT NEGOTIATION
    // ========================================

    deposit_1: {
      text: txt(
        'დეპოზიტს ჩვეულებრივ სრულად ვიღებ. რატომ გინდა ორ ნაწილად გადახდა?',
        'I normally require the full deposit. Why do you want to split it?'
      ),

      answers: [
        {
          text: txt(
            'A. ახლა პირველი თვის ქირას ვიხდი და მინდა საწყისი ხარჯი შევამცირო.',
            'A. I am paying the first month now and want to reduce my initial expense.'
          ),
          next: 'deposit_2',
          score: 2,
        },

        {
          text: txt(
            'B. ნახევარს დღეს გადავიხდი და მეორე ნახევარს ზუსტად შემდეგ თვეში.',
            'B. I will pay half today and the other half exactly next month.'
          ),
          next: 'deposit_2',
          score: 3,
        },

        {
          text: txt(
            'C. უბრალოდ ახლა მთლიანი თანხა არ მაქვს.',
            'C. I simply do not have the full amount right now.'
          ),
          next: 'deposit_2_weak',
          score: 0,
        },
      ],
    },

    deposit_2: {
      text: txt(
        'თუ მეორე ნაწილის გადახდის თარიღს ხელშეკრულებაში ჩავწერთ, შეიძლება დავთანხმდე.',
        'If we put the second payment date in the contract, I may agree.'
      ),

      answers: [
        {
          text: txt(
            'A. თანახმა ვარ. ჩავწეროთ ხელშეკრულებაში.',
            'A. Agreed. Put it in the contract.'
          ),
          next: 'deposit_3',
          score: 2,
        },

        {
          text: txt(
            'B. კარგი. მაშინ ქირაზეც მცირე ფასდაკლება შეიძლება?',
            'B. Good. Then can we also negotiate a small rent discount?'
          ),
          next: 'deposit_price_combo',
          score: 2,
        },

        {
          text: txt(
            'C. სიტყვიერად შევთანხმდეთ, ხელშეკრულებაში არ გვინდა.',
            'C. Let us agree verbally; there is no need to put it in the contract.'
          ),
          next: 'deposit_2_weak',
          score: -1,
        },
      ],
    },

    deposit_2_weak: {
      text: txt(
        'ასეთ შემთხვევაში გარანტია მჭირდება. ზუსტი გადახდის გეგმის გარეშე დეპოზიტს ვერ გავყოფ.',
        'In that case I need a guarantee. I cannot split the deposit without a clear payment plan.'
      ),

      answers: [
        {
          text: txt(
            'A. მაშინ ნახევარი დღეს და მეორე ნახევარი შემდეგ თვეში ჩავწეროთ ხელშეკრულებაში.',
            'A. Then let us put half today and half next month in the contract.'
          ),
          next: 'deposit_3',
          score: 2,
        },

        {
          text: txt(
            'B. მაშინ სრულ დეპოზიტს გადავიხდი.',
            'B. Then I will pay the full deposit.'
          ),
          next: 'direct_3',
          score: 0,
        },

        {
          text: txt(
            'C. ამ პირობებზე ვერ შევთანხმდებით.',
            'C. We cannot agree on these terms.'
          ),
          next: 'failed',
          score: -2,
        },
      ],
    },

    deposit_price_combo: {
      text:
        isEconomy
          ? txt(
              'თუ დეპოზიტს ორ ნაწილად ვყოფთ, ქირას 630 ₾-მდე დაგიკლებ.',
              'If we split the deposit, I can reduce the rent to 630 ₾.'
            )
          : txt(
              'თუ დეპოზიტს ორ ნაწილად ვყოფთ, ქირას 875 ₾-მდე დაგიკლებ.',
              'If we split the deposit, I can reduce the rent to 875 ₾.'
            ),

      answers: [
        {
          text: txt(
            'A. ეს პირობები მაწყობს.',
            'A. Those terms work for me.'
          ),
          next: 'combo_success',
          score: 3,
        },

        {
          text: txt(
            'B. კიდევ ცოტა დააკელით.',
            'B. Reduce the rent a little more.'
          ),
          next: 'price_overplay',
          score: -1,
        },
      ],
    },

    deposit_3: {
      text: txt(
        'კარგი. დეპოზიტს ორ ნაწილად გავყოფთ და ორივე თარიღს ხელშეკრულებაში ჩავწერთ.',
        'Good. We will split the deposit into two payments and put both dates in the contract.'
      ),

      answers: [
        {
          text: txt(
            'შევთანხმდით →',
            'Deal →'
          ),
          next: 'deposit_success',
          score: 2,
        },
      ],
    },

    // ========================================
    // D PATH — AGGRESSIVE NEGOTIATION
    // ========================================

    aggressive_1: {
      text: txt(
        'ასეთი ფასი ჩემთვის მიუღებელია. თუ რეალური შეთავაზება გაქვს, მოგისმენ.',
        'That price is unacceptable to me. If you have a realistic offer, I will listen.'
      ),

      answers: [
        {
          text:
            isEconomy
              ? txt(
                  'A. კარგი, 600 ₾ და დღესვე გავაფორმოთ.',
                  'A. Okay, 600 ₾ and we sign today.'
                )
              : txt(
                  'A. კარგი, 850 ₾ და დღესვე გავაფორმოთ.',
                  'A. Okay, 850 ₾ and we sign today.'
                ),

          next: 'aggressive_2',
          score: 2,
        },

        {
          text: txt(
            'B. მაშინ თქვენ მითხარით თქვენი მინიმალური ფასი.',
            'B. Then tell me your minimum price.'
          ),
          next: 'aggressive_2',
          score: 2,
        },

        {
          text: txt(
            'C. ჩემი ფასი არ იცვლება.',
            'C. My offer does not change.'
          ),
          next: 'aggressive_fail_warning',
          score: -2,
        },
      ],
    },

    aggressive_2: {
      text:
        isEconomy
          ? txt(
              '630 ₾ ჩემი მინიმალური ფასია. ამაზე ქვემოთ ვერ ჩამოვალ.',
              '630 ₾ is my minimum price. I cannot go lower.'
            )
          : txt(
              '875 ₾ ჩემი მინიმალური ფასია. ამაზე ქვემოთ ვერ ჩამოვალ.',
              '875 ₾ is my minimum price. I cannot go lower.'
            ),

      answers: [
        {
          text: txt(
            'A. კარგი, შევთანხმდით.',
            'A. Okay, we have a deal.'
          ),
          next: 'aggressive_3',
          score: 1,
        },

        {
          text: txt(
            'B. ფასს დავთანხმდები, თუ დეპოზიტს ორ ნაწილად გავყოფთ.',
            'B. I will accept the price if we split the deposit.'
          ),
          next: 'aggressive_3_split',
          score: 3,
        },

        {
          text: txt(
            'C. არა. ჩემი შეთავაზება საბოლოოა.',
            'C. No. My offer is final.'
          ),
          next: 'aggressive_fail_warning',
          score: -2,
        },
      ],
    },

    aggressive_fail_warning: {
      text: txt(
        'როგორც ჩანს, პირობებზე ძალიან შორს ვართ ერთმანეთისგან. ეს ჩემი ბოლო შეთავაზებაა.',
        'It looks like we are too far apart on the terms. This is my final offer.'
      ),

      answers: [
        {
          text: txt(
            'A. კარგი, თქვენს ბოლო შეთავაზებას დავთანხმდები.',
            'A. Okay, I will accept your final offer.'
          ),
          next: 'aggressive_3',
          score: 0,
        },

        {
          text: txt(
            'B. მაშინ მოლაპარაკებას ვწყვეტ.',
            'B. Then I am ending the negotiation.'
          ),
          next: 'failed',
          score: -3,
        },
      ],
    },

    aggressive_3: {
      text: txt(
        'კარგი. მაშინ შეგვიძლია ხელშეკრულებაზე გადავიდეთ.',
        'Good. Then we can proceed to the agreement.'
      ),

      answers: [
        {
          text: txt(
            'ხელშეკრულების გაფორმება →',
            'Sign Agreement →'
          ),
          next: 'aggressive_success',
          score: 1,
        },
      ],
    },

    aggressive_3_split: {
      text: txt(
        'კარგი. ფასს ვტოვებთ ჩემს ბოლო შეთავაზებაზე და დეპოზიტს ორ ნაწილად გავყოფთ.',
        'Okay. We keep my final rent offer and split the deposit into two payments.'
      ),

      answers: [
        {
          text: txt(
            'შევთანხმდით →',
            'Deal →'
          ),
          next: 'combo_success',
          score: 3,
        },
      ],
    },
  };

  // ==========================================
  // SUCCESS / FAILURE RESULTS
  // ==========================================

  const resultSteps = {
    direct_success: {
      title: txt(
        '🤝 შეთანხმება შედგა',
        '🤝 Deal Accepted'
      ),

      description: txt(
        'ბინა აიღე საწყის ფასად, თუმცა დეპოზიტის გადახდის პირობებზე შეღავათი მიიღე.',
        'You rented the apartment at the original price, but negotiated better deposit terms.'
      ),

      rent:
        isEconomy ? 650 : 900,

      deposit:
        isEconomy ? 650 : 900,

      level: 'accepted',
    },

    price_success: {
      title: txt(
        '✅ კარგი გარიგება',
        '✅ Good Deal'
      ),

      description: txt(
        'შენ მოახერხე ქირის ფასის შემცირება და შეთანხმება წარმატებით დახურე.',
        'You successfully reduced the rent and closed the deal.'
      ),

      rent:
        isEconomy ? 630 : 875,

      deposit:
        isEconomy ? 650 : 900,

      level: 'good',
    },

    price_success_split: {
      title: txt(
        '🏆 ძალიან კარგი გარიგება',
        '🏆 Great Deal'
      ),

      description: txt(
        'შენ შეამცირე ქირა და დეპოზიტის გადახდაც ორ ნაწილად გადაანაწილე.',
        'You reduced the rent and also split the deposit into two payments.'
      ),

      rent:
        isEconomy ? 630 : 875,

      deposit:
        isEconomy ? 650 : 900,

      level: 'great',
    },

    best_success: {
      title: txt(
        '🏆 შესანიშნავი მოლაპარაკება',
        '🏆 Excellent Negotiation'
      ),

      description: txt(
        'შენ გამოიყენე სწრაფი გადაწყვეტილება როგორც ბერკეტი და უკეთესი ფასი მიიღე.',
        'You used immediate commitment as leverage and secured a better price.'
      ),

      rent:
        isEconomy ? 620 : 860,

      deposit:
        isEconomy ? 650 : 900,

      level: 'excellent',
    },

    best_split_success: {
      title: txt(
        '👑 იდეალური გარიგება',
        '👑 Excellent Deal'
      ),

      description: txt(
        'შენ მიიღე როგორც დაბალი ქირა, ასევე მოქნილი დეპოზიტის პირობები.',
        'You secured both a lower rent and flexible deposit terms.'
      ),

      rent:
        isEconomy ? 620 : 860,

      deposit:
        isEconomy ? 650 : 900,

      level: 'excellent',
    },

    deposit_success: {
      title: txt(
        '✅ შეთანხმება შედგა',
        '✅ Deal Closed'
      ),

      description: txt(
        'ქირა უცვლელი დარჩა, მაგრამ დეპოზიტი ორ ნაწილად გაიყო.',
        'The rent remained unchanged, but you successfully split the deposit.'
      ),

      rent:
        isEconomy ? 650 : 900,

      deposit:
        isEconomy ? 650 : 900,

      level: 'good',
    },

    combo_success: {
      title: txt(
        '👑 ძლიერი მოლაპარაკება',
        '👑 Strong Negotiation'
      ),

      description: txt(
        'შენ ერთდროულად მიიღე ფასდაკლება და უკეთესი გადახდის პირობები.',
        'You secured both a discount and better payment terms.'
      ),

      rent:
        isEconomy ? 630 : 875,

      deposit:
        isEconomy ? 650 : 900,

      level: 'excellent',
    },

    aggressive_success: {
      title: txt(
        '🤝 შეთანხმება შედგა',
        '🤝 Deal Closed'
      ),

      description: txt(
        'რთული დასაწყისის მიუხედავად, მოლაპარაკება გადაარჩინე და შეთანხმებამდე მიხვედი.',
        'Despite a difficult start, you recovered the negotiation and reached a deal.'
      ),

      rent:
        isEconomy ? 630 : 875,

      deposit:
        isEconomy ? 650 : 900,

      level: 'accepted',
    },
  };

  // ==========================================
  // FAILURE SCREEN
  // ==========================================

  if (negotiationStep === 'failed') {
    return h(
      React.Fragment,
      null,

      h(
        'div',
        {
          style: {
            padding: '24px',

            borderRadius: '16px',

            background:
              'rgba(239,27,19,.08)',

            border:
              '1px solid rgba(239,27,19,.30)',
          },
        },

        h(
          'div',
          {
            style: {
              marginBottom: '10px',

              color: '#ef1b13',

              fontSize: '25px',
              fontWeight: '900',
            },
          },

          txt(
            '❌ შეთანხმება ვერ შედგა',
            '❌ No Deal'
          )
        ),

        h(
          'div',
          {
            style: {
              color:
                'rgba(255,255,255,.75)',

              fontSize: '15px',
              lineHeight: '1.6',
            },
          },

          isEconomy
            ? txt(
                'მეპატრონემ შენს პირობებზე უარი თქვა. შეგიძლია მოლაპარაკება თავიდან სცადო.',
                'The landlord rejected your terms. You can restart the negotiation.'
              )
            : txt(
                'Comfort ბინის მეპატრონესთან შეთანხმება ვერ შედგა. შეგიძლია სცადო უფრო ხელმისაწვდომი Economy ბინა.',
                'You could not reach an agreement for the Comfort apartment. You can now try the more affordable Economy apartment.'
              )
        )
      ),

      h(
        'div',
        {
          style: {
            marginTop: '16px',

            display: 'grid',
            gap: '10px',
          },
        },

        !isEconomy &&
        h(
          'button',
          {
            type: 'button',

            onClick: function () {
              const economyApartment =
                apartments.find(
                  function (item) {
                    return item.id === 'economy';
                  }
                );

              if (economyApartment) {
                startNegotiation(
                  economyApartment
                );
              }
            },

            style: {
              width: '100%',

              padding: '15px 18px',

              border: 'none',
              borderRadius: '12px',

              background: '#ef1b13',
              color: '#ffffff',

              fontSize: '14px',
              fontWeight: '900',

              cursor: 'pointer',
            },
          },

          txt(
            '🏠 Economy ბინაზე მოლაპარაკება →',
            '🏠 Negotiate Economy Apartment →'
          )
        ),

        h(
          'button',
          {
            type: 'button',

            onClick: function () {
              setNegotiationStep('q1');
              setNegotiationScore(0);
            },

            style: negotiationAnswerStyle(),
          },

          txt(
            '↻ მოლაპარაკების თავიდან დაწყება',
            '↻ Restart Negotiation'
          )
        )
      )
    );
  }

  // ==========================================
  // RESULT SCREEN
  // ==========================================

  const result =
    resultSteps[negotiationStep];

  if (result) {
    return h(
      React.Fragment,
      null,

      h(
        'div',
        {
          style: {
            padding: '26px',

            borderRadius: '18px',

            background:
              'rgba(40,180,90,.08)',

            border:
              '1px solid rgba(40,180,90,.30)',
          },
        },

        h(
          'div',
          {
            style: {
              marginBottom: '10px',

              color: '#5be28c',

              fontSize: '26px',
              fontWeight: '900',
            },
          },

          result.title
        ),

        h(
          'div',
          {
            style: {
              marginBottom: '20px',

              color:
                'rgba(255,255,255,.74)',

              lineHeight: '1.6',
            },
          },

          result.description
        ),

        h(
          'div',
          {
            style: {
              display: 'grid',

              gridTemplateColumns:
                'repeat(2, minmax(0, 1fr))',

              gap: '12px',
            },
          },

          h(
            'div',
            {
              style: {
                padding: '15px',

                borderRadius: '12px',

                background:
                  'rgba(255,255,255,.05)',

                border:
                  '1px solid rgba(255,255,255,.08)',
              },
            },

            h(
              'div',
              {
                style: {
                  marginBottom: '5px',

                  color:
                    'rgba(255,255,255,.55)',

                  fontSize: '12px',
                  fontWeight: '800',
                },
              },

              txt(
                'საბოლოო ქირა',
                'FINAL RENT'
              )
            ),

            h(
              'div',
              {
                style: {
                  fontSize: '22px',
                  fontWeight: '900',
                },
              },

              result.rent + ' ₾'
            )
          ),

          h(
            'div',
            {
              style: {
                padding: '15px',

                borderRadius: '12px',

                background:
                  'rgba(255,255,255,.05)',

                border:
                  '1px solid rgba(255,255,255,.08)',
              },
            },

            h(
              'div',
              {
                style: {
                  marginBottom: '5px',

                  color:
                    'rgba(255,255,255,.55)',

                  fontSize: '12px',
                  fontWeight: '800',
                },
              },

              txt(
                'დეპოზიტი',
                'DEPOSIT'
              )
            ),

            h(
              'div',
              {
                style: {
                  fontSize: '22px',
                  fontWeight: '900',
                },
              },

              result.deposit + ' ₾'
            )
          )
        )
      ),

      h(
        'button',
        {
          type: 'button',

          onClick: function () {
  finishDeal(
    result.rent,
    result.deposit,
    result.level
  );

  window.location.href =
    '/team4-lab/city';
},

          style: {
            width: '100%',

            marginTop: '18px',

            padding: '16px 18px',

            border: 'none',
            borderRadius: '12px',

            background: '#ef1b13',
            color: '#ffffff',

            fontSize: '15px',
            fontWeight: '900',

            cursor: 'pointer',
          },
        },

        txt(
          '🏠 ბინის არჩევის დადასტურება →',
          '🏠 Confirm Apartment →'
        )
      )
    );
  }

  // ==========================================
  // NORMAL DIALOGUE
  // ==========================================

  const scene =
    scenes[negotiationStep] ||
    scenes.q1;

  return h(
    React.Fragment,
    null,

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

        txt(
          'მეპატრონე',
          'Landlord'
        )
      ),

      h(
        'div',
        {
          style: {
            fontSize: '17px',
            lineHeight: '1.65',
          },
        },

        scene.text
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

      scene.answers.map(
        function (answer, index) {
          return h(
            'button',
            {
              key:
                negotiationStep +
                '-' +
                index,

              type: 'button',

              onClick: function () {
                go(
                  answer.next,
                  answer.score
                );
              },

              onMouseEnter:
                function (event) {
                  event.currentTarget.style.transform =
                    'translateY(-2px)';

                  event.currentTarget.style.borderColor =
                    'rgba(239,27,19,.55)';

                  event.currentTarget.style.background =
                    'rgba(239,27,19,.08)';
                },

              onMouseLeave:
                function (event) {
                  event.currentTarget.style.transform =
                    'translateY(0)';

                  event.currentTarget.style.borderColor =
                    'rgba(255,255,255,.10)';

                  event.currentTarget.style.background =
                    '#0d0f14';
                },

              style:
                negotiationAnswerStyle(),
            },

            answer.text
          );
        }
      )
    )
  );
})(),
              h(
                'button',
                {
                  type: 'button',

                  onClick: function () {
  setNegotiationApartment(null);
  setNegotiationStep('q1');
  setNegotiationScore(0);
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

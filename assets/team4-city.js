// ==========================================
// TEAM4 CITY
// ==========================================

(function () {
  const { createElement: h } = React;

  function Team4CityPage({
    lang,
    setLang,
    Header,
    Footer,
  }) {
    const isGeo =
      lang === 'GEO';

    // ========================================
    // PLAYER DATA
    // ========================================

    const selectedApartment =
      React.useMemo(function () {
        try {
          return JSON.parse(
            localStorage.getItem(
              'team4SelectedApartment'
            ) || 'null'
          );
        } catch (error) {
          console.error(
            'City apartment load error:',
            error
          );

          return null;
        }
      }, []);

    const apartmentDeal =
      React.useMemo(function () {
        try {
          return JSON.parse(
            localStorage.getItem(
              'team4ApartmentDeal'
            ) || 'null'
          );
        } catch (error) {
          console.error(
            'City deal load error:',
            error
          );

          return null;
        }
      }, []);

    const playerName =
      localStorage.getItem(
        'team4PlayerName'
      ) ||
      (
        isGeo
          ? 'მოთამაშე'
          : 'Player'
      );

    // ========================================
    // TEMPORARY GAME STATE
    //
    // მოგვიანებით ამას ცალკე
    // team4-game-state.js ჩაანაცვლებს.
    // ========================================

    const startingCash = 2500;

    const finalRent =
      apartmentDeal &&
      Number(apartmentDeal.rent)
        ? Number(apartmentDeal.rent)
        : selectedApartment &&
          Number(
            selectedApartment.finalRent
          )
        ? Number(
            selectedApartment.finalRent
          )
        : selectedApartment &&
          Number(
            selectedApartment.rent
          )
        ? Number(
            selectedApartment.rent
          )
        : 0;

    const totalDeposit =
      apartmentDeal &&
      Number(apartmentDeal.deposit)
        ? Number(
            apartmentDeal.deposit
          )
        : selectedApartment &&
          Number(
            selectedApartment.finalDeposit
          )
        ? Number(
            selectedApartment.finalDeposit
          )
        : selectedApartment &&
          Number(
            selectedApartment.deposit
          )
        ? Number(
            selectedApartment.deposit
          )
        : 0;

    // ამ ეტაპზე, თუ depositPaidNow
    // ჯერ არ გვაქვს შენახული,
    // სრული დეპოზიტი ითვლება გადახდილად.
    const depositPaidNow =
      apartmentDeal &&
      apartmentDeal.depositPaidNow != null
        ? Number(
            apartmentDeal.depositPaidNow
          )
        : totalDeposit;

    const currentCash =
      Math.max(
        0,
        startingCash -
          finalRent -
          depositPaidNow
      );

    // ========================================
    // APARTMENT / HOME
    // ========================================

    const apartmentId =
      selectedApartment
        ? selectedApartment.id
        : apartmentDeal
        ? apartmentDeal.apartmentId
        : null;

    const isEconomy =
      apartmentId === 'economy';

    const homeDistrict =
      selectedApartment
        ? (
            isGeo
              ? selectedApartment.districtGeo
              : selectedApartment.districtEng
          )
        : (
            isGeo
              ? 'შენი სახლი'
              : 'Your Home'
          );

    const commuteMinutes =
      isEconomy
        ? 40
        : 18;

    // ========================================
    // CITY LOCATIONS
    // ========================================

    const cityLocations = [
      {
        id: 'home',

        icon: '🏠',

        titleGeo: 'სახლი',
        titleEng: 'Home',

        subtitleGeo:
          homeDistrict,

        subtitleEng:
          homeDistrict,

        x: '14%',
        y: '62%',

        locked: false,

        active: false,

        onClick: function () {
          // Home-ის გვერდს შემდეგ გავაკეთებთ
          alert(
            isGeo
              ? 'სახლის სისტემა მალე გაიხსნება.'
              : 'The Home system will open soon.'
          );
        },
      },

      {
        id: 'office',

        icon: '🏢',

        titleGeo: 'ოფისი',
        titleEng: 'Office',

        subtitleGeo:
          'პირველი სამუშაო დღე',

        subtitleEng:
          'First Workday',

        x: '56%',
        y: '26%',

        locked: false,

        active: true,

        onClick: function () {
          window.location.href =
            '/team4-lab/workday';
        },
      },

      {
        id: 'shop',

        icon: '🛍️',

        titleGeo: 'მაღაზია',
        titleEng: 'Shop',

        subtitleGeo:
          'ტანსაცმელი და ნივთები',

        subtitleEng:
          'Clothes & Items',

        x: '77%',
        y: '61%',

        locked: true,
      },

      {
        id: 'bank',

        icon: '🏦',

        titleGeo: 'ბანკი',
        titleEng: 'Bank',

        subtitleGeo:
          'ფინანსები',

        subtitleEng:
          'Finance',

        x: '34%',
        y: '16%',

        locked: true,
      },

      {
        id: 'dealer',

        icon: '🚗',

        titleGeo:
          'ავტოსალონი',

        titleEng:
          'Car Dealer',

        subtitleGeo:
          'იყიდე მანქანა',

        subtitleEng:
          'Buy a Car',

        x: '82%',
        y: '34%',

        locked: true,
      },

      {
        id: 'gym',

        icon: '🏋️',

        titleGeo:
          'ფიტნეს კლუბი',

        titleEng:
          'Gym',

        subtitleGeo:
          'ენერგია და სტრესი',

        subtitleEng:
          'Energy & Stress',

        x: '38%',
        y: '72%',

        locked: true,
      },
    ];

    // ========================================
    // LOCATION
    // ========================================

    function renderLocation(
      location
    ) {
      return h(
        'button',
        {
          key:
            location.id,

          type: 'button',

          disabled:
            location.locked,

          onClick:
            location.locked
              ? undefined
              : location.onClick,

          style: {
            position: 'absolute',

            left:
              location.x,

            top:
              location.y,

            transform:
              'translate(-50%, -50%)',

            width: '150px',

            padding:
              '14px 14px',

            borderRadius:
              '18px',

            border:
              location.active
                ? '2px solid #ef1b13'
                : '1px solid rgba(255,255,255,.16)',

            background:
              location.locked
                ? 'rgba(10,11,15,.82)'
                : 'rgba(17,19,25,.94)',

            color:
              '#ffffff',

            cursor:
              location.locked
                ? 'not-allowed'
                : 'pointer',

            opacity:
              location.locked
                ? 0.56
                : 1,

            boxShadow:
              location.active
                ? '0 0 0 6px rgba(239,27,19,.12), 0 18px 45px rgba(0,0,0,.45)'
                : '0 18px 45px rgba(0,0,0,.35)',

            textAlign:
              'center',

            zIndex:
              location.active
                ? 10
                : 5,

            transition:
              'transform .18s ease, border-color .18s ease',
          },

          onMouseEnter:
            function (
              event
            ) {
              if (
                location.locked
              ) {
                return;
              }

              event.currentTarget.style.transform =
                'translate(-50%, -50%) translateY(-5px)';
            },

          onMouseLeave:
            function (
              event
            ) {
              event.currentTarget.style.transform =
                'translate(-50%, -50%)';
            },
        },

        h(
          'div',
          {
            style: {
              marginBottom:
                '6px',

              fontSize:
                '34px',
            },
          },

          location.locked
            ? '🔒'
            : location.icon
        ),

        h(
          'div',
          {
            style: {
              marginBottom:
                '4px',

              fontSize:
                '15px',

              fontWeight:
                '900',
            },
          },

          isGeo
            ? location.titleGeo
            : location.titleEng
        ),

        h(
          'div',
          {
            style: {
              color:
                location.active
                  ? '#ff5c54'
                  : 'rgba(255,255,255,.58)',

              fontSize:
                '11px',

              fontWeight:
                '800',

              lineHeight:
                '1.3',
            },
          },

          location.locked
            ? (
                isGeo
                  ? 'ჯერ ჩაკეტილია'
                  : 'Locked'
              )
            : (
                isGeo
                  ? location.subtitleGeo
                  : location.subtitleEng
              )
        )
      );
    }

    // ========================================
    // HUD ITEM
    // ========================================

    function hudItem(
      icon,
      label,
      value
    ) {
      return h(
        'div',
        {
          style: {
            minWidth:
              '120px',

            padding:
              '12px 14px',

            borderRadius:
              '14px',

            background:
              'rgba(255,255,255,.045)',

            border:
              '1px solid rgba(255,255,255,.08)',
          },
        },

        h(
          'div',
          {
            style: {
              marginBottom:
                '5px',

              color:
                'rgba(255,255,255,.50)',

              fontSize:
                '10px',

              fontWeight:
                '900',

              letterSpacing:
                '.07em',

              textTransform:
                'uppercase',
            },
          },

          icon +
            ' ' +
            label
        ),

        h(
          'div',
          {
            style: {
              fontSize:
                '18px',

              fontWeight:
                '900',
            },
          },

          value
        )
      );
    }

    // ========================================
    // RENDER
    // ========================================

    return h(
      React.Fragment,
      null,

      h(Header, {
        lang,
        setLang,
      }),

      h(
        'main',
        {
          style: {
            minHeight:
              '100vh',

            padding:
              '120px 24px 80px',

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
                '1320px',

              margin:
                '0 auto',
            },
          },

          // ====================================
          // TOP
          // ====================================

          h(
            'div',
            {
              style: {
                display:
                  'flex',

                justifyContent:
                  'space-between',

                alignItems:
                  'flex-end',

                gap:
                  '20px',

                flexWrap:
                  'wrap',

                marginBottom:
                  '26px',
              },
            },

            h(
              'div',
              null,

              h(
                'div',
                {
                  style: {
                    marginBottom:
                      '8px',

                    color:
                      '#ef1b13',

                    fontSize:
                      '12px',

                    fontWeight:
                      '900',

                    letterSpacing:
                      '.14em',
                  },
                },

                'TEAM4 CITY'
              ),

              h(
                'h1',
                {
                  style: {
                    margin:
                      '0 0 7px',

                    fontSize:
                      'clamp(32px,5vw,56px)',

                    lineHeight:
                      '1',

                    fontWeight:
                      '900',
                  },
                },

                isGeo
                  ? 'შენი ქალაქი'
                  : 'Your City'
              ),

              h(
                'div',
                {
                  style: {
                    color:
                      'rgba(255,255,255,.62)',

                    fontSize:
                      '15px',
                  },
                },

                isGeo
                  ? playerName +
                    ', შენი ახალი ცხოვრება აქედან იწყება.'
                  : playerName +
                    ', your new life starts here.'
              )
            ),

            h(
              'div',
              {
                style: {
                  padding:
                    '10px 16px',

                  borderRadius:
                    '999px',

                  background:
                    'rgba(255,255,255,.05)',

                  border:
                    '1px solid rgba(255,255,255,.10)',

                  fontSize:
                    '13px',

                  fontWeight:
                    '900',
                },
              },

              isGeo
                ? 'DAY 1 • 08:00 • სექტემბერი'
                : 'DAY 1 • 08:00 • September'
            )
          ),

          // ====================================
          // HUD
          // ====================================

          h(
            'div',
            {
              style: {
                display:
                  'flex',

                gap:
                  '10px',

                flexWrap:
                  'wrap',

                marginBottom:
                  '22px',
              },
            },

            hudItem(
              '💰',
              isGeo
                ? 'ფული'
                : 'Cash',
              currentCash +
                ' ₾'
            ),

            hudItem(
              '⚡',
              isGeo
                ? 'ენერგია'
                : 'Energy',
              '100'
            ),

            hudItem(
              '🧠',
              isGeo
                ? 'სტრესი'
                : 'Stress',
              '0'
            ),

            hudItem(
              '⭐',
              isGeo
                ? 'რეპუტაცია'
                : 'Reputation',
              '0'
            ),

            hudItem(
              '🏆',
              'Sales XP',
              '0'
            )
          ),

          // ====================================
          // MAIN CITY AREA
          // ====================================

          h(
            'div',
            {
              style: {
                display:
                  'grid',

                gridTemplateColumns:
                  'minmax(0, 1fr) 310px',

                gap:
                  '20px',

                alignItems:
                  'stretch',
              },
            },

            // ==================================
            // MAP
            // ==================================

            h(
              'div',
              {
                style: {
                  position:
                    'relative',

                  minHeight:
                    '660px',

                  overflow:
                    'hidden',

                  borderRadius:
                    '26px',

                  border:
                    '1px solid rgba(255,255,255,.10)',

                  background:
                    'radial-gradient(circle at 55% 45%, rgba(45,50,65,.42), transparent 32%), linear-gradient(145deg,#171a21,#090a0e)',

                  boxShadow:
                    '0 30px 80px rgba(0,0,0,.35)',
                },
              },

              // CITY ROADS / DECOR

              h(
                'div',
                {
                  style: {
                    position:
                      'absolute',

                    left:
                      '8%',

                    right:
                      '8%',

                    top:
                      '48%',

                    height:
                      '64px',

                    transform:
                      'rotate(-8deg)',

                    borderRadius:
                      '999px',

                    background:
                      'rgba(255,255,255,.045)',

                    border:
                      '1px solid rgba(255,255,255,.04)',
                  },
                }
              ),

              h(
                'div',
                {
                  style: {
                    position:
                      'absolute',

                    width:
                      '70px',

                    top:
                      '8%',

                    bottom:
                      '7%',

                    left:
                      '49%',

                    transform:
                      'rotate(14deg)',

                    borderRadius:
                      '999px',

                    background:
                      'rgba(255,255,255,.035)',

                    border:
                      '1px solid rgba(255,255,255,.04)',
                  },
                }
              ),

              // BACKGROUND BLOCKS

              [
                ['7%', '10%', '180px', '130px'],
                ['61%', '7%', '220px', '130px'],
                ['66%', '73%', '200px', '120px'],
                ['16%', '76%', '160px', '100px'],
              ].map(
                function (
                  block,
                  index
                ) {
                  return h(
                    'div',
                    {
                      key:
                        'block-' +
                        index,

                      style: {
                        position:
                          'absolute',

                        left:
                          block[0],

                        top:
                          block[1],

                        width:
                          block[2],

                        height:
                          block[3],

                        borderRadius:
                          '20px',

                        background:
                          'rgba(255,255,255,.022)',

                        border:
                          '1px solid rgba(255,255,255,.035)',
                      },
                    }
                  );
                }
              ),

              cityLocations.map(
                renderLocation
              ),

              // MAP LABEL

              h(
                'div',
                {
                  style: {
                    position:
                      'absolute',

                    left:
                      '24px',

                    bottom:
                      '20px',

                    color:
                      'rgba(255,255,255,.28)',

                    fontSize:
                      '11px',

                    fontWeight:
                      '900',

                    letterSpacing:
                      '.12em',
                  },
                },

                isGeo
                  ? 'TEAM4 CITY • ქალაქის პირველი ზონა'
                  : 'TEAM4 CITY • FIRST DISTRICT'
              )
            ),

            // ==================================
            // RIGHT PANEL
            // ==================================

            h(
              'aside',
              {
                style: {
                  display:
                    'grid',

                  alignContent:
                    'start',

                  gap:
                    '14px',
                },
              },

              // MISSION

              h(
                'div',
                {
                  style: {
                    padding:
                      '22px',

                    borderRadius:
                      '20px',

                    background:
                      '#111319',

                    border:
                      '1px solid rgba(239,27,19,.28)',
                  },
                },

                h(
                  'div',
                  {
                    style: {
                      marginBottom:
                        '9px',

                      color:
                        '#ef1b13',

                      fontSize:
                        '11px',

                      fontWeight:
                        '900',

                      letterSpacing:
                        '.12em',
                    },
                  },

                  isGeo
                    ? 'მიმდინარე მისია'
                    : 'CURRENT MISSION'
                ),

                h(
                  'h2',
                  {
                    style: {
                      margin:
                        '0 0 10px',

                      fontSize:
                        '22px',

                      fontWeight:
                        '900',
                    },
                  },

                  isGeo
                    ? 'პირველი სამუშაო დღე'
                    : 'First Workday'
                ),

                h(
                  'p',
                  {
                    style: {
                      margin:
                        '0 0 18px',

                      color:
                        'rgba(255,255,255,.65)',

                      fontSize:
                        '14px',

                      lineHeight:
                        '1.6',
                    },
                  },

                  isGeo
                    ? 'ბინა უკვე გაქვს. ახლა დროა დაიწყო ფულის გამომუშავება. მიდი ოფისში.'
                    : 'You have a home. Now it is time to start earning money. Go to the office.'
                ),

                h(
                  'button',
                  {
                    type:
                      'button',

                    onClick:
                      function () {
                        window.location.href =
                          '/team4-lab/workday';
                      },

                    style: {
                      width:
                        '100%',

                      padding:
                        '14px 16px',

                      border:
                        'none',

                      borderRadius:
                        '12px',

                      background:
                        '#ef1b13',

                      color:
                        '#ffffff',

                      fontSize:
                        '14px',

                      fontWeight:
                        '900',

                      cursor:
                        'pointer',
                    },
                  },

                  isGeo
                    ? '🏢 ოფისში წასვლა →'
                    : '🏢 Go to Office →'
                )
              ),

              // HOME SUMMARY

              h(
                'div',
                {
                  style: {
                    padding:
                      '20px',

                    borderRadius:
                      '20px',

                    background:
                      '#111319',

                    border:
                      '1px solid rgba(255,255,255,.08)',
                  },
                },

                h(
                  'div',
                  {
                    style: {
                      marginBottom:
                        '12px',

                      fontSize:
                        '16px',

                      fontWeight:
                        '900',
                    },
                  },

                  '🏠 ' +
                    (
                      isGeo
                        ? 'შენი საცხოვრებელი'
                        : 'Your Home'
                    )
                ),

                h(
                  'div',
                  {
                    style: {
                      display:
                        'grid',

                      gap:
                        '8px',

                      color:
                        'rgba(255,255,255,.67)',

                      fontSize:
                        '13px',
                    },
                  },

                  h(
                    'div',
                    null,

                    (
                      isGeo
                        ? 'ლოკაცია: '
                        : 'Location: '
                    ) +
                      homeDistrict
                  ),

                  h(
                    'div',
                    null,

                    (
                      isGeo
                        ? 'ქირა: '
                        : 'Rent: '
                    ) +
                      finalRent +
                      ' ₾'
                  ),

                  h(
                    'div',
                    null,

                    (
                      isGeo
                        ? 'ოფისამდე: '
                        : 'Office commute: '
                    ) +
                      commuteMinutes +
                      (
                        isGeo
                          ? ' წუთი'
                          : ' min'
                      )
                  )
                )
              ),

              // UPCOMING

              h(
                'div',
                {
                  style: {
                    padding:
                      '20px',

                    borderRadius:
                      '20px',

                    background:
                      'rgba(246,199,68,.055)',

                    border:
                      '1px solid rgba(246,199,68,.16)',
                  },
                },

                h(
                  'div',
                  {
                    style: {
                      marginBottom:
                        '8px',

                      color:
                        '#f6c744',

                      fontSize:
                        '12px',

                      fontWeight:
                        '900',
                    },
                  },

                  isGeo
                    ? '📅 მომავალი ხარჯები'
                    : '📅 UPCOMING COSTS'
                ),

                h(
                  'div',
                  {
                    style: {
                      color:
                        'rgba(255,255,255,.67)',

                      fontSize:
                        '13px',

                      lineHeight:
                        '1.6',
                    },
                  },

                  isGeo
                    ? 'ქირა, კომუნალური გადასახადები და სხვა ყოველდღიური ხარჯები მალე ამ სისტემაში გამოჩნდება.'
                    : 'Rent, utilities and other daily expenses will appear here as the finance system develops.'
                )
              )
            )
          )
        )
      ),

      Footer
        ? h(Footer, {
            lang,
          })
        : null
    );
  }

  window.Team4CityPage =
    Team4CityPage;
})();

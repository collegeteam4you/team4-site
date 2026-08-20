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

    // ==========================================
    // APARTMENTS
    // ==========================================

    const apartments = [
      {
        id: 'economy',

        image:
          '/assets/team4-lab/apartment/economy-apartment.png',

        titleGeo: 'Apartment #1 — Economy',
        titleEng: 'Apartment #1 — Economy',

        districtGeo: 'გლდანი',
        districtEng: 'Gldani',

        rent: 650,
        deposit: 650,

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
          '/assets/team4-lab/apartment/comfort-apartment.png',

        titleGeo: 'Apartment #2 — Comfort',
        titleEng: 'Apartment #2 — Comfort',

        districtGeo: 'საბურთალო',
        districtEng: 'Saburtalo',

        rent: 900,
        deposit: 900,

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
    ];

    // ==========================================
    // START NEGOTIATION
    // ==========================================

    function startNegotiation(apartment) {
      localStorage.setItem(
        'team4SelectedApartment',
        JSON.stringify(apartment)
      );

      alert(
        isGeo
          ? apartment.titleGeo +
            ' — მეპატრონესთან მოლაპარაკება შემდეგ ეტაპზე გაიხსნება.'
          : apartment.titleEng +
            ' — Landlord negotiation will open in the next step.'
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
            minHeight: '100vh',

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
              ? '💰 საწყისი თანხა: 3,000 ₾'
              : '💰 Starting Cash: 3,000 ₾'
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
                    },

                    onMouseEnter:
                      function (event) {
                        event.currentTarget.style.transform =
                          'translateY(-4px)';

                        event.currentTarget.style.borderColor =
                          'rgba(239,27,19,.35)';
                      },

                    onMouseLeave:
                      function (event) {
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
                      },
                    })
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
                    // RENT
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
                        },
                      },

                      isGeo
                        ? 'ქირა: ' +
                          apartment.rent +
                          ' ₾ / თვე'
                        : 'Rent: ' +
                          apartment.rent +
                          ' ₾ / month'
                    ),

                    // ===============================
                    // DEPOSIT
                    // ===============================

                    h(
                      'div',
                      {
                        style: {
                          marginBottom:
                            '18px',

                          color:
                            'rgba(255,255,255,.72)',

                          fontWeight:
                            '700',
                        },
                      },

                      isGeo
                        ? 'დეპოზიტი: ' +
                          apartment.deposit +
                          ' ₾'
                        : 'Deposit: ' +
                          apartment.deposit +
                          ' ₾'
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
                    // NEGOTIATION BUTTON
                    // ===============================

                    h(
                      'button',
                      {
                        type:
                          'button',

                        onClick:
                          function () {
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
                            '#ef1b13',

                          color:
                            '#ffffff',

                          fontSize:
                            '14px',

                          fontWeight:
                            '900',

                          cursor:
                            'pointer',

                          transition:
                            'transform .18s ease, background .18s ease',
                        },

                        onMouseEnter:
                          function (event) {
                            event.currentTarget.style.transform =
                              'translateY(-2px)';

                            event.currentTarget.style.background =
                              '#ff2118';
                          },

                        onMouseLeave:
                          function (event) {
                            event.currentTarget.style.transform =
                              'translateY(0)';

                            event.currentTarget.style.background =
                              '#ef1b13';
                          },
                      },

                      isGeo
                        ? 'მოლაპარაკება მეპატრონესთან →'
                        : 'Negotiate with Landlord →'
                    )
                  )
                );
              }
            )
          ),

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

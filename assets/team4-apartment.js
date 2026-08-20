// ==========================================
// TEAM4 APARTMENT SYSTEM
// ==========================================

(function () {
  const { createElement: h } = React;

  function Team4ApartmentPage({ lang, setLang }) {
    const isGeo = lang === 'GEO';

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

    metroGeo: 'მეტრო: 12 წუთი ფეხით',
    metroEng: 'Metro: 12 min walk',

    officeGeo: 'ოფისამდე: დაახლოებით 40 წუთი',
    officeEng: 'Office commute: about 40 min',

    descriptionGeo:
      'პატარა და მარტივი ბინა. დაბალი ქირა, მაგრამ ოფისამდე უფრო დიდი გზა.',

    descriptionEng:
      'A small and simple apartment. Lower rent, but a longer commute to the office.',
  },

        metroGeo: 'მეტრო: 12 წუთი ფეხით',
        metroEng: 'Metro: 12 min walk',

        officeGeo: 'ოფისამდე: დაახლოებით 40 წუთი',
        officeEng: 'Office commute: about 40 min',

        descriptionGeo:
          'პატარა და მარტივი ბინა. დაბალი ქირა, მაგრამ ოფისამდე უფრო დიდი გზა.',

        descriptionEng:
          'A small and simple apartment. Lower rent, but a longer commute to the office.',
      },

      {
        id: 'comfort',
        titleGeo: 'Apartment #2 — Comfort',
        titleEng: 'Apartment #2 — Comfort',

        districtGeo: 'საბურთალო',
        districtEng: 'Saburtalo',

        rent: 900,
        deposit: 900,

        metroGeo: 'მეტრო: 5 წუთი ფეხით',
        metroEng: 'Metro: 5 min walk',

        officeGeo: 'ოფისამდე: დაახლოებით 18 წუთი',
        officeEng: 'Office commute: about 18 min',

        descriptionGeo:
          'უკეთესი მდებარეობა და პირობები. უფრო ძვირია, მაგრამ ყოველდღიურად დროს ზოგავ.',

        descriptionEng:
          'Better location and living conditions. More expensive, but saves time every day.',
      },
    ];

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
            minHeight: '100vh',
            padding: '130px 24px 80px',
            background: '#050507',
            color: '#ffffff',
          },
        },

        h(
          'section',
          {
            style: {
              maxWidth: '1180px',
              margin: '0 auto',
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

            isGeo
              ? 'ახალი ეტაპი'
              : 'NEW CHAPTER'
          ),

          h(
            'h1',
            {
              style: {
                margin: '0 0 12px',
                fontSize: 'clamp(34px,5vw,58px)',
                fontWeight: '900',
              },
            },

            isGeo
              ? 'შენი ახალი ცხოვრება იწყება.'
              : 'Your new life starts now.'
          ),

          h(
            'p',
            {
              style: {
                margin: '0 0 34px',
                color: 'rgba(255,255,255,.65)',
                fontSize: '16px',
                lineHeight: '1.6',
              },
            },

            isGeo
              ? 'აირჩიე სად იცხოვრებ. გაითვალისწინე არა მხოლოდ ქირა, არამედ დრო, ლოკაცია და ყოველდღიური ხარჯები.'
              : 'Choose where you will live. Consider not only rent, but also time, location and daily expenses.'
          ),

          h(
            'div',
            {
              style: {
                display: 'grid',
                gridTemplateColumns:
                  'repeat(2, minmax(0, 1fr))',
                gap: '22px',
              },
            },

            apartments.map(function (apartment) {
              return h(
                'div',
                {
                  key: apartment.id,

                  style: {
                    padding: '24px',
                    borderRadius: '22px',

                    background: '#111319',

                    border:
                      '1px solid rgba(255,255,255,.10)',

                    boxShadow:
                      '0 20px 55px rgba(0,0,0,.30)',
                  },
                },

                h(
                  'div',
                  {
                    style: {
                      height: '250px',
                      marginBottom: '20px',

                      borderRadius: '18px',

                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',

                      background:
                        'linear-gradient(135deg, #171a21, #090a0d)',

                      border:
                        '1px solid rgba(255,255,255,.08)',

                      color:
                        'rgba(255,255,255,.35)',

                      fontSize: '18px',
                      fontWeight: '900',
                    },
                  },

                  isGeo
                    ? 'ბინის ფოტო'
                    : 'Apartment Photo'
                ),

                h(
                  'h2',
                  {
                    style: {
                      margin: '0 0 8px',
                      fontSize: '25px',
                      fontWeight: '900',
                    },
                  },

                  isGeo
                    ? apartment.titleGeo
                    : apartment.titleEng
                ),

                h(
                  'div',
                  {
                    style: {
                      marginBottom: '18px',
                      color: '#ef1b13',
                      fontSize: '17px',
                      fontWeight: '900',
                    },
                  },

                  isGeo
                    ? apartment.districtGeo
                    : apartment.districtEng
                ),

                h(
                  'div',
                  {
                    style: {
                      marginBottom: '7px',
                      fontSize: '18px',
                      fontWeight: '900',
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

                h(
                  'div',
                  {
                    style: {
                      marginBottom: '16px',
                      color:
                        'rgba(255,255,255,.72)',
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

                h(
                  'div',
                  {
                    style: {
                      marginBottom: '7px',
                      color:
                        'rgba(255,255,255,.72)',
                    },
                  },

                  isGeo
                    ? apartment.metroGeo
                    : apartment.metroEng
                ),

                h(
                  'div',
                  {
                    style: {
                      marginBottom: '16px',
                      color:
                        'rgba(255,255,255,.72)',
                    },
                  },

                  isGeo
                    ? apartment.officeGeo
                    : apartment.officeEng
                ),

                h(
                  'p',
                  {
                    style: {
                      minHeight: '52px',

                      margin: '0 0 22px',

                      color:
                        'rgba(255,255,255,.62)',

                      lineHeight: '1.6',
                    },
                  },

                  isGeo
                    ? apartment.descriptionGeo
                    : apartment.descriptionEng
                ),

                h(
                  'button',
                  {
                    type: 'button',

                    onClick: function () {
                      startNegotiation(apartment);
                    },

                    style: {
                      width: '100%',

                      padding: '14px 18px',

                      border: 'none',
                      borderRadius: '12px',

                      background: '#ef1b13',
                      color: '#ffffff',

                      fontSize: '14px',
                      fontWeight: '900',

                      cursor: 'pointer',
                    },
                  },

                  isGeo
                    ? 'მოლაპარაკება მეპატრონესთან →'
                    : 'Negotiate with Landlord →'
                )
              );
            })
          ),

          h(
            'div',
            {
              style: {
                marginTop: '24px',

                padding: '16px 18px',

                borderRadius: '14px',

                background:
                  'rgba(255,255,255,.04)',

                border:
                  '1px solid rgba(255,255,255,.08)',

                fontWeight: '900',
              },
            },

            isGeo
              ? '💰 საწყისი თანხა: 3,000 ₾'
              : '💰 Starting Cash: 3,000 ₾'
          )
        )
      )
    );
  }

  window.Team4ApartmentPage =
    Team4ApartmentPage;
})();

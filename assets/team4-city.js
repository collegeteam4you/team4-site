// ==========================================
// TEAM4 CITY — CITY ENGINE V1
// ==========================================

(function () {
  const { createElement: h } = React;

  // ==========================================
  // HELPERS
  // ==========================================

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);

      if (!raw) {
        return fallback;
      }

      return JSON.parse(raw);
    } catch (error) {
      console.error(
        'TEAM4 CITY storage read error:',
        key,
        error
      );

      return fallback;
    }
  }

  function clamp(value, min, max) {
    return Math.max(
      min,
      Math.min(max, value)
    );
  }

  function distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;

    return Math.sqrt(
      dx * dx + dy * dy
    );
  }

  function insideRect(
    point,
    rect,
    margin
  ) {
    const safeMargin =
      margin || 0;

    return (
      point.x >
        rect.x - safeMargin &&
      point.x <
        rect.x +
          rect.w +
          safeMargin &&
      point.y >
        rect.y - safeMargin &&
      point.y <
        rect.y +
          rect.h +
          safeMargin
    );
  }

  // ==========================================
  // CITY PAGE
  // ==========================================

  function Team4CityPage({
    lang,
    setLang,
    Header,
    Footer,
  }) {
    const isGeo =
      lang === 'GEO';

    // ========================================
    // APARTMENT DATA
    // ========================================

    const selectedApartment =
      React.useMemo(
        function () {
          return readJSON(
            'team4SelectedApartment',
            null
          );
        },
        []
      );

    const apartmentDeal =
      React.useMemo(
        function () {
          return readJSON(
            'team4ApartmentDeal',
            null
          );
        },
        []
      );

    // ========================================
    // PLAYER NAME
    // ========================================

    const playerName =
      localStorage.getItem(
        'team4PlayerName'
      ) ||
      localStorage.getItem(
        'team4LabPlayerName'
      ) ||
      (
        isGeo
          ? 'მოთამაშე'
          : 'Player'
      );

    // ========================================
    // APARTMENT CALCULATION
    // ========================================

    const apartmentId =
      selectedApartment
        ? selectedApartment.id
        : apartmentDeal
        ? apartmentDeal.apartmentId
        : 'economy';

    const isEconomy =
      apartmentId === 'economy';

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

        : (
            isEconomy
              ? 650
              : 900
          );

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

        : (
            isEconomy
              ? 650
              : 900
          );

    const depositPaidNow =
      apartmentDeal &&
      apartmentDeal.depositPaidNow != null
        ? Number(
            apartmentDeal.depositPaidNow
          )
        : totalDeposit;

    const startingCash = 2500;

    const calculatedCash =
      Math.max(
        0,
        startingCash -
          finalRent -
          depositPaidNow
      );

    const homeDistrict =
      isEconomy
        ? (
            isGeo
              ? 'გლდანი'
              : 'Gldani'
          )
        : (
            isGeo
              ? 'საბურთალო'
              : 'Saburtalo'
          );

    const commuteMinutes =
      isEconomy
        ? 40
        : 18;

    // ========================================
    // CITY GEOMETRY
    // ========================================

    const homeBuilding =
      isEconomy
        ? {
            x: 3,
            y: 69,
            w: 20,
            h: 24,
          }
        : {
            x: 4,
            y: 57,
            w: 20,
            h: 24,
          };

    const homeEntrance =
      isEconomy
        ? {
            x: 25.5,
            y: 81,
          }
        : {
            x: 26.5,
            y: 69,
          };

    const buildings = [
      {
        id: 'home',

        icon: '🏠',

        titleGeo: 'სახლი',
        titleEng: 'Home',

        subtitleGeo:
          homeDistrict,

        subtitleEng:
          homeDistrict,

        rect:
          homeBuilding,

        entrance:
          homeEntrance,

        locked: false,

        color:
          '#33d17a',
      },

      {
        id: 'bank',

        icon: '🏦',

        titleGeo: 'ბანკი',
        titleEng: 'Bank',

        subtitleGeo:
          'ფინანსური ცენტრი',

        subtitleEng:
          'Financial Center',

        rect: {
          x: 36,
          y: 5,
          w: 20,
          h: 23,
        },

        entrance: {
          x: 46,
          y: 31,
        },

        locked: true,

        color:
          '#f6c744',
      },

      {
        id: 'office',

        icon: '🏢',

        titleGeo: 'ოფისი',
        titleEng: 'Office',

        subtitleGeo:
          'სამუშაო ადგილი',

        subtitleEng:
          'Work Place',

        rect: {
          x: 67,
          y: 4,
          w: 27,
          h: 29,
        },

        entrance: {
          x: 70,
          y: 36,
        },

        locked: false,

        color:
          '#ef1b13',
      },

      {
        id: 'shop',

        icon: '🛍️',

        titleGeo: 'მაღაზია',
        titleEng: 'Shop',

        subtitleGeo:
          'Shopping Center',

        subtitleEng:
          'Shopping Center',

        rect: {
          x: 73,
          y: 49,
          w: 23,
          h: 22,
        },

        entrance: {
          x: 70,
          y: 60,
        },

        locked: true,

        color:
          '#7a68ff',
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

        rect: {
          x: 6,
          y: 8,
          w: 21,
          h: 19,
        },

        entrance: {
          x: 29,
          y: 18,
        },

        locked: true,

        color:
          '#ff9f1c',
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
          'Buy Your Car',

        rect: {
          x: 53,
          y: 74,
          w: 28,
          h: 21,
        },

        entrance: {
          x: 52,
          y: 84,
        },

        locked: true,

        color:
          '#ffc400',
      },
    ];

    // ========================================
    // START POSITION
    // ========================================

    const defaultStartPosition =
      {
        x:
          homeEntrance.x +
          3,

        y:
          homeEntrance.y,
      };

    const savedCityState =
      React.useMemo(
        function () {
          return readJSON(
            'team4CityState',
            null
          );
        },
        []
      );

    // ========================================
    // GAME STATE
    // ========================================

    const [
      playerPosition,
      setPlayerPosition,
    ] = React.useState(
      function () {
        if (
          savedCityState &&
          savedCityState.position
        ) {
          return {
            x:
              Number(
                savedCityState
                  .position.x
              ) ||
              defaultStartPosition.x,

            y:
              Number(
                savedCityState
                  .position.y
              ) ||
              defaultStartPosition.y,
          };
        }

        return defaultStartPosition;
      }
    );

    const [
      playerDirection,
      setPlayerDirection,
    ] = React.useState('right');

    const [
      gameMinute,
      setGameMinute,
    ] = React.useState(
      savedCityState &&
      Number.isFinite(
        Number(
          savedCityState.gameMinute
        )
      )
        ? Number(
            savedCityState.gameMinute
          )
        : 8 * 60
    );

    const [
      energy,
      setEnergy,
    ] = React.useState(
      savedCityState &&
      savedCityState.energy != null
        ? Number(
            savedCityState.energy
          )
        : 100
    );

    const [
      stress,
      setStress,
    ] = React.useState(
      savedCityState &&
      savedCityState.stress != null
        ? Number(
            savedCityState.stress
          )
        : 0
    );

    const [
      cash,
      setCash,
    ] = React.useState(
      savedCityState &&
      savedCityState.cash != null
        ? Number(
            savedCityState.cash
          )
        : calculatedCash
    );

    const [
      reputation,
      setReputation,
    ] = React.useState(
      savedCityState &&
      savedCityState.reputation != null
        ? Number(
            savedCityState.reputation
          )
        : 0
    );

    const [
      salesXP,
      setSalesXP,
    ] = React.useState(
      savedCityState &&
      savedCityState.salesXP != null
        ? Number(
            savedCityState.salesXP
          )
        : 0
    );

    const [
      moveCount,
      setMoveCount,
    ] = React.useState(
      savedCityState &&
      savedCityState.moveCount != null
        ? Number(
            savedCityState.moveCount
          )
        : 0
    );

    const [
      message,
      setMessage,
    ] = React.useState(
      isGeo
        ? '🎯 მიდი ოფისში. რუკაზე დააჭირე და იმოძრავე WASD-ით ან ისრებით.'
        : '🎯 Go to the office. Click the map and move with WASD or arrow keys.'
    );

    const [
      destination,
      setDestination,
    ] = React.useState(
      'office'
    );

    const mapRef =
      React.useRef(null);

    // ========================================
    // SAVE CITY STATE
    // ========================================

    React.useEffect(
      function () {
        localStorage.setItem(
          'team4CityState',
          JSON.stringify({
            position:
              playerPosition,

            gameMinute:
              gameMinute,

            energy:
              energy,

            stress:
              stress,

            cash:
              cash,

            reputation:
              reputation,

            salesXP:
              salesXP,

            moveCount:
              moveCount,

            apartmentId:
              apartmentId,
          })
        );
      },
      [
        playerPosition,
        gameMinute,
        energy,
        stress,
        cash,
        reputation,
        salesXP,
        moveCount,
        apartmentId,
      ]
    );

    // ========================================
    // TIME
    // ========================================

    function formatGameTime() {
      const normalized =
        ((gameMinute %
          (24 * 60)) +
          24 * 60) %
        (24 * 60);

      const hour =
        Math.floor(
          normalized / 60
        );

      const minute =
        normalized % 60;

      return (
        String(hour).padStart(
          2,
          '0'
        ) +
        ':' +
        String(minute).padStart(
          2,
          '0'
        )
      );
    }

    // ========================================
    // COLLISION
    // ========================================

    function canMoveTo(next) {
      if (
        next.x < 1 ||
        next.x > 98 ||
        next.y < 2 ||
        next.y > 97
      ) {
        return false;
      }

      for (
        let i = 0;
        i < buildings.length;
        i += 1
      ) {
        if (
          insideRect(
            next,
            buildings[i].rect,
            1.1
          )
        ) {
          return false;
        }
      }

      return true;
    }

    // ========================================
    // MOVEMENT
    // ========================================

    function movePlayer(
      dx,
      dy,
      direction
    ) {
      const speed = 1.7;

      const next = {
        x:
          clamp(
            playerPosition.x +
              dx * speed,
            1,
            98
          ),

        y:
          clamp(
            playerPosition.y +
              dy * speed,
            2,
            97
          ),
      };

      if (
        !canMoveTo(next)
      ) {
        setMessage(
          isGeo
            ? '🚧 აქ გზა არ არის. შენობის გარშემო უნდა შემოუარო.'
            : '🚧 You cannot walk through the building. Go around it.'
        );

        return;
      }

      setPlayerDirection(
        direction
      );

      setPlayerPosition(
        next
      );

      const nextMoveCount =
        moveCount + 1;

      setMoveCount(
        nextMoveCount
      );

      // ყოველი ნაბიჯი = 1 game minute
      setGameMinute(
        function (current) {
          return current + 1;
        }
      );

      // ყოველ 5 ნაბიჯზე Energy -1
      if (
        nextMoveCount % 5 ===
        0
      ) {
        setEnergy(
          function (current) {
            return clamp(
              current - 1,
              0,
              100
            );
          }
        );
      }

      checkNearbyLocation(
        next
      );
    }

    // ========================================
    // NEARBY LOCATION
    // ========================================

    function getNearbyLocation(
      position
    ) {
      let closest = null;
      let closestDistance =
        Infinity;

      buildings.forEach(
        function (building) {
          const currentDistance =
            distance(
              position,
              building.entrance
            );

          if (
            currentDistance <
              closestDistance &&
            currentDistance <= 5.5
          ) {
            closest =
              building;

            closestDistance =
              currentDistance;
          }
        }
      );

      return closest;
    }

    const nearbyLocation =
      getNearbyLocation(
        playerPosition
      );

    function checkNearbyLocation(
      position
    ) {
      const nearby =
        getNearbyLocation(
          position
        );

      if (!nearby) {
        setMessage(
          destination === 'office'
            ? (
                isGeo
                  ? '🎯 მიმდინარე მიზანი: მიდი ოფისის შესასვლელთან.'
                  : '🎯 Current objective: reach the office entrance.'
              )
            : (
                isGeo
                  ? 'ქალაქში მოძრაობ.'
                  : 'You are moving through the city.'
              )
        );

        return;
      }

      if (nearby.locked) {
        setMessage(
          isGeo
            ? '🔒 ' +
              nearby.titleGeo +
              ' ჯერ ჩაკეტილია.'
            : '🔒 ' +
              nearby.titleEng +
              ' is currently locked.'
        );

        return;
      }

      setMessage(
        isGeo
          ? '📍 ' +
            nearby.titleGeo +
            ' — დააჭირე ENTER-ს.'
          : '📍 ' +
            nearby.titleEng +
            ' — press ENTER.'
      );
    }

    // ========================================
    // INTERACT
    // ========================================

    function interact() {
      const nearby =
        getNearbyLocation(
          playerPosition
        );

      if (!nearby) {
        setMessage(
          isGeo
            ? 'ახლოს ინტერაქტიული ლოკაცია არ არის.'
            : 'There is no interactive location nearby.'
        );

        return;
      }

      if (nearby.locked) {
        setMessage(
          isGeo
            ? '🔒 ეს ლოკაცია ჯერ ჩაკეტილია.'
            : '🔒 This location is still locked.'
        );

        return;
      }

      if (
        nearby.id === 'office'
      ) {
        localStorage.setItem(
          'team4ArrivedOffice',
          'true'
        );

        localStorage.setItem(
          'team4OfficeArrivalTime',
          formatGameTime()
        );

        window.location.href =
          '/team4-lab/workday';

        return;
      }

      if (
        nearby.id === 'home'
      ) {
        setMessage(
          isGeo
            ? '🏠 სახლში ხარ. Home სისტემას შემდეგ ეტაპზე გავხსნით.'
            : '🏠 You are home. The Home system will be added next.'
        );

        return;
      }
    }

    // ========================================
    // KEYBOARD
    // ========================================

    function handleMapKeyDown(
      event
    ) {
      const key =
        event.key.toLowerCase();

      if (
        key === 'w' ||
        key === 'arrowup'
      ) {
        event.preventDefault();

        movePlayer(
          0,
          -1,
          'up'
        );

        return;
      }

      if (
        key === 's' ||
        key === 'arrowdown'
      ) {
        event.preventDefault();

        movePlayer(
          0,
          1,
          'down'
        );

        return;
      }

      if (
        key === 'a' ||
        key === 'arrowleft'
      ) {
        event.preventDefault();

        movePlayer(
          -1,
          0,
          'left'
        );

        return;
      }

      if (
        key === 'd' ||
        key === 'arrowright'
      ) {
        event.preventDefault();

        movePlayer(
          1,
          0,
          'right'
        );

        return;
      }

      if (
        key === 'enter' ||
        key === 'e'
      ) {
        event.preventDefault();

        interact();
      }
    }

    // ========================================
    // FOCUS MAP
    // ========================================

    function focusMap() {
      if (
        mapRef.current
      ) {
        mapRef.current.focus();
      }

      setMessage(
        isGeo
          ? '🚶 Walking Mode აქტიურია — გამოიყენე WASD ან ისრები.'
          : '🚶 Walking Mode active — use WASD or arrow keys.'
      );
    }

    // ========================================
    // HUD
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
              '116px',

            padding:
              '11px 13px',

            borderRadius:
              '13px',

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
                '4px',

              color:
                'rgba(255,255,255,.48)',

              fontSize:
                '9px',

              fontWeight:
                '900',

              letterSpacing:
                '.08em',

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
                '17px',

              fontWeight:
                '900',
            },
          },

          value
        )
      );
    }

    // ========================================
    // BUILDING
    // ========================================

    function renderBuilding(
      building
    ) {
      const isOffice =
        building.id ===
        'office';

      return h(
        'div',
        {
          key:
            building.id,

          className:
            'team4-city-building',

          style: {
            position:
              'absolute',

            left:
              building.rect.x +
              '%',

            top:
              building.rect.y +
              '%',

            width:
              building.rect.w +
              '%',

            height:
              building.rect.h +
              '%',

            zIndex:
              10,

            borderRadius:
              '12px',

            overflow:
              'hidden',

            border:
              isOffice
                ? '2px solid rgba(239,27,19,.65)'
                : '1px solid rgba(255,255,255,.12)',

            background:
              building.locked
                ? 'linear-gradient(145deg,#17191f,#0c0d10)'
                : 'linear-gradient(145deg,#282c35,#101216)',

            boxShadow:
              isOffice
                ? '0 0 0 5px rgba(239,27,19,.07), 0 20px 30px rgba(0,0,0,.45)'
                : '0 18px 28px rgba(0,0,0,.42)',

            opacity:
              building.locked
                ? 0.76
                : 1,
          },
        },

        // ROOF
        h(
          'div',
          {
            style: {
              position:
                'absolute',

              left:
                '8px',

              right:
                '8px',

              top:
                '8px',

              height:
                '22%',

              borderRadius:
                '7px',

              background:
                'linear-gradient(90deg,rgba(255,255,255,.08),rgba(255,255,255,.02))',

              border:
                '1px solid rgba(255,255,255,.06)',
            },
          }
        ),

        // WINDOWS
        h(
          'div',
          {
            style: {
              position:
                'absolute',

              left:
                '10%',

              right:
                '10%',

              top:
                '38%',

              display:
                'grid',

              gridTemplateColumns:
                'repeat(4,1fr)',

              gap:
                '5px',
            },
          },

          [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
          ].map(
            function (n) {
              return h(
                'span',
                {
                  key: n,

                  style: {
                    height:
                      '9px',

                    borderRadius:
                      '2px',

                    background:
                      building.locked
                        ? 'rgba(255,255,255,.06)'
                        : 'rgba(255,208,111,.30)',
                  },
                }
              );
            }
          )
        ),

        // LABEL
        h(
          'div',
          {
            style: {
              position:
                'absolute',

              left:
                '8px',

              right:
                '8px',

              bottom:
                '8px',

              padding:
                '8px',

              borderRadius:
                '8px',

              background:
                'rgba(0,0,0,.70)',

              backdropFilter:
                'blur(8px)',

              border:
                '1px solid rgba(255,255,255,.08)',
            },
          },

          h(
            'div',
            {
              style: {
                display:
                  'flex',

                alignItems:
                  'center',

                gap:
                  '6px',

                marginBottom:
                  '2px',

                color:
                  building.locked
                    ? 'rgba(255,255,255,.55)'
                    : '#fff',

                fontSize:
                  '12px',

                fontWeight:
                  '900',
              },
            },

            building.locked
              ? '🔒'
              : building.icon,

            isGeo
              ? building.titleGeo
              : building.titleEng
          ),

          h(
            'div',
            {
              style: {
                color:
                  isOffice
                    ? '#ff524a'
                    : 'rgba(255,255,255,.48)',

                fontSize:
                  '9px',

                fontWeight:
                  '800',
              },
            },

            building.locked
              ? (
                  isGeo
                    ? 'ჯერ ჩაკეტილია'
                    : 'Locked'
                )
              : (
                  isGeo
                    ? building.subtitleGeo
                    : building.subtitleEng
                )
          )
        )
      );
    }

    // ========================================
    // ENTRANCE MARKER
    // ========================================

    function renderEntrance(
      building
    ) {
      return h(
        'div',
        {
          key:
            'entrance-' +
            building.id,

          style: {
            position:
              'absolute',

            left:
              building.entrance.x +
              '%',

            top:
              building.entrance.y +
              '%',

            width:
              building.id ===
              'office'
                ? '18px'
                : '12px',

            height:
              building.id ===
              'office'
                ? '18px'
                : '12px',

            transform:
              'translate(-50%,-50%)',

            borderRadius:
              '50%',

            background:
              building.locked
                ? 'rgba(255,255,255,.15)'
                : building.color,

            boxShadow:
              building.id ===
              destination
                ? '0 0 0 8px rgba(239,27,19,.13), 0 0 20px rgba(239,27,19,.65)'
                : '0 0 12px rgba(0,0,0,.5)',

            zIndex:
              30,
          },
        }
      );
    }

    // ========================================
    // VEHICLE
    // ========================================

    function vehicle(
      icon,
      left,
      top,
      rotation,
      className,
      label
    ) {
      return h(
        'div',
        {
          className:
            className || '',

          style: {
            position:
              'absolute',

            left:
              left,

            top:
              top,

            transform:
              'translate(-50%,-50%) rotate(' +
              rotation +
              'deg)',

            zIndex:
              7,

            fontSize:
              '22px',

            filter:
              'drop-shadow(0 5px 4px rgba(0,0,0,.55))',

            pointerEvents:
              'none',
          },

          title:
            label || '',
        },

        icon
      );
    }

    // ========================================
    // PLAYER
    // ========================================

    function renderPlayer() {
      let rotation = 0;

      if (
        playerDirection ===
        'right'
      ) {
        rotation = 90;
      }

      if (
        playerDirection ===
        'down'
      ) {
        rotation = 180;
      }

      if (
        playerDirection ===
        'left'
      ) {
        rotation = 270;
      }

      return h(
        'div',
        {
          style: {
            position:
              'absolute',

            left:
              playerPosition.x +
              '%',

            top:
              playerPosition.y +
              '%',

            width:
              '34px',

            height:
              '34px',

            transform:
              'translate(-50%,-50%)',

            zIndex:
              80,

            transition:
              'left .10s linear, top .10s linear',
          },
        },

        h(
          'div',
          {
            style: {
              position:
                'absolute',

              left:
                '50%',

              top:
                '50%',

              width:
                '31px',

              height:
                '31px',

              transform:
                'translate(-50%,-50%)',

              borderRadius:
                '50%',

              display:
                'grid',

              placeItems:
                'center',

              background:
                '#ef1b13',

              border:
                '3px solid #ffffff',

              boxShadow:
                '0 0 0 5px rgba(239,27,19,.18), 0 10px 18px rgba(0,0,0,.55)',

              fontSize:
                '17px',
            },
          },

          '🧍'
        ),

        h(
          'div',
          {
            style: {
              position:
                'absolute',

              left:
                '50%',

              top:
                '-12px',

              transform:
                'translateX(-50%) rotate(' +
                rotation +
                'deg)',

              color:
                '#ff3b32',

              fontSize:
                '12px',

              fontWeight:
                '900',
            },
          },

          '▲'
        ),

        h(
          'div',
          {
            style: {
              position:
                'absolute',

              left:
                '50%',

              top:
                '37px',

              transform:
                'translateX(-50%)',

              whiteSpace:
                'nowrap',

              padding:
                '3px 7px',

              borderRadius:
                '999px',

              background:
                'rgba(0,0,0,.82)',

              border:
                '1px solid rgba(255,255,255,.16)',

              color:
                '#ffffff',

              fontSize:
                '9px',

              fontWeight:
                '900',
            },
          },

          playerName
        )
      );
    }

    // ========================================
    // MOBILE CONTROL
    // ========================================

    function controlButton(
      label,
      action
    ) {
      return h(
        'button',
        {
          type:
            'button',

          onClick:
            action,

          style: {
            width:
              '46px',

            height:
              '42px',

            border:
              '1px solid rgba(255,255,255,.12)',

            borderRadius:
              '10px',

            background:
              'rgba(12,14,18,.92)',

            color:
              '#fff',

            fontSize:
              '18px',

            fontWeight:
              '900',

            cursor:
              'pointer',
          },
        },

        label
      );
    }

    // ========================================
    // RENDER
    // ========================================

    return h(
      React.Fragment,
      null,

      h(
        'style',
        null,

        `
          .team4-city-map:focus {
            outline: 2px solid rgba(239,27,19,.65);
            outline-offset: 3px;
          }

          .team4-city-building {
            transition:
              transform .18s ease,
              filter .18s ease;
          }

          @media (hover:hover) and (pointer:fine) {
            .team4-city-building:hover {
              filter: brightness(1.08);
            }
          }

          .team4-city-car-east {
            animation:
              team4CarEast 13s linear infinite;
          }

          .team4-city-car-west {
            animation:
              team4CarWest 17s linear infinite;
          }

          .team4-city-bus {
            animation:
              team4Bus 22s linear infinite;
          }

          .team4-city-taxi {
            animation:
              team4Taxi 15s linear infinite;
          }

          @keyframes team4CarEast {
            from {
              left: 2%;
            }

            to {
              left: 96%;
            }
          }

          @keyframes team4CarWest {
            from {
              left: 95%;
            }

            to {
              left: 2%;
            }
          }

          @keyframes team4Bus {
            from {
              top: 3%;
            }

            to {
              top: 95%;
            }
          }

          @keyframes team4Taxi {
            0% {
              left: 10%;
            }

            50% {
              left: 80%;
            }

            100% {
              left: 10%;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .team4-city-car-east,
            .team4-city-car-west,
            .team4-city-bus,
            .team4-city-taxi {
              animation: none !important;
            }
          }

          @media (max-width: 980px) {
            .team4-city-main-grid {
              grid-template-columns:
                1fr !important;
            }

            .team4-city-map {
              min-height:
                620px !important;
            }
          }

          @media (max-width: 640px) {
            .team4-city-map {
              min-height:
                540px !important;
            }

            .team4-city-desktop-help {
              display:
                none !important;
            }
          }
        `
      ),

      Header
        ? h(
            Header,
            {
              lang,
              setLang,
            }
          )
        : null,

      h(
        'main',
        {
          style: {
            minHeight:
              '100vh',

            padding:
              '110px 22px 70px',

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
                '1450px',

              margin:
                '0 auto',
            },
          },

          // ====================================
          // TITLE + CLOCK
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

                flexWrap:
                  'wrap',

                gap:
                  '16px',

                marginBottom:
                  '18px',
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
                      '5px',

                    color:
                      '#ef1b13',

                    fontSize:
                      '11px',

                    fontWeight:
                      '900',

                    letterSpacing:
                      '.15em',
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
                      'clamp(32px,5vw,55px)',

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
                      'rgba(255,255,255,.55)',

                    fontSize:
                      '13px',
                  },
                },

                isGeo
                  ? 'ქალაქში უკვე შენ მართავ პროცესს.'
                  : 'You are now in control of the city.'
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
                    '#111319',

                  border:
                    '1px solid rgba(255,255,255,.10)',

                  fontSize:
                    '12px',

                  fontWeight:
                    '900',
                },
              },

              (
                isGeo
                  ? 'DAY 1 • '
                  : 'DAY 1 • '
              ) +
                formatGameTime() +
                (
                  isGeo
                    ? ' • სექტემბერი'
                    : ' • September'
                )
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

                flexWrap:
                  'wrap',

                gap:
                  '9px',

                marginBottom:
                  '18px',
              },
            },

            hudItem(
              '💰',
              isGeo
                ? 'ფული'
                : 'Cash',
              cash +
                ' ₾'
            ),

            hudItem(
              '⚡',
              isGeo
                ? 'ენერგია'
                : 'Energy',
              energy +
                '/100'
            ),

            hudItem(
              '🧠',
              isGeo
                ? 'სტრესი'
                : 'Stress',
              stress +
                '/100'
            ),

            hudItem(
              '⭐',
              isGeo
                ? 'რეპუტაცია'
                : 'Reputation',
              reputation
            ),

            hudItem(
              '🏆',
              'Sales XP',
              salesXP
            )
          ),

          // ====================================
          // MAIN GRID
          // ====================================

          h(
            'div',
            {
              className:
                'team4-city-main-grid',

              style: {
                display:
                  'grid',

                gridTemplateColumns:
                  'minmax(0,1fr) 320px',

                gap:
                  '18px',

                alignItems:
                  'start',
              },
            },

            // ==================================
            // MAP
            // ==================================

            h(
              'div',
              {
                ref:
                  mapRef,

                className:
                  'team4-city-map',

                tabIndex:
                  0,

                role:
                  'application',

                onKeyDown:
                  handleMapKeyDown,

                onClick:
                  focusMap,

                'aria-label':
                  isGeo
                    ? 'Team4 City ინტერაქტიული რუკა'
                    : 'Team4 City interactive map',

                style: {
                  position:
                    'relative',

                  minHeight:
                    '720px',

                  overflow:
                    'hidden',

                  borderRadius:
                    '24px',

                  border:
                    '1px solid rgba(255,255,255,.10)',

                  background:
                    'radial-gradient(circle at 50% 40%,rgba(28,34,46,.88),rgba(8,10,14,.98) 72%)',

                  boxShadow:
                    '0 28px 75px rgba(0,0,0,.38)',

                  cursor:
                    'default',

                  userSelect:
                    'none',
                },
              },

              // =================================
              // CITY BLOCK BACKGROUND
              // =================================

              [
                {
                  left: '0%',
                  top: '0%',
                  w: '29%',
                  h: '31%',
                },

                {
                  left: '31%',
                  top: '0%',
                  w: '28%',
                  h: '31%',
                },

                {
                  left: '71%',
                  top: '35%',
                  w: '29%',
                  h: '39%',
                },

                {
                  left: '0%',
                  top: '53%',
                  w: '27%',
                  h: '47%',
                },

                {
                  left: '42%',
                  top: '70%',
                  w: '42%',
                  h: '30%',
                },
              ].map(
                function (
                  block,
                  index
                ) {
                  return h(
                    'div',
                    {
                      key:
                        'city-block-' +
                        index,

                      style: {
                        position:
                          'absolute',

                        left:
                          block.left,

                        top:
                          block.top,

                        width:
                          block.w,

                        height:
                          block.h,

                        background:
                          'linear-gradient(145deg,rgba(30,35,42,.80),rgba(14,16,20,.75))',

                        border:
                          '1px solid rgba(255,255,255,.025)',

                        zIndex:
                          1,
                      },
                    }
                  );
                }
              ),

              // =================================
              // ROADS
              // =================================

              h(
                'div',
                {
                  style: {
                    position:
                      'absolute',

                    left:
                      '0',

                    right:
                      '0',

                    top:
                      '34%',

                    height:
                      '14%',

                    background:
                      '#151820',

                    borderTop:
                      '4px solid #262a33',

                    borderBottom:
                      '4px solid #262a33',

                    zIndex:
                      3,
                  },
                }
              ),

              h(
                'div',
                {
                  style: {
                    position:
                      'absolute',

                    left:
                      '0',

                    right:
                      '0',

                    top:
                      '72%',

                    height:
                      '13%',

                    background:
                      '#151820',

                    borderTop:
                      '4px solid #262a33',

                    borderBottom:
                      '4px solid #262a33',

                    zIndex:
                      3,
                  },
                }
              ),

              h(
                'div',
                {
                  style: {
                    position:
                      'absolute',

                    left:
                      '28%',

                    top:
                      '0',

                    width:
                      '11%',

                    height:
                      '100%',

                    background:
                      '#151820',

                    borderLeft:
                      '4px solid #262a33',

                    borderRight:
                      '4px solid #262a33',

                    zIndex:
                      3,
                  },
                }
              ),

              h(
                'div',
                {
                  style: {
                    position:
                      'absolute',

                    left:
                      '59%',

                    top:
                      '0',

                    width:
                      '11%',

                    height:
                      '100%',

                    background:
                      '#151820',

                    borderLeft:
                      '4px solid #262a33',

                    borderRight:
                      '4px solid #262a33',

                    zIndex:
                      3,
                  },
                }
              ),

              // =================================
              // ROAD LANE MARKINGS
              // =================================

              h(
                'div',
                {
                  style: {
                    position:
                      'absolute',

                    left:
                      '0',

                    right:
                      '0',

                    top:
                      '40.8%',

                    height:
                      '2px',

                    zIndex:
                      4,

                    background:
                      'repeating-linear-gradient(90deg,rgba(255,255,255,.35) 0 24px,transparent 24px 52px)',
                  },
                }
              ),

              h(
                'div',
                {
                  style: {
                    position:
                      'absolute',

                    left:
                      '0',

                    right:
                      '0',

                    top:
                      '78.2%',

                    height:
                      '2px',

                    zIndex:
                      4,

                    background:
                      'repeating-linear-gradient(90deg,rgba(255,255,255,.30) 0 24px,transparent 24px 52px)',
                  },
                }
              ),

              h(
                'div',
                {
                  style: {
                    position:
                      'absolute',

                    left:
                      '33.4%',

                    top:
                      '0',

                    width:
                      '2px',

                    height:
                      '100%',

                    zIndex:
                      4,

                    background:
                      'repeating-linear-gradient(180deg,rgba(255,255,255,.28) 0 24px,transparent 24px 52px)',
                  },
                }
              ),

              h(
                'div',
                {
                  style: {
                    position:
                      'absolute',

                    left:
                      '64.4%',

                    top:
                      '0',

                    width:
                      '2px',

                    height:
                      '100%',

                    zIndex:
                      4,

                    background:
                      'repeating-linear-gradient(180deg,rgba(255,255,255,.28) 0 24px,transparent 24px 52px)',
                  },
                }
              ),

              // =================================
              // CROSSWALKS
              // =================================

              [
                {
                  left: '29%',
                  top: '32%',
                },

                {
                  left: '60%',
                  top: '32%',
                },

                {
                  left: '29%',
                  top: '70%',
                },

                {
                  left: '60%',
                  top: '70%',
                },
              ].map(
                function (
                  cross,
                  index
                ) {
                  return h(
                    'div',
                    {
                      key:
                        'cross-' +
                        index,

                      style: {
                        position:
                          'absolute',

                        left:
                          cross.left,

                        top:
                          cross.top,

                        width:
                          '9%',

                        height:
                          '18%',

                        zIndex:
                          5,

                        opacity:
                          .35,

                        background:
                          'repeating-linear-gradient(90deg,#fff 0 5px,transparent 5px 11px)',
                      },
                    }
                  );
                }
              ),

              // =================================
              // PARK / GREEN SPACE
              // =================================

              h(
                'div',
                {
                  style: {
                    position:
                      'absolute',

                    left:
                      '40%',

                    top:
                      '50%',

                    width:
                      '17%',

                    height:
                      '18%',

                    borderRadius:
                      '16px',

                    zIndex:
                      2,

                    background:
                      'radial-gradient(circle at 30% 30%,rgba(47,130,74,.38),rgba(16,53,29,.62))',

                    border:
                      '1px solid rgba(69,160,93,.18)',
                  },
                },

                h(
                  'div',
                  {
                    style: {
                      position:
                        'absolute',

                      inset:
                        '10px',

                      borderRadius:
                        '12px',

                      border:
                        '1px dashed rgba(255,255,255,.10)',
                    },
                  }
                )
              ),

              // TREES
              [
                ['42%', '52%'],
                ['47%', '54%'],
                ['52%', '52%'],
                ['43%', '63%'],
                ['50%', '64%'],
                ['55%', '61%'],
                ['16%', '49%'],
                ['84%', '31%'],
              ].map(
                function (
                  tree,
                  index
                ) {
                  return h(
                    'div',
                    {
                      key:
                        'tree-' +
                        index,

                      style: {
                        position:
                          'absolute',

                        left:
                          tree[0],

                        top:
                          tree[1],

                        zIndex:
                          6,

                        fontSize:
                          '21px',

                        filter:
                          'brightness(.65)',
                      },
                    },

                    '🌳'
                  );
                }
              ),

              // =================================
              // BUILDINGS
              // =================================

              buildings.map(
                renderBuilding
              ),

              buildings.map(
                renderEntrance
              ),

              // =================================
              // TRANSPORT
              // =================================

              vehicle(
                '🚗',
                '8%',
                '38%',
                0,
                'team4-city-car-east',
                'Car'
              ),

              vehicle(
                '🚙',
                '88%',
                '44%',
                180,
                'team4-city-car-west',
                'Car'
              ),

              vehicle(
                '🚕',
                '14%',
                '76%',
                0,
                'team4-city-taxi',
                'Taxi'
              ),

              vehicle(
                '🚌',
                '63%',
                '12%',
                90,
                'team4-city-bus',
                'Bus'
              ),

              // =================================
              // METRO STATION
              // =================================

              h(
                'div',
                {
                  style: {
                    position:
                      'absolute',

                    left:
                      '41%',

                    top:
                      '32%',

                    transform:
                      'translate(-50%,-50%)',

                    zIndex:
                      20,

                    padding:
                      '7px 10px',

                    borderRadius:
                      '10px',

                    background:
                      'rgba(25,18,38,.94)',

                    border:
                      '1px solid rgba(185,83,255,.45)',

                    fontSize:
                      '10px',

                    fontWeight:
                      '900',
                  },
                },

                '🚇 ' +
                  (
                    isGeo
                      ? 'მეტრო'
                      : 'Metro'
                  )
              ),

              // =================================
              // BUS STOP
              // =================================

              h(
                'div',
                {
                  style: {
                    position:
                      'absolute',

                    left:
                      '61%',

                    top:
                      '67%',

                    zIndex:
                      20,

                    padding:
                      '6px 9px',

                    borderRadius:
                      '9px',

                    background:
                      'rgba(8,10,14,.90)',

                    border:
                      '1px solid rgba(95,155,255,.30)',

                    color:
                      'rgba(255,255,255,.72)',

                    fontSize:
                      '9px',

                    fontWeight:
                      '900',
                  },
                },

                '🚏 BUS'
              ),

              // =================================
              // TAXI POINT
              // =================================

              h(
                'div',
                {
                  style: {
                    position:
                      'absolute',

                    left:
                      '43%',

                    top:
                      '86%',

                    zIndex:
                      20,

                    padding:
                      '6px 10px',

                    borderRadius:
                      '9px',

                    background:
                      '#16130b',

                    border:
                      '1px solid rgba(255,199,0,.35)',

                    color:
                      '#ffc400',

                    fontSize:
                      '9px',

                    fontWeight:
                      '900',
                  },
                },

                '🚕 TAXI'
              ),

              // =================================
              // DESTINATION LINE / MARKER
              // =================================

              destination ===
                'office'
                ? h(
                    'div',
                    {
                      style: {
                        position:
                          'absolute',

                        left:
                          '70%',

                        top:
                          '39%',

                        transform:
                          'translate(-50%,-50%)',

                        zIndex:
                          32,

                        padding:
                          '5px 9px',

                        borderRadius:
                          '999px',

                        background:
                          '#ef1b13',

                        color:
                          '#fff',

                        fontSize:
                          '9px',

                        fontWeight:
                          '900',

                        boxShadow:
                          '0 0 20px rgba(239,27,19,.55)',
                      },
                    },

                    isGeo
                      ? '🎯 მიზანი'
                      : '🎯 TARGET'
                  )
                : null,

              // =================================
              // PLAYER
              // =================================

              renderPlayer(),

              // =================================
              // INTERACTION MESSAGE
              // =================================

              nearbyLocation &&
              !nearbyLocation.locked
                ? h(
                    'div',
                    {
                      style: {
                        position:
                          'absolute',

                        left:
                          playerPosition.x +
                          '%',

                        top:
                          Math.max(
                            3,
                            playerPosition.y -
                              8
                          ) +
                          '%',

                        transform:
                          'translateX(-50%)',

                        zIndex:
                          90,

                        padding:
                          '6px 10px',

                        borderRadius:
                          '999px',

                        background:
                          '#000',

                        border:
                          '1px solid rgba(255,255,255,.20)',

                        color:
                          '#fff',

                        fontSize:
                          '10px',

                        fontWeight:
                          '900',

                        whiteSpace:
                          'nowrap',
                      },
                    },

                    isGeo
                      ? 'ENTER — შესვლა'
                      : 'ENTER — Enter'
                  )
                : null,

              // =================================
              // KEYBOARD HELP
              // =================================

              h(
                'div',
                {
                  className:
                    'team4-city-desktop-help',

                  style: {
                    position:
                      'absolute',

                    left:
                      '16px',

                    bottom:
                      '14px',

                    zIndex:
                      100,

                    padding:
                      '9px 11px',

                    borderRadius:
                      '10px',

                    background:
                      'rgba(0,0,0,.72)',

                    border:
                      '1px solid rgba(255,255,255,.10)',

                    color:
                      'rgba(255,255,255,.60)',

                    fontSize:
                      '10px',

                    fontWeight:
                      '800',
                  },
                },

                'WASD / ↑↓←→  •  ENTER / E'
              ),

              // =================================
              // MOBILE D-PAD
              // =================================

              h(
                'div',
                {
                  style: {
                    position:
                      'absolute',

                    right:
                      '14px',

                    bottom:
                      '14px',

                    zIndex:
                      110,

                    display:
                      'grid',

                    gridTemplateColumns:
                      '46px 46px 46px',

                    gridTemplateRows:
                      '42px 42px 42px',

                    gap:
                      '5px',
                  },
                },

                h('div'),

                controlButton(
                  '↑',
                  function () {
                    movePlayer(
                      0,
                      -1,
                      'up'
                    );
                  }
                ),

                h('div'),

                controlButton(
                  '←',
                  function () {
                    movePlayer(
                      -1,
                      0,
                      'left'
                    );
                  }
                ),

                controlButton(
                  'E',
                  interact
                ),

                controlButton(
                  '→',
                  function () {
                    movePlayer(
                      1,
                      0,
                      'right'
                    );
                  }
                ),

                h('div'),

                controlButton(
                  '↓',
                  function () {
                    movePlayer(
                      0,
                      1,
                      'down'
                    );
                  }
                ),

                h('div')
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

                  gap:
                    '12px',
                },
              },

              // MISSION
              h(
                'div',
                {
                  style: {
                    padding:
                      '20px',

                    borderRadius:
                      '18px',

                    background:
                      '#111319',

                    border:
                      '1px solid rgba(239,27,19,.30)',
                  },
                },

                h(
                  'div',
                  {
                    style: {
                      marginBottom:
                        '7px',

                      color:
                        '#ef1b13',

                      fontSize:
                        '10px',

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
                        '28px',

                      lineHeight:
                        '1.05',

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
                        '0 0 15px',

                      color:
                        'rgba(255,255,255,.60)',

                      fontSize:
                        '13px',

                      lineHeight:
                        '1.55',
                    },
                  },

                  isGeo
                    ? 'მიდი ოფისში 09:00-მდე. ამჯერად შენ თვითონ უნდა მიხვიდე.'
                    : 'Get to the office before 09:00. This time you must travel there yourself.'
                ),

                h(
                  'button',
                  {
                    type:
                      'button',

                    onClick:
                      focusMap,

                    style: {
                      width:
                        '100%',

                      padding:
                        '13px 14px',

                      border:
                        'none',

                      borderRadius:
                        '11px',

                      background:
                        '#ef1b13',

                      color:
                        '#fff',

                      fontSize:
                        '13px',

                      fontWeight:
                        '900',

                      cursor:
                        'pointer',
                    },
                  },

                  isGeo
                    ? '🚶 დაიწყე მოძრაობა →'
                    : '🚶 Start Walking →'
                )
              ),

              // LIVE STATUS
              h(
                'div',
                {
                  style: {
                    padding:
                      '18px',

                    borderRadius:
                      '18px',

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
                        '9px',

                      fontSize:
                        '13px',

                      fontWeight:
                        '900',
                    },
                  },

                  isGeo
                    ? '📍 მიმდინარე მდგომარეობა'
                    : '📍 LIVE STATUS'
                ),

                h(
                  'div',
                  {
                    style: {
                      color:
                        'rgba(255,255,255,.65)',

                      fontSize:
                        '12px',

                      lineHeight:
                        '1.6',
                    },
                  },

                  message
                )
              ),

              // TRANSPORT
              h(
                'div',
                {
                  style: {
                    padding:
                      '18px',

                    borderRadius:
                      '18px',

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
                        '13px',

                      fontWeight:
                        '900',
                    },
                  },

                  isGeo
                    ? '🚦 გადაადგილება'
                    : '🚦 TRANSPORT'
                ),

                h(
                  'div',
                  {
                    style: {
                      display:
                        'grid',

                      gap:
                        '8px',
                    },
                  },

                  h(
                    'div',
                    {
                      style: {
                        padding:
                          '10px',

                        borderRadius:
                          '10px',

                        background:
                          'rgba(51,209,122,.07)',

                        border:
                          '1px solid rgba(51,209,122,.22)',

                        color:
                          '#75e6a2',

                        fontSize:
                          '11px',

                        fontWeight:
                          '900',
                      },
                    },

                    isGeo
                      ? '🚶 ფეხით — აქტიური'
                      : '🚶 Walking — Active'
                  ),

                  h(
                    'div',
                    {
                      style: {
                        padding:
                          '10px',

                        borderRadius:
                          '10px',

                        background:
                          'rgba(255,255,255,.035)',

                        border:
                          '1px solid rgba(255,255,255,.06)',

                        color:
                          'rgba(255,255,255,.40)',

                        fontSize:
                          '11px',

                        fontWeight:
                          '800',
                      },
                    },

                    isGeo
                      ? '🚕 ტაქსი — შემდეგი განახლება'
                      : '🚕 Taxi — Next Upgrade'
                  ),

                  h(
                    'div',
                    {
                      style: {
                        padding:
                          '10px',

                        borderRadius:
                          '10px',

                        background:
                          'rgba(255,255,255,.035)',

                        border:
                          '1px solid rgba(255,255,255,.06)',

                        color:
                          'rgba(255,255,255,.40)',

                        fontSize:
                          '11px',

                        fontWeight:
                          '800',
                      },
                    },

                    isGeo
                      ? '🚗 საკუთარი მანქანა — ჯერ არ გაქვს'
                      : '🚗 Personal Car — Not Owned Yet'
                  )
                )
              ),

              // HOME
              h(
                'div',
                {
                  style: {
                    padding:
                      '18px',

                    borderRadius:
                      '18px',

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
                        '10px',

                      fontSize:
                        '13px',

                      fontWeight:
                        '900',
                    },
                  },

                  '🏠 ' +
                    (
                      isGeo
                        ? 'შენი სახლი'
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
                        '6px',

                      color:
                        'rgba(255,255,255,.60)',

                      fontSize:
                        '11px',
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
                        ? 'ოფისამდე საბაზო დრო: '
                        : 'Base commute: '
                    ) +
                      commuteMinutes +
                      (
                        isGeo
                          ? ' წუთი'
                          : ' min'
                      )
                  )
                )
              )
            )
          )
        )
      ),

      Footer
        ? h(
            Footer,
            {
              lang,
            }
          )
        : null
    );
  }

  // ==========================================
  // EXPORT
  // ==========================================

  window.Team4CityPage =
    Team4CityPage;
})();

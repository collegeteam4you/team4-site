// ==========================================
// TEAM4 CITY — ENGINE V2
// TOP-DOWN PLAYABLE CITY
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
        'TEAM4 CITY storage error:',
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

  function pointInsideRect(point, rect, margin) {
    const m = margin || 0;

    return (
      point.x > rect.x - m &&
      point.x < rect.x + rect.w + m &&
      point.y > rect.y - m &&
      point.y < rect.y + rect.h + m
    );
  }

  // ==========================================
  // PAGE
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
    // APARTMENT
    // ========================================

    const selectedApartment =
      React.useMemo(function () {
        return readJSON(
          'team4SelectedApartment',
          null
        );
      }, []);

    const apartmentDeal =
      React.useMemo(function () {
        return readJSON(
          'team4ApartmentDeal',
          null
        );
      }, []);

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
          Number(selectedApartment.finalRent)
        ? Number(selectedApartment.finalRent)
        : selectedApartment &&
          Number(selectedApartment.rent)
        ? Number(selectedApartment.rent)
        : isEconomy
        ? 650
        : 900;

    const totalDeposit =
      apartmentDeal &&
      Number(apartmentDeal.deposit)
        ? Number(apartmentDeal.deposit)
        : selectedApartment &&
          Number(selectedApartment.finalDeposit)
        ? Number(selectedApartment.finalDeposit)
        : selectedApartment &&
          Number(selectedApartment.deposit)
        ? Number(selectedApartment.deposit)
        : isEconomy
        ? 650
        : 900;

    const depositPaidNow =
      apartmentDeal &&
      apartmentDeal.depositPaidNow != null
        ? Number(apartmentDeal.depositPaidNow)
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
// PLAYER
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
// SAVED AVATAR
// ========================================

const savedAvatar =
  React.useMemo(function () {
    const user =
      readJSON(
        'team4LabUser',
        null
      );

    if (
      user &&
      user.avatar
    ) {
      return user.avatar;
    }

    return {
      gender:
        localStorage.getItem(
          'team4AvatarGender'
        ) || 'male',

      look:
        localStorage.getItem(
          'team4AvatarLook'
        ) || 'team4-look',

      hair:
        localStorage.getItem(
          'team4AvatarHair'
        ) || 'none',

      beard:
        localStorage.getItem(
          'team4AvatarBeard'
        ) || 'none',

      accessory:
        localStorage.getItem(
          'team4AvatarAccessory'
        ) || 'none',

      hairX:
        Number(
          localStorage.getItem(
            'team4AvatarHairX'
          )
        ) || 0,

      hairY:
        Number(
          localStorage.getItem(
            'team4AvatarHairY'
          )
        ) || 0,

      hairScale:
        Number(
          localStorage.getItem(
            'team4AvatarHairScale'
          )
        ) || 1,

      beardX:
        Number(
          localStorage.getItem(
            'team4AvatarBeardX'
          )
        ) || 0,

      beardY:
        Number(
          localStorage.getItem(
            'team4AvatarBeardY'
          )
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
    };
  }, []);

// ========================================
// BUILDINGS
// ========================================
    const homeRect =
      isEconomy
        ? {
            x: 5,
            y: 64,
            w: 21,
            h: 24,
          }
        : {
            x: 5,
            y: 58,
            w: 21,
            h: 25,
          };

    const homeEntrance =
      isEconomy
        ? {
            x: 28,
            y: 77,
          }
        : {
            x: 28,
            y: 71,
          };

    const buildings = [
      {
        id: 'home',

        type: 'residential',

        titleGeo: 'სახლი',
        titleEng: 'Home',

        subtitleGeo:
          homeDistrict,

        subtitleEng:
          homeDistrict,

        rect:
          homeRect,

        entrance:
          homeEntrance,

        locked: false,

        accent:
          '#4bd17f',
      },

      {
        id: 'gym',

        type: 'gym',

        titleGeo:
          'Team4 Gym',

        titleEng:
          'Team4 Gym',

        subtitleGeo:
          'ენერგია და სტრესი',

        subtitleEng:
          'Energy & Stress',

        rect: {
          x: 4,
          y: 5,
          w: 23,
          h: 22,
        },

        entrance: {
          x: 29,
          y: 17,
        },

        locked: true,

        accent:
          '#f0a027',
      },

      {
        id: 'bank',

        type: 'bank',

        titleGeo:
          'Team4 Bank',

        titleEng:
          'Team4 Bank',

        subtitleGeo:
          'ფინანსური ცენტრი',

        subtitleEng:
          'Financial Center',

        rect: {
          x: 38,
          y: 5,
          w: 20,
          h: 24,
        },

        entrance: {
          x: 48,
          y: 32,
        },

        locked: true,

        accent:
          '#f0c64a',
      },

      {
        id: 'office',

        type: 'office',

        titleGeo:
          'Team4 Office',

        titleEng:
          'Team4 Office',

        subtitleGeo:
          'სამუშაო ადგილი',

        subtitleEng:
          'Work Place',

        rect: {
          x: 71,
          y: 4,
          w: 25,
          h: 30,
        },

        entrance: {
          x: 69,
          y: 37,
        },

        locked: false,

        accent:
          '#ef1b13',
      },

      {
        id: 'shop',

        type: 'shop',

        titleGeo:
          'Team4 Shop',

        titleEng:
          'Team4 Shop',

        subtitleGeo:
          'Shopping Center',

        subtitleEng:
          'Shopping Center',

        rect: {
          x: 74,
          y: 51,
          w: 22,
          h: 22,
        },

        entrance: {
          x: 71,
          y: 62,
        },

        locked: true,

        accent:
          '#766cff',
      },

      {
        id: 'dealer',

        type: 'dealer',

        titleGeo:
          'Team4 Motors',

        titleEng:
          'Team4 Motors',

        subtitleGeo:
          'ავტოსალონი',

        subtitleEng:
          'Car Dealer',

        rect: {
          x: 51,
          y: 76,
          w: 28,
          h: 20,
        },

        entrance: {
          x: 49,
          y: 85,
        },

        locked: true,

        accent:
          '#ffbd22',
      },
    ];

    // ========================================
    // SAVED CITY STATE
    // ========================================

    const savedCityState =
      React.useMemo(function () {
        return readJSON(
          'team4CityState',
          null
        );
      }, []);

    const defaultPosition = {
      x:
        homeEntrance.x + 3,

      y:
        homeEntrance.y,
    };

    const [
      playerPosition,
      setPlayerPosition,
    ] = React.useState(
      savedCityState &&
      savedCityState.position
        ? {
            x:
              Number(
                savedCityState.position.x
              ) ||
              defaultPosition.x,

            y:
              Number(
                savedCityState.position.y
              ) ||
              defaultPosition.y,
          }
        : defaultPosition
    );

    const [
      direction,
      setDirection,
    ] = React.useState('right');

    const [
      gameMinute,
      setGameMinute,
    ] = React.useState(
      savedCityState &&
      savedCityState.gameMinute != null
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
      stepCount,
      setStepCount,
    ] = React.useState(0);

    const [
      message,
      setMessage,
    ] = React.useState(
      isGeo
        ? '🎯 მიდი Team4 Office-ში 09:00-მდე.'
        : '🎯 Get to Team4 Office before 09:00.'
    );

    const mapRef =
      React.useRef(null);

    // ========================================
    // SAVE
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
        apartmentId,
      ]
    );

    // ========================================
    // TIME
    // ========================================

    function gameTimeText() {
      const normalized =
        gameMinute %
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
          pointInsideRect(
            next,
            buildings[i].rect,
            1
          )
        ) {
          return false;
        }
      }

      return true;
    }

    // ========================================
    // NEARBY
    // ========================================

    function getNearbyLocation(position) {
      let nearest = null;

      let nearestDistance =
        Infinity;

      buildings.forEach(
        function (building) {
          const d =
            distance(
              position,
              building.entrance
            );

          if (
            d <= 5 &&
            d < nearestDistance
          ) {
            nearest =
              building;

            nearestDistance =
              d;
          }
        }
      );

      return nearest;
    }

    const nearbyLocation =
      getNearbyLocation(
        playerPosition
      );

    // ========================================
    // MOVE
    // ========================================

    function movePlayer(
      dx,
      dy,
      newDirection
    ) {
      const speed = 1.45;

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
            ? '🚧 აქ შენობაა — შემოუარე.'
            : '🚧 Building ahead — go around.'
        );

        return;
      }

      setDirection(
        newDirection
      );

      setPlayerPosition(
        next
      );

      setGameMinute(
        function (value) {
          return value + 1;
        }
      );

      const newStepCount =
        stepCount + 1;

      setStepCount(
        newStepCount
      );

      if (
        newStepCount % 6 ===
        0
      ) {
        setEnergy(
          function (value) {
            return clamp(
              value - 1,
              0,
              100
            );
          }
        );
      }

      const nearby =
        getNearbyLocation(
          next
        );

      if (nearby) {
        if (nearby.locked) {
          setMessage(
            isGeo
              ? '🔒 ' +
                nearby.titleGeo +
                ' ჯერ ჩაკეტილია.'
              : '🔒 ' +
                nearby.titleEng +
                ' is locked.'
          );
        } else {
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
      } else {
        setMessage(
          isGeo
            ? '🎯 მიდი ოფისის წითელ შესასვლელთან.'
            : '🎯 Reach the red Office entrance.'
        );
      }
    }

    // ========================================
    // ENTER LOCATION
    // ========================================

    function interact() {
      const nearby =
        getNearbyLocation(
          playerPosition
        );

      if (!nearby) {
        setMessage(
          isGeo
            ? 'ახლოს შესასვლელი არ არის.'
            : 'No entrance nearby.'
        );

        return;
      }

      if (nearby.locked) {
        setMessage(
          isGeo
            ? '🔒 ეს ლოკაცია ჯერ ჩაკეტილია.'
            : '🔒 This location is locked.'
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
          gameTimeText()
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
            ? '🏠 შენს სახლთან ხარ.'
            : '🏠 You are at home.'
        );
      }
    }

    // ========================================
    // KEYBOARD
    // ========================================

    function handleKeyDown(event) {
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
        key === 'e' ||
        key === 'enter'
      ) {
        event.preventDefault();

        interact();
      }
    }

    function focusMap() {
      if (mapRef.current) {
        mapRef.current.focus();
      }

      setMessage(
        isGeo
          ? '🚶 Walking Mode — WASD / ისრები.'
          : '🚶 Walking Mode — WASD / arrow keys.'
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
              '118px',

            padding:
              '11px 13px',

            borderRadius:
              '13px',

            background:
              '#101217',

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
                'rgba(255,255,255,.45)',

              fontSize:
                '9px',

              fontWeight:
                '900',

              letterSpacing:
                '.08em',
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
    // BUILDING WINDOWS
    // ========================================

    function buildingWindows(
      count,
      locked
    ) {
      const result = [];

      for (
        let i = 0;
        i < count;
        i += 1
      ) {
        result.push(
          h(
            'span',
            {
              key:
                'window-' +
                i,

              style: {
                height:
                  '9px',

                borderRadius:
                  '2px',

                background:
                  locked
                    ? 'rgba(255,255,255,.055)'
                    : i % 3 === 0
                    ? 'rgba(255,205,105,.44)'
                    : 'rgba(135,174,210,.18)',

                border:
                  '1px solid rgba(255,255,255,.03)',
              },
            }
          )
        );
      }

      return result;
    }

    // ========================================
    // BUILDING
    // ========================================

    function renderBuilding(
      building
    ) {
      const rect =
        building.rect;

      const isOffice =
        building.id === 'office';

      const isDealer =
        building.id === 'dealer';

      const isBank =
        building.id === 'bank';

      return h(
        'div',
        {
          key:
            building.id,

          style: {
            position:
              'absolute',

            left:
              rect.x + '%',

            top:
              rect.y + '%',

            width:
              rect.w + '%',

            height:
              rect.h + '%',

            zIndex:
              20,

            borderRadius:
              isBank
                ? '8px'
                : '13px',

            overflow:
              'hidden',

            background:
              building.type ===
              'residential'
                ? 'linear-gradient(135deg,#262932,#16191f)'
                : building.type ===
                  'office'
                ? 'linear-gradient(135deg,#252c34,#11151b)'
                : building.type ===
                  'shop'
                ? 'linear-gradient(135deg,#202938,#11151d)'
                : building.type ===
                  'dealer'
                ? 'linear-gradient(135deg,#292621,#141311)'
                : 'linear-gradient(135deg,#282a2e,#15171b)',

            border:
              isOffice
                ? '2px solid rgba(239,27,19,.72)'
                : '1px solid rgba(255,255,255,.11)',

            boxShadow:
              '0 14px 25px rgba(0,0,0,.52)',

            opacity:
              building.locked
                ? .70
                : 1,
          },
        },

        // roof edge
        h(
          'div',
          {
            style: {
              position:
                'absolute',

              inset:
                '6px',

              borderRadius:
                '8px',

              border:
                '1px solid rgba(255,255,255,.06)',

              boxShadow:
                'inset 0 0 30px rgba(0,0,0,.35)',
            },
          }
        ),

        // rooftop units
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
                '12%',

              display:
                'grid',

              gridTemplateColumns:
                'repeat(4,1fr)',

              gap:
                '5px',
            },
          },

          buildingWindows(
            isDealer
              ? 5
              : 8,
            building.locked
          )
        ),

        // additional roof block
        !isDealer
          ? h(
              'div',
              {
                style: {
                  position:
                    'absolute',

                  right:
                    '9%',

                  top:
                    '37%',

                  width:
                    '24%',

                  height:
                    '18%',

                  borderRadius:
                    '4px',

                  background:
                    'rgba(0,0,0,.20)',

                  border:
                    '1px solid rgba(255,255,255,.06)',
                },
              }
            )
          : null,

        // dealer parking cars
        isDealer
          ? h(
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
                    '37%',

                  display:
                    'grid',

                  gridTemplateColumns:
                    'repeat(5,1fr)',

                  gap:
                    '6px',
                },
              },

              [1,2,3,4,5].map(
                function (item) {
                  return h(
                    'div',
                    {
                      key:
                        'dealer-car-' +
                        item,

                      style: {
                        height:
                          '13px',

                        borderRadius:
                          '4px',

                        background:
                          item % 2
                            ? '#343c48'
                            : '#66211d',

                        border:
                          '1px solid rgba(255,255,255,.10)',
                      },
                    }
                  );
                }
              )
            )
          : null,

        // label
        h(
          'div',
          {
            style: {
              position:
                'absolute',

              left:
                '7px',

              right:
                '7px',

              bottom:
                '7px',

              padding:
                '7px 8px',

              borderRadius:
                '7px',

              background:
                'rgba(0,0,0,.78)',

              border:
                '1px solid rgba(255,255,255,.08)',
            },
          },

          h(
            'div',
            {
              style: {
                color:
                  building.locked
                    ? 'rgba(255,255,255,.50)'
                    : '#ffffff',

                fontSize:
                  '11px',

                fontWeight:
                  '900',
              },
            },

            building.locked
              ? '🔒 '
              : '',

            isGeo
              ? building.titleGeo
              : building.titleEng
          ),

          h(
            'div',
            {
              style: {
                marginTop:
                  '2px',

                color:
                  isOffice
                    ? '#ff453d'
                    : 'rgba(255,255,255,.43)',

                fontSize:
                  '8px',

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
    // ENTRANCE
    // ========================================

    function renderEntrance(
      building
    ) {
      const active =
        building.id ===
        'office';

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
              active
                ? '16px'
                : '11px',

            height:
              active
                ? '16px'
                : '11px',

            transform:
              'translate(-50%,-50%)',

            borderRadius:
              '50%',

            zIndex:
              70,

            background:
              building.locked
                ? '#555b64'
                : building.accent,

            boxShadow:
              active
                ? '0 0 0 8px rgba(239,27,19,.15),0 0 22px rgba(239,27,19,.75)'
                : '0 0 10px rgba(0,0,0,.5)',
          },
        }
      );
    }

    // ========================================
    // TOP VIEW CAR
    // ========================================

    function renderCar(
      key,
      left,
      top,
      rotation,
      className,
      bodyColor
    ) {
      return h(
        'div',
        {
          key,

          className:
            className,

          style: {
            position:
              'absolute',

            left,
            top,

            width:
              '22px',

            height:
              '42px',

            transform:
              'translate(-50%,-50%) rotate(' +
              rotation +
              'deg)',

            zIndex:
              12,

            borderRadius:
              '7px',

            background:
              bodyColor,

            border:
              '1px solid rgba(255,255,255,.20)',

            boxShadow:
              '0 5px 9px rgba(0,0,0,.55)',
          },
        },

        // windshield
        h(
          'div',
          {
            style: {
              position:
                'absolute',

              left:
                '4px',

              right:
                '4px',

              top:
                '7px',

              height:
                '9px',

              borderRadius:
                '3px',

              background:
                '#6e8796',
            },
          }
        ),

        // rear window
        h(
          'div',
          {
            style: {
              position:
                'absolute',

              left:
                '4px',

              right:
                '4px',

              bottom:
                '7px',

              height:
                '8px',

              borderRadius:
                '3px',

              background:
                '#455967',
            },
          }
        ),

        // headlights
        h(
          'div',
          {
            style: {
              position:
                'absolute',

              left:
                '3px',

              top:
                '1px',

              width:
                '5px',

              height:
                '3px',

              borderRadius:
                '2px',

              background:
                '#fff3b0',
            },
          }
        ),

        h(
          'div',
          {
            style: {
              position:
                'absolute',

              right:
                '3px',

              top:
                '1px',

              width:
                '5px',

              height:
                '3px',

              borderRadius:
                '2px',

              background:
                '#fff3b0',
            },
          }
        )
      );
    }

    // ========================================
    // PLAYER
    // ========================================

    function renderPlayer() {
      let rotation =
        0;

      if (
        direction === 'right'
      ) {
        rotation = 90;
      }

      if (
        direction === 'down'
      ) {
        rotation = 180;
      }

      if (
        direction === 'left'
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
              '25px',

            height:
              '25px',

            transform:
              'translate(-50%,-50%) rotate(' +
              rotation +
              'deg)',

            zIndex:
              100,

            transition:
              'left .09s linear, top .09s linear',
          },
        },

        // shadow
        h(
          'div',
          {
            style: {
              position:
                'absolute',

              left:
                '4px',

              top:
                '8px',

              width:
                '18px',

              height:
                '14px',

              borderRadius:
                '50%',

              background:
                'rgba(0,0,0,.40)',

              filter:
                'blur(2px)',
            },
          }
        ),

        // body top-down
        h(
          'div',
          {
            style: {
              position:
                'absolute',

              left:
                '7px',

              top:
                '7px',

              width:
                '12px',

              height:
                '17px',

              borderRadius:
                '6px',

              background:
                '#111',

              border:
                '2px solid #ef1b13',
            },
          }
        ),

        // head
        h(
          'div',
          {
            style: {
              position:
                'absolute',

              left:
                '8px',

              top:
                '0',

              width:
                '10px',

              height:
                '10px',

              borderRadius:
                '50%',

              background:
                '#d79a6e',

              border:
                '2px solid #fff',
            },
          }
        ),

        // direction arrow
        h(
          'div',
          {
            style: {
              position:
                'absolute',

              left:
                '8px',

              top:
                '-12px',

              color:
                '#ef1b13',

              fontSize:
                '11px',

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

              top:
                '30px',

              left:
                '50%',

              transform:
                'translateX(-50%) rotate(' +
                (-rotation) +
                'deg)',

              whiteSpace:
                'nowrap',

              padding:
                '3px 6px',

              borderRadius:
                '999px',

              background:
                'rgba(0,0,0,.80)',

              border:
                '1px solid rgba(255,255,255,.15)',

              fontSize:
                '8px',

              fontWeight:
                '900',
            },
          },

          playerName
        )
      );
    }

    // ========================================
    // CONTROL
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
              '44px',

            height:
              '40px',

            borderRadius:
              '9px',

            border:
              '1px solid rgba(255,255,255,.12)',

            background:
              '#101217',

            color:
              '#fff',

            fontSize:
              '16px',

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
        .t4city-map:focus {
          outline: 2px solid rgba(239,27,19,.70);
          outline-offset: 3px;
        }

        .t4-car-east-1 {
          animation: t4East1 15s linear infinite;
        }

        .t4-car-east-2 {
          animation: t4East2 21s linear infinite;
        }

        .t4-car-west-1 {
          animation: t4West1 18s linear infinite;
        }

        .t4-car-south {
          animation: t4South 19s linear infinite;
        }

        .t4-car-north {
          animation: t4North 23s linear infinite;
        }

        @keyframes t4East1 {
          from { left: -3%; }
          to   { left: 103%; }
        }

        @keyframes t4East2 {
          from { left: -8%; }
          to   { left: 105%; }
        }

        @keyframes t4West1 {
          from { left: 104%; }
          to   { left: -4%; }
        }

        @keyframes t4South {
          from { top: -5%; }
          to   { top: 105%; }
        }

        @keyframes t4North {
          from { top: 105%; }
          to   { top: -5%; }
        }

        @media (prefers-reduced-motion: reduce) {
          .t4-car-east-1,
          .t4-car-east-2,
          .t4-car-west-1,
          .t4-car-south,
          .t4-car-north {
            animation: none !important;
          }
        }

        @media (max-width: 980px) {
          .t4-city-grid {
            grid-template-columns: 1fr !important;
          }

          .t4city-map {
            min-height: 640px !important;
          }
        }

        @media (max-width: 640px) {
          .t4city-map {
            min-height: 560px !important;
          }
        }
        `
      ),

      Header
        ? h(Header, {
            lang,
            setLang,
          })
        : null,

      h(
        'main',
        {
          style: {
            minHeight:
              '100vh',

            padding:
              '105px 20px 70px',

            background:
              '#050507',

            color:
              '#fff',
          },
        },

        h(
          'section',
          {
            style: {
              maxWidth:
                '1480px',

              margin:
                '0 auto',
            },
          },

          // ====================================
          // HEADER AREA
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
                  '15px',

                marginBottom:
                  '17px',
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
                      '0',

                    fontSize:
                      'clamp(34px,5vw,55px)',

                    lineHeight:
                      '1',

                    fontWeight:
                      '900',
                  },
                },

                isGeo
                  ? 'შენი ქალაქი'
                  : 'Your City'
              )
            ),

            h(
              'div',
              {
                style: {
                  padding:
                    '9px 15px',

                  borderRadius:
                    '999px',

                  background:
                    '#101217',

                  border:
                    '1px solid rgba(255,255,255,.10)',

                  fontSize:
                    '12px',

                  fontWeight:
                    '900',
                },
              },

              'DAY 1 • ' +
                gameTimeText() +
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

                gap:
                  '8px',

                flexWrap:
                  'wrap',

                marginBottom:
                  '17px',
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
          // GRID
          // ====================================

          h(
            'div',
            {
              className:
                't4-city-grid',

              style: {
                display:
                  'grid',

                gridTemplateColumns:
                  'minmax(0,1fr) 315px',

                gap:
                  '17px',

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

                tabIndex:
                  0,

                onKeyDown:
                  handleKeyDown,

                onClick:
                  focusMap,

                className:
                  't4city-map',

                style: {
                  position:
                    'relative',

                  minHeight:
                    '750px',

                  overflow:
                    'hidden',

                  borderRadius:
                    '22px',

                  border:
                    '1px solid rgba(255,255,255,.12)',

                  background:
                    '#161a20',

                  boxShadow:
                    '0 25px 70px rgba(0,0,0,.45)',

                  userSelect:
                    'none',
                },
              },

              // =================================
              // CITY BLOCKS / SIDEWALKS
              // =================================

              [
                ['0%','0%','30%','33%'],
                ['39%','0%','20%','33%'],
                ['70%','0%','30%','35%'],
                ['0%','49%','29%','51%'],
                ['39%','49%','20%','23%'],
                ['70%','49%','30%','25%'],
                ['39%','86%','12%','14%'],
                ['80%','86%','20%','14%'],
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

                        background:
                          '#20242b',

                        border:
                          '1px solid rgba(255,255,255,.035)',

                        zIndex:
                          1,
                      },
                    }
                  );
                }
              ),

              // =================================
              // MAIN HORIZONTAL ROAD 1
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
                      '35%',

                    height:
                      '13%',

                    background:
                      '#11151b',

                    borderTop:
                      '5px solid #30353e',

                    borderBottom:
                      '5px solid #30353e',

                    zIndex:
                      3,
                  },
                }
              ),

              // horizontal road 2
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
                      '73%',

                    height:
                      '13%',

                    background:
                      '#11151b',

                    borderTop:
                      '5px solid #30353e',

                    borderBottom:
                      '5px solid #30353e',

                    zIndex:
                      3,
                  },
                }
              ),

              // =================================
              // VERTICAL ROAD LEFT
              // =================================

              h(
                'div',
                {
                  style: {
                    position:
                      'absolute',

                    left:
                      '29%',

                    top:
                      '0',

                    width:
                      '10%',

                    height:
                      '100%',

                    background:
                      '#11151b',

                    borderLeft:
                      '5px solid #30353e',

                    borderRight:
                      '5px solid #30353e',

                    zIndex:
                      3,
                  },
                }
              ),

              // vertical road right
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
                      '#11151b',

                    borderLeft:
                      '5px solid #30353e',

                    borderRight:
                      '5px solid #30353e',

                    zIndex:
                      3,
                  },
                }
              ),

              // =================================
              // LANE MARKINGS HORIZONTAL
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
                      '41.5%',

                    height:
                      '2px',

                    background:
                      'repeating-linear-gradient(90deg,rgba(255,255,255,.38) 0 24px,transparent 24px 52px)',

                    zIndex:
                      4,
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
                      '79.5%',

                    height:
                      '2px',

                    background:
                      'repeating-linear-gradient(90deg,rgba(255,255,255,.38) 0 24px,transparent 24px 52px)',

                    zIndex:
                      4,
                  },
                }
              ),

              // vertical lane lines
              h(
                'div',
                {
                  style: {
                    position:
                      'absolute',

                    left:
                      '34%',

                    top:
                      '0',

                    width:
                      '2px',

                    bottom:
                      '0',

                    background:
                      'repeating-linear-gradient(180deg,rgba(255,255,255,.32) 0 24px,transparent 24px 50px)',

                    zIndex:
                      4,
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
                      '64.5%',

                    top:
                      '0',

                    width:
                      '2px',

                    bottom:
                      '0',

                    background:
                      'repeating-linear-gradient(180deg,rgba(255,255,255,.32) 0 24px,transparent 24px 50px)',

                    zIndex:
                      4,
                  },
                }
              ),

              // =================================
              // ZEBRA CROSSINGS
              // =================================

              [
                ['29%','33%'],
                ['60%','33%'],
                ['29%','71%'],
                ['60%','71%'],
              ].map(
                function (
                  crossing,
                  index
                ) {
                  return h(
                    'div',
                    {
                      key:
                        'zebra-' +
                        index,

                      style: {
                        position:
                          'absolute',

                        left:
                          crossing[0],

                        top:
                          crossing[1],

                        width:
                          '10%',

                        height:
                          '17%',

                        background:
                          'repeating-linear-gradient(90deg,rgba(255,255,255,.58) 0 5px,transparent 5px 11px)',

                        opacity:
                          .62,

                        zIndex:
                          5,
                      },
                    }
                  );
                }
              ),

              // =================================
              // PARK
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
                      '51%',

                    width:
                      '16%',

                    height:
                      '18%',

                    borderRadius:
                      '13px',

                    background:
                      '#163523',

                    border:
                      '3px solid #304738',

                    zIndex:
                      7,
                  },
                },

                h(
                  'div',
                  {
                    style: {
                      position:
                        'absolute',

                      left:
                        '8%',

                      top:
                        '43%',

                      right:
                        '8%',

                      height:
                        '3px',

                      background:
                        'rgba(255,255,255,.12)',
                    },
                  }
                ),

                h(
                  'div',
                  {
                    style: {
                      position:
                        'absolute',

                      top:
                        '8%',

                      bottom:
                        '8%',

                      left:
                        '48%',

                      width:
                        '3px',

                      background:
                        'rgba(255,255,255,.12)',
                    },
                  }
                ),

                [
                  ['15%','15%'],
                  ['68%','18%'],
                  ['20%','68%'],
                  ['70%','67%'],
                ].map(
                  function (
                    tree,
                    index
                  ) {
                    return h(
                      'div',
                      {
                        key:
                          'park-tree-' +
                          index,

                        style: {
                          position:
                            'absolute',

                          left:
                            tree[0],

                          top:
                            tree[1],

                          width:
                            '15px',

                          height:
                            '15px',

                          borderRadius:
                            '50%',

                          background:
                            '#346b42',

                          border:
                            '3px solid #21482d',

                          boxShadow:
                            '0 4px 4px rgba(0,0,0,.30)',
                        },
                      }
                    );
                  }
                )
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
              // METRO
              // =================================

              h(
                'div',
                {
                  style: {
                    position:
                      'absolute',

                    left:
                      '42%',

                    top:
                      '31%',

                    transform:
                      'translate(-50%,-50%)',

                    padding:
                      '6px 9px',

                    borderRadius:
                      '8px',

                    background:
                      '#201829',

                    border:
                      '1px solid rgba(190,80,255,.5)',

                    color:
                      '#cf9cff',

                    fontSize:
                      '9px',

                    fontWeight:
                      '900',

                    zIndex:
                      30,
                  },
                },

                isGeo
                  ? 'M • მეტრო'
                  : 'M • Metro'
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
                      '68%',

                    padding:
                      '6px 9px',

                    borderRadius:
                      '8px',

                    background:
                      '#10161f',

                    border:
                      '1px solid rgba(64,137,255,.35)',

                    color:
                      '#88b9ff',

                    fontSize:
                      '9px',

                    fontWeight:
                      '900',

                    zIndex:
                      30,
                  },
                },

                'BUS'
              ),

              // =================================
              // TAXI STAND
              // =================================

              h(
                'div',
                {
                  style: {
                    position:
                      'absolute',

                    left:
                      '42%',

                    top:
                      '88%',

                    padding:
                      '6px 10px',

                    borderRadius:
                      '8px',

                    background:
                      '#211b07',

                    border:
                      '1px solid rgba(255,201,33,.45)',

                    color:
                      '#ffc921',

                    fontSize:
                      '9px',

                    fontWeight:
                      '900',

                    zIndex:
                      30,
                  },
                },

                'TAXI'
              ),

              // =================================
              // MOVING TOP-DOWN CARS
              // =================================

              renderCar(
                'car1',
                '5%',
                '39%',
                90,
                't4-car-east-1',
                '#34526e'
              ),

              renderCar(
                'car2',
                '23%',
                '44%',
                90,
                't4-car-east-2',
                '#7b2520'
              ),

              renderCar(
                'car3',
                '90%',
                '82%',
                -90,
                't4-car-west-1',
                '#d3d5d7'
              ),

              renderCar(
                'car4',
                '32%',
                '10%',
                180,
                't4-car-south',
                '#f0bd24'
              ),

              renderCar(
                'car5',
                '66%',
                '91%',
                0,
                't4-car-north',
                '#20242d'
              ),

              // =================================
              // OFFICE TARGET
              // =================================

              h(
                'div',
                {
                  style: {
                    position:
                      'absolute',

                    left:
                      '69%',

                    top:
                      '40%',

                    transform:
                      'translate(-50%,-50%)',

                    padding:
                      '5px 9px',

                    borderRadius:
                      '999px',

                    background:
                      '#ef1b13',

                    color:
                      '#fff',

                    fontSize:
                      '8px',

                    fontWeight:
                      '900',

                    zIndex:
                      80,

                    boxShadow:
                      '0 0 20px rgba(239,27,19,.55)',
                  },
                },

                isGeo
                  ? '🎯 ოფისი'
                  : '🎯 OFFICE'
              ),

              // =================================
              // PLAYER
              // =================================

              renderPlayer(),

              // =================================
              // ENTER MESSAGE
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
                              7
                          ) +
                          '%',

                        transform:
                          'translateX(-50%)',

                        zIndex:
                          120,

                        padding:
                          '6px 9px',

                        borderRadius:
                          '999px',

                        background:
                          '#000',

                        color:
                          '#fff',

                        border:
                          '1px solid rgba(255,255,255,.18)',

                        fontSize:
                          '9px',

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
              // KEY HELP
              // =================================

              h(
                'div',
                {
                  style: {
                    position:
                      'absolute',

                    left:
                      '14px',

                    bottom:
                      '14px',

                    padding:
                      '8px 10px',

                    borderRadius:
                      '9px',

                    background:
                      'rgba(0,0,0,.80)',

                    border:
                      '1px solid rgba(255,255,255,.10)',

                    color:
                      'rgba(255,255,255,.65)',

                    fontSize:
                      '9px',

                    fontWeight:
                      '900',

                    zIndex:
                      130,
                  },
                },

                'WASD / ↑ ↓ ← →  •  ENTER / E'
              ),

              // =================================
              // D PAD
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

                    display:
                      'grid',

                    gridTemplateColumns:
                      '44px 44px 44px',

                    gridTemplateRows:
                      '40px 40px 40px',

                    gap:
                      '4px',

                    zIndex:
                      130,
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
                      '#101217',

                    border:
                      '1px solid rgba(239,27,19,.35)',
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
                        '27px',

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
                        '0 0 16px',

                      color:
                        'rgba(255,255,255,.62)',

                      fontSize:
                        '12px',

                      lineHeight:
                        '1.6',
                    },
                  },

                  isGeo
                    ? 'ოფისში უნდა მიხვიდე 09:00-მდე. ახლა შენ თვითონ მართავ გადაადგილებას.'
                    : 'Get to the office before 09:00. You now control the journey yourself.'
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
                        '13px',

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
                    ? '🚶 დაიწყე გზა →'
                    : '🚶 Start Journey →'
                )
              ),

              // STATUS
              h(
                'div',
                {
                  style: {
                    padding:
                      '18px',

                    borderRadius:
                      '17px',

                    background:
                      '#101217',

                    border:
                      '1px solid rgba(255,255,255,.08)',
                  },
                },

                h(
                  'div',
                  {
                    style: {
                      marginBottom:
                        '8px',

                      fontSize:
                        '12px',

                      fontWeight:
                        '900',
                    },
                  },

                  isGeo
                    ? '📍 LIVE STATUS'
                    : '📍 LIVE STATUS'
                ),

                h(
                  'div',
                  {
                    style: {
                      color:
                        'rgba(255,255,255,.63)',

                      fontSize:
                        '12px',

                      lineHeight:
                        '1.55',
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
                      '17px',

                    background:
                      '#101217',

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
                        '12px',

                      fontWeight:
                        '900',
                    },
                  },

                  isGeo
                    ? '🚦 ტრანსპორტი'
                    : '🚦 TRANSPORT'
                ),

                h(
                  'div',
                  {
                    style: {
                      display:
                        'grid',

                      gap:
                        '7px',
                    },
                  },

                  h(
                    'div',
                    {
                      style: {
                        padding:
                          '9px',

                        borderRadius:
                          '9px',

                        background:
                          'rgba(51,209,122,.08)',

                        border:
                          '1px solid rgba(51,209,122,.25)',

                        color:
                          '#69db96',

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
                          '9px',

                        borderRadius:
                          '9px',

                        background:
                          'rgba(255,255,255,.03)',

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
                      ? '🚕 ტაქსი — შემდეგ ეტაპზე'
                      : '🚕 Taxi — Next Step'
                  ),

                  h(
                    'div',
                    {
                      style: {
                        padding:
                          '9px',

                        borderRadius:
                          '9px',

                        background:
                          'rgba(255,255,255,.03)',

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
                      ? '🚗 მანქანა — ჯერ არ გაქვს'
                      : '🚗 Personal Car — Not Owned'
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
                      '17px',

                    background:
                      '#101217',

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
                        '12px',

                      fontWeight:
                        '900',
                    },
                  },

                  isGeo
                    ? '🏠 შენი სახლი'
                    : '🏠 YOUR HOME'
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
                        'rgba(255,255,255,.58)',

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
        ? h(Footer, {
            lang,
          })
        : null
    );
  }

  // ==========================================
  // EXPORT
  // ==========================================

  window.Team4CityPage =
    Team4CityPage;
})();

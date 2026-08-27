// ==========================================
// TEAM4 CITY 3D — ENGINE V1
// THIRD-PERSON LIFE SIMULATOR
// ==========================================

(function () {
  const { createElement: h } = React;

  // ==========================================
  // THREE.JS LOADER
  // ==========================================

  let threePromise = null;

  function loadThree() {
    if (!threePromise) {
      threePromise = import(
        'https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.min.js'
      );
    }

    return threePromise;
  }

  // ==========================================
  // HELPERS
  // ==========================================

  function readJSON(key, fallback) {
    try {
      const raw =
        localStorage.getItem(key);

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

  function clamp(
    value,
    min,
    max
  ) {
    return Math.max(
      min,
      Math.min(
        max,
        value
      )
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  function Team4CityPage({
    lang,
    setLang,
  }) {
    const isGeo =
      lang === 'GEO';

    const mountRef =
      React.useRef(null);

    const [
      loading,
      setLoading,
    ] = React.useState(true);

    const [
      loadError,
      setLoadError,
    ] = React.useState('');

    const [
      gameTime,
      setGameTime,
    ] = React.useState(
      '08:00'
    );

    const [
      locationName,
      setLocationName,
    ] = React.useState(
      isGeo
        ? 'სახლთან'
        : 'Near Home'
    );

    const [
      interactionText,
      setInteractionText,
    ] = React.useState('');

    // ========================================
    // PLAYER DATA
    // ========================================

    const user =
      React.useMemo(
        function () {
          return readJSON(
            'team4LabUser',
            {}
          );
        },
        []
      );

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

    const avatar =
      user &&
      user.avatar
        ? user.avatar
        : {
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
          };

    const playerName =
      user.name ||
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
    // APARTMENT / ECONOMY
    // ========================================

    const apartmentId =
      selectedApartment &&
      selectedApartment.id
        ? selectedApartment.id
        : apartmentDeal &&
          apartmentDeal.apartmentId
        ? apartmentDeal.apartmentId
        : 'economy';

    const isEconomy =
      apartmentId ===
      'economy';

    const finalRent =
      apartmentDeal &&
      Number(
        apartmentDeal.rent
      )
        ? Number(
            apartmentDeal.rent
          )
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
        : isEconomy
        ? 650
        : 900;

    const deposit =
      apartmentDeal &&
      Number(
        apartmentDeal.depositPaidNow
      )
        ? Number(
            apartmentDeal.depositPaidNow
          )
        : apartmentDeal &&
          Number(
            apartmentDeal.deposit
          )
        ? Number(
            apartmentDeal.deposit
          )
        : isEconomy
        ? 650
        : 900;

    const startingCash =
      2500;

    const saved3DState =
      React.useMemo(
        function () {
          return readJSON(
            'team4City3DState',
            null
          );
        },
        []
      );

    const startingBalance =
      saved3DState &&
      saved3DState.cash != null
        ? Number(
            saved3DState.cash
          )
        : Math.max(
            0,
            startingCash -
              finalRent -
              deposit
          );

    const [
      cash,
      setCash,
    ] = React.useState(
      startingBalance
    );

    const [
      energy,
      setEnergy,
    ] = React.useState(
      saved3DState &&
      saved3DState.energy != null
        ? saved3DState.energy
        : 100
    );

    const [
      stress,
      setStress,
    ] = React.useState(
      saved3DState &&
      saved3DState.stress != null
        ? saved3DState.stress
        : 0
    );

    const [
      salesXP,
      setSalesXP,
    ] = React.useState(
      saved3DState &&
      saved3DState.salesXP != null
        ? saved3DState.salesXP
        : 0
    );

    // ==========================================
    // THREE SCENE
    // ==========================================

    React.useEffect(
      function () {
        let destroyed = false;

        let renderer = null;

        let animationFrame = null;

        let resizeObserver = null;

        let cleanupEvents =
          function () {};

        async function startGame() {
          try {
            const THREE =
              await loadThree();

            if (
              destroyed ||
              !mountRef.current
            ) {
              return;
            }

            // ==================================
            // SCENE
            // ==================================

            const scene =
              new THREE.Scene();

            scene.background =
              new THREE.Color(
                0x93c7ef
              );

            scene.fog =
              new THREE.Fog(
                0x93c7ef,
                55,
                145
              );

            // ==================================
            // CAMERA
            // ==================================

            const width =
              mountRef.current.clientWidth;

            const height =
              mountRef.current.clientHeight;

            const camera =
              new THREE.PerspectiveCamera(
                58,
                width / height,
                0.1,
                250
              );

            // ==================================
            // RENDERER
            // ==================================

            renderer =
              new THREE.WebGLRenderer({
                antialias: true,
                powerPreference:
                  'high-performance',
              });

            renderer.setSize(
              width,
              height
            );

            renderer.setPixelRatio(
              Math.min(
                window.devicePixelRatio ||
                  1,
                1.7
              )
            );

            renderer.shadowMap.enabled =
              true;

            renderer.shadowMap.type =
              THREE.PCFSoftShadowMap;

            renderer.outputColorSpace =
              THREE.SRGBColorSpace;

            renderer.toneMapping =
              THREE.ACESFilmicToneMapping;

            renderer.toneMappingExposure =
              1.05;

            renderer.domElement.style.display =
              'block';

            renderer.domElement.style.width =
              '100%';

            renderer.domElement.style.height =
              '100%';

            mountRef.current.innerHTML =
              '';

            mountRef.current.appendChild(
              renderer.domElement
            );

            // ==================================
            // LIGHTING
            // ==================================

            const hemisphere =
              new THREE.HemisphereLight(
                0xeaf6ff,
                0x65704e,
                2.25
              );

            scene.add(
              hemisphere
            );

            const sunlight =
              new THREE.DirectionalLight(
                0xfff2d4,
                3.6
              );

            sunlight.position.set(
              -25,
              45,
              20
            );

            sunlight.castShadow =
              true;

            sunlight.shadow.mapSize.set(
              2048,
              2048
            );

            sunlight.shadow.camera.left =
              -65;

            sunlight.shadow.camera.right =
              65;

            sunlight.shadow.camera.top =
              65;

            sunlight.shadow.camera.bottom =
              -65;

            scene.add(
              sunlight
            );

            // ==================================
            // MATERIAL HELPERS
            // ==================================

            function material(
              color,
              roughness
            ) {
              return new THREE.MeshStandardMaterial({
                color: color,
                roughness:
                  roughness == null
                    ? 0.8
                    : roughness,
                metalness: 0,
              });
            }

            function addBox(
              w,
              h,
              d,
              color,
              x,
              y,
              z,
              castShadow
            ) {
              const mesh =
                new THREE.Mesh(
                  new THREE.BoxGeometry(
                    w,
                    h,
                    d
                  ),
                  material(
                    color
                  )
                );

              mesh.position.set(
                x,
                y,
                z
              );

              mesh.castShadow =
                castShadow !==
                false;

              mesh.receiveShadow =
                true;

              scene.add(
                mesh
              );

              return mesh;
            }

            // ==================================
            // WORLD
            // ==================================

            const ground =
              new THREE.Mesh(
                new THREE.PlaneGeometry(
                  180,
                  180
                ),
                material(
                  0x6c9358
                )
              );

            ground.rotation.x =
              -Math.PI / 2;

            ground.receiveShadow =
              true;

            scene.add(
              ground
            );

            // ==================================
            // ROADS
            // ==================================

            addBox(
              16,
              0.08,
              150,
              0x34383d,
              0,
              0.04,
              0,
              false
            );

            addBox(
              140,
              0.08,
              16,
              0x34383d,
              0,
              0.045,
              -28,
              false
            );

            // sidewalks

            addBox(
              4,
              0.22,
              150,
              0xbec0bc,
              -10,
              0.11,
              0,
              false
            );

            addBox(
              4,
              0.22,
              150,
              0xbec0bc,
              10,
              0.11,
              0,
              false
            );

            addBox(
              140,
              0.22,
              4,
              0xbec0bc,
              0,
              0.115,
              -38,
              false
            );

            addBox(
              140,
              0.22,
              4,
              0xbec0bc,
              0,
              0.115,
              -18,
              false
            );

            // ==================================
            // ROAD MARKINGS
            // ==================================

            for (
              let z = -70;
              z <= 70;
              z += 9
            ) {
              addBox(
                0.18,
                0.03,
                4.2,
                0xf2f0d9,
                0,
                0.10,
                z,
                false
              );
            }

            for (
              let x = -65;
              x <= 65;
              x += 9
            ) {
              addBox(
                4.2,
                0.03,
                0.18,
                0xf2f0d9,
                x,
                0.10,
                -28,
                false
              );
            }

            // ==================================
            // COLLISION BOXES
            // ==================================

            const collisionBoxes =
              [];

            function addCollision(
              x,
              z,
              width,
              depth,
              padding
            ) {
              collisionBoxes.push({
                minX:
                  x -
                  width / 2 -
                  (
                    padding ||
                    0
                  ),

                maxX:
                  x +
                  width / 2 +
                  (
                    padding ||
                    0
                  ),

                minZ:
                  z -
                  depth / 2 -
                  (
                    padding ||
                    0
                  ),

                maxZ:
                  z +
                  depth / 2 +
                  (
                    padding ||
                    0
                  ),
              });
            }

            // ==================================
            // BUILDING CREATOR
            // ==================================
function createTextSign(
  text,
  width,
  height,
  bgColor,
  textColor
) {
  const canvas =
    document.createElement('canvas');

  canvas.width = 1024;
  canvas.height = 256;

  const ctx =
    canvas.getContext('2d');

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  // background
  ctx.fillStyle =
    bgColor || '#111111';

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  // subtle border
  ctx.strokeStyle =
    'rgba(255,255,255,.22)';

  ctx.lineWidth = 10;

  ctx.strokeRect(
    5,
    5,
    canvas.width - 10,
    canvas.height - 10
  );

  // text
  ctx.fillStyle =
    textColor || '#ffffff';

  ctx.font =
    '900 92px Arial';

  ctx.textAlign =
    'center';

  ctx.textBaseline =
    'middle';

  ctx.fillText(
    text,
    canvas.width / 2,
    canvas.height / 2 + 5
  );

  const texture =
    new THREE.CanvasTexture(
      canvas
    );

  texture.colorSpace =
    THREE.SRGBColorSpace;

  texture.anisotropy =
    renderer.capabilities
      .getMaxAnisotropy();

  const signMaterial =
    new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
    });

  const sign =
    new THREE.Mesh(
      new THREE.PlaneGeometry(
        width || 6,
        height || 1.4
      ),
      signMaterial
    );

  return sign;
}
            function createBuilding(
              config
            ) {
              const group =
                new THREE.Group();

              group.position.set(
                config.x,
                0,
                config.z
              );

              scene.add(
                group
              );

              const body =
                new THREE.Mesh(
                  new THREE.BoxGeometry(
                    config.w,
                    config.h,
                    config.d
                  ),
                  material(
                    config.color
                  )
                );

              body.position.y =
                config.h / 2;

              body.castShadow =
                true;

              body.receiveShadow =
                true;

              group.add(
                body
              );

              // roof

              const roof =
                new THREE.Mesh(
                  new THREE.BoxGeometry(
                    config.w +
                      0.45,
                    0.35,
                    config.d +
                      0.45
                  ),
                  material(
                    config.roof ||
                      0x3f4247
                  )
                );

              roof.position.y =
                config.h +
                0.18;

              roof.castShadow =
                true;

              group.add(
                roof
              );

              // front windows

              const columns =
                Math.max(
                  2,
                  Math.floor(
                    config.w /
                      2.4
                  )
                );

              const floors =
                Math.max(
                  1,
                  Math.floor(
                    config.h /
                      2.6
                  )
                );

              const windowMat =
                new THREE.MeshStandardMaterial({
                  color:
                    config.windowColor ||
                    0x8fc9e8,

                  roughness:
                    0.25,

                  metalness:
                    0.1,

                  emissive:
                    0x18252d,

                  emissiveIntensity:
                    0.35,
                });

              for (
                let floor = 0;
                floor <
                floors;
                floor += 1
              ) {
                for (
                  let col = 0;
                  col <
                  columns;
                  col += 1
                ) {
                  const win =
                    new THREE.Mesh(
                      new THREE.BoxGeometry(
                        1.05,
                        1.15,
                        0.08
                      ),
                      windowMat
                    );

                  win.position.x =
                    (
                      col -
                      (
                        columns -
                        1
                      ) /
                        2
                    ) *
                    1.65;

                  win.position.y =
                    1.7 +
                    floor *
                      2.35;

                  win.position.z =
                    config.d /
                      2 +
                    0.045;

                  group.add(
                    win
                  );
                }
              }

              // entrance

              const door =
                new THREE.Mesh(
                  new THREE.BoxGeometry(
                    1.8,
                    2.5,
                    0.14
                  ),
                  material(
                    config.doorColor ||
                      0x20252c,
                    0.3
                  )
                );

              door.position.set(
                0,
                1.25,
                config.d /
                  2 +
                  0.09
              );

              group.add(
                door
              );

              // sign board

              if (
                config.signColor
              ) {
                const sign =
                  new THREE.Mesh(
                    new THREE.BoxGeometry(
                      Math.min(
                        config.w -
                          1,
                        7
                      ),
                      0.75,
                      0.18
                    ),
                    material(
                      config.signColor,
                      0.35
                    )
                  );

                sign.position.set(
                  0,
                  Math.min(
                    config.h -
                      0.8,
                    3.7
                  ),
                  config.d /
                    2 +
                    0.15
                );

                group.add(
                  sign
                );
              }

              addCollision(
                config.x,
                config.z,
                config.w,
                config.d,
                0.6
              );

              return {
                group:
                  group,

                entrance: {
                  x:
                    config.x,

                  z:
                    config.z +
                    config.d /
                      2 +
                    2.3,
                },
              };
            }

            // ==================================
            // HOME
            // ==================================

            const home =
              createBuilding({
                x:
                  -20,

                z:
                  isEconomy
                    ? 24
                    : 12,

                w:
                  13,

                h:
                  isEconomy
                    ? 9
                    : 13,

                d:
                  12,

                color:
                  isEconomy
                    ? 0xb98a68
                    : 0xc7b79d,

                roof:
                  0x555257,

                doorColor:
                  0x463529,

                windowColor:
                  0x91bed0,

                signColor:
                  0x4b8d66,
              });

            // ==================================
            // TEAM4 OFFICE
            // ==================================

            const office =
              createBuilding({
                x:
                  22,

                z:
                  -48,

                w:
                  18,

                h:
                  18,

                d:
                  15,

                color:
                  0x303942,

                roof:
                  0x1c2025,

                doorColor:
                  0x14191e,

                windowColor:
                  0x75a9c6,

                signColor:
                  0xef1b13,
              });

            // ==================================
            // BANK
            // ==================================

            createBuilding({
              x:
                -24,

              z:
                -48,

              w:
                15,

              h:
                12,

              d:
                13,

              color:
                0xd0c4a4,

              roof:
                0x6a6254,

              signColor:
                0xd9b845,
            });

            // ==================================
            // SHOP
            // ==================================

            createBuilding({
              x:
                24,

              z:
                25,

              w:
                18,

              h:
                10,

              d:
                15,

              color:
                0xc5a099,

              roof:
                0x5a4e50,

              signColor:
                0x8b6cec,
            });

            // ==================================
            // GYM
            // ==================================

            createBuilding({
              x:
                -25,

              z:
                -5,

              w:
                15,

              h:
                9,

              d:
                13,

              color:
                0x7b746c,

              roof:
                0x393a3a,

              signColor:
                0xea9528,
            });

            // ==================================
            // DEALERSHIP
            // ==================================

            createBuilding({
              x:
                25,

              z:
                3,

              w:
                19,

              h:
                7,

              d:
                14,

              color:
                0x676b71,

              roof:
                0x292c30,

              signColor:
                0xf2bb32,
            });

            // ==================================
            // TREES
            // ==================================

            function createTree(
              x,
              z,
              scale
            ) {
              const trunk =
                new THREE.Mesh(
                  new THREE.CylinderGeometry(
                    0.22 *
                      scale,
                    0.32 *
                      scale,
                    2.1 *
                      scale,
                    8
                  ),
                  material(
                    0x765239
                  )
                );

              trunk.position.set(
                x,
                1.05 *
                  scale,
                z
              );

              trunk.castShadow =
                true;

              scene.add(
                trunk
              );

              const leaves =
                new THREE.Mesh(
                  new THREE.SphereGeometry(
                    1.15 *
                      scale,
                    10,
                    8
                  ),
                  material(
                    0x4f7f42
                  )
                );

              leaves.scale.y =
                1.18;

              leaves.position.set(
                x,
                2.8 *
                  scale,
                z
              );

              leaves.castShadow =
                true;

              scene.add(
                leaves
              );
            }

            const treePositions = [
              [-13, 33],
              [-13, 16],
              [14, 18],
              [14, 33],
              [-13, -18],
              [13, -10],
              [-14, -56],
              [13, -59],
              [34, 18],
              [-36, -40],
            ];

            treePositions.forEach(
              function (pos) {
                createTree(
                  pos[0],
                  pos[1],
                  0.85
                );
              }
            );

            // ==================================
            // PARKED CARS
            // decorative only
            // ==================================

            function createCar(
              x,
              z,
              rotation,
              color
            ) {
              const car =
                new THREE.Group();

              const body =
                new THREE.Mesh(
                  new THREE.BoxGeometry(
                    1.7,
                    0.55,
                    3.4
                  ),
                  material(
                    color,
                    0.35
                  )
                );

              body.position.y =
                0.55;

              body.castShadow =
                true;

              car.add(
                body
              );

              const cabin =
                new THREE.Mesh(
                  new THREE.BoxGeometry(
                    1.45,
                    0.65,
                    1.75
                  ),
                  material(
                    0x7893a4,
                    0.25
                  )
                );

              cabin.position.set(
                0,
                1.05,
                -0.1
              );

              cabin.castShadow =
                true;

              car.add(
                cabin
              );

              car.position.set(
                x,
                0,
                z
              );

              car.rotation.y =
                rotation;

              scene.add(
                car
              );
            }

            createCar(
              5,
              14,
              0,
              0x384f6c
            );

            createCar(
              -5,
              4,
              Math.PI,
              0xa33b35
            );

            createCar(
              5,
              -12,
              0,
              0xd4d4d4
            );

            createCar(
              -5,
              -54,
              Math.PI,
              0x2d3036
            );

            // ==================================
            // PLAYER MODEL
            // ==================================

            function createPlayer() {
              const root =
                new THREE.Group();

              // outfit color based on saved look

              let outfitColor =
                0x181818;

              if (
                avatar.look ===
                'casual'
              ) {
                outfitColor =
                  0x284d70;
              }

              if (
                avatar.look ===
                'smart-casual'
              ) {
                outfitColor =
                  0x34383d;
              }

              if (
                avatar.look ===
                'business'
              ) {
                outfitColor =
                  0x15171c;
              }

              const skin =
                material(
                  0xd49b78,
                  0.75
                );

              const outfit =
                material(
                  outfitColor,
                  0.85
                );

              const pantsMat =
                material(
                  0x202227,
                  0.9
                );

              const shoeMat =
                material(
                  0xe9e9e7,
                  0.65
                );

              // torso

              const torso =
                new THREE.Mesh(
                  new THREE.CapsuleGeometry(
                    avatar.gender ===
                    'female'
                      ? 0.38
                      : 0.43,
                    0.85,
                    5,
                    10
                  ),
                  outfit
                );

              torso.position.y =
                1.55;

              torso.castShadow =
                true;

              root.add(
                torso
              );

              // head

              const head =
                new THREE.Mesh(
                  new THREE.SphereGeometry(
                    0.34,
                    18,
                    14
                  ),
                  skin
                );

              head.position.y =
                2.65;

              head.castShadow =
                true;

              root.add(
                head
              );

              // legs

              [
                -0.19,
                0.19,
              ].forEach(
                function (x) {
                  const leg =
                    new THREE.Mesh(
                      new THREE.CapsuleGeometry(
                        0.14,
                        0.70,
                        4,
                        8
                      ),
                      pantsMat
                    );

                  leg.position.set(
                    x,
                    0.65,
                    0
                  );

                  leg.castShadow =
                    true;

                  root.add(
                    leg
                  );

                  const shoe =
                    new THREE.Mesh(
                      new THREE.BoxGeometry(
                        0.32,
                        0.18,
                        0.55
                      ),
                      shoeMat
                    );

                  shoe.position.set(
                    x,
                    0.15,
                    0.11
                  );

                  shoe.castShadow =
                    true;

                  root.add(
                    shoe
                  );
                }
              );

              // arms

              [
                -1,
                1,
              ].forEach(
                function (side) {
                  const arm =
                    new THREE.Mesh(
                      new THREE.CapsuleGeometry(
                        0.11,
                        0.70,
                        4,
                        8
                      ),
                      outfit
                    );

                  arm.position.set(
                    side *
                      0.52,
                    1.55,
                    0
                  );

                  arm.rotation.z =
                    side *
                    -0.08;

                  arm.castShadow =
                    true;

                  root.add(
                    arm
                  );
                }
              );

              // HAIR PLACEHOLDER
              // Uses chosen avatar state.
              // Later replaced by real GLB hairstyle.

              if (
                avatar.hair &&
                avatar.hair !==
                  'none'
              ) {
                const hair =
                  new THREE.Mesh(
                    new THREE.SphereGeometry(
                      0.36,
                      14,
                      10
                    ),
                    material(
                      0x27201b
                    )
                  );

                hair.scale.set(
                  1.03,
                  0.55,
                  1.03
                );

                hair.position.y =
                  2.90;

                hair.castShadow =
                  true;

                root.add(
                  hair
                );
              }

              // beard placeholder

              if (
                avatar.gender ===
                  'male' &&
                avatar.beard &&
                avatar.beard !==
                  'none'
              ) {
                const beard =
                  new THREE.Mesh(
                    new THREE.BoxGeometry(
                      0.37,
                      0.22,
                      0.10
                    ),
                    material(
                      0x30251f
                    )
                  );

                beard.position.set(
                  0,
                  2.48,
                  0.30
                );

                root.add(
                  beard
                );
              }

              // glasses placeholder

              if (
                avatar.accessory ===
                  'glasses' ||
                avatar.accessory ===
                  'sunglasses'
              ) {
                const glasses =
                  new THREE.Mesh(
                    new THREE.BoxGeometry(
                      0.55,
                      0.11,
                      0.08
                    ),
                    material(
                      avatar.accessory ===
                        'sunglasses'
                        ? 0x161719
                        : 0x494949,
                      0.25
                    )
                  );

                glasses.position.set(
                  0,
                  2.69,
                  0.31
                );

                root.add(
                  glasses
                );
              }

              return root;
            }

            const player =
              createPlayer();

            const savedPosition =
              saved3DState &&
              saved3DState.position;

            if (
              savedPosition &&
              Number.isFinite(
                Number(
                  savedPosition.x
                )
              ) &&
              Number.isFinite(
                Number(
                  savedPosition.z
                )
              )
            ) {
              player.position.set(
                Number(
                  savedPosition.x
                ),
                0,
                Number(
                  savedPosition.z
                )
              );
            } else {
              player.position.set(
                home.entrance.x,
                0,
                home.entrance.z +
                  2
              );
            }

            scene.add(
              player
            );

            // ==================================
            // MOVEMENT
            // ==================================

            const keys = {};

            let running =
              false;

            let yaw =
              Math.PI;

            let pitch =
              0.28;

            let dragging =
              false;

            let previousPointerX =
              0;

            let previousPointerY =
              0;

            let totalDistance =
              0;

            const clock =
              new THREE.Clock();

            function handleKeyDown(
              event
            ) {
              const key =
                event.key.toLowerCase();

              keys[key] =
                true;

              if (
                key === 'e'
              ) {
                attemptInteraction();
              }

              if (
                [
                  'w',
                  'a',
                  's',
                  'd',
                  'arrowup',
                  'arrowdown',
                  'arrowleft',
                  'arrowright',
                ].includes(
                  key
                )
              ) {
                event.preventDefault();
              }
            }

            function handleKeyUp(
              event
            ) {
              keys[
                event.key.toLowerCase()
              ] = false;
            }

            function pointerDown(
              event
            ) {
              dragging =
                true;

              previousPointerX =
                event.clientX;

              previousPointerY =
                event.clientY;
            }

            function pointerMove(
              event
            ) {
              if (!dragging) {
                return;
              }

              const dx =
                event.clientX -
                previousPointerX;

              const dy =
                event.clientY -
                previousPointerY;

              previousPointerX =
                event.clientX;

              previousPointerY =
                event.clientY;

              yaw -=
                dx *
                0.005;

              pitch =
                clamp(
                  pitch +
                    dy *
                      0.003,
                  0.05,
                  0.72
                );
            }

            function pointerUp() {
              dragging =
                false;
            }

            renderer.domElement.addEventListener(
              'pointerdown',
              pointerDown
            );

            window.addEventListener(
              'pointermove',
              pointerMove
            );

            window.addEventListener(
              'pointerup',
              pointerUp
            );

            window.addEventListener(
              'keydown',
              handleKeyDown
            );

            window.addEventListener(
              'keyup',
              handleKeyUp
            );

            // ==================================
            // COLLISION
            // ==================================

            function canMoveTo(
              x,
              z
            ) {
              const radius =
                0.55;

              if (
                x <
                  -70 +
                    radius ||
                x >
                  70 -
                    radius ||
                z <
                  -72 +
                    radius ||
                z >
                  72 -
                    radius
              ) {
                return false;
              }

              for (
                let i = 0;
                i <
                collisionBoxes.length;
                i += 1
              ) {
                const box =
                  collisionBoxes[i];

                if (
                  x +
                    radius >
                    box.minX &&
                  x -
                    radius <
                    box.maxX &&
                  z +
                    radius >
                    box.minZ &&
                  z -
                    radius <
                    box.maxZ
                ) {
                  return false;
                }
              }

              return true;
            }

            // ==================================
            // INTERACTION
            // ==================================

            function planarDistance(
              a,
              b
            ) {
              const dx =
                a.x -
                b.x;

              const dz =
                a.z -
                b.z;

              return Math.sqrt(
                dx * dx +
                  dz * dz
              );
            }

            function nearestInteraction() {
              const officeDistance =
                planarDistance(
                  player.position,
                  office.entrance
                );

              const homeDistance =
                planarDistance(
                  player.position,
                  home.entrance
                );

              if (
                officeDistance <
                4.2
              ) {
                return {
                  id:
                    'office',

                  distance:
                    officeDistance,
                };
              }

              if (
                homeDistance <
                4.2
              ) {
                return {
                  id:
                    'home',

                  distance:
                    homeDistance,
                };
              }

              return null;
            }

            function attemptInteraction() {
              const nearby =
                nearestInteraction();

              if (!nearby) {
                return;
              }

              if (
                nearby.id ===
                'office'
              ) {
                localStorage.setItem(
                  'team4ArrivedOffice',
                  'true'
                );

                localStorage.setItem(
                  'team4OfficeArrivalTime',
                  gameTime
                );

                window.location.href =
                  '/team4-lab/workday';

                return;
              }

              if (
                nearby.id ===
                'home'
              ) {
                setLocationName(
                  isGeo
                    ? 'შენი სახლი'
                    : 'Your Home'
                );
              }
            }

            // ==================================
            // UPDATE PLAYER
            // ==================================

            const cameraForward =
              new THREE.Vector3();

            const cameraRight =
              new THREE.Vector3();

            const moveVector =
              new THREE.Vector3();

            function updatePlayer(
              delta
            ) {
              let forward =
                0;

              let sideways =
                0;

              if (
                keys.w ||
                keys.arrowup
              ) {
                forward +=
                  1;
              }

              if (
                keys.s ||
                keys.arrowdown
              ) {
                forward -=
                  1;
              }

              if (
                keys.d ||
                keys.arrowright
              ) {
                sideways +=
                  1;
              }

              if (
                keys.a ||
                keys.arrowleft
              ) {
                sideways -=
                  1;
              }

              running =
                !!keys.shift;

              if (
                forward ===
                  0 &&
                sideways ===
                  0
              ) {
                return;
              }

              cameraForward.set(
                -Math.sin(
                  yaw
                ),
                0,
                -Math.cos(
                  yaw
                )
              );

              cameraRight.set(
                Math.cos(
                  yaw
                ),
                0,
                -Math.sin(
                  yaw
                )
              );

              moveVector
                .set(
                  0,
                  0,
                  0
                )
                .addScaledVector(
                  cameraForward,
                  forward
                )
                .addScaledVector(
                  cameraRight,
                  sideways
                )
                .normalize();

              const speed =
                running
                  ? 7.2
                  : 4.2;

              const stepX =
                moveVector.x *
                speed *
                delta;

              const stepZ =
                moveVector.z *
                speed *
                delta;

              const nextX =
                player.position.x +
                stepX;

              const nextZ =
                player.position.z +
                stepZ;

              if (
                canMoveTo(
                  nextX,
                  player.position.z
                )
              ) {
                player.position.x =
                  nextX;
              }

              if (
                canMoveTo(
                  player.position.x,
                  nextZ
                )
              ) {
                player.position.z =
                  nextZ;
              }

              const targetRotation =
                Math.atan2(
                  moveVector.x,
                  moveVector.z
                );

              let rotationDiff =
                targetRotation -
                player.rotation.y;

              rotationDiff =
                Math.atan2(
                  Math.sin(
                    rotationDiff
                  ),
                  Math.cos(
                    rotationDiff
                  )
                );

              player.rotation.y +=
                rotationDiff *
                Math.min(
                  1,
                  delta *
                    12
                );

              totalDistance +=
                Math.sqrt(
                  stepX *
                    stepX +
                    stepZ *
                      stepZ
                );

              if (
                totalDistance >
                12
              ) {
                totalDistance =
                  0;

                setEnergy(
                  function (
                    current
                  ) {
                    return Math.max(
                      0,
                      current -
                        (
                          running
                            ? 2
                            : 1
                        )
                    );
                  }
                );
              }
            }

            // ==================================
            // CAMERA
            // ==================================

            const cameraTarget =
              new THREE.Vector3();

            const desiredCamera =
              new THREE.Vector3();

            function updateCamera(
              delta
            ) {
              const distance =
                7.2;

              const horizontal =
                Math.cos(
                  pitch
                ) *
                distance;

              desiredCamera.set(
                player.position.x +
                  Math.sin(
                    yaw
                  ) *
                    horizontal,

                player.position.y +
                  2.5 +
                  Math.sin(
                    pitch
                  ) *
                    distance,

                player.position.z +
                  Math.cos(
                    yaw
                  ) *
                    horizontal
              );

              camera.position.lerp(
                desiredCamera,
                1 -
                  Math.pow(
                    0.001,
                    delta
                  )
              );

              cameraTarget.set(
                player.position.x,
                player.position.y +
                  1.55,
                player.position.z
              );

              camera.lookAt(
                cameraTarget
              );
            }

            // ==================================
            // LOCATION / INTERACTION UI
            // ==================================

            let uiTimer =
              0;

            function updateUI(
              delta
            ) {
              uiTimer +=
                delta;

              if (
                uiTimer <
                0.12
              ) {
                return;
              }

              uiTimer =
                0;

              const nearby =
                nearestInteraction();

              if (
                nearby &&
                nearby.id ===
                  'office'
              ) {
                setLocationName(
                  'Team4 Office'
                );

                setInteractionText(
                  isGeo
                    ? 'E — ოფისში შესვლა'
                    : 'E — Enter Office'
                );

                return;
              }

              if (
                nearby &&
                nearby.id ===
                  'home'
              ) {
                setLocationName(
                  isGeo
                    ? (
                        isEconomy
                          ? 'შენი სახლი • გლდანი'
                          : 'შენი სახლი • საბურთალო'
                      )
                    : (
                        isEconomy
                          ? 'Your Home • Gldani'
                          : 'Your Home • Saburtalo'
                      )
                );

                setInteractionText(
                  isGeo
                    ? 'E — სახლში შესვლა'
                    : 'E — Enter Home'
                );

                return;
              }

              setInteractionText(
                ''
              );

              if (
                player.position.z <
                -33
              ) {
                setLocationName(
                  isGeo
                    ? 'ბიზნეს რაიონი'
                    : 'Business District'
                );
              } else if (
                player.position.z >
                13
              ) {
                setLocationName(
                  isGeo
                    ? 'საცხოვრებელი რაიონი'
                    : 'Residential District'
                );
              } else {
                setLocationName(
                  isGeo
                    ? 'ქალაქის ცენტრი'
                    : 'City Center'
                );
              }
            }

            // ==================================
            // GAME TIME
            // ==================================

            let gameMinutes =
              saved3DState &&
              saved3DState.gameMinutes !=
                null
                ? Number(
                    saved3DState.gameMinutes
                  )
                : 8 *
                  60;

            let timeAccumulator =
              0;

            function updateTime(
              delta
            ) {
              timeAccumulator +=
                delta;

              if (
                timeAccumulator >=
                1.5
              ) {
                timeAccumulator -=
                  1.5;

                gameMinutes +=
                  1;

                const hValue =
                  Math.floor(
                    gameMinutes /
                      60
                  ) %
                  24;

                const mValue =
                  gameMinutes %
                  60;

                setGameTime(
                  String(
                    hValue
                  ).padStart(
                    2,
                    '0'
                  ) +
                    ':' +
                    String(
                      mValue
                    ).padStart(
                      2,
                      '0'
                    )
                );
              }
            }

            // ==================================
            // SAVE
            // ==================================

            let saveAccumulator =
              0;

            function saveGame(
              delta
            ) {
              saveAccumulator +=
                delta;

              if (
                saveAccumulator <
                2
              ) {
                return;
              }

              saveAccumulator =
                0;

              localStorage.setItem(
                'team4City3DState',
                JSON.stringify({
                  position: {
                    x:
                      player.position.x,

                    z:
                      player.position.z,
                  },

                  cash:
                    cash,

                  energy:
                    energy,

                  stress:
                    stress,

                  salesXP:
                    salesXP,

                  gameMinutes:
                    gameMinutes,

                  apartmentId:
                    apartmentId,
                })
              );
            }

            // ==================================
            // LOOP
            // ==================================

            function animate() {
              animationFrame =
                requestAnimationFrame(
                  animate
                );

              const delta =
                Math.min(
                  clock.getDelta(),
                  0.05
                );

              updatePlayer(
                delta
              );

              updateCamera(
                delta
              );

              updateUI(
                delta
              );

              updateTime(
                delta
              );

              saveGame(
                delta
              );

              renderer.render(
                scene,
                camera
              );
            }

            camera.position.set(
              player.position.x,
              5,
              player.position.z +
                8
            );

            animate();

            // ==================================
            // RESIZE
            // ==================================

            resizeObserver =
              new ResizeObserver(
                function () {
                  if (
                    !mountRef.current
                  ) {
                    return;
                  }

                  const newWidth =
                    mountRef.current.clientWidth;

                  const newHeight =
                    mountRef.current.clientHeight;

                  if (
                    !newWidth ||
                    !newHeight
                  ) {
                    return;
                  }

                  camera.aspect =
                    newWidth /
                    newHeight;

                  camera.updateProjectionMatrix();

                  renderer.setSize(
                    newWidth,
                    newHeight
                  );
                }
              );

            resizeObserver.observe(
              mountRef.current
            );

            cleanupEvents =
              function () {
                window.removeEventListener(
                  'keydown',
                  handleKeyDown
                );

                window.removeEventListener(
                  'keyup',
                  handleKeyUp
                );

                window.removeEventListener(
                  'pointermove',
                  pointerMove
                );

                window.removeEventListener(
                  'pointerup',
                  pointerUp
                );

                if (
                  renderer &&
                  renderer.domElement
                ) {
                  renderer.domElement.removeEventListener(
                    'pointerdown',
                    pointerDown
                  );
                }
              };

            setLoading(
              false
            );
          } catch (error) {
            console.error(
              'TEAM4 CITY 3D ERROR:',
              error
            );

            setLoadError(
              isGeo
                ? '3D ქალაქის ჩატვირთვა ვერ მოხერხდა.'
                : 'Unable to load the 3D city.'
            );

            setLoading(
              false
            );
          }
        }

        startGame();

        return function () {
          destroyed =
            true;

          cleanupEvents();

          if (
            animationFrame
          ) {
            cancelAnimationFrame(
              animationFrame
            );
          }

          if (
            resizeObserver
          ) {
            resizeObserver.disconnect();
          }

          if (
            renderer
          ) {
            renderer.dispose();

            if (
              renderer.domElement &&
              renderer.domElement.parentNode
            ) {
              renderer.domElement.parentNode.removeChild(
                renderer.domElement
              );
            }
          }
        };
      },
      []
    );

    // ==========================================
    // RENDER UI
    // ==========================================

    function statBox(
      label,
      value
    ) {
      return h(
        'div',
        {
          style: {
            minWidth:
              '92px',

            padding:
              '9px 12px',

            borderRadius:
              '12px',

            background:
              'rgba(10,12,15,.72)',

            backdropFilter:
              'blur(10px)',

            border:
              '1px solid rgba(255,255,255,.12)',
          },
        },

        h(
          'div',
          {
            style: {
              color:
                'rgba(255,255,255,.52)',

              fontSize:
                '9px',

              fontWeight:
                '900',

              letterSpacing:
                '.07em',
            },
          },

          label
        ),

        h(
          'div',
          {
            style: {
              marginTop:
                '2px',

              fontSize:
                '15px',

              fontWeight:
                '900',
            },
          },

          value
        )
      );
    }

    return h(
      'div',
      {
        style: {
          position:
            'fixed',

          inset:
            0,

          overflow:
            'hidden',

          background:
            '#111',

          color:
            '#fff',

          fontFamily:
            'Inter, sans-serif',
        },
      },

      // ======================================
      // 3D CANVAS
      // ======================================

      h(
        'div',
        {
          ref:
            mountRef,

          style: {
            position:
              'absolute',

            inset:
              0,
          },
        }
      ),

      // ======================================
      // TOP LEFT — PLAYER
      // ======================================

      h(
        'div',
        {
          style: {
            position:
              'absolute',

            left:
              '22px',

            top:
              '20px',

            zIndex:
              20,

            padding:
              '15px 17px',

            minWidth:
              '210px',

            borderRadius:
              '16px',

            background:
              'rgba(8,10,13,.74)',

            backdropFilter:
              'blur(12px)',

            border:
              '1px solid rgba(255,255,255,.13)',

            boxShadow:
              '0 10px 35px rgba(0,0,0,.22)',
          },
        },

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

          playerName
        ),

        h(
          'div',
          {
            style: {
              marginTop:
                '3px',

              color:
                '#ef4136',

              fontSize:
                '10px',

              fontWeight:
                '900',

              letterSpacing:
                '.08em',
            },
          },

          'TEAM4 • SALES CAREER'
        ),

        h(
          'div',
          {
            style: {
              marginTop:
                '10px',

              color:
                'rgba(255,255,255,.65)',

              fontSize:
                '11px',
            },
          },

          '📍 ' +
            locationName
        )
      ),

      // ======================================
      // TOP RIGHT — TIME
      // ======================================

      h(
        'div',
        {
          style: {
            position:
              'absolute',

            right:
              '22px',

            top:
              '20px',

            zIndex:
              20,

            padding:
              '12px 16px',

            borderRadius:
              '15px',

            background:
              'rgba(8,10,13,.74)',

            backdropFilter:
              'blur(12px)',

            border:
              '1px solid rgba(255,255,255,.13)',

            textAlign:
              'right',
          },
        },

        h(
          'div',
          {
            style: {
              color:
                'rgba(255,255,255,.55)',

              fontSize:
                '9px',

              fontWeight:
                '900',
            },
          },

          'DAY 1'
        ),

        h(
          'div',
          {
            style: {
              fontSize:
                '22px',

              fontWeight:
                '900',
            },
          },

          gameTime
        )
      ),

      // ======================================
      // STATS
      // ======================================

      h(
        'div',
        {
          style: {
            position:
              'absolute',

            left:
              '22px',

            bottom:
              '22px',

            display:
              'flex',

            gap:
              '8px',

            flexWrap:
              'wrap',

            zIndex:
              20,
          },
        },

        statBox(
          isGeo
            ? 'ფული'
            : 'CASH',

          cash +
            ' ₾'
        ),

        statBox(
          isGeo
            ? 'ენერგია'
            : 'ENERGY',

          energy +
            '/100'
        ),

        statBox(
          isGeo
            ? 'სტრესი'
            : 'STRESS',

          stress +
            '/100'
        ),

        statBox(
          'SALES XP',

          salesXP
        )
      ),

      // ======================================
      // MISSION
      // ======================================

      h(
        'div',
        {
          style: {
            position:
              'absolute',

            right:
              '22px',

            bottom:
              '22px',

            width:
              '290px',

            maxWidth:
              'calc(100vw - 44px)',

            zIndex:
              20,

            padding:
              '16px',

            borderRadius:
              '16px',

            background:
              'rgba(8,10,13,.76)',

            backdropFilter:
              'blur(12px)',

            border:
              '1px solid rgba(239,27,19,.35)',
          },
        },

        h(
          'div',
          {
            style: {
              color:
                '#ef4136',

              fontSize:
                '9px',

              fontWeight:
                '900',

              letterSpacing:
                '.10em',
            },
          },

          isGeo
            ? 'მიმდინარე მისია'
            : 'CURRENT MISSION'
        ),

        h(
          'div',
          {
            style: {
              marginTop:
                '5px',

              fontSize:
                '17px',

              fontWeight:
                '900',
            },
          },

          isGeo
            ? 'პირველი სამუშაო დღე'
            : 'First Workday'
        ),

        h(
          'div',
          {
            style: {
              marginTop:
                '6px',

              color:
                'rgba(255,255,255,.68)',

              fontSize:
                '11px',

              lineHeight:
                '1.5',
            },
          },

          isGeo
            ? 'მიდი Team4 Office-ში 09:00-მდე.'
            : 'Get to Team4 Office before 09:00.'
        ),

        h(
          'div',
          {
            style: {
              marginTop:
                '10px',

              color:
                'rgba(255,255,255,.48)',

              fontSize:
                '10px',

              fontWeight:
                '800',
            },
          },

          isGeo
            ? 'WASD — მოძრაობა • SHIFT — სირბილი • მაუსი — კამერა'
            : 'WASD — Move • SHIFT — Run • Mouse — Camera'
        )
      ),

      // ======================================
      // INTERACTION PROMPT
      // ======================================

      interactionText
        ? h(
            'div',
            {
              style: {
                position:
                  'absolute',

                left:
                  '50%',

                bottom:
                  '85px',

                transform:
                  'translateX(-50%)',

                zIndex:
                  30,

                padding:
                  '11px 18px',

                borderRadius:
                  '999px',

                background:
                  'rgba(0,0,0,.82)',

                border:
                  '1px solid rgba(255,255,255,.18)',

                boxShadow:
                  '0 8px 30px rgba(0,0,0,.3)',

                fontSize:
                  '12px',

                fontWeight:
                  '900',
              },
            },

            interactionText
          )
        : null,

      // ======================================
      // LOADING
      // ======================================

      loading
        ? h(
            'div',
            {
              style: {
                position:
                  'absolute',

                inset:
                  0,

                display:
                  'flex',

                alignItems:
                  'center',

                justifyContent:
                  'center',

                zIndex:
                  100,

                background:
                  '#090b0e',

                fontSize:
                  '18px',

                fontWeight:
                  '900',
              },
            },

            isGeo
              ? 'TEAM4 CITY იტვირთება...'
              : 'Loading TEAM4 CITY...'
          )
        : null,

      loadError
        ? h(
            'div',
            {
              style: {
                position:
                  'absolute',

                inset:
                  0,

                display:
                  'flex',

                alignItems:
                  'center',

                justifyContent:
                  'center',

                zIndex:
                  110,

                background:
                  '#090b0e',

                color:
                  '#ff665e',

                fontWeight:
                  '900',
              },
            },

            loadError
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

/**
 * Clase Configurador - Maneja la lógica del visualizador 3D de ascensores
 */
// Variable global para modo desarrollador
const MODO_DESARROLLADOR = false;

class Configurador {
    constructor() {
        // Propiedades del configurador
        this.scene = null;        // Escena 3D
        this.camera = null;       // Cámara
        this.renderer = null;     // Renderizador
        this.controls = null;     // Controles de órbita
        this.ascensor = null;     // Modelo 3D del ascensor
        this.texturas = new Texturas(); // Gestor de texturas
        this.modelosAdicionales = []; // Array para almacenar los modelos adicionales cargados
        this.carpetasModelos = []; // Guardamos los nombres de las carpetas para referenciarlos

        // Texturas pre-cargadas del entorno
this.texturasEntorno = {
    oficina: { paredes: null, suelo: null, perfileria: null },
    hotel: { paredes: null, suelo: null, perfileria: null },
    comercial: { paredes: null, suelo: null, perfileria: null },
    residencial: { paredes: null, suelo: null, perfileria: null }
};

        // Configuración actual del ascensor
this.configuracion = {
    modelo: 'basico',
    dimensiones: {
        ancho: 1100,
        profundidad: 1400,
        alto: 2200
    },
    materiales: {
        paredes: 'inox-cepillado',
        paredIzquierda: null,
        paredCentro: null,
        paredDerecha: null,
        suelo: 'goma-negro',
        techo: 'acero-pulido'
    },
    iluminacion: 'marco',
    perfileria: 'estandar',
    pasamanos: {
        modelo: 'curvo',
        material: 'acero',
        izquierda: false,
        frontal: false,
        derecha: false
    },
    espejo: {
        frontal: 'medio',
        lateral: 'no'
    },
    acristalado: {
        frontal: false,
        lateral: false
    },
    botonera: {
        modelo: 'columna',
        material: 'acero'
    },
    leds: {
        esquinas: false,
        botonera: false,
        zocaloSuperior: false,
        zocaloInferior: false
    },
    entorno: 'oficina'
};

        // Agregamos el modificador de vértices
        this.modificadorVertices = null; // Se inicializará cuando se cambien las dimensiones

        // Propiedades para animación de cámara
        this.animacionCamara = {
            activa: false,
            posicionInicial: new THREE.Vector3(),
            posicionFinal: new THREE.Vector3(),
            targetInicial: new THREE.Vector3(),
            targetFinal: new THREE.Vector3(),
            progreso: 0,
            duracion: 1000, // milisegundos
            tiempoInicio: 0
        };

        // Inicializar proactivamente el modificador de hueco
        this._modificadorHueco = new ModificadorHueco();

        // Cargar el modificador de hueco después de la inicialización
        setTimeout(() => {
            if (this._modificadorHueco && this.modelosAdicionales.length > 0) {
                // CORREGIR: usar modificarHuecos (plural) en lugar de modificarHueco
                this._modificadorHueco.modificarHuecos(this, this.configuracion.dimensiones.ancho);
            }
        }, 2000); // Esperar a que todo esté cargado

        // Inicializamos el configurador
        this.inicializar();
    }


    /**
     * Crea un material de espejo con desenfoque
     */
    crearMaterialEspejoDesenfocado() {
        const ReflectorShaderBlur = {
            uniforms: {
                'color': { value: null },
                'tDiffuse': { value: null },
                'textureMatrix': { value: null },
                'blurAmount': { value: 0.0005 }
            },
            vertexShader: `
                uniform mat4 textureMatrix;
                varying vec4 vUv;
                void main() {
                    vUv = textureMatrix * vec4( position, 1.0 );
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }
            `,
            fragmentShader: `
                uniform vec3 color;
                uniform sampler2D tDiffuse;
                uniform float blurAmount;
                varying vec4 vUv;

                float blendOverlay( float base, float blend ) {
                    return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );
                }

                vec3 blendOverlay( vec3 base, vec3 blend ) {
                    return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );
                }

                void main() {
                    vec2 uv = vUv.xy / vUv.w;
                    vec4 base = vec4(0.0);

                    // Simple box blur
                    float offset = blurAmount;
                    for(float x = -2.0; x <= 2.0; x += 1.0) {
                        for(float y = -2.0; y <= 2.0; y += 1.0) {
                            vec2 offsetUV = uv + vec2(x * offset, y * offset);
                            base += texture2DProj( tDiffuse, vec4(offsetUV * vUv.w, vUv.z, vUv.w) );
                        }
                    }
                    base /= 25.0; // 5x5 kernel

                    gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );
                }
            `
        };
        return ReflectorShaderBlur;
    }

/**
 * Inicializa el entorno 3D
 */
inicializar() {
    // Obtenemos el contenedor donde se mostrará el visor 3D
    const container = document.getElementById('visor-3d');

    // Creamos la escena
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xEEEEEE);

    // Configuramos la cámara
    this.configurarCamara();

    // Configuramos el renderizador PRIMERO (antes del mapa de entorno)
    this.configurarRenderizador(container);

    // AHORA añadimos el mapa de entorno (después de crear el renderer)
    this.agregarMapaEntorno();

    // Añadimos luces
    this.agregarLuces();

    // Añadimos controles de órbita
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;
    this.controls.rotateSpeed = 0.7;
    this.controls.minDistance = 500;
    this.controls.maxDistance = 5000;

    // Limitamos la rotación vertical para no dar la vuelta
    this.controls.minPolarAngle = Math.PI / 6;
    this.controls.maxPolarAngle = Math.PI / 2;

    this.controls.minAzimuthAngle = -Math.PI / 3;
    this.controls.maxAzimuthAngle = Math.PI / 3;

    // Configuración por defecto del paneo (deshabilitado inicialmente)
    this.controls.enablePan = false;
    this.controls.panSpeed = 1.0;

    // Configurar los botones del mouse
    this.controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.PAN,
        RIGHT: THREE.MOUSE.ROTATE
    };

    // Configurar teclas de control (deshabilitadas por defecto)
    this.controls.enableKeys = false;

    // Creamos un plano base para el entorno
    this.crearEntorno();

    // Creamos el ascensor básico
    this.crearAscensorCompleto();

    // Cargamos los modelos adicionales
    this.cargarModelosAdicionales();

    // Centramos la cámara solo al inicio
    this.centrarCamara();

    // Iniciamos el ciclo de renderizado
    this.animar();

   // Manejamos el redimensionamiento de la ventana
   window.addEventListener('resize', () => {
    this.onWindowResize();
});

// Pre-cargar texturas de entorno
setTimeout(() => {
    this.preCargarTexturasEntorno();
}, 500);

if (MODO_DESARROLLADOR) {
    this.crearGizmoCoordenadas();
}
}

/**
 * Crea el gizmo que muestra las coordenadas de la cámara
 */
crearGizmoCoordenadas() {
    // Crear el contenedor del gizmo
    const gizmo = document.createElement('div');
    gizmo.id = 'gizmo-coordenadas-camara';
    gizmo.innerHTML = `
        <div class="gizmo-header">
            <i class="fas fa-video"></i> Cámara
        </div>
        <div class="gizmo-coords">
            <div class="coord-item">
                <span class="coord-label">X:</span>
                <span class="coord-value" id="camera-x">0</span>
            </div>
            <div class="coord-item">
                <span class="coord-label">Y:</span>
                <span class="coord-value" id="camera-y">0</span>
            </div>
            <div class="coord-item">
                <span class="coord-label">Z:</span>
                <span class="coord-value" id="camera-z">0</span>
            </div>
        </div>
    `;

    // Estilos del gizmo
    gizmo.style.cssText = `
        position: absolute;
        bottom: 20px;
        left: 20px;
        background-color: rgba(11, 11, 94, 0.9);
        color: white;
        padding: 12px;
        border-radius: 8px;
        font-family: 'Roboto', Arial, sans-serif;
        font-size: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 100;
        min-width: 140px;
        border: 1px solid rgba(255, 210, 0, 0.3);
        backdrop-filter: blur(10px);
    `;

    // Estilos adicionales mediante CSS
    const styles = document.createElement('style');
    styles.textContent = `
        #gizmo-coordenadas-camara .gizmo-header {
            font-weight: 500;
            margin-bottom: 8px;
            padding-bottom: 6px;
            border-bottom: 1px solid rgba(255, 210, 0, 0.5);
            color: #ffd200;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        #gizmo-coordenadas-camara .gizmo-coords {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        #gizmo-coordenadas-camara .coord-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        #gizmo-coordenadas-camara .coord-label {
            color: rgba(255, 255, 255, 0.7);
            font-weight: 400;
        }

        #gizmo-coordenadas-camara .coord-value {
            font-family: 'Roboto Mono', monospace;
            font-weight: 500;
            color: white;
            min-width: 60px;
            text-align: right;
        }

        #gizmo-coordenadas-camara .coord-item:nth-child(1) .coord-value {
            color: #ff6b6b; /* Rojo para X */
        }

        #gizmo-coordenadas-camara .coord-item:nth-child(2) .coord-value {
            color: #4ecdc4; /* Verde para Y */
        }

        #gizmo-coordenadas-camara .coord-item:nth-child(3) .coord-value {
            color: #45b7d1; /* Azul para Z */
        }
    `;

    document.head.appendChild(styles);

    // Añadir el gizmo al visor 3D
    document.getElementById('visor-3d').appendChild(gizmo);

    // Guardar referencia al gizmo
    this.gizmoCoordenadas = gizmo;
}

/**
 * Actualiza las coordenadas mostradas en el gizmo
 */
actualizarGizmoCoordenadas() {
    if (!this.gizmoCoordenadas || !this.camera) return;

    // Obtener elementos
    const xElement = document.getElementById('camera-x');
    const yElement = document.getElementById('camera-y');
    const zElement = document.getElementById('camera-z');

    if (xElement && yElement && zElement) {
        // Actualizar valores con formato
        xElement.textContent = this.camera.position.x.toFixed(0);
        yElement.textContent = this.camera.position.y.toFixed(0);
        zElement.textContent = this.camera.position.z.toFixed(0);
    }
}




    /**
     * Configura la cámara
     */
    configurarCamara() {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(45, aspect, 1, 50000);
        this.camera.position.set(0, 1450, 3792);
        this.camera.lookAt(0, 1000, 0);
    }


/**
 * Configura el renderizador
 */
configurarRenderizador(container) {
    this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        preserveDrawingBuffer: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(container.clientWidth, container.clientHeight);

    // Reducir aún más la exposición (de 0.8 a 0.6)
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.6;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(this.renderer.domElement);

// Configurar el compositor de efectos
this.configurarBloomSelectivo(container);
}


/**
 * Configura el efecto Bloom selectivo para elementos emisivos
 */
configurarBloomSelectivo(container) {
    // Crear una escena separada SOLO para objetos emisivos
    this.bloomScene = new THREE.Scene();

    // Crear un render target para la escena normal
    this.renderTarget = new THREE.WebGLRenderTarget(
        container.clientWidth,
        container.clientHeight,
        {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat
        }
    );

    // Bloom pass para la escena de emisivos
this.bloomPass = new THREE.UnrealBloomPass(
    new THREE.Vector2(container.clientWidth, container.clientHeight),
    0.6,  // strength (reducido de 1.5 a 0.6)
    0.3,  // radius (reducido de 0.4 a 0.3)
    0.0   // threshold
);

    // Crear un compositor solo para el bloom
    this.bloomComposer = new THREE.EffectComposer(this.renderer);
    this.bloomComposer.renderToScreen = false;
    this.bloomComposer.addPass(new THREE.RenderPass(this.bloomScene, this.camera));
    this.bloomComposer.addPass(this.bloomPass);

    // No configurar aquí, se hará cuando los modelos estén cargados
}


configurarObjetosEmisivos() {
    this.objetosEmisivos = [];

    // Limpiar la escena de bloom si ya tenía objetos
    while(this.bloomScene.children.length > 0) {
        this.bloomScene.remove(this.bloomScene.children[0]);
    }

    // Buscar objetos con material emisivo
    this.modelosAdicionales.forEach(modelo => {
        modelo.traverse(objeto => {
            if (objeto.isMesh && objeto.material) {
                if (objeto.material.emissive && objeto.material.emissiveIntensity > 0) {
                    // Clonar el objeto para la escena de bloom
                    const objetoBloom = objeto.clone();

                    // Crear un material que solo muestre la emisión
                    objetoBloom.material = new THREE.MeshBasicMaterial({
                        color: objeto.material.emissive,
                        opacity: objeto.material.emissiveIntensity,
                        transparent: true,
                        map: objeto.material.emissiveMap || null
                    });

                    // Copiar la transformación mundial
                    objeto.updateWorldMatrix(true, false);
                    objetoBloom.position.setFromMatrixPosition(objeto.matrixWorld);
                    objetoBloom.rotation.setFromRotationMatrix(objeto.matrixWorld);
                    objetoBloom.scale.setFromMatrixScale(objeto.matrixWorld);

                    this.bloomScene.add(objetoBloom);
                    this.objetosEmisivos.push({ original: objeto, bloom: objetoBloom });

                    console.log(`Objeto emisivo añadido al bloom: ${objeto.name || 'Sin nombre'}`);
                }
            }
        });
    });

// También buscar objetos emisivos en el ascensor (como las imágenes del techo)
if (this.ascensor) {
    this.ascensor.traverse(objeto => {
        if (objeto.isMesh && objeto.material && objeto.name === 'techo-imagen') {
            if (objeto.material.emissive && objeto.material.emissiveIntensity > 0) {
                // Clonar el objeto para la escena de bloom
                const objetoBloom = objeto.clone();

                // Crear un material que solo muestre la emisión
                objetoBloom.material = new THREE.MeshBasicMaterial({
                    color: objeto.material.emissive,
                    opacity: objeto.material.emissiveIntensity * 0.5,
                    transparent: true,
                    map: objeto.material.emissiveMap || objeto.material.map
                });

                // Copiar la transformación mundial
                objeto.updateWorldMatrix(true, false);
                objetoBloom.position.copy(objeto.position);
                objetoBloom.rotation.copy(objeto.rotation);
                objetoBloom.scale.copy(objeto.scale);

                this.bloomScene.add(objetoBloom);
                this.objetosEmisivos.push({ original: objeto, bloom: objetoBloom });

                console.log(`Imagen del techo añadida al bloom: ${objeto.name}`);
            }
        }
    });
}
}

/**
 * Actualiza las posiciones de los objetos emisivos en la escena de bloom
 */
actualizarObjetosEmisivos() {
    if (this.objetosEmisivos) {
        this.objetosEmisivos.forEach(par => {
            par.original.updateWorldMatrix(true, false);
            par.bloom.position.setFromMatrixPosition(par.original.matrixWorld);
            par.bloom.rotation.setFromRotationMatrix(par.original.matrixWorld);
            par.bloom.scale.setFromMatrixScale(par.original.matrixWorld);
        });
    }
}



    /**
 * Agrega un mapa de entorno a la escena para reflexiones
 */
/**
 * Agrega un mapa de entorno a la escena para reflexiones
 */
/**
 * Pre-carga todas las texturas de los entornos
 */
preCargarTexturasEntorno() {
    console.log("Pre-cargando texturas de entorno...");

    const entornos = ['oficina', 'hotel', 'comercial', 'residencial'];
    const cargadorTexturas = new THREE.TextureLoader();

    entornos.forEach(entorno => {
        // Pre-cargar texturas de paredes (todas las paredes usan la misma textura)
        this.preCargarTexturasParaEntorno(
            entorno,
            'paredes',
            `textures/entorno/${entorno}/paredes/`
        );

        // Pre-cargar texturas de suelo
        this.preCargarTexturasParaEntorno(
            entorno,
            'suelo',
            `textures/entorno/${entorno}/suelo/`
        );

    // NUEVO: Pre-cargar texturas de perfilería
    this.preCargarTexturasParaEntorno(
        entorno,
        'perfileria',
        `textures/entorno/${entorno}/perfileria/`
    );
});
}

/**
 * Método auxiliar para pre-cargar texturas de un tipo específico
 */
preCargarTexturasParaEntorno(entorno, tipo, rutaTexturas) {
    const cargadorTexturas = new THREE.TextureLoader();

    // Primero cargamos el material.json
    fetch(rutaTexturas + 'material.json')
        .then(response => response.json())
        .then(materialData => {
            // Crear el material
            const material = new THREE.MeshPhysicalMaterial({
                color: 0xFFFFFF,
                roughness: materialData.roughness !== undefined ? materialData.roughness : 0.5,
                metalness: materialData.metalness !== undefined ? materialData.metalness : 0.0,
                clearcoat: materialData.metalness > 0.7 ? 0.3 : 0.0,
                clearcoatRoughness: 0.1,
                envMapIntensity: materialData.metalness > 0.5 ? 1.5 : 1.0
            });

           // Configurar repeticiones si están definidas
const repeatX = materialData.textureRepeat?.x || 1;
const repeatY = materialData.textureRepeat?.y || 1;

// Pre-cargar textura Albedo
cargadorTexturas.load(
    rutaTexturas + 'Albedo.png',
    (textura) => {
        textura.wrapS = THREE.RepeatWrapping;
        textura.wrapT = THREE.RepeatWrapping;
        textura.repeat.set(repeatX, repeatY);
        material.map = textura;
        material.needsUpdate = true;
    }
);

// Pre-cargar textura Normal
cargadorTexturas.load(
    rutaTexturas + 'Normal.png',
    (textura) => {
        textura.wrapS = THREE.RepeatWrapping;
        textura.wrapT = THREE.RepeatWrapping;
        textura.repeat.set(repeatX, repeatY);
        material.normalMap = textura;

        // Usar normalIntensity del JSON si está definido, si no usar 1.0 por defecto
        const normalIntensity = materialData.normalIntensity !== undefined ? materialData.normalIntensity : 1.0;
        material.normalScale = new THREE.Vector2(normalIntensity, normalIntensity);

        material.needsUpdate = true;
    }
);

            // Guardar el material pre-cargado
            if (!this.texturasEntorno[entorno]) {
                this.texturasEntorno[entorno] = {};
            }
            this.texturasEntorno[entorno][tipo] = material;

            console.log(`Texturas pre-cargadas: ${entorno}/${tipo}`);
        })
        .catch(error => {
            console.error(`Error pre-cargando ${entorno}/${tipo}:`, error);
        });
}


/**
 * Agrega un mapa de entorno a la escena para reflexiones
 */
agregarMapaEntorno() {
    // Opción más simple sin PMREMGenerator para Three.js r128
    const loader = new THREE.CubeTextureLoader();
    const textureCube = loader.load([
        'https://threejs.org/examples/textures/cube/Bridge2/posx.jpg',
        'https://threejs.org/examples/textures/cube/Bridge2/negx.jpg',
        'https://threejs.org/examples/textures/cube/Bridge2/posy.jpg',
        'https://threejs.org/examples/textures/cube/Bridge2/negy.jpg',
        'https://threejs.org/examples/textures/cube/Bridge2/posz.jpg',
        'https://threejs.org/examples/textures/cube/Bridge2/negz.jpg'
    ]);

    textureCube.encoding = THREE.sRGBEncoding;
    this.scene.environment = textureCube;
}

/**
 * Agrega luces a la escena
 */
agregarLuces() {
    // Luz ambiental balanceada (valor intermedio: 0.25)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
    this.scene.add(ambientLight);

    // Luz direccional principal (ESTA NO LA TOCAMOS)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight.position.set(1000, 1500, 1000);
    directionalLight.castShadow = true;

    // Configuración de la sombra
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.left = -2000;
    directionalLight.shadow.camera.right = 2000;
    directionalLight.shadow.camera.top = 2000;
    directionalLight.shadow.camera.bottom = -2000;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 5000;

    this.scene.add(directionalLight);

    // Luz hemisférica balanceada (valor intermedio: 0.2)
    const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.2);
    this.scene.add(hemisphereLight);

    // Luz de relleno - POSICIÓN Y TARGET EXACTOS
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.15);
    fillLight.position.set(0, 600, -800); // Posición exacta: X: -571, Y: 385, Z: 0

    // Target apuntando al origen
    fillLight.target.position.set(0, 0, 0);
    this.scene.add(fillLight.target);

    this.scene.add(fillLight);
}

    /**
 * Crea el entorno base (ahora vacío, sin suelo ni paredes)
 */
crearEntorno() {
    // El entorno ahora está vacío, solo configuramos el color de fondo
    this.scene.background = new THREE.Color(0xEEEEEE);

    // No creamos ni suelo ni paredes, solo dejamos un entorno vacío
    // para que el usuario pueda añadir sus propios modelos
}

    /**
     * Cambia el color o tipo de entorno
     */
    /**
 * Cambia el color del fondo
 */
cambiarColorEntorno(color) {
    // Ahora solo cambiamos el color de fondo de la escena
    this.scene.background = new THREE.Color(color);
}

/**
 * Cambia el entorno preestablecido
 */
cambiarEntorno(tipo) {
    this.configuracion.entorno = tipo;

    // Dependiendo del tipo de entorno, configuramos diferentes colores de fondo
    switch(tipo) {
        case 'oficina':
            this.cambiarColorEntorno(0xEEEEEE);
            break;
        case 'hotel':
            this.cambiarColorEntorno(0xF5E1C9);
            break;
        case 'comercial':
            this.cambiarColorEntorno(0xE1F5E4);
            break;
        case 'residencial':
            this.cambiarColorEntorno(0xF5F5F5);
            break;
        default:
            this.cambiarColorEntorno(0xEEEEEE);
    }

    // Cambiar las texturas de paredes y suelo
    this.cambiarTexturasEntorno(tipo);
}

/**
 * Cambia las texturas de las paredes y suelo según el entorno
 */
cambiarTexturasEntorno(tipoEntorno) {
    console.log(`Cambiando texturas del entorno a: ${tipoEntorno}`);

// Si no hay texturas pre-cargadas, usar el método anterior
if (!this.texturasEntorno[tipoEntorno] ||
    !this.texturasEntorno[tipoEntorno].paredes ||
    !this.texturasEntorno[tipoEntorno].suelo ||
    !this.texturasEntorno[tipoEntorno].perfileria) {
    console.warn("Texturas no pre-cargadas completamente, usando método lento...");

    // Fallback al método original
    const modelosParedes = [
        'escenario_pared_left',
        'escenario_pared_right',
        'escenario_pared_back',
        'escenario_pared_main'  // Ahora incluimos la pared frontal
    ];
    // NUEVO: Añadir modelos de perfilería
    const modelosPerfileria = [
        'escenario_perfileria_main',
        'escenario_perfileria_left',
        'escenario_perfileria_right',
        'escenario_perfileria_back'
    ];

    const rutaTexturasParedes = `textures/entorno/${tipoEntorno}/paredes/`;
    const rutaTexturasSuelo = `textures/entorno/${tipoEntorno}/suelo/`;
    const rutaTexturasPerfileria = `textures/entorno/${tipoEntorno}/perfileria/`;

    this.modelosAdicionales.forEach(modelo => {
        if (modelo.userData && modelo.userData.carpeta) {
            // Añadir log para depurar
            console.log(`Procesando modelo: ${modelo.userData.carpeta}`);

            if (modelosParedes.includes(modelo.userData.carpeta)) {
                this.cambiarTexturaModelo(modelo, rutaTexturasParedes);
            } else if (modelo.userData.carpeta === 'escenario_suelo') {
                this.cambiarTexturaModelo(modelo, rutaTexturasSuelo);
            }
            // NUEVO: Aplicar texturas a perfilería
            else if (modelosPerfileria.includes(modelo.userData.carpeta)) {
                console.log(`Cambiando textura de perfilería: ${modelo.userData.carpeta}`);
                this.cambiarTexturaModelo(modelo, rutaTexturasPerfileria);
            }
        }
    });
    return;
}
// Lista de todos los modelos de paredes (ahora incluye todas)
const modelosParedes = [
    'escenario_pared_left',
    'escenario_pared_right',
    'escenario_pared_back',
    'escenario_pared_main'  // Ahora la pared frontal usa las mismas texturas
];

// NUEVO: Lista de modelos de perfilería
const modelosPerfileria = [
    'escenario_perfileria_main',
    'escenario_perfileria_left',
    'escenario_perfileria_right',
    'escenario_perfileria_back'
];

// Aplicar texturas pre-cargadas instantáneamente
this.modelosAdicionales.forEach(modelo => {
    if (modelo.userData && modelo.userData.carpeta) {
        modelo.traverse((hijo) => {
            if (hijo.isMesh) {
                // Todas las paredes usan la misma textura
                if (modelosParedes.includes(modelo.userData.carpeta)) {
                    hijo.material = this.texturasEntorno[tipoEntorno].paredes.clone();
                }
                // Suelo
                else if (modelo.userData.carpeta === 'escenario_suelo') {
                    hijo.material = this.texturasEntorno[tipoEntorno].suelo.clone();
                }
                // NUEVO: Perfilería
                else if (modelosPerfileria.includes(modelo.userData.carpeta)) {
                    hijo.material = this.texturasEntorno[tipoEntorno].perfileria.clone();
                }
            }
        });
    }
});

    console.log("Texturas cambiadas instantáneamente");
}

/**
 * Cambia las texturas de un modelo específico
 */
cambiarTexturaModelo(modelo, rutaTexturas) {
    const cargadorTexturas = new THREE.TextureLoader();

    // Primero intentamos cargar el material.json
    fetch(rutaTexturas + 'material.json')
        .then(response => response.json())
        .then(materialData => {
            modelo.traverse((hijo) => {
                if (hijo.isMesh) {
                    // Crear nuevo material con los valores del JSON
                    const material = new THREE.MeshPhysicalMaterial({
                        color: 0xFFFFFF,
                        roughness: materialData.roughness !== undefined ? materialData.roughness : 0.5,
                        metalness: materialData.metalness !== undefined ? materialData.metalness : 0.0,
                        clearcoat: materialData.metalness > 0.7 ? 0.3 : 0.0,
                        clearcoatRoughness: 0.1,
                        envMapIntensity: materialData.metalness > 0.5 ? 1.5 : 1.0
                    });

                    // Cargar textura Albedo
                    cargadorTexturas.load(
                        rutaTexturas + 'Albedo.png',
                        (textura) => {
                            material.map = textura;
                            material.needsUpdate = true;
                        }
                    );

                    // Cargar textura Normal
cargadorTexturas.load(
    rutaTexturas + 'Normal.png',
    (textura) => {
        material.normalMap = textura;

        // Usar normalIntensity del JSON si está definido, si no usar 1.0 por defecto
        const normalIntensity = materialData.normalIntensity !== undefined ? materialData.normalIntensity : 1.0;
        material.normalScale = new THREE.Vector2(normalIntensity, normalIntensity);

        material.needsUpdate = true;
    }
);

                    // Asignar el nuevo material
                    hijo.material = material;
                }
            });
        })
        .catch(error => {
            console.error(`Error al cargar material.json para ${rutaTexturas}:`, error);
        });
}

    /**
     * Función para manejar el redimensionamiento de la ventana
     */
    onWindowResize() {
        const container = document.getElementById('visor-3d');
        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);

        // Actualizar el tamaño del render target
        if (this.renderTarget) {
            this.renderTarget.setSize(container.clientWidth, container.clientHeight);
        }

        // Actualizar el tamaño del compositor de bloom
        if (this.bloomComposer) {
            this.bloomComposer.setSize(container.clientWidth, container.clientHeight);
        }
    }

    animar() {
        requestAnimationFrame(() => this.animar());

        // Actualiza los controles de órbita
        this.controls.update();

        // Actualizar posiciones de objetos emisivos
        this.actualizarObjetosEmisivos();

        // Actualizar etiquetas de coordenadas si estamos en modo edición
        if (this.lightLabels && this.lightLabels.size > 0) {
            this.actualizarTodasLasEtiquetas();
        }

// Actualizar gizmo de coordenadas de cámara solo en modo desarrollador
if (MODO_DESARROLLADOR) {
    this.actualizarGizmoCoordenadas();
}

// Actualizar animación de cámara si está activa
this.actualizarAnimacionCamara();

        // Renderizar con bloom selectivo
        if (this.bloomComposer && this.bloomScene && this.objetosEmisivos && this.objetosEmisivos.length > 0) {
            // 1. Renderizar SOLO los objetos emisivos con bloom
            this.renderer.setRenderTarget(this.bloomComposer.renderTarget2);
            this.renderer.clear();
            this.renderer.render(this.bloomScene, this.camera);
            this.bloomComposer.render();

            // 2. Renderizar la escena normal al canvas
            this.renderer.setRenderTarget(null);
            this.renderer.clear();
            this.renderer.render(this.scene, this.camera);

            // 3. Renderizar el bloom encima con menor opacidad
            this.renderer.autoClear = false;

            if (!this.bloomMesh) {
                // Crear un mesh para renderizar el bloom
                const bloomGeometry = new THREE.PlaneGeometry(2, 2);
                this.bloomMaterial = new THREE.MeshBasicMaterial({
                    map: this.bloomComposer.renderTarget2.texture,
                    blending: THREE.AdditiveBlending,
                    transparent: true,
                    opacity: 0.4  // Reducir la opacidad del bloom
                });
                this.bloomMesh = new THREE.Mesh(bloomGeometry, this.bloomMaterial);

                this.bloomScene2D = new THREE.Scene();
                this.bloomCamera2D = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
                this.bloomScene2D.add(this.bloomMesh);
            }

            // Renderizar el bloom con blending
            this.renderer.render(this.bloomScene2D, this.bloomCamera2D);

            this.renderer.autoClear = true;
        } else {
            // Fallback al renderer normal
            this.renderer.render(this.scene, this.camera);
        }
    }

    /**
     * Crea el ascensor completo
     */
    crearAscensorCompleto() {
        // Si ya existe un ascensor, lo eliminamos
        if (this.ascensor) {
            this.scene.remove(this.ascensor);
        }

        // Creamos un grupo para contener todas las partes del ascensor
        this.ascensor = new THREE.Group();

        // Obtenemos dimensiones
        const { ancho, profundidad, alto } = this.configuracion.dimensiones;

        // Crear las diferentes partes del ascensor
        this.crearParedes(ancho, profundidad, alto);
        this.crearSuelo(ancho, profundidad);
        this.crearTecho(ancho, profundidad, alto);
        this.crearPerfileria(ancho, profundidad, alto);
        this.crearPasamanos(ancho, profundidad, alto);
        this.crearEspejos(ancho, profundidad, alto);
        this.crearBotonera(ancho, profundidad, alto);
        this.crearLeds(ancho, profundidad, alto);

        // Añadimos el ascensor a la escena
        this.scene.add(this.ascensor);

        // No centramos la cámara automáticamente al crear/actualizar el ascensor
        // Esto permitirá que la cámara mantenga su posición cuando el usuario cambie opciones
    }


    /**
     * Actualiza solo los elementos especificados sin reconstruir todo el ascensor
     */
    actualizarElementosEspecificos(elementos) {
        // Guardamos referencias a elementos que no queremos recrear
        const elementosPreservados = {
            paredes: [],
            suelo: null,
            techo: null,
            perfileria: []
        };

        // Identificar y guardar elementos a preservar
        this.ascensor.children.forEach(child => {
            const nombre = child.name || '';

            // Preservar paredes si no se están actualizando
            if (!elementos.includes('paredes') &&
                (nombre.includes('pared') || child.geometry?.parameters?.width === 20)) {
                elementosPreservados.paredes.push(child);
            }

            // Preservar suelo si no se está actualizando
            if (!elementos.includes('suelo') &&
                child.geometry?.parameters?.height === 20 &&
                child.position.y === 0) {
                elementosPreservados.suelo = child;
            }

            // Preservar techo si no se está actualizando
            if (!elementos.includes('techo') &&
                child.geometry?.parameters?.height === 20 &&
                child.position.y > 2000) {
                elementosPreservados.techo = child;
            }

            // Preservar perfilería si no se está actualizando
            if (!elementos.includes('perfileria') &&
                child.material?.metalness > 0.8) {
                elementosPreservados.perfileria.push(child);
            }
        });

        // Eliminar solo los elementos que se van a actualizar
        const hijosAEliminar = [];
        this.ascensor.children.forEach(child => {
            let eliminar = false;

            // Verificar si es un elemento a actualizar
            if (elementos.includes('pasamanos') && child.geometry?.type === 'TubeGeometry') {
                eliminar = true;
            }
            if (elementos.includes('espejos') && child.type === 'Reflector') {
                eliminar = true;
            }
            if (elementos.includes('botonera') && child.name?.includes('botonera')) {
                eliminar = true;
            }
            if (elementos.includes('leds') && child.material?.emissive) {
                eliminar = true;
            }

            if (eliminar) {
                hijosAEliminar.push(child);
            }
        });

        // Eliminar los elementos marcados
        hijosAEliminar.forEach(child => {
            this.ascensor.remove(child);
        });

        // Recrear solo los elementos necesarios
        const { ancho, profundidad, alto } = this.configuracion.dimensiones;

        elementos.forEach(elemento => {
            switch(elemento) {
                case 'pasamanos':
                    this.crearPasamanos(ancho, profundidad, alto);
                    break;
                case 'espejos':
                    this.crearEspejos(ancho, profundidad, alto);
                    break;
                case 'botonera':
                    this.crearBotonera(ancho, profundidad, alto);
                    break;
                case 'leds':
                    this.crearLeds(ancho, profundidad, alto);
                    break;
            }
        });
    }




    /**
     * Crea las paredes del ascensor
     */
    crearParedes(ancho, profundidad, alto) {
        // Obtener materiales para cada pared
        const materialParedIzquierda = this.obtenerMaterial(
            this.configuracion.materiales.paredIzquierda || this.configuracion.materiales.paredes
        );
        const materialParedDerecha = this.obtenerMaterial(
            this.configuracion.materiales.paredDerecha || this.configuracion.materiales.paredes
        );
        const materialParedTrasera = this.obtenerMaterial(
            this.configuracion.materiales.paredCentro || this.configuracion.materiales.paredes
        );

        console.log("=== CREANDO PAREDES ===");
        console.log("Material pared izquierda:", this.configuracion.materiales.paredIzquierda || this.configuracion.materiales.paredes);
        console.log("Material pared derecha:", this.configuracion.materiales.paredDerecha || this.configuracion.materiales.paredes);
        console.log("Material pared trasera:", this.configuracion.materiales.paredCentro || this.configuracion.materiales.paredes);

        // Posición Z fija donde queremos que esté el frente de las paredes laterales
        const Z_FRENTE_FIJO = 700; // Ajusta este valor según donde esté tu hueco

        // Para las paredes laterales:
        // Si el frente debe estar en Z_FRENTE_FIJO y la pared mide 'profundidad',
        // el centro de la pared debe estar en: Z_FRENTE_FIJO - profundidad/2
        const zCentroParedesLaterales = Z_FRENTE_FIJO - profundidad/2;

        // Pared izquierda
        const paredIzquierda = new THREE.Mesh(
            new THREE.BoxGeometry(20, alto, profundidad),
            materialParedIzquierda
        );
        paredIzquierda.name = 'pared-izquierda';
        paredIzquierda.position.set(-ancho/2, alto/2, zCentroParedesLaterales);
        paredIzquierda.castShadow = false;
        paredIzquierda.receiveShadow = true;
        this.ascensor.add(paredIzquierda);

        // Pared derecha
        const paredDerecha = new THREE.Mesh(
            new THREE.BoxGeometry(20, alto, profundidad),
            materialParedDerecha
        );
        paredDerecha.name = 'pared-derecha';
        paredDerecha.position.set(ancho/2, alto/2, zCentroParedesLaterales);
        paredDerecha.castShadow = false;
        paredDerecha.receiveShadow = true;
        this.ascensor.add(paredDerecha);

        // Pared trasera
        const paredTrasera = new THREE.Mesh(
            new THREE.BoxGeometry(ancho, alto, 20),
            materialParedTrasera
        );
        paredTrasera.name = 'pared-trasera';
        // La pared trasera debe estar al final de la cabina
        paredTrasera.position.set(0, alto/2, Z_FRENTE_FIJO - profundidad);
        paredTrasera.castShadow = false;
        paredTrasera.receiveShadow = true;
        this.ascensor.add(paredTrasera);

        // Pared entrada (opcional, podemos dejarla abierta o poner puertas)
        if (this.configuracion.modelo === 'cerrado') {
            const paredEntrada = new THREE.Mesh(
                new THREE.BoxGeometry(ancho, alto, 20),
                materialParedTrasera // Usar el mismo material que la pared trasera/centro
            );
            paredEntrada.name = 'pared-entrada';
            // La pared frontal siempre está en la posición fija
            paredEntrada.position.set(0, alto/2, Z_FRENTE_FIJO);
            paredEntrada.castShadow = true;
            paredEntrada.receiveShadow = true;
            this.ascensor.add(paredEntrada);
        }
    }


    /**
     * Crea el suelo del ascensor
     */
    crearSuelo(ancho, profundidad) {
        const materialSuelo = this.obtenerMaterial(this.configuracion.materiales.suelo);
        const Z_FRENTE_FIJO = 700;

        const suelo = new THREE.Mesh(
            new THREE.BoxGeometry(ancho, 20, profundidad),
            materialSuelo
        );
        suelo.position.set(0, 0, Z_FRENTE_FIJO - profundidad/2);
        suelo.castShadow = false;  // AÑADIDO - no genera sombras
        suelo.receiveShadow = true;
        this.ascensor.add(suelo);
    }

    /**
     * Crea el techo del ascensor con iluminación
     */
    crearTecho(ancho, profundidad, alto) {
        // Material base del techo (mismo que marco_cabina)
        const materialTecho = new THREE.MeshPhysicalMaterial({
            color: 0xFFFFFF,
            metalness: 0.8,
            roughness: 0.2,
            clearcoat: 0.3,
            clearcoatRoughness: 0.2,
            reflectivity: 0.9,
            envMapIntensity: 1.3
        });

        const Z_FRENTE_FIJO = 700;

        // Creamos el techo base
        const techo = new THREE.Mesh(
            new THREE.BoxGeometry(ancho, 20, profundidad),
            materialTecho
        );
        techo.position.set(0, alto, Z_FRENTE_FIJO - profundidad/2);
        techo.castShadow = false;
        techo.receiveShadow = true;
        techo.name = 'techo-base';
        this.ascensor.add(techo);

        // Crear la imagen del techo
        this.crearImagenTecho(ancho, profundidad, alto);
    }

    agregarPanelLED(ancho, profundidad, alto) {
        const materialLuz = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF
        });

        const Z_FRENTE_FIJO = 700;
        const anchoPanel = ancho * 0.8;
        const profundidadPanel = profundidad * 0.8;

        const panel = new THREE.Mesh(
            new THREE.BoxGeometry(anchoPanel, 5, profundidadPanel),
            materialLuz
        );

        // Panel alineado con el techo
        panel.position.set(0, alto - 15, Z_FRENTE_FIJO - profundidad/2);
        this.ascensor.add(panel);

        // Luz también alineada
        const luz = new THREE.PointLight(0xFFFFFF, 0.4, alto * 2);
        luz.position.set(0, alto - 50, Z_FRENTE_FIJO - profundidad/2);
        this.ascensor.add(luz);
    }
   /**
     * Agrega spots (focos) LED al techo
     */
    agregarSpots(ancho, profundidad, alto) {
        // Material para los spots (solo color, sin emissive)
        const materialSpot = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF
        });

        // Creamos 4 spots distribuidos uniformemente
        const radio = 30;
        // Ajustamos las posiciones Z para el nuevo sistema de coordenadas
        const posiciones = [
            {x: ancho/4, z: profundidad/4 - profundidad/2},    // Frontal derecho
            {x: -ancho/4, z: profundidad/4 - profundidad/2},   // Frontal izquierdo
            {x: ancho/4, z: -profundidad/4},                   // Trasero derecho
            {x: -ancho/4, z: -profundidad/4}                   // Trasero izquierdo
        ];
        posiciones.forEach(pos => {
            // Creamos el spot
            const spot = new THREE.Mesh(
                new THREE.CylinderGeometry(radio, radio, 10, 32),
                materialSpot
            );

            // Rotamos para que apunte hacia abajo
            spot.rotation.x = Math.PI / 2;

            // Posicionamos
            spot.position.set(pos.x, alto - 15, pos.z);
            this.ascensor.add(spot);

            // Añadimos una luz para cada spot
            const luz = new THREE.SpotLight(0xFFFFFF, 0.5, alto * 2, Math.PI / 4);
            luz.position.set(pos.x, alto - 20, pos.z);
            luz.target.position.set(pos.x, 0, pos.z);
            this.ascensor.add(luz);
            this.ascensor.add(luz.target);
        });
    }

    /**
 * Crea la imagen del techo con iluminación
 */
    crearImagenTecho(ancho, profundidad, alto) {
        const Z_FRENTE_FIJO = 700;
        const cargadorTexturas = new THREE.TextureLoader();

        // ELIMINAR IMAGEN ANTERIOR DEL TECHO SI EXISTE
        const imagenAnterior = this.ascensor.getObjectByName('techo-imagen');
        if (imagenAnterior) {
            this.ascensor.remove(imagenAnterior);
            // Limpiar texturas y geometría
            if (imagenAnterior.material) {
                if (imagenAnterior.material.map) imagenAnterior.material.map.dispose();
                if (imagenAnterior.material.emissiveMap) imagenAnterior.material.emissiveMap.dispose();
                imagenAnterior.material.dispose();
            }
            if (imagenAnterior.geometry) imagenAnterior.geometry.dispose();
        }

        // Determinar la ruta de la textura según el modo y tipo actual
        const modo = this.modoServicio || 'sustitucion';
        const tipoTecho = this.configuracion.iluminacion || (modo === 'sustitucion' ? 'marco' : 'l-m1');
        const rutaImagen = `textures/techos/${modo}/${tipoTecho}.png`;

    // Cargar textura principal
    cargadorTexturas.load(
        rutaImagen,
        (textura) => {
            // Crear geometría plana para la imagen
            const geometriaTecho = new THREE.PlaneGeometry(ancho * 0.9, profundidad * 0.9);

            // Crear material con la textura
            const materialTechoImagen = new THREE.MeshPhysicalMaterial({
                map: textura,
                transparent: true,
                side: THREE.FrontSide,
                emissive: new THREE.Color(0xffffff),
                emissiveIntensity: 2.0,
                emissiveMap: textura  // USAR LA MISMA TEXTURA COMO MAPA EMISIVO
            });

            // Crear el mesh
            const techoImagen = new THREE.Mesh(geometriaTecho, materialTechoImagen);
            techoImagen.name = 'techo-imagen';

            // Posicionar en el techo (rotado para que mire hacia abajo) - bajado un poco
            techoImagen.position.set(0, alto - 25, Z_FRENTE_FIJO - profundidad/2);
            techoImagen.rotation.x = Math.PI / 2; // Rotar 90 grados para que mire hacia abajo

            // Añadir al ascensor
            this.ascensor.add(techoImagen);

            // Configurar bloom después de un pequeño delay para asegurar que esté en la escena
            setTimeout(() => {
                this.configurarObjetosEmisivos();
            }, 100);
        },
        undefined,
        (error) => {
            console.error('Error al cargar la imagen del techo:', error);
        }
    );
}

    /**
 * Actualiza la imagen del techo
 */
actualizarTechoImagen(tipoTecho) {
    this.configuracion.iluminacion = tipoTecho;

    // Eliminar imagen anterior
    const imagenAnterior = this.ascensor.getObjectByName('techo-imagen');
    if (imagenAnterior) {
        this.ascensor.remove(imagenAnterior);
        if (imagenAnterior.material.map) imagenAnterior.material.map.dispose();
        // Ya no necesitamos disponer de emissiveMap por separado
        imagenAnterior.material.dispose();
        imagenAnterior.geometry.dispose();
    }

    // Crear nueva imagen
    const { ancho, profundidad, alto } = this.configuracion.dimensiones;
    this.crearImagenTecho(ancho, profundidad, alto);

    // Actualizar panel de opciones
    if (typeof actualizarOpcionesElegidas === 'function') {
        actualizarOpcionesElegidas();
    }
}

/**
 * Crea la perfilería del ascensor
 */
crearPerfileria(ancho, profundidad, alto) {
    // Material según configuración
    const materialPerfileria = new THREE.MeshPhysicalMaterial({
        color: 0xC0C0C0,        // Mismo color plateado que los pasamanos
        metalness: 0.9,         // Mismo valor metálico
        roughness: 0.1,         // Mismo acabado pulido
        clearcoat: 0.3,         // Mismo recubrimiento
        clearcoatRoughness: 0.1,
        reflectivity: 1.0,      // Misma reflectividad
        envMapIntensity: 1.5    // Mismo nivel de reflejos del entorno
    });

    if (this.configuracion.perfileria === 'premium') {
        materialPerfileria.color.set(0x999999);
        materialPerfileria.metalness = 0.9;  // Más metálico para premium
        materialPerfileria.envMapIntensity = 1.5;  // Más reflejo para premium
    }

    // Misma posición Z fija que las paredes
    const Z_FRENTE_FIJO = 700;

    // Grosor de la perfilería
    const grosor = 5;

    // === PERFILERÍA EXISTENTE (ESQUINAS) ===
    // Perfiles verticales en las esquinas - ahora con Z ajustada
    const esquinas = [
        {x: -ancho/2 + grosor, z: Z_FRENTE_FIJO - grosor},          // Frontal izquierda
        {x: ancho/2 - grosor, z: Z_FRENTE_FIJO - grosor},           // Frontal derecha
        {x: -ancho/2 + grosor, z: Z_FRENTE_FIJO - profundidad + grosor}, // Trasera izquierda
        {x: ancho/2 - grosor, z: Z_FRENTE_FIJO - profundidad + grosor}   // Trasera derecha
    ];

    esquinas.forEach(pos => {
        const perfil = new THREE.Mesh(
            new THREE.BoxGeometry(grosor*2, alto, grosor*2),
            materialPerfileria
        );
        perfil.position.set(pos.x, alto/2, pos.z);
        this.ascensor.add(perfil);
    });

    // === NUEVA PERFILERÍA: ZÓCALO INFERIOR (solo 3 paredes, NO en la frontal) ===
    const alturaZocalo = 100; // Altura del zócalo
    const profundidadZocalo = 20; // Cuánto sobresale de la pared

    // Zócalo pared trasera
    const zocaloTrasero = new THREE.Mesh(
        new THREE.BoxGeometry(ancho, alturaZocalo, profundidadZocalo),
        materialPerfileria
    );
    zocaloTrasero.position.set(0, alturaZocalo/2, Z_FRENTE_FIJO - profundidad + profundidadZocalo/2);
    this.ascensor.add(zocaloTrasero);

    // Zócalo pared izquierda
    const zocaloIzquierdo = new THREE.Mesh(
        new THREE.BoxGeometry(profundidadZocalo, alturaZocalo, profundidad),
        materialPerfileria
    );
    zocaloIzquierdo.position.set(-ancho/2 + profundidadZocalo/2, alturaZocalo/2, Z_FRENTE_FIJO - profundidad/2);
    this.ascensor.add(zocaloIzquierdo);

    // Zócalo pared derecha
    const zocaloDerecho = new THREE.Mesh(
        new THREE.BoxGeometry(profundidadZocalo, alturaZocalo, profundidad),
        materialPerfileria
    );
    zocaloDerecho.position.set(ancho/2 - profundidadZocalo/2, alturaZocalo/2, Z_FRENTE_FIJO - profundidad/2);
    this.ascensor.add(zocaloDerecho);

    // === NUEVA PERFILERÍA: MOLDURA SUPERIOR DEL TECHO (solo 3 lados, NO frontal) ===
    const alturaMoldura = 60; // Altura de la moldura del techo
    const profundidadMoldura = 30; // Cuánto sobresale hacia dentro

    // Moldura trasera
    const molduraTrasera = new THREE.Mesh(
        new THREE.BoxGeometry(ancho, alturaMoldura, profundidadMoldura),
        materialPerfileria
    );
    molduraTrasera.position.set(0, alto - alturaMoldura/2, Z_FRENTE_FIJO - profundidad + profundidadMoldura/2);
    this.ascensor.add(molduraTrasera);

    // Moldura izquierda
    const molduraIzquierda = new THREE.Mesh(
        new THREE.BoxGeometry(profundidadMoldura, alturaMoldura, profundidad),
        materialPerfileria
    );
    molduraIzquierda.position.set(-ancho/2 + profundidadMoldura/2, alto - alturaMoldura/2, Z_FRENTE_FIJO - profundidad/2);
    this.ascensor.add(molduraIzquierda);

    // Moldura derecha
    const molduraDerecha = new THREE.Mesh(
        new THREE.BoxGeometry(profundidadMoldura, alturaMoldura, profundidad),
        materialPerfileria
    );
    molduraDerecha.position.set(ancho/2 - profundidadMoldura/2, alto - alturaMoldura/2, Z_FRENTE_FIJO - profundidad/2);
    this.ascensor.add(molduraDerecha);

    // === PERFILERÍA HORIZONTAL EXISTENTE (mantener) ===
    // Perfiles horizontales superiores
    const perfilSuperiorTrasero = new THREE.Mesh(
        new THREE.BoxGeometry(ancho, grosor*2, grosor*2),
        materialPerfileria
    );
    perfilSuperiorTrasero.position.set(0, alto - grosor, Z_FRENTE_FIJO - profundidad + grosor);
    this.ascensor.add(perfilSuperiorTrasero);

    const perfilSuperiorDelantero = new THREE.Mesh(
        new THREE.BoxGeometry(ancho, grosor*2, grosor*2),
        materialPerfileria
    );
    perfilSuperiorDelantero.position.set(0, alto - grosor, Z_FRENTE_FIJO - grosor);
    this.ascensor.add(perfilSuperiorDelantero);

    const perfilSuperiorIzquierdo = new THREE.Mesh(
        new THREE.BoxGeometry(grosor*2, grosor*2, profundidad),
        materialPerfileria
    );
    perfilSuperiorIzquierdo.position.set(-ancho/2 + grosor, alto - grosor, Z_FRENTE_FIJO - profundidad/2);
    this.ascensor.add(perfilSuperiorIzquierdo);

    const perfilSuperiorDerecho = new THREE.Mesh(
        new THREE.BoxGeometry(grosor*2, grosor*2, profundidad),
        materialPerfileria
    );
    perfilSuperiorDerecho.position.set(ancho/2 - grosor, alto - grosor, Z_FRENTE_FIJO - profundidad/2);
    this.ascensor.add(perfilSuperiorDerecho);

    // Perfiles horizontales inferiores
    const perfilInferiorTrasero = new THREE.Mesh(
        new THREE.BoxGeometry(ancho, grosor*2, grosor*2),
        materialPerfileria
    );
    perfilInferiorTrasero.position.set(0, grosor, Z_FRENTE_FIJO - profundidad + grosor);
    this.ascensor.add(perfilInferiorTrasero);

    const perfilInferiorDelantero = new THREE.Mesh(
        new THREE.BoxGeometry(ancho, grosor*2, grosor*2),
        materialPerfileria
    );
    perfilInferiorDelantero.position.set(0, grosor, Z_FRENTE_FIJO - grosor);
    this.ascensor.add(perfilInferiorDelantero);

    const perfilInferiorIzquierdo = new THREE.Mesh(
        new THREE.BoxGeometry(grosor*2, grosor*2, profundidad),
        materialPerfileria
    );
    perfilInferiorIzquierdo.position.set(-ancho/2 + grosor, grosor, Z_FRENTE_FIJO - profundidad/2);
    this.ascensor.add(perfilInferiorIzquierdo);

    const perfilInferiorDerecho = new THREE.Mesh(
        new THREE.BoxGeometry(grosor*2, grosor*2, profundidad),
        materialPerfileria
    );
    perfilInferiorDerecho.position.set(ancho/2 - grosor, grosor, Z_FRENTE_FIJO - profundidad/2);
    this.ascensor.add(perfilInferiorDerecho);
}

/**
 * Crea los pasamanos según la configuración
 */
crearPasamanos(ancho, profundidad, alto) {
    // Solo creamos pasamanos si está configurado
    if (!this.configuracion.pasamanos.frontal && !this.configuracion.pasamanos.derecha) {
        return;
    }

    // Material del pasamanos con reflejo metálico
    const materialPasamanos = new THREE.MeshPhysicalMaterial({
        color: 0xC0C0C0,
        metalness: 0.9,
        roughness: 0.1,
        clearcoat: 0.3,
        clearcoatRoughness: 0.1,
        reflectivity: 1.0,
        envMapIntensity: 1.5
    });

    const Z_FRENTE_FIJO = 700;

    // Dimensiones del pasamanos
    const radioTubo = 16; // Radio del tubo del pasamanos
    const offsetPared = 50; // REDUCIDO - Distancia desde la pared (más cerca)
    const alturaPasamanos = alto * 0.40; // 42% de la altura total
    const longitudCurva = 80; // Longitud de la curva en los extremos
    const margenLateral = 160; // NUEVO - Margen desde cada extremo de la pared

    // Para una curva de 109 grados
    const factorAngulo = 1.32; // Factor para ~109 grados

    // PASAMANOS TRASERO (FONDO)
    if (this.configuracion.pasamanos.frontal) {
        const puntos3D = [];
        const z = Z_FRENTE_FIJO - profundidad + offsetPared;

        // Calculamos los límites del pasamanos (más corto que el ancho total)
        const xInicio = -ancho/2 + margenLateral;
        const xFin = ancho/2 - margenLateral;

        // Extremo izquierdo - curva de 109 grados hacia la pared
        puntos3D.push(new THREE.Vector3(xInicio - (longitudCurva * (factorAngulo - 1)), alturaPasamanos, z - longitudCurva * factorAngulo));
        puntos3D.push(new THREE.Vector3(xInicio, alturaPasamanos, z));

        // Puntos intermedios para forzar sección recta
        for (let i = 1; i <= 4; i++) {
            const x = xInicio + (xFin - xInicio) * (i/5);
            puntos3D.push(new THREE.Vector3(x, alturaPasamanos, z));
        }

        // Extremo derecho - curva de 109 grados hacia la pared (simétrico)
        puntos3D.push(new THREE.Vector3(xFin, alturaPasamanos, z));
        puntos3D.push(new THREE.Vector3(xFin + (longitudCurva * (factorAngulo - 1)), alturaPasamanos, z - longitudCurva * factorAngulo));

        const curva = new THREE.CatmullRomCurve3(puntos3D, false, 'catmullrom', 0);
        const geometria = new THREE.TubeGeometry(curva, 64, radioTubo, 16, false);
        const pasamanosFondo = new THREE.Mesh(geometria, materialPasamanos);
        this.ascensor.add(pasamanosFondo);
    }

    // PASAMANOS LATERAL DERECHO (opuesto a la botonera)
    if (this.configuracion.pasamanos.derecha) {
        const puntos3D = [];
        const x = ancho/2 - offsetPared;

        // Calculamos los límites del pasamanos (más corto que la profundidad total)
        const zInicio = Z_FRENTE_FIJO - margenLateral;
        const zFin = Z_FRENTE_FIJO - profundidad + margenLateral;

        // Extremo frontal - curva de 109 grados hacia la pared
        puntos3D.push(new THREE.Vector3(x + longitudCurva * factorAngulo, alturaPasamanos, zInicio + (longitudCurva * (factorAngulo - 1))));
        puntos3D.push(new THREE.Vector3(x, alturaPasamanos, zInicio));

        // Puntos intermedios para forzar sección recta
        for (let i = 1; i <= 4; i++) {
            const z = zInicio + (zFin - zInicio) * (i/5);
            puntos3D.push(new THREE.Vector3(x, alturaPasamanos, z));
        }

        // Extremo trasero - curva de 109 grados hacia la pared (simétrico)
        puntos3D.push(new THREE.Vector3(x, alturaPasamanos, zFin));
        puntos3D.push(new THREE.Vector3(x + longitudCurva * factorAngulo, alturaPasamanos, zFin - (longitudCurva * (factorAngulo - 1))));

        const curva = new THREE.CatmullRomCurve3(puntos3D, false, 'catmullrom', 0);
        const geometria = new THREE.TubeGeometry(curva, 64, radioTubo, 16, false);
        const pasamanosLateral = new THREE.Mesh(geometria, materialPasamanos);
        this.ascensor.add(pasamanosLateral);
    }
}
/**
 * Crea espejos según la configuración
 */
/**
 * Crea espejos según la configuración
 */
crearEspejos(ancho, profundidad, alto) {
    console.log("=== CREANDO ESPEJOS ===");

    const Z_FRENTE_FIJO = 700;

    // ESPEJO FRONTAL (en la pared del fondo)
    if (this.configuracion.espejo.frontal !== 'no') {
        this.crearEspejoFrontal(ancho, profundidad, alto, this.configuracion.espejo.frontal);
    }

    // ESPEJO LATERAL (en la pared derecha, opuesta a la botonera)
    if (this.configuracion.espejo.lateral !== 'no') {
        this.crearEspejoLateral(ancho, profundidad, alto, this.configuracion.espejo.lateral);
    }
}

/**
 * Crea el espejo frontal según el tipo
 */
crearEspejoFrontal(ancho, profundidad, alto, tipo) {
    const Z_FRENTE_FIJO = 700;

    let geometriaEspejo;
    let posY = alto/2;

    switch(tipo) {
        case 'medio':
            // Tamaño original del espejo (55% de la altura)
            const altoMedio = alto * 0.55;
            geometriaEspejo = new THREE.PlaneGeometry(
                ancho,
                altoMedio
            );
            posY = alto * 0.695; // Posición original
            break;

            case 'largo':
                // Un poco más grande que medio (70% de la altura)
                const altoLargo = alto * 0.70;
                geometriaEspejo = new THREE.PlaneGeometry(
                    ancho,
                    altoLargo
                );
                posY = alto - (altoLargo / 2); // Posicionado para que toque el techo
                break;

                case 'completo':
                    // Altura completa menos el zócalo (100) y un margen mínimo
                    const altoCompleto = alto - 105; // 100 del zócalo + 5 de margen
                    geometriaEspejo = new THREE.PlaneGeometry(
                        ancho,
                        altoCompleto
                    );
                    posY = (alto + 105) / 2; // Centrado considerando el zócalo
                    break;

                    case 'columna':
                        // Completo en altura pero estrecho (40% del ancho)
                        const altoColumna = alto - 105; // 100 del zócalo + 5 de margen
                        geometriaEspejo = new THREE.PlaneGeometry(
                            ancho * 0.4,
                            altoColumna
                        );
                        posY = (alto + 105) / 2; // Centrado considerando el zócalo
                        break;
    }

    // Crear el espejo con desenfoque
    const espejo = new THREE.Reflector(geometriaEspejo, {
        clipBias: 0.003,
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio,
        color: 0x868E96,
        recursion: 1,
        shader: this.crearMaterialEspejoDesenfocado()
    });

    espejo.position.set(0, posY, Z_FRENTE_FIJO - profundidad + 20);
    this.ascensor.add(espejo);
}
/**
 * Crea el espejo lateral según el tipo
 */
crearEspejoLateral(ancho, profundidad, alto, tipo) {
    const Z_FRENTE_FIJO = 700;

    let geometriaEspejo;
    let posY = alto/2;

    switch(tipo) {
        case 'medio':
            // Tamaño original (55% de la altura)
            const altoMedio = alto * 0.55;
            geometriaEspejo = new THREE.PlaneGeometry(
                profundidad,
                altoMedio
            );
            posY = alto * 0.695;
            break;

            case 'largo':
            // Un poco más grande (70% de la altura)
            const altoLargo = alto * 0.70;
            geometriaEspejo = new THREE.PlaneGeometry(
                profundidad,
                altoLargo
            );
            posY = alto - (altoLargo / 2); // Posicionado para que toque el techo
            break;

                case 'completo':
            // Altura completa menos el zócalo (100) y un margen mínimo
            const altoCompleto = alto - 105; // 100 del zócalo + 5 de margen
            geometriaEspejo = new THREE.PlaneGeometry(
                profundidad - 40, // Restamos 40 para compensar el offset de posición
                altoCompleto
            );
            posY = (alto + 105) / 2; // Centrado considerando el zócalo
            break;
                    case 'columna':
            // Completo en altura pero estrecho (40% del ancho)
            const altoColumna = alto - 105; // 100 del zócalo + 5 de margen
            geometriaEspejo = new THREE.PlaneGeometry(
                ancho * 0.4,
                altoColumna
            );
            posY = (alto + 105) / 2; // Centrado considerando el zócalo
            break;
    }

    // Crear el espejo con desenfoque
    const espejo = new THREE.Reflector(geometriaEspejo, {
        clipBias: 0.003,
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio,
        color: 0x868E96,
        recursion: 1,
        shader: this.crearMaterialEspejoDesenfocado()
    });

    espejo.rotation.y = -Math.PI / 2; // Rotar para la pared lateral
    espejo.position.set(ancho/2 - 20, posY, Z_FRENTE_FIJO - profundidad/2);
    this.ascensor.add(espejo);
}

// En el método inicializar(), después de this.crearAscensorCompleto();
debugMostrarJerarquia() {
    console.log("=== JERARQUÍA DEL ASCENSOR ===");
    console.log("Ascensor principal:", this.ascensor);
    console.log("Número de hijos:", this.ascensor.children.length);

    this.ascensor.traverse((objeto) => {
        if (objeto.isMesh) {
            console.log("- Mesh encontrado:", {
                nombre: objeto.name || "sin nombre",
                posición: objeto.position,
                material: objeto.material.type,
                color: objeto.material.color,
                visible: objeto.visible
            });
        }
    });
}

/**
 * Crea la botonera del ascensor
 */
crearBotonera(ancho, profundidad, alto) {
    // Material de la botonera cargado desde texturas
const rutaTexturasBotonera = 'textures/static_textures/botonera_placa/';
const materialBotonera = new THREE.MeshPhysicalMaterial({
    color: 0xFFFFFF,
    metalness: 0.0,
    roughness: 0.5,
    envMapIntensity: 1.0
});

// Cargar las texturas de la botonera
const cargadorTexturas = new THREE.TextureLoader();

// Cargar material.json
fetch(rutaTexturasBotonera + 'material.json')
    .then(response => response.json())
    .then(materialData => {
        if (materialData.metalness !== undefined) {
            materialBotonera.metalness = materialData.metalness;
        }
        if (materialData.roughness !== undefined) {
            materialBotonera.roughness = materialData.roughness;
        }
        materialBotonera.needsUpdate = true;
    })
    .catch(error => {
        console.log('No se encontró material.json para botonera');
    });

// Cargar textura Albedo
cargadorTexturas.load(
    rutaTexturasBotonera + 'Albedo.png',
    (textura) => {
        materialBotonera.map = textura;
        materialBotonera.needsUpdate = true;
    }
);

// Cargar textura Normal
cargadorTexturas.load(
    rutaTexturasBotonera + 'Normal.png',
    (textura) => {
        materialBotonera.normalMap = textura;
        materialBotonera.normalScale = new THREE.Vector2(1, 1);
        materialBotonera.needsUpdate = true;
    }
);

    const Z_FRENTE_FIJO = 830;
    const anchoBotonera = 240;
    const grosorBotonera = 5;
    let altoBotonera;
    let posY;

    // Determinar altura según el tipo
    if (this.configuracion.botonera.modelo === 'columna') {
        // Columna: casi toda la altura (menos perfilería)
        altoBotonera = alto - 120; // Dejamos espacio para perfilería superior e inferior
        posY = alto/2;
    } else {
        // Placa: altura reducida centrada
        altoBotonera = alto * 0.5; // 50% de la altura total
        posY = alto/2;
    }

// Crear botonera
const geometriaBotonera = new THREE.BoxGeometry(grosorBotonera, altoBotonera, anchoBotonera);
const botonera = new THREE.Mesh(geometriaBotonera, materialBotonera);
botonera.name = 'botonera';

// Posición Z fija de la botonera (calculada con profundidad por defecto 1400)
const Z_BOTONERA_FIJA = 130; // Esta es la posición que tenía con profundidad 1400
botonera.position.set(-ancho/2 + grosorBotonera/2 + 10, posY, Z_BOTONERA_FIJA);

this.ascensor.add(botonera);

    // Crear la cara con la imagen de botones
    // Reutilizar el cargadorTexturas ya declarado
    cargadorTexturas.load(
     'img/botones.png',
     (textura) => {
         // Convertir píxeles a unidades del mundo 3D
         // Asumiendo que 1 unidad = 1mm
         const anchoBotones = 130; // 217 * 0.60
         const altoBotones = 598;  // 996 * 0.60

         // Crear geometría plana para la imagen
         const geometriaBotones = new THREE.PlaneGeometry(anchoBotones, altoBotones);

         // Crear material con la textura
         const materialBotones = new THREE.MeshPhysicalMaterial({
            map: textura,
            transparent: true,
            side: THREE.FrontSide,
            emissive: new THREE.Color(0x0080ff), // Color azul para la emisión
            emissiveIntensity: 2.0 // Intensidad de la emisión
        });

        // Cargar mapa de emisión si existe
        cargadorTexturas.load(
            'img/botones_emissive.png', // Necesitas crear esta imagen
            (texturaEmissive) => {
                materialBotones.emissiveMap = texturaEmissive;
                materialBotones.needsUpdate = true;
            },
            undefined,
            (error) => {
                console.log('No se encontró mapa de emisión, usando emisión uniforme');
            }
        );

         // Crear el mesh
         const botonesMesh = new THREE.Mesh(geometriaBotones, materialBotones);
         botonesMesh.name = 'botones-imagen';

         // Posicionar delante de la botonera (offset de 3mm hacia adelante)
         botonesMesh.position.set(
             -ancho/2 + grosorBotonera + 13, // Un poco más a la derecha que la botonera
             posY,                            // Misma altura
             Z_BOTONERA_FIJA                  // Misma Z
         );

         // Rotar 90 grados en Y para que mire hacia el interior
         botonesMesh.rotation.y = Math.PI / 2;

         // Añadir como hijo del ascensor (no de la botonera para evitar problemas de escala)
         this.ascensor.add(botonesMesh);

         console.log('Imagen de botones cargada y posicionada');
     },
     undefined,
     (error) => {
         console.error('Error al cargar la imagen de botones:', error);
     }
 );

    // Cargar el logo ERSCE en el lado derecho del marco
    cargadorTexturas.load(
        'img/ersce-logo-4.png',
        (textura) => {
            // Convertir píxeles a unidades del mundo 3D
            // Escalar el logo MÁS GRANDE para verlo claramente
            const escala = 0.115; // AUMENTADO para que sea visible
            const anchoLogo = 619 * escala;  // 619
            const altoLogo = 542 * escala;   // 542

            // Crear geometría plana para el logo
            const geometriaLogo = new THREE.PlaneGeometry(anchoLogo, altoLogo);

            // Crear material con la textura
            const materialLogo = new THREE.MeshBasicMaterial({
                map: textura,
                transparent: true,
                side: THREE.DoubleSide, // CAMBIADO para ver desde ambos lados
                alphaTest: 0.1 // Reducido para mejor transparencia
            });

            // Crear el mesh
            const logoMesh = new THREE.Mesh(geometriaLogo, materialLogo);
            logoMesh.name = 'ersce-logo-lateral';

            // POSICIÓN TEMPORAL EN EL CENTRO DE LA CABINA PARA PRUEBA
            logoMesh.position.set(
                595,           // X: centro
                alto/2 + 170,      // Y: centro vertical
                750            // Z: centro de la cabina
            );

            // Sin rotación para verlo de frente
            logoMesh.rotation.y = 0;

            // Añadir metadata para que el modificador de hueco lo identifique
            logoMesh.userData.mueveConVerticesDerecha = true;
            logoMesh.userData.posicionXOriginal = logoMesh.position.x;

            // Añadir al ascensor
            this.ascensor.add(logoMesh);

            console.log('Logo ERSCE lateral cargado y posicionado');
        },
        undefined,
        (error) => {
            console.error('Error al cargar el logo ERSCE lateral:', error);
        }
    );
}

    /**
     * Crea iluminación LED decorativa
     */
crearLeds(ancho, profundidad, alto) {
        // Material para los LEDs (usando solo color, sin propiedades emissive)
        const materialLed = new THREE.MeshBasicMaterial({
            color: 0x00ffff
        });

        // Tamaño de las tiras LED
        const grosorLed = 5;

        // LEDs en esquinas traseras
        if (this.configuracion.leds.esquinas) {
            // Esquina trasera izquierda
            const ledEsquinaIzq = new THREE.Mesh(
                new THREE.BoxGeometry(grosorLed, alto - 100, grosorLed),
                materialLed
            );
            ledEsquinaIzq.position.set(-ancho/2 + 30, alto/2, -profundidad/2 + 30);
            this.ascensor.add(ledEsquinaIzq);

            // Esquina trasera derecha
            const ledEsquinaDer = new THREE.Mesh(
                new THREE.BoxGeometry(grosorLed, alto - 100, grosorLed),
                materialLed
            );
            ledEsquinaDer.position.set(ancho/2 - 30, alto/2, -profundidad/2 + 30);
            this.ascensor.add(ledEsquinaDer);

            // Añadimos luz puntual para simular el brillo
            const luzEsquinaIzq = new THREE.PointLight(0x00ffff, 0.5, 200);
            luzEsquinaIzq.position.set(-ancho/2 + 30, alto/2, -profundidad/2 + 30);
            this.ascensor.add(luzEsquinaIzq);

            const luzEsquinaDer = new THREE.PointLight(0x00ffff, 0.5, 200);
            luzEsquinaDer.position.set(ancho/2 - 30, alto/2, -profundidad/2 + 30);
            this.ascensor.add(luzEsquinaDer);
        }

        // LEDs botonera
        if (this.configuracion.leds.botonera) {
            // Posición de la botonera
            const posXBotonera = -ancho/2 + 30;

            // LED alrededor de la botonera
            const ledBotoneraVert1 = new THREE.Mesh(
                new THREE.BoxGeometry(grosorLed, 450, grosorLed),
                materialLed
            );
            ledBotoneraVert1.position.set(posXBotonera, alto/2, -100);
            this.ascensor.add(ledBotoneraVert1);

            const ledBotoneraVert2 = new THREE.Mesh(
                new THREE.BoxGeometry(grosorLed, 450, grosorLed),
                materialLed
            );
            ledBotoneraVert2.position.set(posXBotonera, alto/2, 100);
            this.ascensor.add(ledBotoneraVert2);

            const ledBotoneraHoriz1 = new THREE.Mesh(
                new THREE.BoxGeometry(grosorLed, grosorLed, 200),
                materialLed
            );
            ledBotoneraHoriz1.position.set(posXBotonera, alto/2 + 225, 0);
            this.ascensor.add(ledBotoneraHoriz1);

            const ledBotoneraHoriz2 = new THREE.Mesh(
                new THREE.BoxGeometry(grosorLed, grosorLed, 200),
                materialLed
            );
            ledBotoneraHoriz2.position.set(posXBotonera, alto/2 - 225, 0);
            this.ascensor.add(ledBotoneraHoriz2);

            // Luz para el efecto
            const luzBotonera = new THREE.PointLight(0x00ffff, 0.5, 200);
            luzBotonera.position.set(posXBotonera, alto/2, 0);
            this.ascensor.add(luzBotonera);
        }

        // LEDs zócalo superior
        if (this.configuracion.leds.zocaloSuperior) {
            // LED a lo largo del perímetro superior
            const ledZocaloSup1 = new THREE.Mesh(
                new THREE.BoxGeometry(ancho - 60, grosorLed, grosorLed),
                materialLed
            );
            ledZocaloSup1.position.set(0, alto - 50, -profundidad/2 + 30);
            this.ascensor.add(ledZocaloSup1);

            const ledZocaloSup2 = new THREE.Mesh(
                new THREE.BoxGeometry(ancho - 60, grosorLed, grosorLed),
                materialLed
            );
            ledZocaloSup2.position.set(0, alto - 50, profundidad/2 - 30);
            this.ascensor.add(ledZocaloSup2);

            const ledZocaloSup3 = new THREE.Mesh(
                new THREE.BoxGeometry(grosorLed, grosorLed, profundidad - 60),
                materialLed
            );
            ledZocaloSup3.position.set(-ancho/2 + 30, alto - 50, 0);
            this.ascensor.add(ledZocaloSup3);

            const ledZocaloSup4 = new THREE.Mesh(
                new THREE.BoxGeometry(grosorLed, grosorLed, profundidad - 60),
                materialLed
            );
            ledZocaloSup4.position.set(ancho/2 - 30, alto - 50, 0);
            this.ascensor.add(ledZocaloSup4);

            // Luces
            const luzZocaloSup = new THREE.PointLight(0x00ffff, 0.5, 200);
            luzZocaloSup.position.set(0, alto - 50, 0);
            this.ascensor.add(luzZocaloSup);
        }

        // LEDs zócalo inferior
        if (this.configuracion.leds.zocaloInferior) {
            // LED a lo largo del perímetro inferior
            const ledZocaloInf1 = new THREE.Mesh(
                new THREE.BoxGeometry(ancho - 60, grosorLed, grosorLed),
                materialLed
            );
            ledZocaloInf1.position.set(0, 50, -profundidad/2 + 30);
            this.ascensor.add(ledZocaloInf1);

            const ledZocaloInf2 = new THREE.Mesh(
                new THREE.BoxGeometry(ancho - 60, grosorLed, grosorLed),
                materialLed
            );
            ledZocaloInf2.position.set(0, 50, profundidad/2 - 30);
            this.ascensor.add(ledZocaloInf2);

            const ledZocaloInf3 = new THREE.Mesh(
                new THREE.BoxGeometry(grosorLed, grosorLed, profundidad - 60),
                materialLed
            );
            ledZocaloInf3.position.set(-ancho/2 + 30, 50, 0);
            this.ascensor.add(ledZocaloInf3);

            const ledZocaloInf4 = new THREE.Mesh(
                new THREE.BoxGeometry(grosorLed, grosorLed, profundidad - 60),
                materialLed
            );
            ledZocaloInf4.position.set(ancho/2 - 30, 50, 0);
            this.ascensor.add(ledZocaloInf4);

            // Luces
            const luzZocaloInf = new THREE.PointLight(0x00ffff, 0.5, 200);
            luzZocaloInf.position.set(0, 50, 0);
            this.ascensor.add(luzZocaloInf);
        }
    }

    /**
     * Obtiene un material según el tipo
     */
    obtenerMaterial(tipo) {
        // Usamos el gestor de texturas para obtener materiales con texturas
        return this.texturas.obtenerMaterialConTextura(tipo);
    }

    /**
 * Centra la cámara en el ascensor
 */
    centrarCamara() {
        // Posicionamos la cámara de frente a la cabina
        const { ancho, profundidad, alto } = this.configuracion.dimensiones;

        // Posición fija para la cámara inicial
        this.camera.position.set(0, 1450, 3792);
        this.camera.lookAt(0, alto * 0.52, 0);  // Cambiado de alto/2 (0.5) a alto*0.65
    this.controls.target.set(0, alto * 0.52, 0);  // Cambiado de alto/2 (0.5) a alto*0.65
    this.controls.update();
}

/**
 * Actualiza la animación de la cámara
 */
actualizarAnimacionCamara() {
    if (!this.animacionCamara.activa) return;

    const tiempoActual = Date.now();
    const tiempoTranscurrido = tiempoActual - this.animacionCamara.tiempoInicio;

    // Calcular progreso (0 a 1)
    this.animacionCamara.progreso = Math.min(tiempoTranscurrido / this.animacionCamara.duracion, 1);

    // Aplicar función de suavizado (ease-in-out)
    const t = this.animacionCamara.progreso;
    const suavizado = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    // Interpolar posición de la cámara
    this.camera.position.lerpVectors(
        this.animacionCamara.posicionInicial,
        this.animacionCamara.posicionFinal,
        suavizado
    );

    // Interpolar target de los controles
    this.controls.target.lerpVectors(
        this.animacionCamara.targetInicial,
        this.animacionCamara.targetFinal,
        suavizado
    );

    // Actualizar controles
    this.controls.update();

    // Verificar si la animación ha terminado
    if (this.animacionCamara.progreso >= 1) {
        this.animacionCamara.activa = false;
        // Asegurar posición final exacta
        this.camera.position.copy(this.animacionCamara.posicionFinal);
        this.controls.target.copy(this.animacionCamara.targetFinal);
        this.controls.update();
    }
}

/**
 * Cambia la posición de la cámara
 */
cambiarVistaCamara(vista) {
    const { ancho, profundidad, alto } = this.configuracion.dimensiones;

    // Guardar posición inicial
    this.animacionCamara.posicionInicial.copy(this.camera.position);
    this.animacionCamara.targetInicial.copy(this.controls.target);

    // Determinar posición final según la vista
    let posicionFinal = new THREE.Vector3();

    switch(vista) {
        case 'principal':
            // Vista frontal con posición fija
            posicionFinal.set(0, 1450, 3792);
            break;
            case 'interior':
                posicionFinal.set(194, 1144, 1845);
                break;
            case 'izquierda':
                posicionFinal.set(2040, 1607, 3660);
                break;
            case 'derecha':
                posicionFinal.set(-2040, 1607, 3660);
                break;
        default:
            // Vista por defecto con posición fija
            posicionFinal.set(0, 1450, 3792);
    }

    // Guardar posición final
    this.animacionCamara.posicionFinal.copy(posicionFinal);
    this.animacionCamara.targetFinal.set(0, alto * 0.52, 0);

    // Iniciar animación
    this.animacionCamara.activa = true;
    this.animacionCamara.progreso = 0;
    this.animacionCamara.tiempoInicio = Date.now();
}

/**
 * Actualiza las dimensiones del ascensor
 */
actualizarDimensiones(ancho, profundidad, alto) {
    // Validamos las dimensiones
    if (ancho < 650) ancho = 650;
    if (ancho > 1600) ancho = 1600;
    if (profundidad < 650) profundidad = 650;
    if (profundidad > 2100) profundidad = 2100;

    // Alto siempre será 2200 (fijo)
    alto = 2200;

    // Actualizamos las dimensiones en la configuración
    this.configuracion.dimensiones = { ancho, profundidad, alto };

    // Reconstruimos el ascensor
    this.crearAscensorCompleto();

    this.debugMostrarJerarquia();

    // Solo creamos el modificador una vez y lo reutilizamos
    if (!this._modificadorHueco) {
        this._modificadorHueco = new ModificadorHueco();
    }

    // Aplicar modificación a los huecos después de un breve retraso
    setTimeout(() => {
        // Modificar huecos y marcos
        const resultado = this._modificadorHueco.modificarHuecos(this, ancho);
        if (resultado) {
            console.log("Huecos y marcos modificados exitosamente");
        } else {
            console.warn("No se pudieron modificar algunos huecos o marcos");
        }

        // Actualizar posición del logo ERSCE si existe
        const logoErsce = this.ascensor.getObjectByName('ersce-logo-lateral');
        if (logoErsce && logoErsce.userData.mueveConVerticesDerecha) {
            const diferenciaAncho = ancho - 1100; // 1100 es el ancho base
            const desplazamiento = diferenciaAncho / 2;

            // Actualizar posición X del logo
            logoErsce.position.x = (logoErsce.userData.posicionXOriginal || (1100/2 - 30)) + desplazamiento;
            console.log(`Logo ERSCE movido a X: ${logoErsce.position.x}`);
        }
    }, 50); // Tiempo de espera para asegurar que los modelos estén cargados
}
    /**
     * Actualiza el material de una parte del ascensor
     */
    /**
 * Actualiza el material de una parte del ascensor
 */
actualizarMaterial(parte, material) {
    this.configuracion.materiales[parte] = material;

    // NO recrear todo el ascensor, solo actualizar el material específico
    this.actualizarElementoEspecifico(parte);
}

actualizarElementoEspecifico(elemento) {
    const { ancho, profundidad, alto } = this.configuracion.dimensiones;

    switch(elemento) {
        case 'suelo':
            // Usar transición suave para evitar flash sin material
            this.cambiarSueloConTransicion(ancho, profundidad);
            break;

        case 'paredes':
            // Usar transición suave para paredes
            this.cambiarParedesConTransicion();
            break;

        case 'techo':
            // Usar transición suave para techo
            this.cambiarTechoConTransicion(ancho, profundidad, alto);
            break;
    }

    // También actualizar los modelos OBJ que usan texturas dinámicas
    // EXCEPTO para el suelo - el escenario_suelo debe mantener las texturas del entorno
    if (elemento !== 'suelo') {
        this.actualizarModelosDinamicos(elemento);
    }
}

/**
 * Cambia el suelo manteniendo el anterior hasta que el nuevo esté listo
 */
cambiarSueloConTransicion(ancho, profundidad) {
    // Encontrar suelo actual ANTES de crear uno nuevo
    let sueloActual = null;
    this.ascensor.children.forEach(child => {
        if (child.geometry?.parameters?.height === 20 && child.position.y === 0) {
            sueloActual = child;
        }
    });

    // Si no hay suelo actual, crear uno normal
    if (!sueloActual) {
        this.crearSuelo(ancho, profundidad);
        return;
    }

    console.log("Iniciando transición de suelo...");

    // Obtener el nuevo material
    const nuevoMaterial = this.obtenerMaterial(this.configuracion.materiales.suelo);

    // Esperar a que el material esté completamente cargado ANTES de hacer el cambio
    this.esperarCargaTextura(nuevoMaterial).then(() => {
        console.log("Nuevo material de suelo cargado, aplicando cambio...");

        // Aplicar el nuevo material directamente al suelo existente
        const materialAnterior = sueloActual.material;
        sueloActual.material = nuevoMaterial;
        sueloActual.material.needsUpdate = true;

        // Limpiar el material anterior
        if (materialAnterior && materialAnterior !== nuevoMaterial) {
            if (materialAnterior.map) materialAnterior.map.dispose();
            if (materialAnterior.normalMap) materialAnterior.normalMap.dispose();
            materialAnterior.dispose();
        }

        console.log("Transición de suelo completada");
    });
}

/**
 * Cambia las paredes manteniendo las anteriores hasta que las nuevas estén listas
 */
cambiarParedesConTransicion() {
    console.log("=== ACTUALIZANDO PAREDES CON TRANSICIÓN:", this.configuracion.materiales.paredes, "===");

    const nuevoMaterial = this.obtenerMaterial(this.configuracion.materiales.paredes);

    // Esperar a que el material esté listo
    this.esperarCargaTextura(nuevoMaterial).then(() => {
        // Aplicar a las paredes existentes
        this.ascensor.children.forEach(child => {
            // VERIFICAR QUE NO ES PERFILERÍA (la perfilería tiene metalness > 0.8)
            if (child.material && child.material.metalness > 0.8) {
                return; // NO tocar la perfilería
            }

            if (child.geometry?.parameters?.width === 20) { // Paredes laterales
                const materialClonado = nuevoMaterial.clone();
                child.material = materialClonado;
                child.material.needsUpdate = true;
            } else if (child.geometry?.parameters?.depth === 20 && child.position.y > 100) { // Pared trasera
                const materialClonado = nuevoMaterial.clone();
                child.material = materialClonado;
                child.material.needsUpdate = true;
            }
        });
    });
}

/**
 * Cambia una pared específica con transición suave
 */
cambiarParedEspecificaConTransicion(tipoPared, nuevoMaterial) {
    console.log(`=== ACTUALIZANDO PARED ${tipoPared} CON TRANSICIÓN:`, nuevoMaterial, "===");

    const materialObj = this.obtenerMaterial(nuevoMaterial);

    // Esperar a que el material esté listo
    this.esperarCargaTextura(materialObj).then(() => {
        // Buscar la pared específica por nombre
        this.ascensor.children.forEach(child => {
            let actualizar = false;

            switch(tipoPared) {
                case 'izquierda':
                    actualizar = (child.name === 'pared-izquierda');
                    break;
                case 'centro':
                    actualizar = (child.name === 'pared-trasera');
                    break;
                case 'derecha':
                    actualizar = (child.name === 'pared-derecha');
                    break;
            }

            if (actualizar) {
                // Clonar el material para evitar compartirlo entre paredes
                const materialClonado = materialObj.clone();
                child.material = materialClonado;
                child.material.needsUpdate = true;
                console.log(`Pared ${tipoPared} actualizada con material:`, nuevoMaterial);
            }
        });
    });
}
/**
 * Cambia el techo manteniendo el anterior hasta que el nuevo esté listo
 */
cambiarTechoConTransicion(ancho, profundidad, alto) {
    const nuevoMaterial = this.obtenerMaterial(this.configuracion.materiales.techo);

    // Crear el nuevo techo en paralelo (invisible)
    const Z_FRENTE_FIJO = 700;
    const nuevoTecho = new THREE.Mesh(
        new THREE.BoxGeometry(ancho, 20, profundidad),
        nuevoMaterial
    );
    nuevoTecho.position.set(0, alto, Z_FRENTE_FIJO - profundidad/2);
    nuevoTecho.castShadow = false;
    nuevoTecho.receiveShadow = true;
    nuevoTecho.visible = false;

    this.ascensor.add(nuevoTecho);

    this.esperarCargaTextura(nuevoMaterial).then(() => {
        // Encontrar y eliminar techos anteriores
        const techosAnteriores = [];
        this.ascensor.children.forEach(child => {
            if (child.geometry?.parameters?.height === 20 &&
                child.position.y > 2000 &&
                child !== nuevoTecho) {
                techosAnteriores.push(child);
            }
        });

        nuevoTecho.visible = true;

        techosAnteriores.forEach(techo => {
            this.ascensor.remove(techo);
            if (techo.geometry) techo.geometry.dispose();
            if (techo.material) techo.material.dispose();
        });

        // Recrear iluminación
        this.agregarIluminacionTecho(ancho, profundidad, alto);
    });
}

/**
 * Espera a que las texturas de un material estén cargadas
 */
esperarCargaTextura(material) {
    return new Promise((resolve) => {
        // Si el material no está cargando, resolver inmediatamente
        if (!material._isLoading) {
            resolve();
            return;
        }

        // Configurar callback para cuando termine de cargar
        material._onLoadComplete = () => {
            resolve();
        };

        // Timeout de seguridad de 2 segundos
        setTimeout(() => {
            console.log("Timeout en carga de texturas, continuando...");
            resolve();
        }, 2000);
    });
}

/**
 * Añade iluminación específica al techo (extraído de crearTecho)
 */
agregarIluminacionTecho(ancho, profundidad, alto) {
    // Añadimos iluminación según la configuración
    switch(this.configuracion.iluminacion) {
        case 'panel-led':
            this.agregarPanelLED(ancho, profundidad, alto);
            break;
        case 'spots-led':
            this.agregarSpots(ancho, profundidad, alto);
            break;
        // Si es 'estandar', no agregamos iluminación especial
    }
}

/**
 * Actualiza solo los modelos dinámicos que corresponden al elemento cambiado
 */
actualizarModelosDinamicos(elemento) {
    if (elemento === 'suelo') {
        // Buscar y actualizar solo el modelo del suelo
        this.modelosAdicionales.forEach(modelo => {
            if (modelo.userData && modelo.userData.carpeta === 'escenario_suelo') {
                const nuevaMaterial = this.obtenerMaterial(this.configuracion.materiales.suelo);
                modelo.traverse((hijo) => {
                    if (hijo.isMesh) {
                        // Dispose del material anterior
                        if (hijo.material) {
                            if (hijo.material.map) hijo.material.map.dispose();
                            if (hijo.material.normalMap) hijo.material.normalMap.dispose();
                            hijo.material.dispose();
                        }
                        // Aplicar nuevo material
                        hijo.material = nuevaMaterial.clone();
                    }
                });
            }
        });
    }
}

    /**
     * Cambia el modelo de ascensor
     */
    cambiarModelo(modelo) {
        this.configuracion.modelo = modelo;
        this.crearAscensorCompleto();
    }

    /**
 * Actualiza el tipo de iluminación
 */
actualizarIluminacion(tipo) {
    this.configuracion.iluminacion = tipo;
    // Solo actualizar el techo, no todo
    this.actualizarElementoEspecifico('techo');
}

/**
 * Actualiza el tipo de perfilería
 */
actualizarPerfileria(tipo) {
    this.configuracion.perfileria = tipo;
    // Solo actualizar perfilería
    this.actualizarElementosEspecificos(['perfileria']);
}

    /**
     * Actualiza la configuración de pasamanos
     */
    actualizarPasamanos() {
        this.actualizarElementosEspecificos(['pasamanos']);
    }

    /**
     * Actualiza la configuración de espejos
     */
    actualizarEspejos() {
        this.actualizarElementosEspecificos(['espejos']);
    }

    /**
     * Actualiza la configuración de botonera
     */
    actualizarBotonera() {
        this.actualizarElementosEspecificos(['botonera']);
    }

    /**
     * Actualiza la configuración de LEDs
     */
    actualizarLeds() {
        this.actualizarElementosEspecificos(['leds']);
    }

    /**
     * Actualiza el material de una pared específica
     */
    actualizarMaterialParedEspecifica(tipoPared, material) {
        // Primero establecer el material general si es null
        if (!this.configuracion.materiales.paredes) {
            this.configuracion.materiales.paredes = material;
        }

        // Actualizar la configuración
        switch(tipoPared) {
            case 'izquierda':
                this.configuracion.materiales.paredIzquierda = material;
                break;
            case 'centro':
                this.configuracion.materiales.paredCentro = material;
                break;
            case 'derecha':
                this.configuracion.materiales.paredDerecha = material;
                break;
        }

        // Actualizar solo las paredes específicas de la cabina
        this.actualizarParedesEspecificas();

        // NUEVO: Si la función está disponible, actualizar la selección visual
        if (typeof actualizarSeleccionMaterialParedes === 'function') {
            actualizarSeleccionMaterialParedes();
        }
    }

    actualizarParedesEspecificas() {
        // Usar transición para cada pared individual
        if (this.configuracion.materiales.paredIzquierda) {
            this.cambiarParedEspecificaConTransicion('izquierda', this.configuracion.materiales.paredIzquierda);
        }

        if (this.configuracion.materiales.paredCentro) {
            this.cambiarParedEspecificaConTransicion('centro', this.configuracion.materiales.paredCentro);
        }

        if (this.configuracion.materiales.paredDerecha) {
            this.cambiarParedEspecificaConTransicion('derecha', this.configuracion.materiales.paredDerecha);
        }
    }

    /**
     * Reinicia la configuración a los valores por defecto
     */
    reiniciar() {
        this.configuracion = {
            modelo: 'basico',
            dimensiones: {
                ancho: 1100,
                profundidad: 1400,
                alto: 2200
            },
            materiales: {
                paredes: 'acero-pulido',
                suelo: 'ceramica',
                techo: 'acero-pulido'
            },
            iluminacion: 'panel-led',
            perfileria: 'estandar',
            pasamanos: {
                modelo: 'curvo',
                material: 'acero',
                izquierda: false,
                frontal: false,
                derecha: false
            },
            espejo: {
                frontal: true,
                lateral: false
            },
            acristalado: {
                frontal: false,
                lateral: false
            },
            botonera: {
                modelo: 'estandar',
                material: 'acero'
            },
            leds: {
                esquinas: false,
                botonera: false,
                zocaloSuperior: false,
                zocaloInferior: false
            },
            entorno: 'oficina'
        };

        this.crearAscensorCompleto();

        // Refrescamos también los modelos adicionales
        this.refrescarModelosAdicionales();
    }

    /**
     * Carga los modelos adicionales
     */
    cargarModelosAdicionales() {
        // Simulamos un escaneo de la carpeta modelos
        // En un entorno real, esto sería una llamada al servidor para listar carpetas
        this.buscarCarpetasModelos()
            .then(carpetas => {
                // Crear un array de promesas para rastrear la carga
                const promesasCarga = [];

                // Para cada carpeta encontrada, cargamos el modelo
                carpetas.forEach(carpeta => {
                    const promesa = this.cargarModelo(carpeta);
                    promesasCarga.push(promesa);
                });

                // Cuando TODOS los modelos estén cargados, configurar bloom
                Promise.all(promesasCarga).then(() => {
                    console.log("Todos los modelos cargados, configurando bloom...");
                    setTimeout(() => {
                        this.configurarObjetosEmisivos();
                        // También actualizar después de otro delay por si acaso
                        setTimeout(() => {
                            this.configurarObjetosEmisivos();
                        }, 1000);
                    }, 500);
                });
            })
            .catch(error => {
                console.error("Error al buscar carpetas de modelos:", error);
            });
    }

    /**
 * Busca las carpetas que contienen modelos adicionales
 * @returns {Promise} Promesa que resuelve con la lista de carpetas
 */
buscarCarpetasModelos() {
    // Esta función simula la búsqueda de carpetas
    // En un entorno real, haría una petición AJAX al servidor
    return new Promise((resolve, reject) => {
        // Solo incluye carpetas que realmente existan en tu sistema
        const carpetas = [
            // Modelos con texturas dinámicas (sin carpeta textures propia)
            "dynamic_texture_obj/escenario_pared_main",
            "dynamic_texture_obj/escenario_pared_left",
            "dynamic_texture_obj/escenario_pared_right",
            "dynamic_texture_obj/escenario_pared_back",
            "dynamic_texture_obj/escenario_suelo",
            "dynamic_texture_obj/escenario_perfileria_main",
            "dynamic_texture_obj/escenario_perfileria_left",
            "dynamic_texture_obj/escenario_perfileria_right",
            "dynamic_texture_obj/escenario_perfileria_back",

            // Modelos con texturas estáticas (con carpeta textures propia)
            "static_texture_obj/marco_cabina",
            "static_texture_obj/botonera_exterior"
        ];

        // Guardamos las carpetas para referenciarlas más tarde
        this.carpetasModelos = carpetas;

        // Simulamos una pequeña demora como lo haría una llamada real
        setTimeout(() => {
            resolve(carpetas);
        }, 300);
    });
}

/**
     * Carga un modelo OBJ desde una carpeta específica
     * @param {string} carpeta - Nombre de la carpeta que contiene el modelo
     * @returns {Promise} Promesa que se resuelve cuando el modelo está cargado
     */
cargarModelo(carpeta) {
    return new Promise((resolve, reject) => {
        // Ruta base para el modelo
        const rutaBase = `modelos/${carpeta}/`;

        // Extraer el nombre real del modelo (sin la ruta dynamic/static)
        const nombreModelo = carpeta.includes('/') ? carpeta.split('/')[1] : carpeta;

        // Primero cargamos el archivo de configuración JSON si existe
        this.cargarConfiguracionModelo(rutaBase)
            .then(configuracion => {
                // Ahora cargamos el modelo OBJ
                this.cargarModeloOBJ(rutaBase, configuracion)
                    .then(() => resolve())
                    .catch(error => reject(error));
            })
            .catch(error => {
                console.error(`Error al cargar configuración del modelo ${carpeta}:`, error);
                // Intentamos cargar el modelo sin configuración
                this.cargarModeloOBJ(rutaBase, null)
                    .then(() => resolve())
                    .catch(error => reject(error));
            });
    });
}

    /**
     * Carga la configuración de un modelo desde un archivo JSON
     * @param {string} rutaBase - Ruta base de la carpeta del modelo
     * @returns {Promise} Promesa que resuelve con la configuración cargada
     */
    cargarConfiguracionModelo(rutaBase) {
        return new Promise((resolve, reject) => {
            // Intentamos cargar el archivo position.json
            fetch(`${rutaBase}position.json`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    resolve(data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    /**
 * Carga un modelo OBJ y sus texturas
 * @param {string} rutaBase - Ruta base de la carpeta del modelo
 * @param {Object} configuracion - Configuración de posición, rotación y escala
 */
    cargarModeloOBJ(rutaBase, configuracion) {
        return new Promise((resolve, reject) => {
            // Extraer el nombre de la carpeta de la ruta
            // Ahora puede ser "modelos/dynamic_texture_obj/carpeta/" o "modelos/static_texture_obj/carpeta/"
            const partesRuta = rutaBase.split('/');
            const carpeta = partesRuta[partesRuta.length - 2]; // Obtener el nombre real del modelo

            // Cargamos el archivo OBJ
            const loader = new THREE.OBJLoader();

            loader.load(
                // Ruta del archivo OBJ
                `${rutaBase}modelo.obj`,

        // Callback cuando el modelo se ha cargado
        // Callback cuando el modelo se ha cargado
(objeto) => {
    // Guardamos referencia a la carpeta en userData
    objeto.userData = { carpeta: carpeta };

    // También guardamos la carpeta en cada mesh hijo para facilitar el acceso
    objeto.traverse((hijo) => {
        if (hijo.isMesh) {
            hijo.userData.carpetaPadre = carpeta;
        }
    });

            // Aplicamos configuración si existe
            if (configuracion) {
                // Posición
                if (configuracion.position) {
                    objeto.position.set(
                        configuracion.position.x || 0,
                        configuracion.position.y || 0,
                        configuracion.position.z || 0
                    );
                }

                // Rotación
                if (configuracion.rotation) {
                    objeto.rotation.set(
                        configuracion.rotation.x || 0,
                        configuracion.rotation.y || 0,
                        configuracion.rotation.z || 0
                    );
                }

                // Escala
                if (configuracion.scale) {
                    objeto.scale.set(
                        configuracion.scale.x || 1,
                        configuracion.scale.y || 1,
                        configuracion.scale.z || 1
                    );
                }
            }

            // Cargamos las texturas para el modelo
            this.cargarTexturasModelo(objeto, rutaBase);

            // Añadimos el objeto a la escena
            this.scene.add(objeto);

            /// Guardamos referencia al modelo
            this.modelosAdicionales.push(objeto);

            console.log(`Modelo cargado: ${rutaBase}`);
            resolve();
        },

        // Callback de progreso
        (xhr) => {
            const porcentaje = (xhr.loaded / xhr.total) * 100;
            console.log(`Cargando modelo ${rutaBase}: ${porcentaje.toFixed(2)}%`);
        },

        // Callback de error
        (error) => {
            console.error(`Error al cargar el modelo ${rutaBase}:`, error);
            reject(error);
        }
    );
        });
    }

/**
 * Carga las texturas para un modelo y las aplica
 * @param {THREE.Object3D} objeto - El objeto 3D al que aplicar las texturas
 * @param {string} rutaBase - Ruta base de la carpeta del modelo
 */
cargarTexturasModelo(objeto, rutaBase) {
    // Extraer el nombre de la carpeta
    const partesRuta = rutaBase.split('/');
    const carpeta = partesRuta[partesRuta.length - 2]; // Obtener el nombre real del modelo
    const tipoCarpeta = partesRuta[1]; // "dynamic_texture_obj" o "static_texture_obj"

    // Si es un modelo con texturas dinámicas
    if (tipoCarpeta === 'dynamic_texture_obj') {
        // Lista de modelos de paredes que deben usar texturas de oficina por defecto
        const modelosParedesLaterales = [
            'escenario_pared_left',
            'escenario_pared_right',
            'escenario_pared_back'
        ];

        // Si es una pared o suelo del escenario, usar texturas de oficina por defecto
const modelosParedes = [
    'escenario_pared_left',
    'escenario_pared_right',
    'escenario_pared_back',
    'escenario_pared_main'  // Ahora todas las paredes usan la misma carpeta
];

if (modelosParedes.includes(carpeta)) {
    const rutaTexturas = `textures/entorno/oficina/paredes/`;
    this.aplicarMaterialBasico(objeto, rutaTexturas);
} else if (carpeta === 'escenario_suelo') {
    const rutaTexturas = `textures/entorno/oficina/suelo/`;
    this.aplicarMaterialBasico(objeto, rutaTexturas);
}
        // NUEVO: Aplicar texturas por defecto a perfilería
        else if (carpeta === 'escenario_perfileria_main' ||
            carpeta === 'escenario_perfileria_left' ||
            carpeta === 'escenario_perfileria_right' ||
            carpeta === 'escenario_perfileria_back') {
       const rutaTexturas = `textures/entorno/oficina/perfileria/`;
       this.aplicarMaterialBasico(objeto, rutaTexturas);
   }
    } else {
        // Para modelos con texturas estáticas, usar sus texturas propias
        const rutaTexturas = `${rutaBase}textures/`;
        this.aplicarMaterialBasico(objeto, rutaTexturas);
    }
}

/**
 * Aplica un material básico con texturas Albedo, Normal y opcionalmente Emissive
 * @param {THREE.Object3D} objeto - El objeto 3D al que aplicar las texturas
 * @param {string} rutaTexturas - Ruta a la carpeta de texturas
 */
aplicarMaterialBasico(objeto, rutaTexturas) {
    // Lista de mapas de textura a cargar - separamos las obligatorias de las opcionales
    const mapasObligatorios = [
        { nombre: 'Albedo', tipo: 'map' },
        { nombre: 'Normal', tipo: 'normalMap' }
    ];

    const mapasOpcionales = [
        { nombre: 'Emissive', tipo: 'emissiveMap' }
    ];

    // Cargador de texturas
    const cargadorTexturas = new THREE.TextureLoader();

    // Primero intentamos cargar el material.json
    fetch(`${rutaTexturas}material.json`)
        .then(response => response.json())
        .then(materialData => {
            console.log(`Material JSON cargado para ${rutaTexturas}:`, materialData);

            // Recorremos cada objeto hijo
objeto.traverse((hijo) => {
    if (hijo.isMesh) {
        // Solo marco_cabina mantiene el reflejo del environment
        const esMarcocabina = rutaTexturas.includes('marco_cabina');

        // Creamos un nuevo material PBR con valores del JSON o por defecto
        const material = new THREE.MeshPhysicalMaterial({
            color: 0xFFFFFF,
            roughness: materialData.roughness !== undefined ? materialData.roughness : 0.5,
            metalness: materialData.metalness !== undefined ? materialData.metalness : 0.0,
            clearcoat: materialData.metalness > 0.7 ? 0.3 : 0.0,
            clearcoatRoughness: 0.1,
            envMapIntensity: esMarcocabina ? (materialData.metalness > 0.5 ? 1.5 : 1.0) : 0,
                        // Solo aplicar emisión si está definida en el JSON
                        emissive: materialData.emissive ? new THREE.Color(materialData.emissive) : new THREE.Color(0x000000),
                        emissiveIntensity: materialData.emissiveIntensity !== undefined ? materialData.emissiveIntensity : 0.0
                    });

                    // Configurar repeticiones si están definidas
const repeatX = materialData.textureRepeat?.x || 1;
const repeatY = materialData.textureRepeat?.y || 1;

// Cargar texturas obligatorias
mapasObligatorios.forEach(mapa => {
    cargadorTexturas.load(
        `${rutaTexturas}${mapa.nombre}.png`,
        (textura) => {
            // Configurar repetición para todas las texturas
            textura.wrapS = THREE.RepeatWrapping;
            textura.wrapT = THREE.RepeatWrapping;
            textura.repeat.set(repeatX, repeatY);

            material[mapa.tipo] = textura;

            if (mapa.tipo === 'normalMap') {
                // Usar normalIntensity del JSON si está definido, si no usar 1.0 por defecto
                const normalIntensity = materialData.normalIntensity !== undefined ? materialData.normalIntensity : 1.0;
                material.normalScale = new THREE.Vector2(normalIntensity, normalIntensity);
            }

            material.needsUpdate = true;
            console.log(`Textura ${mapa.nombre} cargada para ${rutaTexturas}`);
        },
        undefined,
        (error) => {
            console.warn(`No se pudo cargar la textura obligatoria ${mapa.nombre} para ${rutaTexturas}:`, error);
        }
    );
});

                    // Solo intentar cargar texturas opcionales si hay emisión definida
                    if (materialData.emissiveIntensity && materialData.emissiveIntensity > 0) {
                        console.log(`Intentando cargar textura emisiva para ${rutaTexturas}`);

                        mapasOpcionales.forEach(mapa => {
                            // Primero verificar si el archivo existe
                            fetch(`${rutaTexturas}${mapa.nombre}.png`)
                                .then(response => {
                                    if (response.ok) {
                                        // Si existe, cargar la textura
                                        cargadorTexturas.load(
                                            `${rutaTexturas}${mapa.nombre}.png`,
                                            (textura) => {
                                                material[mapa.tipo] = textura;
                                                material.needsUpdate = true;
                                                console.log(`Textura emisiva cargada para ${rutaTexturas}`);
                                            }
                                        );
                                    } else {
                                        console.log(`No hay textura emisiva en ${rutaTexturas}, usando solo color emisivo`);
                                    }
                                })
                                .catch(() => {
                                    console.log(`No se pudo verificar textura emisiva en ${rutaTexturas}`);
                                });
                        });
                    }

                    // Asignamos el nuevo material
                    hijo.material = material;
                    hijo.material.needsUpdate = true;
                }
            });
        })
        .catch(error => {
            console.warn(`No se pudo cargar material.json para ${rutaTexturas}, usando valores por defecto:`, error);

            // Si no hay JSON, aplicamos material por defecto sin emisión
            objeto.traverse((hijo) => {
                if (hijo.isMesh) {
                    // Solo marco_cabina mantiene el reflejo del environment
const esMarcocabina = rutaTexturas.includes('marco_cabina');

const material = new THREE.MeshPhysicalMaterial({
    color: 0xFFFFFF,
    roughness: 0.5,
    metalness: 0.0,
    envMapIntensity: esMarcocabina ? 1.0 : 0,
                        emissive: new THREE.Color(0x000000),
                        emissiveIntensity: 0.0
                    });

                    // Solo cargar texturas obligatorias
                    mapasObligatorios.forEach(mapa => {
                        cargadorTexturas.load(
                            `${rutaTexturas}${mapa.nombre}.png`,
                            (textura) => {
                                material[mapa.tipo] = textura;

                                if (mapa.tipo === 'normalMap') {
                                    material.normalScale = new THREE.Vector2(1, 1);
                                }

                                material.needsUpdate = true;
                            },
                            undefined,
                            (error) => {
                                console.warn(`No se pudo cargar la textura ${mapa.nombre}`);
                            }
                        );
                    });

                    hijo.material = material;
                }
            });
        });
}


    /**
     * Limpia los modelos adicionales de la escena
     */
    limpiarModelosAdicionales() {
        // Eliminamos cada modelo de la escena
        this.modelosAdicionales.forEach(modelo => {
            this.scene.remove(modelo);
        });

        // Vaciamos el array
        this.modelosAdicionales = [];
    }

    /**
     * Refresca los modelos adicionales
     */
    refrescarModelosAdicionales() {
        // Limpiamos los modelos actuales
        this.limpiarModelosAdicionales();

        // Cargamos de nuevo
        this.cargarModelosAdicionales();
    }
/**
     * Refresca los modelos adicionales
     */
refrescarModelosAdicionales() {
    // Limpiamos los modelos actuales
    this.limpiarModelosAdicionales();

    // Cargamos de nuevo
    this.cargarModelosAdicionales();
}

/**
 * Activa el modo de edición con controles de cámara libres
 */
activarModoEdicion() {
    console.log("Modo edición activado");

    // Guardar configuración actual de los controles
    this.controlsConfigOriginal = {
        minDistance: this.controls.minDistance,
        maxDistance: this.controls.maxDistance,
        minPolarAngle: this.controls.minPolarAngle,
        maxPolarAngle: this.controls.maxPolarAngle,
        minAzimuthAngle: this.controls.minAzimuthAngle,
        maxAzimuthAngle: this.controls.maxAzimuthAngle,
        enablePan: this.controls.enablePan,
        panSpeed: this.controls.panSpeed
    };

    // Quitar todos los límites
    this.controls.minDistance = 0;
    this.controls.maxDistance = Infinity;
    this.controls.minPolarAngle = 0;
    this.controls.maxPolarAngle = Math.PI;
    this.controls.minAzimuthAngle = -Infinity;
    this.controls.maxAzimuthAngle = Infinity;

    // Habilitar paneo (desplazamiento con click central)
    this.controls.enablePan = true;
    this.controls.panSpeed = 1.0;

    // Habilitar todas las teclas de control
    this.controls.enableKeys = true;
    this.controls.keys = {
        LEFT: 37, // flecha izquierda
        UP: 38,   // flecha arriba
        RIGHT: 39, // flecha derecha
        BOTTOM: 40 // flecha abajo
    };

    // Añadir indicador visual de modo edición
    this.mostrarIndicadorModoEdicion();

    // Mostrar helpers de luces
    this.mostrarHelpersLuces();

    // Activar selección de objetos
    this.activarSeleccionObjetos();
}

/**
 * Desactiva el modo de edición y restaura los controles normales
 */
desactivarModoEdicion() {
    console.log("Modo edición desactivado");

    // Restaurar configuración original
    if (this.controlsConfigOriginal) {
        this.controls.minDistance = this.controlsConfigOriginal.minDistance;
        this.controls.maxDistance = this.controlsConfigOriginal.maxDistance;
        this.controls.minPolarAngle = this.controlsConfigOriginal.minPolarAngle;
        this.controls.maxPolarAngle = this.controlsConfigOriginal.maxPolarAngle;
        this.controls.minAzimuthAngle = this.controlsConfigOriginal.minAzimuthAngle;
        this.controls.maxAzimuthAngle = this.controlsConfigOriginal.maxAzimuthAngle;
        this.controls.enablePan = this.controlsConfigOriginal.enablePan;
        this.controls.panSpeed = this.controlsConfigOriginal.panSpeed;
    }

    // Remover indicador visual
    this.ocultarIndicadorModoEdicion();

    // Ocultar helpers de luces
    this.ocultarHelpersLuces();

    // Desactivar selección de objetos
    this.desactivarSeleccionObjetos();
}

/**
 * Muestra un indicador visual de que el modo edición está activo
 */
mostrarIndicadorModoEdicion() {
    // Crear un div para mostrar el modo edición
    if (!this.indicadorEdicion) {
        this.indicadorEdicion = document.createElement('div');
        this.indicadorEdicion.id = 'indicador-modo-edicion';
        this.indicadorEdicion.innerHTML = `
            <i class="fas fa-edit"></i> Modo Edición Activo
            <br>
            <span style="font-size: 12px;">
                Click izq: Rotar | Click central: Desplazar | Scroll: Zoom
            </span>
        `;
        this.indicadorEdicion.style.cssText = `
            position: absolute;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(255, 210, 0, 0.9);
            color: #0b0b5e;
            padding: 10px 20px;
            border-radius: 5px;
            font-weight: 500;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            text-align: center;
            font-family: 'Roboto', Arial, sans-serif;
        `;
        document.getElementById('visor-3d').appendChild(this.indicadorEdicion);
    }
}

/**
 * Oculta el indicador visual del modo edición
 */
ocultarIndicadorModoEdicion() {
    if (this.indicadorEdicion) {
        this.indicadorEdicion.remove();
        this.indicadorEdicion = null;
    }
}

/**
     * Muestra los helpers (gizmos) de las luces
     */
mostrarHelpersLuces() {
    this.lightHelpers = [];
    this.lightContainers = new Map(); // Para almacenar contenedores de luces direccionales
    this.lightLabels = new Map(); // Para almacenar las etiquetas de coordenadas

    // Recorrer todas las luces en la escena
    this.scene.traverse((objeto) => {
        if (objeto.isLight) {
            let helper;

            // Crear etiqueta de coordenadas para esta luz
            this.crearEtiquetaCoordenadas(objeto);

            if (objeto.isDirectionalLight) {
                // Para luces direccionales, crear un contenedor para la posición
                const container = new THREE.Group();
                container.position.copy(objeto.position);
                container.userData.luzDireccional = objeto;
                container.userData.esContenedorLuz = true;
                container.userData.tipoContenedor = 'posicion';

                // Crear una esfera visual para la posición de la luz
                const geometry = new THREE.SphereGeometry(50, 16, 16);
                const material = new THREE.MeshBasicMaterial({
                    color: 0xffff00,
                    wireframe: true,
                    opacity: 0.5,
                    transparent: true
                });
                const sphere = new THREE.Mesh(geometry, material);
                container.add(sphere);

                // Crear un contenedor para el target
                const targetContainer = new THREE.Group();
                targetContainer.position.copy(objeto.target.position);
                targetContainer.userData.luzDireccional = objeto;
                targetContainer.userData.esContenedorLuz = true;
                targetContainer.userData.tipoContenedor = 'target';

                // Crear un cubo visual para el target
                const targetGeometry = new THREE.BoxGeometry(40, 40, 40);
                const targetMaterial = new THREE.MeshBasicMaterial({
                    color: 0xff0000,
                    wireframe: true,
                    opacity: 0.5,
                    transparent: true
                });
                const targetCube = new THREE.Mesh(targetGeometry, targetMaterial);
                targetContainer.add(targetCube);

                // Crear una línea que conecte la luz con el target
                const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(),
                    new THREE.Vector3()
                ]);
                const lineMaterial = new THREE.LineBasicMaterial({
                    color: 0xffff00,
                    opacity: 0.5,
                    transparent: true
                });
                const connectionLine = new THREE.Line(lineGeometry, lineMaterial);
                connectionLine.userData.esLinea = true;

                // Añadir el helper direccional
                helper = new THREE.DirectionalLightHelper(objeto, 100);
                helper.userData.tipoLuz = 'Direccional';

                // Asegurarse de que el target esté en la escena
                if (!objeto.target.parent) {
                    this.scene.add(objeto.target);
                }

                this.scene.add(container);
                this.scene.add(targetContainer);
                this.scene.add(connectionLine);
                // Guardar referencias
                this.lightContainers.set(objeto, {
                    positionContainer: container,
                    targetContainer: targetContainer,
                    connectionLine: connectionLine,
                    helper: helper
                });

                // Función para actualizar la luz y la línea de conexión
                const actualizarLuzDireccional = () => {
                    // Actualizar posición de la luz
                    objeto.position.copy(container.position);

                    // Actualizar posición del target
                    objeto.target.position.copy(targetContainer.position);

                    // IMPORTANTE: Actualizar la matriz del target para que Three.js reconozca el cambio
                    objeto.target.updateMatrixWorld(true);

                    // Actualizar la línea de conexión
                    const positions = connectionLine.geometry.attributes.position;
                    positions.setXYZ(0, container.position.x, container.position.y, container.position.z);
                    positions.setXYZ(1, targetContainer.position.x, targetContainer.position.y, targetContainer.position.z);
                    positions.needsUpdate = true;

                    // Forzar la actualización del helper destruyéndolo y recreándolo
                    if (helper.parent) {
                        helper.parent.remove(helper);
                    }
                    helper.dispose();

                    // Recrear el helper
                    helper = new THREE.DirectionalLightHelper(objeto, 100);
                    helper.userData.tipoLuz = 'Direccional';
                    helper.userData.luz = objeto;
                    helper.userData.esHelper = true;
                    this.scene.add(helper);

                    // Actualizar la referencia en el mapa
                    const containers = this.lightContainers.get(objeto);
                    if (containers) {
                        containers.helper = helper;

                        // Actualizar también en el array de helpers
                        const helperIndex = this.lightHelpers.findIndex(h => h.userData.luz === objeto);
                        if (helperIndex !== -1) {
                            this.lightHelpers[helperIndex] = helper;
                        }
                    }
                };

                // Asignar la función de actualización a ambos contenedores
                container.userData.actualizarLuz = actualizarLuzDireccional;
                targetContainer.userData.actualizarLuz = actualizarLuzDireccional;

                // Añadir función adicional para actualizar etiquetas
                container.userData.actualizarEtiqueta = () => {
                    this.actualizarEtiquetaCoordenadas(luz);
                };
                targetContainer.userData.actualizarEtiqueta = () => {
                    this.actualizarEtiquetaCoordenadas(luz);
                };

            } else if (objeto.isPointLight) {
                helper = new THREE.PointLightHelper(objeto, 50);
                helper.userData.tipoLuz = 'Puntual';
            } else if (objeto.isSpotLight) {
                helper = new THREE.SpotLightHelper(objeto);
                helper.userData.tipoLuz = 'Foco';
            } else if (objeto.isHemisphereLight) {
                helper = new THREE.HemisphereLightHelper(objeto, 100);
                helper.userData.tipoLuz = 'Hemisférica';
            }

            if (helper) {
                helper.userData.luz = objeto;
                helper.userData.esHelper = true;
                this.scene.add(helper);
                this.lightHelpers.push(helper);
            }
        }
    });

    console.log(`Se crearon ${this.lightHelpers.length} helpers de luces`);
}

/**
 * Oculta los helpers de las luces
 */
ocultarHelpersLuces() {
    if (this.lightHelpers) {
        this.lightHelpers.forEach(helper => {
            this.scene.remove(helper);
            if (helper.dispose) helper.dispose();
        });
        this.lightHelpers = [];
    }

    // Limpiar contenedores de luces direccionales
    if (this.lightContainers) {
        this.lightContainers.forEach((containers, luz) => {
            if (containers.positionContainer) {
                this.scene.remove(containers.positionContainer);
            }
            if (containers.targetContainer) {
                this.scene.remove(containers.targetContainer);
            }
            if (containers.connectionLine) {
                this.scene.remove(containers.connectionLine);
            }
        });
        this.lightContainers.clear();
    }

    // Limpiar etiquetas de coordenadas
    if (this.lightLabels) {
        this.lightLabels.forEach((label) => {
            if (label && label.parentElement) {
                label.remove();
            }
        });
        this.lightLabels.clear();
    }
}

/**
 * Activa la selección de objetos y el control de transformación
 */
activarSeleccionObjetos() {
    // Crear el TransformControls si no existe
    if (!this.transformControls) {
        this.transformControls = new THREE.TransformControls(this.camera, this.renderer.domElement);
        this.transformControls.addEventListener('change', () => this.render());

        // Desactivar los controles de órbita mientras se usa el gizmo
        this.transformControls.addEventListener('dragging-changed', (event) => {
            this.controls.enabled = !event.value;
        });
    }

    // Añadir los controles a la escena
    this.scene.add(this.transformControls);

    // Crear raycaster para detección de clicks
    if (!this.raycaster) {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
    }

    // Añadir event listeners
    this.renderer.domElement.addEventListener('click', this.onClickEdicion);
    document.addEventListener('keydown', this.onKeyDownEdicion);

    // Mostrar panel de propiedades
    this.mostrarPanelPropiedades();
}

/**
 * Desactiva la selección de objetos
 */
desactivarSeleccionObjetos() {
    // Remover TransformControls
    if (this.transformControls) {
        this.transformControls.detach();
        this.scene.remove(this.transformControls);
    }

    // Limpiar interval de actualización
    if (this.updateInterval) {
        clearInterval(this.updateInterval);
        this.updateInterval = null;
    }

    // Remover event listeners
    this.renderer.domElement.removeEventListener('click', this.onClickEdicion);
    document.removeEventListener('keydown', this.onKeyDownEdicion);

    // Ocultar panel de propiedades
    this.ocultarPanelPropiedades();

    // Limpiar selección
    this.objetoSeleccionado = null;
}

/**
 * Maneja clicks en modo edición
 */
onClickEdicion = (event) => {
    // Calcular posición del mouse normalizada
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Raycast
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Buscar objetos que sean helpers de luz, contenedores o las propias luces
    const objetosSeleccionables = [];
    this.scene.traverse((objeto) => {
        if (objeto.userData.esHelper || objeto.isLight || objeto.userData.esContenedorLuz) {
            objetosSeleccionables.push(objeto);
        }
    });

    const intersecciones = this.raycaster.intersectObjects(objetosSeleccionables, true);

    if (intersecciones.length > 0) {
        let objetoSeleccionado = intersecciones[0].object;

        // Si es un helper o contenedor, obtener la luz asociada
        while (objetoSeleccionado.parent && !objetoSeleccionado.userData.luz && !objetoSeleccionado.isLight && !objetoSeleccionado.userData.esContenedorLuz) {
            objetoSeleccionado = objetoSeleccionado.parent;
        }

        // Manejar contenedores de luz direccional
        if (objetoSeleccionado.userData.esContenedorLuz) {
            const luz = objetoSeleccionado.userData.luzDireccional;
            const tipoContenedor = objetoSeleccionado.userData.tipoContenedor;
            if (luz) {
                this.seleccionarLuz(luz, tipoContenedor);
            }
        } else {
            const luz = objetoSeleccionado.userData.luz || objetoSeleccionado;

            if (luz && luz.isLight) {
                this.seleccionarLuz(luz);
            }
        }
    } else {
        // Deseleccionar si se hace click en el vacío
        this.transformControls.detach();
        this.objetoSeleccionado = null;
        this.actualizarPanelPropiedades(null);
    }
}

/**
 * Maneja teclas en modo edición
 */
onKeyDownEdicion = (event) => {
    if (!this.transformControls.object) return;

    switch (event.key) {
        case 'q': // Cambiar a modo traslación
            this.transformControls.setMode('translate');
            break;
        case 'w': // Cambiar a modo rotación
            this.transformControls.setMode('rotate');
            break;
        case 'e': // Cambiar a modo escala
            this.transformControls.setMode('scale');
            break;
        case 'Delete': // Eliminar luz seleccionada
            if (this.objetoSeleccionado && confirm('¿Eliminar esta luz?')) {
                this.eliminarLuz(this.objetoSeleccionado);
            }
            break;
        case '+': // Aumentar tamaño del gizmo
            this.transformControls.setSize(this.transformControls.size + 0.1);
            break;
        case '-': // Reducir tamaño del gizmo
            this.transformControls.setSize(Math.max(0.1, this.transformControls.size - 0.1));
            break;
    }
}

/**
 * Selecciona una luz y muestra el gizmo
 */
seleccionarLuz(luz, tipoContenedor = 'posicion') {
    this.objetoSeleccionado = luz;

    // Si es una luz direccional, seleccionar el contenedor apropiado
    if (luz.isDirectionalLight && this.lightContainers.has(luz)) {
        const containers = this.lightContainers.get(luz);
        let containerToAttach;

        if (tipoContenedor === 'target' && containers.targetContainer) {
            containerToAttach = containers.targetContainer;
        } else if (containers.positionContainer) {
            containerToAttach = containers.positionContainer;
        }

        if (containerToAttach) {
            this.transformControls.attach(containerToAttach);

            // Configurar actualización continua
            if (!this.updateInterval) {
                this.updateInterval = setInterval(() => {
                    if (containerToAttach.userData.actualizarLuz) {
                        containerToAttach.userData.actualizarLuz();
                    }
                    if (containerToAttach.userData.actualizarEtiqueta) {
                        containerToAttach.userData.actualizarEtiqueta();
                    }
                }, 16); // 60 FPS
            }
        }
    } else {
        this.transformControls.attach(luz);
    }

    this.actualizarPanelPropiedades(luz);

    // Actualizar los helpers cuando se mueve la luz
    if (!luz.userData.updateHelper) {
        luz.userData.updateHelper = () => {
            this.lightHelpers.forEach(helper => {
                if (helper.userData.luz === luz) {
                    helper.update();
                }
            });
        };
    }
}

/**
 * Elimina una luz de la escena
 */
eliminarLuz(luz) {
    // Desconectar el TransformControls
    this.transformControls.detach();

    // Eliminar el helper asociado
    this.lightHelpers = this.lightHelpers.filter(helper => {
        if (helper.userData.luz === luz) {
            this.scene.remove(helper);
            if (helper.dispose) helper.dispose();
            return false;
        }
        return true;
    });

    // Si es una luz direccional, eliminar sus contenedores
    if (luz.isDirectionalLight && this.lightContainers.has(luz)) {
        const containers = this.lightContainers.get(luz);
        if (containers.positionContainer) {
            this.scene.remove(containers.positionContainer);
        }
        if (containers.targetContainer) {
            this.scene.remove(containers.targetContainer);
        }
        if (containers.connectionLine) {
            this.scene.remove(containers.connectionLine);
        }
        this.lightContainers.delete(luz);
    }

    // Eliminar la luz
    if (luz.parent) {
        luz.parent.remove(luz);
    }

    // Limpiar selección
    this.objetoSeleccionado = null;
    this.actualizarPanelPropiedades(null);
}

/**
 * Muestra el panel de propiedades de edición
 */
mostrarPanelPropiedades() {
    if (!this.panelPropiedades) {
        this.panelPropiedades = document.createElement('div');
        this.panelPropiedades.id = 'panel-propiedades-edicion';
        this.panelPropiedades.innerHTML = `
            <h3>Propiedades</h3>
            <div id="propiedades-contenido">
                <p style="color: #999;">Selecciona una luz para editar</p>
            </div>
            <div id="controles-edicion">
                <h4>Controles:</h4>
                <ul style="list-style: none; padding: 0; font-size: 12px;">
                    <li><strong>Q:</strong> Mover</li>
                    <li><strong>W:</strong> Rotar</li>
                    <li><strong>E:</strong> Escalar</li>
                    <li><strong>Supr:</strong> Eliminar</li>
                    <li><strong>+/-:</strong> Tamaño gizmo</li>
                </ul>
            </div>
        `;
        this.panelPropiedades.style.cssText = `
            position: absolute;
            top: 60px;
            right: 20px;
            width: 250px;
            background-color: rgba(255, 255, 255, 0.95);
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 15px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            z-index: 999;
            font-family: 'Roboto', Arial, sans-serif;
        `;

        document.getElementById('visor-3d').appendChild(this.panelPropiedades);
    }

    this.panelPropiedades.style.display = 'block';
}

/**
 * Oculta el panel de propiedades
 */
ocultarPanelPropiedades() {
    if (this.panelPropiedades) {
        this.panelPropiedades.style.display = 'none';
    }
}

/**
 * Actualiza el panel de propiedades con la información de la luz seleccionada
 */
actualizarPanelPropiedades(luz) {
    if (!this.panelPropiedades) return;

    const contenido = document.getElementById('propiedades-contenido');

    if (!luz) {
        contenido.innerHTML = '<p style="color: #999;">Selecciona una luz para editar</p>';
        return;
    }

    let html = `
            <p><strong>Tipo:</strong> ${luz.userData.tipoLuz || luz.type}</p>
            <p><strong>Posición:</strong><br>
                X: ${luz.position.x.toFixed(0)}<br>
                Y: ${luz.position.y.toFixed(0)}<br>
                Z: ${luz.position.z.toFixed(0)}
            </p>
        `;

        // Si es una luz direccional, mostrar también la posición del target
        if (luz.isDirectionalLight && luz.target) {
            html += `
            <p><strong>Target:</strong><br>
                X: ${luz.target.position.x.toFixed(0)}<br>
                Y: ${luz.target.position.y.toFixed(0)}<br>
                Z: ${luz.target.position.z.toFixed(0)}
            </p>
            `;
        }

    // Propiedades específicas según el tipo de luz
    if (luz.intensity !== undefined) {
        html += `
            <p><strong>Intensidad:</strong></p>
            <input type="range" min="0" max="2" step="0.1" value="${luz.intensity}"
                onchange="window.configurador.cambiarPropiedadLuz('intensity', this.value)">
            <span>${luz.intensity.toFixed(1)}</span>
        `;
    }

    if (luz.color) {
        const colorHex = '#' + luz.color.getHexString();
        html += `
            <p><strong>Color:</strong></p>
            <input type="color" value="${colorHex}"
                onchange="window.configurador.cambiarPropiedadLuz('color', this.value)">
        `;
    }

    if (luz.distance !== undefined && luz.distance > 0) {
        html += `
            <p><strong>Distancia:</strong></p>
            <input type="range" min="0" max="5000" step="100" value="${luz.distance}"
                onchange="window.configurador.cambiarPropiedadLuz('distance', this.value)">
            <span>${luz.distance}</span>
        `;
    }

    contenido.innerHTML = html;
}

/**
 * Cambia una propiedad de la luz seleccionada
 */
cambiarPropiedadLuz(propiedad, valor) {
    if (!this.objetoSeleccionado) return;

    switch (propiedad) {
        case 'intensity':
            this.objetoSeleccionado.intensity = parseFloat(valor);
            break;
        case 'color':
            this.objetoSeleccionado.color.set(valor);
            break;
        case 'distance':
            this.objetoSeleccionado.distance = parseFloat(valor);
            break;
    }

    // Actualizar helpers
    if (this.objetoSeleccionado.userData.updateHelper) {
        this.objetoSeleccionado.userData.updateHelper();
    }

    // Actualizar panel
    this.actualizarPanelPropiedades(this.objetoSeleccionado);
}

/**
 * Crea una etiqueta HTML que muestra las coordenadas de una luz
 */
crearEtiquetaCoordenadas(luz) {
    const label = document.createElement('div');
    label.className = 'light-coordinate-label';
    label.style.cssText = `
        position: absolute;
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 6px 10px;
        border-radius: 4px;
        font-size: 11px;
        font-family: 'Roboto Mono', monospace;
        pointer-events: none;
        z-index: 1000;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.2);
        min-width: 120px;
        line-height: 1.4;
    `;

    // Identificar el tipo de luz
    let tipoLuz = '';
    if (luz.isDirectionalLight) tipoLuz = 'DIR';
    else if (luz.isPointLight) tipoLuz = 'POINT';
    else if (luz.isSpotLight) tipoLuz = 'SPOT';
    else if (luz.isHemisphereLight) tipoLuz = 'HEMI';
    else if (luz.isAmbientLight) tipoLuz = 'AMB';

    label.innerHTML = `
        <div style="font-weight: bold; color: #ffd200; margin-bottom: 3px;">${tipoLuz}</div>
        <div>X: <span style="color: #ff6b6b;">0</span></div>
        <div>Y: <span style="color: #4ecdc4;">0</span></div>
        <div>Z: <span style="color: #45b7d1;">0</span></div>
    `;

    document.getElementById('visor-3d').appendChild(label);
    this.lightLabels.set(luz, label);

    // Actualizar posición inicial
    this.actualizarEtiquetaCoordenadas(luz);
}

/**
 * Actualiza la posición y contenido de la etiqueta de coordenadas
 */
actualizarEtiquetaCoordenadas(luz) {
    const label = this.lightLabels.get(luz);
    if (!label) return;

    // Obtener la posición de la luz en coordenadas del mundo
    const position = new THREE.Vector3();
    luz.getWorldPosition(position);

    // Proyectar la posición 3D a coordenadas 2D de la pantalla
    const vector = position.clone();
    vector.project(this.camera);

    const widthHalf = this.renderer.domElement.offsetWidth / 2;
    const heightHalf = this.renderer.domElement.offsetHeight / 2;

    const x = (vector.x * widthHalf) + widthHalf;
    const y = -(vector.y * heightHalf) + heightHalf;

    // Posicionar la etiqueta con un offset para que no tape el helper
    label.style.left = (x + 20) + 'px';
    label.style.top = (y - 30) + 'px';

    // Actualizar las coordenadas mostradas
    const xSpan = label.querySelector('div:nth-child(2) span');
    const ySpan = label.querySelector('div:nth-child(3) span');
    const zSpan = label.querySelector('div:nth-child(4) span');

    if (xSpan) xSpan.textContent = position.x.toFixed(0);
    if (ySpan) ySpan.textContent = position.y.toFixed(0);
    if (zSpan) zSpan.textContent = position.z.toFixed(0);

    // Si es una luz direccional, también crear/actualizar etiqueta para el target
    if (luz.isDirectionalLight && luz.target) {
        let targetLabel = this.lightLabels.get(luz.target);
        if (!targetLabel) {
            // Crear etiqueta para el target
            targetLabel = document.createElement('div');
            targetLabel.className = 'light-coordinate-label';
            targetLabel.style.cssText = label.style.cssText;
            targetLabel.style.backgroundColor = 'rgba(139, 0, 0, 0.8)'; // Rojo oscuro para diferenciar
            targetLabel.innerHTML = `
                <div style="font-weight: bold; color: #ffd200; margin-bottom: 3px;">TARGET</div>
                <div>X: <span style="color: #ff6b6b;">0</span></div>
                <div>Y: <span style="color: #4ecdc4;">0</span></div>
                <div>Z: <span style="color: #45b7d1;">0</span></div>
            `;
            document.getElementById('visor-3d').appendChild(targetLabel);
            this.lightLabels.set(luz.target, targetLabel);
        }

        // Actualizar posición del target
        const targetPos = luz.target.position.clone();
        targetPos.project(this.camera);

        const targetX = (targetPos.x * widthHalf) + widthHalf;
        const targetY = -(targetPos.y * heightHalf) + heightHalf;

        targetLabel.style.left = (targetX + 20) + 'px';
        targetLabel.style.top = (targetY - 30) + 'px';

        // Actualizar coordenadas del target
        const targetXSpan = targetLabel.querySelector('div:nth-child(2) span');
        const targetYSpan = targetLabel.querySelector('div:nth-child(3) span');
        const targetZSpan = targetLabel.querySelector('div:nth-child(4) span');

        if (targetXSpan) targetXSpan.textContent = luz.target.position.x.toFixed(0);
        if (targetYSpan) targetYSpan.textContent = luz.target.position.y.toFixed(0);
        if (targetZSpan) targetZSpan.textContent = luz.target.position.z.toFixed(0);
    }
}

/**
 * Actualiza todas las etiquetas de coordenadas
 */
actualizarTodasLasEtiquetas() {
    if (this.lightLabels) {
        this.lightLabels.forEach((label, luz) => {
            if (luz && !luz.isCamera) { // Evitar actualizar targets que son objetos normales
                this.actualizarEtiquetaCoordenadas(luz);
            }
        });
    }
}

/**
 * Renderiza la escena (necesario para los transform controls)
 */
render() {
    this.renderer.render(this.scene, this.camera);
}
}

// Exportamos la clase para usarla en main.js
window.Configurador = Configurador;

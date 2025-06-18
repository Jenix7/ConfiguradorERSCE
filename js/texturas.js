/**
 * Clase Texturas - Maneja la aplicación de materiales
 */
class Texturas {
    constructor() {
        this.texturas = {};
        this.cargadorTexturas = new THREE.TextureLoader();
    }

    obtenerMaterialConTextura(tipo) {
        console.log("=== OBTENIENDO MATERIAL PARA:", tipo, "===");

        // Para suelos - detectar automáticamente si es sustitución o decoración
        if (tipo.startsWith('goma-') || tipo.startsWith('granito-') || tipo.startsWith('silestone-') || tipo.startsWith('metalico-')) {
            console.log("Detectando tipo de suelo:", tipo);

            // Si es un suelo que claramente es de sustitución, usar esa ruta
            if (tipo === 'goma-azul' || tipo === 'goma-gris-claro' || tipo === 'goma-gris-oscuro' || tipo === 'goma-negro' ||
                tipo === 'granito-blanco-cristal' || tipo === 'granito-gris-perla' || tipo === 'granito-negro-sudafrica' || tipo === 'granito-rojo-africa' ||
                tipo === 'silestone-azul' || tipo === 'silestone-carbono' || tipo === 'silestone-negro-tebas') {
                console.log("Cargando suelo sustitución:", tipo);
                return this.cargarMaterialDesdeArchivos(`textures/suelos/sustitucion/${tipo}/`);
            } else {
                console.log("Cargando suelo decoración:", tipo);
                return this.cargarMaterialDesdeArchivos(`textures/suelos/decoracion/${tipo}/`);
            }
        }

        // Para las paredes de acero inoxidable (sustitución)
        if (tipo.startsWith('inox-')) {
            console.log("Cargando pared acero inoxidable:", tipo);
            return this.cargarMaterialDesdeArchivos(`textures/paredes/sustitucion/acero-inoxidable/${tipo}/`);
        }

        // Para skinplate (sustitución)
        if (tipo.startsWith('skinplate-')) {
            console.log("Cargando skinplate:", tipo);
            return this.cargarMaterialDesdeArchivos(`textures/paredes/sustitucion/skinplate/${tipo}/`);
        }

        // Para estratificado (sustitución)
        if (tipo.startsWith('estrat-')) {
            console.log("Cargando estratificado:", tipo);
            return this.cargarMaterialDesdeArchivos(`textures/paredes/sustitucion/estratificado/${tipo}/`);
        }

        // Para Ingravity estándar (decoración)
        if (tipo.startsWith('ing-std-')) {
            console.log("Cargando Ingravity estándar:", tipo);
            return this.cargarMaterialDesdeArchivos(`textures/paredes/decoracion/ingravity-estandar/${tipo}/`);
        }

        // Para Ingravity metálicos (decoración)
        if (tipo.startsWith('ing-met-')) {
            console.log("Cargando Ingravity metálicos:", tipo);
            return this.cargarMaterialDesdeArchivos(`textures/paredes/decoracion/ingravity-metalicos/${tipo}/`);
        }

        // Para melaminas (decoración)
        if (tipo.startsWith('mel-')) {
            console.log("Cargando melaminas:", tipo);
            return this.cargarMaterialDesdeArchivos(`textures/paredes/decoracion/melaminas/${tipo}/`);
        }

        // Para formica (decoración)
        if (tipo.startsWith('for-')) {
            console.log("Cargando formica:", tipo);
            return this.cargarMaterialDesdeArchivos(`textures/paredes/decoracion/formica/${tipo}/`);
        }

        // Para acero inoxidable decoración
        if (tipo.startsWith('inoxdec-')) {
            console.log("Cargando acero inoxidable decoración:", tipo);
            return this.cargarMaterialDesdeArchivos(`textures/paredes/decoracion/acero-inoxidable/${tipo}/`);
        }

        // Para las paredes, cargar desde la carpeta de texturas
        if (tipo === 'pared-texturizada') {
            console.log("Cargando pared texturizada");
            return this.cargarMaterialDesdeArchivos('textures/pared/');
        }

        console.log("Usando material por defecto para:", tipo);

        // Materiales existentes...
        switch (tipo) {
            // Aceros - ESTOS SÍ MANTIENEN EL REFLEJO (para la cabina)
            case 'acero-cepillado':
                return new THREE.MeshPhysicalMaterial({
                    color: 0xCCCCCC,
                    metalness: 0.8,
                    roughness: 0.4,
                    clearcoat: 0.2,
                    clearcoatRoughness: 0.3,
                    reflectivity: 0.8,
                    envMapIntensity: 1.2  // MANTENER
                });
            case 'acero-pulido':
                const materialMetalico = new THREE.MeshPhysicalMaterial({
                    color: 0xE0E0E0,
                    metalness: 1.0,
                    roughness: 0.1,
                    reflectivity: 1.0,
                    clearcoat: 0.5,
                    clearcoatRoughness: 0.1,
                    envMapIntensity: 1.5  // MANTENER
                });
                return materialMetalico;

            case 'acero':
                return new THREE.MeshPhysicalMaterial({
                    color: 0xCCCCCC,
                    metalness: 0.8,
                    roughness: 0.2,
                    clearcoat: 0.3,
                    clearcoatRoughness: 0.2,
                    reflectivity: 0.9,
                    envMapIntensity: 1.3  // MANTENER
                });

            // Maderas - SIN REFLEJO DEL ENVIRONMENT
            case 'madera-clara':
                return new THREE.MeshPhysicalMaterial({
                    color: 0xD2B48C,
                    metalness: 0.0,
                    roughness: 0.8,
                    clearcoat: 0.1,
                    clearcoatRoughness: 0.5,
                    reflectivity: 0.1,
                    envMapIntensity: 0  // CAMBIADO A 0
                });
            case 'madera-oscura':
                return new THREE.MeshPhysicalMaterial({
                    color: 0x8B4513,
                    metalness: 0.0,
                    roughness: 0.8,
                    clearcoat: 0.1,
                    clearcoatRoughness: 0.5,
                    reflectivity: 0.1,
                    envMapIntensity: 0  // CAMBIADO A 0
                });

            // Suelos - SIN REFLEJO DEL ENVIRONMENT
            case 'ceramica':
                return new THREE.MeshPhysicalMaterial({
                    color: 0xF5F5DC,
                    metalness: 0.0,
                    roughness: 0.7,
                    clearcoat: 0.3,
                    clearcoatRoughness: 0.1,
                    reflectivity: 0.4,
                    envMapIntensity: 0  // CAMBIADO A 0
                });
            case 'marmol':
                return new THREE.MeshPhysicalMaterial({
                    color: 0xE0E0E0,
                    metalness: 0.0,
                    roughness: 0.3,
                    clearcoat: 0.5,
                    clearcoatRoughness: 0.05,
                    reflectivity: 0.7,
                    envMapIntensity: 0  // CAMBIADO A 0
                });

            // Techos - SIN REFLEJO DEL ENVIRONMENT
            case 'blanco':
                return new THREE.MeshPhysicalMaterial({
                    color: 0xFFFFFF,
                    metalness: 0.0,
                    roughness: 0.5,
                    clearcoat: 0.0,
                    clearcoatRoughness: 0.5,
                    reflectivity: 0.2,
                    envMapIntensity: 0  // CAMBIADO A 0
                });

            // Color negro - MANTENER ALGO DE REFLEJO (para botoneras)
            case 'negro':
                return new THREE.MeshPhysicalMaterial({
                    color: 0x333333,
                    metalness: 0.5,
                    roughness: 0.5,
                    clearcoat: 0.2,
                    clearcoatRoughness: 0.2,
                    reflectivity: 0.5,
                    envMapIntensity: 0.8  // MANTENER
                });

            // Espejo - MANTENER REFLEJO
            case 'espejo':
                return new THREE.MeshPhysicalMaterial({
                    color: 0xFFFFFF,
                    metalness: 1.0,
                    roughness: 0.05,
                    clearcoat: 0.8,
                    clearcoatRoughness: 0.0,
                    reflectivity: 1.0,
                    envMapIntensity: 2.0  // MANTENER
                });

            // Por defecto - SIN REFLEJO
            default:
                return new THREE.MeshPhysicalMaterial({
                    color: 0xCCCCCC,
                    metalness: 0.2,
                    roughness: 0.5,
                    clearcoat: 0.1,
                    clearcoatRoughness: 0.3,
                    reflectivity: 0.3,
                    envMapIntensity: 0  // CAMBIADO A 0
                });
        }
    }

    cargarMaterialDesdeArchivos(rutaTexturas) {
        // Crear material base con un color neutro pero no gris puro
        const material = new THREE.MeshPhysicalMaterial({
            color: 0xF5F5F5, // Color muy claro pero no blanco puro
            metalness: 0.0,
            roughness: 0.5,
            envMapIntensity: 1.0,
            clearcoat: 0.0,
            clearcoatRoughness: 0.5,
            reflectivity: 0.5
        });

        // Flag para indicar que las texturas están cargando
        material._isLoading = true;
        material._loadedTextures = 0;
        material._totalTextures = 2; // Albedo y Normal

        // Función para marcar como completado
        const marcarTexturaCargada = () => {
            material._loadedTextures++;
            if (material._loadedTextures >= material._totalTextures) {
                material._isLoading = false;
                if (material._onLoadComplete) {
                    material._onLoadComplete();
                }
            }
        };

        // Primero cargamos el JSON
        fetch(rutaTexturas + 'material.json')
            .then(response => response.json())
            .then(materialData => {
                console.log(`Material JSON cargado para ${rutaTexturas}:`, materialData);

                // Si es un material tipo espejo, crear un Reflector real
                if (materialData.tipoEspejo === true) {
                    console.log("Creando material tipo espejo real");
                    // Retornar un marcador especial para que configurador.js lo maneje
                    material.userData = { esEspejo: true, materialData: materialData };
                    return;
                }

                if (materialData.metalness !== undefined) {
                    material.metalness = materialData.metalness;
                }
                if (materialData.roughness !== undefined) {
                    material.roughness = materialData.roughness;
                }
                if (materialData.envMapIntensity !== undefined) {
                    material.envMapIntensity = materialData.envMapIntensity;
                }
                if (materialData.clearcoat !== undefined) {
                    material.clearcoat = materialData.clearcoat;
                }
                if (materialData.clearcoatRoughness !== undefined) {
                    material.clearcoatRoughness = materialData.clearcoatRoughness;
                }
                if (materialData.reflectivity !== undefined) {
                    material.reflectivity = materialData.reflectivity;
                }
                if (material.metalness > 0.7 && materialData.clearcoat === undefined) {
                    material.clearcoat = 0.3;
                    material.clearcoatRoughness = 0.1;
                }

                // Configurar repeticiones si están definidas
                const repeatX = materialData.textureRepeat?.x || 2;
                const repeatY = materialData.textureRepeat?.y || 2;

                // Cargar texturas de forma síncrona usando Promise.all
                const promesaAlbedo = new Promise((resolve, reject) => {
                    this.cargadorTexturas.load(
                        rutaTexturas + 'Albedo.png',
                        (textura) => {
                            textura.wrapS = THREE.RepeatWrapping;
                            textura.wrapT = THREE.RepeatWrapping;
                            textura.repeat.set(repeatX, repeatY);
                            resolve(textura);
                        },
                        undefined,
                        reject
                    );
                });

                const promesaNormal = new Promise((resolve, reject) => {
                    this.cargadorTexturas.load(
                        rutaTexturas + 'Normal.png',
                        (textura) => {
                            textura.wrapS = THREE.RepeatWrapping;
                            textura.wrapT = THREE.RepeatWrapping;
                            textura.repeat.set(repeatX, repeatY);
                            resolve(textura);
                        },
                        undefined,
                        reject
                    );
                });

                // Aplicar texturas cuando ambas estén listas
                Promise.all([promesaAlbedo, promesaNormal])
                    .then(([albedo, normal]) => {
                        material.map = albedo;
                        material.normalMap = normal;

                        const normalIntensity = materialData.normalIntensity !== undefined ? materialData.normalIntensity : 1.0;
                        material.normalScale = new THREE.Vector2(normalIntensity, normalIntensity);

                        material.needsUpdate = true;
                        marcarTexturaCargada();
                        marcarTexturaCargada(); // Marcar ambas como cargadas
                    })
                    .catch(error => {
                        console.warn(`Error cargando texturas para ${rutaTexturas}:`, error);
                        marcarTexturaCargada();
                        marcarTexturaCargada();
                    });

                material.needsUpdate = true;
            })
            .catch(error => {
                console.log('No se encontró material.json, usando valores por defecto');

                // Cargar con valores por defecto usando el mismo sistema
                const promesaAlbedo = new Promise((resolve, reject) => {
                    this.cargadorTexturas.load(
                        rutaTexturas + 'Albedo.png',
                        (textura) => {
                            textura.wrapS = THREE.RepeatWrapping;
                            textura.wrapT = THREE.RepeatWrapping;
                            textura.repeat.set(2, 2);
                            resolve(textura);
                        },
                        undefined,
                        reject
                    );
                });

                const promesaNormal = new Promise((resolve, reject) => {
                    this.cargadorTexturas.load(
                        rutaTexturas + 'Normal.png',
                        (textura) => {
                            textura.wrapS = THREE.RepeatWrapping;
                            textura.wrapT = THREE.RepeatWrapping;
                            textura.repeat.set(2, 2);
                            resolve(textura);
                        },
                        undefined,
                        reject
                    );
                });

                Promise.all([promesaAlbedo, promesaNormal])
                    .then(([albedo, normal]) => {
                        material.map = albedo;
                        material.normalMap = normal;
                        material.normalScale = new THREE.Vector2(1, 1);
                        material.needsUpdate = true;
                        marcarTexturaCargada();
                        marcarTexturaCargada();
                    })
                    .catch(error => {
                        console.warn(`Error cargando texturas por defecto para ${rutaTexturas}:`, error);
                        marcarTexturaCargada();
                        marcarTexturaCargada();
                    });
            });

        return material;
    }
}

// Exportamos la clase para usarla en configurador.js
window.Texturas = Texturas;

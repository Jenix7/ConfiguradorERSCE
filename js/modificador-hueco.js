/**
 * ModificadorHueco - Solución inteligente para modificar TODOS los vértices del hueco y marco
 * Detecta automáticamente si un vértice es izquierdo, central o derecho
 */
class ModificadorHueco {
    constructor() {
        // Configuración para cada modelo que debemos modificar
        this.modelosAAdaptar = [
            {
                nombre: "escenario_pared_main",
                toleranciaZonaCentral: 50,
                encontrado: false,
                modelos: [],
                centroXGlobal: null
            },
            {
                nombre: "marco_cabina",
                toleranciaZonaCentral: 100,
                encontrado: false,
                modelos: [],
                centroXGlobal: null
            },
            {
                nombre: "escenario_perfileria_main",
                toleranciaZonaCentral: 50,  // Misma tolerancia que la pared principal
                encontrado: false,
                modelos: [],
                centroXGlobal: null
            },
            {
                nombre: "botonera_exterior",
                // Caso especial: este modelo se mueve completo hacia la derecha
                moverComoUnidad: true,
                direccion: "derecha", // Se mueve con los elementos de la derecha
                encontrado: false,
                modelos: [],
                posicionOriginal: null // Guardaremos la posición original del objeto
            }
        ];

        // Ancho base del ascensor
        this.anchoBase = 1100;
    }

    /**
     * Modifica los vértices de todos los modelos adaptables según el ancho del ascensor
     */
    modificarHuecos(configurador, nuevoAncho) {
        console.log(`Iniciando modificación inteligente de huecos para ancho ${nuevoAncho}px`);

        try {
            // 1. Buscar los modelos si aún no se han encontrado
            let busquedaRealizada = false;
            this.modelosAAdaptar.forEach(modeloConfig => {
                if (modeloConfig.modelos.length === 0) {
                    if (!busquedaRealizada) {
                        this.buscarModelos(configurador);
                        busquedaRealizada = true;
                    }
                }
            });

            // 2. Para cada modelo encontrado, procesar según su tipo
            this.modelosAAdaptar.forEach(modeloConfig => {
                if (modeloConfig.modelos.length > 0) {
                    // Caso especial: modelos que se mueven como unidad
                    if (modeloConfig.moverComoUnidad) {
                        this.procesarModeloComoUnidad(modeloConfig, nuevoAncho);
                    } else {
                        // Caso normal: modificar vértices individualmente
                        this.procesarModeloNormal(modeloConfig, nuevoAncho);
                    }
                }
            });

            return true;
        } catch (error) {
            console.error("Error al modificar los huecos:", error);
            return false;
        }
    }

    /**
     * Procesa modelos que deben moverse como una unidad completa
     */
    procesarModeloComoUnidad(modeloConfig, nuevoAncho) {
        console.log(`Procesando ${modeloConfig.nombre} como unidad (mover hacia ${modeloConfig.direccion})`);

        // Calcular el desplazamiento
        const diferenciaAncho = nuevoAncho - this.anchoBase;
        const desplazamiento = diferenciaAncho / 2;

        modeloConfig.modelos.forEach(meshInfo => {
            // Guardar posición original si no se ha guardado
            if (!meshInfo.posicionOriginal) {
                meshInfo.posicionOriginal = {
                    x: meshInfo.mesh.position.x,
                    y: meshInfo.mesh.position.y,
                    z: meshInfo.mesh.position.z
                };
                console.log(`Posición original de ${meshInfo.nombre}: x=${meshInfo.posicionOriginal.x}`);
            }

            // Restaurar a posición original primero
            meshInfo.mesh.position.x = meshInfo.posicionOriginal.x;

            // Aplicar desplazamiento según la dirección
            if (modeloConfig.direccion === "derecha") {
                meshInfo.mesh.position.x = meshInfo.posicionOriginal.x + desplazamiento;
            } else if (modeloConfig.direccion === "izquierda") {
                meshInfo.mesh.position.x = meshInfo.posicionOriginal.x - desplazamiento;
            }

            console.log(`${meshInfo.nombre} movido a x=${meshInfo.mesh.position.x} (desplazamiento: ${desplazamiento})`);
        });
    }

    /**
     * Procesa modelos de forma normal (modificando vértices)
     */
    procesarModeloNormal(modeloConfig, nuevoAncho) {
        // Calcular el centro global si no se ha hecho
        if (modeloConfig.centroXGlobal === null) {
            this.calcularCentroGlobal(modeloConfig);
        }

        // Procesar cada mesh del modelo
        modeloConfig.modelos.forEach(meshInfo => {
            // Guardar vértices originales si no se han guardado
            if (!meshInfo.verticesOriginales) {
                this.analizarYGuardarVertices(meshInfo, modeloConfig);
            }

            // Restaurar los vértices a su posición original
            this.restaurarVerticesOriginales(meshInfo);

            // Aplicar la modificación a los vértices
            this.aplicarModificacionInteligente(meshInfo, modeloConfig, nuevoAncho);
        });
    }

    /**
     * Busca todos los modelos adaptables en la escena
     */
    buscarModelos(configurador) {
        console.log("Buscando modelos adaptables y todos sus meshes...");

        if (!configurador || !configurador.modelosAdicionales || configurador.modelosAdicionales.length === 0) {
            console.error("Configurador no disponible o sin modelos adicionales");
            return;
        }

        configurador.modelosAdicionales.forEach(modeloAdicional => {
            let nombreCarpeta = "";
            if (modeloAdicional.userData && modeloAdicional.userData.carpeta) {
                nombreCarpeta = modeloAdicional.userData.carpeta;
            }

            // Buscar el modelo por nombre de carpeta
            this.modelosAAdaptar.forEach(modeloConfig => {
                if (nombreCarpeta && nombreCarpeta.includes(modeloConfig.nombre)) {
                    // Encontramos el modelo, ahora buscar TODOS sus meshes
                    modeloAdicional.traverse(objeto => {
                        if (objeto.isMesh && objeto.geometry) {
                            modeloConfig.modelos.push({
                                mesh: objeto,
                                nombre: objeto.name || `Mesh_${modeloConfig.modelos.length}`,
                                verticesOriginales: null,
                                posicionOriginal: null
                            });
                            console.log(`  - Encontrado mesh: ${objeto.name || 'Sin nombre'} en ${modeloConfig.nombre}`);
                        }
                    });

                    if (modeloConfig.modelos.length > 0) {
                        modeloConfig.encontrado = true;
                        console.log(`Modelo ${modeloConfig.nombre} encontrado con ${modeloConfig.modelos.length} meshes`);
                    }
                }
            });
        });

        // Resumen
        this.modelosAAdaptar.forEach(modeloConfig => {
            if (modeloConfig.encontrado) {
                console.log(`${modeloConfig.nombre}: ${modeloConfig.modelos.length} meshes encontrados`);
                if (modeloConfig.moverComoUnidad) {
                    console.log(`  -> Se moverá como unidad hacia ${modeloConfig.direccion}`);
                }
            } else {
                console.log(`${modeloConfig.nombre}: No encontrado`);
            }
        });
    }

    /**
     * Calcula el centro global considerando TODOS los meshes del modelo
     */
    calcularCentroGlobal(modeloConfig) {
        console.log(`Calculando centro global para ${modeloConfig.nombre}...`);

        let xMin = Infinity;
        let xMax = -Infinity;

        // Recorrer todos los meshes para encontrar los límites globales
        modeloConfig.modelos.forEach(meshInfo => {
            const positionAttribute = meshInfo.mesh.geometry.getAttribute('position');
            if (!positionAttribute) return;

            for (let i = 0; i < positionAttribute.count; i++) {
                const x = positionAttribute.getX(i);
                if (x < xMin) xMin = x;
                if (x > xMax) xMax = x;
            }
        });

        // Calcular el centro global
        modeloConfig.centroXGlobal = (xMin + xMax) / 2;
        console.log(`Centro X global de ${modeloConfig.nombre}: ${modeloConfig.centroXGlobal}`);
        console.log(`Rango X global: ${xMin} a ${xMax} (ancho total: ${xMax - xMin})`);
    }

    /**
     * Analiza la distribución de vértices y los guarda con su clasificación
     */
    analizarYGuardarVertices(meshInfo, modeloConfig) {
        console.log(`Analizando vértices de ${meshInfo.nombre}...`);

        const positionAttribute = meshInfo.mesh.geometry.getAttribute('position');
        if (!positionAttribute) {
            console.error(`No hay atributo de posición en ${meshInfo.nombre}`);
            return;
        }

        // Usar el centro global del modelo completo
        const centroX = modeloConfig.centroXGlobal;

        // Inicializar estructura para guardar vértices
        meshInfo.verticesOriginales = {
            izquierda: [],
            centro: [],
            derecha: [],
            total: positionAttribute.count
        };

        // Clasificar cada vértice
        for (let i = 0; i < positionAttribute.count; i++) {
            const x = positionAttribute.getX(i);
            const y = positionAttribute.getY(i);
            const z = positionAttribute.getZ(i);

            const vertice = {
                indice: i,
                x: x,
                y: y,
                z: z
            };

            // Clasificar el vértice basándose en su posición relativa al centro global
            const distanciaAlCentro = Math.abs(x - centroX);

            // Si está muy cerca del centro, es un vértice central
            if (distanciaAlCentro < modeloConfig.toleranciaZonaCentral) {
                meshInfo.verticesOriginales.centro.push(vertice);
            }
            // Si está a la izquierda del centro
            else if (x < centroX) {
                meshInfo.verticesOriginales.izquierda.push(vertice);
            }
            // Si está a la derecha del centro
            else {
                meshInfo.verticesOriginales.derecha.push(vertice);
            }
        }

        console.log(`Vértices clasificados en ${meshInfo.nombre}:`);
        console.log(`  - Izquierda: ${meshInfo.verticesOriginales.izquierda.length}`);
        console.log(`  - Centro: ${meshInfo.verticesOriginales.centro.length}`);
        console.log(`  - Derecha: ${meshInfo.verticesOriginales.derecha.length}`);
    }

    /**
     * Restaura los vértices a su posición original
     */
    restaurarVerticesOriginales(meshInfo) {
        if (!meshInfo.mesh || !meshInfo.verticesOriginales) {
            console.error(`No hay información de vértices originales para ${meshInfo.nombre}`);
            return;
        }

        const positionAttribute = meshInfo.mesh.geometry.getAttribute('position');
        if (!positionAttribute) return;

        // Restaurar todos los vértices
        ['izquierda', 'centro', 'derecha'].forEach(zona => {
            meshInfo.verticesOriginales[zona].forEach(vertice => {
                positionAttribute.setX(vertice.indice, vertice.x);
                positionAttribute.setY(vertice.indice, vertice.y);
                positionAttribute.setZ(vertice.indice, vertice.z);
            });
        });

        positionAttribute.needsUpdate = true;
    }

    /**
     * Aplica la modificación inteligente a todos los vértices
     */
    aplicarModificacionInteligente(meshInfo, modeloConfig, nuevoAncho) {
        if (!meshInfo.mesh || !meshInfo.verticesOriginales) {
            console.error(`No hay información para modificar vértices de ${meshInfo.nombre}`);
            return;
        }

        const positionAttribute = meshInfo.mesh.geometry.getAttribute('position');
        if (!positionAttribute) return;

        // Calcular el desplazamiento necesario
        const diferenciaAncho = nuevoAncho - this.anchoBase;
        const desplazamiento = diferenciaAncho / 2;

        // Modificar vértices izquierdos (se mueven hacia la izquierda)
        meshInfo.verticesOriginales.izquierda.forEach(vertice => {
            const nuevaX = vertice.x - desplazamiento;
            positionAttribute.setX(vertice.indice, nuevaX);
        });

        // Los vértices centrales NO se mueven

        // Modificar vértices derechos (se mueven hacia la derecha)
        meshInfo.verticesOriginales.derecha.forEach(vertice => {
            const nuevaX = vertice.x + desplazamiento;
            positionAttribute.setX(vertice.indice, nuevaX);
        });

        // Marcar como actualizado y recalcular normales
        positionAttribute.needsUpdate = true;
        meshInfo.mesh.geometry.computeVertexNormals();

        const totalModificados = meshInfo.verticesOriginales.izquierda.length +
                                meshInfo.verticesOriginales.derecha.length;

        console.log(`Modificados ${totalModificados} vértices en ${meshInfo.nombre}`);
    }
}

// Exportamos la clase para usarla en configurador.js
window.ModificadorHueco = ModificadorHueco;

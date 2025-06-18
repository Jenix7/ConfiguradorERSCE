/**
 * Clase para la visualización y selección de vértices del modelo
 */
class VisualizadorVertices {
    constructor(configurador) {
        this.configurador = configurador;
        this.vertices = [];
        this.marcadorVertice = null;
        this.verticeSeleccionado = null;
        this.modeloObj = null;
        this.modelosCargados = [];

        // Crear panel UI
        this.crearPanelUI();
    }

    /**
     * Crea el panel de UI para mostrar los vértices
     */
    crearPanelUI() {
        // Crear contenedor principal
        const panel = document.createElement('div');
        panel.id = 'panel-vertices';
        panel.style.position = 'absolute';
        panel.style.top = '120px';
        panel.style.left = '20px';
        panel.style.width = '300px';
        panel.style.maxHeight = '500px';
        panel.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        panel.style.border = '2px solid #0b0b5e';
        panel.style.borderRadius = '8px';
        panel.style.padding = '15px';
        panel.style.zIndex = '1000';
        panel.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
        panel.style.fontFamily = 'Roboto, Arial, sans-serif';
        panel.style.overflow = 'auto';

        // Título
        const titulo = document.createElement('h3');
        titulo.textContent = 'Visualizador de Vértices';
        titulo.style.margin = '0 0 15px 0';
        titulo.style.color = '#0b0b5e';
        titulo.style.borderBottom = '2px solid #ffd200';
        titulo.style.paddingBottom = '8px';
        panel.appendChild(titulo);

        // Selector de modelo
        const selectorContainer = document.createElement('div');
        selectorContainer.style.marginBottom = '15px';

        const selectorLabel = document.createElement('label');
        selectorLabel.textContent = 'Seleccionar modelo:';
        selectorLabel.style.display = 'block';
        selectorLabel.style.marginBottom = '5px';
        selectorLabel.style.fontWeight = '500';
        selectorContainer.appendChild(selectorLabel);

        const selector = document.createElement('select');
        selector.id = 'selector-modelo';
        selector.style.width = '100%';
        selector.style.padding = '8px';
        selector.style.borderRadius = '4px';
        selector.style.border = '1px solid #ddd';

        // Opción por defecto
        const opcionDefecto = document.createElement('option');
        opcionDefecto.value = "";
        opcionDefecto.textContent = "-- Seleccionar modelo --";
        selector.appendChild(opcionDefecto);

        // Evento de cambio de modelo
        selector.addEventListener('change', (e) => {
            const modeloId = e.target.value;
            if (modeloId) {
                this.seleccionarModelo(modeloId);
            } else {
                this.limpiarVertices();
                this.limpiarMarcador();
            }
        });

        selectorContainer.appendChild(selector);
        panel.appendChild(selectorContainer);

        // Instrucciones
        const instrucciones = document.createElement('p');
        instrucciones.textContent = 'Selecciona un vértice para visualizarlo en el espacio 3D.';
        instrucciones.style.marginBottom = '15px';
        instrucciones.style.fontSize = '13px';
        instrucciones.style.color = '#666';
        panel.appendChild(instrucciones);

        // Contenedor del listado
        const listaContainer = document.createElement('div');
        listaContainer.id = 'lista-vertices-container';
        listaContainer.style.maxHeight = '300px';
        listaContainer.style.overflowY = 'auto';
        listaContainer.style.border = '1px solid #eee';
        listaContainer.style.borderRadius = '4px';
        listaContainer.style.padding = '5px';
        panel.appendChild(listaContainer);

        // Lista de vértices
        const listaVertices = document.createElement('ul');
        listaVertices.id = 'lista-vertices';
        listaVertices.style.listStyle = 'none';
        listaVertices.style.padding = '0';
        listaVertices.style.margin = '0';
        listaContainer.appendChild(listaVertices);

        // Información del vértice seleccionado
        const infoVertice = document.createElement('div');
        infoVertice.id = 'info-vertice';
        infoVertice.style.marginTop = '15px';
        infoVertice.style.padding = '10px';
        infoVertice.style.backgroundColor = '#f5f7fa';
        infoVertice.style.borderRadius = '4px';
        infoVertice.style.fontSize = '13px';
        infoVertice.style.display = 'none';
        panel.appendChild(infoVertice);

        // Botones
        const botones = document.createElement('div');
        botones.style.marginTop = '15px';
        botones.style.display = 'flex';
        botones.style.justifyContent = 'space-between';
        botones.style.gap = '10px';

        // Botón cerrar
        const btnCerrar = document.createElement('button');
        btnCerrar.textContent = 'Cerrar';
        btnCerrar.style.padding = '8px 15px';
        btnCerrar.style.backgroundColor = '#f0f0f0';
        btnCerrar.style.border = 'none';
        btnCerrar.style.borderRadius = '4px';
        btnCerrar.style.cursor = 'pointer';
        btnCerrar.addEventListener('click', () => {
            this.ocultarPanel();
        });
        botones.appendChild(btnCerrar);

        // Botón exportar
        const btnExportar = document.createElement('button');
        btnExportar.textContent = 'Exportar Vértices';
        btnExportar.style.padding = '8px 15px';
        btnExportar.style.backgroundColor = '#ffd200';
        btnExportar.style.color = '#0b0b5e';
        btnExportar.style.border = 'none';
        btnExportar.style.borderRadius = '4px';
        btnExportar.style.cursor = 'pointer';
        btnExportar.style.fontWeight = '500';
        btnExportar.addEventListener('click', () => {
            this.exportarVertices();
        });
        botones.appendChild(btnExportar);

        // Botón refrescar
        const btnRefrescar = document.createElement('button');
        btnRefrescar.textContent = 'Refrescar Modelos';
        btnRefrescar.style.padding = '8px 15px';
        btnRefrescar.style.backgroundColor = '#0b0b5e';
        btnRefrescar.style.color = 'white';
        btnRefrescar.style.border = 'none';
        btnRefrescar.style.borderRadius = '4px';
        btnRefrescar.style.cursor = 'pointer';
        btnRefrescar.addEventListener('click', () => {
            this.cargarModelos();
        });
        botones.appendChild(btnRefrescar);

        panel.appendChild(botones);

        // Añadir a la página
        document.body.appendChild(panel);

        // Ocultar inicialmente
        this.ocultarPanel();
    }

    /**
     * Mostrar el panel
     */
    mostrarPanel() {
        document.getElementById('panel-vertices').style.display = 'block';
        // Cargar los modelos cuando se muestra el panel
        this.cargarModelos();
    }

    /**
     * Ocultar el panel
     */
    ocultarPanel() {
        document.getElementById('panel-vertices').style.display = 'none';
        this.limpiarMarcador();
    }

    /**
     * Carga la lista de modelos disponibles
     */
    cargarModelos() {
        console.log("Cargando modelos disponibles...");

        // Limpiar el array de modelos
        this.modelosCargados = [];

        // Obtener el selector
        const selector = document.getElementById('selector-modelo');

        // Limpiar opciones actuales (excepto la primera)
        while (selector.options.length > 1) {
            selector.remove(1);
        }

        // Buscar todos los modelos cargados
        if (this.configurador && this.configurador.modelosAdicionales) {
            this.configurador.modelosAdicionales.forEach((modelo, index) => {
                // Para cada modelo adicional, buscar sus meshes
                modelo.traverse((objeto) => {
                    if (objeto.isMesh && objeto.geometry) {
                        // Crear un ID único para este mesh
                        const modeloId = `modelo-${index}-${objeto.id}`;

                        // Generar un nombre descriptivo
                        let nombreModelo = objeto.name || `Modelo ${index+1}`;

                        // Intentar identificar a qué carpeta pertenece
                        this.configurador.carpetasModelos.forEach(carpeta => {
                            if (modelo.userData && modelo.userData.carpeta === carpeta) {
                                nombreModelo = `${carpeta} - ${nombreModelo}`;
                            }
                        });

                        // Guardar la referencia al modelo
                        this.modelosCargados.push({
                            id: modeloId,
                            nombre: nombreModelo,
                            objeto: objeto
                        });

                        // Añadir opción al selector
                        const opcion = document.createElement('option');
                        opcion.value = modeloId;
                        opcion.textContent = nombreModelo;
                        selector.appendChild(opcion);
                    }
                });
            });
        }

        console.log(`Se encontraron ${this.modelosCargados.length} modelos`);

        // Resetear el selector
        selector.selectedIndex = 0;

        // Limpiar vértices y marcador
        this.limpiarVertices();
        this.limpiarMarcador();
    }

    /**
     * Selecciona un modelo y extrae sus vértices
     */
    seleccionarModelo(modeloId) {
        // Buscar el modelo por su ID
        const modeloInfo = this.modelosCargados.find(m => m.id === modeloId);

        if (!modeloInfo) {
            console.error(`Modelo con ID ${modeloId} no encontrado`);
            return;
        }

        console.log(`Seleccionado modelo: ${modeloInfo.nombre}`);

        // Guardar referencia al modelo seleccionado
        this.modeloObj = modeloInfo.objeto;

        // Extraer los vértices
        this.extraerVertices();
    }

    /**
     * Extrae los vértices del modelo seleccionado
     */
    extraerVertices() {
        if (!this.modeloObj || !this.modeloObj.geometry) {
            console.error('No hay geometría disponible');
            return;
        }

        // Limpiar array de vértices
        this.vertices = [];

        // Obtener el atributo de posición
        const geometry = this.modeloObj.geometry;
        const positionAttribute = geometry.getAttribute('position');

        if (!positionAttribute) {
            console.error('El atributo de posición no está disponible');
            return;
        }

        // Extraer vértices
        for (let i = 0; i < positionAttribute.count; i++) {
            const index = i * 3;
            const vertex = {
                index: i,
                x: positionAttribute.getX(i),
                y: positionAttribute.getY(i),
                z: positionAttribute.getZ(i)
            };
            this.vertices.push(vertex);
        }

        console.log(`Extraídos ${this.vertices.length} vértices`);

        // Actualizar la lista en la UI
        this.actualizarListaVertices();
    }

    /**
     * Actualiza la lista de vértices en la UI
     */
    actualizarListaVertices() {
        const listaEl = document.getElementById('lista-vertices');
        listaEl.innerHTML = ''; // Limpiar lista

        if (this.vertices.length === 0) {
            const item = document.createElement('li');
            item.textContent = 'No hay vértices disponibles';
            item.style.padding = '8px 10px';
            item.style.fontStyle = 'italic';
            item.style.color = '#999';
            listaEl.appendChild(item);
            return;
        }

        // Crear elemento para cada vértice
        this.vertices.forEach((vertex, index) => {
            const item = document.createElement('li');
            item.textContent = `V${index + 1}: (${vertex.x.toFixed(2)}, ${vertex.y.toFixed(2)}, ${vertex.z.toFixed(2)})`;
            item.style.padding = '8px 10px';
            item.style.borderBottom = '1px solid #eee';
            item.style.cursor = 'pointer';
            item.style.transition = 'background-color 0.2s';

            // Clasificar el vértice como izquierdo o derecho (para el hueco)
            if (Math.abs(vertex.x + 566.97) < 5) {
                // Vértice izquierdo
                item.style.borderLeft = '3px solid red';
                item.title = 'Vértice izquierdo (LEFT)';
            } else if (Math.abs(vertex.x - 555.23) < 5) {
                // Vértice derecho
                item.style.borderLeft = '3px solid blue';
                item.title = 'Vértice derecho (RIGHT)';
            }

            // Evento de clic
            item.addEventListener('click', () => {
                this.seleccionarVertice(index);

                // Resaltar elemento seleccionado
                document.querySelectorAll('#lista-vertices li').forEach(el => {
                    el.style.backgroundColor = '';
                    el.style.fontWeight = '';
                });
                item.style.backgroundColor = 'rgba(11, 11, 94, 0.1)';
                item.style.fontWeight = '500';
            });

            // Evento hover
            item.addEventListener('mouseenter', () => {
                if (this.verticeSeleccionado !== index) {
                    item.style.backgroundColor = 'rgba(245, 247, 250, 0.8)';
                }
            });

            item.addEventListener('mouseleave', () => {
                if (this.verticeSeleccionado !== index) {
                    item.style.backgroundColor = '';
                }
            });

            listaEl.appendChild(item);
        });
    }

    /**
     * Limpia la lista de vértices
     */
    limpiarVertices() {
        this.vertices = [];
        const listaEl = document.getElementById('lista-vertices');
        if (listaEl) {
            listaEl.innerHTML = '';
        }

        const infoEl = document.getElementById('info-vertice');
        if (infoEl) {
            infoEl.style.display = 'none';
        }

        this.verticeSeleccionado = null;
    }

    /**
     * Selecciona un vértice y lo muestra en 3D
     */
    seleccionarVertice(index) {
        const vertice = this.vertices[index];
        this.verticeSeleccionado = index;

        // Actualizar info en el panel
        const infoEl = document.getElementById('info-vertice');
        infoEl.style.display = 'block';

        // Determinar la clasificación del vértice
        let clasificacion = '';

        if (Math.abs(vertice.x + 566.97) < 5) {
            clasificacion = '<strong style="color:red">LEFT</strong>';
        } else if (Math.abs(vertice.x - 555.23) < 5) {
            clasificacion = '<strong style="color:blue">RIGHT</strong>';
        } else {
            clasificacion = 'No clasificado';
        }

        infoEl.innerHTML = `
            <strong>Vértice ${index + 1}</strong><br>
            X: ${vertice.x.toFixed(4)}<br>
            Y: ${vertice.y.toFixed(4)}<br>
            Z: ${vertice.z.toFixed(4)}<br>
            Clasificación: ${clasificacion}
        `;

        // Crear o actualizar marcador 3D
        this.crearMarcadorVertice(vertice);

        // Centrar cámara en el vértice
        this.centrarCamaraEnVertice(vertice);
    }

    /**
 * Crea un marcador visual para el vértice seleccionado
 */
crearMarcadorVertice(vertice) {
    // Limpiar marcador anterior
    this.limpiarMarcador();

    // Crear geometría para el marcador (una esfera)
    const geometry = new THREE.SphereGeometry(20, 16, 16);

    // Material especial que ignora la profundidad y siempre se renderiza encima
    const material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.8,
        depthTest: false,  // Ignorar prueba de profundidad para ver a través de objetos
        depthWrite: false, // No escribir en el buffer de profundidad
        side: THREE.DoubleSide // Renderizar ambos lados de las caras
    });

    this.marcadorVertice = new THREE.Mesh(geometry, material);

    // Aplicar la posición del vértice
    if (this.modeloObj) {
        // Obtener la matriz mundial del modelo
        this.modeloObj.updateWorldMatrix(true, false);
        const matrixWorld = this.modeloObj.matrixWorld.clone();

        // Crear vector con la posición del vértice
        const verticePos = new THREE.Vector3(vertice.x, vertice.y, vertice.z);

        // Aplicar la transformación mundial
        verticePos.applyMatrix4(matrixWorld);

        // Posicionar el marcador
        this.marcadorVertice.position.copy(verticePos);
    } else {
        // Si no hay matriz mundial, usar posición directa
        this.marcadorVertice.position.set(vertice.x, vertice.y, vertice.z);
    }

    // Establecer una renderOrder alta para asegurar que se dibuje al final
    this.marcadorVertice.renderOrder = 999;

    // Añadir a la escena
    this.configurador.scene.add(this.marcadorVertice);

    // Crear líneas de ayuda para los ejes
    this.crearLineasEjes(this.marcadorVertice.position);
}
    /**
 * Crea líneas de ayuda para los ejes X, Y, Z desde el origen hasta el vértice
 */
crearLineasEjes(position) {
    const origen = new THREE.Vector3(0, 0, 0);

    // Material común para las líneas que ignora la profundidad
    const createLineMaterial = (color) => {
        return new THREE.LineBasicMaterial({
            color: color,
            depthTest: false,
            depthWrite: false,
            transparent: true,
            opacity: 0.7
        });
    };

    // Línea X (roja)
    const geometryX = new THREE.BufferGeometry().setFromPoints([
        origen,
        new THREE.Vector3(position.x, 0, 0)
    ]);
    const materialX = createLineMaterial(0xff0000);
    const lineX = new THREE.Line(geometryX, materialX);
    lineX.renderOrder = 998; // Alto pero menor que el marcador
    this.configurador.scene.add(lineX);

    // Línea Y (verde)
    const geometryY = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(position.x, 0, 0),
        new THREE.Vector3(position.x, position.y, 0)
    ]);
    const materialY = createLineMaterial(0x00ff00);
    const lineY = new THREE.Line(geometryY, materialY);
    lineY.renderOrder = 998;
    this.configurador.scene.add(lineY);

    // Línea Z (azul)
    const geometryZ = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(position.x, position.y, 0),
        position
    ]);
    const materialZ = createLineMaterial(0x0000ff);
    const lineZ = new THREE.Line(geometryZ, materialZ);
    lineZ.renderOrder = 998;
    this.configurador.scene.add(lineZ);

    // Guardar referencias para limpieza
    this.lineasEjes = [lineX, lineY, lineZ];
}

    /**
     * Limpia el marcador y líneas de ayuda
     */
    limpiarMarcador() {
        if (this.marcadorVertice) {
            this.configurador.scene.remove(this.marcadorVertice);
            this.marcadorVertice = null;
        }

        if (this.lineasEjes) {
            this.lineasEjes.forEach(linea => {
                this.configurador.scene.remove(linea);
            });
            this.lineasEjes = null;
        }
    }

    /**
     * Centra la cámara en el vértice seleccionado
     */
    centrarCamaraEnVertice(vertice) {
        // ... código existente ...
    }

    /**
     * Exporta todos los vértices del modelo actual a un archivo de texto
     */
    exportarVertices() {
        // Verificar que hay un modelo seleccionado
        if (!this.modeloObj || this.vertices.length === 0) {
            alert('Por favor, selecciona un modelo primero.');
            return;
        }

        // Obtener el nombre del modelo
        const nombreModelo = this.modeloObj.name || 'modelo_sin_nombre';

        // Crear el contenido del archivo
        let contenido = '========================================\n';
        contenido += `LISTA DE VÉRTICES\n`;
        contenido += '========================================\n\n';
        contenido += `Modelo: ${nombreModelo}\n`;
        contenido += `Total de vértices: ${this.vertices.length}\n`;
        contenido += `Fecha de exportación: ${new Date().toLocaleString()}\n`;
        contenido += '\n========================================\n\n';

        // Añadir los vértices
        contenido += 'COORDENADAS DE VÉRTICES:\n';
        contenido += '----------------------------------------\n';
        contenido += 'Índice\tX\t\tY\t\tZ\t\tClasificación\n';
        contenido += '----------------------------------------\n';

        this.vertices.forEach((vertice, index) => {
            // Determinar clasificación
            let clasificacion = '';
            if (Math.abs(vertice.x + 566.97) < 5) {
                clasificacion = 'LEFT';
            } else if (Math.abs(vertice.x - 555.23) < 5) {
                clasificacion = 'RIGHT';
            } else {
                clasificacion = '-';
            }

            // Formatear los números a 4 decimales
            const x = vertice.x.toFixed(4);
            const y = vertice.y.toFixed(4);
            const z = vertice.z.toFixed(4);

            contenido += `${index + 1}\t${x}\t${y}\t${z}\t${clasificacion}\n`;
        });

        contenido += '\n========================================\n';
        contenido += 'FIN DEL ARCHIVO\n';
        contenido += '========================================\n';

        // Crear el blob y descargar
        const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        // Crear elemento de descarga
        const link = document.createElement('a');
        link.href = url;
        link.download = `vertices_${nombreModelo}_${new Date().getTime()}.txt`;

        // Simular click para descargar
        document.body.appendChild(link);
        link.click();

        // Limpiar
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 0);
    }
}

// Exportamos la clase para usarla en main.js
window.VisualizadorVertices = VisualizadorVertices;

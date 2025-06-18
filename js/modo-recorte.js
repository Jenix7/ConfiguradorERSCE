/**
 * Clase ModoRecorte - Maneja el recorte del visor 3D
 */
class ModoRecorte {
    constructor(configurador) {
        this.configurador = configurador;
        this.activo = false;
        this.dimensionesOriginales = {
            width: '100%',
            height: '100%',
            top: 0,
            left: 0
        };
        this.dimensionesActuales = {
            width: window.innerWidth,
            height: window.innerHeight - 114, // Restando header y menu
            top: 0,
            left: 0
        };

        // Referencias a elementos
        this.visor3d = document.getElementById('visor-3d');
        this.controles = null;
        this.gizmoDimensiones = null;

        // Crear controles de recorte
        this.crearControlesRecorte();

        // Crear gizmo de dimensiones
        this.crearGizmoDimensiones();
    }

    /**
     * Activa el modo recorte
     */
    activar() {
        this.activo = true;

        // Mostrar controles
        if (this.controles) {
            this.controles.style.display = 'block';
        }

        // Hacer el visor redimensionable
        this.visor3d.style.position = 'absolute';
        this.visor3d.style.border = '2px solid #ffd200';
        this.visor3d.style.boxSizing = 'border-box';

        // Aplicar dimensiones actuales
        this.aplicarDimensiones();

        // Mostrar indicador
        this.mostrarIndicadorModoRecorte();

        // Actualizar gizmo
        this.actualizarGizmoDimensiones();

        console.log('Modo recorte activado');
    }

    /**
     * Desactiva el modo recorte
     */
    desactivar() {
        this.activo = false;

        // Ocultar controles
        if (this.controles) {
            this.controles.style.display = 'none';
        }

        // Restaurar visor
        this.visor3d.style.position = 'absolute';
        this.visor3d.style.width = '100%';
        this.visor3d.style.height = '100%';
        this.visor3d.style.top = '0';
        this.visor3d.style.left = '0';
        this.visor3d.style.border = 'none';

        // Ocultar indicador
        this.ocultarIndicadorModoRecorte();

        // Actualizar renderer
        this.configurador.onWindowResize();

        console.log('Modo recorte desactivado');
    }

    /**
     * Crea los controles de recorte (manejadores en los bordes)
     */
    crearControlesRecorte() {
        // Contenedor de controles
        this.controles = document.createElement('div');
        this.controles.id = 'controles-recorte';
        this.controles.style.display = 'none';

        // Estilos del contenedor
        const styles = document.createElement('style');
        styles.textContent = `
            #controles-recorte {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 50;
            }

            .manejador-recorte {
                position: absolute;
                background: #ffd200;
                pointer-events: auto;
                cursor: pointer;
                opacity: 0.8;
                transition: opacity 0.2s;
            }

            .manejador-recorte:hover {
                opacity: 1;
            }

            .manejador-recorte.arriba,
            .manejador-recorte.abajo {
                height: 8px;
                width: 100%;
                cursor: ns-resize;
            }

            .manejador-recorte.izquierda,
            .manejador-recorte.derecha {
                width: 8px;
                height: 100%;
                cursor: ew-resize;
            }

            .manejador-recorte.arriba { top: 0; }
            .manejador-recorte.abajo { bottom: 0; }
            .manejador-recorte.izquierda { left: 0; }
            .manejador-recorte.derecha { right: 0; }

            .manejador-recorte.esquina {
                width: 16px;
                height: 16px;
                background: #0b0b5e;
                border: 2px solid #ffd200;
                border-radius: 50%;
            }

            .manejador-recorte.esquina-sup-izq {
                top: -8px;
                left: -8px;
                cursor: nw-resize;
            }

            .manejador-recorte.esquina-sup-der {
                top: -8px;
                right: -8px;
                cursor: ne-resize;
            }

            .manejador-recorte.esquina-inf-izq {
                bottom: -8px;
                left: -8px;
                cursor: sw-resize;
            }

            .manejador-recorte.esquina-inf-der {
                bottom: -8px;
                right: -8px;
                cursor: se-resize;
            }
        `;
        document.head.appendChild(styles);

        // Crear manejadores
        const posiciones = ['arriba', 'abajo', 'izquierda', 'derecha',
                          'esquina-sup-izq', 'esquina-sup-der',
                          'esquina-inf-izq', 'esquina-inf-der'];

        posiciones.forEach(pos => {
            const manejador = document.createElement('div');
            manejador.className = `manejador-recorte ${pos}`;
            manejador.dataset.posicion = pos;

            // Eventos de arrastre
            manejador.addEventListener('mousedown', (e) => this.iniciarArrastre(e, pos));

            this.controles.appendChild(manejador);
        });

        // Añadir al visor
        document.getElementById('visor-3d').appendChild(this.controles);
    }

    /**
     * Inicia el arrastre para redimensionar
     */
    iniciarArrastre(e, posicion) {
        e.preventDefault();

        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = this.dimensionesActuales.width;
        const startHeight = this.dimensionesActuales.height;
        const startTop = this.dimensionesActuales.top;
        const startLeft = this.dimensionesActuales.left;

        const onMouseMove = (e) => {
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            let newWidth = startWidth;
            let newHeight = startHeight;
            let newTop = startTop;
            let newLeft = startLeft;

            // Calcular nuevas dimensiones según la posición del manejador
            switch(posicion) {
                case 'derecha':
                    newWidth = Math.max(400, startWidth + deltaX);
                    break;
                case 'izquierda':
                    newWidth = Math.max(400, startWidth - deltaX);
                    newLeft = startLeft + deltaX;
                    break;
                case 'abajo':
                    newHeight = Math.max(300, startHeight + deltaY);
                    break;
                case 'arriba':
                    newHeight = Math.max(300, startHeight - deltaY);
                    newTop = startTop + deltaY;
                    break;
                case 'esquina-inf-der':
                    newWidth = Math.max(400, startWidth + deltaX);
                    newHeight = Math.max(300, startHeight + deltaY);
                    break;
                case 'esquina-inf-izq':
                    newWidth = Math.max(400, startWidth - deltaX);
                    newHeight = Math.max(300, startHeight + deltaY);
                    newLeft = startLeft + deltaX;
                    break;
                case 'esquina-sup-der':
                    newWidth = Math.max(400, startWidth + deltaX);
                    newHeight = Math.max(300, startHeight - deltaY);
                    newTop = startTop + deltaY;
                    break;
                case 'esquina-sup-izq':
                    newWidth = Math.max(400, startWidth - deltaX);
                    newHeight = Math.max(300, startHeight - deltaY);
                    newLeft = startLeft + deltaX;
                    newTop = startTop + deltaY;
                    break;
            }

            // Limitar a los bordes de la ventana
            const maxWidth = window.innerWidth - newLeft;
            const maxHeight = window.innerHeight - 114 - newTop;

            newWidth = Math.min(newWidth, maxWidth);
            newHeight = Math.min(newHeight, maxHeight);
            newLeft = Math.max(0, newLeft);
            newTop = Math.max(0, newTop);

            // Actualizar dimensiones
            this.dimensionesActuales = {
                width: newWidth,
                height: newHeight,
                top: newTop,
                left: newLeft
            };

            this.aplicarDimensiones();
            this.actualizarGizmoDimensiones();
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    /**
     * Aplica las dimensiones actuales al visor
     */
    aplicarDimensiones() {
        this.visor3d.style.width = this.dimensionesActuales.width + 'px';
        this.visor3d.style.height = this.dimensionesActuales.height + 'px';
        this.visor3d.style.top = this.dimensionesActuales.top + 'px';
        this.visor3d.style.left = this.dimensionesActuales.left + 'px';

        // Actualizar el renderer
        if (this.configurador && this.configurador.renderer) {
            this.configurador.renderer.setSize(
                this.dimensionesActuales.width,
                this.dimensionesActuales.height
            );

            // Actualizar aspecto de la cámara
            if (this.configurador.camera) {
                this.configurador.camera.aspect = this.dimensionesActuales.width / this.dimensionesActuales.height;
                this.configurador.camera.updateProjectionMatrix();
            }
        }
    }

    /**
     * Crea el gizmo que muestra las dimensiones de la ventana
     */
    crearGizmoDimensiones() {
        // Crear el contenedor del gizmo
        const gizmo = document.createElement('div');
        gizmo.id = 'gizmo-dimensiones-ventana';
        gizmo.innerHTML = `
            <div class="gizmo-header">
                <i class="fas fa-crop-alt"></i> Ventana
            </div>
            <div class="gizmo-coords">
                <div class="coord-item">
                    <span class="coord-label">Ancho:</span>
                    <span class="coord-value" id="ventana-width">100%</span>
                </div>
                <div class="coord-item">
                    <span class="coord-label">Alto:</span>
                    <span class="coord-value" id="ventana-height">100%</span>
                </div>
                <div class="coord-item">
                    <span class="coord-label">X:</span>
                    <span class="coord-value" id="ventana-x">0</span>
                </div>
                <div class="coord-item">
                    <span class="coord-label">Y:</span>
                    <span class="coord-value" id="ventana-y">0</span>
                </div>
            </div>
        `;

        // Estilos del gizmo
        gizmo.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 180px;
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
            display: none;
        `;

        // Añadir al visor 3D
        document.getElementById('visor-3d').appendChild(gizmo);

        // Guardar referencia
        this.gizmoDimensiones = gizmo;
    }

    /**
     * Actualiza el gizmo de dimensiones
     */
    actualizarGizmoDimensiones() {
        if (!this.gizmoDimensiones) return;

        // Mostrar/ocultar según el estado
        this.gizmoDimensiones.style.display = this.activo ? 'block' : 'none';

        if (this.activo) {
            document.getElementById('ventana-width').textContent =
                Math.round(this.dimensionesActuales.width) + 'px';
            document.getElementById('ventana-height').textContent =
                Math.round(this.dimensionesActuales.height) + 'px';
            document.getElementById('ventana-x').textContent =
                Math.round(this.dimensionesActuales.left) + 'px';
            document.getElementById('ventana-y').textContent =
                Math.round(this.dimensionesActuales.top) + 'px';
        }
    }

    /**
     * Muestra el indicador de modo recorte
     */
    mostrarIndicadorModoRecorte() {
        if (!this.indicadorRecorte) {
            this.indicadorRecorte = document.createElement('div');
            this.indicadorRecorte.id = 'indicador-modo-recorte';
            this.indicadorRecorte.innerHTML = `
                <i class="fas fa-crop-alt"></i> Modo Recorte Activo
                <br>
                <span style="font-size: 12px;">
                    Arrastra los bordes para redimensionar
                </span>
            `;
            this.indicadorRecorte.style.cssText = `
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
            document.getElementById('visor-3d').appendChild(this.indicadorRecorte);
        }
    }

    /**
     * Oculta el indicador de modo recorte
     */
    ocultarIndicadorModoRecorte() {
        if (this.indicadorRecorte) {
            this.indicadorRecorte.remove();
            this.indicadorRecorte = null;
        }
    }
}

// Exportar la clase
window.ModoRecorte = ModoRecorte;

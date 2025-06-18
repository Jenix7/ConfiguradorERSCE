/**
* Clase ExportadorPDF - Maneja la exportación de la configuración a PDF
*/
class ExportadorPDF {
    constructor() {
        // Importamos la biblioteca jsPDF desde CDN (debe estar incluida en el HTML)
        this.jsPDF = window.jspdf.jsPDF;

        // Colores corporativos
        this.colorPrimario = '#0b0b5e';   // Azul marino
        this.colorSecundario = '#ffd200'; // Amarillo
        this.colorTexto = '#333333';      // Gris oscuro
        this.colorFondo = '#f5f7fa';      // Gris claro
    }

    /**
     * Genera un PDF con la configuración del ascensor
     * @param {Object} configuracion - Objeto con la configuración del ascensor
     * @param {HTMLCanvasElement} canvas - Canvas del renderizador para capturar imagen
     */
    exportarPDF(configuracion, canvas) {
        // Verificamos que jsPDF esté disponible
        if (!this.jsPDF) {
            console.error("La biblioteca jsPDF no está disponible");
            alert("Error: No se puede generar el PDF. La biblioteca necesaria no está disponible.");
            return;
        }

        // Mostrar el popup de carga
        const loadingPopup = document.getElementById('pdf-loading-popup');
        if (loadingPopup) {
            loadingPopup.style.display = 'block';
        }

        // Usar setTimeout para permitir que el DOM se actualice antes de empezar el proceso pesado
        setTimeout(() => {
            try {

                // Crear una cámara temporal para el PDF (sin afectar la del usuario)
                const camaraTemp = new THREE.PerspectiveCamera(45, configurador.camera.aspect, 1, 50000);
                camaraTemp.position.set(0, 1450, 4050); // Posición específica para el PDF
                camaraTemp.lookAt(0, 1100, 0);

                // Crear un canvas temporal para renderizar con la cámara específica
                const canvasTemp = document.createElement('canvas');
                canvasTemp.width = configurador.renderer.domElement.width;
                canvasTemp.height = configurador.renderer.domElement.height;

                // Crear un renderer temporal con las mismas configuraciones
                const rendererTemp = new THREE.WebGLRenderer({
                    canvas: canvasTemp,
                    preserveDrawingBuffer: true,
                    antialias: true
                });
                rendererTemp.setSize(canvasTemp.width, canvasTemp.height);

                // Copiar TODAS las configuraciones del renderer principal
                rendererTemp.setClearColor(configurador.renderer.getClearColor());
                rendererTemp.toneMapping = configurador.renderer.toneMapping;
                rendererTemp.toneMappingExposure = configurador.renderer.toneMappingExposure;
                rendererTemp.outputEncoding = configurador.renderer.outputEncoding;
                rendererTemp.shadowMap.enabled = configurador.renderer.shadowMap.enabled;
                rendererTemp.shadowMap.type = configurador.renderer.shadowMap.type;
                rendererTemp.setPixelRatio(configurador.renderer.getPixelRatio());

                // Copiar la configuración de luces y entorno
                if (configurador.scene.environment) {
                    rendererTemp.environment = configurador.scene.environment;
                }

                // Renderizar la escena con la cámara temporal
                // Asegurar que la cámara temporal tenga el mismo aspect ratio
                camaraTemp.aspect = configurador.camera.aspect;
                camaraTemp.updateProjectionMatrix();
                rendererTemp.render(configurador.scene, camaraTemp);

                // Creamos un nuevo documento PDF
                const pdf = new this.jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });

                // Añadimos color de fondo
                pdf.setFillColor(255, 255, 255); // Fondo blanco para mejor impresión
                pdf.rect(0, 0, 210, 297, 'F');

                // Cabecera con color corporativo
                pdf.setFillColor(this.colorPrimario);
                pdf.rect(0, 0, 210, 30, 'F');

                // Logo en la cabecera
const logoUrl = 'img/ersce-logo-2.png';
pdf.addImage(logoUrl, 'PNG', 15, 8, 50.6, 15.4); // Aumentado 10% (de 46x14 a 50.6x15.4)

                // Fecha y título a la derecha
                const fecha = new Date().toLocaleDateString() + ', ' + new Date().toLocaleTimeString().substring(0, 5);
                pdf.setTextColor(255, 255, 255); // Texto blanco
                pdf.setFontSize(11);
                pdf.text(fecha, 195, 15, { align: 'right' });

                pdf.setFontSize(14);
                pdf.setFont('helvetica', 'bold');
                pdf.text(pdfTitle || 'OPCIONES ELEGIDAS CONFIGURADOR 3D', 195, 24, { align: 'right' });

                // Recortar el canvas con las dimensiones específicas
                const recorteAncho = 550;
                const recorteAlto = 839;
                const recorteX = 683;
                const recorteY = 0;

                // Crear un canvas temporal para el recorte
                const canvasRecortado = document.createElement('canvas');
                canvasRecortado.width = recorteAncho;
                canvasRecortado.height = recorteAlto;
                const ctxRecortado = canvasRecortado.getContext('2d');

                // Crear una imagen temporal del canvas original
                const imgTemp = new Image();
                imgTemp.onload = () => {
                    // Recortar la imagen
                    ctxRecortado.drawImage(imgTemp, recorteX, recorteY, recorteAncho, recorteAlto, 0, 0, recorteAncho, recorteAlto);

                    // Obtener los datos de la imagen recortada
                    const imgDataRecortada = canvasRecortado.toDataURL('image/jpeg', 0.9);

                    // Definir posiciones para la imagen única
                    const margenIzq = 10;
                    const margenSup = 40;
                    const anchoImagenPDF = 95;  // Mismo ancho que antes
                    const altoImagenPDF = anchoImagenPDF * recorteAlto / recorteAncho -7; // Proporción del recorte

                    // Añadir la imagen recortada
                    pdf.addImage(imgDataRecortada, 'JPEG', margenIzq, margenSup, anchoImagenPDF, altoImagenPDF);

                    // Añadir borde a la imagen
                    pdf.setDrawColor(180, 180, 180);
                    pdf.setLineWidth(0.5);
                    pdf.rect(margenIzq, margenSup, anchoImagenPDF, altoImagenPDF);

// Añadir la información de configuración en la columna derecha
this.agregarInfoColumnaDerechaPDF(pdf, configuracion, margenIzq + anchoImagenPDF + 15, margenSup);

// Usar la posición Y donde terminó el contenedor de opciones con menos margen
const posicionYImagenes = this.posicionYFinalOpciones + 5; // Reducido de 10 a 5mm

// Añadir las 3 imágenes adicionales de diferentes puntos de vista
// Usar todo el ancho disponible (190mm aproximadamente)
this.agregarImagenesAdicionalesPDF(pdf, configurador, margenIzq, posicionYImagenes, 190);

                    // Guardar el PDF después de procesar la imagen

                    // Limpiar recursos temporales
                    rendererTemp.dispose();


                    pdf.save('configuracion-ascensor.pdf');

                    // Ocultar el popup de carga
                    const loadingPopup = document.getElementById('pdf-loading-popup');
                    if (loadingPopup) {
                        loadingPopup.style.display = 'none';
                    }

                    return true;
                };

                // Cargar la imagen del canvas temporal en el elemento temporal
                imgTemp.src = canvasTemp.toDataURL('image/jpeg', 0.9);

                // Pie de página con texto informativo
                pdf.setDrawColor(this.colorSecundario);
                pdf.setLineWidth(0.8);
                pdf.line(10, 275, 200, 275);

                pdf.setFontSize(8);
                pdf.setTextColor(this.colorTexto);
                pdf.setFont('helvetica', 'italic');

                if (pdfBottomTexts && pdfBottomTexts.length > 0) {
                    let piedePaginaY = 282;
                    pdfBottomTexts.forEach(texto => {
                        pdf.text(texto, 105, piedePaginaY, { align: 'center' });
                        piedePaginaY += 4;
                    });
                } else {
                    pdf.text('Los colores visualizados pueden diferir de los reales según la configuración del monitor o las condiciones de impresión.', 105, 282, { align: 'center' });
                    pdf.text('En ciertos formatos o dimensiones, las texturas pueden no corresponder exactamente con la apariencia real.', 105, 286, { align: 'center' });
                }

                // Guardamos el PDF (se hace ahora dentro del callback de la imagen)
                return true;
            } catch (error) {
                console.error("Error al generar el PDF:", error);
                alert("Error al generar el PDF: " + error.message);

                // Ocultar el popup de carga en caso de error
                const loadingPopup = document.getElementById('pdf-loading-popup');
                if (loadingPopup) {
                    loadingPopup.style.display = 'none';
                }

                return false;
            }
        }, 100); // Pequeño delay para permitir que se muestre el popup
    }

    /**
     * Agrega la información de configuración al PDF, en formato columnar con contenedor
     */
    agregarInfoColumnaDerechaPDF(pdf, configuracion, x, y) {
        const startX = x;
        const startY = y;
        const lineHeight = 6.5; // Altura de línea
        const yes = window.yes || 'Sí';
        const no = window.no || 'No';

        // Dimensiones del contenedor
        const containerWidth = 210 - startX - 20; // Hasta el límite del PDF (210mm) menos margen de 10mm
        const containerPadding = 8;
        const sectionSpacing = 15; // Espaciado entre secciones

        let currentY = startY + containerPadding;

        // Crear contenedor principal con fondo sutil
        pdf.setFillColor(248, 249, 250); // Color de fondo muy sutil
        pdf.setDrawColor(220, 220, 220); // Color del borde
        pdf.setLineWidth(0.3);

        // Calcular altura total del contenedor dinámicamente
        const totalSections = 3;
        const itemsPerSection = [2, 5, 5]; // Número aproximado de items por sección
        const estimatedHeight = (totalSections * 15) + (itemsPerSection.reduce((a, b) => a + b, 0) * lineHeight) + (containerPadding * 2);

        pdf.roundedRect(startX - containerPadding, startY, containerWidth + (containerPadding * 2), estimatedHeight, 3, 3, 'FD');

        // Estilo para título de sección
        const styleTitulo = () => {
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(11); // Cambiado de 12 a 10
            pdf.setTextColor(this.colorPrimario);
        };

        // Estilo para etiqueta
        const styleEtiqueta = () => {
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(10);
            pdf.setTextColor(this.colorTexto);
        };

        // Estilo para valor
        const styleValor = () => {
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(10);
            pdf.setTextColor(this.colorTexto);
        };

        // Función auxiliar para añadir una línea de datos
        const addDataLine = (label, value) => {
            styleEtiqueta();
            pdf.text(label + ':', startX, currentY);
            styleValor();
            pdf.text(value, startX + 40, currentY);
            currentY += lineHeight;
        };

        // Función para añadir separador entre secciones
        const addSectionSeparator = () => {
            currentY += 1; // Espacio antes del separador (reducido de 5 a 3)

            // Línea sutil de separación
            pdf.setDrawColor(200, 200, 200);
            pdf.setLineWidth(0.2);
            pdf.line(startX - 2, currentY, startX + containerWidth - 5, currentY);

            currentY += 12; // Espacio después del separador (reducido de 15 a 8)
        };

        // Sección 1: DIMENSIONES
        styleTitulo();
        pdf.text('DIMENSIONES', startX, currentY);
        currentY += lineHeight * 1.3;

        addDataLine('Anchura', configuracion.dimensiones.ancho + ' mm');
        addDataLine('Profundidad', configuracion.dimensiones.profundidad + ' mm');

        addSectionSeparator();

        // Sección 2: ACABADOS
        styleTitulo();
        pdf.text('ACABADOS', startX, currentY);
        currentY += lineHeight * 1.3;

        addDataLine('Pared izquierda', this.capitalize(configuracion.materiales.paredIzquierda || configuracion.materiales.paredes));
        addDataLine('Pared frontal', this.capitalize(configuracion.materiales.paredCentro || configuracion.materiales.paredes));
        addDataLine('Pared derecha', this.capitalize(configuracion.materiales.paredDerecha || configuracion.materiales.paredes));
        addDataLine('Techo', this.formatearIluminacion(configuracion.iluminacion));
        addDataLine('Suelo', this.capitalize(configuracion.materiales.suelo));

        addSectionSeparator();

        // Sección 3: ELEMENTOS ADICIONALES
        styleTitulo();
        pdf.text('ELEMENTOS ADICIONALES', startX, currentY);
        currentY += lineHeight * 1.3;

        addDataLine('Pasamanos fondo', configuracion.pasamanos.frontal ? yes : no);
        addDataLine('Pasamanos lateral', configuracion.pasamanos.derecha ? yes : no);
        addDataLine('Botonera (modelo)', this.capitalize(configuracion.botonera.modelo));
        addDataLine('Espejo frontal', configuracion.espejo.frontal !== 'no' ? this.capitalize(configuracion.espejo.frontal) : no);
        addDataLine('Espejo lateral', configuracion.espejo.lateral !== 'no' ? this.capitalize(configuracion.espejo.lateral) : no);

        // Almacenar la posición Y final en una variable de instancia para usarla después
this.posicionYFinalOpciones = currentY;
return currentY; // Por si necesitamos continuar después
    }

    /**
     * Agrega tres imágenes adicionales de diferentes puntos de vista
     */
    agregarImagenesAdicionalesPDF(pdf, configurador, x, y, anchoDisponible) {
        // Configuraciones de cámara para diferentes vistas
        const vistasCamera = [
            { name: "Interior", position: [194, 1144, 1845], target: [0, 1100, 0] },
            { name: "Izquierda", position: [2040, 1607, 3660], target: [0, 1100, 0] },
            { name: "Derecha", position: [-2040, 1607, 3660], target: [0, 1100, 0] }
        ];

// Dimensiones para las imágenes pequeñas - reducir aún más el espacio entre ellas
const espacioEntreImagenes = 3; // Solo 3mm entre imágenes
const anchoImagen = (anchoDisponible - (espacioEntreImagenes * 2)) / 3; // 3 imágenes con mínimo espacio
// Calcular el alto disponible desde la posición Y hasta el pie de página
// El pie de página empieza en 275mm, así que usamos hasta 270mm
const altoDisponible = 270 - y; // Usar más espacio vertical
const altoImagen = altoDisponible; // Usar todo el espacio disponible

        vistasCamera.forEach((vista, index) => {
            // Crear una cámara temporal para esta vista específica
            const camaraTemp = new THREE.PerspectiveCamera(45, configurador.camera.aspect, 1, 50000);
            camaraTemp.position.set(...vista.position);
            camaraTemp.lookAt(...vista.target);

            // Crear un canvas temporal para renderizar esta vista
            const canvasTemp = document.createElement('canvas');
            canvasTemp.width = configurador.renderer.domElement.width;
            canvasTemp.height = configurador.renderer.domElement.height;

            // Crear un renderer temporal
            const rendererTemp = new THREE.WebGLRenderer({
                canvas: canvasTemp,
                preserveDrawingBuffer: true,
                antialias: true
            });
            rendererTemp.setSize(canvasTemp.width, canvasTemp.height);

            // Copiar configuraciones del renderer principal
            rendererTemp.setClearColor(configurador.renderer.getClearColor());
            rendererTemp.toneMapping = configurador.renderer.toneMapping;
            rendererTemp.toneMappingExposure = configurador.renderer.toneMappingExposure;
            rendererTemp.outputEncoding = configurador.renderer.outputEncoding;
            rendererTemp.shadowMap.enabled = configurador.renderer.shadowMap.enabled;
            rendererTemp.shadowMap.type = configurador.renderer.shadowMap.type;
            rendererTemp.setPixelRatio(configurador.renderer.getPixelRatio());

            // Copiar environment
            if (configurador.scene.environment) {
                rendererTemp.environment = configurador.scene.environment;
            }

            // Renderizar la escena con la nueva cámara
            camaraTemp.aspect = configurador.camera.aspect;
            camaraTemp.updateProjectionMatrix();
            rendererTemp.render(configurador.scene, camaraTemp);

            // Obtener los datos de la imagen
            const imgData = canvasTemp.toDataURL('image/jpeg', 0.9);

// Calcular posición X para esta imagen con mínimo espacio
const posX = x + (index * (anchoImagen + espacioEntreImagenes));

            // Añadir la imagen al PDF
            pdf.addImage(imgData, 'JPEG', posX, y, anchoImagen, altoImagen);

            // Añadir borde
            pdf.setDrawColor(180, 180, 180);
            pdf.setLineWidth(0.3);
            pdf.rect(posX, y, anchoImagen, altoImagen);

            // ELIMINADO: Ya no añadimos etiquetas de texto
// Las líneas anteriores se eliminan completamente

            // Limpiar recursos temporales
            rendererTemp.dispose();
        });
    }

    /**
     * Convierte primera letra a mayúscula
     */
    capitalize(texto) {
        if (!texto) return '';
        return texto.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    /**
     * Formatea el texto de iluminación
     */
    formatearIluminacion(tipo) {
        switch(tipo) {
            case 'panel-led':
                return 'Panel LED';
            case 'spots-led':
                return 'Focos LED';
            case 'barras-led':
                return 'Barras LED';
            case 'estandar':
                return 'Iluminación estándar';
            default:
                return this.capitalize(tipo);
        }
    }
 }

 // Exportamos la clase para usarla en main.js
 window.ExportadorPDF = ExportadorPDF;

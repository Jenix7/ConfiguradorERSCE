/**
 * Script principal para manejar la interfaz del configurador de ascensores
 */
document.addEventListener('DOMContentLoaded', function() {

    // Configuración de paredes según modo
    const configuracionParedes = {
        sustitucion: {
            modelos: [
                {
                    id: 'acero-inoxidable',
                    nombre: 'Acero Inoxidable',
                    categorias: [
                        {
                            nombre: 'Acero Inoxidable',
                            tipo: 'todas',
                            opciones: [
                                { id: 'inox-cepillado', nombre: 'Inox cepillado', imagen: 'img/paredes/sustitucion/acero-inoxidable/inox-cepillado.png' },
                                { id: 'inox-lino', nombre: 'Inox lino', imagen: 'img/paredes/sustitucion/acero-inoxidable/inox-lino.png' }
                            ]
                        },
                        {
                            nombre: 'Acero Inoxidable Izquierda',
                            tipo: 'izquierda',
                            opciones: [
                                { id: 'inox-cepillado-izq', nombre: 'Inox cepillado', imagen: 'img/paredes/sustitucion/acero-inoxidable/inox-cepillado.png' },
                                { id: 'inox-lino-izq', nombre: 'Inox lino', imagen: 'img/paredes/sustitucion/acero-inoxidable/inox-lino.png' }
                            ]
                        },
                        {
                            nombre: 'Acero Inoxidable Centro',
                            tipo: 'centro',
                            opciones: [
                                { id: 'inox-cepillado-centro', nombre: 'Inox cepillado', imagen: 'img/paredes/sustitucion/acero-inoxidable/inox-cepillado.png' },
                                { id: 'inox-lino-centro', nombre: 'Inox lino', imagen: 'img/paredes/sustitucion/acero-inoxidable/inox-lino.png' }
                            ]
                        },
                        {
                            nombre: 'Acero Inoxidable Derecha',
                            tipo: 'derecha',
                            opciones: [
                                { id: 'inox-cepillado-der', nombre: 'Inox cepillado', imagen: 'img/paredes/sustitucion/acero-inoxidable/inox-cepillado.png' },
                                { id: 'inox-lino-der', nombre: 'Inox lino', imagen: 'img/paredes/sustitucion/acero-inoxidable/inox-lino.png' }
                            ]
                        }
                    ]
                },
                {
                    id: 'skinplate',
                    nombre: 'Skinplate',
                    categorias: [
                        {
                            nombre: 'Skinplate',
                            tipo: 'todas',
                            opciones: [
                                { id: 'skinplate-azul', nombre: 'Azul', imagen: 'img/paredes/sustitucion/skinplate/azul.png' },
                                { id: 'skinplate-blanco', nombre: 'Blanco', imagen: 'img/paredes/sustitucion/skinplate/blanco.png' },
                                { id: 'skinplate-naranja', nombre: 'Naranja', imagen: 'img/paredes/sustitucion/skinplate/naranja.png' }
                            ]
                        },
                        {
                            nombre: 'Skinplate Izquierda',
                            tipo: 'izquierda',
                            opciones: [
                                { id: 'skinplate-azul-izq', nombre: 'Azul', imagen: 'img/paredes/sustitucion/skinplate/azul.png' },
                                { id: 'skinplate-blanco-izq', nombre: 'Blanco', imagen: 'img/paredes/sustitucion/skinplate/blanco.png' },
                                { id: 'skinplate-naranja-izq', nombre: 'Naranja', imagen: 'img/paredes/sustitucion/skinplate/naranja.png' }
                            ]
                        },
                        {
                            nombre: 'Skinplate Centro',
                            tipo: 'centro',
                            opciones: [
                                { id: 'skinplate-azul-centro', nombre: 'Azul', imagen: 'img/paredes/sustitucion/skinplate/azul.png' },
                                { id: 'skinplate-blanco-centro', nombre: 'Blanco', imagen: 'img/paredes/sustitucion/skinplate/blanco.png' },
                                { id: 'skinplate-naranja-centro', nombre: 'Naranja', imagen: 'img/paredes/sustitucion/skinplate/naranja.png' }
                            ]
                        },
                        {
                            nombre: 'Skinplate Derecha',
                            tipo: 'derecha',
                            opciones: [
                                { id: 'skinplate-azul-der', nombre: 'Azul', imagen: 'img/paredes/sustitucion/skinplate/azul.png' },
                                { id: 'skinplate-blanco-der', nombre: 'Blanco', imagen: 'img/paredes/sustitucion/skinplate/blanco.png' },
                                { id: 'skinplate-naranja-der', nombre: 'Naranja', imagen: 'img/paredes/sustitucion/skinplate/naranja.png' }
                            ]
                        }
                    ]
                },
                {
                    id: 'estratificado',
                    nombre: 'Estratificado',
                    categorias: [
                        {
                            nombre: 'Estratificado',
                            tipo: 'todas',
                            opciones: [
                                { id: 'estrat-white-folkstone', nombre: 'White Folkstone', imagen: 'img/paredes/sustitucion/estratificado/white-folkstone.png' },
                                { id: 'estrat-vogue-wood', nombre: 'Vogue Wood', imagen: 'img/paredes/sustitucion/estratificado/vogue-wood.png' },
                                { id: 'estrat-concrete-formwood', nombre: 'Concrete Formwood', imagen: 'img/paredes/sustitucion/estratificado/concrete-formwood.png' },
                                { id: 'estrat-cerezo', nombre: 'Cerezo', imagen: 'img/paredes/sustitucion/estratificado/cerezo.png' },
                                { id: 'estrat-ivory-oak', nombre: 'Ivory Oak Cross', imagen: 'img/paredes/sustitucion/estratificado/ivory-oak.png' },
                                { id: 'estrat-ebony-oak', nombre: 'Ebony Oak Cross', imagen: 'img/paredes/sustitucion/estratificado/ebony-oak.png' }
                            ]
                        },
                        {
                            nombre: 'Estratificado Izquierda',
                            tipo: 'izquierda',
                            opciones: [
                                { id: 'estrat-white-folkstone-izq', nombre: 'White Folkstone', imagen: 'img/paredes/sustitucion/estratificado/white-folkstone.png' },
                                { id: 'estrat-vogue-wood-izq', nombre: 'Vogue Wood', imagen: 'img/paredes/sustitucion/estratificado/vogue-wood.png' },
                                { id: 'estrat-concrete-formwood-izq', nombre: 'Concrete Formwood', imagen: 'img/paredes/sustitucion/estratificado/concrete-formwood.png' },
                                { id: 'estrat-cerezo-izq', nombre: 'Cerezo', imagen: 'img/paredes/sustitucion/estratificado/cerezo.png' },
                                { id: 'estrat-ivory-oak-izq', nombre: 'Ivory Oak Cross', imagen: 'img/paredes/sustitucion/estratificado/ivory-oak.png' },
                                { id: 'estrat-ebony-oak-izq', nombre: 'Ebony Oak Cross', imagen: 'img/paredes/sustitucion/estratificado/ebony-oak.png' }
                            ]
                        },
                        {
                            nombre: 'Estratificado Centro',
                            tipo: 'centro',
                            opciones: [
                                { id: 'estrat-white-folkstone-centro', nombre: 'White Folkstone', imagen: 'img/paredes/sustitucion/estratificado/white-folkstone.png' },
                                { id: 'estrat-vogue-wood-centro', nombre: 'Vogue Wood', imagen: 'img/paredes/sustitucion/estratificado/vogue-wood.png' },
                                { id: 'estrat-concrete-formwood-centro', nombre: 'Concrete Formwood', imagen: 'img/paredes/sustitucion/estratificado/concrete-formwood.png' },
                                { id: 'estrat-cerezo-centro', nombre: 'Cerezo', imagen: 'img/paredes/sustitucion/estratificado/cerezo.png' },
                                { id: 'estrat-ivory-oak-centro', nombre: 'Ivory Oak Cross', imagen: 'img/paredes/sustitucion/estratificado/ivory-oak.png' },
                                { id: 'estrat-ebony-oak-centro', nombre: 'Ebony Oak Cross', imagen: 'img/paredes/sustitucion/estratificado/ebony-oak.png' }
                            ]
                        },
                        {
                            nombre: 'Estratificado Derecha',
                            tipo: 'derecha',
                            opciones: [
                                { id: 'estrat-white-folkstone-der', nombre: 'White Folkstone', imagen: 'img/paredes/sustitucion/estratificado/white-folkstone.png' },
                                { id: 'estrat-vogue-wood-der', nombre: 'Vogue Wood', imagen: 'img/paredes/sustitucion/estratificado/vogue-wood.png' },
                                { id: 'estrat-concrete-formwood-der', nombre: 'Concrete Formwood', imagen: 'img/paredes/sustitucion/estratificado/concrete-formwood.png' },
                                { id: 'estrat-cerezo-der', nombre: 'Cerezo', imagen: 'img/paredes/sustitucion/estratificado/cerezo.png' },
                                { id: 'estrat-ivory-oak-der', nombre: 'Ivory Oak Cross', imagen: 'img/paredes/sustitucion/estratificado/ivory-oak.png' },
                                { id: 'estrat-ebony-oak-der', nombre: 'Ebony Oak Cross', imagen: 'img/paredes/sustitucion/estratificado/ebony-oak.png' }
                            ]
                        }
                    ]
                }
            ]
        },
        decoracion: {
            modelos: [
                {
                    id: 'ingravity-estandar',
                    nombre: 'Ingravity estándar',
                    categorias: [
                        {
                            nombre: 'Ingravity estándar',
                            tipo: 'todas',
                            opciones: [
                                { id: 'ing-std-epv-06', nombre: 'EPV-06', imagen: 'img/paredes/decoracion/ingravity-estandar/epv-06.png' },
                                { id: 'ing-std-epv-14', nombre: 'EPV-14', imagen: 'img/paredes/decoracion/ingravity-estandar/epv-14.png' },
                                { id: 'ing-std-epv-22', nombre: 'EPV-22', imagen: 'img/paredes/decoracion/ingravity-estandar/epv-22.png' },
                                { id: 'ing-std-epv-27', nombre: 'EPV-27', imagen: 'img/paredes/decoracion/ingravity-estandar/epv-27.png' },
                                { id: 'ing-std-epv-24', nombre: 'EPV-24', imagen: 'img/paredes/decoracion/ingravity-estandar/epv-24.png' },
                                { id: 'ing-std-epv-29', nombre: 'EPV-29', imagen: 'img/paredes/decoracion/ingravity-estandar/epv-29.png' },
                                { id: 'ing-std-epv-30', nombre: 'EPV-30', imagen: 'img/paredes/decoracion/ingravity-estandar/epv-30.png' },
                                { id: 'ing-std-epv-32', nombre: 'EPV-32', imagen: 'img/paredes/decoracion/ingravity-estandar/epv-32.png' },
                                { id: 'ing-std-epv-16', nombre: 'EPV-16', imagen: 'img/paredes/decoracion/ingravity-estandar/epv-16.png' },
                                { id: 'ing-std-epv-20', nombre: 'EPV-20', imagen: 'img/paredes/decoracion/ingravity-estandar/epv-20.png' }
                            ]
                        },
                        {
                            nombre: 'Ingravity estándar Izquierda',
                            tipo: 'izquierda',
                            opciones: [
                                { id: 'ing-std-efc-22', nombre: 'EFC-22', imagen: 'img/paredes/decoracion/ingravity-estandar/efc-22.png' },
                                { id: 'ing-std-efc-14', nombre: 'EFC-14', imagen: 'img/paredes/decoracion/ingravity-estandar/efc-14.png' },
                                { id: 'ing-std-efc-23', nombre: 'EFC-23', imagen: 'img/paredes/decoracion/ingravity-estandar/efc-23.png' },
                                { id: 'ing-std-efc-07', nombre: 'EFC-07', imagen: 'img/paredes/decoracion/ingravity-estandar/efc-07.png' },
                                { id: 'ing-std-efc-04', nombre: 'EFC-04', imagen: 'img/paredes/decoracion/ingravity-estandar/efc-04.png' },
                                { id: 'ing-std-efc-03', nombre: 'EFC-03', imagen: 'img/paredes/decoracion/ingravity-estandar/efc-03.png' },
                                { id: 'ing-std-efc-30', nombre: 'EFC-30', imagen: 'img/paredes/decoracion/ingravity-estandar/efc-30.png' },
                                { id: 'ing-std-efc-32', nombre: 'EFC-32', imagen: 'img/paredes/decoracion/ingravity-estandar/efc-32.png' },
                                { id: 'ing-std-efc-10', nombre: 'EFC-10', imagen: 'img/paredes/decoracion/ingravity-estandar/efc-10.png' },
                                { id: 'ing-std-efc-02', nombre: 'EFC-02', imagen: 'img/paredes/decoracion/ingravity-estandar/efc-02.png' }
                            ]
                        },
                        {
                            nombre: 'Ingravity estándar Centro',
                            tipo: 'centro',
                            opciones: [
                                { id: 'ing-std-efc-22', nombre: 'EFC-22', imagen: 'img/paredes/decoracion/ingravity-estandar/efc-22.png' },
                                { id: 'ing-std-efc-14', nombre: 'EFC-14', imagen: 'img/paredes/decoracion/ingravity-estandar/efc-14.png' },
                                { id: 'ing-std-efc-23', nombre: 'EFC-23', imagen: 'img/paredes/decoracion/ingravity-estandar/efc-23.png' },
                                { id: 'ing-std-efc-07', nombre: 'EFC-07', imagen: 'img/paredes/decoracion/ingravity-estandar/efc-07.png' },
                                { id: 'ing-std-efc-04', nombre: 'EFC-04', imagen: 'img/paredes/decoracion/ingravity-estandar/efc-04.png' },
                                { id: 'ing-std-efc-03', nombre: 'EFC-03', imagen: 'img/paredes/decoracion/ingravity-estandar/efc-03.png' },
                                { id: 'ing-std-efc-30', nombre: 'EFC-30', imagen: 'img/paredes/decoracion/ingravity-estandar/efc-30.png' },
                                { id: 'ing-std-efc-32', nombre: 'EFC-32', imagen: 'img/paredes/decoracion/ingravity-estandar/efc-32.png' },
                                { id: 'ing-std-efc-10', nombre: 'EFC-10', imagen: 'img/paredes/decoracion/ingravity-estandar/efc-10.png' },
                                { id: 'ing-std-efc-02', nombre: 'EFC-02', imagen: 'img/paredes/decoracion/ingravity-estandar/efc-02.png' }
                            ]
                        },
                        {
                            nombre: 'Ingravity estándar Derecha',
                            tipo: 'derecha',
                            opciones: [
                                { id: 'ing-std-efc-22', nombre: 'EFC-22', imagen: 'img/paredes/decoracion/ingravity-estandar/efc-22.png' },
                                { id: 'ing-std-efc-14', nombre: 'EFC-14', imagen: 'img/paredes/decoracion/ingravity-estandar/efc-14.png' },
                                { id: 'ing-std-efc-23', nombre: 'EFC-23', imagen: 'img/paredes/decoracion/ingravity-estandar/efc-23.png' },
                                { id: 'ing-std-efc-07', nombre: 'EFC-07', imagen: 'img/paredes/decoracion/ingravity-estandar/efc-07.png' },
                                { id: 'ing-std-efc-04', nombre: 'EFC-04', imagen: 'img/paredes/decoracion/ingravity-estandar/efc-04.png' },
                                { id: 'ing-std-efc-03', nombre: 'EFC-03', imagen: 'img/paredes/decoracion/ingravity-estandar/efc-03.png' },
                                { id: 'ing-std-efc-30', nombre: 'EFC-30', imagen: 'img/paredes/decoracion/ingravity-estandar/efc-30.png' },
                                { id: 'ing-std-efc-32', nombre: 'EFC-32', imagen: 'img/paredes/decoracion/ingravity-estandar/efc-32.png' },
                                { id: 'ing-std-efc-10', nombre: 'EFC-10', imagen: 'img/paredes/decoracion/ingravity-estandar/efc-10.png' },
                                { id: 'ing-std-efc-02', nombre: 'EFC-02', imagen: 'img/paredes/decoracion/ingravity-estandar/efc-02.png' }
                            ]
                        }
                    ]
                },
                {
                    id: 'ingravity-metalicos',
                    nombre: 'Ingravity metálicos y madera',
                    categorias: [
                        {
                            nombre: 'Ingravity metálicos y madera',
                            tipo: 'todas',
                            opciones: [
                                { id: 'ing-met-epv-50', nombre: 'EPV-50', imagen: 'img/paredes/decoracion/ingravity-metalicos/epv-50.png' },
                                { id: 'ing-met-epv-52', nombre: 'EPV-52', imagen: 'img/paredes/decoracion/ingravity-metalicos/epv-52.png' },
                                { id: 'ing-met-epv-62', nombre: 'EPV-62', imagen: 'img/paredes/decoracion/ingravity-metalicos/epv-62.png' },
                                { id: 'ing-met-epv-65', nombre: 'EPV-65', imagen: 'img/paredes/decoracion/ingravity-metalicos/epv-65.png' },
                                { id: 'ing-met-epv-69', nombre: 'EPV-69', imagen: 'img/paredes/decoracion/ingravity-metalicos/epv-69.png' }
                            ]
                        },
                        {
                            nombre: 'Ingravity metálicos y madera Izquierda',
                            tipo: 'izquierda',
                            opciones: [
                                { id: 'ing-met-efc-60', nombre: 'EFC-60', imagen: 'img/paredes/decoracion/ingravity-metalicos/efc-60.png' },
                                { id: 'ing-met-efc-59', nombre: 'EFC-59', imagen: 'img/paredes/decoracion/ingravity-metalicos/efc-59.png' },
                                { id: 'ing-met-efc-63', nombre: 'EFC-63', imagen: 'img/paredes/decoracion/ingravity-metalicos/efc-63.png' },
                                { id: 'ing-met-efc-61', nombre: 'EFC-61', imagen: 'img/paredes/decoracion/ingravity-metalicos/efc-61.png' },
                                { id: 'ing-met-efc-58', nombre: 'EFC-58', imagen: 'img/paredes/decoracion/ingravity-metalicos/efc-58.png' }
                            ]
                        },
                        {
                            nombre: 'Ingravity metálicos y madera Centro',
                            tipo: 'centro',
                            opciones: [
                                { id: 'ing-met-efc-60', nombre: 'EFC-60', imagen: 'img/paredes/decoracion/ingravity-metalicos/efc-60.png' },
                                { id: 'ing-met-efc-59', nombre: 'EFC-59', imagen: 'img/paredes/decoracion/ingravity-metalicos/efc-59.png' },
                                { id: 'ing-met-efc-63', nombre: 'EFC-63', imagen: 'img/paredes/decoracion/ingravity-metalicos/efc-63.png' },
                                { id: 'ing-met-efc-61', nombre: 'EFC-61', imagen: 'img/paredes/decoracion/ingravity-metalicos/efc-61.png' },
                                { id: 'ing-met-efc-58', nombre: 'EFC-58', imagen: 'img/paredes/decoracion/ingravity-metalicos/efc-58.png' }
                            ]
                        },
                        {
                            nombre: 'Ingravity metálicos y madera Derecha',
                            tipo: 'derecha',
                            opciones: [
                                { id: 'ing-met-efc-60', nombre: 'EFC-60', imagen: 'img/paredes/decoracion/ingravity-metalicos/efc-60.png' },
                                { id: 'ing-met-efc-59', nombre: 'EFC-59', imagen: 'img/paredes/decoracion/ingravity-metalicos/efc-59.png' },
                                { id: 'ing-met-efc-63', nombre: 'EFC-63', imagen: 'img/paredes/decoracion/ingravity-metalicos/efc-63.png' },
                                { id: 'ing-met-efc-61', nombre: 'EFC-61', imagen: 'img/paredes/decoracion/ingravity-metalicos/efc-61.png' },
                                { id: 'ing-met-efc-58', nombre: 'EFC-58', imagen: 'img/paredes/decoracion/ingravity-metalicos/efc-58.png' }
                            ]
                        }
                    ]
                },
                {
                    id: 'melaminas',
                    nombre: 'Melaminas',
                    categorias: [
                        {
                            nombre: 'Melaminas',
                            tipo: 'todas',
                            opciones: [
                                { id: 'mel-em-01', nombre: 'EM-01', imagen: 'img/paredes/decoracion/melaminas/em-01.png' },
                                { id: 'mel-em-11', nombre: 'EM-11', imagen: 'img/paredes/decoracion/melaminas/em-11.png' },
                                { id: 'mel-em-12', nombre: 'EM-12', imagen: 'img/paredes/decoracion/melaminas/em-12.png' },
                                { id: 'mel-em-t1', nombre: 'EM-T1', imagen: 'img/paredes/decoracion/melaminas/em-t1.png' },
                                { id: 'mel-em-66', nombre: 'EM-66', imagen: 'img/paredes/decoracion/melaminas/em-66.png' },
                                { id: 'mel-em-33', nombre: 'EM-33', imagen: 'img/paredes/decoracion/melaminas/em-33.png' },
                                { id: 'mel-em-88', nombre: 'EM-88', imagen: 'img/paredes/decoracion/melaminas/em-88.png' },
                                { id: 'mel-em-77', nombre: 'EM-77', imagen: 'img/paredes/decoracion/melaminas/em-77.png' },
                                { id: 'mel-em-56', nombre: 'EM-56', imagen: 'img/paredes/decoracion/melaminas/em-56.png' },
                                { id: 'mel-em-21', nombre: 'EM-21', imagen: 'img/paredes/decoracion/melaminas/em-21.png' }
                            ]
                        },
                        {
                            nombre: 'Melaminas Izquierda',
                            tipo: 'izquierda',
                            opciones: [
                                { id: 'mel-em-01', nombre: 'EM-01', imagen: 'img/paredes/decoracion/melaminas/em-01.png' },
                                { id: 'mel-em-10', nombre: 'EM-10', imagen: 'img/paredes/decoracion/melaminas/em-10.png' },
                                { id: 'mel-em-12', nombre: 'EM-12', imagen: 'img/paredes/decoracion/melaminas/em-12.png' },
                                { id: 'mel-em-71', nombre: 'EM-71', imagen: 'img/paredes/decoracion/melaminas/em-71.png' },
                                { id: 'mel-em-69', nombre: 'EM-69', imagen: 'img/paredes/decoracion/melaminas/em-69.png' },
                                { id: 'mel-em-09', nombre: 'EM-09', imagen: 'img/paredes/decoracion/melaminas/em-09.png' },
                                { id: 'mel-em-08', nombre: 'EM-08', imagen: 'img/paredes/decoracion/melaminas/em-08.png' },
                                { id: 'mel-em-77', nombre: 'EM-77', imagen: 'img/paredes/decoracion/melaminas/em-77.png' },
                                { id: 'mel-em-56', nombre: 'EM-56', imagen: 'img/paredes/decoracion/melaminas/em-56.png' },
                                { id: 'mel-em-21', nombre: 'EM-21', imagen: 'img/paredes/decoracion/melaminas/em-21.png' }
                            ]
                        },
                        {
                            nombre: 'Melaminas Centro',
                            tipo: 'centro',
                            opciones: [
                                { id: 'mel-em-01', nombre: 'EM-01', imagen: 'img/paredes/decoracion/melaminas/em-01.png' },
                                { id: 'mel-em-10', nombre: 'EM-10', imagen: 'img/paredes/decoracion/melaminas/em-10.png' },
                                { id: 'mel-em-12', nombre: 'EM-12', imagen: 'img/paredes/decoracion/melaminas/em-12.png' },
                                { id: 'mel-em-71', nombre: 'EM-71', imagen: 'img/paredes/decoracion/melaminas/em-71.png' },
                                { id: 'mel-em-69', nombre: 'EM-69', imagen: 'img/paredes/decoracion/melaminas/em-69.png' },
                                { id: 'mel-em-09', nombre: 'EM-09', imagen: 'img/paredes/decoracion/melaminas/em-09.png' },
                                { id: 'mel-em-08', nombre: 'EM-08', imagen: 'img/paredes/decoracion/melaminas/em-08.png' },
                                { id: 'mel-em-77', nombre: 'EM-77', imagen: 'img/paredes/decoracion/melaminas/em-77.png' },
                                { id: 'mel-em-56', nombre: 'EM-56', imagen: 'img/paredes/decoracion/melaminas/em-56.png' },
                                { id: 'mel-em-21', nombre: 'EM-21', imagen: 'img/paredes/decoracion/melaminas/em-21.png' }
                            ]
                        },
                        {
                            nombre: 'Melaminas Derecha',
                            tipo: 'derecha',
                            opciones: [
                                { id: 'mel-em-01', nombre: 'EM-01', imagen: 'img/paredes/decoracion/melaminas/em-01.png' },
                                { id: 'mel-em-10', nombre: 'EM-10', imagen: 'img/paredes/decoracion/melaminas/em-10.png' },
                                { id: 'mel-em-12', nombre: 'EM-12', imagen: 'img/paredes/decoracion/melaminas/em-12.png' },
                                { id: 'mel-em-71', nombre: 'EM-71', imagen: 'img/paredes/decoracion/melaminas/em-71.png' },
                                { id: 'mel-em-69', nombre: 'EM-69', imagen: 'img/paredes/decoracion/melaminas/em-69.png' },
                                { id: 'mel-em-09', nombre: 'EM-09', imagen: 'img/paredes/decoracion/melaminas/em-09.png' },
                                { id: 'mel-em-08', nombre: 'EM-08', imagen: 'img/paredes/decoracion/melaminas/em-08.png' },
                                { id: 'mel-em-77', nombre: 'EM-77', imagen: 'img/paredes/decoracion/melaminas/em-77.png' },
                                { id: 'mel-em-56', nombre: 'EM-56', imagen: 'img/paredes/decoracion/melaminas/em-56.png' },
                                { id: 'mel-em-21', nombre: 'EM-21', imagen: 'img/paredes/decoracion/melaminas/em-21.png' }
                            ]
                        }
                    ]
                },
                {
                    id: 'formica',
                    nombre: 'Formica',
                    categorias: [
                        {
                            nombre: 'Formica',
                            tipo: 'todas',
                            opciones: [
                                { id: 'for-f1079', nombre: 'F1079', imagen: 'img/paredes/decoracion/formica/f1079.png' },
                                { id: 'for-f1139', nombre: 'F1139', imagen: 'img/paredes/decoracion/formica/f1139.png' },
                                { id: 'for-f1994', nombre: 'F1994', imagen: 'img/paredes/decoracion/formica/f1994.png' },
                                { id: 'for-f2833', nombre: 'F2833', imagen: 'img/paredes/decoracion/formica/f2833.png' },
                                { id: 'for-f3209', nombre: 'F3209', imagen: 'img/paredes/decoracion/formica/f3209.png' }
                            ]
                        },
                        {
                            nombre: 'Formica Izquierda',
                            tipo: 'izquierda',
                            opciones: [
                                { id: 'for-f1079', nombre: 'F1079', imagen: 'img/paredes/decoracion/formica/f1079.png' },
                                { id: 'for-f1138', nombre: 'F1138', imagen: 'img/paredes/decoracion/formica/f1138.png' },
                                { id: 'for-f3924', nombre: 'F3924', imagen: 'img/paredes/decoracion/formica/f3924.png' },
                                { id: 'for-f2833', nombre: 'F2833', imagen: 'img/paredes/decoracion/formica/f2833.png' },
                                { id: 'for-f3209', nombre: 'F3209', imagen: 'img/paredes/decoracion/formica/f3209.png' }
                            ]
                        },
                        {
                            nombre: 'Formica Centro',
                            tipo: 'centro',
                            opciones: [
                                { id: 'for-f1079', nombre: 'F1079', imagen: 'img/paredes/decoracion/formica/f1079.png' },
                                { id: 'for-f1138', nombre: 'F1138', imagen: 'img/paredes/decoracion/formica/f1138.png' },
                                { id: 'for-f3924', nombre: 'F3924', imagen: 'img/paredes/decoracion/formica/f3924.png' },
                                { id: 'for-f2833', nombre: 'F2833', imagen: 'img/paredes/decoracion/formica/f2833.png' },
                                { id: 'for-f3209', nombre: 'F3209', imagen: 'img/paredes/decoracion/formica/f3209.png' }
                            ]
                        },
                        {
                            nombre: 'Formica Derecha',
                            tipo: 'derecha',
                            opciones: [
                                { id: 'for-f1079', nombre: 'F1079', imagen: 'img/paredes/decoracion/formica/f1079.png' },
                                { id: 'for-f1138', nombre: 'F1138', imagen: 'img/paredes/decoracion/formica/f1138.png' },
                                { id: 'for-f3924', nombre: 'F3924', imagen: 'img/paredes/decoracion/formica/f3924.png' },
                                { id: 'for-f2833', nombre: 'F2833', imagen: 'img/paredes/decoracion/formica/f2833.png' },
                                { id: 'for-f3209', nombre: 'F3209', imagen: 'img/paredes/decoracion/formica/f3209.png' }
                            ]
                        }
                    ]
                },
                {
                    id: 'acero-inoxidable-dec',
                    nombre: 'Acero inoxidable',
                    categorias: [
                        {
                            nombre: 'Acero inoxidable',
                            tipo: 'todas',
                            opciones: [
                                { id: 'inoxdec-satinado', nombre: 'SATINADO', imagen: 'img/paredes/decoracion/acero-inoxidable/satinado.png' },
                                { id: 'inoxdec-duplo', nombre: 'DUPLO', imagen: 'img/paredes/decoracion/acero-inoxidable/duplo.png' },
                                { id: 'inoxdec-espejo', nombre: 'ESPEJO', imagen: 'img/paredes/decoracion/acero-inoxidable/espejo.png' },
                                { id: 'inoxdec-karo', nombre: 'KARO', imagen: 'img/paredes/decoracion/acero-inoxidable/karo.png' },
                                { id: 'inoxdec-linen', nombre: 'LINEN', imagen: 'img/paredes/decoracion/acero-inoxidable/linen.png' }
                            ]
                        },
                        {
                            nombre: 'Acero inoxidable Izquierda',
                            tipo: 'izquierda',
                            opciones: [
                                { id: 'inoxdec-satinado', nombre: 'Satinado', imagen: 'img/paredes/decoracion/acero-inoxidable/satinado.png' },
                                { id: 'inoxdec-pulido', nombre: 'Pulido', imagen: 'img/paredes/decoracion/acero-inoxidable/pulido.png' },
                                { id: 'inoxdec-espejo', nombre: 'Espejo', imagen: 'img/paredes/decoracion/acero-inoxidable/espejo.png' },
                                { id: 'inoxdec-a4m4', nombre: 'A4M4', imagen: 'img/paredes/decoracion/acero-inoxidable/a4m4.png' },
                                { id: 'inoxdec-antivandal', nombre: 'Antivandálico', imagen: 'img/paredes/decoracion/acero-inoxidable/antivandal.png' }
                            ]
                        },
                        {
                            nombre: 'Acero inoxidable Centro',
                            tipo: 'centro',
                            opciones: [
                                { id: 'inoxdec-satinado', nombre: 'Satinado', imagen: 'img/paredes/decoracion/acero-inoxidable/satinado.png' },
                                { id: 'inoxdec-pulido', nombre: 'Pulido', imagen: 'img/paredes/decoracion/acero-inoxidable/pulido.png' },
                                { id: 'inoxdec-espejo', nombre: 'Espejo', imagen: 'img/paredes/decoracion/acero-inoxidable/espejo.png' },
                                { id: 'inoxdec-a4m4', nombre: 'A4M4', imagen: 'img/paredes/decoracion/acero-inoxidable/a4m4.png' },
                                { id: 'inoxdec-antivandal', nombre: 'Antivandálico', imagen: 'img/paredes/decoracion/acero-inoxidable/antivandal.png' }
                            ]
                        },
                        {
                            nombre: 'Acero inoxidable Derecha',
                            tipo: 'derecha',
                            opciones: [
                                { id: 'inoxdec-satinado', nombre: 'Satinado', imagen: 'img/paredes/decoracion/acero-inoxidable/satinado.png' },
                                { id: 'inoxdec-pulido', nombre: 'Pulido', imagen: 'img/paredes/decoracion/acero-inoxidable/pulido.png' },
                                { id: 'inoxdec-espejo', nombre: 'Espejo', imagen: 'img/paredes/decoracion/acero-inoxidable/espejo.png' },
                                { id: 'inoxdec-a4m4', nombre: 'A4M4', imagen: 'img/paredes/decoracion/acero-inoxidable/a4m4.png' },
                                { id: 'inoxdec-antivandal', nombre: 'Antivandálico', imagen: 'img/paredes/decoracion/acero-inoxidable/antivandal.png' }
                            ]
                        }
                    ]
                }
            ]
        }
    };

    // Variables globales de paredes
    let modeloParedSeleccionado = null;
    let materialParedSeleccionado = null;

    // Configuración de techos según modo
    const configuracionTechos = {
        sustitucion: {
            opciones: [
                { id: 'spots-led', nombre: 'Spots LED', imagen: 'img/techos/sustitucion/spots-led.png' },
                { id: 'barras-led', nombre: 'Barras LED', imagen: 'img/techos/sustitucion/barras-led.png' },
                { id: 'panel-led', nombre: 'Panel LED', imagen: 'img/techos/sustitucion/panel-led.png' },
                { id: 'infinite', nombre: 'Infinite', imagen: 'img/techos/sustitucion/infinite.png' },
                { id: 'spots-line', nombre: 'Spots Line', imagen: 'img/techos/sustitucion/spots-line.png' },
                { id: 'mineral', nombre: 'Mineral', imagen: 'img/techos/sustitucion/mineral.png' },
                { id: 'marco', nombre: 'Marco', imagen: 'img/techos/sustitucion/marco.png' },
                { id: 'fraction', nombre: 'Fraction', imagen: 'img/techos/sustitucion/fraction.png' },
                { id: 'arte', nombre: 'Arte', imagen: 'img/techos/sustitucion/arte.png' },
                { id: 'mondorian', nombre: 'Mondorian', imagen: 'img/techos/sustitucion/mondorian.png' },
                { id: 'mosaic', nombre: 'Mosaic', imagen: 'img/techos/sustitucion/mosaic.png' }
            ]
        },
        decoracion: {
            opciones: [
                { id: 'l-4', nombre: 'L-4', imagen: 'img/techos/decoracion/l-4.png' },
                { id: 'l-30', nombre: 'L-30', imagen: 'img/techos/decoracion/l-30.png' },
                { id: 'l-60', nombre: 'L-60', imagen: 'img/techos/decoracion/l-60.png' },
                { id: 'l-20', nombre: 'L-20', imagen: 'img/techos/decoracion/l-20.png' },
                { id: 'l-36', nombre: 'L-36', imagen: 'img/techos/decoracion/l-36.png' },
                { id: 'l-2f', nombre: 'L-2F', imagen: 'img/techos/decoracion/l-2f.png' },
                { id: 'l-2h', nombre: 'L-2H', imagen: 'img/techos/decoracion/l-2h.png' },
                { id: 'l-m1', nombre: 'L-M1', imagen: 'img/techos/decoracion/l-m1.png' },
                { id: 'l-m2', nombre: 'L-M2', imagen: 'img/techos/decoracion/l-m2.png' },
                { id: 'l-c', nombre: 'L-C', imagen: 'img/techos/decoracion/l-c.png' },
                { id: 'l-8', nombre: 'L-8', imagen: 'img/techos/decoracion/l-8.png' }
            ]
        }
    };

    // Variable global para almacenar el modo seleccionado
    let modoSeleccionado = null;



    // Configuración de suelos según modo
    const configuracionSuelos = {
        sustitucion: {
            categorias: [
                {
                    nombre: 'Goma',
                    opciones: [
                        { id: 'goma-azul', nombre: 'Azul', imagen: 'img/suelos/sustitucion/goma-azul.png' },
                        { id: 'goma-gris-claro', nombre: 'Gris claro', imagen: 'img/suelos/sustitucion/goma-gris-claro.png' },
                        { id: 'goma-gris-oscuro', nombre: 'Gris oscuro', imagen: 'img/suelos/sustitucion/goma-gris-oscuro.png' },
                        { id: 'goma-negro', nombre: 'Negro', imagen: 'img/suelos/sustitucion/goma-negro.png' }
                    ]
                },
                {
                    nombre: 'Granito',
                    opciones: [
                        { id: 'granito-blanco-cristal', nombre: 'Blanco cristal', imagen: 'img/suelos/sustitucion/granito-blanco-cristal.png' },
                        { id: 'granito-gris-perla', nombre: 'Gris perla', imagen: 'img/suelos/sustitucion/granito-gris-perla.png' },
                        { id: 'granito-negro-sudafrica', nombre: 'Negro sudáfrica', imagen: 'img/suelos/sustitucion/granito-negro-sudafrica.png' },
                        { id: 'granito-rojo-africa', nombre: 'Rojo áfrica', imagen: 'img/suelos/sustitucion/granito-rojo-africa.png' }
                    ]
                },
                {
                    nombre: 'Silestone',
                    opciones: [
                        { id: 'silestone-azul', nombre: 'Azul', imagen: 'img/suelos/sustitucion/silestone-azul.png' },
                        { id: 'silestone-carbono', nombre: 'Carbono', imagen: 'img/suelos/sustitucion/silestone-carbono.png' },
                        { id: 'silestone-negro-tebas', nombre: 'Negro tebas', imagen: 'img/suelos/sustitucion/silestone-negro-tebas.png' }
                    ]
                }
            ]
        },
        decoracion: {
            categorias: [
                {
                    nombre: 'Goma',
                    opciones: [
                        { id: 'goma-es5', nombre: 'ES-5', imagen: 'img/suelos/decoracion/goma-es-5.png' },
                        { id: 'goma-es6', nombre: 'ES-6', imagen: 'img/suelos/decoracion/goma-es-6.png' },
                        { id: 'goma-es8', nombre: 'ES-8', imagen: 'img/suelos/decoracion/goma-es-8.png' },
                        { id: 'goma-es9', nombre: 'ES-9', imagen: 'img/suelos/decoracion/goma-es-9.png' },
                        { id: 'goma-es1', nombre: 'ES-1', imagen: 'img/suelos/decoracion/goma-es-1.png' },
                        { id: 'goma-es2', nombre: 'ES-2', imagen: 'img/suelos/decoracion/goma-es-2.png' },
                        { id: 'goma-es3', nombre: 'ES-3', imagen: 'img/suelos/decoracion/goma-es-3.png' },
                        { id: 'goma-topos-negro', nombre: 'TOPOS NEGRO', imagen: 'img/suelos/decoracion/goma-topos-negros.png' }
                    ]
                },
                {
                    nombre: 'Silestone',
                    opciones: [
                        { id: 'silestone-white-storm', nombre: 'WHITE STORM', imagen: 'img/suelos/decoracion/silestone-white-storm.png' },
                        { id: 'silestone-blanco-city', nombre: 'BLANCO CITY', imagen: 'img/suelos/decoracion/silestone-blanco-city.png' },
                        { id: 'silestone-tigris-sand', nombre: 'TIGRIS SAND', imagen: 'img/suelos/decoracion/silestone-tigris-sand.png' },
                        { id: 'silestone-ironbark', nombre: 'IRONBARK', imagen: 'img/suelos/decoracion/silestone-ironbark.png' },
                        { id: 'silestone-gris-expo', nombre: 'GRIS EXPO', imagen: 'img/suelos/decoracion/silestone-gris-expo.png' },
                        { id: 'silestone-cemento-spa', nombre: 'CEMENTO SPA', imagen: 'img/suelos/decoracion/silestone-cemento-spa.png' },
                        { id: 'silestone-negro-tebas', nombre: 'NEGRO TEBAS', imagen: 'img/suelos/decoracion/silestone-negro-tebas.png' }
                    ]
                },
                {
                    nombre: 'Granito',
                    opciones: [
                        { id: 'granito-blanco-perla', nombre: 'BLANCO PERLA', imagen: 'img/suelos/decoracion/granito-blanco-perla.png' },
                        { id: 'granito-gris-perla', nombre: 'GRIS PERLA', imagen: 'img/suelos/decoracion/granito-gris-perla.png' },
                        { id: 'granito-mondariz', nombre: 'MONDARIZ', imagen: 'img/suelos/decoracion/granito-mondariz.png' },
                        { id: 'granito-rosa-porrino', nombre: 'ROSA PORRIÑO', imagen: 'img/suelos/decoracion/granito-rosa-porrino.png' },
                        { id: 'granito-negro-sudafrica', nombre: 'NEGRO SUDÁFRICA', imagen: 'img/suelos/decoracion/granito-negro-sudafrica.png' }
                    ]
                },
                {
                    nombre: 'Metálicos',
                    opciones: [
                        { id: 'metalico-aluminio-damero', nombre: 'ALUMINIO DAMERO', imagen: 'img/suelos/decoracion/metalico-aluminio-damero.png' },
                        { id: 'metalico-inoxidable-lagrimado', nombre: 'INOXIDABLE LAGRIMADO', imagen: 'img/suelos/decoracion/metalico-inoxidable-lagrimado.png' },
                        { id: 'metalico-lagrimado-zincado', nombre: 'LAGRIMADO ZINCADO', imagen: 'img/suelos/decoracion/metalico-lagrimado-zincado.png' },
                        { id: 'metalico-inox-treadtex', nombre: 'INOX TREADTEX', imagen: 'img/suelos/decoracion/metalico-inox-treadtex.png' }
                    ]
                }
            ]
        }
    };

    // Función para mostrar el menú inicial
    function mostrarMenuInicial() {
        document.getElementById('menu-inicial').style.display = 'flex';
    }

    function generarOpcionesSuelos(modo) {
        const contenedor = document.getElementById('suelos-content');
        const categorias = configuracionSuelos[modo].categorias;

        let html = '';

        categorias.forEach(categoria => {
            html += `
                <div class="suelo-categoria">
                    <h4 class="categoria-titulo">${categoria.nombre}</h4>
                    <div class="customization-grid suelos-grid">
            `;

            categoria.opciones.forEach(opcion => {
                // Determinar si esta opción debe estar seleccionada por defecto
                let claseSeleccionada = '';
                if ((modo === 'sustitucion' && opcion.id === 'goma-negro') ||
                    (modo === 'decoracion' && opcion.id === 'goma-es5')) {
                    claseSeleccionada = 'selected';
                }

                html += `
                    <div class="option-item suelo-opcion ${claseSeleccionada}" data-suelo="${opcion.id}">
                        <img src="${opcion.imagen}" alt="${opcion.nombre}" onerror="this.src='img/placeholder-suelo.jpg'">
                        <span>${opcion.nombre}</span>
                    </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        });

        contenedor.innerHTML = html;

        // AÑADIR: Asignar event listeners a las nuevas opciones de suelo
        asignarEventListenersSuelos();
    }

    // Función para asignar event listeners a las opciones de suelo generadas dinámicamente
    function asignarEventListenersSuelos() {
        const opcionesSueloNuevas = document.querySelectorAll('.suelo-opcion[data-suelo]');

        opcionesSueloNuevas.forEach(opcion => {
            opcion.addEventListener('click', function() {
                const material = this.dataset.suelo;

                // Remover selección de todas las opciones de suelo
                opcionesSueloNuevas.forEach(op => {
                    op.classList.remove('selected');
                });

                // Seleccionar la opción clickeada
                this.classList.add('selected');

                // Aplicar el cambio al configurador
                if (window.configurador) {
                    configurador.actualizarMaterial('suelo', material);
                    actualizarOpcionesElegidas();
                }
            });
        });
    }

    function generarOpcionesTechos(modo) {
        const contenedor = document.getElementById('bajotechos-content');
        const opciones = configuracionTechos[modo].opciones;

        let html = '<div class="suelos-grid">'; // Solo usar "suelos-grid", sin "customization-grid"

        opciones.forEach((opcion, index) => {
            let claseSeleccionada = '';
            // Marcar como seleccionada la opción por defecto según el modo
            if ((modo === 'sustitucion' && opcion.id === 'marco') ||
                (modo === 'decoracion' && opcion.id === 'l-m1')) {
                claseSeleccionada = 'selected';
            }

            html += `
                <div class="suelo-opcion ${claseSeleccionada}" data-techo="${opcion.id}">
                    <img src="${opcion.imagen}" alt="${opcion.nombre}" onerror="this.src='img/placeholder-techo.jpg'">
                    <span>${opcion.nombre}</span>
                </div>
            `;
        });

        html += '</div>';
        contenedor.innerHTML = html;

        asignarEventListenersTechos();
    }

    // Función para asignar event listeners a las opciones de techo
function asignarEventListenersTechos() {
    const opcionesTechoNuevas = document.querySelectorAll('.suelo-opcion[data-techo]'); // Cambiar selector

    opcionesTechoNuevas.forEach(opcion => {
        opcion.addEventListener('click', function() {
            const tipoTecho = this.dataset.techo;

            // Remover selección de todas las opciones
            opcionesTechoNuevas.forEach(op => {
                op.classList.remove('selected');
            });

            // Seleccionar la opción clickeada
            this.classList.add('selected');

            // Aplicar el cambio al configurador
            if (window.configurador) {
                configurador.actualizarTechoImagen(tipoTecho);
                actualizarOpcionesElegidas();
            }
        });
    });
}



    // ========== FUNCIONES PARA PAREDES ==========

    // Función para generar opciones de paredes
    function generarOpcionesParedes(modo) {
        const contenedor = document.getElementById('paredes-content');
        const modelos = configuracionParedes[modo].modelos;

        let html = '';

        // Selector de modelo (primera etapa)
        html += `
    <div class="paredes-modelo-selector">
        <div class="categoria-titulo">MODELO</div>
                <div class="modelos-grid">
        `;

        modelos.forEach((modelo, index) => {
            const claseSeleccionada = index === 0 ? 'selected' : '';
            html += `
                <div class="modelo-item ${claseSeleccionada}" data-modelo="${modelo.id}">
                    <div class="modelo-nombre">${modelo.nombre}</div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
            <div class="paredes-separador"></div>
            <div class="paredes-materiales-container" id="paredes-materiales-container">
                <!-- Los materiales se cargarán aquí dinámicamente -->
            </div>
        `;

        contenedor.innerHTML = html;

        // Establecer modelo por defecto
        modeloParedSeleccionado = modelos[0].id;

        // Cargar materiales del primer modelo
        cargarMaterialesParedes(modo, modeloParedSeleccionado);

        // Asignar event listeners
        asignarEventListenersParedes(modo);
    }

// Función para cargar materiales de paredes
function cargarMaterialesParedes(modo, modeloId) {
    const contenedor = document.getElementById('paredes-materiales-container');
    const modelo = configuracionParedes[modo].modelos.find(m => m.id === modeloId);

    if (!modelo) return;

    let html = '';

    // Sección de materiales con selector de paredes integrado
    html += `
        <div class="pared-materiales-section">
            <div class="categoria-titulo">MATERIAL</div>

            <div class="paredes-selector-container">
                <div class="categoria-titulo">Seleccione qué paredes cambiar</div>
                <div class="paredes-botones-selector">
                    <div class="pared-selector-btn selected" data-pared-target="todas">
                        <div class="pared-selector-icon">
                            <div class="icon-todas-paredes">
                                <div class="mini-pared mini-pared-izq"></div>
                                <div class="mini-pared mini-pared-centro"></div>
                                <div class="mini-pared mini-pared-der"></div>
                            </div>
                        </div>
                        <span>Todas</span>
                    </div>
                    <div class="pared-selector-btn" data-pared-target="izquierda">
                        <div class="pared-selector-icon">
                            <div class="icon-pared-individual icon-pared-izq"></div>
                        </div>
                        <span>Izquierda</span>
                    </div>
                    <div class="pared-selector-btn" data-pared-target="centro">
                        <div class="pared-selector-icon">
                            <div class="icon-pared-individual icon-pared-centro"></div>
                        </div>
                        <span>Fondo</span>
                    </div>
                    <div class="pared-selector-btn" data-pared-target="derecha">
                        <div class="pared-selector-icon">
                            <div class="icon-pared-individual icon-pared-der"></div>
                        </div>
                        <span>Derecha</span>
                    </div>
                </div>
            </div>

            <div class="customization-grid paredes-grid" style="margin-top: 15px;">
    `;

    // Obtener las opciones del tipo "todas" (que son las mismas para todos)
const categoria = modelo.categorias.find(cat => cat.tipo === 'todas');
if (categoria) {
    categoria.opciones.forEach((opcion, index) => {
        // NO seleccionar automáticamente ninguna opción
        let claseSeleccionada = '';

        // Solo marcar como seleccionada si coincide con el material actual de la pared target
        let materialComparar = null;
        if (window.configurador) {
            switch(paredTargetActual) {
                case 'izquierda':
                    materialComparar = configurador.configuracion.materiales.paredIzquierda;
                    break;
                case 'centro':
                    materialComparar = configurador.configuracion.materiales.paredCentro;
                    break;
                case 'derecha':
                    materialComparar = configurador.configuracion.materiales.paredDerecha;
                    break;
                case 'todas':
                    materialComparar = configurador.configuracion.materiales.paredes;
                    break;
            }
        }

        if (materialComparar && opcion.id === materialComparar) {
            claseSeleccionada = 'selected';
            materialParedSeleccionado = opcion.id;
        }

            html += `
                <div class="option-item pared-opcion ${claseSeleccionada}"
                     data-pared="${opcion.id}">
                    <img src="${opcion.imagen}" alt="${opcion.nombre}" onerror="this.src='img/placeholder-pared.jpg'">
                    <span>${opcion.nombre}</span>
                </div>
            `;
        });
    }

    html += `
            </div>
        </div>
    `;

    contenedor.innerHTML = html;

    // Asignar event listeners
asignarEventListenersSelectorParedes();
asignarEventListenersMaterialesParedes();

// NUEVO: Actualizar selección inicial
actualizarSeleccionMaterialParedes();
}

// Variable global para almacenar qué paredes se están modificando
let paredTargetActual = 'todas';

// Función para manejar los selectores de pared
function asignarEventListenersSelectorParedes() {
    const botones = document.querySelectorAll('.pared-selector-btn');

    botones.forEach(boton => {
        boton.addEventListener('click', function() {
            // Remover selección de todos los botones
            botones.forEach(b => b.classList.remove('selected'));

            // Seleccionar el botón clickeado
            this.classList.add('selected');

            // Actualizar el target actual
paredTargetActual = this.dataset.paredTarget;

// NUEVO: Actualizar la selección visual de materiales
actualizarSeleccionMaterialParedes();

console.log('Pared target seleccionado:', paredTargetActual);
        });
    });
}

// NUEVA FUNCIÓN COMPLETA
function actualizarSeleccionMaterialParedes() {
    if (!window.configurador) return;

    // Obtener el material actual de la pared seleccionada
    let materialActual;
    switch(paredTargetActual) {
        case 'izquierda':
            materialActual = configurador.configuracion.materiales.paredIzquierda ||
                           configurador.configuracion.materiales.paredes;
            break;
        case 'centro':
            materialActual = configurador.configuracion.materiales.paredCentro ||
                           configurador.configuracion.materiales.paredes;
            break;
        case 'derecha':
            materialActual = configurador.configuracion.materiales.paredDerecha ||
                           configurador.configuracion.materiales.paredes;
            break;
        case 'todas':
        default:
            materialActual = configurador.configuracion.materiales.paredes;
            break;
    }

    // Actualizar la selección visual en el DOM
    const opcionesParedNuevas = document.querySelectorAll('.pared-opcion[data-pared]');

    opcionesParedNuevas.forEach(op => {
        op.classList.remove('selected');

        // Seleccionar la opción que coincide con el material actual
        if (op.dataset.pared === materialActual) {
            op.classList.add('selected');
        }
    });

    console.log(`Material actual para ${paredTargetActual}:`, materialActual);
}

// Event listeners para paredes
function asignarEventListenersParedes(modo) {
    // Event listeners para selección de modelo
    const modelosItems = document.querySelectorAll('.modelo-item[data-modelo]');

    modelosItems.forEach(item => {
        item.addEventListener('click', function() {
            const modelo = this.dataset.modelo;

            // Remover selección de todos los modelos
            modelosItems.forEach(m => m.classList.remove('selected'));

            // Seleccionar el modelo clickeado
            this.classList.add('selected');

           // Actualizar modelo seleccionado
modeloParedSeleccionado = modelo;
materialParedSeleccionado = null;

// NO limpiar materiales - mantener las configuraciones existentes

            // Resetear el selector de paredes a "todas"
            paredTargetActual = 'todas';
            const botonesPared = document.querySelectorAll('.pared-selector-btn');
            botonesPared.forEach(btn => {
                btn.classList.remove('selected');
                if (btn.dataset.paredTarget === 'todas') {
                    btn.classList.add('selected');
                }
            });

            // Cargar materiales del nuevo modelo
            cargarMaterialesParedes(modo, modelo);
        });
    });
}

    function asignarEventListenersMaterialesParedes() {
        const opcionesParedNuevas = document.querySelectorAll('.pared-opcion[data-pared]');

        opcionesParedNuevas.forEach(opcion => {
            opcion.addEventListener('click', function() {
                const material = this.dataset.pared;

                // Remover selección de todas las opciones
                opcionesParedNuevas.forEach(op => {
                    op.classList.remove('selected');
                });

                // Seleccionar la opción clickeada
                this.classList.add('selected');

                // Aplicar el cambio al configurador según el target seleccionado
                if (window.configurador) {
                    console.log(`Aplicando material ${material} a ${paredTargetActual}`);

                    if (paredTargetActual === 'todas') {
                        // Aplicar a todas las paredes
                        configurador.actualizarMaterial('paredes', material);
                        materialParedSeleccionado = material;
                        // Limpiar configuraciones individuales para evitar conflictos
                        configurador.configuracion.materiales.paredIzquierda = null;
                        configurador.configuracion.materiales.paredCentro = null;
                        configurador.configuracion.materiales.paredDerecha = null;
                    } else {
                        // Aplicar solo a la pared específica
                        configurador.actualizarMaterialParedEspecifica(paredTargetActual, material);
                    }

                    actualizarOpcionesElegidas();
                }
            });
        });
    }

    // Event listeners para el menú inicial
    document.querySelectorAll('.menu-inicial-opcion').forEach(opcion => {
        opcion.addEventListener('click', function() {
            modoSeleccionado = this.dataset.modo;
            modoActual = modoSeleccionado; // AÑADIR ESTA LÍNEA

            const menuInicial = document.getElementById('menu-inicial');
            const loadingScreen = document.getElementById('loading-fullscreen');

            // PRIMERO: Mostrar la pantalla de carga INMEDIATAMENTE con opacidad completa
            loadingScreen.style.display = 'flex';
            loadingScreen.style.opacity = '1';

            // DESPUÉS: Ocultar el menú inicial
            setTimeout(() => {
                menuInicial.style.display = 'none';
            }, 100);

            // Inicializar el configurador después de un breve retraso
            setTimeout(() => {
                // Si el configurador no existe, lo creamos ahora
                if (!window.configurador) {
                    window.configurador = new Configurador();
                    window.exportadorPDF = new ExportadorPDF();
                    window.visualizadorVertices = new VisualizadorVertices(window.configurador);
                }

    // Generar las opciones de suelo según el modo
    generarOpcionesSuelos(modoSeleccionado);

    // Generar las opciones de paredes según el modo
    generarOpcionesParedes(modoSeleccionado);

    // Generar las opciones de techo según el modo
    generarOpcionesTechos(modoSeleccionado);

    // Guardar el modo en el configurador
                // Guardar el modo en el configurador
                window.configurador.modoServicio = modoSeleccionado;

                // ACTUALIZAR EL INDICADOR VISUAL DEL MODO
                actualizarIndicadorModo(modoSeleccionado);

                // Establecer el suelo por defecto según el modo
if (modoSeleccionado === 'sustitucion') {
    window.configurador.actualizarMaterial('suelo', 'goma-negro');
    window.configurador.actualizarMaterial('paredes', 'inox-cepillado');
    window.configurador.actualizarTechoImagen('marco');

    // Espejos
    window.configurador.configuracion.espejo.frontal = 'medio';
    window.configurador.configuracion.espejo.lateral = 'no';
    window.configurador.actualizarEspejos();

    // Botonera
    window.configurador.configuracion.botonera.modelo = 'columna';
    window.configurador.actualizarBotonera();

    // Pasamanos
    window.configurador.configuracion.pasamanos.frontal = false;
    window.configurador.configuracion.pasamanos.derecha = false;
    window.configurador.actualizarPasamanos();

} else if (modoSeleccionado === 'decoracion') {
    window.configurador.actualizarMaterial('suelo', 'goma-es5');
    window.configurador.actualizarMaterial('paredes', 'inoxdec-satinado');
    window.configurador.actualizarTechoImagen('l-m1');

    // Espejos
    window.configurador.configuracion.espejo.frontal = 'medio';
    window.configurador.configuracion.espejo.lateral = 'no';
    window.configurador.actualizarEspejos();

    // Botonera
    window.configurador.configuracion.botonera.modelo = 'columna';
    window.configurador.actualizarBotonera();

    // Pasamanos
    window.configurador.configuracion.pasamanos.frontal = false;
    window.configurador.configuracion.pasamanos.derecha = false;
    window.configurador.actualizarPasamanos();
}

// Actualizar la selección visual en los menús
actualizarSeleccionesVisualesMenus(modoSeleccionado);
                // Esperar a que el configurador esté listo
                // Esperar a que el configurador esté listo
                setTimeout(() => {
                    // Ocultar pantalla de carga
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';

                        // Activar los menús laterales
                        document.getElementById('customization-menu-level-1').classList.add('active');
                        document.getElementById('detail-menu').classList.add('active');

                        // Actualizar el panel de opciones
                        actualizarOpcionesElegidas();
                    }, 500);
                }, 2000); // Tiempo para cargar el configurador
            }, 500);
        });
    });

    // // Modificar la inicialización para mostrar el menú inicial después de cargar
    // setTimeout(function() {
    //     document.getElementById('loading-fullscreen').style.display = 'none';

    //     // Mostrar el menú inicial
    //     mostrarMenuInicial();

    //     // Los menús laterales NO se activan hasta seleccionar un modo
    // }, 1500);

        // Inicialmente ocultamos la pantalla de carga
        setTimeout(function() {
        document.getElementById('loading-fullscreen').style.display = 'none';

        // Asegurar que los menús estén activos después de quitar la pantalla de carga
        document.getElementById('customization-menu-level-1').classList.add('active');
        document.getElementById('detail-menu').classList.add('active');
    }, 1500);

        // NO inicializar nada aquí - se hará después de seleccionar el modo
        // Solo mostrar el menú inicial
        mostrarMenuInicial();

        // Referencias a elementos del DOM
    const detailMenu = document.getElementById('detail-menu');
    const detailMenuDeploy = document.getElementById('detail-menu-deploy');

    // Referencias para el botón de modo
    const btnModo = document.getElementById('top-menu-modo-button');
    const btnModoSustitucion = document.getElementById('top-menu-modo-sustitucion');
    const btnModoDecoracion = document.getElementById('top-menu-modo-decoracion');
        const customizationMenuL1 = document.getElementById('customization-menu-level-1');
        const customizationMenusL2 = document.querySelectorAll('.customization-menu-level-2');

        // Botones del menú de nivel 1
    const btnDimension = document.getElementById('customization-menu-dimension-button');
    const btnEntorno = document.getElementById('customization-menu-entorno-button');
    const btnParedes = document.getElementById('customization-menu-paredes-button');
    const btnBajotechos = document.getElementById('customization-menu-bajotechos-button');
    const btnSuelos = document.getElementById('customization-menu-suelos-button');
    const btnEspejos = document.getElementById('customization-menu-espejos-button');
    const btnBotoneras = document.getElementById('customization-menu-botoneras-button');
    const btnPasamanos = document.getElementById('customization-menu-pasamanos-button');

    // Almacenar todos los botones del menú nivel 1 en un array para facilitar el manejo
    const menuButtonsL1 = [
        btnDimension, btnEntorno, btnParedes, btnBajotechos,
        btnSuelos, btnEspejos, btnBotoneras, btnPasamanos
    ];

        // Botones de cámaras
        const btnCamara0 = document.getElementById('top-menu-camera-0');
        const btnCamara1 = document.getElementById('top-menu-camera-1');
        const btnCamara2 = document.getElementById('top-menu-camera-2');
        const btnCamara3 = document.getElementById('top-menu-camera-3');
// Añadir botones de desarrollo solo si el modo desarrollador está activo
if (typeof MODO_DESARROLLADOR !== 'undefined' && MODO_DESARROLLADOR) {
    // Añadir botón para activar el visualizador de vértices en la barra de menú
    const topMenuBarList = document.querySelector('.top-menu-bar .top-menu-content ul');
    const liVisualizer = document.createElement('li');
    liVisualizer.innerHTML = '<span id="top-menu-visualizer-button"><i class="fas fa-cube"></i> Visualizador</span>';
    topMenuBarList.appendChild(liVisualizer);

    // Añadir event listener al botón del visualizador
    document.getElementById('top-menu-visualizer-button').addEventListener('click', function() {
        visualizadorVertices.mostrarPanel();
    });

    // Añadir botón para activar el modo edición
    const liEditar = document.createElement('li');
    liEditar.innerHTML = '<span id="top-menu-editar-button"><i class="fas fa-edit"></i> Editar</span>';
    topMenuBarList.appendChild(liEditar);

    // Variable para controlar el estado del modo edición
    let modoEdicion = false;

    // Añadir event listener al botón de editar
    document.getElementById('top-menu-editar-button').addEventListener('click', function() {
        modoEdicion = !modoEdicion;

        if (modoEdicion) {
            // Activar modo edición
            configurador.activarModoEdicion();
            this.style.backgroundColor = 'rgba(255, 210, 0, 0.2)';
            this.style.color = '#ffd200';
        } else {
            // Desactivar modo edición
            configurador.desactivarModoEdicion();
            this.style.backgroundColor = '';
            this.style.color = '';
        }
    });

    // Añadir botón para el modo recorte
    const liRecortar = document.createElement('li');
    liRecortar.innerHTML = '<span id="top-menu-recortar-button"><i class="fas fa-crop-alt"></i> Recortar</span>';
    topMenuBarList.appendChild(liRecortar);

    // Variable para controlar el estado del modo recorte
    let modoRecorte = false;
    let modoRecorteManager = null;

    // Añadir event listener al botón de recortar
    document.getElementById('top-menu-recortar-button').addEventListener('click', function() {
        modoRecorte = !modoRecorte;

        // Inicializar el manager si no existe
        if (!modoRecorteManager && window.configurador) {
            modoRecorteManager = new ModoRecorte(window.configurador);
        }

        if (modoRecorte) {
            // Activar modo recorte
            if (modoRecorteManager) {
                modoRecorteManager.activar();
                this.style.backgroundColor = 'rgba(255, 210, 0, 0.2)';
                this.style.color = '#ffd200';
            }
        } else {
            // Desactivar modo recorte
            if (modoRecorteManager) {
                modoRecorteManager.desactivar();
                this.style.backgroundColor = '';
                this.style.color = '';
            }
        }
    });
}

        // Botón de reinicio
        const btnReiniciar = document.getElementById('top-menu-restart-button');

        // Botón para generar PDF
        const btnGenerarPDF = document.getElementById('generar-pdf');

        // Entradas de dimensiones
        // Entradas de dimensiones
        const inputAnchura = document.getElementById('emesa-anchura');
        const inputProfundidad = document.getElementById('emesa-profundidad');
        const btnAplicarDimensiones = document.getElementById('aplicar-dimensiones');

        // Función para validar y corregir valores en tiempo real
        function validarDimension(input, min, max) {
            let valor = parseInt(input.value);

            if (isNaN(valor)) {
                input.value = min;
                return;
            }

            if (valor < min) {
                input.value = min;
            } else if (valor > max) {
                input.value = max;
            }
        }

        // Event listeners para validación en tiempo real
        inputAnchura.addEventListener('input', function() {
            // Permitir que el usuario escriba, pero no validar hasta que termine
        });

        inputAnchura.addEventListener('blur', function() {
            validarDimension(this, 650, 1600);
        });

        inputAnchura.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                validarDimension(this, 650, 1600);
                document.getElementById('aplicar-dimensiones').click();
            }
        });

        inputProfundidad.addEventListener('input', function() {
            // Permitir que el usuario escriba
        });

        inputProfundidad.addEventListener('blur', function() {
            validarDimension(this, 650, 2100);
        });

        inputProfundidad.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                validarDimension(this, 650, 2100);
                document.getElementById('aplicar-dimensiones').click();
            }
        });

        // Opciones de modelos
        const opcionesModelo = document.querySelectorAll('[data-modelo]');

        // Opciones de paredes
        const opcionesParedes = document.querySelectorAll('[data-pared]');

        // Opciones de suelo
        const opcionesSuelo = document.querySelectorAll('[data-suelo]');

        // Opciones de techo
        const opcionesTecho = document.querySelectorAll('[data-techo]');
        const opcionesTechoMaterial = document.querySelectorAll('[data-techo-material]');

        // Opciones de perfilería
        const opcionesPerfileria = document.querySelectorAll('[data-perfileria]');

        // Opciones de pasamanos
        // Opciones de pasamanos
    const checkPasamanosFondo = document.getElementById('pasamanos-fondo');
    const checkPasamanosLateral = document.getElementById('pasamanos-lateral');


        // Opciones de botonera
        const opcionesBotonera = document.querySelectorAll('[data-botonera]');
        const opcionesBotoneraMaterial = document.querySelectorAll('[data-botonera-material]');

        // Opciones de LEDs
        const checkLedEsquinas = document.getElementById('customization-led-esquinas-traseras');
        const checkLedBotonera = document.getElementById('customization-led-botonera');
        const checkLedZocaloSup = document.getElementById('customization-led-zocalo-superior');
        const checkLedZocaloInf = document.getElementById('customization-led-zocalo-inferior');

        // Opciones de entorno
        const opcionesEntorno = document.querySelectorAll('[data-entorno]');

        // Secciones plegables
        const secciones = document.querySelectorAll('.customization-section');

        // Estado de la interfaz
        let menuL2Activo = null;
        let botonActivo = null;

        // Ajusta la altura de los menús de nivel 2 según su contenido
        function ajustarAlturaMenusL2() {
            customizationMenusL2.forEach(menu => {
                // Establecemos altura automática en vez de 100%
                menu.style.height = 'auto';
                menu.style.maxHeight = 'none';
                // Aseguramos que la posición es correcta
                menu.style.top = '0';
            });
        }

        // Función para actualizar las selecciones visuales en los menús
function actualizarSeleccionesVisualesMenus(modo) {
    // Actualizar espejo frontal
    const opcionesEspejoFrontal = document.querySelectorAll('[data-espejo-fondo]');
    opcionesEspejoFrontal.forEach(op => {
        op.style.border = '3px solid #ddd';
        op.style.opacity = '0.6';
        op.classList.remove('selected');
        const check = op.querySelector('div[style*="border-radius: 50%"]');
        if (check) check.remove();

        if (op.dataset.espejoFondo === 'medio') {
            op.style.border = '3px solid #0b0b5e';
            op.style.opacity = '1';
            op.classList.add('selected');
            const checkDiv = document.createElement('div');
            checkDiv.style.cssText = "position: absolute; top: 5px; right: 5px; width: 20px; height: 20px; border-radius: 50%; background-color: #0b0b5e; color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;";
            checkDiv.textContent = '✓';
            op.appendChild(checkDiv);
        }
    });

    // Actualizar espejo lateral
    const opcionesEspejoLateral = document.querySelectorAll('[data-espejo-lateral]');
    opcionesEspejoLateral.forEach(op => {
        op.style.border = '3px solid #ddd';
        op.style.opacity = '0.6';
        op.classList.remove('selected');
        const check = op.querySelector('div[style*="border-radius: 50%"]');
        if (check) check.remove();

        if (op.dataset.espejoLateral === 'no') {
            op.style.border = '3px solid #0b0b5e';
            op.style.opacity = '1';
            op.classList.add('selected');
            const checkDiv = document.createElement('div');
            checkDiv.style.cssText = "position: absolute; top: 5px; right: 5px; width: 20px; height: 20px; border-radius: 50%; background-color: #0b0b5e; color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;";
            checkDiv.textContent = '✓';
            op.appendChild(checkDiv);
        }
    });

    // Actualizar botonera
    const opcionesBotoneraItems = document.querySelectorAll('.botonera-item');
    opcionesBotoneraItems.forEach(op => {
        op.style.border = '3px solid #ddd';
        op.style.opacity = '0.6';
        op.classList.remove('selected');
        const check = op.querySelector('div[style*="border-radius: 50%"]');
        if (check) check.remove();

        if (op.dataset.botonera === 'columna') {
            op.style.border = '3px solid #0b0b5e';
            op.style.opacity = '1';
            op.classList.add('selected');
            const checkDiv = document.createElement('div');
            checkDiv.style.cssText = "position: absolute; top: 5px; right: 5px; width: 20px; height: 20px; border-radius: 50%; background-color: #0b0b5e; color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;";
            checkDiv.textContent = '✓';
            op.appendChild(checkDiv);
        }
    });

    // Actualizar pasamanos
    if (document.getElementById('pasamanos-fondo')) {
        document.getElementById('pasamanos-fondo').checked = false;
        const pasamanosItemFondo = document.getElementById('pasamanos-fondo').closest('.pasamanos-item');
        pasamanosItemFondo.style.border = '3px solid #ddd';
        pasamanosItemFondo.style.opacity = '0.6';
        pasamanosItemFondo.style.backgroundColor = 'white';
    }

    if (document.getElementById('pasamanos-lateral')) {
        document.getElementById('pasamanos-lateral').checked = false;
        const pasamanosItemLateral = document.getElementById('pasamanos-lateral').closest('.pasamanos-item');
        pasamanosItemLateral.style.border = '3px solid #ddd';
        pasamanosItemLateral.style.opacity = '0.6';
        pasamanosItemLateral.style.backgroundColor = 'white';
    }
}

        // Función para actualizar los textos de las opciones elegidas
        function actualizarOpcionesElegidas() {
            try {
                // Verificar que el configurador existe
                if (!window.configurador || !window.configurador.configuracion) {
                    console.log("El configurador aún no está disponible");
                    return;
                }

                const configurador = window.configurador;

            // Verificar la existencia de cada elemento antes de actualizarlo

            // Modelo
            const modeloEl = document.getElementById('options-modelo');
            if (modeloEl) modeloEl.textContent = configurador.configuracion.modelo;

            // Dimensiones
const anchuraEl = document.getElementById('options-anchura');
if (anchuraEl) anchuraEl.textContent = configurador.configuracion.dimensiones.ancho + ' mm';

const profundidadEl = document.getElementById('options-profundidad');
if (profundidadEl) profundidadEl.textContent = configurador.configuracion.dimensiones.profundidad + ' mm';



            // Paredes
const paredIzquierdaEl = document.getElementById('options-paredIzquierda');
if (paredIzquierdaEl) paredIzquierdaEl.textContent = configurador.configuracion.materiales.paredIzquierda || configurador.configuracion.materiales.paredes;

const paredFrontalEl = document.getElementById('options-paredFrontal');
if (paredFrontalEl) paredFrontalEl.textContent = configurador.configuracion.materiales.paredCentro || configurador.configuracion.materiales.paredes;

const paredDerechaEl = document.getElementById('options-paredDerecha');
if (paredDerechaEl) paredDerechaEl.textContent = configurador.configuracion.materiales.paredDerecha || configurador.configuracion.materiales.paredes;

            // Suelo
            const sueloEl = document.getElementById('options-suelo');
            if (sueloEl) sueloEl.textContent = configurador.configuracion.materiales.suelo;

            // Perfilería
            const perfileriaEl = document.getElementById('options-perfileria');
            if (perfileriaEl) perfileriaEl.textContent = configurador.configuracion.perfileria;

            // Techo
const bajoTechosEl = document.getElementById('options-bajotechos');
if (bajoTechosEl) bajoTechosEl.textContent = configurador.configuracion.iluminacion;

            // Pasamanos
    const pasamanosFondoEl = document.getElementById('options-pasamanosFondo');
    if (pasamanosFondoEl) pasamanosFondoEl.textContent = configurador.configuracion.pasamanos.frontal ? 'Sí' : 'No';

    const pasamanosLateralEl = document.getElementById('options-pasamanosLateral');
    if (pasamanosLateralEl) pasamanosLateralEl.textContent = configurador.configuracion.pasamanos.derecha ? 'Sí' : 'No';

            // Espejos
    // Espejos
    const espejoFrontalEl = document.getElementById('options-espejoFrontal');
    if (espejoFrontalEl) {
        const tipoFrontal = configurador.configuracion.espejo.frontal;
        espejoFrontalEl.textContent = tipoFrontal === 'no' ? 'No' :
            tipoFrontal.charAt(0).toUpperCase() + tipoFrontal.slice(1).replace('-', ' ');
    }

    const espejoLateralEl = document.getElementById('options-espejoLateral');
    if (espejoLateralEl) {
        const tipoLateral = configurador.configuracion.espejo.lateral;
        espejoLateralEl.textContent = tipoLateral === 'no' ? 'No' :
            tipoLateral.charAt(0).toUpperCase() + tipoLateral.slice(1).replace('-', ' ');
    }

            // Verificar si existe la propiedad acristalado antes de intentar acceder
            if (configurador.configuracion.acristalado) {
                const acristaladoFrontalEl = document.getElementById('options-acristaladoFrontal');
                if (acristaladoFrontalEl) acristaladoFrontalEl.textContent = configurador.configuracion.acristalado.frontal ? 'Sí' : 'No';

                const acristaladoLateralEl = document.getElementById('options-acristaladoLateral');
                if (acristaladoLateralEl) acristaladoLateralEl.textContent = configurador.configuracion.acristalado.lateral ? 'Sí' : 'No';
            }

            // Botonera
            const botoneraEl = document.getElementById('options-botonera');
            if (botoneraEl) botoneraEl.textContent = configurador.configuracion.botonera.modelo;

            const botoneraMaterialEl = document.getElementById('options-botoneraMaterial');
            if (botoneraMaterialEl) botoneraMaterialEl.textContent = configurador.configuracion.botonera.material;

            // Iluminación LED
            const ledEsquinasTraserasEl = document.getElementById('options-ledEsquinasTraseras');
            if (ledEsquinasTraserasEl) ledEsquinasTraserasEl.textContent = configurador.configuracion.leds.esquinas ? 'Sí' : 'No';

            const ledBotoneraEl = document.getElementById('options-ledBotonera');
            if (ledBotoneraEl) ledBotoneraEl.textContent = configurador.configuracion.leds.botonera ? 'Sí' : 'No';

            const ledZocaloSuperiorEl = document.getElementById('options-ledZocaloSuperior');
            if (ledZocaloSuperiorEl) ledZocaloSuperiorEl.textContent = configurador.configuracion.leds.zocaloSuperior ? 'Sí' : 'No';

            const ledZocaloInferiorEl = document.getElementById('options-ledZocaloInferior');
            if (ledZocaloInferiorEl) ledZocaloInferiorEl.textContent = configurador.configuracion.leds.zocaloInferior ? 'Sí' : 'No';

            console.log("Opciones actualizadas correctamente");
        } catch (error) {
            console.log("Error en actualizarOpcionesElegidas (configurador no disponible):", error.message);
        }
    }
    // Función para mostrar u ocultar un menú de nivel 2
    function toggleMenuL2(id, button) {
        // Primero cerramos TODOS los menús nivel 2 completamente
        customizationMenusL2.forEach(menu => {
            menu.classList.remove('active');
            // Asegurar que estén invisibles y no interactuables
            menu.style.display = 'none';
            menu.style.pointerEvents = 'none';
            menu.style.zIndex = '-1';
        });

        // Si hay un botón activo, le quitamos la clase 'active'
        if (botonActivo) {
            botonActivo.classList.remove('active');
        }

        // Si el mismo botón está activo, ocultamos el menú y quitamos el estado activo
        if (menuL2Activo === id && botonActivo === button) {
            menuL2Activo = null;
            botonActivo = null;
            return;
        }

        // Mostramos el menú seleccionado
        const menu = document.getElementById(id);
        if (menu) {
            // Pequeño delay para asegurar que los otros menús se han cerrado
            setTimeout(() => {
                // Hacer el menú visible e interactuable
                menu.style.display = 'block';
                menu.style.pointerEvents = 'auto';
                menu.style.zIndex = '6';
                menu.style.top = '0';

                // Añadir la clase active después de hacerlo visible
                requestAnimationFrame(() => {
                    menu.classList.add('active');
                });
            }, 50);

            menuL2Activo = id;

            // Marcamos el botón como activo
            button.classList.add('active');
            botonActivo = button;
        }
    }

        // Función para seleccionar una opción
    // Función para seleccionar una opción (actualizada para soportar múltiples clases)
    function seleccionarOpcion(opciones, opcion) {
        opciones.forEach(op => {
            op.classList.remove('selected');
        });
        opcion.classList.add('selected');
    }

        // Event Listeners para los botones de despliegue
        detailMenuDeploy.addEventListener('click', function() {
            detailMenu.classList.toggle('active');
        });

        // Comentado: El menú permanecerá siempre abierto
        // customizationMenuL1Deploy.addEventListener('click', function() { ... });

        // Event Listeners para los botones del menú nivel 1

        btnDimension.addEventListener('click', function() {
            toggleMenuL2('customization-menu-dimension', this);
        });

        btnEntorno.addEventListener('click', function() {
            toggleMenuL2('customization-menu-entorno', this);
        });

        btnParedes.addEventListener('click', function() {
            toggleMenuL2('customization-menu-paredes', this);
        });

        btnBajotechos.addEventListener('click', function() {
            toggleMenuL2('customization-menu-bajotechos', this);
        });

        btnSuelos.addEventListener('click', function() {
            toggleMenuL2('customization-menu-suelos', this);
        });

        btnPasamanos.addEventListener('click', function() {
            toggleMenuL2('customization-menu-pasamanos', this);
        });

        btnEspejos.addEventListener('click', function() {
            toggleMenuL2('customization-menu-espejos', this);
        });

        btnBotoneras.addEventListener('click', function() {
            toggleMenuL2('customization-menu-botoneras', this);
        });


        // Event Listeners para las cámaras
        btnCamara0.addEventListener('click', function() {
            configurador.cambiarVistaCamara('principal');
        });

        btnCamara1.addEventListener('click', function() {
            configurador.cambiarVistaCamara('interior');
        });

        btnCamara2.addEventListener('click', function() {
            configurador.cambiarVistaCamara('izquierda');
        });

        btnCamara3.addEventListener('click', function() {
            configurador.cambiarVistaCamara('derecha');
        });

// Event Listeners para reiniciar
btnReiniciar.addEventListener('click', function() {
    // Mostrar popup de confirmación
    document.getElementById('restart-confirmation-popup').style.display = 'block';
});

// Event listeners para los botones del popup de confirmación
document.getElementById('restart-cancel-btn').addEventListener('click', function() {
    document.getElementById('restart-confirmation-popup').style.display = 'none';
});

document.getElementById('restart-confirm-btn').addEventListener('click', function() {
    // Ocultar popup
    document.getElementById('restart-confirmation-popup').style.display = 'none';

    // Ejecutar reinicio
    configurador.reiniciar();

    // Reiniciamos los controles visuales
    document.querySelectorAll('.option-item.selected').forEach(item => {
        item.classList.remove('selected');
    });

    inputAnchura.value = configurador.configuracion.dimensiones.ancho;
    inputProfundidad.value = configurador.configuracion.dimensiones.profundidad;

    if (checkPasamanosFondo) checkPasamanosFondo.checked = false;
    if (checkPasamanosLateral) checkPasamanosLateral.checked = false;

    checkLedEsquinas.checked = false;
    checkLedBotonera.checked = false;
    checkLedZocaloSup.checked = false;
    checkLedZocaloInf.checked = false;

    if (window.configurador) {
        actualizarOpcionesElegidas();
    }
});
        // Event Listener para el botón de PDF
        btnGenerarPDF.addEventListener('click', function() {
            // Obtenemos el canvas del renderizador
            const canvas = configurador.renderer.domElement;

            // Exportamos la configuración a PDF
            exportadorPDF.exportarPDF(configurador.configuracion, canvas);
        });

        // Event Listener para aplicar dimensiones
        btnAplicarDimensiones.addEventListener('click', function() {
            // Validar antes de aplicar
            validarDimension(inputAnchura, 650, 1600);
            validarDimension(inputProfundidad, 650, 2100);

            const ancho = parseInt(inputAnchura.value);
            const profundidad = parseInt(inputProfundidad.value);
            const alto = 2200; // Altura fija

            if (ancho && profundidad) {
                configurador.actualizarDimensiones(ancho, profundidad, alto);
                if (window.configurador) {
                    actualizarOpcionesElegidas();
                }
            }
        });
        // Event Listeners para las opciones de modelo
        opcionesModelo.forEach(opcion => {
            opcion.addEventListener('click', function() {
                const modelo = this.dataset.modelo;
                seleccionarOpcion(opcionesModelo, this);
                configurador.cambiarModelo(modelo);
                if (window.configurador) {
                    actualizarOpcionesElegidas();
                }
            });
        });

        // Event Listeners para las opciones de paredes
        opcionesParedes.forEach(opcion => {
            opcion.addEventListener('click', function() {
                const material = this.dataset.pared;
                seleccionarOpcion(opcionesParedes, this);
                configurador.actualizarMaterial('paredes', material);
                if (window.configurador) {
                    actualizarOpcionesElegidas();
                }
            });
        });

        opcionesSuelo.forEach(opcion => {
            opcion.addEventListener('click', function() {
                const material = this.dataset.suelo;
                seleccionarOpcion(opcionesSuelo, this);
                configurador.actualizarMaterial('suelo', material);
                if (window.configurador) {
                    actualizarOpcionesElegidas();
                }
            });
        });



        // Event Listeners para las opciones de perfilería
        opcionesPerfileria.forEach(opcion => {
            opcion.addEventListener('click', function() {
                const tipo = this.dataset.perfileria;
                seleccionarOpcion(opcionesPerfileria, this);
                configurador.actualizarPerfileria(tipo);
                if (window.configurador) {
                    actualizarOpcionesElegidas();
                }
            });
        });

    // Event Listeners para las opciones de pasamanos
    if (checkPasamanosFondo) {
        checkPasamanosFondo.addEventListener('change', function() {
            configurador.configuracion.pasamanos.frontal = this.checked;
            configurador.actualizarPasamanos();
            if (window.configurador) {
                actualizarOpcionesElegidas();
            }

            // Actualizar estado visual
            const pasamanosItem = this.closest('.pasamanos-item');
            if (this.checked) {
                pasamanosItem.style.border = '3px solid #0b0b5e';
                pasamanosItem.style.opacity = '1';
                pasamanosItem.style.backgroundColor = 'rgba(11, 11, 94, 0.02)';
            } else {
                pasamanosItem.style.border = '3px solid #ddd';
                pasamanosItem.style.opacity = '0.6';
                pasamanosItem.style.backgroundColor = 'white';
            }
        });

        // Hacer clic en todo el div active el checkbox
        const fondoDiv = checkPasamanosFondo.closest('.pasamanos-item');
        fondoDiv.addEventListener('click', function(e) {
            if (e.target.type !== 'checkbox') {
                checkPasamanosFondo.click();
            }
        });
    }

    if (checkPasamanosLateral) {
        checkPasamanosLateral.addEventListener('change', function() {
            configurador.configuracion.pasamanos.derecha = this.checked;
            configurador.actualizarPasamanos();
            if (window.configurador) {
                actualizarOpcionesElegidas();
            }

            // Actualizar estado visual
            const pasamanosItem = this.closest('.pasamanos-item');
            if (this.checked) {
                pasamanosItem.style.border = '3px solid #0b0b5e';
                pasamanosItem.style.opacity = '1';
                pasamanosItem.style.backgroundColor = 'rgba(11, 11, 94, 0.02)';
            } else {
                pasamanosItem.style.border = '3px solid #ddd';
                pasamanosItem.style.opacity = '0.6';
                pasamanosItem.style.backgroundColor = 'white';
            }
        });

        // Hacer clic en todo el div active el checkbox
        const lateralDiv = checkPasamanosLateral.closest('.pasamanos-item');
        lateralDiv.addEventListener('click', function(e) {
            if (e.target.type !== 'checkbox') {
                checkPasamanosLateral.click();
            }
        });
    }

    // Event Listeners para las opciones de espejos
    const opcionesEspejoFrontal = document.querySelectorAll('[data-espejo-fondo]');
    const opcionesEspejoLateral = document.querySelectorAll('[data-espejo-lateral]');

    if (opcionesEspejoFrontal && opcionesEspejoFrontal.length > 0) {
        opcionesEspejoFrontal.forEach(opcion => {
            opcion.addEventListener('click', function() {
                const tipo = this.dataset.espejoFondo;
                // Actualizar bordes, opacidad y remover checks
                opcionesEspejoFrontal.forEach(op => {
                    op.style.border = '3px solid #ddd';
                    op.style.opacity = '0.6';
                    op.classList.remove('selected');
                    // Remover el check si existe
                    const check = op.querySelector('div[style*="border-radius: 50%"]');
                    if (check) check.remove();
                });
                // Aplicar estilos al seleccionado
                this.style.border = '3px solid #0b0b5e';
                this.style.opacity = '1';
                this.classList.add('selected');
                // Añadir el check
                const checkDiv = document.createElement('div');
                checkDiv.style.cssText = "position: absolute; top: 5px; right: 5px; width: 20px; height: 20px; border-radius: 50%; background-color: #0b0b5e; color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;";
                checkDiv.textContent = '✓';
                this.appendChild(checkDiv);

                configurador.configuracion.espejo.frontal = tipo;
                configurador.actualizarEspejos();
                actualizarOpcionesElegidas();
            });
        });
    }

    if (opcionesEspejoLateral && opcionesEspejoLateral.length > 0) {
        opcionesEspejoLateral.forEach(opcion => {
            opcion.addEventListener('click', function() {
                const tipo = this.dataset.espejoLateral;
                // Actualizar bordes, opacidad y remover checks
                opcionesEspejoLateral.forEach(op => {
                    op.style.border = '3px solid #ddd';
                    op.style.opacity = '0.6';
                    op.classList.remove('selected');
                    // Remover el check si existe
                    const check = op.querySelector('div[style*="border-radius: 50%"]');
                    if (check) check.remove();
                });
                // Aplicar estilos al seleccionado
                this.style.border = '3px solid #0b0b5e';
                this.style.opacity = '1';
                this.classList.add('selected');
                // Añadir el check
                const checkDiv = document.createElement('div');
                checkDiv.style.cssText = "position: absolute; top: 5px; right: 5px; width: 20px; height: 20px; border-radius: 50%; background-color: #0b0b5e; color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;";
                checkDiv.textContent = '✓';
                this.appendChild(checkDiv);

                configurador.configuracion.espejo.lateral = tipo;
                configurador.actualizarEspejos();
                actualizarOpcionesElegidas();
            });
        });
    }

    // Event Listeners para las opciones de botonera
    // Event Listeners para las opciones de botonera
    const opcionesBotoneraItems = document.querySelectorAll('.botonera-item');
    if (opcionesBotoneraItems && opcionesBotoneraItems.length > 0) {
        opcionesBotoneraItems.forEach(item => {
            item.addEventListener('click', function() {
                const tipo = this.dataset.botonera;

                // Actualizar estilos visuales
                opcionesBotoneraItems.forEach(op => {
                    op.style.border = '3px solid #ddd';
                    op.style.opacity = '0.6';
                    op.classList.remove('selected');
                    // Remover el check si existe
                    const check = op.querySelector('div[style*="border-radius: 50%"]');
                    if (check) check.remove();
                });

                this.style.border = '3px solid #0b0b5e';
                this.style.opacity = '1';
                this.classList.add('selected');

                // Añadir el check
                const checkDiv = document.createElement('div');
                checkDiv.style.cssText = "position: absolute; top: 5px; right: 5px; width: 20px; height: 20px; border-radius: 50%; background-color: #0b0b5e; color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;";
                checkDiv.textContent = '✓';
                this.appendChild(checkDiv);

                // Actualizar configuración
                configurador.configuracion.botonera.modelo = tipo;
                configurador.actualizarBotonera();
                actualizarOpcionesElegidas();
            });
        });
    }
    if (opcionesBotoneraMaterial && opcionesBotoneraMaterial.length > 0) {
        opcionesBotoneraMaterial.forEach(opcion => {
            opcion.addEventListener('click', function() {
                const material = this.dataset.botoneraMaterial;
                seleccionarOpcion(opcionesBotoneraMaterial, this);
                configurador.configuracion.botonera.material = material;
                configurador.actualizarBotonera();
                actualizarOpcionesElegidas();
            });
        });
    }

    // Event Listeners para las opciones de LEDs
    if (checkLedEsquinas) {
        checkLedEsquinas.addEventListener('change', function() {
            configurador.configuracion.leds.esquinas = this.checked;
            configurador.actualizarLeds();
            actualizarOpcionesElegidas();
        });
    } else {
        console.warn("Elemento no encontrado: customization-led-esquinas-traseras");
    }

    if (checkLedBotonera) {
        checkLedBotonera.addEventListener('change', function() {
            configurador.configuracion.leds.botonera = this.checked;
            configurador.actualizarLeds();
            actualizarOpcionesElegidas();
        });
    } else {
        console.warn("Elemento no encontrado: customization-led-botonera");
    }

    if (checkLedZocaloSup) {
        checkLedZocaloSup.addEventListener('change', function() {
            configurador.configuracion.leds.zocaloSuperior = this.checked;
            configurador.actualizarLeds();
            actualizarOpcionesElegidas();
        });
    } else {
        console.warn("Elemento no encontrado: customization-led-zocalo-superior");
    }

    if (checkLedZocaloInf) {
        checkLedZocaloInf.addEventListener('change', function() {
            configurador.configuracion.leds.zocaloInferior = this.checked;
            configurador.actualizarLeds();
            actualizarOpcionesElegidas();
        });
    } else {
        console.warn("Elemento no encontrado: customization-led-zocalo-inferior");
    }

    // Event Listeners para las opciones de entorno
    // Event Listeners para las opciones de entorno
    if (opcionesEntorno && opcionesEntorno.length > 0) {
        opcionesEntorno.forEach(opcion => {
            opcion.addEventListener('click', function() {
                const entorno = this.dataset.entorno;
                seleccionarOpcion(opcionesEntorno, this);
                configurador.cambiarEntorno(entorno);
            });

            // Seleccionar "Oficina" por defecto
            if (opcion.dataset.entorno === 'oficina') {
                opcion.classList.add('selected');
            }
        });
    }

    // Event Listeners para secciones plegables
    if (secciones && secciones.length > 0) {
        secciones.forEach(seccion => {
            seccion.addEventListener('click', function() {
                const contenido = this.nextElementSibling;
                const icono = this.querySelector('.material-icons');

                if (contenido && icono) {
                    if (contenido.style.maxHeight === '400px') {
                        contenido.style.maxHeight = '0';
                        icono.textContent = 'arrow_right';
                    } else {
                        contenido.style.maxHeight = '400px';
                        icono.textContent = 'arrow_drop_down';
                    }
                }
            });
        });
    }

    // // Cerrar menús nivel 2 cuando se hace click fuera
    // document.addEventListener('click', function(event) {
    //     // Verificar si el click fue fuera del menú nivel 1 y nivel 2
    //     if (!customizationMenuL1.contains(event.target) &&
    //         !event.target.closest('.customization-menu-level-2') &&
    //         !event.target.matches('#customization-menu-level-1-deploy')) {

    //         // Cerrar todos los menús nivel 2
    //         customizationMenusL2.forEach(menu => {
    //             menu.classList.remove('active');
    //             menu.style.display = 'none';
    //             menu.style.pointerEvents = 'none';
    //             menu.style.zIndex = '-1';
    //         });

    //         // Quitar la selección del botón activo
    //         if (botonActivo) {
    //             botonActivo.classList.remove('active');
    //             botonActivo = null;
    //         }

    //         menuL2Activo = null;
    //     }
    // });

    // Inicialización
    // Asegurar que todos los menús nivel 2 estén ocultos al inicio
    customizationMenusL2.forEach(menu => {
        menu.style.display = 'none';
        menu.style.pointerEvents = 'none';
        menu.style.zIndex = '-1';
    });

    // Inicialización
    // Activamos los menús al inicio
    if (customizationMenuL1) {
        customizationMenuL1.classList.add('active');
    }

    if (detailMenu) {
        detailMenu.classList.add('active'); // Activamos el panel de opciones elegidas al inicio
    }

    // Ajustamos las alturas de los menús de nivel 2
    ajustarAlturaMenusL2();

    // Actualizamos el panel de opciones elegidas
    actualizarOpcionesElegidas();

    // ========== FUNCIONALIDAD DEL BOTÓN DE MODO ==========

    // Variable para rastrear el modo actual (se inicializará cuando se seleccione)
    let modoActual = null;


    // Función para actualizar el indicador visual del modo actual
    function actualizarIndicadorModo(modo) {
        if (!btnModo) return;

        // Remover clases anteriores
        btnModo.classList.remove('modo-sustitucion', 'modo-decoracion');

        // Si el modo es null, no hacer nada más
        if (!modo) return;

        // Añadir clase del modo actual
        btnModo.classList.add(`modo-${modo}`);

        modoActual = modo;
    }

    // Función para cambiar el modo
    function cambiarModo(nuevoModo) {
        if (nuevoModo === modoActual) {
            console.log('Ya estás en este modo');
            return;
        }

        console.log(`Cambiando modo de ${modoActual} a ${nuevoModo}`);

        // Mostrar pantalla de carga
        const loadingScreen = document.getElementById('loading-fullscreen');
        loadingScreen.style.display = 'flex';
        loadingScreen.style.opacity = '1';

        // Ocultar menús
        document.getElementById('customization-menu-level-1').classList.remove('active');
        document.getElementById('detail-menu').classList.remove('active');

        // Cerrar el menú desplegable
        if (btnModo && btnModo.nextElementSibling) {
            btnModo.nextElementSibling.style.display = 'none';
        }

        setTimeout(() => {
            // Actualizar modo seleccionado globalmente
            modoSeleccionado = nuevoModo;

            // Actualizar configurador si existe
            if (window.configurador) {
                window.configurador.modoServicio = nuevoModo;
            }

            // Regenerar opciones de suelo según el nuevo modo
            generarOpcionesSuelos(nuevoModo);

            // Regenerar opciones de paredes según el nuevo modo
            generarOpcionesParedes(nuevoModo);

            // Regenerar opciones de techo según el nuevo modo
            generarOpcionesTechos(nuevoModo);

            // Guardar el modo en el configurador

            // Establecer el suelo por defecto según el modo
if (window.configurador) {
    if (nuevoModo === 'sustitucion') {
        // Materiales por defecto para sustitución
        window.configurador.actualizarMaterial('suelo', 'goma-negro');
        window.configurador.actualizarMaterial('paredes', 'inox-cepillado');
        window.configurador.actualizarTechoImagen('marco');

        // Espejos
        window.configurador.configuracion.espejo.frontal = 'medio';
        window.configurador.configuracion.espejo.lateral = 'no';
        window.configurador.actualizarEspejos();

        // Botonera
        window.configurador.configuracion.botonera.modelo = 'columna';
        window.configurador.actualizarBotonera();

        // Pasamanos
        window.configurador.configuracion.pasamanos.frontal = false;
        window.configurador.configuracion.pasamanos.derecha = false;
        window.configurador.actualizarPasamanos();

    } else if (nuevoModo === 'decoracion') {
        // Materiales por defecto para decoración
        window.configurador.actualizarMaterial('suelo', 'goma-es5');
        window.configurador.actualizarMaterial('paredes', 'inoxdec-satinado');
        window.configurador.actualizarTechoImagen('l-m1');

        // Espejos
        window.configurador.configuracion.espejo.frontal = 'medio';
        window.configurador.configuracion.espejo.lateral = 'no';
        window.configurador.actualizarEspejos();

        // Botonera
        window.configurador.configuracion.botonera.modelo = 'columna';
        window.configurador.actualizarBotonera();

        // Pasamanos
        window.configurador.configuracion.pasamanos.frontal = false;
        window.configurador.configuracion.pasamanos.derecha = false;
        window.configurador.actualizarPasamanos();
    }
}

            // Actualizar indicador visual
            actualizarIndicadorModo(nuevoModo);

            // Actualizar panel de opciones
            actualizarOpcionesElegidas();

            setTimeout(() => {
                // Ocultar pantalla de carga
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';

                    // Reactivar menús
                    document.getElementById('customization-menu-level-1').classList.add('active');
                    document.getElementById('detail-menu').classList.add('active');
                }, 500);
            }, 1000);
        }, 500);
    }

    // Inicializar indicador del modo actual SOLO si hay un modo seleccionado
    if (btnModo && modoActual) {
        actualizarIndicadorModo(modoActual);
    }

    // ========== EVENT LISTENERS PARA EL MENÚ DE MODO ==========

    // Event listener para el botón principal de modo
    if (btnModo) {
        btnModo.addEventListener('click', function() {
            const menu = this.nextElementSibling;
            if (menu) {
                // Alternar visibilidad del menú
                const isVisible = menu.style.display === 'block';
                menu.style.display = isVisible ? 'none' : 'block';
            }
        });
    }

    // Event listeners para las opciones del menú de modo
    if (btnModoSustitucion) {
        btnModoSustitucion.addEventListener('click', function(e) {
            e.stopPropagation(); // Evitar que se propague al contenedor padre
            cambiarModo('sustitucion');
        });
    }

    if (btnModoDecoracion) {
        btnModoDecoracion.addEventListener('click', function(e) {
            e.stopPropagation(); // Evitar que se propague al contenedor padre
            cambiarModo('decoracion');
        });
    }

    // Cerrar el menú si se hace click fuera de él
    document.addEventListener('click', function(event) {
        if (btnModo && !btnModo.contains(event.target)) {
            const menu = btnModo.nextElementSibling;
            if (menu) {
                menu.style.display = 'none';
            }
        }
    });

    });

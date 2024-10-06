import { auth, db, facturas_realTime, actualizar_estado_factura } from '../database/remote/firebase.js'
import { getDocs, collection, addDoc, doc, updateDoc, arrayUnion, onSnapshot} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js"

import { EMISOR } from "../contenido/Emisores.js";
import { Crud, INFO_RECEPTOR } from "../../modelo/crud/Crud.js";
import { mensaje_toastify } from '../database/remote/toastify.js'
import { Dialog } from '../html/Dialog.js';
import { RECEPTORES } from './Receptores.js';
import { global_POSICION_CARD, global_PROPIEDAD_AVISO } from '../../controlador/evento_SUBMIT.js'

let id_factura = 0

let global_TOTAL_FACTURA = 0

export let global_ULTIMO_NUMERO_FACTURA = 0
export let global_CONCEPTO = ''
export let global_ESTADO_FACTURA = {}
export let objeto_servicio = {}
export let global_SERVICIOS = [] /// lo estoy usando en evento_Submit
export let global_guardar_parametro_posicion_factura = 0
export let global_guardar_parametro_posicion_servicio = 0


const ENCODING = (str) => {
        
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
    }));
}

const DECODING = (str) => {

    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}



/// miles y decimales
const formatear_moneda = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
});

const formatear_moneda_3_decimales = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 3
});

const fn_convertDateFormat = (string) => {
    var info = string.split('-').reverse().join('/')
    return info
}

const fn_html_factura_enviada = (ESTADO_FACTURA) => {

    return `<li>
        <span style='color: ${ESTADO_FACTURA.enviada.estado ? 'green':'red'}' class="material-symbols-outlined">${ESTADO_FACTURA.enviada.estado ? 'check':'close'}</span>
        <span style='color: ${ESTADO_FACTURA.enviada.estado ? 'green':'red'}'>Email enviado</span>
        <span style=''> ${ESTADO_FACTURA.enviada.estado ? fn_convertDateFormat(ESTADO_FACTURA.enviada.fecha) : '--/--/--'} </span>
    </li>`
}

const fn_html_factura_cobrada = (ESTADO_FACTURA) => {

    return `<li>
        <span style='color: ${ESTADO_FACTURA.cobrada.estado ? 'green':'red'}' class="material-symbols-outlined">${ESTADO_FACTURA.cobrada.estado ? 'check':'close'}</span>
        <span style='color: ${ESTADO_FACTURA.cobrada.estado ? 'green':'red'}'>Factura cobrada</span>
        <span style=''> ${ESTADO_FACTURA.cobrada.estado ? fn_convertDateFormat(ESTADO_FACTURA.cobrada.fecha) : '--/--/--'} </span>
    </li>`
}


const fn_html_btn_circular_PENDIENTE_COBRAR = (estado) => {

    /// Atencion: el btn PDF no se pone aqui porque siempre esta visible

    const btn_pendiente_envio_factura = document.getElementById('idBtnCircularPendienteEnviarFactura')
    const btn_pendiente_cobrar_factura = document.getElementById('idBtnCircularPendienteCobrar')
    const btn_bloqueo_factura = document.getElementById('idBtnCircularBloquearFactura')

    if (estado.bloqueada) {
        /// mostramos -> btn envio factura
        btn_pendiente_envio_factura.style.display = 'grid'
        btn_bloqueo_factura.style.display = 'grid'
        /// ocultamos -> btn pendiente de cobro
        btn_pendiente_cobrar_factura.style.display = 'none'
    }

    if (estado.enviada.estado) {
        /// si ya esta enviado el email de la factura
        /// ocultamos -> btn envio facura y btn bloqueo factura
        btn_pendiente_envio_factura.style.display = 'none'
        btn_bloqueo_factura.style.display = 'none'
        /// mostramos -> btn pendiente de cobro
        btn_pendiente_cobrar_factura.style.display = 'grid'
    }

    if (estado.cobrada.estado) {
        /// si ya esta cobrada la factura
        /// ocultamos -> btn pendiente de cobro
        btn_pendiente_cobrar_factura.style.display = 'none'
    }
}

const fn_html_mostrar_ESTADO_card_factura = (factura) => {

    if (factura.cobrada.estado) {
        return 2
    } else if (factura.enviada.estado) {
        return 1
    } else {
        return 0
    }
}




export class Facturas {

    constructor(id, datos, estado, receptor, emisor, concepto, servicios, factura) {
        this._id = id;
        this._datos = datos;
        this._estado = estado;
        this._receptor = receptor; //// {} desde clase Receptor;
        this._emisor = emisor; //// {} desde clase Emisor;
        this._concepto = concepto; /// string
        this._servicios = servicios; //// [{}]
        this._factura = factura; //// [{}]
    }

    /// GETTERS -> Recuperar datos
    get id() {return this._id}
    get datos() {return this._datos}
    get estado() {return this._estado}
    get receptor() {return this._receptor}
    get emisor() {return this._emisor}
    get concepto() {return this._concepto}
    get servicios() {return this._servicios}
    get factura() {return this._factura}

    /// SETTERS -> Cambiar datos
    set id (id) {this._id = id}
    set datos (datos) {this._datos = datos}
    set estado (estado) {this._estado = estado}
    set receptor (receptor) {this._receptor = receptor}
    set emisor (emisor) {this._emisor = emisor}
    set concepto (concepto) {this._concepto = concepto}
    set servicios (servicios) {this._servicios = servicios}
    set factura (factura) {this._factura = factura}

    /// FACTURAS - CARDS
    $_inner_html(contenido) {
        let container = document.getElementById('idContainer__contenido')
        container.innerHTML = ''
        container.innerHTML = contenido
    }

    $_titulo_facturas () {

        return `<ul class='card_titulo oculto'>
                    <li>Factura</li>
                    <li>Receptor</li>
                    <li>Mes</li>
                    <li>Trimestre</li>
                    <li>Total</li>
                    <li>Estado</li>
                    <li><span></span></li>
                </ul>`
    }

    $_facturas (FACTURA_filtro_User) {

        const ESTADO = {
            0: 'en reparto',
            1: 'enviado',
            2: 'cobrada'
        }

        /// 0: en reparto, 1: enviado, 2: cobrado
        const CLASS_COLOR_FONDO_ESTADO = {
            false: 'border: 1px dashed black',
            true: 'border: 1px solid black'
        }

        const TRIMESTRES = {
            '01': '1ºT',
            '02': '1ºT',
            '03': '1ºT',
            '04': '2ºT',
            '05': '2ºT',
            '06': '2ºT',
            '07': '3ºT',
            '08': '3ºT',
            '09': '3ºT',
            '10': '4ºT',
            '11': '4ºT',
            '12': '4ºT',
        }

        const MESES = {
            '01': 'Enero',
            '02': 'Febrero',
            '03': 'Marzo',
            '04': 'Abril',
            '05': 'Mayo',
            '06': 'Junio',
            '07': 'Julio',
            '08': 'Agosto',
            '09': 'Septiembre',
            '10': 'Octubre',
            '11': 'Noviembre',
            '12': 'Diciembre',
        }

        // ESTADO[element._estado.estado_factura]           element._estado.total_factura
        // ${element._estado.estado_factura > 0 ? '<li><span class="material-symbols-outlined">lock</span></li>' : ''} //! CANDADO, despues de estado podria ponerse

        FACTURA_filtro_User.sort((a, b) => b._datos.numero_factura.localeCompare(a._datos.numero_factura))

        const facturas = FACTURA_filtro_User.map((element, i) => {

            //! ¿ quitar data id y section?
            //return `<ul style='background-color: ${CLASS_COLOR_FONDO_ESTADO[element._estado.estado_factura]}' class="card oculto" data-evento="click" data-clase="dialog" data-metodo="abrir_modal" data-propiedad="full" data-p1='servicios' data-p2='${i}' data-p3='${element.id}'>
            return `<ul style='${CLASS_COLOR_FONDO_ESTADO[element._factura.enviada.estado]}' class="card oculto" data-evento="click" data-clase="dialog" data-metodo="abrir_modal" data-propiedad="full" data-p1='servicios' data-p2='${i}' data-p3='${element.id}'>
                        <li>Fra.${element._datos.numero_factura}</li>
                        <li>${element._receptor._alias}</li>
                        <li>${MESES[element._datos.fecha_factura.split('-')[1]]}</li>
                        <li>${TRIMESTRES[element._datos.fecha_factura.split('-')[1]]}</li>
                        <li>${element._factura.cobrada.total}</li>
                        <li>${ESTADO[fn_html_mostrar_ESTADO_card_factura(element._factura)]}</li>
                        <li><span data-name='factura' class="material-symbols-outlined" data-evento="click" data-clase="dialog" data-metodo="abrir_modal" data-propiedad="auto" data-p1='eliminar_factura' data-p2='${element.id}' data-p3='${i}'>edit</span></li>
                    </ul>`;
        });


        return facturas.join('');
    }

    

    //! atencion, antes funcionaba desde LOAD o MODULES pero en REAL TIME lo ejecuta
    //! atencion 2, al borrarlo me daba ERROR al pasar de Facturas a Gastos u otros 
    /// esta en evento LOAD para mostrar todas las facturas al cargar la app
    contenido() {
        try {
            return this.$_titulo_facturas() + this.$_facturas(FACTURA_filtro_User)
        } catch (error) {
            console.log('Error', error);
        }
    }

    /// esta en evento CHANGE para filtrar las facturas 
    contenido_filtrado() {
        return this.$_inner_html(this.$_titulo_facturas() + this.$_facturas(FACTURA_filtro_User))
    }
    
    /// REAL TIME - actualiza contenido en una accion (add, update, delete)
    contenido_filtrado_realTime(facturas) {
        return this.$_inner_html(this.$_titulo_facturas() + this.$_facturas(facturas))
    }


    incrementar_inputs_en_extras(tamaño) {
        
        const container = document.getElementById('idContainerInputsExtras')
            
            if (tamaño > 0) {

                container.innerHTML = ''
                
                for (let index = 0; index < tamaño; index++) {
                    
                    container.innerHTML += `
                    <select name='select_extra_${index}'>
                        <option value='Exp: '>Exp: </option>    
                        <option value='Alb: '>Alb: </option>
                    </select>    
                    <input name='input_extra_${index}' value=''>
                    <input name='input_extra_concepto_${index}' value=''>`
                }
            } else {
                return container.innerHTML = ''
            }
    }

    incrementar_inputs_en_especiales(tamaño) {
        
        const container = document.getElementById('idContainerInputsEspeciales')
            
            if (tamaño > 0) {

                container.innerHTML = ''
                
                for (let index = 0; index < tamaño; index++) {

                    container.innerHTML += `
                    <select name='select_especial_${index}'>
                        <option value='Exp: '>Exp: </option>    
                        <option value='Alb: '>Alb: </option>
                    </select>    
                    <input name='input_especial_${index}' value=''>`
                }
            } else {
                return container.innerHTML = ''
            }
    }

    /// Crear Factura
    async factura (data) {

        /// -------------------------------------------------------------------------------
        /// FECHA FACTURA -> automatico
        /// -------------------------------------------------------------------------------
        /// esta info bien de SUBMIT que a su vez vino de MODAL AGREGAR FACTURA
        /// separamos en array con split, nos quedamos con el primer valor que es el año 2025
        /// y nos quedamos con los dos ultimos valores ej: 25, con el numero_factura
        /// le añadimos el simbolo '/' junto con año de factura y ya lo tenemos

        const dos_ultimos_digitos_YEAR_FACTURA = data.fecha_factura.split('-')[0].substring(2,4)
        const NUMERO_FACTURA = data.numero_factura+'/'+dos_ultimos_digitos_YEAR_FACTURA
    
        let datos = {
            factura_tipo: data.idTipoFactura,
            numero_factura: NUMERO_FACTURA,
            fecha_factura: data.fecha_factura,
            fecha_vencimiento: data.fecha_vencimiento
        }
    
        /* let estado = {
            estado_factura: 0,
            total_factura: 0
        } */

        /// -------------------------------------------------------------------------------
        /// CONCEPTO FACTURA -> automatico
        /// tomando como referencia Rhenus hacemos que el concepto se automatice
        /// -------------------------------------------------------------------------------
        const QUINCENA = data.fecha_factura.split('-')[2]
        const MESES = ['enero','febrero','marzo','abrir','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
        const MES_FACTURA = data.fecha_factura.split('-')[1]
        const YEAR_FACTURA = data.fecha_factura.split('-')[0]

        const correction = {
            X1: (QUINCENA < 16) ? 'primera' : 'segunda',
            X2: MESES[parseFloat(MES_FACTURA) - 1],
            X3: YEAR_FACTURA
          };

        const CONCEPTO_CORREGIDO = global_CONCEPTO.replace(/X1|X2|X3/g, matched => correction[matched])

        let concepto = CONCEPTO_CORREGIDO

        let servicios = []
        let datos_emisor = await EMISOR[0]


        /* const datos_emisor = {
            _alias: ENCODING(EMISOR[0]._alias),
            _cp: ENCODING(EMISOR[0]._cp),
            _dni: ENCODING(EMISOR[0]._dni),
            _domicilio: ENCODING(EMISOR[0]._domicilio),
            _email: ENCODING(EMISOR[0]._email),
            _logo: ENCODING(EMISOR[0]._logo),
            _razon_social: ENCODING(EMISOR[0]._razon_social),
            _telefono: ENCODING(EMISOR[0]._telefono),
            _uid: EMISOR[0]._uid
        }
 */
        const factura = {
            bloqueada: false,
            cobrada: {
                estado: false,
                fecha: '',
                total: 0
            },
            enviada: {
                email: '',
                estado: false,
                fecha: ''
            }
        }
    
        /// ------------------------------------------
        /// ------------RECEPTOR FACTURA------------
        /// ------------------------------------------
    
        let datos_receptor = INFO_RECEPTOR[data.idReceptor]
    
        let añadir_precios = {_precios: INFO_RECEPTOR[data.idReceptor]._precios[data.idPrecios]}
        let añadir_impuestos = {_impuestos: INFO_RECEPTOR[data.idReceptor]._impuestos[data.idImpuestos]}
    
        Object.assign(datos_receptor, añadir_precios)
        Object.assign(datos_receptor, añadir_impuestos)
        
        let emisor = {}
        let receptor = {}
        
        Object.assign(emisor, datos_emisor)
        Object.assign(receptor, datos_receptor)

        let nombre_coleccion = 'venort__facturas'


        return await addDoc(collection(db, nombre_coleccion), {datos, concepto, servicios, emisor, receptor, factura})
    }

    /// MOSTRAR SERVICIOS
    servicios(FACTURA_filtro_User, ...parametros) {
       
        FACTURA_filtro_User.sort((a, b) => b._datos.numero_factura.localeCompare(a._datos.numero_factura))
        
        id_factura = parametros[2]
        
        //const NUMERO_FACTURA = FACTURA_filtro_User[parametros[1]].datos.numero_factura
        
        const DATOS = FACTURA_filtro_User[parametros[1]].datos;
        const CONCEPTO = FACTURA_filtro_User[parametros[1]].concepto
        const PRECIOS = FACTURA_filtro_User[parametros[1]].receptor._precios
        const IMPUESTOS = FACTURA_filtro_User[parametros[1]].receptor._impuestos
        const ESTADO_FACTURA = FACTURA_filtro_User[parametros[1]]._factura
        global_ESTADO_FACTURA = FACTURA_filtro_User[parametros[1]]._factura
        const EMISOR = FACTURA_filtro_User[parametros[1]]._emisor
        const SERVICIOS_EXTRAS = []
        const SERVICIOS_ESPECIALES = []

        global_ESTADO_FACTURA = ESTADO_FACTURA

        /// --------- BTN CIRCULAR ----------------

        if (ESTADO_FACTURA.bloqueada) {
            /// FACTURA BLOQUEADA
            document.getElementById('idContainer__btn_factura_desbloqueada').classList.add("candado_off");
            document.getElementById('idContainer__btn_factura_bloqueada').classList.remove("candado_off");
        } else {
            /// FACTURA DESBLOQUEADA
            document.getElementById('idContainer__btn_factura_desbloqueada').classList.remove("candado_off");
            document.getElementById('idContainer__btn_factura_bloqueada').classList.add("candado_off");
        }


        /// -------------------------





        /* let convertDateFormat = (string) => {
            var info = string.split('-').reverse().join('/')
            return info
        } */

        /// Copiamos SERVICIOS para exportarlo, para poderlos borrar o actualizar
        objeto_servicio = FACTURA_filtro_User[parametros[1]]._servicios

        const servicios =  FACTURA_filtro_User[parametros[1]]._servicios

        if (servicios.length > 0) {

            /// HAY SERVICIOS

            const btnsMenusCircular = document.querySelectorAll('#idContainer__btn_factura_desbloqueada')
            /// si no hay servicios oculta estos botones, add, edit y bloquear
            btnsMenusCircular[0].children[0].style.display = 'grid'
            btnsMenusCircular[0].children[1].style.display = 'grid'
            btnsMenusCircular[0].children[2].style.display = 'grid'

            const titulo_servicio = Object.entries(servicios[0]).map(([key]) => {

                if (key != 'extras_concepto') {

                    /// le ponemos TILDE a dia
                    if (key == 'dia') {
                        key = 'día'
                    }

                    return `<li>${key}</li>`
                }
            })

            titulo_servicio.sort()
            titulo_servicio.push(`<li></li>`)

            /// --------------------------------------------------------------------
            ///     Creamos el 'contenedor de operaciones de servicios' en factura
            /// --------------------------------------------------------------------
            const OPERACIONES_FACTURA = []
            Object.entries(servicios[0]).forEach(([key]) => {
                /// creamos un ARRAY para el contenedor de SUMAS de servicios
                if (key != 'dia') {
                    OPERACIONES_FACTURA.push([key, 0])
                }
            })

            const CONTENEDOR_PRECIOS = []
            Object.entries(PRECIOS).forEach((element, i) => {
                /// creamos un ARRAY para el contenedor de PRECIOS de servicios
                if (element[0] != 'fecha' ) {
                    CONTENEDOR_PRECIOS.push(element)
                }
            })
            
            OPERACIONES_FACTURA.sort()
            CONTENEDOR_PRECIOS.sort()
            
            const ESPECIALES = []

            const SUPER = servicios.map(element => {

                if (element.extras != 0) {
                    
                    const EXTRAS = element.extras
                    EXTRAS.forEach(element => {
                        
                        return SERVICIOS_EXTRAS.push(`<li>${element}</li>`)
                    })
                }

                if (element.especiales != 0) {

                    let array_ESPECIALES = element.especiales

                    array_ESPECIALES.forEach(element => {
                        
                        return SERVICIOS_ESPECIALES.push(`<li>${element}</li>`)
                    });
                }

                return Object.entries(element).map(([key, value]) => {
                    
                    if (Array.isArray(value)) {
                        return [key, value.length]
                    } else {
                        
                        if(key == 'dia'){
                            return [key,fn_convertDateFormat(value)]
    
                        } else {
                            return [key, value]
                        }
                    }
                })
            });


            //! -----------------------------------------------

            /// añadimos al contenedor las sumas realizadas entre los servicios
            let NEW_SUPER = []

            SUPER.forEach((element, i) => {

                NEW_SUPER[i] = []

                element.forEach(element => {
                    
                    if (element[0] != 'extras_concepto') {
                        NEW_SUPER[i].push(element)
                    }
                });
            });

            NEW_SUPER.sort()

            NEW_SUPER.map((element, i) => {
                
                element.sort()
                
                element.forEach((element2, j) => {
                    
                    if (element2[0] != 'dia') {

                        if (element2[0] == OPERACIONES_FACTURA[j-1][0]) {
                            OPERACIONES_FACTURA[j-1][1] = (Number(element2[1]) + OPERACIONES_FACTURA[j-1][1])
                        }
                    }
                });
            });


            let contador = 0
            /// añadimos los precios al contenedor
            OPERACIONES_FACTURA.forEach((element, i) => {
                
                if (element[0] != 'extras_concepto') {
                    
                    element.push(CONTENEDOR_PRECIOS[contador][1])
                    contador++
                }
            });
            
            /// multiplicamos servicio * precio
            OPERACIONES_FACTURA.forEach((element, i) => {
                let multi = (element[1] * element[2])
                element.push(multi)
            });
            
            
            /// FILTRAMOS para eliminar 'extras_concepto'
            const OPERACIONES_FACTURA_FILTRADA = OPERACIONES_FACTURA.filter(element => element[0] != 'extras_concepto');
            

            let suma = 0

            /// para una mejor vista en la Factura pdf ordenamos las operaciones
            const ORDENAR_OPERACIONES_FACTURA = OPERACIONES_FACTURA_FILTRADA.map(element => {
                /// SUMA de todos los totales, ejemplo: entregas, recogidas, etc
                suma += element.at(-1) 
                /// Ordena y formatea a € con 2 o 3 decimales
                return [element[1], element[0], (element[0] == 'kilos') ? formatear_moneda_3_decimales.format(element[2]) : formatear_moneda.format(element[2]), formatear_moneda.format(element[3])]
            });
            
            const BASE = suma
            const BASE_HTML = `<li>Base:</li><li>${formatear_moneda.format(suma)}</li>`
            


            /// añadimos HTML para que se vea optimo en la Factura pdf
            const OPERACIONES_FACTURA_HTML = ORDENAR_OPERACIONES_FACTURA.map(element => {
                
                const li = element.map(element2 => {
                    return `<li>${element2}</li>`
                });
                
                return [`<ul>${li.join('')}</ul>`]
            });

            let array_IMPUESTOS = []

            let IMPUESTOS_FACTURA = Object.entries(IMPUESTOS).map(([key, value]) => {

                if (key != 'fecha') {
                    /// operacion para multiplicar el % del impuesto con la Base imponible
                    let operacion = BASE * (value/100)
                    array_IMPUESTOS.push(operacion)
                    return `<li>${key} ${value}:</li><li>${formatear_moneda.format(operacion)}</li>`
                }
            })

            const SUMA_IMPUESTOS = array_IMPUESTOS.reduce((total, numero) => {
                return total + numero;
            }, 0);

            const TOTAL_FACTURA = formatear_moneda.format(BASE + SUMA_IMPUESTOS)
            const TOTAL_FACTURA_HTML = `<li class='total_factura'>Total:</li><li class='total_factura'>${TOTAL_FACTURA}</li>`

            global_TOTAL_FACTURA = TOTAL_FACTURA
            //! ------------------------------------------------

            let prueba2 = SUPER.map((element, i) => {

                try {
                    
                    element.sort() /// Ordena

                    return element.map(element2 => { 
    
                        if (element2[0] != 'extras_concepto') {

                            if (element2[0] == 'dia') { 
                                /* .substring(0, 2) */ /// FUNCIONA PERFECTAMENTE, convierte la fecha 01/01/2025 a 01
                                return `<li>${element2[1]}</li>`
                            } else {

                                return `<li>${element2[1]}</li>`
                            }
                        }
                    })
    
                } catch (error) {
                    console.log('ERROR', error.message);
                }
            })

            
            /// añadimos etiqueta <li> al final, que quedará oculto, para usarlo en EDIT y DELETE
            prueba2.forEach((element,i) => element.push(`<li data-posicion='${i}'><span data-name='servicio' class="material-symbols-outlined" data-evento="click" data-clase="dialog" data-metodo="abrir_modal" data-propiedad="auto" data-p1='delete_factura' data-p2='${i}' data-p3='${parametros[2]}' data-p4='${element[0].substring(4, 12)}'>edit</span></li>`));
            
            prueba2.sort()
            
            
            /// añadimos etiqueta <ul> por cada servicio, y aparte un 'join' para quitar comas
            let prueba3 = prueba2.map((element, i) => `<ul class='card oculto'>${element.join('')}</ul>`);
            
            prueba3.sort()

            let TITULO = SUPER[0].map(element => {
                return  element[0]
            });

            TITULO.sort()
    
            TITULO = `<ul class='card_titulo oculto'>${titulo_servicio.join('')}</ul>`

            let SERVICIOS = prueba3.join('')


            /// --------------------------- SERVICIOS EN FACTURA SIN EDIT Y DELETE ------------------------------------------------
            
            /// duplico el de arriba, este es el que muestro en factura
            /// sin EDIT y BORRAR 
            let paso_1_SERVICIOS_HTML_FACTURA = SUPER.map((element, i) => {

                try {
                    
                    element.sort() /// Ordena

                    return element.map(element2 => { 
    
                        if (element2[0] != 'extras_concepto') {

                            if (element2[0] == 'dia') { 
                                /* .substring(0, 2) */ /// FUNCIONA PERFECTAMENTE, convierte la fecha 01/01/2025 a 01
                                return `<li>${element2[1]}</li>`
                            } else {

                                return `<li>${element2[1]}</li>`
                            }
                        }
                    })
    
                } catch (error) {
                    console.log('ERROR', error.message);
                }
            })

            paso_1_SERVICIOS_HTML_FACTURA.sort();

            let paso_2_SERVICIOS_HTML_FACTURA = paso_1_SERVICIOS_HTML_FACTURA.map((element, i) => `<ul class='card_factura'>${element.join('')}</ul>`);

            const SERVICIOS_HTML_FACTURA = paso_2_SERVICIOS_HTML_FACTURA.sort()

            /// --------------------------------- FIN ---------------------------------------



            /// --------------------------------------------------------------------------------------------
            /// BOTONES CIRCULARES -> dependiendo del estado de la factura, muestra u oculta ciertos botones
            /// --------------------------------------------------------------------------------------------
            fn_html_btn_circular_PENDIENTE_COBRAR(ESTADO_FACTURA)
            
            const TAB_PRE = `
                <input type="radio" name="buttons" id="r1" checked>
                <input type="radio" name="buttons" id="r2">
    
                <div class="controls">
                    <label for="r1">Servicios</label>
                    <label for="r2">Factura</label>
                </div>
    
                <main class="mainTab">
                    <div class="slides">
                        
                        <section id='idSectionListaServicios'>
                            <div class="content">
                                <h4 class='titulo_servicios_factura' style='text-align: center; padding: 1em 1em 0em 1em; color: grey!important'><span class="material-symbols-outlined">local_shipping</span> <span>Servicios de la Factura número: ${DATOS.numero_factura}</span></h4>`;
    
            const TAB_POST = `
                    </div>
                        </section>

                        <section>
                            <div class="content">

                                <ul id='idContainerAvisosFactura'>
                                    <li>
                                        <span style='color: ${ESTADO_FACTURA.bloqueada ? 'green':'red'}' class="material-symbols-outlined">${ESTADO_FACTURA.bloqueada ? 'check':'close'}</span>
                                        <span style='color: ${ESTADO_FACTURA.bloqueada ? 'green':'red'}'>${ESTADO_FACTURA.bloqueada ? 'factura bloqueada':' ...en reparto'}</span>
                                        <span style='color: ${ESTADO_FACTURA.bloqueada ? '':'red'}' class="material-symbols-outlined">${ESTADO_FACTURA.bloqueada ? 'lock':'local_shipping'}</span>
                                    </li>
                                    
                                    ${ESTADO_FACTURA.bloqueada ? fn_html_factura_enviada(ESTADO_FACTURA) :''}
                                    ${ESTADO_FACTURA.enviada.estado ? fn_html_factura_cobrada(ESTADO_FACTURA) : ''}
                                </ul>
    
                                <article id="idContainerFacturaPDF">
                                
                                <!-- FACTURA -->
                                    <div id="facturaPDF">
                        
                                        <h4 class="titulo-facturaPDF">${DATOS.factura_tipo}</h4>

                                        <hr class='factura_hr_data_top'>
                        
                                        <div id="idFacturaContenedorTop" class="factura__contenedorTop">
                                            
                                            <div class="factura__logo">
                                                <img src="./assets/img/logo/${DECODING(EMISOR._logo)}" alt="" srcset="">
                                            </div>
                                            
                                            <ul class="factura__infoFechas">
                                                <li>
                                                    <span>Nº Factura: </span><span id="idNumeroFactura">${DATOS.numero_factura}</span>
                                                </li>
                                                <li>
                                                    <span>Fecha factura: </span><span id='idFechaFactura'>${fn_convertDateFormat(DATOS.fecha_factura)}</span>
                                                </li>
                                                <li>
                                                    <span>Fecha vencimiento: </span><span id='idFechaVencimiento'>${fn_convertDateFormat(DATOS.fecha_vencimiento)}</span>
                                                </li>
                                            </ul>
                                            
                                            <ul id="idContenedorEmisorFactura" class="factura__infoEmisor"> 
                                                <li id="idContenedorEmisorFactura_nombre">
                                                    ${DECODING(EMISOR._alias)}
                                                </li>
                                                <li id="idContenedorEmisorFactura_nif">
                                                    <span>NIF: </span><span>${DECODING(EMISOR._dni)}</span>
                                                </li>
                                                <li id="idContenedorEmisorFactura_domicilio">
                                                    <span>Av.</span><span>${DECODING(EMISOR._domicilio)}</span>
                                                </li>
                                                <li id="idContenedorEmisorFactura_cp">
                                                    <span>CP: </span><span>${DECODING(EMISOR._cp)}</span>
                                                </li>
                                            </ul>
                                            
                                            <ul id="idContenedorReceptorFactura" class="factura__infoReceptor">
                                                <li id="idContenedorReceptorFactura_empresa">
                                                    Rhenus Logistics, S.A.U
                                                </li>
                                                <li id="idContenedorReceptorFactura_cif">
                                                    <span>CIF: </span> <span> A-08211989</span>
                                                </li>
                                                <li id="idContenedorReceptorFactura_domicilio">
                                                    <span>C/: </span> <span> Area VI Parcela C32 Puerto de Las Palmas</span>
                                                </li>
                                                <li id="idContenedorReceptorFactura_cp">
                                                    <span>CP: </span> <span> 35008 - Las Palmas de Gran Canaria</span>
                                                </li>
                                            </ul>
                                        </div>
                        
                                        <hr class='factura_hr_data_bottom'>
                                        
                                        <!--/ FACTURA --- CONCEPTO -->

                                        <div class="factura__concepto">
                                            <p id="idConceptoFactura">${CONCEPTO}<span id="idMes"><!-- firebase --></span> <span id="idAno"><!-- firebase --></span></p>
                                        </div>
                        
                                        
                                        <!--/ FACTURA --- LISTA DE SERVICIOS -->

                                        <div id="idFacturaContenedorTitulosServicios" class="factura__tituloServicios">${TITULO}</div>
                                        <div id="idFacturaContenedorServicios" class="factura__fondo_servicios">${SERVICIOS_HTML_FACTURA.join('')}</div>
                        

                                        <!--/ FACTURA --- OBSERVACIONES Y ESPECIALES-->

                                        <div id="idObservaciones" class="factura__observaciones">
                                            <!-- <br> -->
                                            ${SERVICIOS_EXTRAS.length > 0 ? '<h4>Observaciones: Expediciones no asignadas por ser faltantes, rechazo u otros motivos</h4>' : ''}
                                            <ul id="idContenedorListadoExtras">${SERVICIOS_EXTRAS.join('')}</ul>
                        
                                            ${SERVICIOS_ESPECIALES.length > 0 ? '<h4>Especiales: </h4>' : ''}
                                            <ul id="idContenedorEspeciales" class="grid__noGrid">${SERVICIOS_ESPECIALES.join('')}</ul>
                                        </div>
                                            
                        
                                        <!--/ FACTURA --- SERVICIOS X PRECIOS -->

                                        <div class="idFacturaContenedor factura__grid_contenedor_servicios_operaciones" style="border: 1px solid black; padding: 0.5em; margin: 0.5em">
                                            ${OPERACIONES_FACTURA_HTML.join('')}
                                        </div>
                                        
                                        <!-- <br> -->




                                        <!--/ FACTURA --- BASE + IMPUESTOS + TOTAL -->

                                        <div class="factura__base_impuestos_total">
                                            <ul>${BASE_HTML}${IMPUESTOS_FACTURA.join('')}${TOTAL_FACTURA_HTML}</ul>
                                            
                                            <ul id="idFacturaZonaImpuestos" class="factura__contendor_impuestos"><!-- firebase --></ul>
                                        </div>





                                        <!-- <br> -->

                                        <!--/ FACTURA --- IMPUESTOS -->
                                        <div class="grid__fit">
                                            <ul></ul>
                                            <ul></ul>
                                            <ul id="idFacturaZonaImpuestos" class="factura__contendor_impuestos"><!-- firebase --></ul>
                                        </div>
                        
                                        <!--/ FACTURA --- TOTAL IMPUESTOS -->
                                        <div class="grid__fit">
                                            <ul></ul>
                                            <ul></ul>
                                            <ul id="idFacturaZonaTotal" class="factura__total grid__fit"><!-- firebase --></ul>
                                        </div>
                        
                                        <!--/ FACTURA --- CC -->
                                        <ul id="idFacturaIBAN" class="factura__IBAN">
                                            <li>
                                                <h5>IBAN ES04 2100 8928 4713 0106 1136</h5>
                                            </li>
                                        </ul>
                        
                                    </div>
                                </article>
                            </div>
                        </section>
    
                    </div>
                </main>`;
                
                return TAB_PRE + TITULO + SERVICIOS + TAB_POST;
                
        } else {
            const btnsMenusCircular = document.querySelectorAll('#idContainer__btn_factura_desbloqueada')
            /// si no hay servicios oculta estos botones, add, edit y bloquear
            btnsMenusCircular[0].children[0].style.display = 'none'
            btnsMenusCircular[0].children[1].style.display = 'none'
            btnsMenusCircular[0].children[2].style.display = 'none'

            return `<h2 style='text-align:center; padding: 2em'>No tienes servicios</h2>`
        }
    }

    /// ADD Servicio
    add_servicio(data) {

        let nombre_coleccion = 'venort__facturas'
        
        /* let nombre_coleccion = 'venort__clientes'
        let id = 'fRLVxADuzoB17v7tR8Wj' */

        /* function convertDateFormat(string) {
            var info = string.split('-').reverse().join('/');
            return info;
        } */

        try {
            let servicio = {}
            let tamaño_extras = data.extras
            let tamaño_especiales = data.especiales

            if (data.extras > 0) {

                data.extras = []
                data.extras_concepto = []

                let fecha = fn_convertDateFormat(data.dia)

                for (let index = 0; index < tamaño_extras; index++) {
                    let select = 'select_extra_'+index
                    let input = 'input_extra_'+index
                    let concepto = 'input_extra_concepto_'+index

                    data.extras.push(data[select] + data[input])
                    data.extras_concepto.push('Dia ' + fecha + ', ' + data[select] + data[input] +', '+ data[concepto])

                    delete data[select]
                    delete data[input]
                    delete data[concepto]
                }
            }

            if (data.especiales > 0) {
                
                data.especiales = []
                
                let fecha = fn_convertDateFormat(data.dia)

                for (let index = 0; index < tamaño_especiales; index++) {
                    let select = 'select_especial_'+index
                    let input = 'input_especial_'+index
                    
                    data.especiales.push('Dia ' + fecha + ', ' + data[select] + data[input])

                    delete data[select]
                    delete data[input]
                }
            }

            Object.assign(servicio, data)
            
            document.getElementById('idContainerSubmitServicio').disabled = true;

            updateDoc(doc(db, nombre_coleccion, id_factura), {servicios: arrayUnion(servicio)});

            //! NO FUNKA, pero quizas se pueda usar con ON 
            //this.servicios(FACTURA_filtro_User, ...global_parametros) 
            //Dialog.prototype.$_contenido_modal_full(this.servicios(FACTURA_filtro_User, ...global_parametros))

            
        } catch (error) {
            mensaje_toastify('Error al enviar el formulario', 'red')
            document.getElementById('idContainerSubmitServicio').disabled = false;
            console.log('Atencion', error.message);
            console.log(error);
        }
    }

    
    realTime(parametros) {
        
        const querySnapshot_facturas = getDocs(collection(db, 'venort__facturas'))
        const data_facturas = querySnapshot_facturas.docs;
        
        facturas_realTime((data_facturas) => {

            if (data_facturas) {
                /// ----------------------------------------------------------------------------
                /// Filtrado de las facturas, HAY FACTURAS
                /// ----------------------------------------------------------------------------
                const facturas_filtradas_uid = []
                
                data_facturas.forEach(element => {
        
                    const id = element.id
                    const factura = Object.assign(element.data(), {id})
                    
                    if (factura.emisor._uid === auth.currentUser.uid) {
                        
                        //console.log('UID: ', factura.emisor._uid ,element);
                        facturas_filtradas_uid.push(factura)
                    }
                })
                
                const FACTURA_filtro_User = facturas_filtradas_uid.map((element, i) => {
                    return new Facturas(element.id, element.datos, element.estado, element.receptor, element.emisor, element.concepto, element.servicios, element.factura);
                });

                /// ----------------------------------------------------------------------------------------------------
                /// Obtenemos el proximo numero de factura automaticamente -> se usa en 'agregar factura'
                /// ----------------------------------------------------------------------------------------------------
                /// bucle para sacar todos 'numero_factura' y nos quedamos con el ultimo 'at(-1)'
                /// con 'split' separamos en array ej: 01/25 -> [01][25] y nos quedamos con el item [0]
                /// y le sumamos 1 para ya tener listo el proximo numero de factura, se guarda en una global
                /// en SUBMIT recibirá y si es menos de 10 se le pondra un cero delante ej: 01/25, 02/25, etc
                /// -----------------------------------------------------------------------------------------------------
                const ULTIMO_NUMERO_FACTURA = []
                
                FACTURA_filtro_User.forEach(element => {
                    
                    Object.entries(element._datos).forEach((key) => {
                        
                        if (key[0] == 'numero_factura') {
                            
                            ULTIMO_NUMERO_FACTURA.push(key[1])
                        }
                    });
                });

                ULTIMO_NUMERO_FACTURA.sort()
                global_ULTIMO_NUMERO_FACTURA = parseFloat(ULTIMO_NUMERO_FACTURA.at(-1).split('/')[0]) + 1

                /// ----------------------------------------------------------------------------
                /// Obtenemos el concepto del receptor al que vamos a enviar la factura
                /// en SUBMIT recibirá y cambiamos X1, X2 y X3, por la 1º o 2º quincena,
                /// el mes y el año
                /// ----------------------------------------------------------------------------
                const CONCEPTO = RECEPTORES.filter(element => element._alias == 'Rhenus')
                global_CONCEPTO = CONCEPTO[0]._concepto


                /// ----------------------------------------------------------------------------
                /// Obtenemos los servicios de la factura y guardamos en una global
                /// ----------------------------------------------------------------------------
                                
                if (parametros) {
                    
                    if (parametros[0] == 'servicios' || parametros[0] == 'edit_servicios')  {
                        const SERVICIOS = FACTURA_filtro_User.filter(element => element._id === parametros[2])
                        global_SERVICIOS = SERVICIOS[0]._servicios
                    }
                
                    /// -----------------------------------------------------------------
                    ///         rellenamos los formularios y volcamos su contenido 
                    /// -----------------------------------------------------------------
                    /// agregar, editar, borrar
                    if (parametros[0] == 'delete_factura' || parametros[0] == 'delete_servicio' || parametros[0] == 'agregar_servicio' || parametros[0] == 'edit_factura' || parametros[0] == 'edit_servicio' || parametros[0] == 'agregar_factura') {

                        let contenido = Crud.prototype.formularios(parametros, FACTURA_filtro_User)
                        const container = document.getElementById('idContainer__contenido_modal_auto');
                        container.innerHTML = ''
                        return container.innerHTML = contenido
                    }

                    /// listar servicios
                    if (parametros[0] == 'servicios') {

                        let contenido = this.servicios(FACTURA_filtro_User, ...parametros)
                        const container = document.getElementById('idContainer__contenido_modal_full');
                        container.innerHTML = ''
                        return container.innerHTML = contenido

                    }

                    
                    if (parametros[0] == 'candado') {

                        try {
                            const CANDADO = {

                                bloquear: () => {
                                    global_ESTADO_FACTURA.bloqueada = true
                                    let datos_actualizados = global_ESTADO_FACTURA
                                    parametros = []
                                    return actualizar_estado_factura(id_factura, datos_actualizados)
                                },
                                
                                desbloquear: () => {
                                    global_ESTADO_FACTURA.bloqueada = false
                                    let datos_actualizados = global_ESTADO_FACTURA
                                    parametros = []
                                    return actualizar_estado_factura(id_factura, datos_actualizados)
                                },

                                fecha_envio_email_factura: () => {                          /// en Crud.js --> parametros[0], parametros[1], parametros[2]
                                    return Dialog.prototype.$_contenido_modal_auto(Crud.prototype.formularios([parametros[1], id_factura, global_TOTAL_FACTURA], FACTURA_filtro_User))
                                },

                                fecha_factura_cobrada: () => {
                                    return Dialog.prototype.$_contenido_modal_auto(Crud.prototype.formularios([parametros[1], id_factura], FACTURA_filtro_User))
                                }
                            }
                    
                            return CANDADO[parametros[1]]()
                        
                        } catch (error) {
                            console.log('ERROR', error);
                        }
                    }

                } else {
                    
                    this.contenido_filtrado_realTime(FACTURA_filtro_User)

                    /// color VERDE al add o update la CARD
                    const AVISO_CARD = {

                        sin_aviso: () => {
                            /// tengo este para que no de error, al poner en return '()' y lo dejo en predeterminado
                        },

                        aviso_agregar_factura: () => {

                            const container = document.querySelector(`main#idContainer__contenido [data-p2='${global_POSICION_CARD}']`)

                            container.style.background = 'green'
                            container.style.color = 'white'

                            setTimeout(() => {
                                container.style.background = 'white'
                                container.style.color = 'black'
                            }, 2500);
                        },

                        aviso_actualizar_factura: () => {
                            const container = document.querySelector(`main#idContainer__contenido [data-p2='${global_POSICION_CARD}']`)

                            container.style.background = 'green'
                            container.style.color = 'white'

                            setTimeout(() => {
                                container.style.background = 'white'
                                container.style.color = 'black'
                            }, 2500);
                        },

                        aviso_agregar_servicio: () => {
                            
                            let aviso = ''

                            setTimeout(() => {
                                const tamano = document.querySelectorAll('#idSectionListaServicios ul.card li[data-posicion]').length
                                const posicion = document.querySelectorAll(`#idSectionListaServicios ul.card li[data-posicion="${tamano-1}"]`)
                                aviso = posicion[0].parentElement
                                aviso.classList.add("estilo_agregar_servicio")
                            }, 500);
                            
                            setTimeout(() => {
                                aviso.classList.remove("estilo_agregar_servicio")
                            }, 2500);
                        },

                        aviso_actualizar_servicio: () => {
                            
                            let aviso = ''

                            setTimeout(() => {
                                const posicion = document.querySelectorAll(`#idSectionListaServicios ul.card li[data-posicion="${global_POSICION_CARD}"]`)
                                aviso = posicion[0].parentElement
                                aviso.classList.add("estilo_agregar_servicio")
                            }, 500);
                            
                            setTimeout(() => {
                                aviso.classList.remove("estilo_agregar_servicio")
                            }, 2500);
                        }
                    }

                    return AVISO_CARD[global_PROPIEDAD_AVISO]()
                    
                }

            } else {
                return 'No hay facturas, pulsa + para crear'
            }
        })
    }   
}

//! revisar si funciona
export const FACTURA_filtro_User = ''
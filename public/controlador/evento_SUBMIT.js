import { Facturas, global_SERVICIOS } from "../modelo/contenido/Facturas.js";
import { mensaje_toastify } from "../modelo/database/remote/toastify.js";
import { Dialog } from "../modelo/html/Dialog.js";
import { global_ESTADO_FACTURA, global_guardar_parametro_posicion_factura } from "../modelo/contenido/Facturas.js";
import { actualizar_servicio, actualizar_factura, actualizar_estado_factura } from "../modelo/database/remote/firebase.js"; 

/// global que guarda la posicion de la card que es editada
export let global_POSICION_CARD = 0
export let global_PROPIEDAD_AVISO = 'sin_aviso'

/// ----------------- FUNCIONES ----------------------

const fn_convertDateFormat = (string) => {
    var info = string.split('-').reverse().join('/')
    return info
}

const fn_limpiar_global_PROPIEDAD_AVISO = () => {

    setTimeout(() => {
        return global_PROPIEDAD_AVISO = 'sin_aviso' 
    }, 1000);
}

const fn_formatear__ACTUALIZAR_SERVICIO = (parametro_id, resto_data, parametro_posicion) => {

    /// objeto de todos los Servicios, escojo la posicion que voy a actualizar
    global_SERVICIOS[parametro_posicion] = resto_data
    /// lo llamo data para trabajar mejor
    let data = global_SERVICIOS[parametro_posicion]

    /// si no detecta extras o especiales crea el objeto y lo pone a cero
    try { data.extras ? '' : data.extras = 0} catch (error) {data.extras = 0}
    try { data.especiales ? '' : data.especiales = 0} catch (error) {data.especiales = 0}
    
    /// --------- EXTRAS ---------

    try {
        let array_extras = []
        let array_extras_concepto = []

        if (data.extras > 0) {

            let tamaño = data.extras
            let fecha = fn_convertDateFormat(data.dia)

            for (let index = 0; index < tamaño; index++) {
                
                let select = 'select_extra_'+index
                let input = 'input_extra_'+index
                let concepto = 'input_extra_concepto_'+index

                array_extras.push(data[select] + data[input])
                array_extras_concepto.push('Dia ' + fecha + ', ' + data[select] + data[input] +', '+ data[concepto])

                delete data[select]
                delete data[input]
                delete data[concepto]
            }

            data.extras = array_extras
            data.extras_concepto = array_extras_concepto
        
        } else { 
            /// -------- ESPECIALES NEW ---------
            
            let array_extras_formateados = []
            let array_extras_concepto_formateados = []
            
            const array_extras = Object.entries(data).map((key) => {
                return key
            })
            
            array_extras.forEach((element, i) => {
                
                if (element[0].slice(0,6) == 'extra_') {
                    
                    array_extras_formateados.push(element[1])
                    /// eliminamos de la data, el especial ya formateado
                    delete data[element[0]]
                    data.extras = array_extras_formateados                
                    
                }

                if (element[0].slice(0,16) == 'extras_concepto_') {

                    array_extras_concepto_formateados.push(element[1])
                    /// eliminamos de la data, el especial ya formateado
                    delete data[element[0]]
                    data.extras_concepto = array_extras_concepto_formateados                
                    
                }
            });
        }

    } catch (error) {
        console.log('ERROR en SUBMIT EXTRAS', error);
    }

    
    /// -------- ESPECIALES ---------

    try {
        let array_especiales = []

        /// entra aqui cuando agregamos un nuevo especial
        if (data.especiales > 0) {
            console.log('IF ESPECIALES > 0');
            let tamaño = data.especiales
            let fecha = fn_convertDateFormat(data.dia)
    
            for (let index = 0; index < tamaño; index++) {
                
                let select = 'select_especial_'+index
                let input = 'input_especial_'+index
                
                array_especiales.push('Dia ' + fecha + ', ' + data[select] + data[input])
    
                delete data[select]
                delete data[input]
            }
    
            data.especiales = array_especiales
    
        } else { 
            /// entra aqui cuando los especiales ya estaban o se crean nuevos
        
            let array_especiales_formateados = []
    
            const array_especiales = Object.entries(data).map((key) => {
                return key
            })
    
            array_especiales.forEach((element, i) => {

                if (element[0].slice(0,9) == 'especial_') {
                    console.log('ELSE ESPECIAL_');
                    array_especiales_formateados.push(element[1])
                    /// eliminamos de la data, el especial ya formateado
                    delete data[element[0]]
                    data.especiales = array_especiales_formateados                
                }
            });
        }
    } catch (error) {
        console.log('ERROR en SUBMIT ESPECIALES', error);
    }

    
    /// actualizo la posicion ya formateada
    global_SERVICIOS[parametro_posicion] = data

    actualizar_servicio(parametro_id, global_SERVICIOS)
    Dialog.prototype.cerrar_modal('auto')
}

const fn_colorear__AVISO_ACTUALIZACION = (parametro_posicion) => {
    /// CARD: aviso en color Green cuando se efectura una nueva factura
    /// obtenemos la posicion de la card editada y la ponemos en la global
    global_POSICION_CARD = parametro_posicion
    global_PROPIEDAD_AVISO = 'aviso_actualizar_servicio'
}

/// -------------------- FIN --------------------------


async function fn_submit(e) {
            
    e.preventDefault();

    let data = Object.fromEntries(new FormData(e.target));

    if (e.target.id == 'idFormCrearFactura') {

        Facturas.prototype.factura(data)
        Dialog.prototype.cerrar_modal('auto')
        /// CARD: aviso en color Green cuando se efectura una nueva factura
        console.log('...', global_guardar_parametro_posicion_factura);
        global_POSICION_CARD = 0
        global_PROPIEDAD_AVISO = 'aviso_agregar_factura'
        /// limpiamos global al cabo de 1 sg para que no produzca ningun bug
        fn_limpiar_global_PROPIEDAD_AVISO()
    }

    if (e.target.id == 'idFormEditFactura') {

        const {parametro_id, concepto, posicion_card, ...datos} = data
        actualizar_factura(parametro_id, concepto, datos)
        Dialog.prototype.cerrar_modal('auto')
        /// CARD: aviso en color Green cuando se efectura una nueva factura
        /// obtenemos la posicion de la card editada y la ponemos en la global
        global_POSICION_CARD = posicion_card
        global_PROPIEDAD_AVISO = 'aviso_actualizar_factura'
        /// limpiamos global al cabo de 1 sg para que no produzca ningun bug
        fn_limpiar_global_PROPIEDAD_AVISO()
    }

    if (e.target.id == 'idFormAddServicio') {

        Facturas.prototype.add_servicio(data)
        Dialog.prototype.cerrar_modal('auto')
        /// CARD: aviso en color Green cuando se efectura una nueva factura
        /// obtenemos la posicion de la card editada y la ponemos en la global
        global_POSICION_CARD = 0
        global_PROPIEDAD_AVISO = 'aviso_agregar_servicio'
        /// limpiamos global al cabo de 1 sg para que no produzca ningun bug
        fn_limpiar_global_PROPIEDAD_AVISO()
    }

    if (e.target.id == 'idFormEditServicio') {

        /// destructuracion para quitar parametros
        const { parametro_posicion, parametro_id, ...resto_data} = data

        fn_formatear__ACTUALIZAR_SERVICIO(parametro_id, resto_data, parametro_posicion)

        fn_colorear__AVISO_ACTUALIZACION(parametro_posicion)

        /// limpiamos global al cabo de 1 sg para que no produzca ningun bug
        fn_limpiar_global_PROPIEDAD_AVISO()
    }

    if (e.target.id == 'idFormFechaEnvioEmailFactura') {

        global_ESTADO_FACTURA.cobrada.total = data.total_factura
        global_ESTADO_FACTURA.enviada.fecha = data.dia
        global_ESTADO_FACTURA.enviada.estado = true
      
        Dialog.prototype.cerrar_modal('auto')
        actualizar_estado_factura(data.id_factura, global_ESTADO_FACTURA)
        /// limpiamos global al cabo de 1 sg para que no produzca ningun bug
        fn_limpiar_global_PROPIEDAD_AVISO()
    }

    if (e.target.id == 'idFormFechaFacturaCobrada') {

        global_ESTADO_FACTURA.cobrada.fecha = data.dia
        global_ESTADO_FACTURA.cobrada.estado = true
      
        Dialog.prototype.cerrar_modal('auto')
        actualizar_estado_factura(data.id_factura, global_ESTADO_FACTURA)
        /// limpiamos global al cabo de 1 sg para que no produzca ningun bug
        fn_limpiar_global_PROPIEDAD_AVISO()
    }
}

document.addEventListener('submit', e => {
    fn_submit(e);
});
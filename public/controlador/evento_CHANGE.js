import { Facturas } from "../modelo/contenido/Facturas.js";
import { Crud } from "../modelo/crud/Crud.js";
import { Select } from "../modelo/html/Select.js";

const fn_CHANGE = async (e) => {
    
    try {

        Select.prototype.filtrar()

        /// -------------------------------------------
        /// FORMULARIO -  menu circular > crear factura
        /// -------------------------------------------

        let guardar_id_cliente = 0
        /// Elegir receptor para la factura, al llamar al metodo, se despliega el formulario del receptor
        if (e.target.name == 'idReceptor') {

            /// !elige un cliente
            if (e.target.value != '') {
                /// se guarda para pasarlo por parametro en otras llamadas
                guardar_id_cliente = e.target.value 
                Crud.prototype.$_formulario_dinamico(e.target.value)
                /// lista automaticamente la ultima actualizacion de precios e impuestos
                Crud.prototype.$_listar_precios(e.target.value, 0)
                Crud.prototype.$_listar_impuestos(e.target.value, 0)
            } else {
                document.getElementById('idPrecios').style.display = 'none'
                document.getElementById('idImpuestos').style.display = 'none'
                document.getElementById('idContainerListasPreciosImpuestos').style.display = 'none'
                document.getElementById('idContainerSubmitFactura').style.display = 'none'
                
                document.getElementById('idListaPrecios').innerHTML = ''
                document.getElementById('idListaImpuestos').innerHTML = ''
            }
            
        }

        if (e.target.name == 'idPrecios') {
            Crud.prototype.$_listar_precios(guardar_id_cliente, e.target.value)
        }

        if (e.target.name == 'idImpuestos') {
            Crud.prototype.$_listar_impuestos(guardar_id_cliente, e.target.value)
        }

        if (e.target.name == 'extras') {
            Facturas.prototype.incrementar_inputs_en_extras(e.target.value)
        }

        if (e.target.name == 'especiales') {
            Facturas.prototype.incrementar_inputs_en_especiales(e.target.value)
        }

    } catch (error) {
        console.log('ERROR', error);
    }
}

document.addEventListener('change', e => {
    fn_CHANGE(e);
});
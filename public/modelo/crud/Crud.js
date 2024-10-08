import { RECEPTORES } from "../contenido/Receptores.js";
import { global_ULTIMO_NUMERO_FACTURA, global_CONCEPTO } from "../contenido/Facturas.js";



const fn_MOSTRAR_CONTENEDOR_ESPECIALES = (opcion) => {
    const btnEliminarInputEspecial = document.getElementById('idContainerInputsEspecialesIconoEliminar')
    const btnAgregarInputEspecial = document.getElementById('idContainerInputsEspecialesIconoAgregar')

    const obj_MOSTRAR = {
        mostrar: () => {
            btnAgregarInputEspecial.style.display = 'grid'
            btnEliminarInputEspecial.style.display = 'grid'
        },
        ocultar: () => {
            btnAgregarInputEspecial.style.display = 'none'
            btnEliminarInputEspecial.style.display = 'none'
        }
    }

    return obj_MOSTRAR[opcion]()
}

export class Crud {

    mostrar_iconos(textIcon, propiedad, name) {

        const oculto = document.querySelectorAll('ul.oculto > li:last-child')

        const card_titulo = document.querySelectorAll('.card_titulo')
        let tamaño = card_titulo[1].childNodes.length

        oculto.forEach(element => {
            
            try {

                console.log(element);

                if (element.children[0].dataset.name) {

                    if (element.children[0].dataset.name == 'factura') {
                        element.children[0].dataset.p1 = textIcon+'_factura'
                    }

                    if (element.children[0].dataset.name == 'servicio') {
                        element.children[0].dataset.p1 = textIcon+'_servicio'
                        card_titulo[1].childNodes[tamaño-1].classList.add('activo')
                        card_titulo[1].childNodes[tamaño-1].innerText = textIcon
                    }   
                }

                element.lastChild.innerText = textIcon;
                element.classList.add('activo');
                

            } catch (error) {
                console.log(error);
            }
        });
    }

    ocultar_iconos() {
        const dedo = document.querySelectorAll('summary > ul > li:last-child')
        
        dedo.forEach(element => {
            try {
                element.classList.remove('activo');

            } catch (error) {
                console.log(error);
            }
        });
    }

    $_formulario_dinamico(id) {

        try {
            const option_precios = document.getElementById('idPrecios')
            const option_impuestos = document.getElementById('idImpuestos')

            option_precios.innerHTML = ''
            option_impuestos.innerHTML = ''
            
            INFO_RECEPTOR[id]._precios.forEach((element, i) => {
            
                if (i === 0) {
                    return option_precios.innerHTML += `<option value='${i}'>Ultima actualización (${element.fecha})</option>`;
                } else {
                    return option_precios.innerHTML += `<option value='${i}'>${element.fecha}</option>`;
                }
            });
        
            INFO_RECEPTOR[id]._impuestos.forEach((element, i) => {
                if (i === 0) {
                    return option_impuestos.innerHTML += `<option value='${i}'>Ultima actualización (${element.fecha})</option>`;
                } else {
                    return option_impuestos.innerHTML += `<option value='${i}'>${element.fecha}</option>`;
                }
            });
    
        } catch (error) {
            console.log('ERROR', error.message);
        }

    }

    $_listar_precios(id_cliente, id_precios) { //! OK, pero ERROR al volver a usar sin recargar web
        /// quitamos la ocultacion de los <select> de fechas
        document.getElementById('idPrecios').style.display = 'block' 
        /// activa contenedor listas
        document.getElementById('idContainerListasPreciosImpuestos').style.display = 'grid' 
        /// boton enviar activado
        document.getElementById('idContainerSubmitFactura').style.display = 'block' 
        
        let container = document.getElementById('idListaPrecios')
        container.innerHTML = ''

        Object.entries(INFO_RECEPTOR[id_cliente].precios[id_precios]).forEach(([key, value]) => {
            if (key != 'fecha') {
                return container.innerHTML += `<li>${key}: ${value}</li>`;
            }
        });
    }

    $_listar_impuestos(id_cliente, id_impuestos) {

        /// quitamos la ocultacion de los <select> de fechas
        document.getElementById('idImpuestos').style.display = 'block' 

        let container = document.getElementById('idListaImpuestos')
        container.innerHTML = ''

        Object.entries(INFO_RECEPTOR[id_cliente].impuestos[id_impuestos]).forEach(([key, value]) => {
            if (key != 'fecha') {
                return container.innerHTML += `<li>${key}: ${value}</li>`;
            }
        });
    }

    $_agregar_servicio() {
        console.log('dentro de agregar servicio');
    }
    

    formularios(parametros, FACTURA_filtro_User) {

        const INPUTS_ADD_SERVICIO = Object.entries(FACTURA_filtro_User[0].receptor._precios).map((key, value) => {

            if (key[0] != 'fecha') {
                return `
                <li>
                    <label for='${key[0]}'>${key[0]}</label>
                </li>
                
                ${key[0] == 'extras' ? '<li id="idExtrasX" class="extras"><input type="text" name="'+key[0]+'"><div id="idContainerInputsExtras"></div></li>' : ''}
                
                ${key[0] == 'especiales' ? '<li id="idEspecialesX" class="especiales"><input type="text" name="'+key[0]+'"><div id="idContainerInputsEspeciales"></div></li>' : ''}
        
                ${key[0] != 'extras' && key[0] != 'especiales' ? '<li><input type="text" name="'+key[0]+'"></li>' : ''}`
            }
        });

        const CRUD = {

            /// crear factura
            agregar_factura: () => {

                return `
                <form id='idFormCrearFactura'>

                    <select name='idTipoFactura'>
                        <option value='Factura'>Factura ordinaria</option>
                        <option value='Factura'>Factura simplificada</option>
                        <option value='Factura'>Factura proforma</option>
                        <option value='Factura'>Factura rectificativa</option>
                        <option value='Factura'>Factura electrónica</option>
                        <option value='Factura'>Factura a origen</option>
                    </select><br>

                    <ul id='idContainerDatosFactura'>
                        <li><label for='fecha_factura'>Número factura</label></li>
                        <li><input type='text' name='numero_factura' value='${(global_ULTIMO_NUMERO_FACTURA < 10) ? '0'+global_ULTIMO_NUMERO_FACTURA : global_ULTIMO_NUMERO_FACTURA}'></li>

                        <li><label for='fecha_factura'>Fecha factura</label></li>
                        <li><input type='date' name='fecha_factura'></li>

                        <li><label for='fecha_vencimiento'>Fecha vencimiento</label></li>
                        <li><input type='date' name='fecha_vencimiento'></li>
                        
                        <li><label for='concepto'>Concepto</label></li>
                        <li><textarea style='width: 100%' name='concepto' rows="2">${global_CONCEPTO}</textarea></li>
                    </ul>

                    https://css-tricks.com/auto-growing-inputs-textareas/


                    <select name='idReceptor'>${select_alias_receptores.join('')}</select>

                    <ul id='idContainerPreciosImpuestosReceptor'>
                        <li>
                            <select id='idPrecios' name='idPrecios'></select>
                        </li>
                        <li>
                            <select id='idImpuestos' name='idImpuestos'></select>
                        </li>
                    </ul>

                    <div id='idContainerListasPreciosImpuestos'>
                        <ul id='idListaPrecios'></ul>
                        <ul id='idListaImpuestos'></ul>
                    </div>
                    
                    <div id='idContainerSubmitFactura'>
                        <input type='submit' value='Crear Factura'>
                    </div>
                </form>`
            },

            /// crear servicio
            agregar_servicio: () => {

                return `
                <form id='idFormAddServicio'>
                    <ul>
                        <li>Dia:</li>
                        <li><input type='date' name="dia"></li>
                        ${INPUTS_ADD_SERVICIO.join('')}
                    </ul>
                    <div id='idContainerSubmitServicio'>
                        <input type="submit" value="Añadir Servicio">
                    <div>
                </form>`
            },

            /// editar factura
            edit_factura: () => {
                /// obtengo todos los servicios de esa factura
                let filtro_servicios = FACTURA_filtro_User.filter(docu => docu._id === parametros[1]);
                
                let datos = Object.entries(filtro_servicios[0]._datos).map((key, value) => {
                    return `
                        <label id='${key[0]}'>${key[0]}</label>
                        <input name='${key[0]}' type='text' value='${key[1]}'></input>`
                })
                
                return `
                <form id='idFormEditFactura'>
                    <ul>
                        <label id='concepto'>Concepto</label>
                        <input name='concepto' type='text' value='${filtro_servicios[0]._concepto}'></input>
                        ${datos.join('')}
                    </ul>
                    <input name='parametro_id' id='parametro_id' type='hidden' value='${filtro_servicios[0]._id}'></input>
                    <input name='posicion_card' id='posicion_card' type='hidden' value='${parametros[2]}'></input>
                    <div id='idContainerSubmitFactura'>
                        <input type="submit" value="Actualizar Factura">
                    <div>
                </form>`
            },

            /// editar servicio
            edit_servicio: () => {
                /// obtengo todos los servicios de esa factura
                let filtro_servicios = FACTURA_filtro_User.filter(docu => docu._id === parametros[2]);

                let INPUTS_AUTORELLENADOS_PARA_EDITAR_DIA = []
                let INPUTS_AUTORELLENADOS_PARA_EDITAR = []

                /// obtengo los datos del servicio elegido y los meto en inputs del formulario editar
                Object.entries(filtro_servicios[0]._servicios[parametros[1]]).forEach((key) => {
                                    
                    if (key[0] == 'dia') {
    
                        return INPUTS_AUTORELLENADOS_PARA_EDITAR_DIA.push(`<li>Dia:</li><li><input type='date' name="dia" value="${key[1]}"></li>`)
                    }
                });
                
                /// obtengo los datos del servicio elegido y los meto en inputs del formulario editar
                INPUTS_AUTORELLENADOS_PARA_EDITAR = Object.entries(filtro_servicios[0]._servicios[parametros[1]]).map((key, value) => {

                    if (key[0] != 'dia') {

                        //return key[0] == 'extras' ? `<li><label for="${key[0]}">${key[0]}</label></li><li id="idExtrasX" class="extras"><input type="text" name="${key[0]}" value="${key[1]}"><div id="idContainerInputsExtras"></div></li>' : ''}`
                        
                        return `

                            ${key[0] == 'extras' && key[1] == 0 ? '<li><label for="'+key[0]+'">'+key[0]+'</label></li><li id="idExtrasX" class="extras"><input type="text" name="'+key[0]+'" value="'+key[1]+'"><div id="idContainerInputsExtras"></div></li>' : ''}
                            ${key[0] == 'extras_concepto' && key[1] == 0 ? '<li><label for="'+key[0]+'">'+key[0]+'</label></li><li id="idExtrasX2" class="extras"><input type="text" name="'+key[0]+'" value="'+key[1]+'"><div id="idContainerInputsExtras2"></div></li>' : ''}
                            
                            ${key[0] == 'especiales' && key[1] == 0 ? '<li><label for="'+key[0]+'">'+key[0]+'</label></li><li id="idEspecialesX" class="especiales"><input type="text" name="'+key[0]+'" value="'+key[1]+'"><div id="idContainerInputsEspeciales"></div></li>' : ''}
                            
                            ${key[0] != 'extras' && key[0] != 'especiales' && key[0] != 'extras_concepto' ? '<li><label for="'+key[0]+'">'+key[0]+'</label></li><li><input type="text" name="'+key[0]+'" value="'+key[1]+'"></li>' : ''}`
                    }
                });

                //! ---------------------- CONSTRUYENDO EXTRAS --------------------------
                let array_EXTRAS_CON_ICONO_ELIMINAR = []
                let array_EXTRAS_CONCEPTO_CON_ICONO_ELIMINAR = []

                Object.entries(filtro_servicios[0]._servicios[parametros[1]]).forEach((key) => {

                    if (key[0] == 'extras' && key[1] != '0') {

                        key[1].forEach((element, i) => {
                            return array_EXTRAS_CON_ICONO_ELIMINAR.push(`<div id='idContainerBloqueExtra_${i}'><li><label for='extra_${i}'>Extra_${i}</label></li><li><input type="text" name="extra_${i}" value="${element}"></li><li><label for='extras_concepto_${i}'>Extra_concepto_${i}</label></li><li><input type="text" name="extras_concepto_${i}" value="${element}"><span id='${i}' class="material-symbols-outlined icon_borrar_extra">delete</span></li></div>`)
                        });
                    }

                    /* if (key[0] == 'extras_concepto' && key[1] != '0') {

                        key[1].forEach((element, i) => {
                            return array_EXTRAS_CONCEPTO_CON_ICONO_ELIMINAR.push(`<div id='idContainerBloqueExtraConcepto_${i}'><li><label for='extras_concepto_${i}'>Extra_concepto_${i}</label></li><li><input type="text" name="extras_concepto_${i}" value="${element}"><span id='${i}' class="material-symbols-outlined icon_borrar_extra_concepto">delete</span></li></div>`)
                        });
                    } */
                });


                //const TAMAÑO_EXTRAS = array_ESPECIALES_CON_ICONO_ELIMINAR.length ${TAMAÑO_ESPECIALES > 0 ? 'grid' : 'none'}
                const TAMAÑO_EXTRAS = array_EXTRAS_CON_ICONO_ELIMINAR.length

                //! ---------------------- FIN CONSTRUYENDO EXTRAS--------------------------




                //! ---------------------- CONSTRUYENDO ESPECIALES OK --------------------------
                let array_ESPECIALES_CON_ICONO_ELIMINAR = []

                Object.entries(filtro_servicios[0]._servicios[parametros[1]]).forEach((key) => {

                    if (key[0] == 'especiales' && key[1] != '0') {

                        key[1].forEach((element, i) => {
                            return array_ESPECIALES_CON_ICONO_ELIMINAR.push(`<div id='idContainerBloqueEspecial_${i}'><li><label for='especial_${i}'>Especial_${i}</label></li><li><input type="text" name="especial_${i}" value="${element}"><span id='${i}' class="material-symbols-outlined icon_borrar_especial">delete</span></li></div>`)
                        });
                    }
                });

                const TAMAÑO_ESPECIALES = array_ESPECIALES_CON_ICONO_ELIMINAR.length

                //! ---------------------- FIN CONSTRUYENDO ESPECIALES --------------------------
                
                return `
                <form id='idFormEditServicio'>
                    <input name='parametro_posicion' type='hidden' value='${parametros[1]}'>
                    <input name='parametro_id' type='hidden' value='${parametros[2]}'>
                    <ul>
                        ${INPUTS_AUTORELLENADOS_PARA_EDITAR_DIA.join('')}
                        ${INPUTS_AUTORELLENADOS_PARA_EDITAR.join('')}
                    </ul>
                    <ul id='idContainerInputsExtrasIconoEliminar' style="display: ${TAMAÑO_EXTRAS > 0 ? 'grid' : 'none'}">
                        ${array_EXTRAS_CON_ICONO_ELIMINAR.join('')}
                        
                    </ul>
                    
                    <ul id='idContainerInputsExtrasIconoAgregar' style="display: ${TAMAÑO_EXTRAS > 0 ? 'grid' : 'none'}"></ul>

                    <span id='idBtnAddExtras' style="display: ${TAMAÑO_EXTRAS > 0 ? 'grid' : 'none'}" class="material-symbols-outlined icon_agregar_extra">add</span>
                    
                    <ul id='idContainerInputsEspecialesIconoEliminar' style="display: ${TAMAÑO_ESPECIALES > 0 ? 'grid' : 'none'}">
                        ${array_ESPECIALES_CON_ICONO_ELIMINAR.join('')}
                    </ul>
                    <ul id='idContainerInputsEspecialesIconoAgregar' style="display: ${TAMAÑO_ESPECIALES > 0 ? 'grid' : 'none'}"></ul>

                    <span id='idBtnAddEspeciales' style="display: ${TAMAÑO_ESPECIALES > 0 ? 'grid' : 'none'}" class="material-symbols-outlined icon_agregar_especial">add</span>
                    
                    <div id='idContainerSubmitServicio'>
                        <input type="submit" value="Actualizar Servicio">
                    <div>
                </form>`
            },

            /// borrar factura
            delete_factura: () => {
                
                return `
                <form id='idFormRemoveFactura'>
                    <h3>¿Desea eliminar la factura Fra.00/24?</h3>
                    <div id='idContainerSubmitServicio'>
                        <input type="submit" value="Borrar" data-evento="click" data-clase="dialog" data-metodo="eliminar_documento" data-propiedad="auto" data-p1='${parametros[1]}'>
                        <input type="submit" value="Cancelar" data-evento="click" data-clase="dialog" data-metodo="cerrar_modal" data-propiedad="auto">
                    <div>
                </form>`
            },

            /// borrar servicio
            delete_servicio: () => {
                
                return `
                <form id='idFormRemoveServicio'>
                    <h3>¿Desea eliminar el Servicio de <strong style='color: red'>${parametros[3]}</strong>?</h3>
                    <div id='idContainerSubmitServicio'>
                        <input style='background: #e74c3c; border: 0; color: white' type="submit" value="Borrar" data-evento="click" data-clase="dialog" data-metodo="eliminar_un_servicio" data-propiedad="auto" data-p1='${parametros[1]}' data-p2='${parametros[2]}'>
                        <input style='background: #27ae60; border: 0; color: white' type="submit" value="Cancelar" data-evento="click" data-clase="dialog" data-metodo="cerrar_modal" data-propiedad="auto">
                    <div>
                </form>`
            },

            /// actualizar estado factura
            fecha_envio_email_factura: () => {

                /// parametros[1] = id_factura
                return `
                <form id='idFormFechaEnvioEmailFactura'>
                    <input name='id_factura' type='hidden' value='${parametros[1]}'>
                    <input name='total_factura' type='hidden' value='${parametros[2]}'>
                    <h3>Fecha de envio de factura</h3>
                    <ul>
                        <li><input type='date' name="dia"></li>
                    </ul>
                    <div id='idContainerSubmitServicio'>
                        <input type="submit" value="Enviar Fecha ">
                    <div>
                </form>`
            },

            fecha_factura_cobrada: () => {

                /// parametros[1] = id_factura
                return `
                <form id='idFormFechaFacturaCobrada'>
                    <input name='id_factura' type='hidden' value='${parametros[1]}'>
                    <h3>Fecha de envio de factura</h3>
                    <ul>
                        <li><input type='date' name="dia"></li>
                    </ul>
                    <div id='idContainerSubmitServicio'>
                        <input type="submit" value="Enviar Fecha ">
                    <div>
                </form>`
            }
        }

        return CRUD[parametros[0]]()
    }
}


export const INFO_RECEPTOR = []

const select_alias_receptores = RECEPTORES.map((element, i) => {
    INFO_RECEPTOR.push(element)
    return `<option value='${i}'>${element._alias}</option>`
});

/// añadimos en el array[0] del <select>
select_alias_receptores.unshift(`<option value=''>Elige un cliente</option>`)
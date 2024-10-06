import { objeto_servicio, Facturas } from "../contenido/Facturas.js";
import { Crud } from "../crud/Crud.js";
import { borrar_documento, borrar_un_servicio } from "../database/remote/firebase.js";

const fn_regenerar_bnt_cicular = () => {

    const bntCircularSPAN = document.querySelector('#idMenuCircular span:nth-child(2)');
    bntCircularSPAN.classList.add("menuCircular__cerrado")
    bntCircularSPAN.classList.remove("menuCircular__desplegado")
    
    const bntCircular = document.getElementById('idContainer__menuCircular');
    bntCircular.classList.remove("activo");
    
    const bntCircular_li = document.getElementById('idMenuCircular');
    bntCircular_li.classList.remove("active");
    bntCircular_li.children[1].textContent = 'add';
}

const fn_regenerar_bnt_cicular_full = () => {

    
    const bntCircularSPAN = document.querySelector('#idMenuCircular_modal_full span:nth-child(2)');
    bntCircularSPAN.classList.add("menuCircular__cerrado")
    bntCircularSPAN.classList.remove("menuCircular__desplegado")
    
    const bntCircular = document.getElementById('idContainer__menuCircular_modal_full');
    bntCircular.classList.remove("activo");

    const bntCircular_li = document.getElementById('idMenuCircular_modal_full');
    bntCircular_li.classList.remove("active");
    bntCircular_li.children[1].textContent = 'add';
}

const fn_oculta_fondo_menu_circular = () => {
    /// selecciono el fondo del menu circular y lo oculto
    const fondo_menu_circular = document.getElementById('idFondoNavMenuCircular')
    fondo_menu_circular.style.display = 'none'
    const fondo_menu_circular_full = document.getElementById('idFondoNavMenuCircular_full')
    fondo_menu_circular_full.style.display = 'none'
}

export class Dialog {

    $_contenido_modal_auto(contenido) {
        const container = document.getElementById('idContainer__contenido_modal_auto');
        container.innerHTML = contenido
    }

    //! lo USE directamente en Facturas - real time porque aqui daba error
    $_contenido_modal_full(contenido) {
        const container = document.getElementById('idContainer__contenido_modal_full');
        container.innerHTML = contenido
    }

    //! en principio no lo voy a usar aqui, meto el contenido desde modules o emisores
    $_contenido_modal_left(emisor, receptores) {
        const container_emisor = document.getElementById('idContainerModalLeft');
        container_emisor.innerHTML = emisor
        
        const container_receptores = document.getElementById('idContainerModalLeft2');
        container_receptores.innerHTML = receptores
    }

    //! FUNCIONA -> AQUI SE ESTA ELIMINANDO LOS DOCUMENTOS, PULSANDO EL ICONO BORRAR EN FACTURAS
    //! por el momento o quizas siempre se hara aqui
    eliminar_documento(propiedad, ...parametros) {

        borrar_documento(parametros[0])
        this.cerrar_modal(propiedad)
    }

    eliminar_un_servicio(propiedad, ...parametros) {
        
        borrar_un_servicio(parametros[1], objeto_servicio[parametros[0]])
        this.cerrar_modal(propiedad)
    }
    
    abrir_modal(propiedad, ...parametros) {

        fn_oculta_fondo_menu_circular()
        
        const modal = document.getElementById(`idContainer__modal_${propiedad}`);

        const MODAL = {
            
            auto: () => {
                
                Facturas.prototype.realTime(parametros)
                
                modal.classList.remove(`close_${propiedad}`)
                modal.showModal()
                modal.classList.add(`open_${propiedad}`)
            },
            
            full: () => {

                /* const btn_bloquear_factura = document.getElementById('idBtnCircular_bloquear_factura')
                const btn_desbloquear_factura = document.getElementById('idBtnCircular_desbloquear_factura')
                /// inserto el ID al Boton 'bloquear factura/ desbloquear factura' en servicios
                /// al abrir el modal de servicios
                btn_bloquear_factura.dataset.p1 = parametros[2]
                btn_desbloquear_factura.dataset.p1 = parametros[2] */

                Facturas.prototype.realTime(parametros)

                modal.classList.remove(`close_${propiedad}`)
                modal.showModal()
                modal.classList.add(`open_${propiedad}`)
            },

            left: () => {
                //this.$_contenido_modal_left(Emisores.prototype.read__emisor(), Receptores.prototype.read__receptores())

                modal.classList.remove(`close_${propiedad}`)
                modal.showModal()
                modal.classList.add(`open_${propiedad}`)
            }
        }

        return MODAL[propiedad]()
    }


    candados(propiedad, ...parametros) {

        const CANDADOS = {

            bloquear: () => {
                return Facturas.prototype.realTime(parametros)
            },

            desbloquear: () => {
                return Facturas.prototype.realTime(parametros)
            }
        }

        return CANDADOS[propiedad]()
    }

    cerrar_modal(propiedad, ...parametros) {

        fn_regenerar_bnt_cicular()
        fn_regenerar_bnt_cicular_full()

        const modal = document.getElementById(`idContainer__modal_${propiedad}`);

        const CERRAR = {

            automatico: (propiedad) => {

                if (propiedad == 'auto') {
                    setTimeout(() => {modal.close()}, 500)
                } else {
                    setTimeout(() => {modal.close()}, 1000)
                }

                modal.classList.remove(`open_${propiedad}`)
                modal.classList.add(`close_${propiedad}`)
            }
        }

        /// oculto los iconos
        Crud.prototype.ocultar_iconos()

        return CERRAR['automatico'](propiedad)
    }
}


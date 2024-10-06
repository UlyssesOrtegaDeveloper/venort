import { Facturas } from "../modelo/contenido/Facturas.js";
import { Gastos } from "../modelo/contenido/Gastos.js";
import { Crud } from "../modelo/crud/Crud.js";
import { Dialog } from "../modelo/html/Dialog.js";
import { MenuCircular } from "../modelo/html/MenuCircular.js";
import { NavBars } from "../modelo/html/NavBars.js";
import { Select } from "../modelo/html/Select.js";
import { TemplateMain } from "../modelo/main/TemplateMain.js";

const fn_CLICK = async (e) => {

}

document.addEventListener('click', e => fn_CLICK(e));




/// Tip 1 - guarda los parametros de 'navBars' para poder recuperarlos cuando se sale de un 'modal', por defecto
/* export let ultima_propiedad = 'template_0' */

document.addEventListener('click', e => { 

    let parametros = [e.target.dataset.p1, e.target.dataset.p2, e.target.dataset.p3, e.target.dataset.p4];
    let clase = e.target.dataset.clase
    let metodo = e.target.dataset.metodo
    let evento = e.target.dataset.evento;
    let propiedad = e.target.dataset.propiedad
    
    const CLASSES = {
        'navBars': NavBars.prototype,
        'facturas': Facturas.prototype,
        'gastos': Gastos.prototype,
        'dialog': Dialog.prototype,
        'templateMain': TemplateMain.prototype,
        'menuCircular': MenuCircular.prototype,
        'selects': Select.prototype,
        'crud': Crud.prototype
    }

    //console.log('¿?', e.target);
    //console.log(CLASSES[clase], clase, metodo, propiedad, parametros);

    /// Tip 1
/*     if (clase == 'template_0') ultima_propiedad = propiedad */

    if (evento == 'click') {
        if (clase && metodo && propiedad) return CLASSES[clase][metodo](propiedad, ...parametros)
        if (clase && metodo) return CLASSES[clase][metodo]()
    }

    //! al picar dentro del modal se cierra
    /// OK -> Cerrar Dialog / Modals 
    if (e.target.open && e.target.dataset.dialog) {
        Dialog.prototype.cerrar_modal(e.target.dataset.dialog)
        ///MenuCircular.prototype.cargar_menu_circular(ultima_propiedad)
    }
})
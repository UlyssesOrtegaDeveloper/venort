import { Cobros } from "../contenido/Cobros.js"
import { Estadisticas } from "../contenido/Estadisticas.js"
import { Facturas } from "../contenido/Facturas.js"
import { Gastos } from "../contenido/Gastos.js"
import { Mapa } from "../contenido/Mapa.js"
import { MenuCircular } from "../html/MenuCircular.js"
import { NavBars } from "../html/NavBars.js"
import { Select } from "../html/Select.js"

export class TemplateMain {

    $_inner_html(contenido) {
        let container = document.getElementById('idContainer__contenido')
        container.innerHTML = ''
        container.innerHTML = contenido
    }

    $_contenido(propiedad) {
    
        try {
    
            const TEMPLATES = {
                template_0: () => {return Facturas.prototype.contenido()},
                template_1: () => {return Gastos.prototype.contenido()},
                template_2: () => {return Estadisticas.prototype.contenido()},
                template_3: () => {return Mapa.prototype.contenido()},
                template_4: () => {return Cobros.prototype.contenido()}
            }

            return TEMPLATES[propiedad]()

        } catch (error) {
            console.log('Error', error);
        }
    }

    mostrar(propiedad, id_template) {
        try {
            this.$_inner_html(this.$_contenido(propiedad))
            MenuCircular.prototype.cargar_menu_circular(propiedad)
            NavBars.prototype.$_pestañas_cambio_color(id_template)
            Select.prototype.cargar_filtros(propiedad)
        } catch (error) {
            console.log('Error', error);
        }
    }
}
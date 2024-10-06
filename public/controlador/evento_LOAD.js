import { MenuCircular } from "../modelo/html/MenuCircular.js";
import { NavBars } from "../modelo/html/NavBars.js";
import { Select } from "../modelo/html/Select.js";
import { TemplateMain } from "../modelo/main/TemplateMain.js";

//window.addEventListener("load", e => {
window.addEventListener("DOMContentLoaded", e => {

    //! ahora mismo, auque ponga un scrips src en app.html no entra aqui
    //! ahora mismo, modules.js es el que hace de LOAD
    
    try {
        console.log('hola soy LOAD');
        //NavBars.prototype.cargar_barras()
        //MenuCircular.prototype.cargar_menu_circular('template_0')
        //Select.prototype.cargar_filtros('template_0')
        //TemplateMain.prototype.mostrar('template_0', 0)

        ///MenuCircular.prototype.read(0)
    } catch (error) {
        console.log('ERROR LOAD', error);
    }
});
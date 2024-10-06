export class NavBars {
    
    $_inner_html(id, contenido) {
        const container = document.getElementById(id);
        container.innerHTML = contenido
    }

    $_crear_barra(propiedad) {
        
        const CONTENIDO = {
            top_mobile: () => {
                return `<li><span id="idNavBarTop__btnUser" data-evento="click" data-clase='dialog' data-metodo='abrir_modal' data-propiedad="left" data-p1="modal_left" class="material-symbols-outlined">person</span></li>
                <li><span id="idNavBarTop__title">App MVC 2.0</span></li>
                <li><span id="idNavBarTop__btnFilter"  data-evento="click" data-clase='selects' data-metodo='toggle_abrir_cerrar' data-propiedad="" data-p1="" class="material-symbols-outlined">filter_alt</span></li>`
            },

            top_desktop: () => {
                return `<li><span class="material-symbols-outlined">diamond</span> <span> Logo</span></li>
                        <li></li>
                        <li>Section 1</li>
                        <li>Section 2</li>
                        <li>Section 3</li>
                        <li>Section 4</li>
                        <li>Section 5</li>
                        <li><span class="material-symbols-outlined">person</span></li>`
            },

            bottom: () => {

                const array_ICONOS = ['inventory','fastfood','bar_chart','map','savings']
                const array_NOMBRE_CLASE = ['facturas','gastos','estadisticas','mapa','cobros']
                const array_NOMBRE_PESTAÑA = ['Facturas','Gastos','Estadisticas','Mapa','Cobros']
                
                const prev_selector_UL = '<ul>'
                const post_selector_UL = '</ul>'

                /* 
                    <span data-evento="click" data-clase="${array_NOMBRE_CLASE[i]}" data-metodo="realTime" data-propiedad="template_${i}" data-p1="${i}" class="material-symbols-outlined">${element}</span>
                    <span data-evento="click" data-clase="${array_NOMBRE_CLASE[i]}" data-metodo="realTime" data-propiedad="template_${i}" data-p1="${i}">${array_NOMBRE_PESTAÑA[i]}</span>
                */

                const resultado = array_ICONOS.map((element, i) => {
                    return `<li>
                                <span data-evento="click" data-clase="${array_NOMBRE_CLASE[i]}" data-metodo="realTime" class="material-symbols-outlined">${element}</span>
                                <span data-evento="click" data-clase="${array_NOMBRE_CLASE[i]}" data-metodo="realTime">${array_NOMBRE_PESTAÑA[i]}</span>
                            </li>`
                });

                return prev_selector_UL + resultado.join('') + post_selector_UL
            }
        }

        return CONTENIDO[propiedad]()
    }

    $_pestañas_cambio_color(id_template) { //! INCOMPLETO, PASO 7 MIRARLO , mirar tambien 'active'

        try {
            /// Paso 1 - puntero
            const contenedorNavBarBottom = document.querySelectorAll('#idContainer__navBarBottom > ul > li')
            /// Paso 2 - limpiamos contenido
            contenedorNavBarBottom.forEach(element => element.classList = '');
            /// Paso 3 - insertamos clase active en la pestaña elegida
            contenedorNavBarBottom[id_template].classList.add("active");
            
            /// Paso 7 - Cerramos Edit y Delete al pasar por Sections
            const ultimoItemLi = document.querySelectorAll('.card > li:last-child')

            ultimoItemLi.forEach(element => {
            
                element.classList.remove('activo')
            });
        } catch (error) {
            console.log('ERROR PESTAÑAS CAMBIO COLOR', error);
        }
    }

    cargar_barras() {
        this.$_inner_html('navbar__top_mobile', this.$_crear_barra('top_mobile'))
        this.$_inner_html('navbar__top_desktop', this.$_crear_barra('top_desktop'))
        this.$_inner_html('idContainer__navBarBottom', this.$_crear_barra('bottom'))
        this.$_pestañas_cambio_color(0)
    }
}
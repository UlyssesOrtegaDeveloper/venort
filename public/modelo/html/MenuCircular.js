import { Crud } from "../crud/Crud.js";

export class MenuCircular {

    /// Evento Load & Click
    
    $_inner_html(contenido) {
        
        try {
            const container = document.getElementById('idContainer__menuCircular');
            container.innerHTML = '';
            container.innerHTML = contenido
        } catch (error) {
            console.log('ERROR MENU CIRCULAR CONTENEDOR', error);
        }
    }

    $_contenido(propiedad) {
        
        const CONTENIDO = {

            template_0: [
                '<li data-evento="click" data-clase="crud" data-metodo="mostrar_iconos" data-propiedad="delete"><span data-evento="click" data-clase="crud" data-metodo="mostrar_iconos" data-propiedad="delete">Borrar Factura</span><span data-evento="click" data-clase="crud" data-metodo="mostrar_iconos" data-propiedad="delete" class="material-symbols-outlined">delete_forever</span></li>',
                '<li data-evento="click" data-clase="crud" data-metodo="mostrar_iconos" data-propiedad="edit"><span data-evento="click" data-clase="crud" data-metodo="mostrar_iconos" data-propiedad="edit">Editar Factura</span><span data-evento="click" data-clase="crud" data-metodo="mostrar_iconos" data-propiedad="edit" class="material-symbols-outlined">edit</span></li>',
                '<li data-evento="click" data-clase="dialog" data-metodo="abrir_modal" data-propiedad="auto" data-p1="agregar_factura"><span data-evento"click">Agregar Factura</span><span data-evento="click" class="material-symbols-outlined">add</span></li>'
            ],

            template_1: [
                '<li data-evento"click"><span data-evento"click">Borrar Gastos</span><span data-evento"click" class="material-symbols-outlined">delete_forever</span></li>',
                '<li data-evento"click"><span data-evento"click">Editar Gastos</span><span data-evento"click" class="material-symbols-outlined">edit</span></li>',
                '<li data-evento"click"><span data-evento"click">Agregar Gastos</span><span data-evento"click" class="material-symbols-outlined">add</span></li>'
            ],

            template_2: [
                '<li data-evento"click"><span data-evento"click">Borrar 2</span><span data-evento"click" class="material-symbols-outlined">delete_forever</span></li>',
                '<li data-evento"click"><span data-evento"click">Editar 2</span><span data-evento"click" class="material-symbols-outlined">edit</span></li>',
                '<li data-evento"click"><span data-evento"click">Agregar 2</span><span data-evento"click" class="material-symbols-outlined">add</span></li>'
            ],

            template_3: [
                '<li data-evento"click"><span data-evento"click">Borrar 3</span><span data-evento"click" class="material-symbols-outlined">delete_forever</span></li>',
                '<li data-evento"click"><span data-evento"click">Editar 3</span><span data-evento"click" class="material-symbols-outlined">edit</span></li>',
                '<li data-evento"click"><span data-evento"click">Agregar 3</span><span data-evento"click" class="material-symbols-outlined">add</span></li>'
            ],

            template_4: [
                '<li data-evento"click"><span data-evento"click">Borrar 4</span><span data-evento"click" class="material-symbols-outlined">delete_forever</span></li>',
                '<li data-evento"click"><span data-evento"click">Editar 4</span><span data-evento"click" class="material-symbols-outlined">edit</span></li>',
                '<li data-evento"click"><span data-evento"click">Agregar 4</span><span data-evento"click" class="material-symbols-outlined">add</span></li>'
            ]            
        }

        return CONTENIDO[propiedad].join('')
    }

    cargar_menu_circular(propiedad) {
        this.$_inner_html(this.$_contenido(propiedad))
    }

    /// Eventos Click

    toggle_abrir_cerrar() {
        
        const contenedorBtnCirculares = document.getElementById('idContainer__menuCircular');
        contenedorBtnCirculares.classList.toggle('activo'); //idBtnCircular
        
        const bntCircular = document.getElementById('idMenuCircular');
        let bool = bntCircular.classList.toggle("active");

        /// cambiamos el 'icono' de ' + - ' si esta abierto o cerrado el menu
        bool ? bntCircular.children[1].textContent = 'remove' : bntCircular.children[1].textContent = 'add';
        
        /// activamos o desactivamos el 'fondo oscuro' al abrir o cerrar el menu circular
        const fondo = document.getElementById('idFondoNavMenuCircular')
        bool ? fondo.style.display = 'block' : fondo.style.display = 'none'

        const bntCircularSPAN = document.querySelector('#idMenuCircular span:nth-child(2)');
        bool ? bntCircularSPAN.classList.add("menuCircular__desplegado") + bntCircularSPAN.classList.remove("menuCircular__cerrado") : bntCircularSPAN.classList.remove("menuCircular__desplegado") + bntCircularSPAN.classList.add("menuCircular__cerrado")


        


        /* if (!bool) {
            
            const ultimoItemLi = document.querySelectorAll('.card > li:last-child')

            ultimoItemLi.forEach(element => {
            
                element.classList.remove('activo')
            });


            /// quitamos el 'texto' editar o borrar del ultimo <li> de titulo
            const ultimoItemLiTitulo = document.querySelectorAll('.card_titulo > li:last-child');
        
            ultimoItemLiTitulo.forEach(element => {

                try {
                    element.classList.remove('activo')
                } catch (error) {
                    console.log(error);
                }
            });

            
        } */
    }

    
    toggle_abrir_cerrar_modal_left() {
        
        const contenedorBtnCirculares = document.getElementById('idContainer__menuCircular_modal_left');
        contenedorBtnCirculares.classList.toggle('activo'); //idBtnCircular

        Crud.prototype.ocultar_iconos()

        const bntCircular = document.getElementById('idMenuCircular_modal_left');

        let bool = bntCircular.classList.toggle("active");

        bool ? bntCircular.children[1].textContent = 'remove' : bntCircular.children[1].textContent = 'add';

        /// activamos o desactivamos el 'fondo oscuro' al abrir o cerrar el menu circular
        const fondo = document.getElementById('idFondoNavMenuCircular_left')
        bool ? fondo.style.display = 'block' : fondo.style.display = 'none'

        /// activar o desactivar la clase segun este abierto o cerrado el menu, colores
        const bntCircularSPAN = document.querySelector('#idMenuCircular_modal_left span:nth-child(2)');
        bool ? bntCircularSPAN.classList.add("menuCircular__desplegado") + bntCircularSPAN.classList.remove("menuCircular__cerrado") : bntCircularSPAN.classList.remove("menuCircular__desplegado") + bntCircularSPAN.classList.add("menuCircular__cerrado")
        
    }

    toggle_abrir_cerrar_menu_circular_modal_full() {

        const contenedorBtnCirculares = document.getElementById('idContainer__menuCircular_modal_full');
        contenedorBtnCirculares.classList.toggle('activo'); //idBtnCircular

        Crud.prototype.ocultar_iconos()

        const bntCircular = document.getElementById('idMenuCircular_modal_full');

        let bool = bntCircular.classList.toggle("active");

        bool ? bntCircular.children[1].textContent = 'remove' : bntCircular.children[1].textContent = 'add';

        /// activamos o desactivamos el 'fondo oscuro' al abrir o cerrar el menu circular
        const fondo = document.getElementById('idFondoNavMenuCircular_full')
        bool ? fondo.style.display = 'block' : fondo.style.display = 'none'

        /// activar o desactivar la clase segun este abierto o cerrado el menu, colores
        const bntCircularSPAN = document.querySelector('#idMenuCircular_modal_full span:nth-child(2)');
        bool ? bntCircularSPAN.classList.add("menuCircular__desplegado") + bntCircularSPAN.classList.remove("menuCircular__cerrado") : bntCircularSPAN.classList.remove("menuCircular__desplegado") + bntCircularSPAN.classList.add("menuCircular__cerrado")
    }
}


import { FACTURA_filtro_User, Facturas } from "../contenido/Facturas.js";

export class Select {

    /// evento click - Btns bottom
    $_inner_html(contenido) {
        
        try {
            const container = document.getElementById('idContainer__selects');
            container.innerHTML = '';
            container.innerHTML = contenido
        } catch (error) {
            console.log('ERROR SELECTS CONTENEDOR', error);
        }
    }

    $_contenido(propiedad) {

        const obj_FILTROS_OPTIONS = {
    
            receptores: ['Receptor','Rhenus','Hill Food'],
            receptores_values : [false, 'Rhenus','Hill Food'],
            
            emisores: ['Emisores','Ulises', 'Kiara'],
            emisores_values: [false,'Ulises', 'Kiara'],
            
            pagadores: ['Pagador','Ulises', 'Kiara'],
            pagadores_values: [false,'Ulises', 'Kiara'],
        
            deducibles: ['Deducibles','Es deducible', 'No deducible'],
            deducibles_values: [false,'true', 'false'],
        
            ano: ['Años', 2024, 2025],
            ano_values: [false, 2024, 2025],
            
            trimestres: ['Trimestres','1º Trimestre','2º Trimestre','3º Trimestre','4º Trimestre'],
            trimestres_values: [false, '1ºT','2ºT','3ºT','4ºT'],
        
            meses: ['Meses','Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
            meses_values: [false, '01','02','03','04','05','06','07','08','09','10','11','12']
        }
        
        let receptores = obj_FILTROS_OPTIONS.receptores.map((element, i) => `<option value='${obj_FILTROS_OPTIONS.receptores_values[i]}'>${element}</option>`);
        let emisores = obj_FILTROS_OPTIONS.emisores.map((element, i) => `<option value='${obj_FILTROS_OPTIONS.emisores_values[i]}'>${element}</option>`);
        let pagadores = obj_FILTROS_OPTIONS.pagadores.map((element, i) => `<option value='${obj_FILTROS_OPTIONS.pagadores_values[i]}'>${element}</option>`);
        let ano = obj_FILTROS_OPTIONS.ano.map((element, i) => `<option value='${obj_FILTROS_OPTIONS.ano_values[i]}'>${element}</option>`);
        let trimestres = obj_FILTROS_OPTIONS.trimestres.map((element, i) => `<option value='${obj_FILTROS_OPTIONS.trimestres_values[i]}'>${element}</option>`);
        let meses = obj_FILTROS_OPTIONS.meses.map((element, i) => `<option value='${obj_FILTROS_OPTIONS.meses_values[i]}'>${element}</option>`);
        let deducibles = obj_FILTROS_OPTIONS.deducibles.map((element, i) => `<option value='${obj_FILTROS_OPTIONS.deducibles_values[i]}'>${element}</option>`);
        
        /* const FILTROS = [
            {
                template_0: [
                    `<li><select name='filtros_section_0' id='idSelect1' class="claseSelect">${receptores.join('')}</select></li>`,
                    `<li><select name='filtros_section_0' id='idSelect2' class="claseSelect">${meses.join('')}</select></li>`,
                    `<li><select name='filtros_section_0' id='idSelect3' class="claseSelect">${trimestres.join('')}</select></li>`,
                    `<li><select name='filtros_section_0' id='idSelect4' class="claseSelect">${ano.join('')}</select></li>`
                ],
        
                template_1: [
                    `<li><select name='filtros_section_1' id='idSelect1' class="claseSelect">${pagadores.join('')}</select></li>`,
                    `<li><select name='filtros_section_1' id='idSelect2' class="claseSelect">${meses.join('')}</select></li>`,
                    `<li><select name='filtros_section_1' id='idSelect3' class="claseSelect">${trimestres.join('')}</select></li>`,
                    `<li><select name='filtros_section_1' id='idSelect4' class="claseSelect">${ano.join('')}</select></li>`,
                    `<li><select name='filtros_section_1' id='idSelect5' class="claseSelect">${deducibles.join('')}</select></li>`
                ],
        
                template_2: [],
                template_3: [],
        
                template_4: [
                    `<li><select name='filtros_section_4' id='idSelect1' class="claseSelect">${emisores.join('')}</select></li>`,
                    `<li><select name='filtros_section_4' id='idSelect2' class="claseSelect">${receptores.join('')}</select></li>`]
            }
        ] */

        const CONTENIDO = {
            
            template_0: [
                `<li><select name='filtros_section_0' id='idSelect1' class="claseSelect">${receptores.join('')}</select></li>`,
                `<li><select name='filtros_section_0' id='idSelect2' class="claseSelect">${meses.join('')}</select></li>`,
                `<li><select name='filtros_section_0' id='idSelect3' class="claseSelect">${trimestres.join('')}</select></li>`,
                `<li><select name='filtros_section_0' id='idSelect4' class="claseSelect">${ano.join('')}</select></li>`
            ],

            template_1: [
                `<li><select name='filtros_section_1' id='idSelect1' class="claseSelect">${pagadores.join('')}</select></li>`,
                `<li><select name='filtros_section_1' id='idSelect2' class="claseSelect">${meses.join('')}</select></li>`,
                `<li><select name='filtros_section_1' id='idSelect3' class="claseSelect">${trimestres.join('')}</select></li>`,
                `<li><select name='filtros_section_1' id='idSelect4' class="claseSelect">${ano.join('')}</select></li>`,
                `<li><select name='filtros_section_1' id='idSelect5' class="claseSelect">${deducibles.join('')}</select></li>`
            ],

            template_2: [],
            template_3: [],
    
            template_4: [
                `<li><select name='filtros_section_4' id='idSelect1' class="claseSelect">${emisores.join('')}</select></li>`,
                `<li><select name='filtros_section_4' id='idSelect2' class="claseSelect">${receptores.join('')}</select></li>`]
        }
        
        return CONTENIDO[propiedad].join('')
    }

    cargar_filtros(propiedad) {
        return this.$_inner_html(this.$_contenido(propiedad))
    }

    /// evento change - selects
    $_inner_html_change(contenido) {
        
        try {
            const container = document.getElementById('idContainer__contenido');
            container.innerHTML = '';
            container.innerHTML = contenido
        } catch (error) {
            console.log('ERROR SELECTS CONTENEDOR', error);
        }
    }

    $_filtros(factura) { /// 

        const allSelectsValues = document.querySelectorAll('.claseSelect')
        const array_Values = []
        
        allSelectsValues.forEach(element => array_Values.push(element.value));

        let filtro_select1 = document.getElementById('idSelect1').value;
        let filtro_select2 = document.getElementById('idSelect2').value;
        let filtro_select3 = document.getElementById('idSelect3').value;
        let filtro_select4 = document.getElementById('idSelect4').value;

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

        let array_SELECTS = []

        filtro_select1 == 'false' ? array_SELECTS.push(false) : array_SELECTS.push(filtro_select1)
        filtro_select2 == 'false' ? array_SELECTS.push(false) : array_SELECTS.push(filtro_select2)
        filtro_select3 == 'false' ? array_SELECTS.push(false) : array_SELECTS.push(filtro_select3)
        filtro_select4 == 'false' ? array_SELECTS.push(false) : array_SELECTS.push(filtro_select4)

        const filtro = factura.filter(n => {

            const FILTROS = {
                0: () => { return n._receptor.alias == filtro_select1},
                1: () => { return n._datos.fecha_facturacion.split('/')[1] == filtro_select2},
                2: () => { return TRIMESTRES[n._datos.fecha_facturacion.split('/')[1]] == filtro_select3},
                3: () => { return n._datos.fecha_facturacion.split('/')[2] == filtro_select4}
            }

            let INDEX = []
            array_SELECTS.map((element, i) => {if (element) return INDEX.push(i)});
            
            if(INDEX.length == 0) return '<h3>No hay datos al respecto</h3>'
            if(INDEX.length == 1) return FILTROS[INDEX[0]]()
            if(INDEX.length == 2) return FILTROS[INDEX[0]]() && FILTROS[INDEX[1]]()
            if(INDEX.length == 3) return FILTROS[INDEX[0]]() && FILTROS[INDEX[1]]() && FILTROS[INDEX[2]]()
            if(INDEX.length == 4) return FILTROS[INDEX[0]]() && FILTROS[INDEX[1]]() && FILTROS[INDEX[2]]() && FILTROS[INDEX[3]]()

        })
        
        if (filtro.length == 0) {
            return document.getElementById('idContainer__contenido').innerHTML = '<h3 style="padding: 1em; text-align: center; color: red">No hay facturas con esos parametros de busqueda</h3>';
        }

        return filtro

        //return this.MainContenedor(this.read__titulo_facturas(), this.read_facturas_con_filtro(filtro))
    }

    
    filtrar() {
        try {
            const factura_filtrada = this.$_filtros(FACTURA_filtro_User)
            Facturas.prototype.contenido_filtrado(factura_filtrada)
        } catch (error) {
            
        }
    }

    
    /// evento click - Btn icon filtro
    toggle_abrir_cerrar() {
        const contenedorSelects = document.getElementById('idContainer__selects');
        contenedorSelects.classList.toggle("filtro_activo");
    }
}
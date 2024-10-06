import { auth, db } from '../database/remote/firebase.js'
import { getDocs, collection } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js"

export class Receptores {

    constructor(alias, cif, cp, concepto, domicilio, impuestos, precios, razonSocial, uid) {
        this._alias = alias,
        this._cif = cif,
        this._cp = cp,
        this._concepto = concepto,
        this._domicilio = domicilio,
        this._impuestos = impuestos,
        this._precios = precios,
        this._razonSocial = razonSocial,
        this._uid = uid
    }

    /// GETTERS -> Recuperar datos
    get alias() {return this._alias}
    get cif() {return this._cif}
    get cp() {return this._cp}
    get concepto() {return this._concepto}
    get domicilio() {return this._domicilio}
    get impuestos() {return this._impuestos}
    get precios() {return this._precios}
    get razonSocial() {return this._razonSocial}
    get uid() {return this._uid}

    /// SETTERS -> Cambiar datos
    set alias (alias) {this._alias = alias}
    set cif (cif) {this._cif = cif}
    set cp (cp) {this._cp = cp}
    set concepto (concepto) {this._concepto = concepto}
    set domicilio (domicilio) {this._domicilio = domicilio}
    set impuestos (impuestos) {this._impuestos = impuestos}
    set precios (precios) {this._precios = precios}
    set razonSocial (razonSocial) {this._razonSocial = razonSocial}
    set uid (uid) {this._uid = uid}


    read__receptores(receptores) {
        
        let array_RECEPTORES = []

        receptores.forEach((element, i) => {

            array_RECEPTORES[i] = Object.entries(element).map(([key, value]) => {

                if (key != 'uid' && key != 'alias') {
                    return `<li>${key}: ${value}</li>`
                }
            })
        });

        const ACORDEON = array_RECEPTORES.map((element, i) => {
            return `<details name="acordeon"><summary><ul class="oculto"><li>${receptores[i].alias}</li><li><span class="material-symbols-outlined">edit</span></li></ul></summary><ul>${element.join('')}</ul></details>`
        });

        const container_receptores = document.getElementById('idContainerModalLeft2');
        return container_receptores.innerHTML = ACORDEON.join('');
    }




    create__formulario_add_receptor() {
        return '<br><br><h2 style="text-align: center">Formulario add receptor</h2><br><br>'
    }

    upload() {}

    delete() {}

}

let array_filtro_receptores = ''
const querySnapshot_receptores = await getDocs(collection(db, 'venort__receptor_facturas'))
const data_receptores = querySnapshot_receptores.docs;

if (data_receptores.length) {
    
    try {
        const documentos_receptores = data_receptores.map(element => element.data());
        array_filtro_receptores = documentos_receptores.filter(docu => docu.uid === auth.currentUser.uid);
    } catch (error) {
        console.log('Error', error);
    }
}


export const RECEPTORES = array_filtro_receptores.map((element, i) => {
    return new Receptores(element.alias, element.cif, element.codigo_postal, element.concepto, element.domicilio, element.impuestos, element.precios, element.razon_social, element.uid);
});
import { auth, db } from '../database/remote/firebase.js'
import { getDocs, collection } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js"

const DECODING = (str) => {

    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

const ENCODING = (str) => {
        
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
    }));
}


//! ATENCION, esta clase sirve para cuando se crea la factura
//! y para informar del estado de estos datos

export class Emisores {

    constructor(alias, email, telefono, razon_social, dni, domicilio, cp, logo, uid) {
        this._alias = alias,
        this._email = email,
        this._telefono = telefono,
        this._razon_social = razon_social,
        this._dni = dni,
        this._domicilio = domicilio,
        this._cp = cp,
        this._logo = logo
        this._uid = uid
    }

    /// GETTERS -> Recuperar datos
    get alias() {return this._alias}
    get email() {return this._email}
    get telefono() {return this._telefono}
    get razon_social() {return this._razon_social}
    get dni() {return this._dni}
    get domicilio() {return this._domicilio}
    get cp() {return this._cp}
    get logo() {return this._logo}
    get uid() {return this._uid}

    /// SETTERS -> Cambiar datos
    set alias (alias) {this._alias = alias}
    set email (email) {this._email = email}
    set telefono (telefono) {this._telefono = telefono}
    set razon_social (razon_social) {this._razon_social = razon_social}
    set dni (dni) {this._dni = dni}
    set domicilio (domicilio) {this._domicilio = domicilio}
    set cp (cp) {this._cp = cp}
    set logo (logo) {this._logo = logo}
    set uid (uid) {this._uid = uid}

    /// muestra el DISPLAY NAME del EMISOR en Modal Left
    nombre_usuario(displayName) {
        const container = document.getElementById('idDisplayName')
        return container.innerHTML = displayName;
    }

    /// muestra el LOGO del EMISOR en Modal Left
    logo(photoURL) {
        const container = document.getElementById('idPhotoURL')
        return container.src = "./assets/img/logo/" + photoURL;
    }

    /// muestra DATOS del EMISOR en Modal Left
    read__emisor(emisor) {
        const array_EMISOR = Object.entries(emisor[0]).map(([key, value]) => {
            if (key != 'uid' && key != 'alias' && key != 'logo' && key != 'razon_social' && key != 'email' && key != 'telefono') {
                return `<li><strong>${key}</strong>: ${DECODING(value)}</li>`
            }
        })

        //const LOGO = `<ul class="container__avatar_modal_left"><li><img src="./assets/img/logo/logo.png" alt=""><h2></h2></li></ul>`
        const ACORDEON = `<details name="acordeon"><summary class='card__modal_left'><ul class="oculto"><li>${DECODING(emisor[0].alias)}</li><li><span class="material-symbols-outlined">edit</span></li></summary><ul>${array_EMISOR.join('')}</ul></details>`;
        
        const container_emisor = document.getElementById('idContainerModalLeft');
        return container_emisor.innerHTML = ACORDEON;
    }
}


let array_filtro_emisor = ''
const querySnapshot_emisor = await getDocs(collection(db, 'venort__emisor_facturas'))
const data_emisor = querySnapshot_emisor.docs;

if (data_emisor.length) {
    
    try {
        const documentos_emisor = data_emisor.map(element => element.data());
        array_filtro_emisor = documentos_emisor.filter(docu => docu.uid === auth.currentUser.uid);
    } catch (error) {
        console.log('Error', error);
    }
}


export const EMISOR = array_filtro_emisor.map((element, i) => {
    return new Emisores(element.alias, element.email, element.telefono, element.razon_social, element.dni, element.domicilio, element.cp, element.logo, element.uid);
});
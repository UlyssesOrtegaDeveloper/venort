import '../../controlador/evento_LOAD.js'
import '../../controlador/evento_CLICK.js'
import '../../controlador/evento_CHANGE.js'
import '../../controlador/evento_SUBMIT.js'

import '../database/remote/firebase.js'
import '../database/remote/app__form_logout.js'
import '../database/remote/loginCheck.js'


import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js"
import { auth, db } from '../database/remote/firebase.js'
import { getDocs, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js"

import { loginCheck } from '../database/remote/loginCheck.js'
import { Emisores } from '../contenido/Emisores.js'
import { Receptores } from '../contenido/Receptores.js'


import { MenuCircular } from "../html/MenuCircular.js";
import { NavBars } from "../html/NavBars.js";
import { Select } from "../html/Select.js";
import { TemplateMain } from "../main/TemplateMain.js";
import { Facturas } from '../contenido/Facturas.js'



onAuthStateChanged(auth, async (user) => {

    loginCheck(user)

    if (user) {

        NavBars.prototype.cargar_barras()
        //! ¿ATENCION? -> oculte template 0, porque desde Factura real time lo inicia ¿lo borro?
        //TemplateMain.prototype.mostrar('template_0', 0)
        //! NUEVO - sustitullo template 0, por facturas
        Facturas.prototype.realTime()
        MenuCircular.prototype.cargar_menu_circular('template_0')
        Select.prototype.cargar_filtros('template_0')

        /* updateProfile(auth.currentUser, {
        
            displayName: "Ulysses Ortega",
            photoURL: "logo.png"
        
        }).then(() => {console.log('actualizado correctamente');
        }).catch((error) => {console.log('Error', error);}); */

        
        Emisores.prototype.nombre_usuario(user.displayName)
        Emisores.prototype.logo(user.photoURL)

        const querySnapshot_emisor = await getDocs(collection(db, 'venort__emisor_facturas'))
        const data_emisor = querySnapshot_emisor.docs;
        //const querySnapshot_emisor_realTime = await onSnapshot(collection(db, 'venort__emisor_facturas'))
        //const data_emisor = querySnapshot_emisor_realTime.docs;

        if (data_emisor.length) {
            
            const documentos_emisor = data_emisor.map(element => element.data());
            const filtro_emisor = documentos_emisor.filter(docu => docu.uid === user.uid);
            Emisores.prototype.read__emisor(filtro_emisor)
        }


        const querySnapshot_receptores = await getDocs(collection(db, 'venort__receptor_facturas'))
        const data_receptores = querySnapshot_receptores.docs;

        if (data_receptores.length) {

            const documentos_receptores = data_receptores.map(element => element.data());
            const filtro_receptores = documentos_receptores.filter(docu => docu.uid === user.uid);

            Receptores.prototype.read__receptores(filtro_receptores)
        }

    } else {
        window.location.href ='index.html';
    }
})
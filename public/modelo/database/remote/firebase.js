/* import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js"; */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
    
/// Auth -> index_form_auth.js
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js"
/// Database Firestore
import { getFirestore, onSnapshot, collection, updateDoc, deleteField, deleteDoc, doc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js"

const firebaseConfig = {
    apiKey: "AIzaSyAB56chTbRKjsMTXDpJiaf-Yt4WQHOoQ7w",
    authDomain: "app-delivery-cd004.firebaseapp.com",
    databaseURL: "https://app-delivery-cd004-default-rtdb.firebaseio.com",
    projectId: "app-delivery-cd004",
    storageBucket: "app-delivery-cd004.appspot.com",
    messagingSenderId: "1020289626419",
    appId: "1:1020289626419:web:fa3fa60fc6c911d314ce46",
    //measurementId: "G-E2E87NBBFG"
}; 
    
// Initialize Firebase
export const app = initializeApp(firebaseConfig);

/// Auth -> index_form_auth.js
export const auth = getAuth(app);
/// Database Firestore
export const db = getFirestore(app);
//console.log('db', db);


export const facturas_realTime = (callback) => onSnapshot(collection(db, 'venort__facturas'), callback)

export const borrar_documento = (id) => deleteDoc(doc(db, 'venort__facturas', id))





export const borrar_un_servicio = (id, objeto_servicio) => updateDoc(doc(db, 'venort__facturas', id), 
    {
        servicios: arrayRemove(objeto_servicio),
    }
    //! para que funciones hay que poner todos los datos del array
);


export const actualizar_factura = (id, concepto, datos) => updateDoc(doc(db, 'venort__facturas', id),
    {
        concepto,
        datos
    }, {merge:true}
);




export const actualizar_servicio = (id, datos_actualizados) => updateDoc(doc(db, 'venort__facturas', id),
    {
        servicios: datos_actualizados 
    }, {merge:true}
);


/// actualizamos 'factura bloqueada: true / false' en Facturas
export const actualizar_estado_factura = (id, datos_actualizados) => updateDoc(doc(db, 'venort__facturas', id),
    {
        factura: datos_actualizados
    }, {merge:true}
);

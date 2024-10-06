import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js"
import { auth } from "./firebase.js"
import { mensaje_toastify } from "./toastify.js"


const formulario_registro = document.getElementById('idFormAuthRegistro')

formulario_registro.addEventListener('submit', async e => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.target));
    
    try {
        const userCredentials = await createUserWithEmailAndPassword(auth, data.email, data.password)
        //console.log('user', userCredentials);

        mensaje_toastify('Estas registrado ' + userCredentials.user.email, 'green')

        window.location.href = "app.html";

    } catch (error) {

        if (error.code === 'auth/network-request-failed') {
            //console.log('Error, email mal escrito');
            mensaje_toastify('Error, en el registro', 'red')

        }
        else if (error.code === 'auth/weak-password') {
            //console.log('Error, password mal escrito');
            mensaje_toastify('Error, password mal escrito', 'red')

        }
        else if (error.code) {
            //console.log('Error en el registro');
            mensaje_toastify('Error en el registro', 'red')

        }
    }
})

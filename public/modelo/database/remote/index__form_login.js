import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js"
import { auth } from "./firebase.js";
import { mensaje_toastify } from "./toastify.js";

//! ESCUCHADOR
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js"
import { loginCheck } from './loginCheck.js'


onAuthStateChanged(auth, async (user) => {
    //console.log(user);

    loginCheck(user)

    if (user) {
        window.location.href = "app.html";
    }
})
//! FIN ESCUCHADOR

const formulario_login = document.getElementById('idFormAuthLogin')

formulario_login.addEventListener('submit', async e => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.target));

    try {
        const credentials = await signInWithEmailAndPassword(auth, data.email, data.password)
        //console.log(credentials);

        window.location.href = "app.html";
        location.hash = target;
    } catch (error) {
        mensaje_toastify('Email o Password erroneos', 'red')
    }
})
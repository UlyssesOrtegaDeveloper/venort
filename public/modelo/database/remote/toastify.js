export const mensaje_toastify = (mensaje, color) => {

    Toastify({
        text: mensaje,
        duration: 4000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: color,
        },
        onClick: function(){} // Callback after click
      }).showToast();
}

// https://www.youtube.com/watch?v=Djh_eVj0D2w
// 1h 03min
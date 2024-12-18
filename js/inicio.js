'use strict'

// Seleccionar todos los botones
const botonesNivel = document.querySelectorAll('button');

// Cargar el header
function cargarHeader() {
    return fetch("../components/header.html")
        .then(response => {
            if (!response.ok) throw new Error("No se pudo cargar el header");
            return response.text();
        })
        .then(html => {
            document.body.insertAdjacentHTML("afterbegin", html);
        })
        .catch(error => console.error("Error al cargar el header:", error));
}

cargarHeader();

// Añadir un EventListener a cada botón
botonesNivel.forEach((boton) => {
    boton.addEventListener('click', (event) => {
        // Obtener el nivel desde el atributo data-nivel
        const nivelSeleccionado = event.target.id;

        // Guardar el nivel seleccionado en LocalStorage
        localStorage.setItem('nivelSeleccionado', nivelSeleccionado);

        // Redirigir al archivo de juego
        window.location.href = 'juego.html';
    });
});

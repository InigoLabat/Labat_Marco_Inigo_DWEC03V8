'use strict';
// DEFINIMOS VARIABLES GLOBALES
let usuariosJSONPath = 'json/usuarios.json';

// ANIADIMOS LAS FUNCIONES
async function cargarJsonUsuarios(path) {

    // Guardar datos en LocalStorage
    fetch(path)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error al cargar el archivo JSON: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // Guardar los usuarios en el LocalStorage
            localStorage.setItem("usuarios", JSON.stringify(data));
        })
        .catch((error) => console.error("Error al cargar el archivo JSON:", error));
}

// Cargar el header
function cargarHeader() {
    return fetch("components/header.html")
        .then(response => {
            if (!response.ok) throw new Error("No se pudo cargar el header");
            return response.text();
        })
        .then(html => {
            document.body.insertAdjacentHTML("afterbegin", html);
        })
        .catch(error => console.error("Error al cargar el header:", error));
}


//EMPEZAMOS CON EL CODIGO
// Cargar datos de usuario desde un archivo JSON al LocalStorage
window.addEventListener("DOMContentLoaded", async () => {
    await cargarJsonUsuarios(usuariosJSONPath); 
    await cargarHeader();
});


// index
// Validar el formulario al enviar
document.getElementById("login-form").addEventListener("submit", (event) => {
    event.preventDefault();

    // Obtener valores del formulario
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const mensajeError = document.getElementById("errorLogin");

    // Validar formato de la contraseña (alfanumérica)
    const passwordRegex = /^[a-zA-Z0-9]+$/;
    if (!passwordRegex.test(password)) {
        alert("La contraseña solo debe contener letras y números.");
        return;
    }

    // Recuperar datos del LocalStorage
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Validar si coinciden usuario y contraseña
    const usuarioValido = usuarios.find(
        (user) => user.usuario === username && user.contraseña === password
    );

    if (usuarioValido) {
        // Redirigir a la interfaz de juego (simulando redirección)
        window.location.href = "src/inicio.html";
    } else {
        mensajeError.textContent = "Contraseña no válida para el usuario.";
        mensajeError.className = "errorLogin";
    }
});



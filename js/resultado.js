'use strict'

// Obtener tiempo y resultado del localStorage
const tiempoEmpleado = localStorage.getItem("tiempo");
const resultado = localStorage.getItem("resultado");

// Elementos contenedores
const textoResult = document.getElementById("texto-result");
const result = document.getElementById("result");
const reiniciarBtn = document.getElementById("reiniciar-btn");
const salirBtn = document.getElementById("salir-btn");

// Funciones
function cargarHeader() {
    return fetch("../components/header.html") // Ruta al archivo header
        .then(response => {
            if (!response.ok) throw new Error("No se pudo cargar el header");
            return response.text();
        })
        .then(html => {
            document.body.insertAdjacentHTML("afterbegin", html);
        })
        .catch(error => console.error("Error al cargar el header:", error));
}

function crearMensaje() {
    const titulo = document.createElement("h2");
    titulo.classList.add("titulo-resultado");
    
    const descripcion = document.createElement("p");
    descripcion.classList.add("descripcion-resultado");

    switch (resultado) {
        case 'victoria':
            titulo.textContent = "¡VICTORIA!";
            descripcion.textContent = "Has encontrado todas las parejas de cartas";
            break;
        case 'derrota':
            titulo.textContent = "Derrota...";
            descripcion.textContent = "Alguna de las parejas formadas no era correcta";
            break;
    }

    textoResult.appendChild(titulo);
    textoResult.appendChild(descripcion);
}

function mostrarResult() {
    const tiempoContainer = document.createElement("div");
    tiempoContainer.classList.add("tiempo-container");

    const tiempoTexto = document.createElement("p");
    tiempoTexto.textContent = "Tiempo empleado:";

    const tiempoValor = document.createElement("span");
    tiempoValor.textContent = `${tiempoEmpleado} s`;

    tiempoContainer.appendChild(tiempoTexto);
    tiempoContainer.appendChild(tiempoValor);

    result.appendChild(tiempoContainer);

}

document.addEventListener("DOMContentLoaded", async () => {

    // Cargamos en header
    await cargarHeader();

    // Mostramos victoria o derrota
    crearMensaje();
    // Crear contenido con la informacion sobre la partida
    mostrarResult();

    // Botón "Volver a seleccionar nivel"
    reiniciarBtn.addEventListener("click", () => {
        window.location.href = "inicio.html"; // Redirige a la página de selección de nivel
    });

    // Botón "Salir de la sesión"
    salirBtn.addEventListener("click", () => {
        window.location.href = "../index.html"; // Redirige a la página de login
    });
});
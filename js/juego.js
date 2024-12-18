'use strict'

// Obtener referencias a los elementos clave
const timerElement = document.getElementById("timer");
const tablero = document.getElementById("tablero-cont");
const mazoPila = document.getElementById("mazo-pila");
const mazoSeleccionada = document.getElementById("mazo-seleccionada");
const startButton = document.getElementById("start-game");
const solveButton = document.getElementById("solve-game");

// Leer el nivel del juego desde localStorage
const nivel = localStorage.getItem("nivelSeleccionado");
let cartasMazo = []; // Cartas en el mazo
let cartasTablero = []; // Cartas en el tablero
let cartaSeleccionada = null; // Carta actualmente seleccionada del mazo
let tiempoRestante = 100; // Temporizador de sesion en segundos
const tiempoMostrarCartas = {
    facil: 3000,
    intermedio: 5000,
    avanzado: 10000
};;

const parejasFormadas = []; // Almacena las parejas formadas

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

//Inicializar el juego.
function inicializarJuego() {

    bloquearInteraccion(); // Bloquear interacción inicial

    const configuracion = obtenerConfiguracionNivel(nivel);
    generarCartas(configuracion.parejas, configuracion.iconos);

    mezclarCartas(cartasMazo);
    mezclarCartas(cartasTablero);

    renderizarTablero(cartasTablero);
    renderizarMazo(cartasMazo);

    startButton.disabled = false;
}

// Bloquear la interacción inicial
function bloquearInteraccion() {
    tablero.style.pointerEvents = "none";
    mazoPila.style.pointerEvents = "none";
    solveButton.disabled = true;
}

// Habilitar la interacción
function habilitarInteraccion() {
    tablero.style.pointerEvents = "auto";
    mazoPila.style.pointerEvents = "auto";
    solveButton.disabled = false;

    // Y mostramos texto orientativo del mazo
    document.getElementById("texto-mazo").style.opacity = 1;
}


// Mostrar las cartas del tablero temporalmente.

function mostrarCartasTemporales() {
    // Seleccionar todas las cartas del tablero y mostrar su contenido
    const cartas = tablero.querySelectorAll(".carta");
    cartas.forEach((carta) => {
        voltearCarta(carta);
    });

    // Muestra texto orientativo
    let parrafo = document.createElement("p");
    let texto = document.createTextNode("¡Memoriza las cartas del tablero!");
    parrafo.append(texto);
    mazoSeleccionada.appendChild(parrafo);

    // Ocultar las cartas después de 3 segundos
    setTimeout(() => {
        cartas.forEach((carta) => {
            voltearCarta(carta);
        });

        // Elimino el texto explicativo inicial
        parrafo.remove();

        // Habilitar la interacción después de mostrar las cartas
        habilitarInteraccion();

    }, tiempoMostrarCartas[nivel]);
}




// Obtener la configuración según el nivel.

function obtenerConfiguracionNivel(nivel) {
    const configuraciones = {
        facil: { 
            parejas: 4, 
            iconos: ["estrella", "cuadrado", "triangulo", "circulo"], 
            carpeta: "facil" 
        },
        intermedio: { 
            parejas: 6, 
            iconos: ["estrella", "cuadrado", "triangulo", "circulo", "rectangulo", "rombo"], 
            carpeta: "intermedio" 
        },
        avanzado: { 
            parejas: 9, 
            iconos: [
                "cuadrado-azul", "cuadrado-amarillo", "cuadrado-verde",
                "circulo-azul", "circulo-amarillo", "circulo-verde",
                "triangulo-azul", "triangulo-amarillo", "triangulo-verde"
            ],
            carpeta: "avanzado"
        },
    };
    return configuraciones[nivel];
}

// Generar las cartas para el juego

function generarCartas(numParejas, iconos) {
    const carpeta = obtenerConfiguracionNivel(nivel).carpeta;

    for (let i = 0; i < numParejas; i++) {
        const icono = iconos[i];
        const parejaId = `pareja-${i}`;

        // Carta para el mazo
        cartasMazo.push({
            id: `${parejaId}`,
            icono,
            carpeta,
            emparejada: false,
        });

        // Carta para el tablero
        cartasTablero.push({
            id: `${parejaId}`,
            icono,
            carpeta,
            emparejada: false,
        });
    }
}


//Mezclar un array de cartas.
function mezclarCartas(cartas) {
    cartas.sort(() => Math.random() - 0.5);
}

// Renderizar las cartas en el tablero.
function renderizarTablero(cartas) {
    // Priemro limpiar el tablero y elimina la clase si la tuviera
    tablero.innerHTML = "";
    tablero.classList.remove('nivel-facil', 'nivel-intermedio', 'nivel-avanzado');

    // Añadir la clase correspondiente según el nivel seleccionado
    switch (nivel) {
    case 'facil':
        tablero.classList.add('nivel-facil');
        break;
    case 'intermedio':
        tablero.classList.add('nivel-intermedio');
        break;
    case 'avanzado':
        tablero.classList.add('nivel-avanzado');
        break;
    }

    cartas.forEach((carta) => {
        const cartaElement = document.createElement("div");
        cartaElement.classList.add("carta", "reverso");
        cartaElement.dataset.parejaId = carta.id;
        cartaElement.dataset.icono = carta.icono;

        cartaElement.addEventListener("dragover", manejarDragOver);
        cartaElement.addEventListener("drop", manejarDrop);

        tablero.appendChild(cartaElement);
    });
}


//Renderizar las cartas en el mazo
function renderizarMazo(cartas) {
    mazoPila.innerHTML = ""; // Limpiar el mazo

    cartas.forEach((carta, index) => {
        const cartaElement = document.createElement("div");
        cartaElement.classList.add("carta-mazo", "reverso");
        cartaElement.dataset.parejaId = carta.id;
        cartaElement.dataset.icono = carta.icono;

        if (index === cartas.length - 1) {
            cartaElement.classList.add("carta-superior");
            cartaElement.addEventListener("click", manejarClickMazo);
        }

        mazoPila.append(cartaElement);
    });
}

// Manejar el clic en una carta del mazo
function manejarClickMazo(event) {
    const cartaElement = event.currentTarget;

    // Voltear la carta
    const icono = cartaElement.dataset.icono;
    const carpeta = obtenerConfiguracionNivel(nivel).carpeta;

    cartaElement.innerHTML = `<img src="../img/${carpeta}/${icono}.svg" alt="${icono}">`;
    cartaElement.classList.remove("reverso");

    // Mover la carta al contenedor de mazo-seleccionada
    mazoSeleccionada.innerHTML = ""; // Limpiar la carta seleccionada anterior
    cartaSeleccionada = cartaElement.cloneNode(true);
    cartaSeleccionada.classList.add("carta-seleccionada");
    cartaSeleccionada.dataset.parejaId = cartaElement.dataset.parejaId;
    cartaSeleccionada.draggable = true;

    // Aparece el texto explicativo
    document.getElementById('texto-selec').style.display = 'block';

    // Añadir eventos de drag & drop a la carta seleccionada
    cartaSeleccionada.addEventListener("dragstart", manejarDragStart);
    cartaSeleccionada.addEventListener("dragend", manejarDragEnd);

    mazoSeleccionada.appendChild(cartaSeleccionada);

    // Eliminar la carta del mazo-pila y actualizar
    cartaElement.remove();
    actualizarMazo();
}

// Actualizar las cartas del mazo después de una selección.
function actualizarMazo() {
    const cartas = mazoPila.querySelectorAll(".carta-mazo");
    cartas.forEach((carta, index) => {
        carta.classList.remove("carta-superior");
        if (index === cartas.length - 1) {
            carta.classList.add("carta-superior");
            carta.addEventListener("click", manejarClickMazo);
        }
    });
}

// Manejar el evento dragstart
function manejarDragStart(event) {
    const idMazo = event.target.dataset.parejaId; // Extraer el ID de la carta seleccionada
    event.dataTransfer.setData("text/plain", idMazo);
}

// Manejar el evento dragend
function manejarDragEnd(event) {
    cartaSeleccionada = null; // Limpiar la carta seleccionada
}

// Manejar el evento dragover en el tablero
function manejarDragOver(event) {
    event.preventDefault(); // Permitir soltar la carta
}

// Manejar el evento drop en el tablero.
function manejarDrop(event) {
    event.preventDefault();
    const idMazo = event.dataTransfer.getData("text/plain");
    const cartaTablero = event.currentTarget;

    const idTablero = cartaTablero.dataset.parejaId; // ID de la carta del tablero

    // Añadir la pareja al array de parejas formadas
    parejasFormadas.push({
        idTablero: idTablero,
        idMazo: idMazo
    });

    // Crear una copia visual de la carta seleccionada
    const cartaSuperpuesta = cartaSeleccionada.cloneNode(true);
    cartaSuperpuesta.classList.add("superpuesta"); // Añadimos una clase para aplicar estilos
    
    // Añadir la carta superpuesta al contenedor del tablero
    cartaTablero.appendChild(cartaSuperpuesta);

    // Limpiar la carta seleccionada
    cartaSeleccionada.remove();
    cartaSeleccionada = null;

}

// Eventos
startButton.addEventListener("click", () => {
    startButton.disabled = true;
    mostrarCartasTemporales(); // Mostrar cartas temporalmente
});

// Voltear una carta
function voltearCarta(cartaElement) {
    if (cartaElement.classList.contains("reverso")) {
        const icono = cartaElement.dataset.icono;
        const carpeta = obtenerConfiguracionNivel(nivel).carpeta;

        cartaElement.innerHTML = `<img src="../img/${carpeta}/${icono}.svg" alt="${icono}">`;
        cartaElement.classList.remove("reverso");
    } else {
        cartaElement.innerHTML = "";
        cartaElement.classList.add("reverso");
    }
}

// Iniciar el temporizador
function iniciarTemporizador() {
    const interval = setInterval(() => {
        tiempoRestante--;
        actualizarTemporizador();

        if (tiempoRestante <= 0) {
            clearInterval(interval);
            
            window.location.href = "../index.html";
        }
    }, 1000);
}

// Actualizar el temporizador en la interfaz.
function actualizarTemporizador() {
    const minutos = Math.floor(tiempoRestante / 60);
    const segundos = tiempoRestante % 60;
    timerElement.textContent = `${minutos.toString().padStart(2, "0")}:${segundos.toString().padStart(2, "0")}`;
}

solveButton.addEventListener("click", () => {
    let todasCorrectas = true;
    localStorage.setItem('tiempo', 100 - tiempoRestante);

    // Verificar cada pareja
    parejasFormadas.forEach(({ idTablero, idMazo }) => {
        if (idTablero !== idMazo) {
            todasCorrectas = false;
        }
    });

    if (todasCorrectas) {
        localStorage.setItem('resultado', 'victoria');
        window.location.href = "resultado.html";
    } else {
        localStorage.setItem('resultado', 'derrota');
        window.location.href = "resultado.html";
    }
});

// Iniciar la configuración
document.addEventListener("DOMContentLoaded", async () => {

    //cargar el header
    await cargarHeader();

    // Iniciar el juego
    inicializarJuego();

    // Inicio el temporizador de sesion
    iniciarTemporizador();
});


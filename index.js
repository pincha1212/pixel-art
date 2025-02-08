let container = document.querySelector(".container"); // Selecciona el contenedor principal donde se dibujará la cuadrícula
let gridButton = document.getElementById("submit-grid"); // Botón para crear la cuadrícula
let clearGridButton = document.getElementById("clear-grid"); // Botón para limpiar la cuadrícula
let gridWidth = document.getElementById("width-range"); // Selector para el ancho de la cuadrícula
let gridHeight = document.getElementById("height-range"); // Selector para la altura de la cuadrícula
let colorButton = document.getElementById("color-input"); // Selector de color para pintar
let eraseBtn = document.getElementById("erase-btn"); // Botón para activar el modo de borrado
let paintBtn = document.getElementById("paint-btn"); // Botón para activar el modo de pintura
let widthValue = document.getElementById("width-value"); // Muestra el valor del ancho seleccionado
let heightValue = document.getElementById("height-value"); // Muestra el valor de la altura seleccionada

let events = {
    mouse: {
        down: "mousedown", // Evento para el inicio del dibujo con el mouse
        move: "mousemove", // Evento para el movimiento del mouse
        up: "mouseup" // Evento para el final del dibujo con el mouse
    },
    touch: {
        down: "touchstart", // Evento para el inicio del dibujo en dispositivos táctiles
        move: "touchmove", // Evento para el movimiento en dispositivos táctiles
        up: "touchend", // Evento para el final del dibujo en dispositivos táctiles
    },
};

let deviceType = ""; // Variable para almacenar el tipo de dispositivo

let draw = false; // Estado para saber si se está dibujando
let erase = false; // Estado para saber si se está borrando

const isTouchDevice = () => {
    try {
        document.createEvent("TouchEvent"); // Intenta crear un evento táctil
        deviceType = "touch"; // Si tiene éxito, es un dispositivo táctil
        return true;
    } catch (e) {
        deviceType = "mouse"; // Si falla, es un dispositivo de mouse
        return false;
    }
};

isTouchDevice(); // Llama a la función para determinar el tipo de dispositivo

gridButton.addEventListener("click", () => { // Listener para el botón de crear cuadrícula
    container.innerHTML = ""; // Limpia el contenedor
    let count = 0; // Contador para los IDs de las columnas
    for (let i = 0; i < gridHeight.value; i++) { // Crea filas según la altura seleccionada
        count += 2;
        let div = document.createElement("div"); // Crea un nuevo div para la fila
        div.classList.add("gridRow"); // Añade la clase para el estilo

        for (let j = 0; j < gridWidth.value; j++) { // Crea columnas según el ancho seleccionado
            count += 2;
            let col = document.createElement("div"); // Crea un nuevo div para la columna
            col.classList.add("gridCol"); // Añade la clase para el estilo
            col.setAttribute("id", `gridCol${count}`); // Asigna un ID único a la columna
            col.addEventListener(events[deviceType].down, () => { // Listener para iniciar el dibujo
                draw = true; // Cambia el estado a dibujar
                if (erase) {
                    col.style.backgroundColor = "transparent"; // Si está en modo borrado, hace la columna transparente
                } else {
                    col.style.backgroundColor = colorButton.value; // Si no, pinta con el color seleccionado
                }
            });

            col.addEventListener(events[deviceType].move, (e) => { // Listener para el movimiento del mouse/touch
                let elementId = document.elementFromPoint(
                    !isTouchDevice() ? e.clientX : e.touches[0].clientX,
                    !isTouchDevice() ? e.clientY : e.touches[0].clientY,
                ).id; // Obtiene el ID del elemento en el que se está moviendo
                checker(elementId); // Llama a la función checker para cambiar el color
            });

            col.addEventListener(events[deviceType].up, () => { // Listener para finalizar el dibujo
                draw = false; // Cambia el estado a no dibujar
            });

            div.appendChild(col); // Añade la columna a la fila

        }

        container.appendChild(div); // Añade la fila al contenedor

    }
});

function checker(elementId) { // Función para verificar el ID del elemento
    let gridColumns = document.querySelectorAll(".gridCol"); // Selecciona todas las columnas
    gridColumns.forEach((element) => { // Itera sobre cada columna
        if (elementId == element.id) { // Si el ID coincide
            if (draw && !erase) {
                element.style.backgroundColor = colorButton.value; // Pinta la columna si está en modo dibujar
            } else if (draw && erase) {
                element.style.backgroundColor = "transparent"; // Hace la columna transparente si está en modo borrado
            }
        }
    });
}

clearGridButton.addEventListener("click", () => { // Listener para el botón de limpiar cuadrícula
    container.innerHTML = ""; // Limpia el contenedor
});

eraseBtn.addEventListener("click", () => { // Listener para el botón de borrar
    erase = true; // Cambia el estado a borrado
});

paintBtn.addEventListener("click", () => { // Listener para el botón de pintar
    erase = false; // Cambia el estado a dibujar
});

gridWidth.addEventListener("input", () => { // Listener para el cambio de ancho
    widthValue.innerHTML = gridWidth.value < 9 ? `0${gridWidth.value}` : gridWidth.value; // Muestra el valor del ancho
});

gridHeight.addEventListener("input", () => { // Listener para el cambio de altura
    heightValue.innerHTML = gridHeight.value < 9 ? `0${gridHeight.value}` : gridHeight.value; // Muestra el valor de la altura
});

window.onload = () => { // Al cargar la ventana
    gridHeight.value = 0; // Inicializa el valor de altura
    gridWidth.value = 0; // Inicializa el valor de ancho
};

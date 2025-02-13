import { ELEMENTS } from "./entities/Board.js";
import { UI_BUILDER } from "./Ui.js";

export const UIv1 = UI_BUILDER.init();

UIv1.initUI = () => {
    const base = document.getElementById(UIv1.uiElements.board);
    base.classList.add("board");
}

UIv1.drawBoard = (board, players) => {

    console.log(board);
    console.log(players);


    if (board !== undefined) { // Si el tablero no está vacío
        const base = document.getElementById(UIv1.uiElements.board); // Obtenemos el tablero
        base.innerHTML = ''; // Limpiamos el tablero
        base.style.gridTemplateColumns = `repeat(${board.length}, 50px)`; // Establecemos el número de columnas
        base.style.gridTemplateRows = `repeat(${board.length}, 50px)`; // Establecemos el número de filas


        board.forEach((row, rowIndex) => { // Recorremos el tablero
            row.forEach((element, colIndex) => { // Recorremos las columnas 
                const tile = document.createElement("div"); // Creamos un div

                const encontrar = players.find((p) => p.x === rowIndex && p.y === colIndex); // Estamos accediendo a la propiedad de un objeto dentro de un array
                tile.classList.add("tile"); // Añadimos la clase tile al div
                if (encontrar) { // Si hay un jugador en la posición actual
                    tile.style.backgroundColor = 'red'; // Establecemos el color del jugador
                    board[rowIndex][colIndex] = ELEMENTS.player; // Establecemos la posición del jugador en el tablero
                    
                }

                if (element === ELEMENTS.bush) { // Si el elemento es un arbusto
                    tile.style.backgroundColor = 'green'; // Establecemos el color del arbusto
                }

                base.appendChild(tile); // Añadimos el div al tablero

                anime({
                    targets: tile,
                    opacity: [0, 1],
                    duration: (Math.random() * 8000) + 1000,
                    easing: 'easeInOutQuad'
                });
            });
        });
    }

    // Suponiendo que los botones de movimiento y rotación tienen los siguientes IDs
    const moveButton = document.getElementById("mover");
    const rotateButton = document.getElementById("rotar");

    // Evento de movimiento
    moveButton.addEventListener("click", () => {
        // Enviar el evento al servidor con el movimiento deseado
        socket.emit("movePlayer", { direction: 'up' }); // Aquí 'up' es un ejemplo, puede ser 'down', 'left', 'right'
    });

    // Evento de rotación
    rotateButton.addEventListener("click", () => {
        // Enviar el evento de rotación al servidor
        socket.emit("rotatePlayer");
    });

}



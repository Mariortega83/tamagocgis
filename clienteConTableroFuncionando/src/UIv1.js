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
                    if (encontrar.direction === "down") {
                    tile.style.backgroundImage = "url('assets/photos/imagesup.png')"; // Establecemos el color del jugador
                    tile.style.transform = "rotate(180deg)";
                    } else {
                        tile.style.backgroundImage = "url('assets/photos/imagesup.png')"
                    }

                    tile.id = `player-${encontrar.id}`; // Añadimos el id player al div
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
}

UIv1.rotatePlayer = (playerId, direction) => {
    const playerElement = document.getElementById(`player-${playerId}`);
    console.log(playerId);
    console.log(playerElement);
    if (!playerElement) return;

    const rotationAngles = {
        "up": "0deg",
        "right": "90deg",
        "down": "180deg",
        "left": "270deg"
    };
    playerElement.style.transform = `rotate(${rotationAngles[direction]})`;

}

UIv1.movePlayer = (playerId, x, y) => {
    const playerElement = document.getElementById(`player-${playerId}`);
    if (!playerElement) return;

    console.log("Jugador movido",playerId, x, y);
}












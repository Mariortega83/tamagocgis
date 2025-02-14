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
                    const i = players.indexOf(encontrar); // Obtenemos el índice del jugador
                    console.log(i);
                    tile.style.backgroundImage = "url('assets/photos/images.png')"; // Establecemos el color del jugador
                    tile.id = `player-${encontrar.id}`; // Añadimos el id player al div
                    board[rowIndex][colIndex] = ELEMENTS.player; // Establecemos la posición del jugador en el tablero

                    if (i === 0) { // Si el jugador es el primero
                        encontrar.state = 'down'; // Establecemos el estado del jugador
                        tile.style.rotate = `${(i + 3) * 90}deg`; // Establecemos la rotación del jugador

                    } else if (i === 1) {
                        encontrar.state = 'up'; // Establecemos el estado del jugador
                        tile.style.rotate = `${(i) * 90}deg`; // Establecemos la rotación del jugador

                    } else if (i === 2) {
                        encontrar.state = 'up'; // Establecemos el estado del jugador
                        tile.style.rotate = `${(i + 1) * 90}deg`; // Establecemos la rotación del jugador

                    } else if (i === 3) {
                        encontrar.state = 'down'; // Establecemos el estado del jugador
                        tile.style.rotate = `${(i - 2) * 90}deg`; // Establecemos la rotación del jugador

                    }
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

    console.log(rotationAngles[playerId, direction]);
    playerElement.style.rotate = rotationAngles[direction];
}












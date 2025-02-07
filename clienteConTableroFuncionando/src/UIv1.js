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
    if (board !== undefined) {
        const base = document.getElementById(UIv1.uiElements.board);
        base.innerHTML = '';
        base.style.gridTemplateColumns = `repeat(${board.length}, 50px)`;
        base.style.gridTemplateRows = `repeat(${board.length}, 50px)`;

        
        board.forEach((row, rowIndex) => {
            row.forEach((element, colIndex) => {
                const tile = document.createElement("div");

            const encontrar = players.find((p) => p.x === rowIndex && p.y === colIndex); // Estamos accediendo a la propiedad de un objeto dentro de un array
                tile.classList.add("tile");
                if (encontrar) {
                    tile.style.backgroundColor = 'red';
                    board[rowIndex][colIndex] = ELEMENTS.player;
                    console.log(board);
                }


                if (element === ELEMENTS.bush) {
                    tile.style.backgroundColor = 'green';
                }

                base.appendChild(tile);
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

UIv1.drawBoard();


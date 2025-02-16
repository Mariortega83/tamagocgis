import { Board } from "../entities/Board.js";
import { Queue } from "../Queue.js";
export class GameService {
    #states = {
        WAITING: 0,
        PLAYING: 1,
        ENDED: 2
    };
    #ui = null;
    #players = [];
    #board = null;
    #queue = null;
    #state = null;
    #parallel = null;

    #actionsList = {
        "NEW_PLAYER": this.do_newPlayer.bind(this),
        "BOARD": this.do_newBoard.bind(this),
        "ROTATE_PLAYER": this.do_rotatePlayer.bind(this),
        "MOVE_PLAYER": this.do_movePlayer.bind(this),
    };

    constructor(ui) {
        this.#state = this.#states.WAITING;
        this.#board = new Board();
        this.#queue = new Queue();
        this.#parallel = null;
        this.checkScheduler();
        this.#ui = ui;
    }

    checkScheduler() {
        if (!this.#queue.isEmpty()) {
            if (this.#parallel == null) {
                this.#parallel = setInterval(
                    async () => {
                        const action = this.#queue.getMessage();
                        if (action != undefined) {
                            await this.#actionsList[action.type](action.content);
                        } else {
                            this.stopScheduler();
                        }
                    }
                );
            }
        }
    }

    stopScheduler() {
        clearInterval(this.#parallel);
        this.#parallel = null;
    }

    do(data) {
        console.log("Mensaje recibido en do():", data);
        this.#queue.addMessage(data);
        this.checkScheduler();
    };

    async do_newPlayer(payload) {
        console.log("ha llegado un jugador nuevo");
        console.log("Jugadores", payload);
        this.#players = payload;


    };

    async do_newBoard(payload) {
        this.#board.build(payload);
        console.log('AQUI LLEGAN LOS JUGADORES')
        this.#ui.drawBoard(this.#board.map, this.#players);

    }
    async do_rotatePlayer(payload) {
        const { id, direction } = payload;
        console.log("MIRA LO QUE LLEGA AL PAYLOADDDDDDDDD",payload);
        this.#ui.rotatePlayer(id, direction);
        
    }

    async do_movePlayer(payload){
        console.log("El jugador se mueve");
        const { id, x, y } = payload;
        this.#ui.movePlayer(id, x, y);

    }



}
import { Room } from "../../room/entities/Room";
import { Board } from "./Board";

export enum GameStates {
    WAITING, PLAYING
}

export enum Messages {
    BOARD = "BOARD",
    NEW_PLAYER = "NEW_PLAYER",
    UPDATE_PLAYERS = "UPDATE_PLAYERS"
}

export interface Game {
    id : String,
    state: GameStates,
    room: Room,
    board: Board
}
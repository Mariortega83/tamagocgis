import { Socket } from "socket.io";
import { Directions, Player, PlayerStates } from "../player/entities/Player";
import { Room } from "../room/entities/Room";
import { RoomService } from "../room/RoomService";
import { Game, GameStates, Messages } from "./entities/Game";
import { BoardBuilder } from "./BoardBuilder";
import { ServerService } from "../server/ServerService"
export class GameService {
    private games: Game[];

    private static instance: GameService;
    private constructor() {
        this.games = [];
    };

    static getInstance(): GameService {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new GameService();
        return this.instance;
    }

    public buildPlayer(socket: Socket): Player {
        const startingPositions = [
            { x: 0, y: 0 },      // Esquina superior izquierda
            { x: 9, y: 0 },      // Esquina superior derecha
            { x: 0, y: 9 },      // Esquina inferior izquierda
            { x: 9, y: 9 }       // Esquina inferior derecha
        ];
        const occupiedPositions = this.games.flatMap(game => game.room.players.map(p => ({ x: p.x, y: p.y })));

        // Buscar la primera posición libre
        let position = startingPositions.find(pos =>
            !occupiedPositions.some(p => p.x === pos.x && p.y === pos.y)
        );
        if (!position) {
        position = { x: Math.floor(Math.random() * 10), y: Math.floor(Math.random() * 10) };
    }
        return {
            id: socket,
            x: position.x,
            y: position.y,
            state: PlayerStates.Idle,
            direction: Directions.Up,
            visibility: true
        }
    }

    public addPlayer(player: Player): boolean {
        const room: Room = RoomService.getInstance().addPlayer(player);
        ServerService.getInstance().sendMessage(room.name, ServerService.messages.out.new_player, "new player");
        console.log("Players", room.players,room.players.length);
        console.log("Room", room.name);

        if (room.players.length == 4) {
            console.log("sala llena");
            ServerService.getInstance().sendMessage(room.name, Messages.NEW_PLAYER, room.players.map(player => ({
            id: player.id.id,  // Solo el id del socket, no el objeto completo
            x: player.x,
            y: player.y,
            state: player.state,
            direction: player.direction,
            visibility: player.visibility
        })));
        }
        
        


        
        const genRanHex = (size: Number) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        if (room.players.length == 1) {
            const game: Game = {
                id: "game" + genRanHex(128),
                state: GameStates.WAITING,
                room: room,
                board: new BoardBuilder().getBoard()
            }
            room.game = game;
            this.games.push(game);
        }

        if (room.occupied) {
            if (room.game) {
                room.game.state = GameStates.PLAYING;
                if (ServerService.getInstance().isActive()) {
                    ServerService.getInstance().sendMessage(room.name, Messages.BOARD, room.game.board);
                }

                
            }
            return true;
        }

        return false;
    }

    

    

    
}

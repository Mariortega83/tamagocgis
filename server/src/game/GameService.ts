import { Socket } from "socket.io";
import { Directions, Player, PlayerStates } from "../player/entities/Player";
import { Room } from "../room/entities/Room";
import { RoomService } from "../room/RoomService";
import { Game, GameStates, Messages } from "./entities/Game";
import { BoardBuilder } from "./BoardBuilder";
import { ServerService } from "../server/ServerService"
import { Server } from "http";
export class GameService {
    public games: Game[];

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
        const board = new BoardBuilder().getBoard();

         

        const startingPositions = [
            { x: 0, y: 0 },
            { x: board.size - 1, y: 0 },
            { x: 0, y: board.size - 1 },
            { x: board.size - 1, y: board.size - 1 }
        ];

        const occupiedPositions = this.games.flatMap(game =>
            game.room.players.map(p => ({ x: p.x, y: p.y }))
        );

        // Verificar si todas las posiciones iniciales están ocupadas
        const allStartingPositionsOccupied = startingPositions.every(pos =>
            occupiedPositions.some(p => p.x === pos.x && p.y === pos.y)
        );

        if (allStartingPositionsOccupied) {
            // Reiniciar posiciones de todos los jugadores
            let players = this.games.flatMap(game => game.room.players);

            players.forEach((player, index) => {
                if (startingPositions[index]) {
                    player.x = startingPositions[index].x;
                    player.y = startingPositions[index].y;
                }
            });

            console.log("Todas las posiciones estaban ocupadas. Se han reasignado las posiciones iniciales.");
        }

        // Asignar la primera posición libre al nuevo jugador
        let position = startingPositions.find(pos =>
            !occupiedPositions.some(p => p.x === pos.x && p.y === pos.y)
        );

        const directions = [Directions.Down, Directions.Up, Directions.Down, Directions.Up];
        const direction = directions[this.games.flatMap(game => game.room.players).length];
        

        return {
            id: socket,
            x: position?.x ?? 0,
            y: position?.y ?? 0,
            state: PlayerStates.Idle,
            direction: direction,
            visibility: true
        };

    }

    public addPlayer(player: Player): boolean {
        const room: Room = RoomService.getInstance().addPlayer(player);

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
            console.log("Estado de games antes de añadir:", this.games);

            this.games.push(game);

            console.log("Estado de games después de añadir:", this.games);

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



    public rotatePlayer(playerId: string) {
        const game = this.games.find(g => g.room.players.some(p => p.id.id === playerId));
        
        if (!game) {
            console.log("No se encontró el juego del jugador", playerId);
            return;
        }
    
        const player = game.room.players.find(p => p.id.id === playerId);
        console.log("Player y su direccion antes de cambiar", player, player?.direction);
        if (!player) {
            console.log("Jugador no encontrado en la sala");
            return;
        }
    
        // Rotar dirección del jugador
        switch (player.direction) {
            case Directions.Up:
                player.direction = Directions.Right;
                break;
            case Directions.Right:
                player.direction = Directions.Down;
                break;
            case Directions.Down:
                player.direction = Directions.Left;
                break;
            case Directions.Left:
                player.direction = Directions.Up;
                break;
        }
        console.log("Player y su direccion despues de cambiar", player, player?.direction);
        // Enviar mensaje a la sala correcta
        ServerService.getInstance().sendMessage(
            game.room.name,
            Messages.ROTATE_PLAYER,{
                id: player.id.id,
                direction: player.direction}
        );
    }

    public movePlayer(playerId: string, direction: Directions) {
        const game = this.games.find(g => g.room.players.some(p => p.id.id === playerId));
        
        if (!game) {
            console.log("No se encontró el juego del jugador", playerId);
            return;
        }
    
        const player = game.room.players.find(p => p.id.id === playerId);
        if (!player) {
            console.log("Jugador no encontrado en la sala");
            return;
        }
    
        // Mover jugador en la dirección especificada
        if (player.x < 0 || player.x >= game.board.size || player.y < 0 || player.y >= game.board.size) {
        switch (direction) {
            case Directions.Up:
                player.y += 1;
                break;
            case Directions.Right:
                player.x += 1;
                break;
            case Directions.Down:
                player.y -= 1;
                break;
            case Directions.Left:
                player.x -= 1;
                break;
        }} else {
            console.log("Movimiento inválido");
        }
    
        // Enviar mensaje a la sala correcta
        ServerService.getInstance().sendMessage(
            game.room.name,
            Messages.MOVE_PLAYER,
            {
                id: player.id.id,
                x: player.x,
                y: player.y,
                state: player.state,
                direction: player.direction,
                visibility: player.visibility
            }
        );
    }
    


}

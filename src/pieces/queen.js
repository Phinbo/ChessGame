import Moves from "./moves.js";
import ChessPiece from "./piece.js";
export default class Queen extends ChessPiece {
    constructor(color, stateManager) {
        super(color, stateManager);
        this.name = 'Queen';
        this.tag = 'Q';
        this.className = "fas fa-chess-queen";

    }
    generateMoves(currPos) {
        let moves = [];
        let takes = [];

        let moveGen = new Moves(currPos, this, this.manager);

        // DIAGONALS
        let result = moveGen.slideDiagonal(1, 1);
        moves = moves.concat(result.moves);
        takes = takes.concat(result.takes);

        result = moveGen.slideDiagonal(1,-1);
        moves = moves.concat(result.moves);
        takes = takes.concat(result.takes);

        result = moveGen.slideDiagonal(-1,1);
        moves = moves.concat(result.moves);
        takes = takes.concat(result.takes);

        result = moveGen.slideDiagonal(-1,-1);
        moves = moves.concat(result.moves);
        takes = takes.concat(result.takes);

        // STRAIGHTS
        result = moveGen.slideForward();
        moves = moves.concat(result.moves);
        takes = takes.concat(result.takes);

        result = moveGen.slideBackward();
        moves = moves.concat(result.moves);
        takes = takes.concat(result.takes);

        result = moveGen.slideLeft();
        moves = moves.concat(result.moves);
        takes = takes.concat(result.takes);

        result = moveGen.slideRight();
        moves = moves.concat(result.moves);
        takes = takes.concat(result.takes);

        this.validMoves = moves;
        this.validTakes = takes;



    }
}
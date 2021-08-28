import ChessPiece from "./piece.js";
import Moves from "./moves.js";
export default class Rook extends ChessPiece {
    constructor(color, stateManager) {
        super(color, stateManager);
        this.name = 'Rook';
        this.tag = 'R';
        this.className = "fas fa-chess-rook";
    }
    generateMoves(currPos) {
        let moves = [];
        let takes = [];
        let moveGen = new Moves(currPos, this, this.manager);

        // Forward
        let result = moveGen.slideForward();
        moves = moves.concat(result.moves);
        takes = takes.concat(result.takes);

        // Backward
        result = moveGen.slideBackward();
        moves = moves.concat(result.moves);
        takes = takes.concat(result.takes);

        // Left
        result = moveGen.slideLeft();
        moves = moves.concat(result.moves);
        takes = takes.concat(result.takes);

        // Right
        result = moveGen.slideRight();
        moves = moves.concat(result.moves);
        takes = takes.concat(result.takes);

        this.validMoves = moves;
        this.validTakes = takes;
    }
}

import Moves from "./moves.js";
import ChessPiece from "./piece.js";
export default class Bishop extends ChessPiece {
    constructor(color, stateManager) {
        super(color, stateManager);
        this.name = 'Bishop';
        this.tag = 'B';
        this.className = "fas fa-chess-bishop";
    }

    generateMoves(currPos) {
        let moves = [];
        let takes = [];

        let moveGen = new Moves(currPos, this, this.manager);

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
        
        this.validMoves = moves;
        this.validTakes = takes;

    }
}
import Moves from "./moves.js";
import ChessPiece from "./piece.js";
export default class Knight extends ChessPiece {
    constructor(color, stateManager) {
        super(color, stateManager);
        this.name = 'Knight';
        this.tag = 'N';
        this.className="fas fa-chess-knight";
    }
    generateMoves(currPos) {
        let moves = [];
        let takes = [];
        let moveGen = new Moves(currPos, this, this.manager)

        takes = takes.concat(moveGen.takeL(1, 2));
        takes = takes.concat(moveGen.takeL(1,-2));
        takes = takes.concat(moveGen.takeL(2, 1));
        takes = takes.concat(moveGen.takeL(2,-1));

        moves = moves.concat(moveGen.moveL(1, 2));
        moves = moves.concat(moveGen.moveL(1,-2));
        moves = moves.concat(moveGen.moveL(2, 1));
        moves = moves.concat(moveGen.moveL(2,-1));

        this.validMoves = moves;
        this.validTakes = takes;

    }
}
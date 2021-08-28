import ChessPiece from "./piece.js";
import Moves from "./moves.js";
export default class King extends ChessPiece {
    constructor(color, stateManager) {
        super(color, stateManager);
        this.name = 'King';
        this.tag = 'K';
        this.className = "fas fa-chess-king";
    }

    generateMoves(currPos) {
        let moves = [];
        let takes = [];
        let moveGen = new Moves(currPos, this, this.manager);

        // Vertical Step/Take
        moves = moves.concat(moveGen.stepVertical( 1));
        moves = moves.concat(moveGen.stepVertical(-1));
        takes = takes.concat(moveGen.takeVertical( 1));
        takes = takes.concat(moveGen.takeVertical(-1));

        // Horizontal Step/Take
        moves = moves.concat(moveGen.stepHorizontal(1));
        takes = takes.concat(moveGen.takeHorizontal(1));

        // Diagonal Moves/Takes
        moves = moves.concat(moveGen.moveL(1, 1));
        moves = moves.concat(moveGen.moveL(1,-1));
        takes = takes.concat(moveGen.takeL(1, 1));
        takes = takes.concat(moveGen.takeL(1,-1));

        this.validMoves = moves;
        this.validTakes = takes;
    }
}
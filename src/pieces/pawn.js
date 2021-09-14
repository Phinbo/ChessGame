import Moves from "./moves.js";
import ChessPiece from "./piece.js";

export default class Pawn extends ChessPiece {
    constructor(color, stateManager) {
        super(color, stateManager);
        this.name = 'Pawn';
        this.tag = 'P';
        this.className = "fas fa-chess-pawn";
    }

    // Generate moves and attacks --- en passant NOT yet implemented!
    generateMoves(currPos) {
        let moves = [];
        let takes = [];

        let moveGen = new Moves(currPos, this, this.manager);

        // single step forward
        moves = moves.concat(moveGen.stepVertical(1));

        // double step
        if(this.hasMoved == false) {
            moves = moves.concat(moveGen.doubleJump());
        }

        // en passant
        // FOR NOW WILL ALWAYS CHEKC EN PASSANT if(this.manager.getTile(currPos + 1) || this.manager.getTile(currPos - 1).getPiece().;
        takes = takes.concat(moveGen.enPassant());

        // diagonal takes forward
        takes = takes.concat(moveGen.takeL(1,1));

        this.validMoves = moves;
        this.validTakes = takes;
    }
}
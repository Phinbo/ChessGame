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
        let special = [];

        let moveGen = new Moves(currPos, this, this.manager);

        // single step forward
        moves = moves.concat(moveGen.stepVertical(1));

        // double step
        if(this.hasMoved == false) {
            moves = moves.concat(moveGen.doubleJump());
        }

        special = special.concat(moveGen.enPassant());

        
        // diagonal takes forward
        takes = takes.concat(moveGen.takeL(1,1));

        // FINAL ROW SHIT
        // check all positions in special, takes,and moves, if any of them have positions on the last row, add it to this new special move.
        if(this.manager.getBoard().getRows()) {

        }

        this.specialMoves = special;
        this.validMoves = moves;
        this.validTakes = takes;
    }
}
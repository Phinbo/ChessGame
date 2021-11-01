import Moves from "./moves.js";
import ChessPiece from "./piece.js";

export default class Pawn extends ChessPiece {
    constructor(color, stateManager) {
        super(color, stateManager);
        this.name = 'Pawn';
        this.tag = 'P';
        this.className = "fas fa-chess-pawn";
        this.enPassant;
        this.upgrade;
    }

    getEnPassant() {
        return this.enPassant;
    }

    getUpgrade() {
        return this.upgrade;
    }
    // Generate moves and attacks --- en passant NOT yet implemented!
    generateMoves(currPos) {
        this.enPassant = [];
        this.upgrade = [];

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

        // en passant
        special = special.concat(moveGen.enPassant());
        this.enPassant = this.enPassant.concat(special);

        
        // diagonal takes forward
        takes = takes.concat(moveGen.takeL(1,1));

        // PAWN UPGRADE
        // check all positions in special, takes,and moves, if any of them have positions on the last row, add it to this new special move.
        let allPossible = takes.concat(moves);
        let last = (this.manager.getBoard().getColumns() * this.manager.getBoard().getRows()) - 1;  // last position
        for(let i = 0; i < allPossible.length; i++) {
            if(this.manager.getRow(allPossible[i]) == this.manager.getRow(last)) {
                special.push(allPossible[i]);   // black piece made it to end.
                this.upgrade.push(allPossible[i]);
            }
            else if (this.manager.getRow(allPossible[i]) == this.manager.getRow(0)) {
                special.push(allPossible[i]);   // white piece made it to end
                this.upgrade.push(allPossible[i]);
            }
        }

        this.specialMoves = special;
        this.validMoves = moves;
        this.validTakes = takes;
    }
}
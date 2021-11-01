// a placeholder piece representing a tile that can be attacked via en passant
import Moves from "./moves.js";
import ChessPiece from "./piece.js";

export default class EnPassant extends ChessPiece {
    constructor(color, stateManager) {
        super(color, stateManager);
        this.name = 'en passant';
        this.tag = '-';
        this.className = "";
    }

    // No moves --- just a placeholder.
    generateMoves(currPos) {
        let moves = [];
        let takes = [];

        this.validMoves = moves;
        this.validTakes = takes;
    }
}
// an object that represents a move taken.

export default class Move {
    constructor(start, end, piece) {
        this.start = start;
        this.end = end;
        this.piece = piece;
    }
    getStart() {
        return this.start;
    }
    getEnd() {
        return this.end;
    }
    getPiece() {
        return this.piece;  // a taken piece
    }
}
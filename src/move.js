// an object that represents a move taken.

export default class Move {
    constructor(movePiece, start, end, takePiece, passant) {
        this.movePiece = movePiece;
        this.start = start;
        this.end = end;
        this.takePiece = takePiece;

    }
    isSpecial() {
        return false;
    }
    getMovePiece() {
        return this.movePiece;
    }
    getStart() {
        return this.start;
    }
    getEnd() {
        return this.end;
    }
    getTakePiece() {
        return this.takePiece;
    }
}
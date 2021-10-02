export default class SpecialMove {
    constructor(movePiece, start, end) {
        this.movePiece = movePiece;
        this.start = start;
        this.end = end;
        this.takePiece;
        this.specialMove;;
    }
    getSpecialMove() {
        return this.specialMove;
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
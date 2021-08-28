// a tile on the board
export default class ChessTile {
    constructor(position, piece) {
        this.position = position;
        this.piece = piece;
    }

    ///////////////////////////
    /// GETTERS AND SETTERS ///
    ///////////////////////////
     
    hasPiece() {
        if(this.piece == null) {
            return false;
        }
        return true;
    }
    getPosition() {
        return this.position;
    }
    getPiece() {
        if(this.piece == null) {
            return null;
        }
        return this.piece;
    }
    setPiece(piece) {
        this.piece = piece;
    }
}
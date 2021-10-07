
export default class SpecialMove {
    constructor(movePiece, start, end, manager) {
        this.manager = manager;
        this.movePiece = movePiece;
        this.start = start;
        this.end = end;
        this.specialMove = this.#determineType();   // needs to be calculated
        this.takePiece = this.#determineTake();     // needs to be calculated
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
    getManager() {
        return this.manager;
    }
    isSpecial() {
        return true;
    }
    #determineType() {
        let name = this.movePiece.getName();
        switch(name) {
            case "Pawn":
                if((this.manager.getRow(this.manager.getBoard()*this.manager.getRow()) - 1) == this.manager.getRow(this.end) || this.manager.getRow(0) == this.manager.getRow(this.end)) {
                    console.log("Detected a pawn change move");
                    return "Pawn Change";
                    // THIS CURRENTLY DOES NOT WORK FOR BLACK PIECES!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                }
                return "En Passant";
            case "King":
                return "Castle";
        }
    }

    #determineTake() {
        switch(this.specialMove) {
            case "En Passant":
                return this.manager.getTile(this.end - (this.manager.getBoard().getColumns()) * this.movePiece.getDirection()).getPiece();
            case "Castle":
                return null;
        }
    }
}
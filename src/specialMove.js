
export default class SpecialMove {
    constructor(movePiece, start, end, manager, upgrade, takePiece) {
        this.manager = manager;
        this.movePiece = movePiece;
        this.start = start;
        this.end = end;
        this.upgrade = upgrade;
        this.specialMove = this.#determineType();   // needs to be calculated
        this.takePiece = this.#determineTake(takePiece);     // needs to be calculated
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
        console.log(this.takePiece);
        return this.takePiece;
    }
    getManager() {
        return this.manager;
    }
    getUpgrade() {
        return this.upgrade;
    }
    isSpecial() {
        return true;
    }
    #determineType() {
        let name = this.movePiece.getName();
        switch(name) {
            case "Pawn":                            
                if(this.manager.getBoard().getRows() - 1 == this.manager.getRow(this.end) || this.manager.getRow(0) == this.manager.getRow(this.end)) {
                    return "Pawn Change";
                }
                return "En Passant";
            case "King":
                return "Castle";
        }
    }

    #determineTake(take) {
        switch(this.specialMove) {
            case "En Passant":
                return this.manager.getTile(this.end - (this.manager.getBoard().getColumns()) * this.movePiece.getDirection()).getPiece();
            case "Pawn Change":
                return take;
            case "Castle":
                return null;
        }
    }
}
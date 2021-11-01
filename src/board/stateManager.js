// MANAGES THE STATE OF THE BOARD

import Pawn from "../pieces/pawn.js";
import Bishop from "../pieces/bishop.js";
import Knight from "../pieces/knight.js";
import Rook from "../pieces/rook.js";
import Queen from "../pieces/queen.js";
import King from "../pieces/king.js";
import ChessTile from "./tile.js";
import MessageBoard from "../messageBoard.js";
import Move from "../move.js";
import SpecialMove from "../specialMove.js";

export default class ChessStateManager {
    constructor(board) {
        this.turn = 'white';
        this.state = [];
        this.board = board;

        this.firstMoveHistory = [];

        this.moveHistory = []; // {currPos, endPos, pieceTaken};
        this.redoPath = [];     // stack holding redoPath

        this.movesThisTurn = 0;
        this.movesPerTurn = 1;
    }


    ///////////////////////////
    /// SETTERS AND GETTERS ///
    ///////////////////////////

    getTurn() {
        return this.turn;
    }
    getBoard() {
        return this.board;
    }
    getState() {
        return this.state;
    }
    getTile(index) {
        let maxPos = (this.board.getColumns() * this.board.getRows());
        if (index < maxPos && index >= 0) {
            return this.state[index];
        }
        return new ChessTile(-1, null); // impossible tile posiiton with null piece
    }
    getTileFromDiv(div) {
        let reg = /\d+/;
        let index = Number(div.id.match(reg)[0]);
        return this.state[index];
    }
    getDivFromIndex(index) {
        let div = document.getElementById("chessBoardTile" + index);
        return div;
    }
    getPieceColor(index) {
        return this.getTile(index).getPiece().getColor();
    }
    getRow(index) {
        return Math.floor(index / this.board.getColumns());  // return the index of the row
    }
    getColumn(index) {
        let col = (index % this.board.getColumns());
        return col; // return the index of the column
    }
    getMoveHistory() {
        return this.moveHistory;
    }
    getRedoPath() {
        return this.redoPath;
    }


    ///////////////////////
    /// OTHER UTILITIES /// 
    ///////////////////////

    pieceTurn(index) {   // returns true when the selected tile belongs to the team whos turn it is to move.
        if (this.state[index].getPiece().getColor() == this.turn) {
            return true;
        }
        return false;
    }
    nextTeam() {
        this.movesThisTurn++;
        if (this.movesThisTurn < this.movesPerTurn) {    // when the game allows for many moves per turn, and the total amount of moves is less than that amount, dont change team turn;
            return;
        }
        this.movesThisTurn = 0;
        if (this.turn == 'white') {
            this.turn = 'black';
            return;
        }
        this.turn = 'white';
        return;
    }
    prevTeam() {
        this.movesThisTurn--;
        if (this.movesThisTurn >= 0) {    // when the game allows for many moves per turn, and the total amount of moves is less than that amount, dont change team turn;
            return;
        }
        this.movesThisTurn = 0;
        if (this.turn == 'white') {
            this.turn = 'black';
            return;
        }
        this.turn = 'white';
        return;
    }


    //////////////////////////
    /// MOVEMENT FUNCTIONS /// 
    //////////////////////////

    tryMove(currPos, newPos) {
        if (!this.pieceTurn(currPos)) {
            return false;
        }
        let piece = this.state[currPos].getPiece();

        if (piece.getSpecialMoves().includes(newPos)) {
            this.specialMove(currPos, newPos);
            return true;
        }
        if (piece.getValidMoves().includes(newPos)) {   // piece could MOVE to attempted location
            this.move(currPos, newPos, false, null);
            return true;
        }
        if (piece.getValidTakes().includes(newPos)) {   // piece could TAKE at attempted location
            let takeName = this.state[newPos].getPiece().getName();
            this.move(currPos, newPos, true, takeName);
            return true;
        }
        return false;
    }

    // move: alter the game state and display the message
    move(currPos, newPos, isTake, takeName, doQuiet) {
        this.nextTeam();    // change which team moves next;
        MessageBoard.moveMessage(this.state[currPos].getPiece(), currPos, newPos, this.board.getColumns(), this.board.getColumns(), isTake, takeName);

        this.moveHistory.push(new Move(this.state[currPos].getPiece(), currPos, newPos, this.state[newPos].getPiece()));
        this.addFirstMove(this.state[currPos].getPiece());


        this.state[newPos].setPiece(this.state[currPos].getPiece());    // new position gets its piece set to the same as the current
        this.state[currPos].setPiece(null);                             // the current position (old position) has its piece set to null.

        this.board.update(this.state);

        if (this.redoPath.length > 0) {             // if not at most recent point, clear redos.
            MessageBoard.clearRedoPath();
            this.clearRedoPath();
        }
    }

    // SPECIAL MOVES:: SHOULD BE REFACTORED INTO NEW CLASS OR MULTIPLE CLASSES
    // right now this is quite literally the worst code I have ever written in my entire life. I am embarrasses that it exists.
    // Everything went to shit trying to implement pawn upgrades.
    specialMove(currPos, newPos) {
        this.nextTeam();    // change which team moves next;
        this.addFirstMove(this.state[currPos].getPiece());  // could cause issues with undo redo?? I may have imagined that...
        let myMove = new SpecialMove(this.state[currPos].getPiece(), currPos, newPos, this);

        switch (myMove.getSpecialMove()) {
            case "En Passant":
                this.moveHistory.push(myMove);

                MessageBoard.moveMessage(myMove.getMovePiece(), currPos, newPos, this.board.getColumns(), this.board.getColumns(), true, "Pawn", " en passant ");
                this.state[newPos].setPiece(this.state[currPos].getPiece());    // new position gets its piece set to the same as the current
                this.state[currPos].setPiece(null);
                this.state[newPos - (this.getBoard().getColumns() * myMove.getMovePiece().getDirection())].setPiece(null);
                endMove(this);
                break;
            case "Pawn Change":     // THIS SECTION in particular is FILTHY to look at. Its awful and hacky and it needs to be fixed.

                //////////////////////
                /// GET USER INPUT ///
                //////////////////////

                let newPiece;
                let oldPiece = this.state[currPos].getPiece();
                let take = this.state[newPos].getPiece();

                doPawnChange(this.state[currPos].getPiece().getColor(), this);
                function doPawnChange(color, manager) {

                    manager.getState()[newPos].setPiece(manager.getState()[currPos].getPiece());
                    manager.getState()[currPos].setPiece(null);
                    manager.getBoard().update(manager.getState());

                    let pawnPage = document.getElementById("pawnChangePage");
                    pawnPage.style.display = "block";
                    let pawnOptions = Array.from(document.querySelectorAll(".pieceChangeElement"));

                    for (let i = 0; i < pawnOptions.length; i++) {
                        pawnOptions[i].addEventListener("click", () => {
                            newPiece = getChangePiece(pawnOptions[i].id, color, manager);
                        });
                    }
                    let interval = setInterval(() => {
                        if (newPiece != null) {
                            clearInterval(interval);
                            endPawnChange(manager);
                        }
                        else {
                            console.log("Waiting for selection");
                        }
                    }, 10);
                }
                function endPawnChange(manager) {
                    let pawnPage = document.getElementById("pawnChangePage");
                    pawnPage.style.display = "none";
                    movePieces(manager);
                }
                function getChangePiece(id, color, manager) {
                    switch (id) {
                        case "QSelect":
                            return new Queen(color, manager);
                        case "BSelect":
                            return new Bishop(color, manager);
                        case "KnSelect":
                            return new Knight(color, manager);
                        case "RSelect":
                            return new Rook(color, manager);
                        default:
                            console.log(new Error("Wrong ID input for getChangePiece()"));
                            return null;
                    }
                }
                function movePieces(manager) {
                    myMove = new SpecialMove(oldPiece, currPos, newPos, manager, newPiece);
                    manager.getMoveHistory().push(myMove);

                    let takeName;
                    if(!(take == null)) {
                        takeName = take.getName();
                    }

                    MessageBoard.moveMessage(oldPiece, currPos, newPos, manager.getBoard().getColumns(), manager.getBoard().getColumns(), take, takeName);

                    /////////////////////

                    manager.getState()[newPos].setPiece(newPiece);
                    //manager.getState()[currPos].setPiece(null);

                    MessageBoard.message("Upgraded to " + newPiece.getName());
                    endMove(manager);
                }
                break;


            case "Castle":
                this.moveHistory.push(myMove);

                MessageBoard.moveMessage(this.state[currPos].getPiece(), currPos, newPos, this.board.getColumns(), this.board.getColumns(), false, "", " castle ");
                this.state[newPos].setPiece(this.state[currPos].getPiece());
                this.state[currPos].setPiece(null);
                let rookPos;
                let newRookPos;
                if (newPos > currPos) {
                    rookPos = currPos + 3;
                    newRookPos = currPos + 1;
                }
                else {
                    rookPos = currPos - 4;
                    newRookPos = currPos - 1;
                }
                this.state[newRookPos].setPiece(this.state[rookPos].getPiece());
                this.state[rookPos].setPiece(null);
                endMove(this);
        }

        function endMove(manager) {
            manager.getBoard().update(manager.getState());
            
            if (manager.getRedoPath().length > 0) {             // if not at most recent point, clear redos.
                MessageBoard.clearRedoPath();
                manager.clearRedoPath();
            }
        }
            
    }


    //////////////////////////
    /// GENERATION METHODS /// -- MOVE TO NEW CLASS
    //////////////////////////

    initialGeneration(FEN) {
        this.state = this.fenGen(FEN);
    }

    // generateFen() -- generate a fen string based on an input state
    genFen(state) {
        let output = "";
        for (let i = 0; i < state.length; i++) {
            let curr = state[i];
            let toAdd;      // string to add to FEN.
            // has Piece
            if (curr.hasPiece()) {
                toAdd = curr.getPiece().getTag();
                if (curr.getPiece().getColor() == 'black') {
                    toAdd = toAdd.toLowerCase();
                }
            }
            // no piece
            else {
                toAdd = '/1';
            }
            output = output + toAdd;
        }
        return output;
    }

    // generate a tile array based on an input FEN string.
    fenGen(FEN) {
        try {
            this.turn = 'white';
            let output = [];
            let fen = FEN;
            let reg = /^\d+|^[A-Za-z]/;
            while (fen.length > 0) {
                if (fen[0] == '/') {
                    fen = fen.substring(1);
                }
                else {
                    let match = fen.match(reg);
                    let code = match[0];
                    if (isNaN(code)) {
                        fen = fen.substring(1);
                        this.#addPiece(output, code);
                    }
                    else {
                        fen = fen.substring(code.length);
                        this.#fillBlanks(output, Number(code));
                    }
                }
            }
            if (output.length != (this.board.getRows() * this.board.getColumns())) {
                throw new Error("FEN code invalid for board");
            }
            else {
                //console.trace('fen valid');
            }
            return output;
        }
        catch {
            return this.fenGen((this.board.getColumns() * this.board.getRows()) + ""); // generates all blanks when fengen failed.
        }
    }
    #fillBlanks(input, num) {   // helper for fengen()
        for (let i = 0; i < num; i++) {
            input.push(new ChessTile(input.length, null));
        }
    }
    #addPiece(input, code) {    // helper for fengen()
        let piece;
        let color = 'black';
        if (code == code.toUpperCase()) {    // is uppercase
            color = 'white';
        }
        let test = code.toLowerCase();

        switch (test) {
            case 'r':
                piece = new Rook(color, this);
                break;
            case 'b':
                piece = new Bishop(color, this);
                break;
            case 'n':
                piece = new Knight(color, this);
                break;
            case 'k':
                piece = new King(color, this);
                break;
            case 'p':
                piece = new Pawn(color, this);
                break;
            case 'q':
                piece = new Queen(color, this);
                break;
        }
        input.push(new ChessTile(input.length, piece));
    }

    /////////////////////
    /// UNDO AND REDO ///
    /////////////////////

    addFirstMove(piece) {
        if (!this.firstMoveHistory.includes(piece)) {
            piece.setMoved(true);
            this.firstMoveHistory.push(piece);
            return;
        }
        this.firstMoveHistory.push(null);

    }
    popFirstMove() {
        let piece = this.firstMoveHistory.pop();
        if (piece == null) {
            return;
        }
        piece.setMoved(false);
    }

    //unmove
    undoMove() {    // startPos is the starting postion of the move to be undone, and endpos is likewise.
        if (this.moveHistory.length == 0) {
            return;
        }

        this.prevTeam();
        MessageBoard.undo();
        this.popFirstMove();

        let undo = this.moveHistory.pop();

        this.redoPath.push(undo);


        if (undo.isSpecial()) {
            let type = undo.getSpecialMove();
            switch (type) {
                case "En Passant":
                    this.state[undo.getStart()].setPiece(undo.getMovePiece());
                    this.state[undo.getEnd()].setPiece(null);
                    let takePos = (undo.getEnd() - (this.board.getColumns() * undo.getMovePiece().getDirection()));
                    this.state[takePos].setPiece(undo.getTakePiece());
                    break;
                case "Pawn Change":
                    this.state[undo.getStart()].setPiece(undo.getMovePiece());
                    this.state[undo.getEnd()].setPiece();
                case "Castle":
                    this.state[undo.getStart()].setPiece(undo.getMovePiece());
                    this.state[undo.getEnd()].setPiece(null);

                    let rookPos;
                    let oldRookPos;

                    let currPos = undo.getStart();

                    if (undo.getEnd() > undo.getStart()) {
                        rookPos = currPos + 1;
                        oldRookPos = currPos + 3;
                    }
                    else {
                        rookPos = currPos - 1;
                        oldRookPos = currPos - 4;
                    }
                    this.state[oldRookPos].setPiece(this.state[rookPos].getPiece());
                    this.state[rookPos].setPiece(null);
                    break;
            }
        }
        else {
            this.state[undo.getStart()].setPiece(undo.getMovePiece()); // set state at a moves start point to the end piece
            this.state[undo.getEnd()].setPiece(undo.getTakePiece());
        }

        this.board.update(this.state);
    }

    redoMove() {
        if (this.redoPath.length == 0) {
            return;
        }

        this.nextTeam();
        MessageBoard.redo();

        let redo = this.redoPath.pop();
        this.moveHistory.push(redo);

        this.addFirstMove(redo.getMovePiece());

        if (redo.isSpecial()) {
            let type = redo.getSpecialMove();
            switch (type) {
                case "En Passant":
                    this.state[redo.getEnd()].setPiece(redo.getMovePiece());
                    this.state[redo.getStart()].setPiece(null);
                    this.state[redo.getEnd() - (this.board.getColumns() * redo.getMovePiece().getDirection())].setPiece(null);
                    break;
                case "Pawn Change":
                    // this.state[redo.getEnd().setPiece(redo.getMovePiece())];
                    break;
                case "Castle":
                    this.state[redo.getStart()].setPiece(null);
                    this.state[redo.getEnd()].setPiece(redo.getMovePiece()); // why doesnt this work?

                    let rookPos;
                    let newRookPos;
                    let currPos = redo.getStart();

                    if (redo.getEnd() > currPos) {
                        rookPos = currPos + 3;
                        newRookPos = currPos + 1;
                    }
                    else {
                        rookPos = currPos - 4;
                        newRookPos = currPos - 1;
                    }
                    this.state[newRookPos].setPiece(this.state[rookPos].getPiece());
                    this.state[rookPos].setPiece(null);
                    break;
            }
        }
        else {  // normal move
            this.state[redo.getEnd()].setPiece(this.state[redo.getStart()].getPiece());
            this.state[redo.getStart()].setPiece(null);
        }

        this.board.update(this.state);
    }

    clearRedoPath() {
        this.redoPath = [];
    }
}

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
        //console.log(index + " is in column " + col);
        return col; // return the index of the column
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

        if (piece.getValidMoves().includes(newPos)) {   // piece could MOVE to attempted location
            this.move(currPos, newPos, false, null);
            return true;
        }
        if (piece.getSpecialMoves().includes(newPos)) {
            this.specialMove(currPos, newPos);
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
        //console.log(this.moveHistory[0]);

        this.addFirstMove(this.state[currPos].getPiece());

        this.state[newPos].setPiece(this.state[currPos].getPiece());    // new position gets its piece set to the same as the current
        this.state[currPos].setPiece(null);                             // the current position (old position) has its piece set to null.

        this.board.update(this.state);
        
        if (this.redoPath.length > 0) {             // if not at most recent point, clear redos.
            MessageBoard.clearRedoPath();
            this.clearRedoPath();
        }
    }

    specialMove(currPos, newPos) {
        this.nextTeam();    // change which team moves next;
        let myMove = new SpecialMove(this.state[currPos].getPiece(),currPos, newPos, this);
        this.moveHistory.push(myMove);

        switch(myMove.getSpecialMove()) {
            case "En Passant":
                MessageBoard.moveMessage(myMove.getMovePiece(), currPos, newPos, this.board.getColumns(), this.board.getColumns(), true, "Pawn", " en passant ");
                this.state[newPos].setPiece(this.state[currPos].getPiece());    // new position gets its piece set to the same as the current
                this.state[currPos].setPiece(null);
                this.state[newPos - (this.getBoard().getColumns() * myMove.getMovePiece().getDirection())].setPiece(null);
                break;
        }

        this.board.update(this.state);

        if (this.redoPath.length > 0) {             // if not at most recent point, clear redos.
            MessageBoard.clearRedoPath();
            this.clearRedoPath();
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
            //console.log(state[i]);
            let curr = state[i];
            let toAdd;      // string to add to FEN.
            //console.log(i);
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
                //console.trace('invalid fen');
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
            //console.log('piece has NOT moved before');
            return;
        }
        this.firstMoveHistory.push(null);
        //console.log('piece has moved before');
        
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
            //console.log('nothing to undo');
            return;
        }

        this.prevTeam();
        MessageBoard.undo();
        this.popFirstMove();

        let undo = this.moveHistory.pop();

        this.redoPath.push(undo);


        if(undo.isSpecial()) {
            let type = undo.getSpecialMove();
            switch(type) {
                case "En Passant":
                    this.state[undo.getStart()].setPiece(undo.getMovePiece());
                    this.state[undo.getEnd()].setPiece(null);
                    this.state[ undo.getEnd() - (this.board.getColumns()*undo.getMovePiece().getDirection()) ].setPiece(undo.getTakePiece());
                    break;
                case "Castle":
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
        //console.log(this.redoPath);

        if (this.redoPath.length == 0) {
            console.log('nothing to redo');
            return;
        }

        this.nextTeam();
        MessageBoard.redo();
        
        let redo = this.redoPath.pop();
        this.moveHistory.push(redo);

        this.addFirstMove(redo.getMovePiece());

        if(redo.isSpecial()) {
            let type = redo.getSpecialMove();
            switch(type) {
                case "En Passant":
                    console.log("Here");
                    this.state[redo.getEnd()].setPiece(redo.getMovePiece());
                    this.state[redo.getStart()].setPiece(null);
                    this.state[redo.getEnd() - (this.board.getColumns() * redo.getMovePiece().getDirection())].setPiece(null);
                    break;
                case "Castle":
                    break;
            } 
        }
        else {
            this.state[redo.getEnd()].setPiece(this.state[redo.getStart()].getPiece());
            this.state[redo.getStart()].setPiece(null);
        }

        this.board.update(this.state);
    }

    clearRedoPath() {
        this.redoPath = [];
    }
}

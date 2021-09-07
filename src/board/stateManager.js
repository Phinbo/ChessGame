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

export default class ChessStateManager {
    constructor(board) {
        this.turn = 'white';
        this.state = [];
        this.board = board;

        this.stateHistory = []; // stack holding move history in fen format
        this.redoPath = [];     // stack holding redoPath

        this.moveHistory = []; // {currPos, endPos, pieceTaken};

        this.movesThisTurn = 0;
        this.movesPerTurn = 1;

        this.enPassantTiles = [];
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
    incrementMoves() {
        this.movesThisTurn++;
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
        if (piece.getValidTakes().includes(newPos)) {   // piece could TAKE at attempted location
            let takeName = this.state[newPos].getPiece().getName();
            this.move(currPos, newPos, true, takeName);
            return true;
        }
        return false;
    }

    // move: alter the game state and display the message
    move(currPos, newPos, isTake, takeName) {
        this.nextTeam();    // change which team moves next;

        MessageBoard.moveMessage(this.state[currPos].getPiece(), currPos, newPos, this.board.getColumns(), this.board.getColumns(), isTake, takeName);

        this.moveHistory.push(new Move(currPos, newPos, this.state[newPos].getPiece()));

        this.state[currPos].getPiece().setMoved(true);
        this.state[newPos].setPiece(this.state[currPos].getPiece());    // new position gets its piece set to the same as the current
        this.state[currPos].setPiece(null);                             // the current position (old position) has its piece set to null.

        this.board.update(this.state);
        
        if (this.redoPath.length > 0) {             // if not at most recent point, clear redos.
            MessageBoard.clearRedoPath();
            this.clearRedoPath();
        }
    }

    //unmove
    undoMove() {    // startPos is the starting postion of the move to be undone, and endpos is likewise.
        if (this.moveHistory.length == 0) {
            console.log('nothing to undo');
            return;
        }

        this.prevTeam();
        MessageBoard.undo();

        let undo = this.moveHistory.pop();
        this.redoPath.push(undo);

        this.state[undo.getStart()].setPiece(this.state[undo.getEnd()].getPiece()); // set state at a moves start point to the end piece
        this.state[undo.getEnd()].setPiece(undo.getPiece());

        this.board.update(this.state);
    }

    redoMove() {

        console.log(this.redoPath);

        if (this.redoPath.length == 0) {
            console.log('nothing to redo');
            return;
        }

        this.nextTeam();
        MessageBoard.redo();

        let redo = this.redoPath.pop();
        this.moveHistory.push(redo);

        this.state[redo.getEnd()].setPiece(this.state[redo.getStart()].getPiece());
        this.state[redo.getStart()].setPiece(null);

        this.board.update(this.state);
    }


    //////////////////////////
    /// GENERATION METHODS /// -- MOVE TO NEW CLASS
    //////////////////////////

    updateHistory(state) {
        this.stateHistory.push(this.genFen(state)); // add to stateHistory

        if (this.redoPath.length > 0) {             // if not at most recent point, clear redos.
            MessageBoard.clearRedoPath();
            this.clearRedoPath();
        }
    }

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

    // undo() {
    //     if (this.stateHistory.length <= 1) {
    //         console.log('nothing to undo');
    //         return;
    //     }

    //     let toRemove = this.stateHistory.pop();
    //     this.redoPath.push(toRemove);
    //     //console.log('added ' + toRemove + ' to redoPath');

    //     this.state = this.fenGen(this.stateHistory[this.stateHistory.length - 1]); 
    //     this.prevTeam();
    //     this.board.update(this.state);

    //     MessageBoard.undo();
    //     // console.log('undo!!!');
    // }
    // redo() {
    //     if (this.redoPath.length == 0) {
    //         console.log('nothing to redo');
    //         return;
    //     }

    //     let toAdd = this.redoPath.pop();
    //     this.stateHistory.push(toAdd);

    //     this.state = this.fenGen(this.stateHistory[this.stateHistory.length - 1]); 
    //     this.nextTeam();
    //     this.board.update(this.state);

    //     MessageBoard.redo();
    //     // console.log('redo!!!');
    // }
    clearRedoPath() {
        this.redoPath = [];
    }
}

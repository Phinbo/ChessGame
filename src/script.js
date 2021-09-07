
import ChessBoard from "./board/board.js";
import ChessStateManager from "./board/stateManager.js";
import inputHandler from "./inputHandler.js";

/*

    TODO
    - Make InfoPage responsive --- the page is jank... the button in particular is jank.

    - Make the board have a CLEAN SLATE when resizing or new generational fen is used.... currently the team whos move it is stays the same..

    - PREVENT double jumping of pawns after an undo or redo...
        - change hasMoved() to be a more complex method. --- ONLY APPLIES TO PAWNS
        - check if it is on a tile where a PAWN of its OWN COLOR was at the INITIAL STATE in stateHistory.
        - THIS iS A JANKY ASS SOLUTION

        ALTERNATIVE: More robust and more reusable... make it so that undoRedo doesnt delete the pieces that were already there!
            - this would require a shitload of refactoring... basically the stateHistory would need to be dissolved..
            - history would have to track MOVES instead. this way when you update the board, you look at the move and perform it, without creating new pieces entirely. 
                    - This is possible because it means you wouldnt have to regenerate from FEN states which inherently cannot remember previous pieces.
            - would have to redo the move method, and undo/redo of stateManager... lots to evaluate.

    - Implement en passant in the pawn
            - when a pawn double jumps... ADD a new piece
    
    - Implement castling.

    - implement check and checkmate awareness
*/


////////////////////
/// DECLARATIONS ///
////////////////////

let board = new ChessBoard(document.getElementById("boardContainer"), document.getElementById("row").value, document.getElementById("col").value, 90);
let manager = new ChessStateManager(board);

// INITIAL SETUP
generateNewBoard(board.getRows(),board.getColumns(),"");   
manager.initialGeneration(document.getElementById("fenArea").value);
board.update(manager.getState());

// MessageBoard hide and open



/////////////////
/// FUNCTIONS ///
/////////////////

// generateNewBoard --- delete the previous board and replace it with a fresh new one. Used when resizing the board.
function generateNewBoard(row, col, fen) {
    if (document.getElementById("chessBoard") != null) { document.getElementById("chessBoard").remove(); }

    board.setColumns(col);
    board.setRows(row);

    board.generateBoard();
    manager.initialGeneration(fen);

    new inputHandler(manager);

    board.update(manager.getState());
}
function changeTileSize(tileSize) {
    board.changeTileSize(tileSize);
}

export{generateNewBoard, changeTileSize, manager};

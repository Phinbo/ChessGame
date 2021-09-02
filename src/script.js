
import ChessBoard from "./board/board.js";
import ChessStateManager from "./board/stateManager.js";
import inputHandler from "./inputHandler.js";

/*

    TODO
     DONE - There is a bug that causes moves to wrap around the board when board is changed from 8x8 to 12x8... fix it. 
        use this fen rnbqkbnr/pppppppp/8/8/8/8/8/8/8/8/PPPPPPPP/RNBQKBNR

     DONE - team turn changes when a move is made.

     DONE - create state history array (fen or states? fen is better for memory, but worse for performance since states would have to be generated)

     DONE- create a method that generates FEN from the current state.

    - Make InfoPage responsive --- the page is jank... the button in particular is jank.

    - Make the board have a CLEAN SLATE when resizing or new generational fen is used.... currently the team whos move it is stays the same..

    - PREVENT double jumping of pawns after an undo or redo...
        - change hasMoved() to be a more complex method. --- ONLY APPLIES TO PAWNS
        - check if it is on a tile where a PAWN of its OWN COLOR was at the INITIAL STATE in stateHistory.
        - THIS iS A JANKY ASS SOLUTION

        ALTERNATIVE: More robust and more reusable... make it so that UPDATE doesnt delete the pieces that were already there!
            - this would require a shitload of refactoring... basically the stateHistory would need to be dissolved..
            - history would have to track MOVES instead. this way when you update the board, you look at the move and perform it, without creating new pieces entirely. 
                    - This is possible because it means you wouldnt have to regenerate from FEN states which inherently cannot remember previous pieces.
            - would have to redo the update method, move method, and undo/redo of stateManager... lots to evaluate.

    - Implement en passant in the pawn
            - when a pawn double jumps... ADD a new piece
    
    - Implement castling.

     DONE - Add event listener or something that makes board center itself when the page is resized

     DONE - implement movesets for other pieces

     DONE   - make valid moves be highlighted (use classnames and css? may need to remember previous classname... just make this.classname in ChessTile()... then dont change it... idk)

    - implement check and checkmate awareness

    DONE - refactor undo and redo using stacks. push to history stack when new move. pop from history stack and push into redo stack on undo. 

    DONE - make a way to hide the chat log

    DONE - make chat messages dissappear on undo, and reappear on undo, and delete when a new move is made
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

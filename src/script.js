
import ChessBoard from "./board/board.js";
import ChessStateManager from "./board/stateManager.js";
import inputHandler from "./inputHandler.js";

/*

    TODO
     DONE - There is a bug that causes moves to wrap around the board when board is changed from 8x8 to 12x8... fix it. 
        use this fen rnbqkbnr/pppppppp/8/8/8/8/8/8/8/8/PPPPPPPP/RNBQKBNR

     DONE - team turn changes when a move is made.

    - create state history array (fen or states? fen is better for memory, but worse for performance since states would have to be generated)

     DONE- create a method that generates FEN from the current state.

    - Implement en passant in the pawn
    
    - Implement castling.

     DONE - Add event listener or something that makes board center itself when the page is resized

     DONE - implement movesets for other pieces

     DONE   - make valid moves be highlighted (use classnames and css? may need to remember previous classname... just make this.classname in ChessTile()... then dont change it... idk)

    - implement check and checkmate awareness

    DONE - make a way to hide the chat log

    - 
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

export{generateNewBoard, changeTileSize};


import ChessBoard from "./board/board.js";
import ChessStateManager from "./board/stateManager.js";
import inputHandler from "./inputHandler.js";

/*

    TODO
    - Make InfoPage responsive --- the page is jank... the button in particular is jank.

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

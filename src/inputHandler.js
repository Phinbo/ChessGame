// take user input and initiate moves.
export default class InputHandler {

    ///////////////////
    /// CONSTRUCTOR ///
    /////////////////// 

    // creates some variables and also eventListeners.
    constructor(manager) {
        this.holding = null;
        this.holdPosition;
        this.manager = manager;
        this.divs = document.getElementsByClassName('chessBoardTile');

        // UNDO AND REDO
        this.redo = document.getElementById("redo");
        this.undo = document.getElementById("undo");

        this.undo.addEventListener("click", () => {
            manager.undoMove();
            this.#returnPiece();
        });

        this.redo.addEventListener("click", () => {
            manager.redoMove();
            this.#returnPiece();
        });

        // END UNDO REDO

        // left click listeners on divs.
        for (let i = 0; i < this.divs.length; i++) {
            let div = this.divs[i];
            div.addEventListener('mousedown', (e) => {  // holding a piece
                if (e.button == 0) { // lmb
                    let tile = manager.getTileFromDiv(div);
                    if (this.holding == null) {
                        this.#pickup(tile);
                    }
                    else {
                        this.#putdown(tile);
                    }
                }
            });
        }

        // right click listener on the whole document for piece returning.
        document.addEventListener('mousedown', (e) => {
            if (e.button == 2) {
                this.#returnPiece();
            }
        });
        // document level prevention of context menu on left click
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }

    // ERASE EVENT LISTENERS -- called when the board is regenerated.
    abort() {
        let oldUndo = this.undo;
        let oldRedo = this.redo;
        let newUndo = this.undo.cloneNode(true);
        let newRedo = this.redo.cloneNode(true);

        oldUndo.parentNode.replaceChild(newUndo, this.undo);
        oldRedo.parentNode.replaceChild(newRedo, this.redo);
    }


    //////////////////////
    /// INPUT TRANSFER ///
    //////////////////////

    // pick up a piece, holding it
    #pickup(tile) {
        if (tile.hasPiece()) {
            this.holding = tile.getPiece();
            this.holdPosition = tile.getPosition();
            this.manager.getBoard().highlightMoves(this.holdPosition);
            return;
        }
        this.holding = null;
        return;
    }

    // put down a piece, trying to move it there.
    #putdown(tile) {
        if (this.holding == null) { // cant put down when not holding
            return;
        }
        this.manager.tryMove(this.holdPosition, tile.getPosition())  // attempt a move (gets true when the piece successfully moves/)
        this.#returnPiece();
        return;
    }

    // let go of a piece without attempting to move it.
    #returnPiece() {
        if (this.holding == null) {
            return;
        }
        this.holding = null;
        this.holdPosition = null;
        this.manager.getBoard().unhighlight();
    }
}
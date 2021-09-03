// take user input and initiate moves.
export default class inputHandler {

    ///////////////////
    /// CONSTRUCTOR ///
    /////////////////// 

    // creates some variables and also eventListeners.
    constructor(manager) {
        this.holding = null;
        this.holdPosition;
        this.manager = manager;
        this.divs = document.getElementsByClassName('chessBoardTile');

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
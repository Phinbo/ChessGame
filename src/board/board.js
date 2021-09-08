import { manager } from "../script.js";

// THIS CLASS WILL DO THE FOLLOWING AND NO MORE

// display the board
// update the board display on moves...

export default class ChessBoard {
    constructor(container, numRows, numColumns, totalWidth) {
        this.container = container;
        this.numRows = numRows;
        this.numColumns = numColumns;
        this.totalWidth = totalWidth;
        this.boardContainer;
        this.tileSize = 105;

        this.manager;

        this.highlighted = [];

        window.addEventListener('resize', (e) => {
            this.#positionBoard(this.boardContainer);
        });
    }


    ///////////////////////////
    /// SETTERS AND GETTERS /// 
    ///////////////////////////

    getRows() {
        return this.numRows;
    }
    setRows(rows) {
        this.numRows = rows;
    }
    getColumns() {
        return this.numColumns;
    }
    setColumns(col) {
        this.numColumns = col;
    }

    changeTileSize(tileSize) {
        let divs = Array.from(document.querySelectorAll('.chessBoardTile'));
        this.tileSize = tileSize;
        for(let i = 0; i < divs.length; i++) {
            let text = document.getElementById("chessBoardTileContent" + i);

            divs[i].style.width = tileSize + 'px';
            divs[i].style.height = tileSize + 'px';
            //divs[i].style.transform = 'scale(' + tileSize + ')';

            text.style.fontSize = tileSize/1.5 + 'px';
            text.style.lineHeight = divs[i].style.height;

            this.#styleBoardContainer(this.boardContainer, this.totalWidth, tileSize);
            this.#positionBoard(this.boardContainer);
        }
    }


    /////////////////////
    /// DISPLAY BOARD ///
    /////////////////////

    generateBoard() {
        let boardContainer = document.createElement("div");
        this.boardContainer = boardContainer;
        let divColor = "dark";

        //let size = this.#calculateTileSize(this.numRows, this.numColumns);
        let size = this.tileSize;

        this.#styleBoardContainer(boardContainer, this.totalWidth, size);

        // ROW
        let index = 0;
        for (let i = 0; i < this.numRows; i++) {
            if (this.numColumns % 2 == 0) {
                switch (divColor) {
                    case "dark":
                        divColor = "light";
                        break;
                    case "light":
                        divColor = "dark";
                        break;
                }
            }

            let rowDiv = document.createElement("div");
            rowDiv.style.display = "flex";
            rowDiv.style.flexDirection = "row";

            // COL
            for (let j = 0; j < this.numColumns; j++) {
                let div = document.createElement("div");

                this.#createDiv(div, size, index);

                switch (divColor) {
                    case "dark":
                        div.className = "darkTile";
                        divColor = "light";
                        break;
                    case "light":
                        div.className = "lightTile";
                        divColor = "dark";
                        break;
                }
                div.className = div.className + ' chessBoardTile';

                //div.innerHTML = index;

                index++;
                rowDiv.appendChild(div);
            }   // END COL
            boardContainer.appendChild(rowDiv);
        }       // END ROW
        this.container.appendChild(boardContainer);

        //this.changeTileSize(size);
        this.#positionBoard(boardContainer, size, this.totalWidth);
    }

    #styleBoardContainer(boardContainer, totalWidth, size) {
        boardContainer.id = "chessBoard";
        boardContainer.style.display = "flex";
        boardContainer.style.flexDirection = "column";
        boardContainer.style.alignItems = "center";
        boardContainer.style.width = size * this.numColumns + "px";
        boardContainer.style.backgroundColor = '#ddbb71';
    }
    #createDiv(div, size, index) {
        div.style.width = size + 'px';
        div.style.height = size + 'px';

        div.style.display = "block";
        div.style.display = 'flex';
        div.style.flexDirection = 'column';
        div.style.alignItems = 'center';
        div.id = "chessBoardTile" + index.toString();
        div.className = "chessBoardTile";
        
        let text = document.createElement('p');
        text.style.textAlign = 'center';
        text.style.fontWeight = 'bold';
        text.style.fontSize = size / 1.5 + 'px';                    // SIZE OF CHESS ICONS
        text.style.userSelect = 'none';
        text.id = "chessBoardTileContent" + index.toString();
        text.className = "chessBoardTileContent";
        text.style.lineHeight = div.style.height;
        div.appendChild(text);
    }

    #positionBoard(boardDiv) {

        let marginLR = 100; //px
        let marginTB = 30;

        let screenX = window.innerWidth;
        //console.log(screenX);
        let boardX = boardDiv.offsetWidth;

        let screenY = window.innerHeight;
        let boardY = boardDiv.offsetHeight;

        // center LR
        if(boardX < (screenX - (marginLR*2))) {
            boardDiv.style.marginLeft = (screenX - boardX)/2 + 'px';
            //console.log(boardDiv.style.marginLeft);
            this.container.style.width = '100%';
        }
        else {  //offset LR
            boardDiv.style.marginLeft = marginLR + 'px';
            this.container.style.width = (boardX + (marginLR*2)) + 'px';
        }
        // center TB
        if(boardY <= (screenY - (marginTB*2))) {
            let scrollbarheight = 18;   //px
            let topMargin = Math.floor((screenY - boardY - scrollbarheight) / 2);
            this.container.style.marginTop = topMargin + 'px';
            this.container.style.marginBottom = '0px';
        }
        else { // offset TB
            this.container.style.marginTop = marginTB +'px';
            this.container.style.marginBottom = marginTB +'px';
        }
    }

    // HIGHLIGHT
    // MOVE TO BOARD --- READY TO MOVE
    highlightMoves(currPos) {
        this.manager = manager;

        console.log("highlight");
        let piece = this.manager.getState()[currPos].getPiece();
        piece.generateMoves(currPos);

        let div = this.manager.getDivFromIndex(currPos);
        div.className = div.className + " highTile";
        this.highlighted.push(div);

        let moves = piece.getValidMoves();
        moves = moves.concat(piece.getValidTakes());

        let takes = piece.getValidTakes();

        // moves and takes
        for (let i = 0; i < moves.length; i++) {
            div = this.manager.getDivFromIndex(moves[i]);
            if (div != null) {
                this.highlighted.push(div);
                div.className = div.className + " highTile";
            }
        }

        // takes only
        for (let i = 0; i < takes.length; i++) {
            div = this.manager.getDivFromIndex(takes[i]);
            if (div != null) {
                this.highlighted.push(div);
                div.className = div.className + " underAttack";
            }
        }
        //this.board.update(this.state);

    }
    // MOVE TO BOARD
    unhighlight() {
        for (let i = 0; i < this.highlighted.length; i++) {
            let div = this.highlighted[i];
            div.className = div.className.replace(' highTile', '');
            div.className = div.className.replace(' underAttack', '');
        }
    }


    //////////////
    /// RENDER ///
    //////////////

    // SHOW PIECES ON TILES.
    update(state) {
        // THIS METHOD DOES NOT CREATE NEW PIECES
        for (let i = 0; i < this.numRows * this.numColumns; i++) {
            let textElement = document.getElementById("chessBoardTileContent" + i);
            if (state[i].hasPiece()) {
                textElement.style.color = state[i].getPiece().getColor();
                textElement.className = state[i].getPiece().getClassName();
            }
            else {  // no piece
                textElement.className = '';
            }
        }
    }
}

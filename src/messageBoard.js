
export default class MessageBoard {
    constructor() {
    }
    static messageHistory = [];
    static redoPath = [];

    // Display a message to the screen
    static message(str) {
        let newMessage = document.createElement('p');
        let separator = document.createElement('hr');
        separator.className = "chatHR";

        newMessage.className = "message";
        newMessage.textContent = str;

        this.add(newMessage, separator);
    }

    // Display a move message to the screen
    static moveMessage(piece, startPos, endPos, numCols, numRows, isTake, takenPiece, altActPhrase) {
        let actionPhrase = " to ";
        if(isTake) { actionPhrase = (" takes " + takenPiece + " "); }

        if(altActPhrase != null) {
            actionPhrase = (" " + altActPhrase + takenPiece + " ");
        }

        let startCol = (startPos%numCols) + 1;
        let startRow = numRows - (Math.floor(startPos/numRows));

        let endCol = (endPos%numCols) + 1;
        let endRow = numRows - (Math.floor(endPos/numRows));

        let output = (piece.getColor()[0].toUpperCase() + ": " + piece.getName() + " (" + startCol + ", " + startRow + ")"+ actionPhrase + "(" + endCol + ", " + endRow + ")");
        if(numCols < 27) {
            startCol = String.fromCharCode(64 + startCol);
            endCol = String.fromCharCode(64 + endCol);
            output = (piece.getColor()[0].toUpperCase() + ": " + piece.getName() + " " + startCol + startRow + actionPhrase + endCol + endRow + "");
        }
        this.message(output);
    }
    
    static add(message, hr) {
        let messageBoards = document.getElementById('messageBoard');
        //console.log(typeof this.messageHistory);
        this.messageHistory.push([message, hr]);

        messageBoards.appendChild(message);
        messageBoards.appendChild(hr);

        messageBoards.scrollTop = messageBoard.scrollHeight;
    }

    static undo() {
        let messageBoards = document.getElementById('messageBoard');
        let toRemove = this.messageHistory.pop();
        this.redoPath.push(toRemove);
        messageBoards.removeChild(toRemove[0]);
        messageBoards.removeChild(toRemove[1]);
    }
    static redo() {
        if(this.redoPath.length < 1) {
            console.log('redoPath has no entries');
            return;
        }
        //console.log(this.redoPath);
        let toAdd = this.redoPath.pop();
        this.add(toAdd[0], toAdd[1]);
    }
    static clearRedoPath() {
        console.log('clearpath');
        for(let i = 0; i < this.redoPath.length; i++) {
            this.redoPath[i][0].remove();
            this.redoPath[i][1].remove();
        }
        this.redoPath = [];
    }
}

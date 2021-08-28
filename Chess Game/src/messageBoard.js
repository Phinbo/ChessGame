
export default class MessageBoard {
    constructor() {
    }

    // Display a message to the screen
    static message(str, piece) {
        let messageBoards = document.getElementById('messageBoard');
        let newMessage = document.createElement('p');
        let separator = document.createElement('hr');
        separator.className = "chatHR";

        newMessage.className = "message";
        newMessage.textContent = str;

        // let color = '';
        // if(piece != null) { color = piece.getColor(); }

        // switch(color) {
        //     case 'white':
        //         newMessage.style.color = '#BBB';
        //         break;
        //     case 'black':
        //         newMessage.style.color =  "#000";
        //         break;
        //     case '':
        //         break;
        // }

        messageBoards.appendChild(newMessage);
        messageBoards.appendChild(separator);
        messageBoards.scrollTop = messageBoard.scrollHeight;
    }

    // Display a move message to the screen
    static moveMessage(piece, startPos, endPos, numCols, numRows, isTake, takenPiece) {
        let actionPhrase = " to ";
        if(isTake) { actionPhrase = (" takes " + takenPiece + " "); }

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
        this.message(output, piece);
    }
    
}

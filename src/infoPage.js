import { generateNewBoard, changeTileSize} from "./script.js";

////////////////////
/// DECLARATIONS ///
////////////////////

let generateButton = document.getElementById("generateButton");
let infoPage = document.getElementById('infoPage');
let infoState = "hidden";
let openClose = document.getElementById("open-close");
let canGenerate = Array.from(document.querySelectorAll('.canGenerate'));

let slider = document.getElementById("tileSizeSlider");

let messageButton = document.getElementById("messageBoard-open-close");
let messageButtonState = 'visible';
let messageBoard = document.getElementById("messageBoard");

updateMessageBoard() // turn off messageBoard by default





///////////////////////
/// EVENT LISTENERS ///
///////////////////////

// open and close navbar
openClose.addEventListener("click", (e) => {
    updateInfoPage();
});
// generate the board
generateButton.addEventListener("click", (e) => {
    createNewBoard(e);
});
messageButton.addEventListener("click", (e) => {
    updateMessageBoard();
});
slider.addEventListener("click", (e) => {
    changeTileSize(slider.value);
});


for (let i = 0; i < canGenerate.length; i++) {
    canGenerate[i].addEventListener("keydown", (e) => {
        if (e.key == "Enter") {
            createNewBoard(e);
        }
    });
}
for (let i = 0; i < canGenerate.length; i++) {
    canGenerate[i].addEventListener("focusout", (e) => {
        createNewBoard(e);
    });
}



/////////////////
/// FUNCTIONS ///
/////////////////

function createNewBoard(e) {
    let row = document.getElementById("row").value;
    let col = document.getElementById("col").value;
    let fen = document.getElementById("fenArea").value;
    generateNewBoard(row, col, fen);
    e.stopPropagation();
}

function updateInfoPage() {
    switch (infoState) {
        case "hidden":
            infoState = "visible";
            infoPage.style.left = '0px';
            openClose.style.left = '365px';
            openClose.className = "fas fa-times-circle leftTransition";
            break;
        case "visible":
            infoState = "hidden";
            infoPage.style.left = '-373px';
            openClose.style.left = '-8px'
            openClose.className = "fas fa-chevron-circle-right leftTransition";
            break;
    }
}

function updateMessageBoard() {
    console.log("here, was " + messageButtonState);
    switch (messageButtonState) {
        case "hidden":
            messageButtonState = "visible";
            messageBoard.style.display = 'block';
            messageButton.className = "fas fa-times-circle";
            break;
        case "visible":
            messageButtonState = "hidden";
            messageBoard.style.display = 'none';
            messageButton.className = "fas fa-chevron-circle-down";
            break;
    }
}
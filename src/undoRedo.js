import { manager } from "./script.js";

let redo = document.getElementById("redo");
let undo = document.getElementById("undo");

undo.addEventListener("click", () => {
    console.log('undo clicked');
});

redo.addEventListener("click", () => {
    console.log('redo clicked');
});

//function undo


let root = document.documentElement;
let button = document.getElementById("toggleColors");

button.addEventListener("click",toggle);


const orange = {
    darkTileColor: "#b68b3b",
    lightTileColor : "#ddc071",
    tileHoverBorder : 'rgba(0, 0, 0, 1)',
    
    gradientBottom : 'rgba(9, 20, 34, 1)',
    gradientTop : 'rgba(44, 52, 63, 1)',
    
    scrollbarThumb : '#975a28',
    scrollbarThumbHover : '#72441f',
    
    border : 'rgb(223,134,33)',
    
    infoPage : '#b1b6bd',
    
    buttonHover : 'rgb(255, 194, 137)',
    
    messageBoard : 'rgba(84, 95, 99, 0.836)',
    message : 'rgb(189, 189, 189)',
    
    underAttack : 'rgb(255, 75, 75)',
    highlightHueRotation : '-40deg',
    specialHighlight : 'rgb(255, 238, 83)',
    
    stateButtonOutside : 'rgba(50, 73, 99, 0.562)',
    stateButtonInside : 'rgb(255, 255, 255)',
    
    uiHover : 'rgb(230, 90, 30)',
    
    pawnChangePage : 'rgba(255, 255, 255, 0.356)',
    pawnChange : 'rgb(0, 0, 0)',
};

const blue = {
    darkTileColor: "#3bb6b6",
    lightTileColor : "#85d3ce",
    tileHoverBorder : 'rgba(0, 0, 0, 1)',
    
    gradientBottom : 'rgb(18 9 34)',
    gradientTop : 'rgb(63 44 53)',
    
    scrollbarThumb : '#284297',
    scrollbarThumbHover : '#2a1f72',
    
    border : 'rgb(33 146 223)',
    
    infoPage : '#9dbccb',
    
    buttonHover : 'rgb(137 240 255)',
    
    messageBoard : 'rgb(75 61 82 / 84%)',
    message : 'rgb(236 255 253)',
    
    underAttack : 'rgb(255 223 115)',
    highlightHueRotation : '200deg',
    specialHighlight : 'rgb(255, 238, 83)',
    
    stateButtonOutside : 'rgb(109 97 133 / 56%)',
    stateButtonInside : 'rgb(255, 255, 255)',
    
    uiHover : 'rgb(67 102 189)',
    
    pawnChangePage : 'rgba(255, 255, 255, 0.356)',
    pawnChange : 'rgb(0, 0, 0)',
};

const list = [orange, blue];
let current = 0;
function toggle() {
    current++;
    if(current >= list.length) {
        current = 0;
    }
    for(const property in list[current]) {
        root.style.setProperty("--" + property, list[current][property]);
    }
}
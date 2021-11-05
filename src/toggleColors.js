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

    infoPageButton: '#1a1a1a',
    infoPageText: '#1a1a1a',
    messageBoardButton: '#f19130',
    fenGuideText: '#313131',
    fenGuideBackground: 'rgba(255, 255, 255, 0.452)',
};
const blue = {
    darkTileColor: "#3c9f9f",
    lightTileColor : "#85d3ce",
    tileHoverBorder : 'rgba(0, 0, 0, 1)',
    
    gradientBottom : 'rgb(18 9 34)',
    gradientTop : 'rgb(63 44 53)',
    
    scrollbarThumb : '#284297',
    scrollbarThumbHover : '#2a1f72',
    
    border : 'rgb(0 152 207)',
    
    infoPage : '#9dbccb',
    
    buttonHover : 'rgb(137 240 255)',
    
    messageBoard : 'rgb(76 64 82 / 84%)',
    message : 'rgb(199 199 199)',
    
    underAttack : 'rgb(255 223 115)',
    highlightHueRotation : '-140deg',
    specialHighlight : 'rgb(255, 238, 83)',
    
    stateButtonOutside : 'rgb(109 97 133 / 56%)',
    stateButtonInside : 'rgb(255, 255, 255)',
    
    uiHover : 'rgb(67 102 189)',
    
    pawnChangePage : 'rgba(255, 255, 255, 0.356)',
    pawnChange : 'rgb(0, 0, 0)',

    infoPageButton: '#1a1a1a',
    infoPageText: '#1a1a1a',
    messageBoardButton: '#4287a1',
    fenGuideText: '#313131',
    fenGuideBackground: 'rgba(255, 255, 255, 0.452)',
};
const green = {
    darkTileColor: "#3a8f4c",
    lightTileColor: "#b4cf9a",
    tileHoverBorder: "rgba(0, 0, 0, 1)",

    gradientBottom: 'rgb(34 9 9)',
    gradientTop: 'rgb(63 44 44)',

    scrollbarThumb: '#326e23',
    scrollbarThumbHover: '#285619',

    border: 'rgb(112 179 36)',

    infoPage: '#aabba2',

    buttonHover: 'rgb(177 255 137)',

    messageBoard: 'rgb(99 90 84 / 84%)',
    message: 'rgb(195 217 190)',

    underAttack: 'rgb(255 210 45)',
    highlightHueRotation: '-70deg',
    specialHighlight: 'rgb(255, 238, 83)',

    stateButtonOutside: 'rgb(99 50 50 / 56%)',
    stateButtonInside: 'rgb(255, 255, 255)',

    uiHover: 'rgb(30 230 77)',
    
    pawnChangePage: 'rgba(255, 255, 255, 0.356)',
    pawnChange: 'rgb(0, 0, 0)',

    infoPageButton: '#1a1a1a',
    infoPageText: '#1a1a1a',
    messageBoardButton: '#7ab131',
    fenGuideText: '#313131',
    fenGuideBackground: 'rgba(255, 255, 255, 0.452)',
};
const red = {
    darkTileColor: '#5c1f1f',
    lightTileColor: '#7c2d2d',
    tileHoverBorder: 'rgb(0 0 0)',
    gradientBottom: 'rgb(0 0 0)',
    gradientTop: 'rgb(38 10 10)',
    scrollbarThumb: '#3e0e0e',
    scrollbarThumbHover: '#2c0404',
    border: 'rgb(124 0 0)',
    infoPage: '#814f4f',
    buttonHover: 'rgb(193 86 86)',
    messageBoard: 'rgb(62 31 31 / 84%)',
    message: 'rgb(143 143 143)',
    underAttack: 'rgb(171 72 144)',
    highlightHueRotation: '-45deg',
    specialHighlight: 'rgb(255, 238, 83)',
    stateButtonOutside: 'rgb(112 60 60 / 56%)',
    stateButtonInside: 'rgb(255, 255, 255)',
    uiHover: 'rgb(183 34 52)',
    pawnChangePage: 'rgb(0 0 0 / 35%)',
    pawnChange: 'rgb(0 0 0)',

    infoPageButton: '#1a1a1a',
    infoPageText: '#1a1a1a',
    messageBoardButton: '#815353',
    fenGuideText: '#313131',
    fenGuideBackground: 'rgba(255, 255, 255, 0.452)',
};

const root = document.documentElement;
const button = document.getElementById("toggleColors");
const list = [orange, green, blue, red];
let current = 0;

button.addEventListener("click",toggle);

initColor();

function initColor() {
    const colorRegex = /(?<=colorTheme=)\d/;
    let val = document.cookie.match(colorRegex)[0];
    if(val != "") {
        setColor(parseInt(val));
    }
}

function toggle() {
    document.cookie = "colorTheme= ; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";                // delete old cookie
    current++;
    if(current >= list.length) {
        current = 0;
    }
    document.cookie = "colorTheme=" + current + "; expires=Tue, 19 Jan 2038 04:14:07 GMT; path=/";  // create new cookie
    setColor(current);
}

function setColor(listNum) {
    current = listNum;
    for(const property in list[listNum]) {
        root.style.setProperty("--" + property, list[listNum][property]);
    }
}
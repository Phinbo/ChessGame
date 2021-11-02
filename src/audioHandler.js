const moveSounds = [
    "./sounds/pieceMove1.wav",
    "./sounds/pieceMove2.wav",
    "./sounds/pieceMove3.wav",
    "./sounds/pieceMove4.wav",
    "./sounds/pieceMove5.wav",
];
export default class AudioHandler {
    constructor() {
    }


    static randomSound() {
        const sound = moveSounds[Math.floor(Math.random()*(moveSounds.length))];
        return sound;

    }

    static playSound(audio) {
        audio.play();
    }

    static moveSound(multi) {
        let audio1 = new Audio(moveSounds[0]);
        audio1.play();
        if(multi) {
            let audio2 = new Audio(AudioHandler.randomSound());
            console.log("multiple pieces moved.");
            audio2.play();
        }
    }
}
const moveSounds = [
    "./sounds/pieceMove2.wav",
    "./sounds/pieceMove3.wav",
    "./sounds/pieceMove4.wav",
    "./sounds/pieceMove5.wav",
];
export default class AudioHandler {
    // RETURN RANDOM SOUND FROM LIST
    static randomSound() {
        const sound = moveSounds[Math.floor(Math.random()*(moveSounds.length))];
        return sound;
    }

    // PLAY MOVE SOUND. IF MANY PIECES MOVED, PLAY A DELAYED SOUND AS WELL
    static moveSound(multi, delay=50) {
        const audio1 = new Audio("./sounds/pieceMove1.wav");
        const audio2 = new Audio(AudioHandler.randomSound());

        if(multi) {
            setTimeout(() => {
                audio2.play();
            }, delay);
        }
        audio1.play();
    }
}
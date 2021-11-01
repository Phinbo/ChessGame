# ChessGame
[Click Here!](https://phinziegler.github.io/ChessGame/)<br>
This is a personal project of mine. Trying to create something to prove my knowledge of Javascript, HTML, and CSS.

## In development
1. En Passant pawn attacks. (**DONE**).
2. Pawn piece changing (**DONE**). 
3. Castling. (**DONE**)
4. Check and checkmate detection. 
5. Undo and Redo (**DONE**). 
6. Alternate Win condition settings:
    1. Checkmate
    2. Elimination
    3. Pawn journey
8. Creating starting positions (already possible with fen, but I would like this to be possible using a more natural menu).
9. Custom Colors OR a list of presets to choose from.
10. Audio Queues for moves, and/or music?

## Known Bugs
1. Undo and Redo not working properly on abnormal board size. Example is "kn/pp/2/2/2/2/PP/KN." Special moves work fine, but normal moves reset the board on undo, and go back to previous state on redo, instead of only undoing and redoing single moves.
2. Pawns able to move into the final row highlight in the "take piece" color even when not taking a piece at that location.

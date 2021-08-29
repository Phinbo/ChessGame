# ChessGame

This is a personal project of mine. Trying to create something to prove my knowledge of Javascript, HTML, and CSS.

## In development
1. En Passant pawn attacks. 
2. Pawn piece changing. 
3. Castling. 
4. Check and checkmate detection. 
**DONE** 
5. Undo and Redo (almost done). 
6. Alternate Win condition settings:
    1. Checkmate
    2. Elimination
    3. Pawn journey
8. Creating starting positions (already possible with fen, but I would like this to be possible using a more natural menu).

## Known Bugs
1. When undoing and redoing, the states of pieces is reset, allowing pawns to double jump again. This also complicates the developement of castling, since I can't just check if the king and the rook have moved. 

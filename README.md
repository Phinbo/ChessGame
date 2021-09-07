# ChessGame

This is a personal project of mine. Trying to create something to prove my knowledge of Javascript, HTML, and CSS.

## In development
1. En Passant pawn attacks. 
2. Pawn piece changing. 
3. Castling. 
4. Check and checkmate detection. 
5. Undo and Redo (**DONE**). 
6. Alternate Win condition settings:
    1. Checkmate
    2. Elimination
    3. Pawn journey
8. Creating starting positions (already possible with fen, but I would like this to be possible using a more natural menu).

## Known Bugs
1. When undoing an initial pawn move (for example) the piece forgets that it shouldnt have moved from this position.
    need to enhance either undo, or hasMoved() to detect when the piece has moved. What happens more? redoing or detecting hasMoved()?

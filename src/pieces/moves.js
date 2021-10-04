/*
    ALL MOVEMENT METHODS SHOULD RETURN A LIST OF MOVES GENERATED BY THAT METHOD
*/
import EnPassant from "./enPassant.js";
import Pawn from "./pawn.js";

export default class Moves {
    constructor(currPos, piece, stateManager) {
        this.currPos = currPos;
        this.manager = stateManager;
        this.piece = piece;
        this.cols = Number(this.manager.getBoard().getColumns());
        this.rows = Number(this.manager.getBoard().getRows());
    }
    #smallDimension() {
        if(this.cols < this.rows) {
            return this.cols;
        }
        return this.rows;
    }
    #canTake(pos) {
        if (this.piece.getColor() != this.manager.getPieceColor(pos)) {
            return true;
        }
        return false;
    }

    #onSameRow(pos1, pos2) {
        if (this.manager.getRow(pos1) == this.manager.getRow(pos2)) {
            //console.log(pos1 + " and " + pos2 + " same row");
            return true;
        }
        return false;
    }
    #onSameCol(pos1, pos2) {
        if (this.manager.getColumn(pos1) == this.manager.getColumn(pos2)) {
            //console.log(pos1 + " and " + pos2 + " ARE on same col");
            return true;
        }
        //console.log(pos1 + " and " + pos2 + " NOT on same col");
        return false;
    }

    // STEP AND TAKE FORWARD N STEPS
    stepVertical(numSteps) {
        let move = [];
        let step = this.currPos + (this.cols * this.piece.getDirection() * numSteps);
        if (!this.manager.getTile(step).hasPiece()) {
            move.push(step);
        }
        return move;
    }
    // pawn only move
    doubleJump() {
        let move = [];
        let step1 = this.currPos + (this.cols * this.piece.getDirection() * 1);
        let step2 = this.currPos + (this.cols * this.piece.getDirection() * 2);
        if (!this.manager.getTile(step1).hasPiece() && !this.manager.getTile(step2).hasPiece()) {
            move.push(step2);
        }
        return move;
    }
    takeVertical(numSteps) {
        let take = [];
        let step = this.currPos + (this.cols * this.piece.getDirection() * numSteps);
        if (this.manager.getTile(step).hasPiece() && this.#canTake(step)) {
            take.push(step);
        }
        return take;
    }

    // STEP AND TAKE HORIZONTAL N STEPS
    stepHorizontal(numSteps) {
        let moves = [];
        let step1 = this.currPos + numSteps;
        let step2 = this.currPos - numSteps;

        if(!this.manager.getTile(step1).hasPiece() && this.#onSameRow(step1, this.currPos)) {
            moves.push(step1);
        }
        if(!this.manager.getTile(step2).hasPiece() && this.#onSameRow(step2, this.currPos)) {
            moves.push(step2);
        }

        return moves;
    }
    takeHorizontal(numSteps) {
        let takes = [];
        let step1 = this.currPos + numSteps;
        let step2 = this.currPos - numSteps;

        if(this.manager.getTile(step1).hasPiece() && this.#onSameRow(step1, this.currPos) && this.#canTake(step1)) {
            takes.push(step1);
        }
        if(this.manager.getTile(step2).hasPiece() && this.#onSameRow(step2, this.currPos) && this.#canTake(step2)) {
            takes.push(step2);
        }

        return takes;
    }

    // MOVE AND TAKE Forward x and sideways y
    moveL(stepsSideways, stepsForward) {
        let moves = [];

        let forward = this.currPos + (this.cols * this.piece.getDirection() * stepsForward);
        let move1 = forward - stepsSideways;
        let move2 = forward + stepsSideways;

        if (this.#onSameRow(move1, forward) && !this.manager.getTile(move1).hasPiece()) {
            //console.log("pushed " + move1);
            moves.push(move1);
        }
        if (this.#onSameRow(move2, forward) && !this.manager.getTile(move2).hasPiece()) {
            //console.log("pushed " + move2);
            moves.push(move2);
        }
        return moves;
    }

    // TAKE IN AN L SHAPE MOVEMENT. x, y... note that it takes both left and right
    takeL(stepsSideways, stepsForward) {
        let takes = [];

        let forward = this.currPos + (this.cols * this.piece.getDirection() * stepsForward);
        let take1 = forward - stepsSideways;
        let take2 = forward + stepsSideways;

        if (this.#onSameRow(take1, forward) && this.manager.getTile(take1).hasPiece() && this.#canTake(take1)) {
            takes.push(take1);
        }
        if (this.#onSameRow(take2, forward) && this.manager.getTile(take2).hasPiece() && this.#canTake(take2)) {
            takes.push(take2);
        }
        return takes;
    }

    // SLIDE MOVES
    slideForward() {
        let moves = [];
        let takes = [];

        let forwardStep;
        let step = this.currPos;
        let forwardCollide = false;
        while (forwardCollide == false) {
            forwardStep = step + this.cols;

            if (forwardStep >= (this.rows * this.cols)) {
                forwardCollide = true;
            }
            if (!this.manager.getTile(forwardStep).hasPiece()) {
                moves.push(forwardStep);
            }
            else if (this.#canTake(forwardStep)) {
                takes.push(forwardStep);
                forwardCollide = true;
            }
            else {
                forwardCollide = true;
            }
            step = forwardStep;
        }
        return {
            moves: moves,
            takes: takes
        };
    }

    slideBackward() {
        let moves = [];
        let takes = [];

        let backStep;
        let step = this.currPos;
        let backwardCollide = false;
        while (backwardCollide == false) {
            backStep = step - this.cols;
            if (backStep < 0) {
                backwardCollide = true;
            }
            if (this.manager.getTile(backStep).hasPiece() == false) {
                moves.push(backStep);
            }
            else {
                backwardCollide = true;
                if (this.#canTake(backStep)) {
                    takes.push(backStep);
                }
            }
            step = backStep;
        }
        return {
            moves: moves,
            takes: takes
        };
    }

    slideLeft() {
        let moves = [];
        let takes = [];
        let leftStep;
        let step = this.currPos;
        let leftCollide = false;
        while (leftCollide == false) {
            leftStep = step - 1;
            // check if on same row
            if (leftStep < 0 || this.manager.getRow(leftStep) != this.manager.getRow(this.currPos)) {
                leftCollide = true;
                break;
            }
            if (this.manager.getTile(leftStep).hasPiece() == false) {
                moves.push(leftStep);
            }
            else {
                leftCollide = true;
                if (this.#canTake(leftStep)) {
                    takes.push(leftStep);
                }
            }
            step = leftStep;
        }
        return {
            moves: moves,
            takes: takes
        };
    }

    slideRight() {
        let moves = [];
        let takes = [];
        let rightStep;
        let step = this.currPos;
        let rightCollide = false;
        while (rightCollide == false) {
            rightStep = step + 1;
            // check if on same row
            if ((rightStep >= this.cols * this.rows) || this.manager.getRow(rightStep) != this.manager.getRow(this.currPos)) {
                rightCollide = true;
                break;
            }
            if (this.manager.getTile(rightStep).hasPiece() == false) {
                moves.push(rightStep);
            }
            else {
                rightCollide = true;
                if (this.#canTake(rightStep)) {
                    takes.push(rightStep);
                }
            }
            step = rightStep;
        }
        return {
            moves: moves,
            takes: takes
        };
    }

    // Diagonal Slides (same inputs as a movL)
    slideDiagonal(sideSteps, stepsForward) {
        let moves = [];
        let takes = [];

        let collision = false;
        let counter = 0;
        let pos = this.currPos;
        while(!collision && counter < 1000) {

            let forward = pos + (this.cols * this.piece.getDirection() * stepsForward);
            let step = forward + sideSteps;

            if (this.#onSameRow(step, forward) && !this.manager.getTile(step).hasPiece()) {
                moves.push(step);
                //console.log("move " + step);
            }
            else if (this.#onSameRow(step, forward) && this.manager.getTile(step).hasPiece() && this.#canTake(step)) {
                takes.push(step);
                collision = true;
                //console.log("take " + step);
            }
            else {  // this happens when you bump into an ally piece
                collision = true;
            }
            pos = step;
            counter++;
        }

        return {
            moves: moves,
            takes: takes
        }

    }


    /////////////////////
    /// SPECIAL MOVES ///
    /////////////////////


    // THIS ONLY HANDLES FIGURING OUT WHEN THE MOVE IS POSSIBLE. It still needs help with implementation.
    enPassant() {
        let specials = [];
        let potPawnLocs = [];   // potential pawn locations
        if(this.#onSameRow(this.currPos, this.currPos + 1)) {
            potPawnLocs.push(this.currPos + 1);
        }
        if(this.#onSameRow(this.currPos, this.currPos - 1)) {
            potPawnLocs.push(this.currPos - 1);
        }

        // NOW CHECK THE PRESENCE OF PAWNS AT THESE LOCATIONS --- also check they just made a double jump
        for(let i = 0; i < potPawnLocs.length; i++) {
            let testPiece = this.manager.getTile(potPawnLocs[i]).getPiece();
            if(testPiece != null && testPiece.getName() == "Pawn" && this.piece.getColor() != testPiece.getColor()) {
                this.manager.undoMove();
                if(this.manager.getTile(potPawnLocs[i] + (this.cols * 2 * this.piece.getDirection())).getPiece() == testPiece) {
                    specials.push(potPawnLocs[i] + (this.cols * this.piece.getDirection()));
                    // NOTE: this adds the move location... specials could hold objects though maybe?
                }
                this.manager.redoMove();
            }
        }
        return specials;
    }

    castle() {
        let specials = [];
        let potRookLocs = []; /// +3 or -4 to king's current position (check on same row!)

        // CRINGE CODE ALERT: THESE SHOULD BE IN THEIR OWN METHODS.
        // THESE FOR LOOPS CHECK THAT THERE ARE NO TILES UP TO THE POT ROOK LOCATION
        for(let i = 1; i < 3; i++) {
            if(this.manager.getTile(this.currPos + i).getPiece() != null) {
                console.log("broke right, at " + (this.currPos + i));
                break;
            }
            if(i == 2 && this.#onSameRow(this.currPos, this.currPos + 3)) {    // if on last loop
                potRookLocs.push(this.currPos + 3)
            }
        }
        for(let i = 1; i < 4; i++){
            if(this.manager.getTile(this.currPos - i).getPiece() != null) {
                console.log("broke left");
                break;
            }
            if(i == 3 && this.#onSameRow(this.currPos, this.currPos - 4)) {    // if on last loop
                potRookLocs.push(this.currPos - 4)
            }
        }

        // check for rooks at these locs
        for(let i = 0; i < potRookLocs.length; i++) {
            let testPos = potRookLocs[i];
            let Rpiece = this.manager.getTile(testPos).getPiece();
            if(Rpiece != null && Rpiece.getName() == "Rook" && Rpiece.getColor() == this.piece.getColor() && !Rpiece.getMoved()) {
                if(testPos > this.currPos) {
                    specials.push(this.currPos + 2);
                    console.log("did right");
                }
                else {
                    specials.push(this.currPos - 2);
                    console.log("did left");
                }
            }
        }
        return specials;
    }
}


export default class ChessPiece {

  constructor(color, stateManager) {
    if (this.constructor == ChessPiece) {
      throw new Error("Abstract classes can't be instantiated.");
    }

    this.manager = stateManager;

    this.tag;
    this.color = color;
    this.name;
    this.validMoves = [];
    this.validTakes = [];
    this.hasMoved = false;
    this.className;
    this.direction = this.direction();
  }


  ///////////////////////////
  /// SETTERS AND GETTERS ///
  ///////////////////////////

  hasMoved() {
    return this.hasMoved;
  }
  setMoved(bool) {
    this.hasMoved = bool;
  }
  getClassName() {
    return this.className;
  }
  getName() {
    return this.name;
  }
  setColor(color) {
    this.color = color;
  }
  getColor() {
    return this.color;
  }
  getTag() {
    return this.tag;
  }
  getValidMoves() {
    return this.validMoves;
  }
  setValidMoves(moves) {
    this.validMoves = moves;
  }
  getValidTakes() {
    return this.validTakes;
  }
  setValidTakes(takes) {
    this.validTakes = takes;
  }
  getDirection() {
    return this.direction;
  }


  ////////////////////////
  /// ABSTRACT METHODS ///
  ////////////////////////

  // puts moves in 'validMoves' and takes in 'takes'
  generateMoves() {
    throw new Error("generateMoves() must be implemented.")
  }

  direction() {
    switch (this.color) {
        case 'black':
            return 1;
        case 'white':
            return -1;
    }
}




}

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
    this.specialMoves = [];
    this.hasMoved = false;
    this.className;
    this.direction = this.direction();
  }


  ///////////////////////////
  /// SETTERS AND GETTERS ///
  ///////////////////////////

  
  // MOVED
  getMoved() {
    return this.hasMoved;
  }
  setMoved(bool) {
    this.hasMoved = bool;
  }

  // CLASSNAME
  getClassName() {
    return this.className;
  }

  //NAME
  getName() {
    return this.name;
  }

  // TEAM COLOR
  setColor(color) {
    this.color = color;
  }
  getColor() {
    return this.color;
  }

  // TAG
  getTag() {
    return this.tag;
  }

  // SPECIAL MOVES
  getSpecialMoves() {
    return this.specialMoves;
  }
  setSpecialMoves(moves) {
    this.specialMoves = moves;
  }

  // VALIDMOVES
  getValidMoves() {
    return this.validMoves;
  }
  setValidMoves(moves) {
    this.validMoves = moves;
  }

  // VALIDTAKES
  getValidTakes() {
    return this.validTakes;
  }
  setValidTakes(takes) {
    this.validTakes = takes;
  }

  // DIRECTION
  getDirection() {
    return this.direction;
  }


  ////////////////////////
  /// ABSTRACT METHODS ///
  ////////////////////////


  // GENERATE MOVES
  generateMoves() {
    throw new Error("generateMoves() must be implemented.")
  }

  // DIRECTION
  direction() {
    switch (this.color) {
        case 'black':
            return 1;
        case 'white':
            return -1;
    }
}




}
export default class GameState {
  constructor() {
    this.hoveredCell = null; // Нужно только для того, чтобы убирать выделение противника,
    // когда моего персонажа умертвят
    this.selectedChar = null;
    this.step = 'player';
    this.level = 0;
    this.blockField = false;
    this.score = 0; // Не понял про какие очки идет речь
    this.computerChars = [];
    this.playerChars = [];
  }

  get positionedCharacters() {
    return this.playerChars.concat(this.computerChars);
  }

  getPositionedCharacterByPosition(position) {
    return this.positionedCharacters.find(({ index }) => index === position);
  }

  passMove(value) {
    this.step = value;
  }

  deselect() {
    this.selectedChar = null;
  }

  get(title) {
    return this[title];
  }

  set(title, value) {
    this[title] = value;
  }

  nextLevel() {
    this.level += 1;
  }
}

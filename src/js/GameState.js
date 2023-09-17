export default class GameState {
  #hoveredCell = null;

  #selectedChar = null;

  #step = 'player';

  #level = 0;

  #blockField = false;

  #score = 0; // Не понимаю о каких баллах речь

  #computerChars = [];

  #playerChars = [];

  getPositionedCharacterByPosition(position) {
    return this.positionedCharacters.find(({ index }) => index === position);
  }

  passMove() {
    if (this.#step === 'player') {
      this.#step = 'computer';
      return;
    }

    this.#step = 'player';
  }

  deselect() {
    this.#selectedChar = null;
  }

  select(positionedCharacter) {
    this.#selectedChar = positionedCharacter;
  }

  hover(cell) {
    this.#hoveredCell = cell;
  }

  nextLevel() {
    this.#level += 1;
  }

  startNewGame(playerChars, computerChars) {
    this.#level = 0;
    this.#blockField = false;
    this.#playerChars = playerChars;
    this.#computerChars = computerChars;
  }

  loadGameData(res) {
    this.#blockField = res.blockField;
    this.#score = res.score;
    this.#computerChars = res.computerChars;
    this.#playerChars = res.playerChars;
    this.#level = res.level;
    this.#step = res.step;
    this.#selectedChar = null;
  }

  addNewEnemies(enemies) {
    this.#computerChars = enemies;
  }

  addNewPlayersCharacters(chars) {
    this.#playerChars = chars;
  }

  // getters
  get level() {
    return this.#level;
  }

  get playerChars() {
    return this.#playerChars;
  }

  get computerChars() {
    return this.#computerChars;
  }

  get blockField() {
    return this.#blockField;
  }

  get selectedChar() {
    return this.#selectedChar;
  }

  get hoveredCell() {
    return this.#hoveredCell;
  }

  get positionedCharacters() {
    return this.#playerChars.concat(this.#computerChars);
  }
}

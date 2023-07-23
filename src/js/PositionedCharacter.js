import Character from './Character';

export default class PositionedCharacter {
  constructor(character, row, column) {
    if (!(character instanceof Character)) {
      throw new Error('character must be instance of Character or its children');
    }

    if (typeof row !== 'number' || typeof column !== 'number') {
      throw new Error('position must be a number');
    }

    this.character = character;
    this.row = row;
    this.column = column;
    this.index = this.row * 8 + this.column;
  }
}

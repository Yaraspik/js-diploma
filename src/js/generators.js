import Team from './Team';
import PositionedCharacter from './PositionedCharacter';
import UpgradeCharacter from './UpgradeCharacter';

/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  while (true) {
    const randomTypeIndex = Math.floor(Math.random() * allowedTypes.length);
    const CharacterType = allowedTypes[randomTypeIndex];
    const level = Math.floor(Math.random() * maxLevel + 1);
    yield new CharacterType(level);
  }
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей.
 * Количество персонажей в команде - characterCount
 * */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const iterator = characterGenerator(allowedTypes, maxLevel);
  const characters = [];
  while (characters.length < characterCount) {
    const character = iterator.next().value;
    if (character.level !== 1) {
      UpgradeCharacter.create(character);
    }
    characters.push(character);
  }
  return new Team(characters);
}

export function* positionGenerator(boardSize, player) {
  while (true) {
    const row = Math.floor(Math.random() * boardSize);
    let column = Math.floor(Math.random() * 2);
    if (!player) {
      column = boardSize - 1 - column;
    }
    const id = Number(`${row}${column}`);
    const position = { row, column, id };
    yield position;
  }
}

export function generatePosition(characters, boardSize, player = false) {
  const iterator = positionGenerator(boardSize, player);
  const positionedCharacter = [];
  const closedPosition = new Set();

  for (const character of characters) {
    let position = iterator.next().value;
    while (closedPosition.has(position.id)) {
      position = iterator.next().value;
    }
    closedPosition.add(position.id);
    positionedCharacter.push(new PositionedCharacter(character, position.row, position.column));
  }

  return positionedCharacter;
}

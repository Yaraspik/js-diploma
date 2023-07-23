import { calcTileType } from '../utils';

test('get top-left type cell of the game field', () => {
  expect(calcTileType(0, 0, 8)).toBe('top-left');
});

test('get bottom-right type cell of the game field', () => {
  expect(calcTileType(7, 7, 8)).toBe('bottom-right');
});

test('get bottom-left type cell of the game field', () => {
  expect(calcTileType(7, 0, 8)).toBe('bottom-left');
});

test('get top-right type cell of the game field', () => {
  expect(calcTileType(0, 7, 8)).toBe('top-right');
});

test('get right type cell of the game field', () => {
  expect(calcTileType(4, 7, 8)).toBe('right');
});

test('get left type cell of the game field', () => {
  expect(calcTileType(4, 0, 8)).toBe('left');
});

test('get top type cell of the game field', () => {
  expect(calcTileType(0, 4, 8)).toBe('top');
});

test('get bottom type cell of the game field', () => {
  expect(calcTileType(7, 4, 8)).toBe('bottom');
});

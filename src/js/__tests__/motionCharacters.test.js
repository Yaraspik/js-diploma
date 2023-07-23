import Motion from '../Motion';
import Magician from '../characters/Magician';
import PositionedCharacter from '../PositionedCharacter';
import Daemon from '../characters/Daemon';

test('Motion for player', () => {
  const char = new Magician(1);
  const position = new PositionedCharacter(char, 0, 0);
  const smartCell = {
    row: 2,
    column: 2,
  };
  expect(Motion.getMotion(position, smartCell)).toEqual({
    canWalk: false,
    canAttack: true,
  });
});

test('Motion for computer', () => {
  const char = new Daemon(1);
  const position = new PositionedCharacter(char, 7, 7);
  const smartCell = {
    row: 6,
    column: 5,
  };
  expect(Motion.getMotion(position, smartCell)).toEqual({
    canWalk: false,
    canAttack: false,
  });
});

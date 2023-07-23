import Magician from '../characters/Magician';

test('Tooltip content must be correct', () => {
  const magician = new Magician(1);
  expect(`\u{1F396}${magician.level}\u{2694}${magician.attack}\u{1F6E1}${magician.defence}\u{2764}${magician.health}`)
    .toEqual('\u{1F396}1\u{2694}10\u{1F6E1}40\u{2764}50');
});

import { characterGenerator, generateTeam } from '../generators';
import Vampire from '../characters/Vampire';
import Undead from '../characters/Undead';
import Daemon from '../characters/Daemon';
import Magician from '../characters/Magician';
import Swordsman from '../characters/Swordsman';
import Bowman from '../characters/Bowman';

test('generateTeam create right count characters', () => {
  // TODO: Нужно ли как-то проверять аргумент AllowedTypes?
  const allowedTypes = [
    Vampire,
    Undead,
    Daemon,
    Magician,
    Swordsman,
    Bowman,
  ];
  const maxLevel = 3;
  const team = generateTeam(allowedTypes, maxLevel, 2);
  team.characters.forEach((element) => {
    expect(element.level).not.toBeGreaterThan(maxLevel);
  });
});

test('characterGenerator create infinity count characters', () => {
  // TODO: Нужно ли как-то проверять аргумент AllowedTypes?
  let i = 1;
  const arCharacters = [];
  const allowedTypes = [
    Vampire,
    Undead,
    Daemon,
    Magician,
    Swordsman,
    Bowman,
  ];
  while (i <= 50) {
    i += 1;
    arCharacters.push(characterGenerator(allowedTypes, 5));
  }
  expect(arCharacters).toHaveLength(50);
});

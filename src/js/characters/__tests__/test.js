import Bowman from '../Bowman';
import Daemon from '../Daemon';
import Magician from '../Magician';
import Swordsman from '../Swordsman';
import Undead from '../Undead';
import Vampire from '../Vampire';
import Character from '../../Character';

test('create new Character with class Character', () => {
  expect(() => new Character(1)).toThrow('Нельзя создавать персонажа из класса Character');
});

test('create new Character with class Bowman', () => {
  const bowman = new Bowman(1);
  expect(bowman).toEqual({
    attack: 25,
    defence: 25,
    health: 50,
    level: 1,
    type: 'bowman',
    stepRange: 2,
    attackRange: 2,
  });
});

test('create new Character with class Daemon', () => {
  const daemon = new Daemon(1);
  expect(daemon).toEqual({
    defence: 10,
    health: 50,
    level: 1,
    attack: 10,
    type: 'daemon',
    stepRange: 2,
    attackRange: 4,
  });
});

test('create new Character with class Magician', () => {
  const magician = new Magician(1);
  expect(magician).toEqual({
    attack: 10,
    defence: 40,
    health: 50,
    level: 1,
    type: 'magician',
    stepRange: 1,
    attackRange: 4,
  });
});

test('create new Character with class Swordsman', () => {
  const swordsman = new Swordsman(1);
  expect(swordsman).toEqual({
    attack: 40,
    defence: 10,
    health: 50,
    level: 1,
    type: 'swordsman',
    stepRange: 4,
    attackRange: 1,
  });
});

test('create new Character with class Undead', () => {
  const undead = new Undead(1);
  expect(undead).toEqual({
    attack: 40,
    defence: 10,
    health: 50,
    level: 1,
    type: 'undead',
    stepRange: 4,
    attackRange: 1,
  });
});

test('create new Character with class Vampire', () => {
  const vampire = new Vampire(1);
  expect(vampire).toEqual({
    attack: 25,
    defence: 25,
    health: 50,
    level: 1,
    type: 'vampire',
    stepRange: 2,
    attackRange: 2,
  });
});

import Character from '../Character';

export default class Magician extends Character {
  constructor(level) {
    super(level);
    this.defence = 40;
    this.attack = 10;
    this.type = 'magician';
    this.stepRange = 1;
    this.attackRange = 4;
  }
}

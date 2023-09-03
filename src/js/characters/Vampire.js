import Character from '../Character';

export default class Vampire extends Character {
  constructor(level) {
    super(level);
    this.attack = 25;
    this.defense = 25;
    this.type = 'vampire';
    this.stepRange = 2;
    this.attackRange = 2;
  }
}

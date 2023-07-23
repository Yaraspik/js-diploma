import Character from '../Character';

export default class Daemon extends Character {
  constructor(level) {
    super(level);
    this.defence = 10;
    this.attack = 10;
    this.type = 'daemon';
    this.stepRange = 2;
    this.attackRange = 4;
  }
}

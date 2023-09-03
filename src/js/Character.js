/**
 * Базовый класс, от которого наследуются классы персонажей
 * @property level - уровень персонажа, от 1 до 4
 * @property attack - показатель атаки
 * @property defense - показатель защиты
 * @property health - здоровье персонажа
 * @property type - строка с одним из допустимых значений:
 * swordsman
 * bowman
 * magician
 * daemon
 * undead
 * vampire
 */
export default class Character {
  constructor(level, type = 'generic') {
    this.level = level;
    this.health = 50;
    this.attack = 0;
    this.defense = 0;
    this.type = type;
    // TODO: выбросите исключение, если кто-то использует "new Character()"
    if (new.target.name === 'Character') {
      throw new Error('Нельзя создавать персонажа из класса Character');
    }
  }

  levelUp() {
    if (this.level < 4) {
      this.level += 1;
      this.attack = Math.floor(Math.max(this.attack, this.attack * (80 + this.health) * 0.01));
      this.defense = Math.floor(Math.max(this.defense, this.defense * (80 + this.health) * 0.01));
    }

    this.health += 80;
    if (this.health > 100) {
      this.health = 100;
    }
  }
}

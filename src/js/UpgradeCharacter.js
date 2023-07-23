export default class UpgradeCharacter {
  static upgrade(char) {
    let { health } = char.character;
    const { attack } = char.character;
    const { character } = char;

    health += 80;
    if (health > 100) {
      health = 100;
    }
    character.health = health;

    if (character.level < 4) {
      character.level += 1;
      const attackAfter = Math.floor(Math.max(attack, attack * health * 0.01));
      character.attack = attackAfter;
    }

    return character;
  }

  static create(char) {
    const character = char;
    let { health } = char;
    const { attack, level } = char;

    for (let i = 0; i < level; i += 1) {
      health += 80;
      if (health > 100) {
        health = 100;
      }
      const attackAfter = Math.floor(Math.max(attack, attack * health * 0.01));
      character.attack = attackAfter;
    }

    character.health = health;

    return character;
  }
}

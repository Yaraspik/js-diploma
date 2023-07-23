import Motion from './Motion';

export default class ArtificialIntelligence {
  static step(ctrl) {
    const { hoveredCell } = ctrl.gameState;
    const { computerChars, playerChars } = ctrl;
    const char = computerChars[Math.floor(Math.random() * computerChars.length)];
    const indexPlayerChars = playerChars.map((el) => el.index);
    const attackedCells = [];
    indexPlayerChars.forEach((index) => {
      const smartCell = ctrl.gamePlay.smartCell[index];
      const motion = Motion.getMotion(char, smartCell);
      if (motion.canAttack) {
        attackedCells.push(smartCell);
      }
    });

    if (attackedCells.length !== 0) {
      const attackedCell = attackedCells[Math.floor(Math.random() * attackedCells.length)];
      const { attack } = char.character;
      const playerChar = playerChars.find((el) => el.index === attackedCell.index);
      const defense = playerChar.character.defence;
      const damage = Math.max(attack - defense, attack * 0.1);
      ctrl.gamePlay.showDamage(attackedCell.index, damage)
        .then(() => {
          playerChar.character.health -= damage;
          if (playerChar.character.health <= 0) {
            if (hoveredCell) {
              ctrl.gamePlay.deselectCell(hoveredCell);
            }
            const indexPlayerChar = ctrl.playerChars.indexOf(playerChar);
            ctrl.playerChars.splice(indexPlayerChar, 1);
            const { selectedChar } = ctrl.gameState;
            if (selectedChar === playerChar) {
              ctrl.gameState.deselect();
              ctrl.gamePlay.deselectCell(playerChar.index);
            }
          }
          ctrl.gamePlay.redrawPositions(ctrl.playerChars, ctrl.computerChars);
        });
    } else {
      let emptyCell = false;
      let step = null;
      while (emptyCell === false) {
        const tempStep = Motion.createStep(char);
        const foundComputerChar = ctrl.computerChars.find((el) => el.index === tempStep.index);
        const foundPlayerChar = ctrl.playerChars.find((el) => el.index === tempStep.index);
        if (!foundComputerChar && !foundPlayerChar) {
          emptyCell = true;
          step = tempStep;
        }
      }
      ctrl.computerChars.map((el) => {
        const result = el;
        if (el.index === char.index) {
          result.row = step.row;
          result.column = step.column;
          result.index = step.index;
        }
        return result;
      });
      ctrl.gamePlay.redrawPositions(ctrl.playerChars, ctrl.computerChars);
    }
    ctrl.gameState.passMove('player');
  }
}

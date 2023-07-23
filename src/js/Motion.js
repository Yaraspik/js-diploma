export default class Motion {
  static getMotion(char, smartCell) {
    if (!char) {
      return false;
    }

    let canWalk = false;
    let canAttack = false;

    const { stepRange, attackRange } = char.character;
    const { row, column } = char;

    const stepRow = Math.abs(row - smartCell.row);
    const stepColumn = Math.abs(column - smartCell.column);

    const attackRow = Math.abs(row - smartCell.row);
    const attackColumn = Math.abs(column - smartCell.column);

    if (stepRow <= stepRange && stepColumn <= stepRange) {
      if (stepRow - stepColumn === 0 || smartCell.row === row || smartCell.column === column) {
        canWalk = true;
      }
    }

    if (attackRow <= attackRange && attackColumn <= attackRange) {
      if (attackRow - attackColumn === 0 || smartCell.row === row || smartCell.column === column) {
        canAttack = true;
      }
    }

    return {
      canWalk,
      canAttack,
    };
  }

  static createStep(char) {
    const { stepRange } = char.character;
    const { row, column } = char;

    const stepFromRow = row - stepRange < 0 ? 0 : row - stepRange;
    const stepToRow = row + stepRange > 7 ? 7 : row + stepRange;
    const stepFromColumn = column - stepRange < 0 ? 0 : column - stepRange;
    const stepToColumn = column + stepRange > 7 ? 7 : column + stepRange;

    let canWalk = false;
    let smartCell = null;
    while (canWalk === false) {
      const stepRow = Motion.getRandomIntInclusive(stepFromRow, stepToRow);
      const stepColumn = Motion.getRandomIntInclusive(stepFromColumn, stepToColumn);
      const stepIndex = stepRow * 8 + stepColumn;
      smartCell = {
        row: stepRow,
        column: stepColumn,
        index: stepIndex,
      };
      const motion = this.getMotion(char, smartCell);
      if (motion.canWalk) {
        canWalk = true;
      }
    }

    return smartCell;
  }

  static getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

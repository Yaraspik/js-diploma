/**
 * @todo
 * @param row - индекс поля в строке начиная с 0
 * @param column - индекс поля в столбце начиная с 0
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 * */
export function calcTileType(row, column, boardSize) {
  // TODO надо придумать что-то более элегантное
  let type = 'center';

  if (row === boardSize - 1) {
    type = 'bottom';
  }
  if (row === 0) {
    type = 'top';
  }
  if (column === 0) {
    type = 'left';
  }
  if (column === boardSize - 1) {
    type = 'right';
  }
  if (row === 0 && column === 0) {
    type = 'top-left';
  }
  if (row === boardSize - 1 && column === boardSize - 1) {
    type = 'bottom-right';
  }
  if (row === boardSize - 1 && column === 0) {
    type = 'bottom-left';
  }
  if (row === 0 && column === boardSize - 1) {
    type = 'top-right';
  }
  return type;
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}

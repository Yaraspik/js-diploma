import Swordsman from './characters/Swordsman';
import Bowman from './characters/Bowman';
import Magician from './characters/Magician';
import Daemon from './characters/Daemon';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';

import { generateTeam, generatePosition } from './generators';
import GamePlay from './GamePlay';
import GameState from './GameState';
import Motion from './Motion';
import themes from './themes';

import ArtificialIntelligence from './ArtificialIntelligence';
import UpgradeCharacter from './UpgradeCharacter';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameState = new GameState();
    this.playerChars = [];
    this.computerChars = [];
  }

  init() {
    const { boardSize } = this.gamePlay;

    const playerTypes = [Bowman, Swordsman, Magician];
    const playerTeam = generateTeam(playerTypes, 3, 4);
    this.playerChars = generatePosition(playerTeam.characters, boardSize, true);

    const computerTypes = [Daemon, Vampire, Undead];
    const computerTeam = generateTeam(computerTypes, 3, 4);
    this.computerChars = generatePosition(computerTeam.characters, boardSize);

    this.gamePlay.drawUi(themes[this.gameState.level]);
    this.gamePlay.redrawPositions(this.playerChars, this.computerChars);
    this.cellEnterHandler();
    this.cellLeaveHandler();
    this.cellClickHandler();
    this.btnSaveGameClickHandler();
    this.btnNewGameClickHandler();
    this.btnLoadGameClickHandler();
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  cellClickHandler() {
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
  }

  cellEnterHandler() {
    // TODO: нет автотестов
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
  }

  cellLeaveHandler() {
    // TODO: нет автотестов
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
  }

  btnSaveGameClickHandler() {
    this.gamePlay.addSaveGameListener(this.onBtnSaveGameClick.bind(this));
  }

  btnNewGameClickHandler() {
    this.gamePlay.addNewGameListener(this.onBtnNewGameClick.bind(this));
  }

  btnLoadGameClickHandler() {
    this.gamePlay.addLoadGameListener(this.onBtnLoadGameClick.bind(this));
  }

  onBtnNewGameClick() {
    const { boardSize } = this.gamePlay;

    const playerTypes = [Bowman, Swordsman, Magician];
    const playerTeam = generateTeam(playerTypes, 3, 4);
    this.playerChars = generatePosition(playerTeam.characters, boardSize, true);

    const computerTypes = [Daemon, Vampire, Undead];
    const computerTeam = generateTeam(computerTypes, 3, 4);
    this.computerChars = generatePosition(computerTeam.characters, boardSize);

    this.gameState.level = 0;
    this.gameState.blockField = false;
    this.gamePlay.drawUi(themes[this.gameState.level]);
    this.gamePlay.redrawPositions(this.playerChars, this.computerChars);
  }

  onBtnSaveGameClick() {
    this.gameState.computerChars = this.computerChars;
    this.gameState.playerChars = this.playerChars;
    this.stateService.save(this.gameState);
  }

  onBtnLoadGameClick() {
    const res = this.stateService.load();
    this.gameState.blockField = res.blockField;
    this.gameState.score = res.score;
    this.computerChars = res.computerChars;
    this.playerChars = res.playerChars;
    this.gameState.level = res.level;
    this.gameState.step = res.step;
    this.gameState.selectedChar = null;

    this.gamePlay.drawUi(themes[res.level]);
    this.gamePlay.redrawPositions(this.playerChars, this.computerChars);
  }

  onCellClick(index) {
    if (this.gameState.blockField === true) {
      return;
    }
    const { hoveredCell } = this.gameState;
    const playerChar = this.playerChars.find((el) => el.index === index);
    const computerChar = this.computerChars.find((el) => el.index === index);
    const { selectedChar } = this.gameState;

    if (playerChar) {
      if (selectedChar) {
        this.gamePlay.deselectCell(this.gameState.selectedChar.index);
      }
      this.gameState.selectedChar = playerChar;
      this.gamePlay.selectCell(this.gameState.selectedChar.index);
    }

    if (computerChar) {
      if (!selectedChar) {
        GamePlay.showError('Выбери своего персонажа');
      } else {
        const smartCell = this.gamePlay.smartCell[index];
        const motion = Motion.getMotion(selectedChar, smartCell);
        if (motion.canAttack === false) {
          GamePlay.showError('Ты не можешь его атаковать');
        } else {
          const { attack } = this.gameState.selectedChar.character;
          const defense = computerChar.character.defence;
          const damage = Math.max(attack - defense, attack * 0.1);
          this.gamePlay.showDamage(index, damage)
            .then(() => {
              computerChar.character.health -= damage;
              if (computerChar.character.health <= 0) {
                const indexComputerChar = this.computerChars.indexOf(computerChar);
                this.computerChars.splice(indexComputerChar, 1);
                this.gamePlay.redrawPositions(this.playerChars, this.computerChars);
                if (hoveredCell) {
                  this.gamePlay.deselectCell(hoveredCell);
                }
              } else {
                this.gamePlay.redrawPositions(this.playerChars, this.computerChars);
                this.gameState.passMove('computer');
                ArtificialIntelligence.step(this);
              }

              if (this.computerChars.length === 0) {
                if (this.gameState.level === 3) {
                  this.gameState.blockField = true;
                  this.gamePlay.deselectCell(this.gameState.selectedChar.index);
                } else {
                  const { boardSize } = this.gamePlay;
                  this.playerChars.map((element) => UpgradeCharacter.upgrade(element));
                  this.gameState.level += 1;

                  const computerTypes = [Daemon, Vampire, Undead];
                  const computerTeam = generateTeam(computerTypes, 3, 4);
                  this.computerChars = generatePosition(computerTeam.characters, boardSize);
                  const playerTeam = this.playerChars.map((el) => el.character);
                  this.playerChars = generatePosition(playerTeam, boardSize, true);

                  this.gamePlay.drawUi(themes[this.gameState.level]);

                  if (this.gameState.selectedChar) {
                    this.gamePlay.deselectCell(this.gameState.selectedChar.index);
                  }
                  this.gameState.deselect();
                  this.gamePlay.redrawPositions(this.playerChars, this.computerChars);
                }
              }
            });
        }
      }
    }

    if (!computerChar && !playerChar && selectedChar) {
      const smartCell = this.gamePlay.smartCell[index];
      const motion = Motion.getMotion(selectedChar, smartCell);
      if (motion.canWalk === false) {
        GamePlay.showError('Ты не можешь так сходить');
      } else {
        this.gamePlay.deselectCell(this.gameState.selectedChar.index);
        selectedChar.row = smartCell.row;
        selectedChar.column = smartCell.column;
        selectedChar.index = smartCell.index;
        this.gamePlay.selectCell(this.gameState.selectedChar.index);
        this.gamePlay.redrawPositions(this.playerChars, this.computerChars);
        this.gameState.passMove('computer');
        ArtificialIntelligence.step(this);
      }
    }
  }

  onCellEnter(index) {
    if (this.gameState.blockField) {
      this.gamePlay.setCursor('auto');
      return;
    }
    this.gameState.hoveredCell = index;
    const playerChar = this.playerChars.find((el) => el.index === index);
    const computerChar = this.computerChars.find((el) => el.index === index);
    const { selectedChar } = this.gameState;

    if (playerChar) {
      this.gamePlay.setCursor('pointer');
    } else {
      this.gamePlay.setCursor('auto');
    }

    if (selectedChar) {
      const smartCell = this.gamePlay.smartCell[index];
      const motion = Motion.getMotion(selectedChar, smartCell);

      if (motion.canWalk && !playerChar && !computerChar) {
        this.gamePlay.setCursor('pointer');
        this.gamePlay.selectCell(index, 'green');
      } else if (motion.canAttack && computerChar) {
        this.gamePlay.setCursor('crosshair');
        this.gamePlay.selectCell(index, 'red');
      } else if (playerChar) {
        this.gamePlay.setCursor('pointer');
      } else {
        this.gamePlay.setCursor('not-allowed');
      }
    }

    // Отображение характеристик персонажа
    if (playerChar) {
      const message = `🎖 ${playerChar.character.level} ⚔ ${playerChar.character.attack} 🛡 ${playerChar.character.defence} ❤ ${playerChar.character.health}`;
      this.gamePlay.showCellTooltip(message, index);
    } else if (computerChar) {
      const message = `🎖 ${computerChar.character.level} ⚔ ${computerChar.character.attack} 🛡 ${computerChar.character.defence} ❤ ${computerChar.character.health}`;
      this.gamePlay.showCellTooltip(message, index);
    }
  }

  onCellLeave(index) {
    const { selectedChar } = this.gameState;
    if (selectedChar && selectedChar.index !== index) {
      this.gamePlay.deselectCell(index);
    }
    this.gamePlay.hideCellTooltip(index);
  }
}

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

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameState = new GameState();
  }

  init() {
    this.startNewGame();

    this.cellEnterHandler();
    this.cellLeaveHandler();
    this.cellClickHandler();
    this.btnSaveGameClickHandler();
    this.btnNewGameClickHandler();
    this.btnLoadGameClickHandler();
  }

  cellClickHandler() {
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
  }

  cellEnterHandler() {
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
  }

  cellLeaveHandler() {
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

  startNewGame() {
    const { boardSize } = this.gamePlay;

    const playerTypes = [Bowman, Swordsman, Magician];
    const playerTeam = generateTeam(playerTypes, 3, 4);
    const playerChars = generatePosition(playerTeam.characters, boardSize, true);

    const computerTypes = [Daemon, Vampire, Undead];
    const computerTeam = generateTeam(computerTypes, 3, 4);
    const computerChars = generatePosition(computerTeam.characters, boardSize);

    this.gameState.startNewGame(playerChars, computerChars);

    this.gamePlay.drawUi(themes[this.gameState.level]);
    this.gamePlay.redrawPositions(this.gameState.positionedCharacters);
  }

  onBtnNewGameClick() {
    this.startNewGame();
  }

  onBtnSaveGameClick() {
    this.stateService.save(this.gameState.getData());
  }

  onBtnLoadGameClick() {
    const res = this.stateService.load();

    if (!res) {
      alert('Нет сохраненной игры');
      return;
    }

    this.gameState.loadGameData(res);
    this.gamePlay.drawUi(themes[this.gameState.level]);
    this.gamePlay.redrawPositions(this.gameState.positionedCharacters);
  }

  async onCellClick(index) {
    const { hoveredCell } = this.gameState;
    if (this.gameState.blockField === true) {
      return;
    }

    const { selectedChar } = this.gameState;
    const positionedCharacter = this.gameState.getPositionedCharacterByPosition(index);

    if (!positionedCharacter && !selectedChar) {
      GamePlay.showError('Выбери персонажа');
      return;
    }

    const smartCell = this.gamePlay.smartCell[index];
    const motion = Motion.getMotion(selectedChar, smartCell);

    if (positionedCharacter) {
      if (this.gameState.playerChars.find((el) => el.index === positionedCharacter.index)) {
        if (selectedChar) {
          this.gamePlay.deselectCell(this.gameState.selectedChar.index);
        }
        this.gameState.select(positionedCharacter);
        this.gamePlay.selectCell(this.gameState.selectedChar.index);
        return;
      }

      if (motion.canAttack === false) {
        GamePlay.showError('Ты не можешь его атаковать');
        return;
      }

      if (!selectedChar) {
        GamePlay.showError('Выбери персонажа');
        return;
      }

      const { attack } = this.gameState.selectedChar.character;
      const { defense } = positionedCharacter.character;
      const damage = Math.max(attack - defense, attack * 0.1);

      await this.gamePlay.showDamage(index, damage);

      positionedCharacter.character.health -= damage;
      if (positionedCharacter.character.health <= 0) {
        const indexComputerChar = this.gameState.computerChars.indexOf(positionedCharacter);
        this.gameState.computerChars.splice(indexComputerChar, 1);
        this.gamePlay.redrawPositions(this.gameState.positionedCharacters);
        if (hoveredCell) {
          this.gamePlay.deselectCell(hoveredCell);
        }
      } else {
        this.gamePlay.redrawPositions(this.gameState.positionedCharacters);
        this.gameState.passMove();
        ArtificialIntelligence.step(this);
      }

      if (this.gameState.computerChars.length === 0) {
        if (this.gameState.level === 3) {
          this.gameState.blockField = true;
          this.gamePlay.deselectCell(this.gameState.selectedChar.index);
        } else {
          const { boardSize } = this.gamePlay;
          this.gameState.playerChars.map((element) => element.character.levelUp());
          this.gameState.nextLevel();

          const computerTypes = [Daemon, Vampire, Undead];
          const computerTeam = generateTeam(computerTypes, 3, 4);
          const computerChars = generatePosition(computerTeam.characters, boardSize);
          this.gameState.addNewEnemies(computerChars);
          const playerTeam = this.gameState.playerChars.map((el) => el.character);
          const playerChars = generatePosition(playerTeam, boardSize, true);
          this.gameState.addNewPlayersCharacters(playerChars);

          this.gamePlay.drawUi(themes[this.gameState.level]);

          if (this.gameState.selectedChar) {
            this.gamePlay.deselectCell(this.gameState.selectedChar.index);
          }
          this.gameState.deselect();
          this.gamePlay.redrawPositions(this.gameState.positionedCharacters);
        }
      }
      return;
    }

    if (motion.canWalk === false) {
      GamePlay.showError('Ты не можешь так сходить');
      return;
    }

    this.gamePlay.deselectCell(this.gameState.selectedChar.index);
    selectedChar.row = smartCell.row;
    selectedChar.column = smartCell.column;
    selectedChar.index = smartCell.index;
    this.gamePlay.selectCell(this.gameState.selectedChar.index);
    this.gamePlay.redrawPositions(this.gameState.positionedCharacters);
    this.gameState.passMove('computer');
    ArtificialIntelligence.step(this);
  }

  onCellEnter(index) {
    this.gameState.hover(index);

    // Если игра окончена, то поле блокируется
    if (this.gameState.blockField) {
      return;
    }

    const { selectedChar } = this.gameState;
    const positionedCharacter = this.gameState.getPositionedCharacterByPosition(index);

    if (!selectedChar && !positionedCharacter) {
      return;
    }

    const smartCell = this.gamePlay.smartCell[index];
    const motion = Motion.getMotion(selectedChar, smartCell);

    // Отображение характеристик персонажа
    if (positionedCharacter) {
      const message = `🎖 ${positionedCharacter.character.level} ⚔ ${positionedCharacter.character.attack} 🛡 ${positionedCharacter.character.defense} ❤ ${positionedCharacter.character.health}`;
      this.gamePlay.showCellTooltip(message, index);

      if (this.gameState.playerChars.find((el) => el.index === positionedCharacter.index)) {
        this.gamePlay.setCursor('pointer');
        return;
      }

      if (motion.canAttack) {
        this.gamePlay.setCursor('crosshair');
        this.gamePlay.selectCell(index, 'red');
        return;
      }

      this.gamePlay.setCursor('not-allowed');
      return;
    }

    if (motion.canWalk) {
      this.gamePlay.setCursor('pointer');
      this.gamePlay.selectCell(index, 'green');
      return;
    }

    this.gamePlay.setCursor('not-allowed');
  }

  onCellLeave(index) {
    const { selectedChar } = this.gameState;
    if (selectedChar && selectedChar.index !== index) {
      this.gamePlay.deselectCell(index);
    }
    this.gamePlay.hideCellTooltip(index);
    this.gamePlay.setCursor('auto');
  }
}

import { PuzzleEngine } from '../../engine/PuzzleEngine.js';
import { MISTBANE_1_DATA } from '../../data/Mistbane.js';

export default class Mistbane_1 extends Phaser.Scene {
  constructor() {
    super('Mistbane_1');
  }

  preload() {
    // Load any assets you want here (basic for now)
    this.load.image('elbow-block', '/assets/images/ruin_blocks/elbow_block.png');
    this.load.image('crystal_white', 'assets/images/ruin_blocks/crystal_white.png');
    this.load.image('solid_block', 'assets/images/ruin_blocks/solid_block.png');
  }

  create() {

    this.input.mouse.disableContextMenu();
    // Add title or flavor text
    this.add.text(this.scale.width / 2, 40, 'Mistbane: Puzzle 1', {
      fontSize: '24px',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.add.text(this.scale.width / 2, 70, '“Magic flows. Stones guide it. Use them wisely.”', {
      fontSize: '16px',
      color: '#bbbbbb',
    }).setOrigin(0.5);

    // Initialize puzzle engine
    this.puzzle = new PuzzleEngine(this, {
      gridSize: 5,
      tileSize: 80,
      levelData: MISTBANE_1_DATA,
    });

    this.puzzle.createGrid();
  }
}

export default class LevelSelectScene extends Phaser.Scene {
    constructor() {
      super('LevelSelectScene');
      this.tiles = [];
      this.labels = [];
      this.flasks = [];
      
      this.levels = [
        { potion: 'Mistbane', unlocked: true, completed: [true, false, false] },
        { potion: 'Fire Breath', unlocked: false },
        { potion: 'Levitation', unlocked: false },
        { potion: 'Night Vision', unlocked: false },
        { potion: 'Teleportation', unlocked: false },
        { potion: 'Water Walking', unlocked: false },
      ];
    }
  
    preload() {
      this.load.image('tile', '/assets/images/level_tile.png');
      this.load.image('lock', '/assets/images/lock_icon.png');
      this.load.image('flask_empty', '/assets/images/empty_flask.png');
      this.load.image('flask_full', '/assets/images/full_flask.png');
    }

    showSublevelPopup(levelIndex) {
      const level = this.levels[levelIndex];
      const { width, height } = this.scale;
    
      // Dim background
      const dimmer = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.6)
        .setDepth(10)
        .setInteractive(); // prevent clicks underneath
    
      // Popup container
      const popup = this.add.container(width / 2, height / 2).setDepth(11);
    
      const bg = this.add.rectangle(0, 0, 300, 200, 0x222222)
        .setStrokeStyle(2, 0xffffff)
        .setOrigin(0.5);
    
      const title = this.add.text(0, -80, level.potion, {
        fontSize: '20px',
        color: '#ffffff'
      }).setOrigin(0.5);
    
      popup.add([bg, title]);
    
      // Add 3 sublevel tiles
      const spacing = 90;
      level.completed.forEach((status, i) => {
        const x = (i - 1) * spacing;
    
        const rect = this.add.rectangle(x, 0, 60, 60, 0x444444).setOrigin(0.5);
        const text = this.add.text(x, 0, `${i + 1}`, {
          fontSize: '18px',
          color: '#ffffff'
        }).setOrigin(0.5);
    
        const sceneKey = `${level.potion.replace(/\s/g, '')}_${i + 1}`;

          if (status === true) {
            rect.setFillStyle(0x88cc88); // completed
            rect.setInteractive().on('pointerdown', () => {
              this.scene.start(sceneKey); // Allow replay
            });
          } else if (i === 0 || level.completed[i - 1] === true) {
            rect.setFillStyle(0xcccc88); // available
            rect.setInteractive().on('pointerdown', () => {
              this.scene.start(sceneKey);
            });
          } else {
            rect.setFillStyle(0x666666); // locked
            // no interaction
          }

    
        popup.add([rect, text]);
      });
    
      // Close button
      const closeBtn = this.add.text(0, 80, 'Close', {
        fontSize: '16px',
        color: '#ff8888',
        backgroundColor: '#000000',
        padding: { x: 10, y: 4 }
      }).setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => {
          dimmer.destroy();
          popup.destroy();
        });
    
      popup.add(closeBtn);
    }
    
  
    create() {
        const { width, height } = this.scale;

            this.header = this.add.text(width / 2, 60, 'Level Select', {
            fontFamily: "Garamond",
            fontSize: '52px',
            color: '#ffffff',
            stroke: '#6a3ea1',
            strokeThickness: 4,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 4,
                fill: true
            }
            }).setOrigin(0.5);
          
  
      const columns = 4;
      const rows = 2;
  
      for (let i = 0; i < columns * rows; i++) {
        const level = this.levels[i];
        const tile = this.add.image(0, 0, 'tile');
        const label = this.add.text(0, 0, level?.potion || '', {
          font: '16px Arial',
          fill: '#ffffff'
        }).setOrigin(0.5);
  
        if (level?.unlocked) {
          tile.setInteractive().on('pointerdown', () => {
            this.showSublevelPopup(i); 
          });
  
          if (level.completed) {
            const flaskRow = [];
            level.completed.forEach((done) => {
              const flaskType = done ? 'flask_full' : 'flask_empty';
              const flask = this.add.image(0, 0, flaskType);
              flaskRow.push(flask);
              this.flasks.push(flask);
            });
            tile._flasks = flaskRow;
          }
        } else {
          tile.setAlpha(0.25);
          tile._lock = this.add.image(0, 0, 'lock').setScale(0.1);
        }
  
        this.tiles.push(tile);
        this.labels.push(label);
      }
  
      this.collectionButton = this.add.text(0, 0, 'Collection', {
        font: '18px Arial',
        fill: '#ffffff',
        backgroundColor: '#3388ff',
        padding: 6
      }).setOrigin(0.5);
  
      this.achievementsButton = this.add.text(0, 0, 'Achievements', {
        font: '18px Arial',
        fill: '#ffffff',
        backgroundColor: '#3388ff',
        padding: 6
      }).setOrigin(0.5);
  
      this.scale.on('resize', this.resizeScene, this);
      this.resizeScene({ width: this.scale.width, height: this.scale.height });
    }
  
    resizeScene(gameSize) {
      const { width, height } = gameSize;
  
      this.header.setPosition(width / 2, 60);
  
      const columns = 4;
      const rows = 2;
  
      // 🔧 Proportional scaling based on screen size
      const baseTileScale = 0.22;
      const baseWidth = 1280;
      const baseHeight = 720;
      const scaleFactor = Math.min(width / baseWidth, height / baseHeight);
  
      const tileScale = baseTileScale * scaleFactor;
      const tileSize = 260 * tileScale;
      const spacingX = tileSize + 200 * scaleFactor;
      const spacingY = tileSize + 200 * scaleFactor;
  
      const gridWidth = spacingX * (columns - 1);
      const gridHeight = spacingY * (rows - 1);
      const startX = width / 2 - gridWidth / 2;
      const startY = height / 2 - gridHeight / 2 + 20 * scaleFactor;
  
      this.tiles.forEach((tile, index) => {
        const col = index % columns;
        const row = Math.floor(index / columns);
        const x = startX + col * spacingX;
        const y = startY + row * spacingY;
  
        tile.setPosition(x, y).setScale(tileScale);
  
        const label = this.labels[index];
        label.setPosition(x, y - tileSize / 2 - 22 * scaleFactor)
          .setFontSize(Math.round(16 * scaleFactor));
  
        if (tile._lock) {
          tile._lock.setPosition(x, y).setScale(0.1 * scaleFactor);
        }
  
        if (tile._flasks) {
          const flaskSpacing = 50 * scaleFactor;
          const totalWidth = (tile._flasks.length - 1) * flaskSpacing;
          const flaskY = y + tileSize / 2 + 5 * scaleFactor;
  
          tile._flasks.forEach((flask, i) => {
            flask.setPosition(x - totalWidth / 2 + i * flaskSpacing, flaskY);
            flask.setScale(0.07 * scaleFactor);
          });
        }
      });
  
      this.collectionButton.setPosition(width * 0.25, height - 40);
      this.achievementsButton.setPosition(width * 0.75, height - 40);
    }
  }
  
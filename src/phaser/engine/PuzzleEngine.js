export class PuzzleEngine {
    constructor(scene, config) {
      this.scene = scene;
      this.gridSize = config.gridSize || 5;
      this.tileSize = config.tileSize || 80;
      this.levelData = config.levelData || {};
      this.grid = [];
      this.placedBlocks = [];
      this.inventoryBlocks = [];
    }
  
    destroy() {
      this.placedBlocks.forEach(block => block.destroy());
      this.placedBlocks = [];
  
      this.inventoryBlocks.forEach(block => block.destroy());
      this.inventoryBlocks = [];
    }
  
    getSymbol(type, rotation) {
      if (type === 'straight') {
        return rotation % 2 === 0 ? '↔' : '↕';
      } else if (type === 'elbow') {
        return ['↱', '↳', '↲', '↰'][rotation % 4];
      }
      return '?';
    }
  
    createInventory() {
      const { inventory } = this.levelData;
      if (!inventory || inventory.length === 0) return;
  
      const inventoryY = this.scene.scale.height - 80;
      const centerX = this.scene.scale.width / 2;
      const spacing = 100;
  
      inventory.forEach((item, index) => {
        for (let i = 0; i < item.quantity; i++) {
          const x = centerX + (index * spacing) + (i * 30) - 50;
  
          const symbol = this.getSymbol(item.type, 0);
          const block = this.scene.add.text(x, inventoryY, symbol, {
            fontSize: '32px',
            color: '#ffffff',
          })
            .setOrigin(0.5)
            .setInteractive({ draggable: true })
            .setData('type', item.type)
            .setData('rotation', 0);
  
          this.inventoryBlocks.push(block);
          this.scene.input.setDraggable(block);
  
          block.on('pointerdown', (pointer) => {
            if (pointer.rightButtonDown()) {
              const newRot = (block.getData('rotation') + 1) % 4;
              block.setData('rotation', newRot);
              block.setAngle(newRot * 90);
              block.setText(this.getSymbol(block.getData('type'), newRot));
            }
          });
  
          block.on('dragend', (pointer) => {
            const dropX = pointer.worldX;
            const dropY = pointer.worldY;
  
            for (let row of this.grid) {
              for (let cell of row) {
                const bounds = cell.tile.getBounds();
                if (Phaser.Geom.Rectangle.Contains(bounds, dropX, dropY)) {
                  if (cell.isBlocked) return;
  
                  if (cell.block) {
                    cell.block.destroy();
                    this.placedBlocks = this.placedBlocks.filter(b => b !== cell.block);
                  }
  
                  const rot = block.getData('rotation');
                  const symbol = this.getSymbol(item.type, rot);
  
                  const placed = this.scene.add.text(
                    cell.tile.x,
                    cell.tile.y,
                    symbol,
                    {
                      fontSize: '32px',
                      color: '#ffffff',
                    }
                  ).setOrigin(0.5)
                    .setInteractive({ draggable: true });
  
                  placed.setData('type', item.type);
                  placed.setData('rotation', rot);
                  placed.rotationValue = rot;
                  placed.type = item.type;
                  placed.setAngle(rot * 90);

                  placed.gridCell = cell;
  
                  this.placedBlocks.push(placed);
                  this.scene.input.setDraggable(placed);
  
                  placed.on('pointerdown', (pointer) => {
                    if (pointer.rightButtonDown()) {
                      placed.rotationValue = (placed.rotationValue + 1) % 4;
                      placed.setAngle(placed.rotationValue * 90);
                      placed.setText(this.getSymbol(placed.type, placed.rotationValue));
                  
                      // ✅ Fix: Update hit area to ensure it's still clickable
                      const w = placed.width;
                      const h = placed.height;
                      placed.setInteractive(
                        new Phaser.Geom.Rectangle(-w / 2, -h / 2, w, h),
                        Phaser.Geom.Rectangle.Contains
                      );
                  
                      if (placed.gridCell) {
                        placed.gridCell.rotation = placed.rotationValue;
                      }
                  
                      this.propagateMagic(this.levelData.source.x, this.levelData.source.y, 'right');
                    }
                  });
                  
  
                  placed.on('drag', (pointer, dragX, dragY) => {
                    placed.x = dragX;
                    placed.y = dragY;
                  });
  
                  placed.on('dragend', (pointer) => {
                    const dropX = pointer.worldX;
                    const dropY = pointer.worldY;
  
                    for (let row of this.grid) {
                      for (let dest of row) {
                        const bounds = dest.tile.getBounds();
                        if (Phaser.Geom.Rectangle.Contains(bounds, dropX, dropY)) {
                          if (dest.isBlocked) return;
  
                          for (let row of this.grid) {
                            for (let c of row) {
                              if (c.block === placed) c.block = null;
                            }
                          }
  
                          placed.setPosition(dest.tile.x, dest.tile.y);
                          dest.block = placed;
                          dest.rotation = placed.rotationValue;
                          dest.type = placed.type;
  
                          this.propagateMagic(this.levelData.source.x, this.levelData.source.y, 'right');
                          return;
                        }
                      }
                    }
                  });
  
                  cell.block = placed;
                  cell.rotation = rot;
                  cell.type = item.type;
  
                  block.destroy();
                  this.inventoryBlocks = this.inventoryBlocks.filter(b => b !== block);
  
                  this.propagateMagic(this.levelData.source.x, this.levelData.source.y, 'right');
                  return;
                }
              }
            }
          });
        }
      });
    }
  
    createGrid() {
      const offsetX = this.scene.scale.width / 2 - (this.gridSize * this.tileSize) / 2;
      const offsetY = this.scene.scale.height / 2 - (this.gridSize * this.tileSize) / 2 - 40;
      const blockers = this.levelData.blockers || [];
  
      for (let y = 0; y < this.gridSize; y++) {
        this.grid[y] = [];
        for (let x = 0; x < this.gridSize; x++) {
          const isBlocked = blockers.some(b => b.x === x && b.y === y);
          const color = isBlocked ? 0x222222 : 0x444444;
  
          const tile = this.scene.add.rectangle(
            offsetX + x * this.tileSize,
            offsetY + y * this.tileSize,
            this.tileSize - 2,
            this.tileSize - 2,
            color
          ).setStrokeStyle(2, 0x888888);
  
          if (isBlocked) {
            this.scene.add.text(tile.x, tile.y, 'X', {
              fontSize: '18px',
              color: '#ff5555'
            }).setOrigin(0.5);
          }
  
          this.grid[y][x] = {
            tile,
            x,
            y,
            block: null,
            rotation: 0,
            type: null,
            isBlocked,
          };
        }
      }
  
      this.loadLevelData();
      this.createInventory();
    }
  
    loadLevelData() {
      const { source, rune, blocks } = this.levelData;
  
      if (source) this.placeSpecialTile(source.x, source.y, 'source');
      if (rune) this.placeSpecialTile(rune.x, rune.y, 'rune');
  
      if (blocks && Array.isArray(blocks)) {
        blocks.forEach((b) => {
          this.placeBlock(b.x, b.y, b.type, b.rotation || 0);
        });
      }
  
      this.propagateMagic(this.levelData.source.x, this.levelData.source.y, 'right');
    }
  
    placeSpecialTile(x, y, type) {
      const center = this.grid[y][x].tile;
      const label = type === 'source' ? 'S' : 'R';
  
      this.scene.add.text(center.x, center.y, label, {
        fontSize: '20px',
        color: '#ffffff',
      }).setOrigin(0.5);
  
      this.grid[y][x].type = type;
    }
  
    placeBlock(x, y, type, rotation) {
      const cell = this.grid[y][x];
      const symbol = this.getSymbol(type, rotation);
  
      const block = this.scene.add.text(
        cell.tile.x,
        cell.tile.y,
        symbol,
        {
          fontSize: '32px',
          color: '#ffffff',
        }
      ).setOrigin(0.5).setInteractive();
  
      block.rotationValue = rotation;
      block.type = type;
      block.setAngle(rotation * 90);
  
      block.on('pointerdown', () => {
        block.rotationValue = (block.rotationValue + 1) % 4;
        block.setAngle(block.rotationValue * 90);
        block.setText(this.getSymbol(block.type, block.rotationValue));
        this.grid[y][x].rotation = block.rotationValue;
        this.propagateMagic(this.levelData.source.x, this.levelData.source.y, 'right');
      });
  
      this.placedBlocks.push(block);
  
      cell.block = block;
      cell.rotation = rotation;
      cell.type = type;
    }
  
    propagateMagic(startX, startY, sourceDirection) {
      for (let row of this.grid) {
        for (let cell of row) {
          if (!cell.isBlocked) {
            cell.tile.setFillStyle(0x444444);
          }
        }
      }
  
      const visited = new Set();
  
      const dfs = (x, y, incomingDir) => {
        if (x < 0 || y < 0 || x >= this.gridSize || y >= this.gridSize) return;
  
        const key = `${x},${y}`;
        if (visited.has(key)) return;
        visited.add(key);
  
        const cell = this.grid[y][x];
        if (cell.isBlocked) return;
  
        if (cell.type === 'rune') {
          cell.tile.setFillStyle(0xffffcc);
          console.log('Rune activated!');
          return;
        } else {
          cell.tile.setFillStyle(0x228822);
        }
  
        let exits = [];
  
        if (cell.type === 'source') {
          exits = [sourceDirection];
        } else if (cell.block) {
          exits = this.getExitDirs(cell.type, cell.rotation, incomingDir);
        } else {
          return;
        }
  
        for (const dir of exits) {
          const [dx, dy] = this.dirToOffset(dir);
          dfs(x + dx, y + dy, this.reverseDir(dir));
        }
      };
  
      dfs(startX, startY, null);
    }
  
    getExitDirs(type, rotation, incomingDir) {
      if (type === 'straight') {
        const dirs = [
          ['left', 'right'],
          ['up', 'down'],
        ];
        return dirs[rotation % 2].includes(incomingDir) ? [this.reverseDir(incomingDir)] : [];
      } else if (type === 'elbow') {
        const dirPairs = [
          ['up', 'right'],
          ['right', 'down'],
          ['down', 'left'],
          ['left', 'up'],
        ];
        const [d1, d2] = dirPairs[rotation % 4];
        return (incomingDir === d1 || incomingDir === d2) ? [incomingDir === d1 ? d2 : d1] : [];
      }
      return [];
    }
  
    dirToOffset(dir) {
      switch (dir) {
        case 'up': return [0, -1];
        case 'down': return [0, 1];
        case 'left': return [-1, 0];
        case 'right': return [1, 0];
      }
    }
  
    reverseDir(dir) {
      switch (dir) {
        case 'up': return 'down';
        case 'down': return 'up';
        case 'left': return 'right';
        case 'right': return 'left';
      }
    }
  }
  
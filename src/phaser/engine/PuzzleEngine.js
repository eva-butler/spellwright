
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

    createInventory() {
      const { inventory } = this.levelData;
      if (!inventory || inventory.length === 0) return;

      const inventoryY = this.scene.scale.height - 80;
      const centerX = this.scene.scale.width / 2;
      const spacing = 100;

      inventory.forEach((item, index) => {
        for (let i = 0; i < item.quantity; i++) {
          const x = centerX + (index * spacing) + (i * 30) - 50;

          const block = this.scene.add.image(x, inventoryY, 'elbow-block')
            .setOrigin(0.5)
            .setScale(0.1)
            .setInteractive({ useHandCursor: true })
            .setData('type', item.type)
            .setData('rotation', 0);

          this.inventoryBlocks.push(block);
          this.scene.input.setDraggable(block);

          block.on('pointerdown', () => {
              const newRot = (block.getData('rotation') + 1) % 4;
              block.setData('rotation', newRot);
              block.setAngle(newRot * 90);
          });

          block.on('dragend', (pointer) => {
            const dropX = pointer.worldX;
            const dropY = pointer.worldY;

            for (let row of this.grid) {
              for (let cell of row) {
                const bounds = cell.tile.getBounds();
                if (Phaser.Geom.Rectangle.Contains(bounds, dropX, dropY)) {
                    if (cell.isBlocked || cell.type === 'source') {
                        block.setPosition(x, inventoryY); // return to inventory row
                        this.showWarning("This is a blocked tile! Place your tile somewhere else!");
                        return;
                      }
                      

                  if (cell.block) {
                    cell.block.destroy();
                    this.placedBlocks = this.placedBlocks.filter(b => b !== cell.block);
                  }

                  const rot = block.getData('rotation');

                  const placed = this.scene.add.image(cell.tile.x, cell.tile.y, 'elbow-block')
                    .setOrigin(0.5)
                    .setScale(0.1)
                    .setInteractive({ draggable: true });

                  placed.setData('type', item.type);
                  placed.setData('rotation', rot);
                  placed.rotationValue = rot;
                  placed.type = item.type;
                  placed.setAngle(rot * 90);
                  placed.gridCell = cell;

                  this.placedBlocks.push(placed);
                  this.scene.input.setDraggable(placed);

                  placed.on('pointerdown', () => {
                    
                      placed.rotationValue = (placed.rotationValue + 1) % 4;
                      placed.setAngle(placed.rotationValue * 90);
                      if (placed.gridCell) {
                        placed.gridCell.rotation = placed.rotationValue;
                      }
                      this.propagateMagic(this.levelData.source.x, this.levelData.source.y, 'right');
                    
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
                            if (dest.isBlocked || dest.type === 'source') {
                                this.showWarning("This is a blocked tile! Place your tile somewhere else!");
                                placed.setPosition(placed.gridCell.tile.x, placed.gridCell.tile.y); // snap back
                                return;
                              }
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
      
          // Build the cell first
          const cell = {
            tile,
            x,
            y,
            block: null,
            rotation: 0,
            type: null,
            isBlocked,
          };
      
          // Then add the image *after* the cell exists
          if (isBlocked) {
            const solid = this.scene.add.image(tile.x, tile.y, 'solid_block')
              .setOrigin(0.5)
              .setScale(0.1); // match your tile scale
            cell.block = solid;
          }
      
          this.grid[y][x] = cell;
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
        const cell = this.grid[y][x];
        cell.type = type;
      
        if (type === 'rune') {
          const crystal = this.scene.add.image(cell.tile.x, cell.tile.y, 'crystal_white')
            .setOrigin(0.5)
            .setScale(0.1); // adjust scale as needed
          cell.block = crystal; // store it if you want to manage it later
        }
      
        if (type === 'source') {
            const source = this.scene.add.image(cell.tile.x, cell.tile.y, 'magic_source')
              .setOrigin(0.5)
              .setScale(0.1)
              .setAngle(-90); // counter-clockwise 90 degrees
            cell.block = source;
          }
      }

    placeBlock(x, y, type, rotation) {
      const cell = this.grid[y][x];

      const block = this.scene.add.image(cell.tile.x, cell.tile.y, 'elbow-block')
        .setOrigin(0.5)
        .setScale(0.1)
        .setInteractive({ useHandCursor: true });

      block.rotationValue = rotation;
      block.type = type;
      block.setAngle(rotation * 90);

      block.on('pointerdown', () => {
        
          let newRotation = (block.rotationValue + 1) % 4;
          block.rotationValue = newRotation;
          block.setAngle(block.rotationValue * 90);
          this.grid[y][x].rotation = block.rotationValue;
          this.propagateMagic(this.levelData.source.x, this.levelData.source.y, 'right');
        
      });

      this.placedBlocks.push(block);
      cell.block = block;
      cell.rotation = rotation;
      cell.type = type;
    }

    propagateMagic(startX, startY) {
        // Reset all non-blocked tiles to dark blue
        for (let row of this.grid) {
          for (let cell of row) {
            if (!cell.isBlocked) {
              // Dark dark blue (e.g., RGB #0A0A33)
              cell.tile.setFillStyle(0x0A0A33);
            }
          }
        }
      
        const visited = new Set();
      
        const spread = (x, y, fromDirection = null, dir = null) => {
          if (x < 0 || y < 0 || x >= this.gridSize || y >= this.gridSize) return;
      
          const key = `${x},${y}`;
          if (visited.has(key)) return;
          visited.add(key);
      
          const cell = this.grid[y][x];
          if (cell.isBlocked) return;
      
          // Light blue for lit tiles (e.g., RGB #ADD8E6)
          cell.tile.setFillStyle(0xADD8E6);
      
          if (cell.type === 'rune') {
            console.log('Rune activated!');
          }
      
          let accessPoints = [];
      
          if (cell.type === 'source') {
            const outputDir = this.levelData.source.dir;
            const [dx, dy] = this.dirToOffset(outputDir);
            spread(x + dx, y + dy, this.reverseDir(outputDir), outputDir);
            return;
          }
      
          if (cell.block) {
            accessPoints = this.getAccessPoints(cell.type, cell.rotation);
            if (fromDirection && !accessPoints.includes(fromDirection)) return;
      
            const nextDirs = accessPoints.filter(d => d !== this.reverseDir(fromDirection));
            for (const nextDir of nextDirs) {
              const [dx, dy] = this.dirToOffset(nextDir);
              spread(x + dx, y + dy, this.reverseDir(nextDir), nextDir);
            }
          } else if (cell.type === 'rune') {
            if (dir) {
              const [dx, dy] = this.dirToOffset(dir);
              spread(x + dx, y + dy, this.reverseDir(dir), dir);
            }
          } else {
            if (dir) {
              const [dx, dy] = this.dirToOffset(dir);
              spread(x + dx, y + dy, this.reverseDir(dir), dir);
            }
          }
        };
      
        spread(startX, startY, null, null);
      }
      
      

      getAccessPoints(type, rotation) {
        if (type === 'straight') {
          return rotation % 2 === 0 ? ['west', 'east'] : ['north', 'south'];
        } else if (type === 'elbow') {
          const pairs = [['north', 'east'], ['east', 'south'], ['south', 'west'], ['west', 'north']];
          return pairs[rotation % 4];
        }
        return [];
      }
      

      dirToOffset(dir) {
        switch (dir) {
          case 'north': return [0, -1];
          case 'south': return [0, 1];
          case 'west': return [-1, 0];
          case 'east': return [1, 0];
        }
      }
      
      reverseDir(dir) {
        switch (dir) {
          case 'north': return 'south';
          case 'south': return 'north';
          case 'west': return 'east';
          case 'east': return 'west';
        }
      }

      showWarning(message) {
        const existing = this.scene.children.getByName('warning-text');
        if (existing) existing.destroy();
      
        const warning = this.scene.add.text(this.scene.scale.width / 2, this.scene.scale.height - 120, message, {
          fontSize: '18px',
          color: '#ff5555',
          backgroundColor: '#1e1e1e',
          padding: { x: 12, y: 6 },
        }).setOrigin(0.5).setName('warning-text');
      
        this.scene.time.delayedCall(2500, () => {
          warning.destroy();
        });
      }
      
      
}

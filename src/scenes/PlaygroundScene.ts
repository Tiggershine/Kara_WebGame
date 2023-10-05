import Phaser from 'phaser';

export default class PlaygroundScene extends Phaser.Scene {
  constructor() {
    super('PlaygroundScene');
  }

  // Values for style
  private container = {
    size: 500,
    borderRadius: 10,
    backgroundColor: 0xfcf6f5,
  };
  private tile = {
    size: 50,
    lineWidth: 1,
    lineColor: 0x2bae66,
    lineColorAlpha: 128 / 255,
  };

  create() {
    // Set position of the Scene
    this.cameras.main.setViewport(30, 90, 500, 500);

    // Container Object
    const containerGraphics = this.add.graphics({
      fillStyle: { color: this.container.backgroundColor },
    });
    containerGraphics.fillRoundedRect(
      0,
      0,
      this.container.size,
      this.container.size,
      this.container.borderRadius
    );

    // Tile Object
    const tileGraphics = this.add.graphics({
      lineStyle: {
        width: this.tile.lineWidth,
        color: this.tile.lineColor,
        alpha: this.tile.lineColorAlpha,
      },
    });
    for (let i = 1; i < 10; i++) {
      tileGraphics.lineBetween(
        i * this.tile.size,
        0,
        i * this.tile.size,
        this.container.size
      ); // Vertical line
      tileGraphics.lineBetween(
        0,
        i * this.tile.size,
        this.container.size,
        i * this.tile.size
      ); // Horizontal line
    }
  }
}

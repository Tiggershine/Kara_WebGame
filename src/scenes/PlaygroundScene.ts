import Phaser from 'phaser';

export default class PlaygroundScene extends Phaser.Scene {
  constructor() {
    super('PlaygroundScene');
  }

  // Values for Style
  private containerStyle = {
    size: 500,
    borderRadius: 10,
    backgroundColor: 0xfcf6f5,
  };
  private tileStyle = {
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
      fillStyle: { color: this.containerStyle.backgroundColor },
    });
    containerGraphics.fillRoundedRect(
      0,
      0,
      this.containerStyle.size,
      this.containerStyle.size,
      this.containerStyle.borderRadius
    );

    // Tile Object
    const tileGraphics = this.add.graphics({
      lineStyle: {
        width: this.tileStyle.lineWidth,
        color: this.tileStyle.lineColor,
        alpha: this.tileStyle.lineColorAlpha,
      },
    });
    for (let i = 1; i < 10; i++) {
      tileGraphics.lineBetween(
        i * this.tileStyle.size,
        0,
        i * this.tileStyle.size,
        this.containerStyle.size
      ); // Vertical line
      tileGraphics.lineBetween(
        0,
        i * this.tileStyle.size,
        this.containerStyle.size,
        i * this.tileStyle.size
      ); // Horizontal line
    }
  }
}

import Phaser from 'phaser';
import StateCircle from '../classes/StateCircle';

export default class TestScene extends Phaser.Scene {
  constructor() {
    super('TestScene');
  }

  // Values for the style of container
  private container = {
    x: 550,
    y: 90,
    width: 210,
    height: 550,
    borderRadius: 10,
    backgroundColor: 0xfcf6f5,
  };

  create() {
    // Background container
    const containerGraphics = this.add.graphics({
      fillStyle: { color: this.container.backgroundColor },
    });
    containerGraphics.fillRoundedRect(
      this.container.x,
      this.container.y,
      this.container.width,
      this.container.height,
      this.container.borderRadius
    );
  }
}

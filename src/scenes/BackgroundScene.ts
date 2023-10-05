import Phaser from 'phaser';

export default class BackgroundScene extends Phaser.Scene {
  constructor() {
    super('BackgroundScene');
  }

  preload() {
    this.load.image('background', 'assets/backgroundImg.png');
  }

  create() {
    this.add.image(0, 0, 'background').setOrigin(0, 0);
  }
}

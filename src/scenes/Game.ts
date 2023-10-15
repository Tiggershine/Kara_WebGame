import Phaser from 'phaser';

export default class Game extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {}

  create() {
    this.scene.launch('BackgroundScene');
    this.scene.launch('PlaygroundScene');
    this.scene.launch('DiagramScene');
    this.scene.launch('InputWindowScene');
  }

  update() {}
}

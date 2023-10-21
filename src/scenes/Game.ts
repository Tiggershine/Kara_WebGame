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

    // Set up a pointer move event listener
    // this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
    //   console.log('X: ', pointer.x, 'Y: ', pointer.y);
    // });
  }

  update() {}
}

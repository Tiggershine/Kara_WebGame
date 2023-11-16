import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
  private loadingText!: Phaser.GameObjects.Text;
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    this.loadingText = this.add.text(100, 100, 'Loading ...');

    this.loadingText.setInteractive({ useHandCursor: true });
    this.loadingText.on('pointerdown', () => {
      this.scene.start('SceneB');
    });
  }
}

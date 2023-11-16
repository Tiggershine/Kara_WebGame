import Phaser from 'phaser';

export default class SceneB extends Phaser.Scene {
  private welcomeText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'SceneB' });
  }

  create() {
    this.welcomeText = this.add.text(100, 100, 'Welcome !!!');

    // 클릭하면 SceneA로 다시 전환
    this.welcomeText.setInteractive({ useHandCursor: true });
    this.welcomeText.on('pointerdown', () => {
      this.scene.start('GameScene');
    });
  }
}

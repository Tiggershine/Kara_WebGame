import Phaser from 'phaser';

export default class ControllButton extends Phaser.GameObjects.Sprite {
  id: string;
  isSelected: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    this.id = '';
    this.isSelected = false;
  }
}

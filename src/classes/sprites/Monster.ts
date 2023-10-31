import BaseSprite from './BaseSprite';

export default class Monster extends BaseSprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'monster');
  }
}

import BaseSprite from './BaseSprite';

export default class Wall extends BaseSprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'wall');
  }
}

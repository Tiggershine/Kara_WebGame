import BaseSprite from './BaseSprite';

export default class Star extends BaseSprite {
  private checked = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'star');
  }

  checkStarObjectAt(x: number, y: number): boolean {
    if (this.checked) {
      return false;
    }

    const star = this.scene.children.list.find(
      (child) => child instanceof Star && child.x === x && child.y === y
    );
    if (star) {
      console.log('Star exists at', x, y);
      this.checked = true;
      return true;
    } else {
      console.log('No star at', x, y);
      this.checked = true;
      return false;
    }
  }

  putStar = () => {
    const star = new Star(this.scene, this.x, this.y);
    this.scene.add.existing(star);
    star.depth = this.depth - 1;
  };
  pickStar = () => {
    const star = this.scene.children.list.find(
      (child) =>
        child instanceof Star && child.x === this.x && child.y === this.y
    ) as Star | undefined;

    if (star) {
      star.destroy();
      console.log('Star picked');
    } else {
      console.log('No star to pick');
    }
  };
}

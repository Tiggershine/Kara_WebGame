import BaseSprite from './BaseSprite';
import Wall from './Wall';
import Star from './Star';
import Monster from './Monster';

export default class Player extends BaseSprite {
  stars: Star[] = [];
  playerHighlight!: Phaser.GameObjects.Image;
  playerHighlightChecked: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');

    this.setDisplaySize(45, 45).setAngle(90);
    this.setDepth(5);

    this.playerHighlightChecked = false;

    this.playerHighlight = this.scene.add.image(
      this.x,
      this.y,
      'playerHighlight'
    );
    this.playerHighlight.setVisible(false).setDepth(10);
  }
  get getPlayerHighlight(): Phaser.GameObjects.Image {
    return this.playerHighlight;
  }

  cleanUpStars = (): void => {
    this.stars.forEach((star) => {
      if (star && star instanceof Star) {
        star.destroy();
      }
    });
  };

  playerHighlightOn = (): void => {
    this.playerHighlight.setVisible(true);
  };
  playerHighlightOff = (): void => {
    this.playerHighlight.setVisible(false);
  };

  cleanUpPlayerHighlight = (): void => {
    this.playerHighlight.destroy();
  };

  delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  /** Methods for Moves */
  moveForward = async () => {
    // console.log('moveForward 함수 실행');
    // hightlightSelected && this.playerHighlight.setVisible(true);
    // this.scene.add.existing(this.playerHighlight);
    const angle = this.angle % 360;

    switch (angle) {
      case 90:
      case -270:
        await this.delay(500);
        this.x += 50;
        this.playerHighlight.x = this.x;
        break;
      case 180:
      case -180:
        await this.delay(500);
        this.y += 50;
        this.playerHighlight.y = this.y;
        break;
      case 270:
      case -90:
        await this.delay(500);
        this.x -= 50;
        this.playerHighlight.x = this.x;
        break;
      case 0:
        await this.delay(500);
        this.y -= 50;
        this.playerHighlight.y = this.y;
        break;
      default:
        console.log('Invalid angle');
    }
  };

  turnLeft = async () => {
    await this.delay(500);
    this.angle -= 90;
    console.log('angle: ', this.angle);
  };

  turnRight = async () => {
    await this.delay(500);
    this.angle += 90;
    console.log('angle: ', this.angle);
  };

  putStar = async () => {
    await this.delay(500);
    console.log('putStar triggered');
    const star = new Star(this.scene, this.x, this.y);
    this.scene.add.existing(star);
    star.depth = this.depth - 1;
    this.stars.push(star);
  };

  pickStar = async () => {
    await this.delay(500);
    console.log('pickStar triggered');
    const star = this.scene.children.list.find(
      (child) =>
        child instanceof Star && child.x === this.x && child.y === this.y
    ) as Star | undefined;

    if (star) {
      star.destroy();
    } else {
      console.log('No star to pick');
    }
  };

  moveRight = () => {
    this.x += 50;

    this.wallFrontCheck();
  };
  moveLeft = () => {
    this.x -= 50;
    this.wallFrontCheck();
  };

  wallFrontCheck = (): boolean => {
    const angle = this.angle;
    let dx: number = 0;
    let dy: number = 0;

    switch (angle) {
      case 90:
        dx = 50;
        break;
      case 0:
        dy = -50;
        break;
      case 270:
        dx = -50;
        break;
      case 180:
        dy = 50;
        break;
      default:
        console.log('Invalid angle!');
        return false;
    }

    const wall = this.scene.children.list.find(
      (child) =>
        child instanceof Wall &&
        child.x === this.x + dx &&
        child.y === this.y + dy
    );
    if (wall) {
      return true;
    } else {
      return false;
    }
  };

  wallLeftCheck = (): boolean => {
    const angle = this.angle;
    let dx: number = 0;
    let dy: number = 0;

    switch (angle) {
      case 90:
        dy = -50;
        break;
      case 0:
        dx = -50;
        break;
      case 270:
        dy = 50;
        break;
      case 180:
        dx = 50;
        break;
      default:
        console.log('Invalid angle!');
        return false;
    }

    const wall = this.scene.children.list.find(
      (child) =>
        child instanceof Wall &&
        child.x === this.x + dx &&
        child.y === this.y + dy
    );
    if (wall) {
      return true;
    } else {
      return false;
    }
  };

  wallRightCheck = (): boolean => {
    const angle = this.angle;
    let dx: number = 0;
    let dy: number = 0;

    switch (angle) {
      case 90:
        dy = 50;
        break;
      case 0:
        dx = 50;
        break;
      case 270:
        dy = -50;
        break;
      case 180:
        dx = -50;
        break;
      default:
        console.log('Invalid angle!');
        return false;
    }

    const wall = this.scene.children.list.find(
      (child) =>
        child instanceof Wall &&
        child.x === this.x + dx &&
        child.y === this.y + dy
    );
    if (wall) {
      return true;
    } else {
      return false;
    }
  };

  monsterFrontCheck = (): boolean => {
    const angle = this.angle;
    let dx: number = 0;
    let dy: number = 0;

    switch (angle) {
      case 90:
        dx = 50;
        break;
      case 0:
        dy = -50;
        break;
      case 270:
        dx = -50;
        break;
      case 180:
        dy = 50;
        break;
      default:
        console.log('Invalid angle!');
        return false;
    }

    const monster = this.scene.children.list.find(
      (child) =>
        child instanceof Monster &&
        child.x === this.x + dx &&
        child.y === this.y + dy
    );
    if (monster) {
      return true;
    } else {
      return false;
    }
  };

  starBottomcheck = (): boolean => {
    const star = this.scene.children.list.find(
      (child) =>
        child instanceof Star &&
        child.x - this.x === 0 &&
        child.y - this.y === 0
    );
    if (star) {
      return true;
    } else {
      return false;
    }
  };
}

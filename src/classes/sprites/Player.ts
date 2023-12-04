import BaseSprite from './BaseSprite';
import Wall from './Wall';
import Star from './Star';
import Monster from './Monster';

const BoundaryCoordinates = [
  // upper boundary
  { x: 5, y: 65 },
  { x: 55, y: 65 },
  { x: 105, y: 65 },
  { x: 155, y: 65 },
  { x: 205, y: 65 },
  { x: 255, y: 65 },
  { x: 305, y: 65 },
  { x: 355, y: 65 },
  { x: 405, y: 65 },
  { x: 455, y: 65 },
  { x: 505, y: 65 },
  { x: 555, y: 65 },

  // below boundary
  { x: 5, y: 615 },
  { x: 55, y: 615 },
  { x: 105, y: 615 },
  { x: 155, y: 615 },
  { x: 205, y: 615 },
  { x: 255, y: 615 },
  { x: 305, y: 615 },
  { x: 355, y: 615 },
  { x: 405, y: 615 },
  { x: 455, y: 615 },
  { x: 505, y: 615 },
  { x: 555, y: 615 },

  // left boundary
  { x: 5, y: 115 },
  { x: 5, y: 165 },
  { x: 5, y: 215 },
  { x: 5, y: 265 },
  { x: 5, y: 315 },
  { x: 5, y: 365 },
  { x: 5, y: 415 },
  { x: 5, y: 465 },
  { x: 5, y: 515 },
  { x: 5, y: 565 },

  // right boundary
  { x: 555, y: 115 },
  { x: 555, y: 165 },
  { x: 555, y: 215 },
  { x: 555, y: 265 },
  { x: 555, y: 315 },
  { x: 555, y: 365 },
  { x: 555, y: 415 },
  { x: 555, y: 465 },
  { x: 555, y: 515 },
  { x: 555, y: 565 },
];

export default class Player extends BaseSprite {
  stars: Star[] = [];
  playerHighlight!: Phaser.GameObjects.Image;
  playerHighlightChecked: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');

    this.setDisplaySize(45, 45).setAngle(90);
    this.setDepth(1);

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
    this.scene.children.list.forEach((child) => {
      if (child instanceof Star) {
        child.destroy();
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
  // moveForward = async () => {
  //   // console.log('moveForward 함수 실행');
  //   // hightlightSelected && this.playerHighlight.setVisible(true);
  //   // this.scene.add.existing(this.playerHighlight);
  //   const angle = this.angle % 360;

  //   switch (angle) {
  //     case 90:
  //     case -270:
  //       await this.delay(500);
  //       this.x += 50;
  //       this.playerHighlight.x = this.x;
  //       break;
  //     case 180:
  //     case -180:
  //       await this.delay(500);
  //       this.y += 50;
  //       this.playerHighlight.y = this.y;
  //       break;
  //     case 270:
  //     case -90:
  //       await this.delay(500);
  //       this.x -= 50;
  //       this.playerHighlight.x = this.x;
  //       break;
  //     case 0:
  //       await this.delay(500);
  //       this.y -= 50;
  //       this.playerHighlight.y = this.y;
  //       break;
  //     default:
  //       console.log('Invalid angle');
  //   }
  // };
  moveForward = async (): Promise<boolean> => {
    // Calculate the next position based on the current angle
    let nextX = this.x;
    let nextY = this.y;
    const angle = this.angle % 360;
    console.log('angle:', this.angle);

    switch (angle) {
      case 90:
      case -270:
        nextX += 50;
        break;
      case 180:
      case -180:
        nextY += 50;
        break;
      case 270:
      case -90:
        nextX -= 50;
        break;
      case 0:
      case -360:
        nextY -= 50;
        break;
      default:
        console.log('Invalid angle');
        return false;
    }

    // Check if the next position is beyond the boundary
    const isBeyondBoundary = BoundaryCoordinates.some(
      (coord) => nextX === coord.x && nextY === coord.y
    );

    if (isBeyondBoundary) {
      console.log(`Cannot move beyond boundary at (${nextX}, ${nextY})`);
      return false;
    }

    // Proceed with the move if within boundary
    await this.delay(500);
    this.x = nextX;
    this.y = nextY;
    this.playerHighlight.x = this.x;
    this.playerHighlight.y = this.y;

    return true;
  };

  turnLeft = async () => {
    await this.delay(500);
    this.angle -= 90;
    console.log('angle: ', this.angle);
    return true;
  };

  turnRight = async () => {
    await this.delay(500);
    this.angle += 90;
    console.log('angle: ', this.angle);
    return true;
  };

  putStar = async () => {
    await this.delay(500);
    console.log('putStar triggered on', this.x, this.y);
    const star = new Star(this.scene, this.x, this.y);
    this.scene.add.existing(star);
    star.depth = this.depth - 1;
    this.stars.push(star);
    return true;
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
      console.log('star destroyed');
      // this.scene.children.list.forEach((child) => console.log(child));
      return true;
    } else {
      console.log('No star to pick');
      return true;
    }
  };

  // moveRight = () => {
  //   this.x += 50;

  //   this.wallFrontCheck();
  // };
  // moveLeft = () => {
  //   this.x -= 50;
  //   this.wallFrontCheck();
  // };

  wallFrontCheck = (): boolean => {
    const angle = this.angle;
    let dx: number = 0;
    let dy: number = 0;

    switch (angle) {
      case 90:
      case -270:
        dx = 50;
        break;
      case 0:
      case -360:
        dy = -50;
        break;
      case 270:
      case -90:
        dx = -50;
        break;
      case 180:
      case -180:
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

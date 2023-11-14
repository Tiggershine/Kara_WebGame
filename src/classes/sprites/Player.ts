import BaseSprite from './BaseSprite';
import Wall from './Wall';
import Star from './Star';
import Monster from './Monster';

export default class Player extends BaseSprite {
  stars: Star[] = [];
  playerHighlight!: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');

    this.setDisplaySize(45, 45).setAngle(90);
    this.setDepth(5);

    this.playerHighlight = this.scene.add.image(
      this.x,
      this.y,
      'playerHighlight'
    );
    this.playerHighlight.setVisible(false).setDepth(10);
  }

  delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  //  moveForwardTest = async () => {
  //     console.log('1번 도입');
  //     await this.delay(2000);
  //     console.log('2번 도입');
  //     this.x += 50;
  //   };

  /** Methods for Moves */
  moveForward = async () => {
    console.log('moveForward 함수 실행');
    this.playerHighlight.setVisible(true);
    this.scene.add.existing(this.playerHighlight);
    const angle = this.angle % 360;

    switch (angle) {
      case 0:
        await this.delay(2000);
        this.x += 50;
        this.playerHighlight.x = this.x;
        break;
      case 90:
      case -270:
        await this.delay(2000);
        this.y += 50;
        this.playerHighlight.y = this.y;
        break;
      case 180:
      case -180:
        await this.delay(2000);
        this.x -= 50;
        this.playerHighlight.x = this.x;
        break;
      case 270:
      case -90:
        await this.delay(2000);
        this.y -= 50;
        this.playerHighlight.y = this.y;
        break;
      default:
        console.log('Invalid angle');
    }
  };

  turnLeft = async () => {
    await this.delay(2000);
    this.angle -= 90;
    console.log('angle: ', this.angle);
  };

  turnRight = async () => {
    await this.delay(2000);
    this.angle += 90;
    console.log('angle: ', this.angle);
  };

  putStar = async () => {
    await this.delay(2000);
    console.log('putStar triggered');
    const star = new Star(this.scene, this.x, this.y);
    this.scene.add.existing(star);
    star.depth = this.depth - 1;
  };

  pickStar = async () => {
    await this.delay(2000);
    console.log('pickStar triggered');
    const star = this.scene.children.list.find(
      (child) =>
        child instanceof Star && child.x === this.x && child.y === this.y
    ) as Star | undefined;

    if (star) {
      console.log('destroy');
      star.destroy();
      console.log('Star picked');
    } else {
      console.log('No star to pick');
    }
  };

  // moveForward = (): Promise<void> => {
  //   const angle = this.angle % 360;
  //   let targetX = this.x;
  //   let targetY = this.y;

  //   switch (angle) {
  //     case 0:
  //       targetX += 50;
  //       break;
  //     case 90:
  //     case -270:
  //       targetY += 50;
  //       break;
  //     case 180:
  //     case -180:
  //       targetX -= 50;
  //       break;
  //     case 270:
  //     case -90:
  //       targetY -= 50;
  //       break;
  //     default:
  //       console.log('Invalid angle');
  //       return Promise.reject('Invalid angle');
  //   }

  //   return new Promise((resolve) => {
  //     this.scene.tweens.add({
  //       targets: this,
  //       x: targetX,
  //       y: targetY,
  //       duration: 500,
  //       ease: 'Linear',
  //       onComplete: () => {
  //         resolve();
  //       },
  //     });
  //   });
  // };

  // turnLeft = (): Promise<void> => {
  //   return new Promise((resolve) => {
  //     this.angle -= 90;
  //     console.log('angle: ', this.angle);
  //     resolve();
  //   });
  // };

  // turnRight = (): Promise<void> => {
  //   return new Promise((resolve) => {
  //     this.angle += 90;
  //     console.log('angle: ', this.angle);
  //     resolve();
  //   });
  // };

  // putStar = (): Promise<void> => {
  //   return new Promise((resolve) => {
  //     console.log('putStar triggered');
  //     const star = new Star(this.scene, this.x, this.y);
  //     this.scene.add.existing(star);
  //     star.depth = this.depth - 1;
  //     resolve();
  //   });
  // };
  // putStar = (x: number, y: number): Promise<void> => {
  //   console.log('putStar 함수 실행');
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       console.log('putStar triggered');
  //       const star = new Star(this.scene, x, y);
  //       this.scene.add.existing(star);
  //       star.depth = this.depth - 1;
  //       resolve();
  //     }, 3000);
  //   });
  // };

  // pickStar = (): Promise<void> => {
  //   console.log('pickStar 함수 실행');
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       console.log('pickStar triggered');
  //       const star = this.scene.children.list.find(
  //         (child) =>
  //           child instanceof Star && child.x === this.x && child.y === this.y
  //       ) as Star | undefined;

  //       if (star) {
  //         console.log('destroy');
  //         star.destroy();
  //         console.log('Star picked');
  //       } else {
  //         console.log('No star to pick');
  //       }
  //       resolve();
  //     }, 3000);
  //   });
  // };

  moveRight = () => {
    this.x += 50;
    console.log('moveRight');

    this.wallFrontCheck();
    // this.starBottomcheck();
  };
  moveLeft = () => {
    this.x -= 50;
    console.log('moveLeft');
    this.wallFrontCheck();
    // this.starBottomcheck();
  };

  wallFrontCheck = (): boolean => {
    const angle = this.angle;
    let dx: number = 0;
    let dy: number = 0;

    switch (angle) {
      case 0:
        dx = 50;
        break;
      case -90:
        dy = -50;
        break;
      case -180:
        dx = -50;
        break;
      case 90:
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
      console.log('wallFrontCheck: true');
      return true;
    } else {
      console.log('wallFrontCheck: false');
      return false;
    }
  };

  wallLeftCheck = (): boolean => {
    const angle = this.angle;
    let dx: number = 0;
    let dy: number = 0;

    switch (angle) {
      case 0:
        dy = -50;
        break;
      case -90:
        dx = -50;
        break;
      case -180:
        dy = 50;
        break;
      case 90:
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
      console.log('wallLeftCheck: true');
      return true;
    } else {
      console.log('wallLeftCheck: false');
      return false;
    }
  };

  wallRightCheck = (): boolean => {
    const angle = this.angle;
    let dx: number = 0;
    let dy: number = 0;

    switch (angle) {
      case 0:
        dy = 50;
        break;
      case -90:
        dx = 50;
        break;
      case -180:
        dy = -50;
        break;
      case 90:
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
      console.log('wallRightCheck: true');
      return true;
    } else {
      console.log('wallRightCheck: false');
      return false;
    }
  };

  // };
  monsterFrontCheck = (): boolean => {
    const angle = this.angle;
    let dx: number = 0;
    let dy: number = 0;

    switch (angle) {
      case 0:
        dx = 50;
        break;
      case -90:
        dy = -50;
        break;
      case -180:
        dx = -50;
        break;
      case 90:
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
      console.log('monsterFrontCheck: true');
      return true;
    } else {
      console.log('monsterFrontCheck: false');
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
      // console.log('starBottomcheck: true');
      return true;
    } else {
      // console.log('starBottomcheck: false');
      return false;
    }
  };
}

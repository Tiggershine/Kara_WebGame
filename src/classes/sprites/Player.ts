import BaseSprite from './BaseSprite';
import Wall from './Wall';
import Star from './Star';
import Monster from './Monster';

export default class Player extends BaseSprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');
  }

  moveForward = (wall: Wall) => {
    const angle = this.angle % 360;

    switch (angle) {
      case 0:
        this.x += 50;
        break;
      case 90:
      case -270:
        this.y += 50;
        break;
      case 180:
      case -180:
        this.x -= 50;
        break;
      case 270:
      case -90:
        this.y -= 50;
        break;
      default:
        console.log('Invalid angle');
    }
  };

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

  turnLeft = () => {
    this.angle -= 90;
    console.log('angle: ', this.angle);
  };
  turnRight = () => {
    this.angle += 90;
    console.log('angle: ', this.angle);
  };

  /** Methods for Checking Sensor */
  // wallFrontCheck1 = (wall: Wall): boolean => {
  //   const angle = this.angle % 360;
  //   const dx = wall.x - this.x;
  //   const dy = wall.y - this.y;

  //   if (angle === 0 && dx === 50 && dy === 0) {
  //     console.log('true');
  //     return true;
  //   } else if (angle === -90 && dx === 0 && dy === -50) {
  //     console.log('true');
  //     return true;
  //   } else if (angle === -180 && dx === -50 && dy === 0) {
  //     console.log('true');
  //     return true;
  //   } else if (angle === 90 && dx === 0 && dy === 50) {
  //     console.log('true');
  //     return true;
  //   } else {
  //     console.log('false');
  //     return false;
  //   }
  // };

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
      console.log('true');
      return true;
    } else {
      console.log('false');
      return false;
    }
  };

  // wallLeftCheck1 = (wall: Wall): boolean => {
  //   const angle = this.angle % 360;
  //   const dx = wall.x - this.x;
  //   const dy = wall.y - this.y;

  //   if (angle === 0 && dx === 0 && dy === -50) {
  //     console.log('true');
  //     return true;
  //   } else if (angle === -90 && dx === -50 && dy === 0) {
  //     console.log('true');
  //     return true;
  //   } else if (angle === -180 && dx === 0 && dy === 50) {
  //     console.log('true');
  //     return true;
  //   } else if (angle === 90 && dx === 50 && dy === 0) {
  //     console.log('true');
  //     return true;
  //   } else {
  //     console.log('false');
  //     return false;
  //   }
  // };

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
      console.log('true');
      return true;
    } else {
      console.log('false');
      return false;
    }
  };

  wallRightCheck1 = (wall: Wall): boolean => {
    const angle = this.angle % 360;
    const dx = wall.x - this.x;
    const dy = wall.y - this.y;

    if (angle === 0 && dx === 0 && dy === 50) {
      console.log('true');
      return true;
    } else if (angle === -90 && dx === 50 && dy === 0) {
      console.log('true');
      return true;
    } else if (angle === -180 && dx === 0 && dy === -50) {
      console.log('true');
      return true;
    } else if (angle === 90 && dx === -50 && dy === 0) {
      console.log('true');
      return true;
    } else {
      console.log('false');
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
      console.log('true');
      return true;
    } else {
      console.log('false');
      return false;
    }
  };

  // monsterFrontcheck = (monster: Monster): boolean => {
  //   const angle = this.angle % 360;
  //   const dx = monster.x - this.x;
  //   const dy = monster.x - this.y;

  //   if (angle === 0 && dx === 50 && dy === 0) {
  //     console.log('true');
  //     return true;
  //   } else if (angle === -90 && dx === 0 && dy === -50) {
  //     console.log('true');
  //     return true;
  //   } else if (angle === -180 && dx === -50 && dy === 0) {
  //     console.log('true');
  //     return true;
  //   } else if (angle === 90 && dx === 0 && dy === 50) {
  //     console.log('true');
  //     return true;
  //   } else {
  //     console.log('false');
  //     return false;
  //   }
  // };
  wallMonsterCheck = (): boolean => {
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
      console.log('true');
      return true;
    } else {
      console.log('false');
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
      console.log('true');
      return true;
    } else {
      console.log('false');
      return false;
    }
  };
}

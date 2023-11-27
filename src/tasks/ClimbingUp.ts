import Phaser from 'phaser';
import Player from '../classes/sprites/Player';
import Star from '../classes/sprites/Star';
import Wall from '../classes/sprites/Wall';
import TaskHelper from './TaskHelper';

const wallPositions = [
  { x: 205, y: 565 },
  { x: 255, y: 565 },
  { x: 305, y: 565 },
  { x: 355, y: 565 },
  { x: 405, y: 565 },
  { x: 455, y: 565 },
  { x: 505, y: 565 },
  { x: 255, y: 515 },
  { x: 305, y: 515 },
  { x: 355, y: 515 },
  { x: 405, y: 515 },
  { x: 455, y: 515 },
  { x: 505, y: 515 },
  { x: 305, y: 465 },
  { x: 355, y: 465 },
  { x: 405, y: 465 },
  { x: 455, y: 465 },
  { x: 505, y: 465 },
  { x: 355, y: 415 },
  { x: 405, y: 415 },
  { x: 455, y: 415 },
  { x: 505, y: 415 },
  { x: 405, y: 365 },
  { x: 455, y: 365 },
  { x: 505, y: 365 },
  { x: 455, y: 315 },
  { x: 505, y: 315 },
  { x: 505, y: 265 },
];

export default class StarFindInForest extends Phaser.GameObjects.Container {
  private player!: Player;
  private star1!: Star;
  private star2!: Star;
  private walls!: Wall[];
  private taskHelper!: TaskHelper;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.player = new Player(this.scene, 155, 565);
    this.player.setAngle(90);
    scene.add.existing(this.player);
    this.taskHelper = new TaskHelper(scene, this.player);

    this.star1 = new Star(this.scene, 305, 415);
    this.star2 = new Star(this.scene, 505, 215);
    scene.add.existing(this.star1);
    scene.add.existing(this.star2);

    this.walls = wallPositions.map((pos) => new Wall(this.scene, pos.x, pos.y));
    this.walls.forEach((wall) => scene.add.existing(wall));

    // this.walls.push(new Wall(this.scene, 205, 565));
    // this.walls.push(new Wall(this.scene, 255, 565));
    // this.walls.push(new Wall(this.scene, 305, 565));
    // this.walls.push(new Wall(this.scene, 355, 565));
    // this.walls.push(new Wall(this.scene, 405, 565));
    // this.walls.push(new Wall(this.scene, 455, 565));
    // this.walls.push(new Wall(this.scene, 505, 565));
    // this.walls.push(new Wall(this.scene, 255, 515));
    // this.walls.push(new Wall(this.scene, 305, 515));
    // this.walls.push(new Wall(this.scene, 355, 515));
    // this.walls.push(new Wall(this.scene, 405, 515));
    // this.walls.push(new Wall(this.scene, 455, 515));
    // this.walls.push(new Wall(this.scene, 505, 515));
    // this.walls.push(new Wall(this.scene, 305, 465));
    // this.walls.push(new Wall(this.scene, 355, 465));
    // this.walls.push(new Wall(this.scene, 405, 465));
    // this.walls.push(new Wall(this.scene, 455, 465));
    // this.walls.push(new Wall(this.scene, 505, 465));
    // this.walls.push(new Wall(this.scene, 355, 415));
    // this.walls.push(new Wall(this.scene, 405, 415));
    // this.walls.push(new Wall(this.scene, 455, 415));
    // this.walls.push(new Wall(this.scene, 505, 415));
    // this.walls.push(new Wall(this.scene, 405, 365));
    // this.walls.push(new Wall(this.scene, 455, 365));
    // this.walls.push(new Wall(this.scene, 505, 365));
    // this.walls.push(new Wall(this.scene, 455, 315));
    // this.walls.push(new Wall(this.scene, 505, 315));
    // this.walls.push(new Wall(this.scene, 505, 265));
  }

  restartSimulation = (stateInputData: any, highlightOn: boolean) => {
    this.player.cleanUpStars();
    this.player.setPosition(155, 565).setAngle(90);
    this.player.playerHighlight.setPosition(155, 565);

    this.star1 = new Star(this.scene, 305, 415);
    this.star2 = new Star(this.scene, 505, 215);
    this.scene.add.existing(this.star1);
    this.scene.add.existing(this.star2);

    this.processStateInputData(stateInputData, highlightOn);
  };

  processStateInputData = (stateInputData: any, highlightOn: boolean) => {
    console.log('ClimbingUp Simulation 시작');
    this.taskHelper.processStateInputData(stateInputData, highlightOn, () => {
      const positionsCorrect = this.checkObjectPositions();
      console.log(positionsCorrect ? 'Success' : 'Fail');
      console.log('END');
    });
  };

  private checkObjectPositions(): boolean {
    const isPlayerAt455315 = this.scene.children.list.some(
      (child) => child instanceof Player && child.x === 455 && child.y === 315
    );
    const areWallsCorrect = wallPositions.every((pos) =>
      this.scene.children.list.some(
        (child) =>
          child instanceof Wall && child.x === pos.x && child.y === pos.y
      )
    );

    const isOtherObjectsExist = this.scene.children.list.some(
      (child) =>
        (child instanceof Star ||
          child instanceof Player ||
          child instanceof Wall) &&
        !(
          (child.x === 155 && child.y === 315) ||
          (child.x === 355 && child.y === 315) ||
          (child.x === 455 && child.y === 315) ||
          (child.x === 205 && child.y === 265) ||
          (child.x === 405 && child.y === 265) ||
          (child.x === 455 && child.y === 265) ||
          (child.x === 305 && child.y === 365) ||
          (child.x === 405 && child.y === 365) ||
          (child.x === 505 && child.y === 315)
        )
    );

    return isPlayerAt455315 && areWallsCorrect && !isOtherObjectsExist;
  }
}

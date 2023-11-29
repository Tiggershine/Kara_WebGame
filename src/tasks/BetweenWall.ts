import Phaser from 'phaser';
import Player from '../classes/sprites/Player';
import Star from '../classes/sprites/Star';
import Wall from '../classes/sprites/Wall';
import TaskHelper from '../classes/TaskHelper';

export default class StarFindInForest extends Phaser.GameObjects.Container {
  private player!: Player;
  private star1!: Star;
  private star2!: Star;
  private star3!: Star;
  private star4!: Star;
  private star5!: Star;
  private wall1!: Wall;
  private wall2!: Wall;
  private wall3!: Wall;
  private wall4!: Wall;
  private wall5!: Wall;
  private wall6!: Wall;
  private taskHelper!: TaskHelper;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.player = new Player(this.scene, 105, 315);
    this.player.setAngle(90);
    this.taskHelper = new TaskHelper(scene, this.player);

    this.wall1 = new Wall(this.scene, 205, 265);
    this.wall2 = new Wall(this.scene, 405, 265);
    this.wall3 = new Wall(this.scene, 455, 265);
    this.wall4 = new Wall(this.scene, 305, 365);
    this.wall5 = new Wall(this.scene, 405, 365);
    this.wall6 = new Wall(this.scene, 505, 315);

    this.star1 = new Star(this.scene, 155, 315);
    this.star2 = new Star(this.scene, 205, 315);
    this.star3 = new Star(this.scene, 355, 315);
    this.star4 = new Star(this.scene, 405, 315);
    this.star5 = new Star(this.scene, 455, 315);

    scene.add.existing(this.player);
    scene.add.existing(this.wall1);
    scene.add.existing(this.wall2);
    scene.add.existing(this.wall3);
    scene.add.existing(this.wall4);
    scene.add.existing(this.wall5);
    scene.add.existing(this.wall6);
    scene.add.existing(this.star1);
    scene.add.existing(this.star2);
    scene.add.existing(this.star3);
    scene.add.existing(this.star4);
    scene.add.existing(this.star5);
  }

  restartSimulation = (stateInputData: any, highlightOn: boolean) => {
    this.player.cleanUpStars();
    this.player.setPosition(105, 315).setAngle(90);
    this.player.playerHighlight.setPosition(105, 315);

    this.star1 = new Star(this.scene, 155, 315);
    this.star2 = new Star(this.scene, 205, 315);
    this.star3 = new Star(this.scene, 355, 315);
    this.star4 = new Star(this.scene, 405, 315);
    this.star5 = new Star(this.scene, 455, 315);
    this.scene.add.existing(this.star1);
    this.scene.add.existing(this.star2);
    this.scene.add.existing(this.star3);
    this.scene.add.existing(this.star4);
    this.scene.add.existing(this.star5);

    this.processStateInputData(stateInputData, highlightOn);
  };

  processStateInputData = (stateInputData: any, highlightOn: boolean) => {
    console.log('BetweenWall Simulation 시작');
    this.taskHelper.processStateInputData(stateInputData, highlightOn, () => {
      const positionsCorrect = this.checkObjectPositions();
      console.log(positionsCorrect ? 'Success' : 'Fail');
      console.log('END');
    });
  };

  private checkObjectPositions(): boolean {
    const isStarAt155315 = this.scene.children.list.some(
      (child) => child instanceof Star && child.x === 155 && child.y === 315
    );
    const isStarAt355315 = this.scene.children.list.some(
      (child) => child instanceof Star && child.x === 355 && child.y === 315
    );
    const isPlayerAt455315 = this.scene.children.list.some(
      (child) => child instanceof Player && child.x === 455 && child.y === 315
    );
    const isWallAt205265 = this.scene.children.list.some(
      (child) => child instanceof Wall && child.x === 205 && child.y === 265
    );
    const isWallAt405265 = this.scene.children.list.some(
      (child) => child instanceof Wall && child.x === 405 && child.y === 265
    );
    const isWallAt455265 = this.scene.children.list.some(
      (child) => child instanceof Wall && child.x === 455 && child.y === 265
    );
    const isWallAt305365 = this.scene.children.list.some(
      (child) => child instanceof Wall && child.x === 305 && child.y === 365
    );
    const isWallAt405365 = this.scene.children.list.some(
      (child) => child instanceof Wall && child.x === 405 && child.y === 365
    );
    const isWallAt505315 = this.scene.children.list.some(
      (child) => child instanceof Wall && child.x === 505 && child.y === 315
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

    return (
      isStarAt155315 &&
      isStarAt355315 &&
      isPlayerAt455315 &&
      isWallAt205265 &&
      isWallAt405265 &&
      isWallAt455265 &&
      isWallAt305365 &&
      isWallAt405365 &&
      isWallAt505315 &&
      !isOtherObjectsExist
    );
  }
}

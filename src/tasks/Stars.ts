import Phaser from 'phaser';
import Player from '../classes/sprites/Player';
import Star from '../classes/sprites/Star';
import Wall from '../classes/sprites/Wall';
import TaskHelper from '../classes/TaskHelper';

export default class Stars extends Phaser.GameObjects.Container {
  private player!: Player;
  private star1!: Star;
  private star2!: Star;
  private wall!: Wall;
  private taskHelper!: TaskHelper;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.player = new Player(this.scene, 155, 315);
    this.player.setAngle(90);
    this.taskHelper = new TaskHelper(scene, this.player);

    this.wall = new Wall(this.scene, 405, 315);

    this.star1 = new Star(this.scene, 205, 315);
    this.star2 = new Star(this.scene, 305, 315);

    scene.add.existing(this.player);
    scene.add.existing(this.star1);
    scene.add.existing(this.star2);
    scene.add.existing(this.wall);
  }

  reoranizeGameObjects = () => {
    this.player.cleanUpStars();
    this.player.setPosition(155, 315).setAngle(90);
    this.player.playerHighlight.setPosition(155, 315);

    this.star1 = new Star(this.scene, 205, 315);
    this.star2 = new Star(this.scene, 305, 315);
    this.scene.add.existing(this.star1);
    this.scene.add.existing(this.star2);
  };

  restartSimulation = (stateInputData: any, highlightOn: boolean) => {
    // this.player.cleanUpStars();
    // this.player.setPosition(155, 315).setAngle(90);
    // this.player.playerHighlight.setPosition(155, 315);

    // this.star1 = new Star(this.scene, 205, 315);
    // this.star2 = new Star(this.scene, 305, 315);
    // this.scene.add.existing(this.star1);
    // this.scene.add.existing(this.star2);
    this.reoranizeGameObjects();

    this.startSimulation(stateInputData, highlightOn);
  };

  startSimulation = (stateInputData: any, highlightOn: boolean) => {
    this.taskHelper.executeSimulation(this, stateInputData, highlightOn);
  };

  checkObjectPositions(): boolean {
    const isStarAt155315 = this.scene.children.list.some(
      (child) => child instanceof Star && child.x === 155 && child.y === 315
    );
    const isStarAt255315 = this.scene.children.list.some(
      (child) => child instanceof Star && child.x === 255 && child.y === 315
    );
    const isStarAt355315 = this.scene.children.list.some(
      (child) => child instanceof Star && child.x === 355 && child.y === 315
    );
    const isPlayerAt355315 = this.scene.children.list.some(
      (child) => child instanceof Player && child.x === 355 && child.y === 315
    );
    const isWallAt405315 = this.scene.children.list.some(
      (child) => child instanceof Wall && child.x === 405 && child.y === 315
    );
    const isOtherObjectsExist = this.scene.children.list.some(
      (child) =>
        (child instanceof Star ||
          child instanceof Player ||
          child instanceof Wall) &&
        !(
          (child.x === 155 && child.y === 315) ||
          (child.x === 255 && child.y === 315) ||
          (child.x === 355 && child.y === 315) ||
          (child.x === 405 && child.y === 315)
        )
    );

    return (
      isStarAt155315 &&
      isStarAt255315 &&
      isStarAt355315 &&
      isPlayerAt355315 &&
      isWallAt405315 &&
      !isOtherObjectsExist
    );
  }

  getSuccessMessage = (): string => {
    this.taskHelper.setIsSuccessPopupShowed = true;
    return `" Bravo! You've succeeded! "`;
  };

  getFailureMessage = (): string => {
    return `" Oops, not quite!\n   Want to try again? "`;
  };
}

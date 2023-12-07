import Phaser from 'phaser';
import Player from '../classes/sprites/Player';
import Star from '../classes/sprites/Star';
import Wall from '../classes/sprites/Wall';
import TaskHelper from '../classes/TaskHelper';

const WallPositions = [
  { x: 55, y: 115 },
  { x: 105, y: 115 },
  { x: 155, y: 115 },
  { x: 205, y: 115 },
  { x: 255, y: 115 },
  { x: 305, y: 115 },
  { x: 355, y: 115 },
  { x: 405, y: 115 },
  { x: 455, y: 115 },
  { x: 55, y: 165 },
  { x: 455, y: 165 },
  { x: 55, y: 215 },
  { x: 455, y: 215 },
  { x: 55, y: 265 },
  { x: 455, y: 265 },
  { x: 55, y: 315 },
  { x: 455, y: 315 },
  { x: 55, y: 365 },
  { x: 455, y: 365 },
  { x: 55, y: 415 },
  { x: 455, y: 415 },
  { x: 55, y: 465 },
  { x: 455, y: 465 },
  { x: 55, y: 515 },
  { x: 105, y: 515 },
  { x: 155, y: 515 },
  { x: 205, y: 515 },
  { x: 255, y: 515 },
  { x: 305, y: 515 },
  { x: 355, y: 515 },
  { x: 405, y: 515 },
  { x: 455, y: 515 },
];

const SuccessStarPositions = [
  { x: 155, y: 165 },
  { x: 255, y: 165 },
  { x: 355, y: 165 },
  { x: 105, y: 215 },
  { x: 205, y: 215 },
  { x: 305, y: 215 },
  { x: 405, y: 215 },
  { x: 155, y: 265 },
  { x: 255, y: 265 },
  { x: 355, y: 265 },
  { x: 105, y: 315 },
  { x: 205, y: 315 },
  { x: 305, y: 315 },
  { x: 405, y: 315 },
  { x: 155, y: 365 },
  { x: 255, y: 365 },
  { x: 355, y: 365 },
  { x: 105, y: 415 },
  { x: 205, y: 415 },
  { x: 305, y: 415 },
  { x: 405, y: 415 },
  { x: 155, y: 465 },
  { x: 255, y: 465 },
  { x: 355, y: 465 },
];

export default class NazcaLine extends Phaser.GameObjects.Container {
  private player!: Player;
  private walls!: Wall[];
  private taskHelper!: TaskHelper;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.player = new Player(this.scene, 105, 165);
    this.player.setAngle(90);
    scene.add.existing(this.player);
    this.taskHelper = new TaskHelper(scene, this.player);

    this.walls = WallPositions.map((pos) => new Wall(this.scene, pos.x, pos.y));
    this.walls.forEach((wall) => scene.add.existing(wall));
  }

  restartSimulation = (stateInputData: any, highlightOn: boolean) => {
    this.player.cleanUpStars();
    this.player.setPosition(105, 165).setAngle(90);
    this.player.playerHighlight.setPosition(105, 165);

    this.startSimulation(stateInputData, highlightOn);
  };

  startSimulation = (stateInputData: any, highlightOn: boolean) => {
    this.taskHelper.executeSimulation(this, stateInputData, highlightOn);
  };

  checkObjectPositions(): boolean {
    const isPlayerAt405465 = this.scene.children.list.some(
      (child) => child instanceof Player && child.x === 405 && child.y === 465
    );
    const areWallsCorrect = WallPositions.every((pos) =>
      this.scene.children.list.some(
        (child) =>
          child instanceof Wall && child.x === pos.x && child.y === pos.y
      )
    );

    // this.scene.children.list.forEach((child) => console.log(child));
    const areStarsCorrect = SuccessStarPositions.every((pos) => {
      console.log(pos);
      return this.scene.children.list.some(
        (child) =>
          child instanceof Star && child.x === pos.x && child.y === pos.y
      );
    });

    const isOtherObjectsExist = this.scene.children.list.some((child) => {
      return (
        child instanceof Star &&
        !SuccessStarPositions.some(
          (pos) => child.x === pos.x && child.y === pos.y
        )
      );
    });

    console.log(
      'isPlayerAt405465',
      isPlayerAt405465,
      'areWallsCorrect',
      areWallsCorrect,
      'areStarsCorrect',
      areStarsCorrect,
      'isOtherObjectsExist',
      isOtherObjectsExist
    );
    return (
      isPlayerAt405465 &&
      areWallsCorrect &&
      areStarsCorrect &&
      !isOtherObjectsExist
    );
  }

  getSuccessMessage = (): string => {
    this.taskHelper.setIsSuccessPopupShowed = true;
    return `" Great job! \n  Let's take on the next mission. "`;
  };

  getFailureMessage = (): string => {
    return `" So close! \n  Would you like to try again? "`;
  };
}

import Phaser from 'phaser';
import Player from '../classes/sprites/Player';
import Star from '../classes/sprites/Star';
import Wall from '../classes/sprites/Wall';
import TaskHelper from '../classes/TaskHelper';

const wallPositions = [
  { x: 55, y: 115 }, //1
  { x: 55, y: 165 },
  { x: 55, y: 215 },
  { x: 55, y: 265 },
  { x: 55, y: 315 },
  { x: 55, y: 365 },
  { x: 55, y: 415 },
  { x: 55, y: 465 },
  { x: 55, y: 515 },
  { x: 55, y: 565 },
  { x: 105, y: 115 }, //2
  { x: 105, y: 165 },
  { x: 105, y: 215 },
  { x: 105, y: 265 },
  { x: 105, y: 315 },
  { x: 105, y: 365 },
  { x: 105, y: 415 },
  { x: 105, y: 465 },
  { x: 105, y: 515 },
  { x: 105, y: 565 },
  { x: 155, y: 115 }, //3
  { x: 155, y: 215 },
  { x: 155, y: 365 },
  { x: 155, y: 565 },
  { x: 205, y: 115 }, //4
  { x: 205, y: 215 },
  { x: 205, y: 265 },
  { x: 205, y: 465 },
  { x: 205, y: 565 },
  { x: 255, y: 115 }, //5
  { x: 255, y: 215 },
  { x: 255, y: 265 },
  { x: 255, y: 315 },
  { x: 255, y: 365 },
  { x: 255, y: 415 },
  { x: 255, y: 465 },
  { x: 255, y: 565 },
  { x: 305, y: 115 }, //6
  { x: 305, y: 215 },
  { x: 305, y: 265 },
  { x: 305, y: 315 },
  { x: 305, y: 365 },
  { x: 305, y: 415 },
  { x: 305, y: 465 },
  { x: 305, y: 565 },
  { x: 355, y: 115 }, //7
  { x: 355, y: 215 },
  { x: 355, y: 265 },
  { x: 355, y: 465 },
  { x: 355, y: 565 },
  { x: 405, y: 115 }, //8
  { x: 405, y: 365 },
  { x: 405, y: 565 },
  { x: 455, y: 115 }, //9
  { x: 455, y: 165 },
  { x: 455, y: 215 },
  { x: 455, y: 265 },
  { x: 455, y: 315 },
  { x: 455, y: 365 },
  { x: 455, y: 415 },
  { x: 455, y: 465 },
  { x: 455, y: 515 },
  { x: 455, y: 565 },
  { x: 505, y: 115 }, //10
  { x: 505, y: 165 },
  { x: 505, y: 215 },
  { x: 505, y: 265 },
  { x: 505, y: 315 },
  { x: 505, y: 365 },
  { x: 505, y: 415 },
  { x: 505, y: 465 },
  { x: 505, y: 515 },
  { x: 505, y: 565 },
];

export default class TunnelFinder2 extends Phaser.GameObjects.Container {
  private player!: Player;
  private star!: Star;
  private walls!: Wall[];
  private taskHelper!: TaskHelper;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.player = new Player(this.scene, 155, 165);
    this.player.setAngle(90);
    scene.add.existing(this.player);
    this.taskHelper = new TaskHelper(scene, this.player);

    this.star = new Star(this.scene, 155, 265);
    scene.add.existing(this.star);

    this.walls = wallPositions.map((pos) => new Wall(this.scene, pos.x, pos.y));
    this.walls.forEach((wall) => scene.add.existing(wall));
  }

  reoranizeGameObjects = () => {
    this.player.cleanUpStars();
    this.player.setPosition(155, 165).setAngle(90);
    this.player.playerHighlight.setPosition(155, 165);

    this.star = new Star(this.scene, 155, 265);
    this.scene.add.existing(this.star);
  };

  restartSimulation = (stateInputData: any, highlightOn: boolean) => {
    this.reoranizeGameObjects();
    if (!highlightOn && this.player.getPlayerHighlight) {
      this.player.playerHighlightOff();
    } else if (highlightOn) {
      this.player.playerHighlightOn();
    }
    this.startSimulation(stateInputData, highlightOn);
  };

  startSimulation = (stateInputData: any, highlightOn: boolean) => {
    if (!highlightOn && this.player.getPlayerHighlight) {
      this.player.playerHighlightOff();
    } else if (highlightOn) {
      this.player.playerHighlightOn();
    }
    this.taskHelper.executeSimulation(this, stateInputData, highlightOn);
  };

  checkObjectPositions(): boolean {
    const isPlayerAt155265 = this.scene.children.list.some(
      (child) => child instanceof Player && child.x === 155 && child.y === 265
    );
    const areWallsCorrect = wallPositions.every((pos) =>
      this.scene.children.list.some(
        (child) =>
          child instanceof Wall && child.x === pos.x && child.y === pos.y
      )
    );

    const isStarOBjectExist = this.scene.children.list.some(
      (child) => child instanceof Star
    );

    console.log(
      'isPlayerAt155265',
      isPlayerAt155265,
      'areWallsCorrect',
      areWallsCorrect,
      'isStarOBjectExist',
      isStarOBjectExist
    );
    return isPlayerAt155265 && areWallsCorrect && !isStarOBjectExist;
  }

  getSuccessMessage = (): string => {
    this.taskHelper.setIsSuccessPopupShowed = true;
    return `" Awesome! \n  Mission achieved! "`;
  };

  getFailureMessage = (): string => {
    return `" Not the result we wanted.\n   Want to go again? "`;
  };
}

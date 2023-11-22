import Phaser from 'phaser';
import Player from '../classes/sprites/Player';
import Star from '../classes/sprites/Star';
import Wall from '../classes/sprites/Wall';
import SimulationHighlight from '../classes/SimulationHighlight';
import DiagramScene from '../scenes/DiagramScene';
import { StateInput } from '../classes/InputManager';
import TaskHelper from './\bTaskHelper';

type State = {
  id: number;
  stateInputs: StateInput[];
};

export default class Stars extends Phaser.GameObjects.Container {
  private taskHelper!: TaskHelper;
  private player!: Player;
  private star1!: Star;
  private star2!: Star;
  private wall!: Wall;
  private missionInfoContainer!: Phaser.GameObjects.Container;

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

  restartSimulation = (stateInputData: any, highlightOn: boolean) => {
    this.player.cleanUpStars();
    this.player.setPosition(155, 315);
    this.player.playerHighlight.setPosition(155, 315);

    this.star1 = new Star(this.scene, 205, 315);
    this.star2 = new Star(this.scene, 305, 315);
    this.scene.add.existing(this.star1);
    this.scene.add.existing(this.star2);

    this.processStateInputData(stateInputData, highlightOn);
  };

  processStateInputData = (stateInputData: any, highlightOn: boolean) => {
    this.taskHelper.processStateInputData(stateInputData, highlightOn, () => {
      const positionsCorrect = this.checkObjectPositions();
      console.log(positionsCorrect ? 'Success' : 'Fail');
    });
  };

  private checkObjectPositions(): boolean {
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

  createMissonInfoContainer = () => {
    this.missionInfoContainer = this.scene.add.container(
      this.scene.cameras.main.centerX,
      this.scene.cameras.main.centerY
    );
  };
}

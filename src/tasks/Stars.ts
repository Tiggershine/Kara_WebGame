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
  private taskHelper: TaskHelper;
  private player!: Player;
  private star1!: Star;
  private star2!: Star;
  private wall!: Wall;
  isPaused: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    // const diagramScene = this.scene.scene.get('DiagramScene') as DiagramScene;

    this.player = new Player(this.scene, 155, 315);
    this.player.setAngle(90);
    this.star1 = new Star(this.scene, 205, 315);
    this.star2 = new Star(this.scene, 305, 315);
    this.wall = new Wall(this.scene, 405, 315);

    this.taskHelper = new TaskHelper(scene, this.player);

    scene.add.existing(this.player);
    scene.add.existing(this.star1);
    scene.add.existing(this.star2);
    scene.add.existing(this.wall);
  }

  processStateInputData = (
    stateInputData: any,
    hightlightSelected: boolean
  ) => {
    this.taskHelper.processStateInputData(
      stateInputData,
      hightlightSelected,
      () => {
        const positionsCorrect = this.checkObjectPositions();
        console.log(positionsCorrect ? 'Success' : 'Fail');
      }
    );
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

  pauseSimulation() {
    this.isPaused = true;
  }

  resumeSimulation() {
    this.isPaused = false;
    // this.processStateInputData(this.stateInputData);
  }
}

const conditionInputPoints = [
  { key: '11', x: 580, y: 490 },
  { key: '12', x: 630, y: 490 },
  { key: '13', x: 680, y: 490 },
  { key: '14', x: 730, y: 490 },
  { key: '21', x: 580, y: 555 },
  { key: '22', x: 630, y: 555 },
  { key: '23', x: 680, y: 555 },
  { key: '24', x: 730, y: 555 },
  { key: '31', x: 580, y: 620 },
  { key: '32', x: 630, y: 620 },
  { key: '33', x: 680, y: 620 },
  { key: '34', x: 730, y: 620 },
  { key: '41', x: 580, y: 685 },
  { key: '42', x: 630, y: 685 },
  { key: '43', x: 680, y: 685 },
  { key: '44', x: 730, y: 685 },
  { key: '51', x: 580, y: 750 },
  { key: '52', x: 630, y: 750 },
  { key: '53', x: 680, y: 750 },
  { key: '54', x: 730, y: 750 },
];

const moveInputPoints = [
  { key: '15', x: 785, y: 490 },
  { key: '16', x: 835, y: 490 },
  { key: '17', x: 885, y: 490 },
  { key: '18', x: 935, y: 490 },
  { key: '25', x: 785, y: 555 },
  { key: '26', x: 835, y: 555 },
  { key: '27', x: 885, y: 555 },
  { key: '28', x: 935, y: 555 },
  { key: '35', x: 785, y: 620 },
  { key: '36', x: 835, y: 620 },
  { key: '37', x: 885, y: 620 },
  { key: '38', x: 935, y: 620 },
  { key: '45', x: 785, y: 685 },
  { key: '46', x: 835, y: 685 },
  { key: '47', x: 885, y: 685 },
  { key: '48', x: 935, y: 685 },
  { key: '55', x: 785, y: 750 },
  { key: '56', x: 835, y: 750 },
  { key: '57', x: 885, y: 750 },
  { key: '58', x: 935, y: 750 },
];

const nextStatePoints = [
  { key: '19', x: 1005, y: 488 },
  { key: '29', x: 1005, y: 553 },
  { key: '39', x: 1005, y: 618 },
  { key: '49', x: 1005, y: 683 },
  { key: '59', x: 1005, y: 748 },
];

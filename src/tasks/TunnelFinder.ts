import Phaser from 'phaser';
import Player from '../classes/sprites/Player';
import Wall from '../classes/sprites/Wall';
import TaskHelper from '../classes/TaskHelper';
import DiagramScene from '../scenes/DiagramScene';
import PopupWindow from '../classes/PopupWindow';

type SensorCheck = {
  sensor: number;
  condition: number;
};

type StateInput = {
  sensorChecks: SensorCheck[];
  moves: number[];
  nextStateId: number;
};

type State = {
  id: number;
  stateInputs: StateInput[];
};

const stateInputData = [
  {
    id: 0,
    stateInputs: [{ sensorChecks: [], moves: [], nextStateId: 1 }],
  },
  {
    id: 1, // Entrance
    stateInputs: [
      {
        sensorChecks: [
          { sensor: 1, condition: 1 },
          { sensor: 2, condition: 1 },
        ],
        moves: [3],
        nextStateId: 1,
      },
      {
        sensorChecks: [
          { sensor: 1, condition: 1 },
          { sensor: 2, condition: 0 },
        ],
        moves: [3],
        nextStateId: 1,
      },
      {
        sensorChecks: [
          { sensor: 1, condition: 0 },
          { sensor: 2, condition: 1 },
        ],
        moves: [3],
        nextStateId: 1,
      },
      {
        sensorChecks: [
          { sensor: 1, condition: 0 },
          { sensor: 2, condition: 0 },
        ],
        moves: [],
        nextStateId: 2,
      },
    ],
  },
  {
    id: 2, // frontWall
    stateInputs: [
      {
        sensorChecks: [
          { sensor: 1, condition: 1 },
          { sensor: 2, condition: 1 },
        ],
        moves: [],
        nextStateId: 100,
      },
      {
        sensorChecks: [
          { sensor: 1, condition: 1 },
          { sensor: 2, condition: 0 },
        ],
        moves: [],
        nextStateId: 100,
      },
      {
        sensorChecks: [
          { sensor: 1, condition: 0 },
          { sensor: 2, condition: 1 },
        ],
        moves: [],
        nextStateId: 100,
      },
      {
        sensorChecks: [
          { sensor: 1, condition: 0 },
          { sensor: 2, condition: 0 },
        ],
        moves: [3],
        nextStateId: 2,
      },
    ],
  },
  {
    id: 100,
    stateInputs: [{ sensorChecks: [], moves: [], nextStateId: 101 }],
  },
];

export default class TunnelFinder extends Phaser.GameObjects.Container {
  private taskHelper: TaskHelper;
  private player!: Player;
  private wall1!: Wall;
  private wall2!: Wall;
  private wall3!: Wall;
  private wall4!: Wall;
  private wall5!: Wall;
  private wall6!: Wall;
  private wall7!: Wall;
  private wall8!: Wall;
  private wall9!: Wall;
  private wall10!: Wall;
  private wall11!: Wall;
  private wall12!: Wall;
  private isSuccessPopupShowed: boolean = false;

  // private stateInputData: any;
  // private inputDataChecked: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.player = new Player(this.scene, 55, 315);
    this.player.setAngle(90);
    this.wall1 = new Wall(this.scene, 105, 265);
    this.wall2 = new Wall(this.scene, 155, 265);
    this.wall3 = new Wall(this.scene, 205, 265);
    this.wall4 = new Wall(this.scene, 255, 265);
    this.wall5 = new Wall(this.scene, 305, 265);
    this.wall6 = new Wall(this.scene, 205, 365);
    this.wall7 = new Wall(this.scene, 255, 365);
    this.wall8 = new Wall(this.scene, 305, 365);
    this.wall9 = new Wall(this.scene, 355, 365);
    this.wall10 = new Wall(this.scene, 405, 365);
    this.wall11 = new Wall(this.scene, 455, 365);

    this.taskHelper = new TaskHelper(scene, this.player);

    scene.add.existing(this.player);
    scene.add.existing(this.wall1);
    scene.add.existing(this.wall2);
    scene.add.existing(this.wall3);
    scene.add.existing(this.wall4);
    scene.add.existing(this.wall5);
    scene.add.existing(this.wall6);
    scene.add.existing(this.wall7);
    scene.add.existing(this.wall8);
    scene.add.existing(this.wall9);
    scene.add.existing(this.wall10);
    scene.add.existing(this.wall11);

    // this.stateInputData = stateInputData;
  }

  restartSimulation = (stateInputData: any, highlightOn: boolean) => {
    this.player.cleanUpStars();
    this.player.setPosition(55, 315);

    this.processStateInputData(stateInputData, highlightOn);
  };

  processStateInputData = (stateInputData: any, highlightOn: boolean) => {
    this.taskHelper.processStateInputData(stateInputData, highlightOn, () => {
      const positionsCorrect = this.checkObjectPositions();

      console.log('this.isSuccessPopupShowed', this.isSuccessPopupShowed);
      if (!this.isSuccessPopupShowed) {
        if (positionsCorrect) {
          const diagramScene = this.scene.scene.get(
            'DiagramScene'
          ) as DiagramScene;

          setTimeout(() => {
            diagramScene.popupWindow = new PopupWindow(
              diagramScene,
              'smBack',
              `" Great job! \n  Let's take on the next mission. "`,
              false
            );
            diagramScene.popupWindow.create();
            diagramScene.add.existing(diagramScene.popupWindow);
          }, 800);

          this.isSuccessPopupShowed = true;
        } else {
          const diagramScene = this.scene.scene.get(
            'DiagramScene'
          ) as DiagramScene;

          setTimeout(() => {
            diagramScene.popupWindow = new PopupWindow(
              diagramScene,
              'smBack',
              `" So close! \n  Would you like to try again? "`,
              false
            );
            diagramScene.popupWindow.create();
            diagramScene.add.existing(diagramScene.popupWindow);
          }, 800);

          this.isSuccessPopupShowed = true;
        }
      }
      console.log(positionsCorrect ? 'Success' : 'Fail');
    });
  };

  private checkObjectPositions(): boolean {
    const isPlayerAt355315 = this.scene.children.list.some(
      (child) => child instanceof Player && child.x === 355 && child.y === 315
    );

    return isPlayerAt355315;
  }
}

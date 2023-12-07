import Phaser from 'phaser';
import Player from '../classes/sprites/Player';
import Wall from '../classes/sprites/Wall';
import Star from '../classes/sprites/Star';
import TaskHelper from '../classes/TaskHelper';

type SensorCheck = {
  sensor: number;
  condition: number;
};

const wallPositions = [
  { x: 105, y: 265 },
  { x: 155, y: 265 },
  { x: 205, y: 265 },
  { x: 255, y: 265 },
  { x: 305, y: 265 },
  { x: 205, y: 365 },
  { x: 255, y: 365 },
  { x: 305, y: 365 },
  { x: 355, y: 365 },
  { x: 405, y: 365 },
  { x: 455, y: 365 },
];

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
  private walls!: Wall[];
  private star!: Star;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.player = new Player(this.scene, 55, 315);
    this.player.setAngle(90);

    this.walls = wallPositions.map((pos) => new Wall(this.scene, pos.x, pos.y));
    this.walls.forEach((wall) => scene.add.existing(wall));

    this.star = new Star(this.scene, 355, 315);

    this.taskHelper = new TaskHelper(scene, this.player);

    scene.add.existing(this.player);
    scene.add.existing(this.star);
  }

  reoranizeGameObjects = () => {
    this.player.cleanUpStars();
    this.player.setPosition(55, 315);

    this.star = new Star(this.scene, 355, 315);
    this.scene.add.existing(this.star);
  };

  restartSimulation = (stateInputData: any, highlightOn: boolean) => {
    this.reoranizeGameObjects();
    this.startSimulation(stateInputData, highlightOn);
  };

  startSimulation = (stateInputData: any, highlightOn: boolean) => {
    this.taskHelper.executeSimulation(this, stateInputData, highlightOn);
  };

  // executeSimulation = (stateInputData: any, highlightOn: boolean) => {
  //   this.taskHelper.processStateInputData(stateInputData, highlightOn, () => {
  //     if (this.taskHelper.wasInfiniteLoopDetected()) {
  //       // Display infinite loop warning popup
  //       setTimeout(() => {
  //         const diagramScene = this.scene.scene.get(
  //           'DiagramScene'
  //         ) as DiagramScene;
  //         diagramScene.popupWindow = new PopupWindow(
  //           diagramScene,
  //           'smAlert',
  //           `" Oops! \n  Looks like we're going in circles! \n  Check your instructions again.    "`,
  //           false
  //         );
  //         diagramScene.popupWindow.create();
  //         diagramScene.add.existing(diagramScene.popupWindow);
  //       }, 800);
  //     } else {
  //       const positionsCorrect = this.checkObjectPositions();

  //       console.log('this.isSuccessPopupShowed', this.isSuccessPopupShowed);
  //       if (!this.isSuccessPopupShowed) {
  //         if (positionsCorrect) {
  //           const diagramScene = this.scene.scene.get(
  //             'DiagramScene'
  //           ) as DiagramScene;

  //           setTimeout(() => {
  //             diagramScene.popupWindow = new PopupWindow(
  //               diagramScene,
  //               'sm',
  //               `" Great job! \n  Let's take on the next mission. "`,
  //               false
  //             );
  //             diagramScene.popupWindow.create();
  //             diagramScene.add.existing(diagramScene.popupWindow);
  //           }, 800);

  //           this.isSuccessPopupShowed = true;
  //         } else {
  //           const diagramScene = this.scene.scene.get(
  //             'DiagramScene'
  //           ) as DiagramScene;

  //           setTimeout(() => {
  //             diagramScene.popupWindow = new PopupWindow(
  //               diagramScene,
  //               'smAlert',
  //               `" That didn't work out.\n   Ready for another try? "`,
  //               false
  //             );
  //             diagramScene.popupWindow.create();
  //             diagramScene.add.existing(diagramScene.popupWindow);
  //           }, 800);
  //         }
  //       }
  //       this.scene.events.emit('simulationEnd');
  //       console.log(positionsCorrect ? 'Success' : 'Fail');
  //     }
  //   });
  // };

  checkObjectPositions(): boolean {
    const isPlayerAt355315 = this.scene.children.list.some(
      (child) => child instanceof Player && child.x === 355 && child.y === 315
    );
    // const areWallsCorrect = wallPositions.every((pos) => {
    //   this.scene.children.list.some(
    //     (child) =>
    //       child instanceof Wall && child.x === pos.x && child.y === pos.y
    //   );
    // });
    const isStarOBjectExist = this.scene.children.list.some(
      (child) => child instanceof Star
    );
    console.log(
      'isPlayerAt355315: ',
      isPlayerAt355315,
      'isStarOBjectExist: ',
      isStarOBjectExist
    );

    return isPlayerAt355315 && !isStarOBjectExist;
  }

  getSuccessMessage = (): string => {
    this.taskHelper.setIsSuccessPopupShowed = true;
    return `" Great job! \n  Let's take on the next mission. "`;
  };

  getFailureMessage = (): string => {
    return `" That didn't work out.\n   Ready for another try? "`;
  };
}

import Phaser from 'phaser';
import Player from '../classes/sprites/Player';
import Star from '../classes/sprites/Star';
import Wall from '../classes/sprites/Wall';

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

  private stateInputData: any;
  private inputDataChecked: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.player = new Player(this.scene, 25, 225);
    this.wall1 = new Wall(this.scene, 75, 175);
    this.wall2 = new Wall(this.scene, 125, 175);
    this.wall3 = new Wall(this.scene, 175, 175);
    this.wall4 = new Wall(this.scene, 225, 175);
    this.wall5 = new Wall(this.scene, 275, 175);
    this.wall6 = new Wall(this.scene, 3255, 175);
    this.wall7 = new Wall(this.scene, 175, 275);
    this.wall8 = new Wall(this.scene, 225, 275);
    this.wall9 = new Wall(this.scene, 275, 275);
    this.wall10 = new Wall(this.scene, 325, 275);
    this.wall11 = new Wall(this.scene, 375, 275);
    this.wall12 = new Wall(this.scene, 425, 275);

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
    scene.add.existing(this.wall12);

    this.stateInputData = stateInputData;
  }
  processStateInputData = async () => {
    if (!this.inputDataChecked) {
      const startState = this.stateInputData.find(
        (state: State) => state.id === 0
      );

      let currentStateId = startState.stateInputs[0].nextStateId; // Start 다음 State로 Init (1번 State)
      console.log('currentStateId', currentStateId);

      while (currentStateId !== 100) {
        const currentState = this.stateInputData.find(
          (state: State) => state.id === currentStateId
        );
        if (!currentState) {
          console.error('Invalid state id:', currentStateId);
          break;
        }
        let nextStateId = null;
        let sensorCheckPassed: boolean = false;

        for (const stateInput of currentState.stateInputs) {
          sensorCheckPassed = stateInput.sensorChecks.every(
            (sensorCheck: SensorCheck) => {
              const sensorValue = this.sensorCheck(sensorCheck.sensor);
              if (sensorCheck.condition === 0) {
                return sensorCheck.condition === 0 && sensorValue;
              } else if (sensorCheck.condition === 1) {
                return sensorCheck.condition === 1 && !sensorValue;
              }
            }
          );
          console.log('sensorCheckPassed: ', sensorCheckPassed);

          if (sensorCheckPassed) {
            for (const move of stateInput.moves) {
              console.log('move: ', move);
              await this.executeMove(move);
            }
            // nextStateId = stateInput.nextStateId;
            currentStateId = stateInput.nextStateId;
            console.log('새로운 currentStateId: ', currentStateId);

            break;
          }
        }
      }

      console.log('완료');
      this.inputDataChecked = true;
      return;
    }
  };

  // executeMoves(moveIds: number[]) {
  //   // TODO: Implement move execution logic based on moveIds
  //   // For example, you can move the player, change the player's state, etc.
  // }

  // Sensor Check (0 - 4)
  sensorCheck(sensorId: number): boolean {
    switch (sensorId) {
      case 0: {
        let result: boolean = false;
        result = this.player.wallFrontCheck();
        console.log('wallFrontCheck triggerd', 'result: ', result);
        return result;
      }
      case 1: {
        let result: boolean = false;
        result = this.player.wallLeftCheck();
        console.log('wallLeftCheck triggerd', 'result: ', result);
        return result;
      }
      case 2: {
        let result: boolean = false;
        result = this.player.wallRightCheck();
        console.log('wallRightCheck triggerd', 'result: ', result);
        return result;
      }
      case 3: {
        let result: boolean = false;
        result = this.player.monsterFrontCheck();
        console.log('monsterFrontCheck triggerd', 'result: ', result);
        return result;
      }
      case 4: {
        let result: boolean = false;
        result = this.player.starBottomcheck();
        console.log('starBottomcheck triggerd', 'result: ', result);
        return result;
      }
      default:
        return false;
    }
  }

  executeMove = async (moveId: number): Promise<void> => {
    switch (moveId) {
      case 3:
        await this.player.moveForward();
        console.log('moveForward');
        break;
      case 4:
        await this.player.turnLeft();
        console.log('turnLeft');
        break;
      case 5:
        await this.player.turnRight();
        console.log('turnRight');
        break;
      case 6:
        await this.player.putStar();
        console.log('putStar');
        break;
      case 7:
        await this.player.pickStar();
        console.log('pickStar');
        break;
      default:
        break;
    }
  };
}

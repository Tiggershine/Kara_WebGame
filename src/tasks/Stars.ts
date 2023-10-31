import Phaser from 'phaser';
import Player from '../classes/sprites/Player';
import Star from '../classes/sprites/Star';
import Wall from '../classes/sprites/Wall';
import { StateInput } from '../classes/InputManager';
import StateCircle from '../classes/StateCircle';

// const startState = {
//   id: 0,
//   stateInputs: [{ sensorChecks: [], move: [], nextState: 1 }],
// };
// const bottomStar = {
//   id: 1,
//   stateInputs: [
//     { sensorChecks: [{ sensor: 4, condition: 0 }], move: [7], nextState: 2 },
//     { sensorChecks: [{ sensor: 4, condition: 1 }], move: [6], nextState: 2 },
//   ],
// };
// const frontWall = {
//   id: 2,
//   stateInputs: [
//     { sensorChecks: [{ sensor: 0, condition: 1 }], move: [3], nextState: 1 },
//     { sensorChecks: [{ sensor: 0, condition: 0 }], move: [3], nextState: 3 },
//   ],
// };
// const endState = {
//   id: 4,
//   stateInputs: [{ sensorChecks: [], move: [], nextState: 100 }],
// };

const stateInputData = [
  {
    id: 0,
    stateInputs: [{ sensorChecks: [], move: [], nextStateId: 1 }],
  },
  {
    id: 1,
    stateInputs: [
      {
        sensorChecks: [{ sensor: 4, condition: 0 }],
        move: [7],
        nextStateId: 2,
      },
      {
        sensorChecks: [{ sensor: 4, condition: 1 }],
        move: [6],
        nextStateId: 2,
      },
    ],
  },
  {
    id: 2,
    stateInputs: [
      {
        sensorChecks: [{ sensor: 0, condition: 1 }],
        move: [3],
        nextStateId: 1,
      },
      {
        sensorChecks: [{ sensor: 0, condition: 0 }],
        move: [3],
        nextStateId: 3,
      },
    ],
  },
  {
    id: 3,
    stateInputs: [{ sensorChecks: [], move: [], nextStateId: 100 }],
  },
];
export default class Stars extends Phaser.GameObjects.Container {
  private player!: Phaser.GameObjects.Sprite;
  private star1!: Phaser.GameObjects.Sprite;
  private star2!: Phaser.GameObjects.Sprite;
  private wall!: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.player = new Player(this.scene, 125, 225);
    this.star1 = new Star(this.scene, 175, 225);
    this.star2 = new Star(this.scene, 275, 225);
    this.wall = new Wall(this.scene, 375, 225);

    scene.add.existing(this.player);
    scene.add.existing(this.star1);
    scene.add.existing(this.star2);
    scene.add.existing(this.wall);
  }

  processStateInputData(stateInputData: any) {
    let currentStateId = 0;

    while (currentStateId !== 100) {
      const currentState = stateInputData.find(
        (state: any) => state.id === currentStateId
      );

      if (!currentState) {
        console.error('Invalid state id:', currentStateId);
        break;
      }

      let nextStateId = null;

      for (const stateInput of currentState.stateInputs) {
        const sensorChecksPassed = stateInput.sensorChecks.every(
          (sensorCheck: any) => {
            const sensorValue = this.getSensorValue(sensorCheck.sensor);
            return sensorValue === sensorCheck.condition;
          }
        );

        if (sensorChecksPassed) {
          nextStateId = stateInput.nextState;
          this.executeMoves(stateInput.move);
          break;
        }
      }

      if (nextStateId === null) {
        console.error(
          'No valid nextStateId found for state id:',
          currentStateId
        );
        break;
      }

      currentStateId = nextStateId;
    }
  }

  getSensorValue(sensorId: number) {
    // TODO: Implement sensor value retrieval logic based on sensorId
    // For example, you can check the player's position, state, etc.
    return 0; // Placeholder value
  }

  executeMoves(moveIds: number[]) {
    // TODO: Implement move execution logic based on moveIds
    // For example, you can move the player, change the player's state, etc.
  }

  sensorCheck(player: Player, sensor: number) {
    switch (sensor) {
      case 0: {
        const result: boolean = false;
      }
    }
  }
}

import Phaser from 'phaser';
import Player from '../classes/sprites/Player';
import Star from '../classes/sprites/Star';
import Wall from '../classes/sprites/Wall';
import StateCircle from '../classes/StateCircle';
// import { SensorCheck, StateInput } from '../classes/InputManager';

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
    id: 1,
    stateInputs: [
      {
        sensorChecks: [{ sensor: 4, condition: 0 }],
        moves: [7],
        nextStateId: 2,
      },
      {
        sensorChecks: [{ sensor: 4, condition: 1 }],
        moves: [6],
        nextStateId: 2,
      },
    ],
  },
  {
    id: 2,
    stateInputs: [
      {
        sensorChecks: [{ sensor: 0, condition: 1 }],
        moves: [3],
        nextStateId: 1,
      },
      {
        sensorChecks: [{ sensor: 0, condition: 0 }],
        moves: [3],
        nextStateId: 3,
      },
    ],
  },
  {
    id: 3,
    stateInputs: [{ sensorChecks: [], moves: [], nextStateId: 5 }],
  },
];
export default class Stars extends Phaser.GameObjects.Container {
  private player!: Player;
  private star1!: Star;
  private star2!: Star;
  private wall!: Wall;
  private stateInputData: any;
  private inputDataChecked: boolean = false;

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

    this.stateInputData = stateInputData;
  }

  processStateInputData() {
    if (!this.inputDataChecked) {
      const startState = this.stateInputData.find(
        (state: State) => state.id === 0
      );

      let currentStateId = startState.stateInputs[0].nextStateId; // Start 다음 State로 init (1번 State)
      console.log('currentStateId', currentStateId);

      // while (currentStateId !== 5) {
      const currentState = this.stateInputData.find(
        (state: State) => state.id === currentStateId
      );

      if (!currentState) {
        console.error('Invalid state id:', currentStateId);
        // break;
      }

      let nextStateId = null;
      let sensorCheckPassed: boolean = false;

      for (const stateInput of currentState.stateInputs) {
        stateInput.sensorChecks.some((sensorCheck: SensorCheck) => {
          const sensorValue = this.sensorCheck(sensorCheck.sensor);

          console.log(
            'sensorValue',
            sensorValue,
            'sensorCheck.condition:',
            sensorCheck.condition
          );

          if (sensorCheck.condition === 0) {
            console.log('(true)Condition: ', sensorCheck.condition);
            console.log(
              'sensorValue check(sensorValue is true): ',
              sensorCheck.condition === 0 && sensorValue
            );
            sensorCheckPassed = sensorCheck.condition === 0 && sensorValue;
          } else if (sensorCheck.condition === 1) {
            console.log('(false)Condition: ', sensorCheck.condition);
            console.log(
              'sensorValue check (sensSorValue is false): ',
              sensorCheck.condition === 1 && sensorValue
            );
            sensorCheckPassed = sensorCheck.condition === 1 && !sensorValue;
          }

          // if (sensorValue === true) {
          //   console.log('(true)Condition: ', sensorCheck.condition);
          //   console.log(
          //     'sensorValue check(sensorValue is true): ',
          //     (sensorCheck.condition === 0) === sensorValue
          //   );
          //   return (sensorCheck.condition === 0) === sensorValue;
          // } else {
          //   console.log('(false)Condition: ', sensorCheck.condition);
          //   console.log(
          //     'sensorValue check (sensSorValue is false): ',
          //     (sensorCheck.condition === 1) === sensorValue
          //   );
          //   return (sensorCheck.condition === 1) === sensorValue;
          // }
        });
        console.log('sensorCheckPassed: ', sensorCheckPassed);

        if (sensorCheckPassed) {
          nextStateId = stateInput.nextStateId;
          console.log('nextStateId: ', nextStateId);

          stateInput.moves.forEach((move: number) => {
            console.log('move: ', move);
            this.executeMove(move);
          });
          break;
        }
      }
      // }

      this.inputDataChecked = true;
      return;
    }

    // while (currentStateId !== 100) {
    //   const currentState = this.stateInputData.find(
    //     (state: any) => state.id === currentStateId
    //   );

    //   if (!currentState) {
    //     console.error('Invalid state id:', currentStateId);
    //     break;
    //   }

    //   let nextStateId = null;

    //   for (const stateInput of currentState.stateInputs) {
    //     const sensorChecksPassed = stateInput.sensorChecks.every(
    //       (sensorCheck: any) => {
    //         const sensorValue = this.sensorCheck(
    //           this.player,
    //           sensorCheck.sensor
    //         );

    //         if (sensorValue === true) {
    //           return (sensorCheck.condition === 0) === sensorValue;
    //         } else {
    //           return (sensorCheck.condition === 1) === sensorValue;
    //         }
    //       }
    //     );

    //     if (sensorChecksPassed) {
    //       nextStateId = stateInput.nextState;

    //       stateInput.moves.forEach((move: number) => {
    //         this.executeMove(move);
    //       });

    //       // this.executeMoves(stateInput.move);
    //       // break;
    //     }
    //   }

    //   if (nextStateId !== null) {
    //     currentStateId = nextStateId;
    //   } else {
    //     console.error(
    //       'No valid nextStateId found for state id:',
    //       currentStateId
    //     );
    //     break;
    //   }
    // }
  }

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

  executeMove = (moveId: number): void => {
    switch (moveId) {
      case 3:
        this.player.moveForward();
        break;
      case 4:
        this.player.turnLeft();
        break;
      case 5:
        this.player.turnRight();
        break;
      case 6:
        this.player.putStar();
        break;
      case 7:
        this.player.pickStar();
        break;
      default:
        break;
    }
  };
}

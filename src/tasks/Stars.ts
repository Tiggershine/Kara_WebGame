import Phaser from 'phaser';
import Player from '../classes/sprites/Player';
import Star from '../classes/sprites/Star';
import Wall from '../classes/sprites/Wall';
import StateCircle from '../classes/StateCircle';

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
    id: 1, // bottomStar
    stateInputs: [
      {
        sensorChecks: [{ sensor: 4, condition: 0 }], // 아래에 별 있으면
        moves: [7], // pickStar
        nextStateId: 2,
      },
      {
        sensorChecks: [{ sensor: 4, condition: 1 }], // 아래에 별 없으면
        moves: [6], // putStar
        nextStateId: 2,
      },
    ],
  },
  {
    id: 2, // frontWall
    stateInputs: [
      {
        sensorChecks: [{ sensor: 0, condition: 1 }], // 벽 앞 X
        moves: [3], // forward
        nextStateId: 1,
      },
      {
        sensorChecks: [{ sensor: 0, condition: 0 }], // 벽 앞 O
        moves: [],
        nextStateId: 100, // stop
      },
    ],
  },
  {
    id: 100,
    stateInputs: [{ sensorChecks: [], moves: [], nextStateId: 101 }],
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
          sensorCheckPassed = stateInput.sensorChecks.some(
            (sensorCheck: SensorCheck) => {
              const sensorValue = this.sensorCheck(sensorCheck.sensor);
              if (sensorCheck.condition === 0) {
                return sensorCheck.condition === 0 && sensorValue;
              } else if (sensorCheck.condition === 1) {
                return sensorCheck.condition === 1 && !sensorValue;
              }
            }
          );

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

        // if (nextStateId !== null) {
        //   currentStateId = nextStateId;

        // } else {
        //   console.error(
        //     'No valid nextStateId found for state id:',
        //     currentStateId
        //   );
        //   break;
        // }
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

  // testCode = () => {
  //   for (let i = 0; i < 3; i++) {
  //     setTimeout(() => {
  //       this.player.moveForwardTest();
  //     });
  //   }
  // };
  testCode = async () => {
    for (let i = 0; i < 3; i++) {
      await this.player.moveForwardTest();
    }
  };

  // testCode = () => {
  //   this.executeMove(6);
  //   this.executeMove(3);
  //   this.executeMove(7);
  //   this.executeMove(3);
  //   this.executeMove(6);
  //   this.executeMove(3);
  //   this.executeMove(7);
  //   this.executeMove(3);
  //   this.executeMove(7);
  // };

  // executeMove = (moveId: number): void => {
  //   switch (moveId) {
  //     case 3:
  //       this.player.moveForward();
  //       console.log('moveForward');
  //       break;
  //     case 4:
  //       this.player.turnLeft();
  //       console.log('turnLeft');
  //       break;
  //     case 5:
  //       this.player.turnRight();
  //       console.log('turnRight');
  //       break;
  //     case 6:
  //       this.player.putStar();
  //       console.log('putStar');
  //       break;
  //     case 7:
  //       this.player.pickStar();
  //       console.log('pickStar');
  //       break;
  //     default:
  //       break;
  //   }
  // };

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

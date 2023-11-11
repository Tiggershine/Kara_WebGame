import Phaser from 'phaser';
import Player from '../classes/sprites/Player';
import Star from '../classes/sprites/Star';
import Wall from '../classes/sprites/Wall';
import StateCircle from '../classes/StateCircle';
import SimulationHighlight from '../classes/SimulationHighlight';
import DiagramScene from '../scenes/DiagramScene';

type SensorCheck = {
  sensor: number;
  condition: number;
};

type StateInput = {
  sensorChecks: SensorCheck[];
  move: number[];
  nextState: number;
};

type State = {
  id: number;
  stateInputs: StateInput[];
};

// const stateInputData = [
//   {
//     id: 0,
//     stateInputs: [{ sensorChecks: [], moves: [], nextStateId: 1 }],
//   },
//   {
//     id: 1, // bottomStar
//     stateInputs: [
//       {
//         sensorChecks: [{ sensor: 4, condition: 0 }], // 아래에 별 있으면
//         moves: [7], // pickStar
//         nextStateId: 2,
//       },
//       {
//         sensorChecks: [{ sensor: 4, condition: 1 }], // 아래에 별 없으면
//         moves: [6], // putStar
//         nextStateId: 2,
//       },
//     ],
//   },
//   {
//     id: 2, // frontWall
//     stateInputs: [
//       {
//         sensorChecks: [{ sensor: 0, condition: 1 }], // 벽 앞 X
//         moves: [3], // forward
//         nextStateId: 1,
//       },
//       {
//         sensorChecks: [{ sensor: 0, condition: 0 }], // 벽 앞 O
//         moves: [],
//         nextStateId: 100, // stop
//       },
//     ],
//   },
//   {
//     id: 100,
//     stateInputs: [{ sensorChecks: [], moves: [], nextStateId: 101 }],
//   },
// ];
export default class Stars extends Phaser.GameObjects.Container {
  private player!: Player;
  private star1!: Star;
  private star2!: Star;
  private wall!: Wall;
  private stateInputData: any;
  private inputDataChecked: boolean = false;
  private simulationHighlight!: SimulationHighlight;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    const diagramScene = this.scene.scene.get('DiagramScene') as DiagramScene;

    this.player = new Player(this.scene, 155, 315); // (125+30, 225+90)
    this.star1 = new Star(this.scene, 205, 315);
    this.star2 = new Star(this.scene, 305, 315);
    this.wall = new Wall(this.scene, 405, 315);

    scene.add.existing(this.player);
    scene.add.existing(this.star1);
    scene.add.existing(this.star2);
    scene.add.existing(this.wall);

    this.stateInputData = diagramScene.getSelectedCircle();

    this.simulationHighlight = new SimulationHighlight(
      this.scene,
      'inputHighlight'
    );
    this.simulationHighlight.setDepth(1000);

    // this.scene.events.on('updatedStateCircles', this.testConsole, this);

    // this.scene.events.on(
    //   'stateInputDataUpdated',
    //   this.handleStateInputDataUpdated,
    //   this
    // );
  }

  // Add this method to the Stars class to find a StateCircle by id
  private findStateCircleById(id: number) {
    const diagramScene = this.scene.scene.get('DiagramScene') as DiagramScene;
    const stateCircles = diagramScene.getStateCircles; // Assuming this is an array of StateCircle

    const correspondingStateCircle = diagramScene.getStateCircles.find(
      (stateCircle) => stateCircle.getId === id
    );

    correspondingStateCircle && correspondingStateCircle.emit('pointerdown');

    return;
  }

  // testConsole = () => {
  //   console.log('SSSTTTTAAAAARRR');
  // };

  // Handler for the 'stateInputDataUpdated' event
  handleStateInputDataUpdated = (id: number, newInputs: StateInput[]) => {
    // Find the state with the matching id and update its inputs
    const stateIndex = this.stateInputData.findIndex(
      (state: State) => state.id === id
    );
    if (stateIndex !== -1) {
      this.stateInputData[stateIndex].stateInputs = newInputs;
      console.log('(Stars.ts) stateInputData: ', this.stateInputData);
    }
    console.log('(Stars.ts) stateInputData: ', this.stateInputData);
  };

  processStateInputData = async (stateInputData: any) => {
    if (!this.inputDataChecked) {
      const startState = stateInputData.find((state: State) => state.id === 0);

      let currentStateId = startState.stateInputs[0].nextState; // Start 다음 State로 Init (1번 State)
      console.log('currentStateId', currentStateId);

      while (currentStateId !== 100) {
        const currentState = stateInputData.find(
          (state: State) => state.id === currentStateId
        );

        this.findStateCircleById(currentStateId);

        if (!currentState) {
          console.error('Invalid state id:', currentStateId);
          break;
        }
        // let nextStateId = null;
        let sensorCheckPassed: boolean = false;

        // for (const stateInput of currentState.stateInputs) {
        for (let i = 0; i < currentState.stateInputs.length; i++) {
          const stateInput = currentState.stateInputs[i];
          const simulationPrefix = (i + 1).toString(); // simulation 좌표 앞자리
          console.log('simulationPrefix: ', simulationPrefix);

          // sensorChecks 요소들이 현재 모두 만족하는지 검사 (만족하면 moves, nextState 실행하지)
          sensorCheckPassed = true;
          for (let j = 0; j < stateInput.sensorChecks.length; j++) {
            const simulationKey = simulationPrefix + (j + 1).toString(); // simulation 좌표 앞자리 + 뒷자리
            console.log('simulationKey: ', simulationKey);
            const simulationPoint = conditionInputPoints.find(
              (p) => p.key === simulationKey
            );

            const sensorValue = this.sensorCheck(
              stateInput.sensorChecks[j].sensor
            );
            if (stateInput.sensorChecks[j].condition === 0 && !sensorValue) {
              sensorCheckPassed = false;
              break;
            } else if (
              stateInput.sensorChecks[j].condition === 1 &&
              sensorValue
            ) {
              sensorCheckPassed = false;
              break;
            }

            if (simulationPoint) {
              console.log(
                'Condition Point: ',
                simulationPoint.x,
                simulationPoint.y
              );
              await this.simulationHighlight.moveImageTo(
                simulationPoint.x,
                simulationPoint.y
              );
            }
          }

          console.log('sensorCheckPassed: ', sensorCheckPassed);

          if (sensorCheckPassed) {
            for (let j = 0; j < stateInput.move.length; j++) {
              const move = stateInput.move[j];
              console.log('move: ', move);

              const simulationKey = simulationPrefix + (j + 5).toString();
              const simulationPoint = moveInputPoints.find(
                (p) => p.key === simulationKey
              );

              if (simulationPoint) {
                await this.simulationHighlight.moveImageTo(
                  simulationPoint.x,
                  simulationPoint.y
                );
              }
              await this.executeMove(move);
            }

            const nextStateSimulationKey = simulationPrefix + '9';
            const nextStateSimulationPoint = nextStatePoints.find(
              (p) => p.key === nextStateSimulationKey
            );
            if (nextStateSimulationPoint) {
              await this.simulationHighlight.moveImageTo(
                nextStateSimulationPoint.x,
                nextStateSimulationPoint.y
              );
            }

            // nextStateId = stateInput.nextStateId;
            currentStateId = stateInput.nextState;
            console.log('새로운 currentStateId: ', currentStateId);

            break;
          }
        }
      }

      const isStarAt155315 = this.scene.children.list.some(
        (child) => child instanceof Star && child.x === 155 && child.y === 315
      );
      const isStarAt255315 = this.scene.children.list.some(
        (child) => child instanceof Star && child.x === 255 && child.y === 315
      );
      const isStarAt3553155 = this.scene.children.list.some(
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

      console.log(isStarAt155315);
      console.log(isStarAt255315);
      console.log(isStarAt3553155);
      console.log(isPlayerAt355315);
      console.log(isWallAt405315);
      console.log(!isOtherObjectsExist);
      if (
        isStarAt155315 &&
        isStarAt255315 &&
        isStarAt3553155 &&
        isPlayerAt355315 &&
        isWallAt405315 &&
        !isOtherObjectsExist
      ) {
        console.log('Success');
      } else {
        console.log('Fail');
      }

      this.inputDataChecked = true;
      return;
    }
  };

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

  // moveImageTo(x: number, y: number): Promise<void> {
  //   return new Promise((resolve) => {
  //     this.showHighlight(this.x, this.y, x, y);
  //     this.scene.time.delayedCall(1000, resolve);
  //   });
  // }

  // showHighlight(x1: number, y1: number, x2: number, y2: number) {
  //   this.setPosition(x1, y1);
  //   this.setVisible(true);

  //   this.scene.tweens.add({
  //     targets: this,
  //     x: x2,
  //     y: y2,
  //     duration: 1000, // 이동하는데 걸리는 시간 (밀리초)
  //     ease: 'Linear', // 이동하는 방식
  //     // onComplete: () => {
  //     //   this.setVisible(false);
  //     // },
  //   });
  // }
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

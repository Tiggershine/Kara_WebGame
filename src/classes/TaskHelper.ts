import Phaser from 'phaser';
import Player from './sprites/Player';
import StateCircle from './StateCircle';
import SimulationHighlight from './SimulationHighlight';
import PopupWindow from './PopupWindow';
import DiagramScene from '../scenes/DiagramScene';
import { SensorCheck, StateInput } from './InputManager';

interface MissionInterface {
  checkObjectPositions(): boolean;
  getSuccessMessage(): string;
  getFailureMessage(): string;
}

type State = {
  id: number;
  stateInputs: StateInput[];
};

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

export default class TaskHelper {
  // private stateInputData: any;
  // private inputDataChecked: boolean;
  private simulationHighlight!: SimulationHighlight;
  private scene!: Phaser.Scene;
  private player: Player;
  private infiniteLoopDetected: boolean = false;
  private isSuccessPopupShowed: boolean = false;
  private isSimulationRunning: boolean = false; // Simulation 멈춤을 위한 Sign

  constructor(scene: Phaser.Scene, player: Player) {
    this.scene = scene;
    this.player = player;

    const diagramScene = scene.scene.get('DiagramScene') as DiagramScene;
    diagramScene.events.on(
      'simulationRunningStatus',
      this.updateSimulationStatus
    );

    this.simulationHighlight = new SimulationHighlight(scene, 'inputHighlight');
    this.simulationHighlight.setDepth(10);
  }

  get getIsSuccessPopupShowed(): boolean {
    return this.isSuccessPopupShowed;
  }
  set setIsSuccessPopupShowed(newIsSuccessPopupShowed: boolean) {
    this.isSuccessPopupShowed = newIsSuccessPopupShowed;
  }

  updateSimulationStatus = (simulationStatus: boolean) => {
    this.isSimulationRunning = simulationStatus;
  };

  // To simulate ths mission based on user input
  processStateInputData = async (
    stateInputData: any,
    hightlightSelected: boolean,
    callbackFunction?: () => void
  ) => {
    const diagramScene = this.scene.scene.get('DiagramScene') as DiagramScene;
    // TODO: DELETE UNDER TEST CODE
    // console.log('stateInputData: ', stateInputData);
    // Reset the flag at the start of the function
    this.infiniteLoopDetected = false;

    const startState = stateInputData.find((state: State) => state.id === 0);

    let currentStateId = startState.stateInputs[0].nextState; // Start의 NextState로 Init (1번 State)
    // console.log('currentStateId', currentStateId);

    let previousStateId = null;
    let sameStateCount = 0;
    const maxSameStateCount = 30; // Threshold for the same state repetition
    let stateTransitionCounts: { [key: string]: number } = {}; // 상태 전환 추적 객체

    // Set PlayerHighlight
    // if (!hightlightSelected && this.player.getPlayerHighlight) {
    //   this.player.playerHighlightOff();
    // } else if (hightlightSelected) {
    //   this.player.playerHighlightOn();
    // }

    while (currentStateId !== 100 && this.isSimulationRunning) {
      // console.log('this.isSimulationRunning', this.isSimulationRunning);
      // 한 State를 계속해서 loop하는지 검사하는 코드
      if (currentStateId === previousStateId) {
        sameStateCount++;
        if (sameStateCount >= maxSameStateCount) {
          this.infiniteLoopDetected = true; // Set the flag
          console.error('Infinite loop detected in processStateInputData.');
          break; // Exit the loop if the threshold is reached
        }
      } else {
        sameStateCount = 0; // Reset the counter if a different state is encountered
      }

      // Next state를 거쳐 다시 self state로 돌아오고 이게 반복되는지 검사하는 코드
      // 상태 전환 기록
      const transitionKey = `${previousStateId}-${currentStateId}`;
      if (stateTransitionCounts[transitionKey]) {
        stateTransitionCounts[transitionKey]++;
      } else {
        stateTransitionCounts[transitionKey] = 1;
      }

      // 두 상태 간의 이동이 임계값을 초과하는지 확인
      if (stateTransitionCounts[transitionKey] >= maxSameStateCount) {
        this.infiniteLoopDetected = true;
        console.error(
          'Infinite loop detected between two states in processStateInputData.'
        );
        break;
      }

      const currentState: State = stateInputData.find(
        (state: State) => state.id === currentStateId
      );

      if (!currentState) {
        // console.error('Invalid state id:', currentStateId);
        break;
      }

      this.findStateCircleByIdSelect(this.scene, currentStateId); // pointerdown the found StateCircle

      // let nextStateId = null;
      let sensorCheckPassed: boolean = false;

      for (let i = 0; i < currentState.stateInputs.length; i++) {
        const stateInput = currentState.stateInputs[i];
        const simulationPrefix = (i + 1).toString(); // simulation 좌표 앞자리
        // console.log('simulationPrefix: ', simulationPrefix);

        // sensorChecks 요소들이 현재 모두 만족하는지 검사 (만족하면 moves, nextState 실행하지)
        sensorCheckPassed = true;
        for (let j = 0; j < stateInput.sensorChecks.length; j++) {
          const simulationKey = simulationPrefix + (j + 1).toString(); // simulation 좌표 앞자리 + 뒷자리
          const simulationPoint = conditionInputPoints.find(
            (p) => p.key === simulationKey
          );

          const sensorValue = this.sensorCheck(
            this.player,
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

          if (hightlightSelected && simulationPoint) {
            this.simulationHighlight.simulationHighlightOn();
            await this.simulationHighlight.moveImageTo(
              simulationPoint.x,
              simulationPoint.y
            );
          }
        }

        if (sensorCheckPassed) {
          for (let j = 0; j < stateInput.move.length; j++) {
            const move = stateInput.move[j];
            // console.log('move: ', move);

            const simulationKey = simulationPrefix + (j + 5).toString();
            const simulationPoint = moveInputPoints.find(
              (p) => p.key === simulationKey
            );

            if (hightlightSelected && simulationPoint) {
              await this.simulationHighlight.moveImageTo(
                simulationPoint.x,
                simulationPoint.y
              );
            }
            // let moveSuccessful: boolean = await this.executeMove(
            //   this.player,
            //   move
            // );
            // if (!moveSuccessful) {
            //   this.scene.sound.play('mistakeSound', { volume: 0.5 });
            //   setTimeout(() => {
            //     const diagramScene = this.scene.scene.get(
            //       'DiagramScene'
            //     ) as DiagramScene;
            //     diagramScene.popupWindow = new PopupWindow(
            //       diagramScene,
            //       'smBoundary',
            //       false
            //     );
            //     diagramScene.popupWindow.create();
            //     diagramScene.add.existing(diagramScene.popupWindow);
            //   }, 500);
            //   console.log('경계선을 넘어갈 수 없음');
            //   this.scene.events.emit('simulationEnd');
            //   return;
            // }
            let moveResult = await this.executeMove(this.player, move);
            if (moveResult !== 'success') {
              this.scene.sound.play('mistakeSound', { volume: 0.5 });
              setTimeout(() => {
                const diagramScene = this.scene.scene.get(
                  'DiagramScene'
                ) as DiagramScene;
                let popupType =
                  moveResult === 'wallError' ? 'smWall' : 'smBoundary';
                diagramScene.popupWindow = new PopupWindow(
                  diagramScene,
                  popupType,
                  false
                );
                diagramScene.popupWindow.create();
                diagramScene.add.existing(diagramScene.popupWindow);
              }, 500);
              console.log(
                moveResult === 'wallError'
                  ? 'WallError detected!'
                  : 'BoundaryError detected'
              );
              this.player.playerHighlightOff();
              this.simulationHighlight.simulationHighlightOff();

              this.scene.events.emit('simulationEnd');
              return;
            }
          }

          const nextStateSimulationKey = simulationPrefix + '9';
          const nextStateSimulationPoint = nextStatePoints.find(
            (p) => p.key === nextStateSimulationKey
          );
          if (hightlightSelected && nextStateSimulationPoint) {
            await this.simulationHighlight.moveImageTo(
              nextStateSimulationPoint.x,
              nextStateSimulationPoint.y
            );
          }

          // nextStateId = stateInput.nextStateId;
          currentStateId = stateInput.nextState;
          // console.log('새로운 currentStateId: ', currentStateId);
          if (currentStateId === 100) {
            this.findStateCircleByIdSelect(this.scene, currentStateId);
          }

          break;
        }
      }
      previousStateId = currentStateId;
    }

    // 정지 버튼 누를 시 => 시뮬레이션 중단 + Highlight 중단
    if (!this.isSimulationRunning) {
      this.player.playerHighlightOff();
      this.simulationHighlight.simulationHighlightOff();

      console.log('시뮬레이션 중단');
      return; // 시뮬레이션 중단
    }

    // if (callbackFunction) {
    //   callbackFunction();
    // }

    // Simulation Play Button 변경을 위한 event emit
    this.isSimulationRunning = false;

    this.player.playerHighlightOff();
    this.simulationHighlight.simulationHighlightOff();

    if (callbackFunction) {
      callbackFunction();
    }

    // this.scene.events.emit('simulationEnd');
    // '시뮬레이션 종료'로 설정
    // diagramScene.setIsSimulationPlaying = false;

    return;
    // }
  };

  // Let know there's Infinite loop detected
  wasInfiniteLoopDetected = (): boolean => {
    return this.infiniteLoopDetected;
  };

  // 각 미션의 Simulation을 위한 함수 (성공, 실패, 무한 loop popup 포함)
  executeSimulation = (
    mission: MissionInterface,
    stateInputData: any,
    highlightOn: boolean
  ) => {
    // const diagramScene = this.scene.scene.get('DiagramScene') as DiagramScene;

    this.processStateInputData(stateInputData, highlightOn, () => {
      if (this.wasInfiniteLoopDetected()) {
        // this.scene.events.emit('simulationEnd');

        // Display infinite loop warning popup
        this.scene.sound.play('mistakeSound', { volume: 0.5 });
        setTimeout(() => {
          const diagramScene = this.scene.scene.get(
            'DiagramScene'
          ) as DiagramScene;
          diagramScene.popupWindow = new PopupWindow(
            diagramScene,
            'smInfinite',
            false
          );
          diagramScene.popupWindow.create();
          diagramScene.add.existing(diagramScene.popupWindow);
        }, 500);

        this.scene.events.emit('simulationEnd');
        // return;
      } else {
        const positionsCorrect = mission.checkObjectPositions();

        const diagramScene = this.scene.scene.get(
          'DiagramScene'
        ) as DiagramScene;

        if (positionsCorrect) {
          // if (!this.getIsSuccessPopupShowed) {
          this.scene.sound.play('missionSuccessSound');
          setTimeout(() => {
            diagramScene.popupWindow = new PopupWindow(
              diagramScene,
              'sm',
              false,
              mission.getSuccessMessage()
            );
            diagramScene.popupWindow.create();
            diagramScene.add.existing(diagramScene.popupWindow);
          }, 500);

          this.setIsSuccessPopupShowed = true;

          this.scene.events.emit('simulationEnd');
          // return;
          // }
        } else {
          this.scene.sound.play('missionFailSound');
          setTimeout(() => {
            diagramScene.popupWindow = new PopupWindow(
              diagramScene,
              'smAlert',
              false,
              mission.getFailureMessage()
            );
            diagramScene.popupWindow.create();
            diagramScene.add.existing(diagramScene.popupWindow);
          }, 500);

          this.scene.events.emit('simulationEnd');
          // return;
        }
        console.log(positionsCorrect ? 'Success' : 'Fail');
      }
    });
  };

  // To find a StateCircle by id and to pointerdown the found StateCircle (by emit event)
  private findStateCircleByIdSelect(scene: Phaser.Scene, id: number): void {
    const diagramScene = scene.scene.get('DiagramScene') as DiagramScene;
    const stateCircles: StateCircle[] = diagramScene.getStateCircles; // Assuming this is an array of StateCircle

    const correspondingStateCircle = diagramScene.getStateCircles.find(
      (stateCircle: StateCircle) => stateCircle.getId === id
    );

    correspondingStateCircle && correspondingStateCircle.emit('pointerdown');

    return;
  }

  // Sensor Check (0 - 4)
  sensorCheck(player: Player, sensorId: number): boolean {
    switch (sensorId) {
      case 0: {
        let result: boolean = false;
        result = player.wallFrontCheck();
        console.log('wallFrontCheck triggerd', 'result: ', result);
        return result;
      }
      case 1: {
        let result: boolean = false;
        result = player.wallLeftCheck();
        console.log('wallLeftCheck triggerd', 'result: ', result);
        return result;
      }
      case 2: {
        let result: boolean = false;
        result = player.wallRightCheck();
        console.log('wallRightCheck triggerd', 'result: ', result);
        return result;
      }
      case 3: {
        let result: boolean = false;
        result = player.monsterFrontCheck();
        console.log('monsterFrontCheck triggerd', 'result: ', result);
        return result;
      }
      case 4: {
        let result: boolean = false;
        result = player.starBottomcheck();
        console.log('starBottomcheck triggerd', 'result: ', result);
        return result;
      }
      default:
        return false;
    }
  }

  // executeMove = async (
  //   player: Player,
  //   moveId: number | null
  // ): Promise<boolean> => {
  //   switch (moveId) {
  //     case 3:
  //       return await player.moveForward();
  //     case 4:
  //       return await player.turnLeft();
  //     case 5:
  //       return await player.turnRight();
  //     case 6:
  //       return await player.putStar();
  //     case 7:
  //       return await player.pickStar();
  //     default:
  //       console.log('Invalid move');
  //       return true; // No valid moveId was provided
  //   }
  // };
  executeMove = async (
    player: Player,
    moveId: number | null
  ): Promise<'success' | 'boundaryError' | 'wallError'> => {
    switch (moveId) {
      case 3:
        return await player.moveForward();
      case 4:
        return await player.turnLeft();
      case 5:
        return await player.turnRight();
      case 6:
        return await player.putStar();
      case 7:
        return await player.pickStar();
      default:
        console.log('Invalid move');
        return 'success'; // No valid moveId was provided
    }
  };
}

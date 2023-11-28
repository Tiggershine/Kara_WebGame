import Phaser from 'phaser';
import Player from '../classes/sprites/Player';
import Star from '../classes/sprites/Star';
import Wall from '../classes/sprites/Wall';
import StateCircle from '../classes/StateCircle';
import SimulationHighlight from '../classes/SimulationHighlight';
import DiagramScene from '../scenes/DiagramScene';
import { SensorCheck, StateInput } from '../classes/InputManager';

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

  constructor(scene: Phaser.Scene, player: Player) {
    this.scene = scene;
    this.player = player;

    const diagramScene = scene.scene.get('DiagramScene') as DiagramScene;
    this.simulationHighlight = new SimulationHighlight(scene, 'inputHighlight');
    this.simulationHighlight.setDepth(1000);
  }

  // To simulate ths mission based on user input
  processStateInputData = async (
    stateInputData: any,
    hightlightSelected: boolean,
    callbackFunction?: () => void
  ) => {
    // Set PlayerHighlight
    if (!hightlightSelected && this.player.getPlayerHighlight) {
      this.player.playerHighlightOff();
    } else if (hightlightSelected) {
      this.player.playerHighlightOn();
    }

    const startState = stateInputData.find((state: State) => state.id === 0);

    let currentStateId = startState.stateInputs[0].nextState; // Start의 NextState로 Init (1번 State)
    // console.log('currentStateId', currentStateId);

    while (currentStateId !== 100) {
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
          // console.log('simulationKey: ', simulationKey);
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
            // console.log(
            //   'Condition Point: ',
            //   simulationPoint.x,
            //   simulationPoint.y
            // );
            this.simulationHighlight.simulationHighlightOn();
            await this.simulationHighlight.moveImageTo(
              simulationPoint.x,
              simulationPoint.y
            );
          }
        }

        // console.log('sensorCheckPassed: ', sensorCheckPassed);

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
            let moveSuccessful: boolean = await this.executeMove(
              this.player,
              move
            );
            if (!moveSuccessful) {
              console.log('경계선을 넘어갈 수 없음');
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

          break;
        }
      }
    }

    if (callbackFunction) {
      callbackFunction();
    }

    this.player.playerHighlightOff();
    this.simulationHighlight.simulationHighlightOff();

    this.scene.events.emit('simulationEnd');

    return;
    // }
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
  //       await player.moveForward();
  //       console.log('moveForward');
  //       break;
  //     case 4:
  //       await player.turnLeft();
  //       console.log('turnLeft');
  //       break;
  //     case 5:
  //       await player.turnRight();
  //       console.log('turnRight');
  //       break;
  //     case 6:
  //       await player.putStar();
  //       console.log('putStar');
  //       break;
  //     case 7:
  //       await player.pickStar();
  //       console.log('pickStar');
  //       break;
  //     default:
  //       break;
  //   }
  // };
  executeMove = async (
    player: Player,
    moveId: number | null
  ): Promise<boolean> => {
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
        return false; // No valid moveId was provided
    }
  };
}

import { ButtonType } from './ControlButton';
import { SensorType } from './DropdownMenu';
// import StateCircle from './StateCircle';
import { InputLabel, Label } from './InputLabel';

interface SensorCheck {
  sensor: SensorType;
  condition: ButtonType;
}
// interface userInput {
//   sensorChecks: SensorCheck[];
//   move: ButtonType[];
//   nextState: number;
// }
export interface StateInput {
  sensorChecks: SensorCheck[];
  move: ButtonType[];
  nextState: number;
}

export default class InputManager {
  private stateInput!: StateInput;
  // public stateCircles: StateCircle[] = [];
  // public labels: { id: number; name: string; isSelected: boolean }[] = [];

  /**
   * @description Used to add new StateInput
   * @param stateName Identifier
   */
  addStateInput(id: number, stateName: string): void {
    this.stateInput = {
      id: id,
      stateName: stateName,
      isSelected: true,
      userInputs: [],
    };
  }

  setStatename = (name: string) => {};

  /**
   * @param stateName Identifier
   * @param sensor WallFront || WallLeft || WallRight || MonsterFront || StarBottom
   */
  addSensor(stateName: string, sensorCheck: SensorCheck): void {
    if (this.stateInput.stateName === stateName) {
      const userInput: userInput = {
        sensorChecks: [sensorCheck],
        move: [],
        nextState: -1,
      };
      this.stateInput.userInputs.push(userInput);
    }
  }

  /**
   * @param stateName Identifier
   * @param sensorCheck { sensor: SensorType, condition: ButtonType }[]
   * @param moveButton ForwardButton || LeftButton || RightButton || PutButton || PickButton
   */
  addMoveButton(
    stateName: string,
    sensorCheck: SensorCheck,
    moveButton: ButtonType
  ): void {
    if (this.stateInput.stateName === stateName) {
      const targetUserInput = this.stateInput.userInputs.find((ui) =>
        ui.sensorChecks.some(
          (sc) =>
            sc.sensor === sensorCheck.sensor &&
            sc.condition === sensorCheck.condition
        )
      );
      if (targetUserInput) {
        targetUserInput.move.push(moveButton);
      }
    }
  }

  /**
   * @param stateName Identifier
   * @param sensorCheck { sensor: SensorType, condition: ButtonType }[]
   * @param nextState stateName of nextState
   */
  setNextState(
    stateName: string,
    sensorCheck: SensorCheck,
    nextState: number
  ): void {
    if (this.stateInput.stateName === stateName) {
      const targetUserInput = this.stateInput.userInputs.find((ui) =>
        ui.sensorChecks.some(
          (sc) =>
            sc.sensor === sensorCheck.sensor &&
            sc.condition === sensorCheck.condition
        )
      );
      if (targetUserInput) {
        targetUserInput.nextState = nextState;
      }
    }
  }

  // addLabel = (id: number, name: string, isSelected: boolean) => {
  //   this.labels.push({ id: id, name: name, isSelected: isSelected });
  // };
}

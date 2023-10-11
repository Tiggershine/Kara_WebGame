import { ButtonType } from './ControlButton';
import { SensorType } from './DropdownMenu';

export interface StateInput {
  stateName: string;
  sensors: { sensorType: SensorType; condition: boolean }[];
  moveButtons: ButtonType[];
  nextState: string;
}

export class InputManager {
  /**
   * Array contains all input values (Sensor, Condition, Move, Next state)
   */
  private stateInputs: StateInput[] = [];

  /**
   * @description Used to add new StateInput
   * @param stateName Identifier
   */
  addStateInput = (stateName: string): void => {
    this.stateInputs.push({
      stateName: stateName,
      sensors: [],
      moveButtons: [],
      nextState: '',
    });
    console.log(
      'Name: ',
      this.stateInputs.map((stateInput) => stateInput.stateName)
    );
  };

  /**
   * @param stateName Identifier
   * @param sensor WallFront || WallLeft || WallRight || MonsterFront || StarBottom
   */
  addSensor = (
    stateName: string,
    sensor: { sensorType: SensorType; condition: boolean }
  ): void => {
    const input = this.stateInputs.find(
      (stateInput: StateInput) => stateInput.stateName === stateName
    );

    input && input.sensors.push(sensor);
  };

  /**
   *
   * @param stateName Identifier
   * @param moveButton ForwardButton || LeftButton || RightButton || PutButton || PickButton
   */
  addMoveButton = (stateName: string, moveButton: ButtonType): void => {
    const input = this.stateInputs.find(
      (stateInput: StateInput) => stateInput.stateName === stateName
    );

    input && input.moveButtons.push(moveButton);
  };

  /**
   *
   * @param stateName Identifier
   * @param nextState stateName of nextState
   */
  setNextState = (stateName: string, nextState: string): void => {
    const input = this.stateInputs.find(
      (stateInput: StateInput) => stateInput.stateName === stateName
    );
    if (input) {
      input.nextState = nextState;
    }
  };
}

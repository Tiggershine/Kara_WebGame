import { ButtonType } from './ControlButton';
import { SensorType } from './DropdownMenu';
// import StateCircle from './StateCircle';

export interface SensorCheck {
  sensor: SensorType;
  condition: ButtonType;
}

export interface StateInput {
  sensorChecks: SensorCheck[];
  move: ButtonType[];
  nextState: number;
}

export interface TemporaryStateInput {
  sensorChecks?: SensorCheck[];
  move?: ButtonType[];
  nextState?: number;
}

export default class InputManager {
  private temporaryStateInputs: Record<string, TemporaryStateInput> = {};

  setTemporaryInput(
    key: string,
    temporaryInput: Partial<TemporaryStateInput>
  ): void {
    if (!this.temporaryStateInputs[key]) {
      this.temporaryStateInputs[key] = {};
    }
    Object.assign(this.temporaryStateInputs[key], temporaryInput);
  }

  getTemporaryInput(key: string): TemporaryStateInput | undefined {
    return this.temporaryStateInputs[key];
  }

  getAllTemporaryInputs(): Record<string, TemporaryStateInput> {
    return this.temporaryStateInputs;
  }

  clearTemporaryInput(key: string): void {
    delete this.temporaryStateInputs[key];
  }

  clearAllTemporaryInputs(): void {
    this.temporaryStateInputs = {};
  }
}

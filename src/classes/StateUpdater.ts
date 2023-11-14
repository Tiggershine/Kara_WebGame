import { InputWindow } from './InputWindow';

export class StateUpdater {
  private inputWindow!: InputWindow;

  constructor(inputWindowInstance: InputWindow) {
    this.inputWindow = inputWindowInstance;
  }
}

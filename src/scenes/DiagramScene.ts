import Phaser from 'phaser';
import StateCircle from '../classes/StateCircle';
import UIManager from '../classes/UIManager';
import EdgeManager from '../classes/EdgeManager';
import StateCircleManager from '../classes/StateCircleManager';
import InputManager from '../classes/InputManager';
import MissionManager from '../classes/MissionManager';
import { InputLabel } from '../classes/InputLabel';

interface MissionData {
  level: number;
  mission: number;
}

export default class DiagramScene extends Phaser.Scene {
  diagramValidArea!: Phaser.GameObjects.Rectangle;
  uiManager: UIManager = new UIManager(this);
  edgeManager: EdgeManager = new EdgeManager(this);
  stateCircleManager: StateCircleManager = new StateCircleManager(this);
  missionManager: MissionManager = new MissionManager(this);
  inputManager: InputManager = new InputManager();
  stateCircles: StateCircle[] = [];
  inputLabels: InputLabel[] = [];
  idCount: number = 1;
  level: number = 0;
  mission: number = 0;
  private isSimulationPlaying: boolean = false;
  private isMissionInitiated: boolean = false;
  private isHighlightOn: boolean = false;

  constructor() {
    super('DiagramScene');
  }

  create(missionData: MissionData) {
    this.level = missionData.level;
    this.mission = missionData.mission;

    this.uiManager.createAddButton();
    this.uiManager.createStartStateCircle();
    this.uiManager.createEndStateCircle();

    // Valid area allows state circle on that
    this.diagramValidArea = this.add.rectangle(800, 215, 500 - 30, 250 - 30);
    this.uiManager.createDiagramContainer();
    this.uiManager.createEdgesForStateCircles();

    // Listen for the updateLabels event
    this.events.on('updateLabels', () => this.uiManager.addLabels, this);
    this.events.on(
      'updateStateCircleName',
      () => this.stateCircleManager.updateStateCircleNameById,
      this
    );

    // this.scene.moveAbove('InputWindowScene', 'DiagramScene');
    this.scene.moveAbove('DiagramScene', 'PlaygroundScene');

    ///////////////////////// PLAYGROUND SECTION /////////////////////////
    this.uiManager.createPlaygroundContainer(); // Container
    this.uiManager.createBackButton(this.level); // Back Button
    this.uiManager.createResetButton(); // Reset Button
    this.uiManager.createStageLabel(this.level, this.mission);
    this.uiManager.createPlayButton(this.level, this.mission);
    this.uiManager.createHighlightToggleButton();

    ///////////////////////// MISSON LOAD /////////////////////////
    this.missionManager.missionLoader(missionData.level, missionData.mission);
  }

  ///////** Getter *//////////////////////////////////////////////////////////////////////////////////////////////////////
  get getStateCircles(): StateCircle[] {
    return this.stateCircles;
  }
  get getIdCount(): number {
    return this.idCount;
  }
  set setIdCount(newIdCount: number) {
    this.idCount = newIdCount;
  }
  get getIsSimulationPlaying(): boolean {
    return this.isSimulationPlaying;
  }
  set setIsSimulationPlaying(updatedIsSimulationPlaying: boolean) {
    this.isSimulationPlaying = updatedIsSimulationPlaying;
  }
  get getIsMissionInitiated(): boolean {
    return this.isMissionInitiated;
  }
  set setIsMissionInitiated(updatedMissionInitiated: boolean) {
    this.isMissionInitiated = updatedMissionInitiated;
  }
  get getIsHighlightOn(): boolean {
    return this.isHighlightOn;
  }
  set setIsHighlightOn(updatedIsHighlightOn: boolean) {
    this.isHighlightOn = updatedIsHighlightOn;
  }

  getSelectedCircle = (): StateCircle => {
    const selectedCircle = this.stateCircles.find(
      (circle) => circle.isSelected
    );
    if (!selectedCircle) {
      throw new Error('No circle is currently selected');
    }
    return selectedCircle;
  };

  // Call this function before stopping the scene
  cleanup() {
    this.edgeManager.destroyAllEdges();

    // Destroy all state circles and their associated edges
    this.stateCircles.forEach((circle) => {
      const circleInputWindow = circle.getInputWindow();
      circleInputWindow?.cleanup();
      circleInputWindow?.destroy();

      // Destroy the circle itself
      circle.destroy();
    });
    this.stateCircles = [];

    // Destroy all input labels
    this.inputLabels.forEach((label) => label.destroy());
    this.inputLabels = [];

    this.setIdCount = 1;
  }
}

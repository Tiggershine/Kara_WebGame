import Phaser from 'phaser';
import StateCircle from '../classes/StateCircle';
import InputManager, { SensorCheck, StateInput } from '../classes/InputManager';
import ControlButton, { ButtonType } from '../classes/ControlButton';
import {
  DropdownMenu,
  DropdownOption,
  SensorType,
} from '../classes/DropdownMenu';
import { InputGuideline } from '../classes/InputGuideline';
// import { InputLabel } from '../classes/InputLabel';
import DiagramScene from './DiagramScene';
import { InputWindow } from '../classes/InputWindow';

/** DropdownMenu Options */
const options: DropdownOption[] = [
  {
    texture: 'wallFront',
    value: 'wallFront',
    type: SensorType.WallFront,
  },
  {
    texture: 'wallLeft',
    value: 'wallLeft',
    type: SensorType.WallLeft,
  },
  {
    texture: 'wallRight',
    value: 'wallRight',
    type: SensorType.WallRight,
  },
  {
    texture: 'monsterFront',
    value: 'monsterFront',
    type: SensorType.MonsterFront,
  },
  {
    texture: 'starBottom',
    value: 'starBottom',
    type: SensorType.StarBottom,
  },
];

export default class InputWindowScene extends Phaser.Scene {
  // private dropdownButtons: DropdownMenu[] = [];
  // private currentDropdownCount: number = 0; // Move currentDropdownCount here
  inputManager: InputManager = new InputManager();
  private tempSensorType?: SensorType;
  private inputWindow?: InputWindow;

  private buttonConfigurations = [
    {
      name: 'yesButton',
      type: ButtonType.YesButton,
      texture: 'yesButton',
      selectedTexture: 'yesButtonSelected',
      x: 370,
      y: 665,
    },
    {
      name: 'noButton',
      type: ButtonType.NoButton,
      texture: 'noButton',
      selectedTexture: 'noButtonSelected',
      x: 430,
      y: 665,
    },
    {
      name: 'yesNoButton',
      type: ButtonType.YesNoButton,
      texture: 'yesNoButton',
      selectedTexture: 'yesNoButtonSelected',
      x: 490,
      y: 665,
    },
    {
      name: 'forwardButton',
      type: ButtonType.ForwardButton,
      texture: 'forwardButton',
      selectedTexture: 'forwardButtonSelected',
      x: 250,
      y: 745,
    },
    {
      name: 'leftButton',
      type: ButtonType.LeftButton,
      texture: 'leftButton',
      selectedTexture: 'leftButtonSelected',
      x: 310,
      y: 745,
    },
    {
      name: 'rightButton',
      type: ButtonType.RightButton,
      texture: 'rightButton',
      selectedTexture: 'rightButtonSelected',
      x: 370,
      y: 745,
    },
    {
      name: 'putButton',
      type: ButtonType.PutButton,
      texture: 'putButton',
      selectedTexture: 'putButtonSelected',
      x: 430,
      y: 745,
    },
    {
      name: 'pickButton',
      type: ButtonType.PickButton,
      texture: 'pickButton',
      selectedTexture: 'pickButtonSelected',
      x: 490,
      y: 745,
    },
  ];
  // private inputLabels: InputLabel[] = [];
  private diagramScene?: DiagramScene;

  constructor() {
    super('InputWindowScene');
  }

  // 210, 400

  // Values for Style
  private inputContainerStyle = {
    x: 550,
    y: 400,
    width: 500,
    height: 380,
    borderRadius: 10,
    backgroundColor: 0xfcf6f5,
  };

  private controllerContainerStyle = {
    x: 210,
    y: 620,
    width: 320,
    height: 160,
    borderRadius: 10,
    backgroundColor: 0xfcf6f5,
  };

  preload() {}

  create() {
    this.diagramScene = this.scene.get('DiagramScene') as DiagramScene;

    // Divider graphics
    const dividerGraphics = this.add.graphics({
      lineStyle: {
        width: 1,
        color: 14277081, // #D9D9D9
      },
    });

    /** InputGuideline */
    const guidlinePositions = [
      { x: 800, y: 490 },
      { x: 800, y: 555 },
      { x: 800, y: 620 },
      { x: 800, y: 685 },
      { x: 800, y: 750 },
    ];
    const inputGutideline = new InputGuideline(
      this,
      guidlinePositions,
      'inputGuideline'
    );
    this.add.existing(inputGutideline);
  }

  // Function returns a RoundRectGraphics object
  createRoundRectGraphics = (
    x: number,
    y: number,
    width: number,
    height: number,
    borderRadius: number,
    backgroundColor: number
  ): Phaser.GameObjects.Graphics => {
    const roundRectGraphics = this.add.graphics({
      fillStyle: { color: backgroundColor },
    });
    roundRectGraphics.fillRoundedRect(x, y, width, height, borderRadius);

    return roundRectGraphics;
  };

  /**
   *
   * @param x x coordinate
   * @param y y coordinate
   * @param texture Namespace used to import image file
   * @param type Button type
   * @returns ControlButton Object
   */
  createControlButton = (
    x: number,
    y: number,
    texture: string,
    type: ButtonType
  ): ControlButton => {
    const newControlButton = new ControlButton(this, x, y, texture, type);

    return newControlButton;
  };

  // Dropdown 메뉴 선택 option 임시저장
  handleSensprTypeSelection = (sensorType: SensorType): void => {
    this.tempSensorType = sensorType;
  };

  // sensorChecks입력 임시 저장
  handleSensorChecksInput = (
    key: string,
    sensorChecks: SensorCheck[]
  ): void => {
    this.inputManager.setTemporaryInput(key, { sensorChecks });
  };

  // Move입력 임시 저장
  handleMoveInput = (key: string, move: ButtonType[]): void => {
    this.inputManager.setTemporaryInput(key, { move });
  };

  // NextState입력 임시 저장
  handleNextStateInput = (key: string, nextState: number): void => {
    this.inputManager.setTemporaryInput(key, { nextState });
  };

  // 저장된 입력값(SensorChecks, Move, NextState) StateCircl의 StateInput property에 저장
  commitUserInput = (): void => {
    const temporaryStateInputs = this.inputManager.getAllTemporaryInputs();

    const selectedStateCircle = this.findSelectedStateCircle();

    if (selectedStateCircle) {
      for (const key in temporaryStateInputs) {
        const tempInput = temporaryStateInputs[key];
        if (
          tempInput.sensorChecks &&
          tempInput.move &&
          tempInput.nextState !== undefined
        ) {
          const stateInput: StateInput = {
            sensorChecks: tempInput.sensorChecks,
            move: tempInput.move,
            nextState: tempInput.nextState,
          };
          selectedStateCircle.addStateInput(stateInput);
          this.inputManager.clearTemporaryInput(key); // Clear temporary input after committing
        } else {
          console.error('Incomplete user input for key:', key);
        }
      }
    }
  };

  findSelectedStateCircle(): StateCircle | undefined {
    if (!this.diagramScene) {
      console.error('DiagramScene is not initialized');
      return;
    }
    return this.diagramScene.getStateCircles.find(
      (circle) => circle.isSelected
    );
  }
}

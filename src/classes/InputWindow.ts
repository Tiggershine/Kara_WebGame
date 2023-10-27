import Phaser from 'phaser';
import {
  DropdownMenu,
  DropdownOption,
  SensorType,
} from '../classes/DropdownMenu';
import { StateInput, SensorCheck } from './InputManager';
import { InputGuideline } from '../classes/InputGuideline';
import ControlButton, { ButtonType } from './ControlButton';
import DiagramScene from '../scenes/DiagramScene';
import StateCircle from './StateCircle';
import { NextStateButton } from './NextStateButton';

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

/** Contorl Button Options */
const buttonConfigurations = [
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

/** Dummy Button Options */
const dummyButtonConfigurations = [
  {
    name: 'yesNoButton',
    type: ButtonType.YesNoButton,
    texture: 'yesNoButton',
    selectedTexture: 'yesNoButtonSelected',
    x: 586,
    y: 490,
  },
  {
    name: 'yesNoButton',
    type: ButtonType.YesNoButton,
    texture: 'yesNoButton',
    selectedTexture: 'yesNoButtonSelected',
    x: 636,
    y: 490,
  },
  {
    name: 'yesNoButton',
    type: ButtonType.YesNoButton,
    texture: 'yesNoButton',
    selectedTexture: 'yesNoButtonSelected',
    x: 686,
    y: 490,
  },
  {
    name: 'yesNoButton',
    type: ButtonType.YesNoButton,
    texture: 'yesNoButton',
    selectedTexture: 'yesNoButtonSelected',
    x: 736,
    y: 490,
  },
];

const conditionInputPoints = [
  { key: 'dummyBtn_11', x: 580, y: 490 },
  { key: 'dummyBtn_12', x: 630, y: 490 },
  { key: 'dummyBtn_13', x: 680, y: 490 },
  { key: 'dummyBtn_14', x: 730, y: 490 },
  { key: 'dummyBtn_21', x: 580, y: 555 },
  { key: 'dummyBtn_22', x: 630, y: 555 },
  { key: 'dummyBtn_23', x: 680, y: 555 },
  { key: 'dummyBtn_24', x: 730, y: 555 },
  { key: 'dummyBtn_31', x: 580, y: 620 },
  { key: 'dummyBtn_32', x: 630, y: 620 },
  { key: 'dummyBtn_33', x: 680, y: 620 },
  { key: 'dummyBtn_34', x: 730, y: 620 },
  { key: 'dummyBtn_41', x: 580, y: 685 },
  { key: 'dummyBtn_42', x: 630, y: 685 },
  { key: 'dummyBtn_43', x: 680, y: 685 },
  { key: 'dummyBtn_44', x: 730, y: 685 },
  { key: 'dummyBtn_51', x: 580, y: 750 },
  { key: 'dummyBtn_52', x: 630, y: 750 },
  { key: 'dummyBtn_53', x: 680, y: 750 },
  { key: 'dummyBtn_54', x: 730, y: 750 },
];

const moveInputPoints = [
  { key: 'dummyBtn_15', x: 785, y: 490 },
  { key: 'dummyBtn_16', x: 835, y: 490 },
  { key: 'dummyBtn_17', x: 885, y: 490 },
  { key: 'dummyBtn_18', x: 935, y: 490 },
  { key: 'dummyBtn_25', x: 785, y: 555 },
  { key: 'dummyBtn_26', x: 835, y: 555 },
  { key: 'dummyBtn_27', x: 885, y: 555 },
  { key: 'dummyBtn_28', x: 935, y: 555 },
  { key: 'dummyBtn_35', x: 785, y: 620 },
  { key: 'dummyBtn_36', x: 835, y: 620 },
  { key: 'dummyBtn_37', x: 885, y: 620 },
  { key: 'dummyBtn_38', x: 935, y: 620 },
  { key: 'dummyBtn_45', x: 785, y: 685 },
  { key: 'dummyBtn_46', x: 835, y: 685 },
  { key: 'dummyBtn_47', x: 885, y: 685 },
  { key: 'dummyBtn_48', x: 935, y: 685 },
  { key: 'dummyBtn_55', x: 785, y: 750 },
  { key: 'dummyBtn_56', x: 835, y: 750 },
  { key: 'dummyBtn_57', x: 885, y: 750 },
  { key: 'dummyBtn_58', x: 935, y: 750 },
];

const nextStateButtonOptions = ['Start', 'State 1', 'State 2'];

/** InputGuideline Coordinate */
const guidlinePositions = [
  { x: 800, y: 490 },
  { x: 800, y: 555 },
  { x: 800, y: 620 },
  { x: 800, y: 685 },
  { x: 800, y: 750 },
];

export class InputWindow extends Phaser.GameObjects.Container {
  private dropdownButtons: DropdownMenu[] = [];
  private currentDropdownCount: number = 0;
  private controlButtons: ControlButton[] = [];
  // private inputLabels: InputLabel[] = [];
  private inputGuideline!: InputGuideline;
  private isActive: boolean = false;
  private dummyButtons: { [key: string]: Phaser.GameObjects.Image } = {};
  // private dummyBtn_11!: Phaser.GameObjects.Image;
  // private dummyBtn_12!: Phaser.GameObjects.Image;
  // private dummyBtn_13!: Phaser.GameObjects.Image;
  // private dummyBtn_14!: Phaser.GameObjects.Image;
  // [key: string]: any;
  private tempSensorInputs: SensorType[] = []; // Store selected sensor button
  private tempStateInputs: StateInput[] = Array(5).fill({
    sensorChecks: [],
    move: [],
    nextState: 0,
  });
  private registeredRow1: boolean = false;
  private registeredRow2: boolean = false;
  private registeredRow3: boolean = false;
  private registeredRow4: boolean = false;
  private registeredRow5: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    // Continaer Graphic
    const containerStyle = {
      width: 500,
      height: 380,
      borderRadius: 10,
      backgroundColor: 0xfcf6f5,
    };

    const containerGraphic = this.scene.add.graphics({
      fillStyle: { color: containerStyle.backgroundColor },
    });
    containerGraphic.fillRoundedRect(
      550,
      400,
      containerStyle.width,
      containerStyle.height,
      containerStyle.borderRadius
    );

    const controllerContainerStyle = {
      width: 320,
      height: 160,
      borderRadius: 10,
      backgroundColor: 0xfcf6f5,
    };
    const controlContainerGraphic = this.scene.add.graphics({
      fillStyle: { color: controllerContainerStyle.backgroundColor },
    });
    controlContainerGraphic.fillRoundedRect(
      210,
      620,
      controllerContainerStyle.width,
      controllerContainerStyle.height,
      controllerContainerStyle.borderRadius
    );
    // controlContainerGraphic.setDepth(1);

    // Divider graphics
    const dividerGraphics = this.scene.add.graphics({
      lineStyle: {
        width: 1,
        color: 14277081, // #D9D9D9
      },
    });
    dividerGraphics.setDepth(1);
    // Set Divider for Input container (210, 400)
    dividerGraphics.lineBetween(559, 457, 1041, 457);
    dividerGraphics.lineBetween(760, 408, 760, 774);
    dividerGraphics.lineBetween(960, 408, 960, 774);
    // Set Divider for Controller container
    dividerGraphics.lineBetween(230, 700, 510, 700);

    // Label for Inputwindow
    const moveLabel = this.scene.add.image(862.5, 433, 'moveLabel');
    const nextStateLabel = this.scene.add.image(1000, 433, 'nextStateLabel');

    // const dummyButton_1 = this.scene.add.image(630, 490, 'yesNoButton');
    // const dummyButton_2 = this.scene.add.image(680, 490, 'yesNoButton');
    // const dummyButton_3 = this.scene.add.image(730, 490, 'yesNoButton');

    // this.dummyButton_11 = this.scene.add.image(586, 490, 'yesNoButton');
    // const dummyButton_12 = this.scene.add.image(785, 490, 'yesNoButton');
    // const dummyButton_13 = this.scene.add.image(835, 490, 'yesNoButton');
    // const dummyButton_14 = this.scene.add.image(885, 490, 'yesNoButton');
    // const dummyButton_15 = this.scene.add.image(935, 490, 'yesNoButton');
    // this.dummyButton_11.setVisible(false);

    this.inputGuideline = this.addGuildeline();

    // Add objects into Scene
    this.add(containerGraphic);
    this.add(controlContainerGraphic);
    this.add(moveLabel);
    this.add(nextStateLabel);

    // Condition button images in InputWindow (default: invisible)
    conditionInputPoints.forEach((point) => {
      this.dummyButtons[point.key] = this.scene.add.image(
        point.x,
        point.y,
        'yesNoButton'
      );

      this.dummyButtons[point.key].setVisible(false);
      this.add(this.dummyButtons[point.key]);
    });
    // Move button ymages in InputWindow (default: invisible)
    moveInputPoints.forEach((point) => {
      this.dummyButtons[point.key] = this.scene.add.image(
        point.x,
        point.y,
        'forwardButton'
      );

      this.dummyButtons[point.key].setVisible(false);
      this.add(this.dummyButtons[point.key]);
    });
    // this.add(this.dummyButton_11);
    // this.add(dummyButton_12);
    // this.add(dummyButton_13);
    // this.add(dummyButton_14);
    // this.add(dummyButton_15);

    // this.add(dummyButton_1);
    // this.add(dummyButton_2);
    // this.add(dummyButton_3);

    scene.add.existing(this);

    // this.addDummyButtons();
    this.addControlButtons();
    this.createSensorDropdownButton(580, 432, 'dropdownButton', options);

    this.addNextStateButton(
      1005,
      553,
      'nextStateButton2',
      'nextStateButton',
      nextStateButtonOptions
    );
    this.addNextStateButton(
      1005,
      488,
      'nextStateButton2',
      'nextStateButton',
      nextStateButtonOptions
    );
  }

  ///////** METHODS *//////////////////////////////////////////////////////////////////////////////////////////////////////

  // StateInput 입력을 위한 함수들

  // Sensor update(Dropdown option 선택)
  updateTempSensorInputs = (sensorType: SensorType): void => {
    const index = this.currentDropdownCount;

    if (index >= 0 && index < 5) {
      this.tempSensorInputs[index] = sensorType;

      console.log(
        'index',
        index,
        '저장된 SesorType: ',
        this.tempSensorInputs[index]
      );
    } else {
      console.log('Index out of bounds: ', index);
    }
  };

  getInputwindowActive = (): boolean => {
    return this.isActive;
  };

  setInputWindowActive = (isActive: boolean): void => {
    this.isActive = isActive;
  };

  // Creating Container Graphic
  createRoundRectGraphics = (
    x: number,
    y: number,
    width: number,
    height: number,
    borderRadius: number,
    backgroundColor: number
  ): Phaser.GameObjects.Graphics => {
    const roundRectGraphics = this.scene.add.graphics({
      fillStyle: { color: backgroundColor },
    });
    roundRectGraphics.fillRoundedRect(x, y, width, height, borderRadius);

    return roundRectGraphics;
  };

  /** Dropdown Button */
  // Used to add dropdown button into Scene
  createSensorDropdownButton = (
    x: number,
    y: number,
    texture: string,
    options: DropdownOption[]
  ): DropdownMenu => {
    const dropdownButton = new DropdownMenu(
      this.scene,
      x,
      y,
      texture,
      options,
      this
    );
    this.add(dropdownButton);
    this.dropdownButtons.push(dropdownButton);
    dropdownButton.on(
      'pointerdown',
      () => {
        dropdownButton.toggleMenu();
      },
      this
    );

    return dropdownButton;
  };

  // Used to create addtional dropdown button, when a option selected
  addSensorDropdownButton(clickedDropdown: DropdownMenu) {
    // TODO: DELETE TEST CODE
    // console.log('handleDropdownClick function executed');
    if (this.currentDropdownCount < 3 && this.getInputwindowActive()) {
      let newX = clickedDropdown.getX + 50;
      let newY = clickedDropdown.getY;

      const newDropdownButton = this.createSensorDropdownButton(
        newX,
        newY,
        'dropdownButton',
        options
      );

      this.dropdownButtons.push(newDropdownButton);
      this.currentDropdownCount++; // Increment the count here

      return;
    }
  }

  addNextStateButton = (
    x: number,
    y: number,
    buttonTexture: string,
    backgroundTexture: string,
    options: string[]
  ): NextStateButton => {
    const nextStateButton = new NextStateButton(
      this.scene,
      x,
      y,
      buttonTexture,
      backgroundTexture,
      options,
      this
    );
    this.add(nextStateButton);
    // this.dropdownButtons.push(dropdownButton);
    nextStateButton.on(
      'pointerdown',
      () => {
        nextStateButton.toggleMenu();
      },
      this
    );

    return nextStateButton;
  };

  /** Control Buttons */
  // Add control button which are draggable into ContorlButtonContainer
  addControlButtons = (): void => {
    buttonConfigurations.forEach((config) => {
      const button = this.createControlButton(
        config.x,
        config.y,
        config.texture,
        config.type
      );
      button.name = config.name;
      this.setButtonDraggable(
        button,
        config.selectedTexture,
        this.inputGuideline
      );

      this.scene.add.existing(button);
    });
  };

  // Add control button object
  createControlButton = (
    x: number,
    y: number,
    texture: string,
    type: ButtonType
  ): ControlButton => {
    const newControlButton = new ControlButton(this.scene, x, y, texture, type);

    return newControlButton;
  };

  // Set ControllButton Draggable
  setButtonDraggable = (
    button: ControlButton,
    selectedButtonImage: string,
    guideline: InputGuideline
  ): void => {
    button.setInteractive();
    this.scene.input.setDraggable(button);

    let newButton: ControlButton;

    button.on('dragstart', (pointer: Phaser.Input.Pointer) => {
      newButton = this.createControlButton(
        pointer.x,
        pointer.y,
        selectedButtonImage,
        button.getType
      );
      if (newButton) {
        newButton.setSelected = true;
      }
    });

    button.on(
      'drag',
      (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        if (newButton) {
          newButton.setPosition(dragX, dragY);
          guideline.isInsideValidArea(newButton, dragX, dragY);
        }
      }
    );

    button.on('dragend', (pointer: Phaser.Input.Pointer) => {
      if (newButton) {
        console.log(newButton.getType);
        if (
          newButton.getType === ButtonType.YesButton ||
          newButton.getType === ButtonType.NoButton ||
          newButton.getType === ButtonType.YesNoButton
        ) {
          conditionInputPoints.forEach((point) => {
            const distance = Phaser.Math.Distance.Between(
              newButton.x,
              newButton?.y,
              point.x,
              point.y
            );

            if (distance <= 20) {
              console.log('condition btn 30이내');
              newButton.destroy();

              const sensorIndex = this.tempSensorInputs.length;
              const targetKeyIndex = point.key.split('_')[1][1];
              const rowNumber = point.key.split('_')[1][0];

              if (sensorIndex !== parseInt(targetKeyIndex)) {
                return;
              }
              const pointKey: string = point.key;
              const buttonType: ButtonType = newButton.getType;
              this.changeButtonImage(this.dummyButtons[pointKey], buttonType);

              this.registerInputRow(parseInt(rowNumber));
            } else {
              newButton.destroy();
            }
          });
        } else if (
          newButton.getType === ButtonType.ForwardButton ||
          newButton.getType === ButtonType.LeftButton ||
          newButton.getType === ButtonType.RightButton ||
          newButton.getType === ButtonType.PickButton ||
          newButton.getType === ButtonType.PutButton
        ) {
          moveInputPoints.forEach((point) => {
            const distance = Phaser.Math.Distance.Between(
              newButton.x,
              newButton?.y,
              point.x,
              point.y
            );

            if (distance <= 20) {
              console.log('move btn 30이내');
              newButton.destroy();

              // const sensorIndex = this.tempSensorInputs.length;
              // const targetKeyIndex = point.key.split('_')[1][0];
              const rowNumber = point.key.split('_')[1][0]; // 1
              const rowNumerBoolean = 'registeredRow' + rowNumber;
              console.log('rowNumber: ', rowNumber);
              console.log('this.registeredRow', this.registeredRow1);
              if (!(this as any)[rowNumerBoolean]) {
                return;
              }
              const pointKey: string = point.key;
              const buttonType: ButtonType = newButton.getType;
              this.changeButtonImage(this.dummyButtons[pointKey], buttonType);
            } else {
              newButton.destroy();
            }
          });
        }
      }

      guideline.setAllGuidelinesVisible(false);
    });
  };

  registerInputRow = (rowNumber: number) => {
    switch (rowNumber) {
      case 1:
        this.registeredRow1 = true;
        console.log('registeredRow1 true');
        break;
      case 2:
        this.registeredRow2 = true;
      case 3:
        this.registeredRow3 = true;
      case 4:
        this.registeredRow4 = true;
      case 5:
        this.registeredRow5 = true;
      default:
        return;
    }
  };

  // Button Image 변경하는 함수
  changeButtonImage = (
    buttonImg: Phaser.GameObjects.Image,
    buttonType: ButtonType
  ): void => {
    console.log('changeButtonImage 함수 실행');
    let replaceImgTexture: string;

    switch (buttonType) {
      case ButtonType.YesButton:
        replaceImgTexture = 'yesButton';
        buttonImg.setTexture(replaceImgTexture);
        console.log('change to yesButton');
        break;
      case ButtonType.NoButton:
        replaceImgTexture = 'noButton';
        buttonImg.setTexture(replaceImgTexture);
        console.log('change to noButton');
        break;
      case ButtonType.YesNoButton:
        replaceImgTexture = 'yesNoButton';
        buttonImg.setTexture(replaceImgTexture);
        console.log('change to yesNoButton');
        break;
      case ButtonType.ForwardButton:
        replaceImgTexture = 'forwardButton';
        buttonImg.setTexture(replaceImgTexture);
        console.log('change to forwardButton');
        break;
      case ButtonType.LeftButton:
        replaceImgTexture = 'leftButton';
        buttonImg.setTexture(replaceImgTexture);
        console.log('change to leftButton');
        break;
      case ButtonType.RightButton:
        replaceImgTexture = 'rightButton';
        buttonImg.setTexture(replaceImgTexture);
        console.log('change to rightButton');
        break;
      case ButtonType.PutButton:
        replaceImgTexture = 'putButton';
        buttonImg.setTexture(replaceImgTexture);
        console.log('change to putButton');
        break;
      case ButtonType.PickButton:
        replaceImgTexture = 'pickButton';
        buttonImg.setTexture(replaceImgTexture);
        console.log('change to pickButton');
        break;
      default:
        return;
    }

    buttonImg.setVisible(true);
  };

  // Condition Button 입력 - Sensor와 함께 SensorCheck: {sensor: SensorType; condition: ButtonType;} 처리
  updateConditionButtonInputs = (
    sensorOrder: number,
    buttonType: ButtonType
  ): void => {
    switch (sensorOrder) {
      case 1: {
        let sensor = this.tempSensorInputs[0];
        let sensorCheck = { sensor: sensor, condition: buttonType };
        this.tempStateInputs[0].sensorChecks.push(sensorCheck);
        console.log(this.tempStateInputs[0]);
        break;
      }
      case 2: {
        let sensor = this.tempSensorInputs[1];
        let sensorCheck = { sensor: sensor, condition: buttonType };
        this.tempStateInputs[0].sensorChecks.push(sensorCheck);
        console.log(this.tempStateInputs[0]);
        break;
      }
      case 3: {
        let sensor = this.tempSensorInputs[2];
        let sensorCheck = { sensor: sensor, condition: buttonType };
        this.tempStateInputs[0].sensorChecks.push(sensorCheck);
        console.log(this.tempStateInputs[0]);
        break;
      }
      case 4: {
        let sensor = this.tempSensorInputs[3];
        let sensorCheck = { sensor: sensor, condition: buttonType };
        this.tempStateInputs[0].sensorChecks.push(sensorCheck);
        console.log(this.tempStateInputs[0]);
        break;
      }
    }
  };

  // Button을 드래그하여 올렸을 때 버튼 이미지를 등록하는 함수
  registerConditionBtn = (inputBtn: ControlButton) => {};

  /** Control Button */
  addControlButton(button: ControlButton, x: number, y: number): void {
    this.controlButtons.push(button);
    this.add(button);

    button.setPosition(x, y);
    // button.setDepth(1);
  }

  findSelectedStateCircle(): StateCircle | undefined {
    const diagramScene = this.scene.scene.get('DiagramScene') as DiagramScene;

    return diagramScene.getStateCircles.find((circle) => circle.isSelected);
  }

  /** Guideline */
  addGuildeline = (): InputGuideline => {
    const inputGutideline = new InputGuideline(
      this.scene,
      guidlinePositions,
      'inputGuideline'
    );

    // this.add(inputGutideline);
    this.scene.add.existing(inputGutideline);
    return inputGutideline;
  };

  renderControlButton = () => {
    this.controlButtons.forEach((button) => {
      this.add(button);
    });
  };

  destroy(fromScene?: boolean) {
    this.dropdownButtons.forEach((dropdownButton) => {
      dropdownButton.destroy();
    });
    super.destroy(fromScene);
  }
}

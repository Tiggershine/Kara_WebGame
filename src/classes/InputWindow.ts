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

export const conditionInputPoints = [
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

export const moveInputPoints = [
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

export const nextStatePoints = [
  { key: '19', x: 1005, y: 488 },
  { key: '29', x: 1005, y: 553 },
  { key: '39', x: 1005, y: 618 },
  { key: '49', x: 1005, y: 683 },
  { key: '59', x: 1005, y: 748 },
];

/** InputGuideline Coordinate */
const guidelinePositions = [
  { x: 800, y: 486 },
  { x: 800, y: 551 },
  { x: 800, y: 616 },
  { x: 800, y: 681 },
  { x: 800, y: 746 },
];

export class InputWindow extends Phaser.GameObjects.Container {
  private stateCircleId: number = -1;
  private controlButtons: ControlButton[] = [];
  private dropdownButtons: DropdownMenu[] = [];
  private currentDropdownCount: number = 0;
  private nextStateButtons: NextStateButton[] = [];
  private tempSensorInputs: SensorType[] = []; // Store selected sensor button
  private inputRowCount: number = 1; // 줄 순서대로 입력을 강제하기 위한 인수
  private inputGuideline!: InputGuideline;
  private isActive: boolean = true;
  private dummyButtons: { [key: string]: Phaser.GameObjects.Image } = {};
  [key: string]: any;
  private tempStateInputs: StateInput[] = Array(5)
    .fill(null)
    .map(() => ({ sensorChecks: [], move: [], nextState: 0 }));
  private registeredStates: { id: number; name: string }[] = [];
  private registeredRow1: boolean = false;
  private registeredRow2: boolean = false;
  private registeredRow3: boolean = false;
  private registeredRow4: boolean = false;
  private registeredRow5: boolean = false;
  private containerGraphic!: Phaser.GameObjects.Graphics;
  // Add a new property to keep track of ControlButton objects

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    stateCircleId: number
  ) {
    super(scene, x, y);

    this.stateCircleId = stateCircleId;
    // console.log('StateCircleID: ', this.stateCircleId);

    const diagramScene = this.scene.scene.get('DiagramScene') as DiagramScene;
    diagramScene.events.on(
      'updatedStateCircles',
      this.updateRegisteredStates,
      this
    );

    // this.on('updateRegisteredCircles', this.updateNextStateButton);

    // Continaer Graphic
    const containerStyle = {
      width: 500,
      height: 380,
      borderRadius: 10,
      backgroundColor: 0xfcf6f5,
    };

    this.containerGraphic = this.scene.add.graphics({
      fillStyle: { color: containerStyle.backgroundColor },
    });
    this.containerGraphic.fillRoundedRect(
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

    // Label for Inputwindow
    const moveLabel = this.scene.add.image(862.5, 433, 'moveLabel');
    const nextStateLabel = this.scene.add.image(1000, 433, 'nextStateLabel');

    // Add objects into Scene
    this.add(this.containerGraphic);
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

    scene.add.existing(this);

    // Guideline
    this.inputGuideline = this.addGuildeline();
    // Control Buttons (Condition buttons, Move buttons)
    this.addControlButtons();
    // Dropddown buttons (Sensors)
    this.createSensorDropdownButton(580, 432, 'dropdownButton', options);

    const nextStateButton1 = this.addNextStateButton(
      nextStatePoints[0].x,
      nextStatePoints[0].y,
      1,
      'nextStateButton2',
      'nextStateButton',
      // this.registeredStates
      diagramScene.extractIdAndNameFromStateCircles()
    );
    this.nextStateButtons.push(nextStateButton1);

    // Divider graphics
    const dividerGraphics = this.scene.add.graphics({
      lineStyle: {
        width: 1,
        color: 14277081, // #D9D9D9
      },
    });

    // Set Divider for Input container (210, 400)
    dividerGraphics.lineBetween(559, 457, 1041, 457);
    dividerGraphics.lineBetween(760, 408, 760, 774);
    dividerGraphics.lineBetween(960, 408, 960, 774);
    // Set Divider for Controller container
    dividerGraphics.lineBetween(230, 700, 510, 700);
  }

  ///////** METHODS *//////////////////////////////////////////////////////////////////////////////////////////////////////

  // InputWindow의 활성 상태를 설정
  setInputWindowActive(active: boolean): void {
    this.active = active; // InputWindow의 활성 상태 업데이트
    this.setVisible(active); // InputWindow의 가시성도 업데이트
    this.updateControlButtonsActiveState(active); // ControlButton 객체들의 활성 상태도 업데이트
    // this.updateDropdownButtonsActiveState(active);
  }

  // InputWindow의 활성 상태 반환
  getInputwindowActive = (): boolean => {
    console.log('getInputwindowActive: ', this.isActive);
    return this.isActive;
  };

  // 이 InputWindow 객체가 소속된 StateCircle 객체 반환
  getStateCircleById(): StateCircle | undefined {
    const diagramScene = this.scene.scene.get('DiagramScene') as DiagramScene;

    return diagramScene.getStateCircleById(this.stateCircleId);
  }

  /** USER INPUT DATA UPDATE FUNCTIONS */

  // StateCircle의 StateInputs 업데이트 (POST to StateCircle)
  updateStateCircleData = () => {
    const stateCircle = this.getStateCircleById();

    if (stateCircle) {
      const tempStateInputs = this.tempStateInputs;
      stateCircle.addStateInputs(tempStateInputs);
    }
  };

  // Sensor(input) update ( When select Dropdown option )
  updateTempSensorInputs = (sensorType: SensorType): void => {
    const index = this.currentDropdownCount - 1;
    console.log('currentDropdownCount: ', this.currentDropdownCount);

    if (index >= 0 && index < 5) {
      this.tempSensorInputs[index] = sensorType;
      // TODO: DELETE TEST CODE
      console.log('tempSensorInputs: ', this.tempSensorInputs);
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

  // Condition Button(input) update
  // SensorCheck: {sensor: SensorType, condition: ButtonType}
  updateConditionButtonInput = (
    sensorNumber: number, // 등록된 Sensor 순번
    rowNumber: number, // 줄 순번
    buttonType: ButtonType
  ): void => {
    const sensor = this.tempSensorInputs[sensorNumber - 1]; // Sensor 종류
    const sensorCheck = { sensor: sensor, condition: buttonType }; // 입력할 sensorCheck
    const stateInputOrder = rowNumber - 1; // StateInput에 들어갈 순서

    const currentSensorCheckIndex = this.tempStateInputs[
      stateInputOrder
    ].sensorChecks.findIndex((sensorCheck) => sensorCheck.sensor === sensor); // 기존에 등록된 sensor인지 index 확인

    if (currentSensorCheckIndex !== -1) {
      // 이미 있는 거면 update
      this.tempStateInputs[stateInputOrder].sensorChecks[
        currentSensorCheckIndex
      ].condition = buttonType;

      // StateCircle의 StateInputs 업데이트
      this.updateStateCircleData();
      return;
    } else {
      const targetElement = this.tempStateInputs[stateInputOrder];
      targetElement.sensorChecks.push(sensorCheck);

      // StateCircle의 StateInputs 업데이트
      this.updateStateCircleData();
    }
  };

  updateMoveButtonInput = (
    moveButtonIndex: number,
    rowNumber: number,
    buttonType: ButtonType
  ) => {
    console.log(
      'rowNumber: ',
      rowNumber,
      'buttonType: ',
      buttonType,
      'moveButtonIndex: ',
      moveButtonIndex - 5
    );
    const stateInputOrder = rowNumber - 1;
    const moveInputIndex = moveButtonIndex - 5;

    console.log(
      '업데이트 전 move 배열: ',
      this.tempStateInputs[stateInputOrder]
    );
    const targetElement = this.tempStateInputs[stateInputOrder];
    targetElement.move[moveInputIndex] = buttonType;

    // StateCircle의 StateInputs 업데이트
    this.updateStateCircleData();

    console.log(
      'move Input 업데이트 된 tempStateInputs: ',
      this.tempStateInputs
    );
  };

  // NextState (input) update
  updateNextStateInput(buttonId: number, nextStateId: number) {
    const stateInputIndex = buttonId - 1;

    this.tempStateInputs[stateInputIndex].nextState = nextStateId;

    // StateCircle의 StateInputs 업데이트
    this.updateStateCircleData();

    console.log('update nextState', this.tempStateInputs);
  }

  // RegisteredStates update { id: number; name: string }[] - DiagramScene에서 StateCircles가 update되면, 바로 실행
  updateRegisteredStates = (
    updatedStateCircles: { id: number; name: string }[]
  ): void => {
    this.registeredStates = updatedStateCircles;

    console.log('updateRegisteredStates 함수 실행됨');
    console.log('등록된 stateCircles', this.registeredStates);

    // Update options of the NextState Buttons
    this.updateNextStateButton(this.registeredStates);
  };
  // Update options of the NextState Buttons
  updateNextStateButton(
    updatedStateCircles: { id: number; name: string }[]
  ): void {
    const options = updatedStateCircles;
    for (const nextStateButton of this.nextStateButtons) {
      nextStateButton.setOptions = options;
    }
  }

  /** Related to Graphic  */

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
    // dropdownButton.setActive(this.active);
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

  checkRegistedSensor = (sensorType: SensorType): void => {
    // 배열에 sensorType이 이미 존재하는지 확인
    if (this.tempSensorInputs.includes(sensorType)) {
      // sensorType이 이미 존재하면, 알림 팝업을 표시하고 함수를 반환합니다.
      alert('The sensor type is already registered');
      return;
    }
  };

  /** NextState Dropdown */
  addNextStateButton = (
    x: number,
    y: number,
    buttonId: number,
    buttonTexture: string,
    backgroundTexture: string,
    options: { id: number; name: string }[]
  ): NextStateButton => {
    const nextStateButton = new NextStateButton(
      this.scene,
      x,
      y,
      buttonId,
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

      this.controlButtons.push(button);
      button.setActive(this.active);

      this.scene.add.existing(button);
    });
  };

  // ControlButton 객체들의 활성 상태를 업데이트하는 메서드
  updateControlButtonsActiveState(active: boolean): void {
    this.controlButtons.forEach((button) => {
      button.setActive(active); // Phaser의 내장 메서드를 사용하여 활성 상태 설정
      button.setVisible(active); // 버튼의 가시성도 업데이트
    });
  }
  // updateDropdownButtonsActiveState(active: boolean): void {
  //   this.dropdownButtons.forEach((dropdown) => {
  //     dropdown.setActive(active); // Phaser의 내장 메서드를 사용하여 활성 상태 설정
  //     dropdown.setVisible(active); // 버튼의 가시성도 업데이트
  //   });
  // }

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

          // TODO: Guideline 관련 다시 수정할 것
          // guideline.isInsideValidArea(newButton, dragX, dragY);

          // console.log('setGuidelineVisible(true, 0)');
          // for (let i = 0; i < this.inputRowCount; i++) {
          //   guideline.setGuidelineVisible(true, i);
          // }
        }
      }
    );

    button.on('dragend', (pointer: Phaser.Input.Pointer) => {
      if (newButton) {
        if (
          newButton.getType === ButtonType.YesButton ||
          newButton.getType === ButtonType.NoButton ||
          newButton.getType === ButtonType.YesNoButton
        ) {
          for (const point of conditionInputPoints) {
            const distance = Phaser.Math.Distance.Between(
              newButton.x,
              newButton?.y,
              point.x,
              point.y
            );

            if (distance <= 20) {
              newButton.destroy();

              const sensorCount: number = this.tempSensorInputs.length; // 등록된 sensor 갯수
              const targetSensorIndex: number = parseInt(
                point.key.split('_')[1][1]
              ); // 입력 sensor 번호
              const rowNumber: number = parseInt(point.key.split('_')[1][0]); // 입력 줄 번호

              if (
                sensorCount + 1 < targetSensorIndex ||
                rowNumber > this.inputRowCount
              ) {
                console.log('등록된 sensorInputs: ', this.tempSensorInputs);
                console.log('sensorCount: ', sensorCount);
                console.log('targetSensorIndex: ', targetSensorIndex);
                // 입력하려는 sensor번호에 sensor가 미등록이면, 취소
                console.log('sensor 미등록으로 취소');
                return; // 함수 종료
              }
              const pointKey: string = point.key;
              const buttonType: ButtonType = newButton.getType;
              console.log('buttonImg:', this.dummyButtons[pointKey]);
              console.log('buttonType:', buttonType);
              this.changeButtonImage(this.dummyButtons[pointKey], buttonType);
              this.registerInputRow(rowNumber);
              console.log(
                'sensor 순번: ',
                targetSensorIndex,
                '줄 순번: ',
                rowNumber
              );
              this.updateConditionButtonInput(
                targetSensorIndex,
                rowNumber,
                buttonType
              );
              // break;
            } else {
              newButton.destroy();
            }
          }
        } else if (
          newButton.getType === ButtonType.ForwardButton ||
          newButton.getType === ButtonType.LeftButton ||
          newButton.getType === ButtonType.RightButton ||
          newButton.getType === ButtonType.PickButton ||
          newButton.getType === ButtonType.PutButton
        ) {
          // moveInputPoints.forEach((point) => {
          for (const point of moveInputPoints) {
            const distance = Phaser.Math.Distance.Between(
              newButton.x,
              newButton?.y,
              point.x,
              point.y
            );

            if (distance <= 20) {
              newButton.destroy();

              const moveInputIndex = parseInt(point.key.split('_')[1][1]);
              const rowNumber = parseInt(point.key.split('_')[1][0]); // 1
              const rowNumerBoolean = 'registeredRow' + rowNumber;
              if (!(this as any)[rowNumerBoolean]) {
                return;
              }
              const pointKey: string = point.key;
              const buttonType: ButtonType = newButton.getType;
              this.changeButtonImage(this.dummyButtons[pointKey], buttonType);
              this.updateMoveButtonInput(
                moveInputIndex,
                rowNumber,
                newButton.getType
              );
              // break;
            } else {
              newButton.destroy();
            }
          }
        }
      }

      // guideline.setAllGuidelinesVisible(false);
    });
  };

  // Change the boolean value indicating whether the line registered or not
  registerInputRow = (rowNumber: number) => {
    switch (rowNumber) {
      case 1:
        this.registeredRow1 = true;
        this.inputRowCount++;
        // const nextStateButton1 = this.addNextStateButton(
        //   nextStatePoints[0].x,
        //   nextStatePoints[0].y,
        //   1,
        //   'nextStateButton2',
        //   'nextStateButton',
        //   this.registeredStates
        // );
        // this.nextStateButtons.push(nextStateButton1);

        // for (let i = 0; i < this.inputRowCount; i++) {
        //   console.log('setGuidelineVisible(true, 1);');
        //   this.inputGuideline.setGuidelineVisible(true, 1);
        // }
        break;
      case 2:
        this.registeredRow2 = true;
        this.inputRowCount++;
        const nextStateButton2 = this.addNextStateButton(
          nextStatePoints[1].x,
          nextStatePoints[1].y,
          2,
          'nextStateButton2',
          'nextStateButton',
          this.registeredStates
        );
        this.nextStateButtons.push(nextStateButton2);
        // for (let i = 0; i < this.inputRowCount; i++) {
        // this.inputGuideline.setGuidelineVisible(true, 2);
        // }
        break;
      case 3:
        this.registeredRow3 = true;
        this.inputRowCount++;
        const nextStateButton3 = this.addNextStateButton(
          nextStatePoints[2].x,
          nextStatePoints[2].y,
          1,
          'nextStateButton2',
          'nextStateButton',
          this.registeredStates
        );
        this.nextStateButtons.push(nextStateButton3);
        // for (let i = 0; i < this.inputRowCount; i++) {
        // this.inputGuideline.setGuidelineVisible(true, 3);
        // }
        break;
      case 4:
        this.registeredRow4 = true;
        this.inputRowCount++;
        const nextStateButton4 = this.addNextStateButton(
          nextStatePoints[3].x,
          nextStatePoints[3].y,
          1,
          'nextStateButton2',
          'nextStateButton',
          this.registeredStates
        );
        this.nextStateButtons.push(nextStateButton4);
        // for (let i = 0; i < this.inputRowCount; i++) {
        // this.inputGuideline.setGuidelineVisible(true, 4);
        // }
        break;
      case 5:
        this.registeredRow5 = true;
        this.inputRowCount++;
        const nextStateButton5 = this.addNextStateButton(
          nextStatePoints[4].x,
          nextStatePoints[4].y,
          1,
          'nextStateButton2',
          'nextStateButton',
          this.registeredStates
        );
        this.nextStateButtons.push(nextStateButton5);
        // for (let i = 0; i < this.inputRowCount; i++) {
        // this.inputGuideline.setGuidelineVisible(true, i);
        // }
        break;
      default:
        return;
    }
  };

  // Change the image of a button when dragged to input
  changeButtonImage = (
    buttonImg: Phaser.GameObjects.Image,
    buttonType: ButtonType
  ): void => {
    let replaceImgTexture: string;

    switch (buttonType) {
      case ButtonType.YesButton:
        replaceImgTexture = 'yesButton';
        buttonImg.setTexture(replaceImgTexture);
        buttonImg.setVisible(true);
        console.log('buttonImg texture after setTexture:', buttonImg.texture);
        console.log('change to yesButton');
        break;
      case ButtonType.NoButton:
        replaceImgTexture = 'noButton';
        buttonImg.setTexture(replaceImgTexture);
        buttonImg.setVisible(true);
        console.log('change to noButton');
        break;
      case ButtonType.YesNoButton:
        replaceImgTexture = 'yesNoButton';
        buttonImg.setTexture(replaceImgTexture);
        buttonImg.setVisible(true);
        console.log('change to yesNoButton');
        break;
      case ButtonType.ForwardButton:
        replaceImgTexture = 'forwardButton';
        buttonImg.setTexture(replaceImgTexture);
        buttonImg.setVisible(true);
        console.log('change to forwardButton');
        break;
      case ButtonType.LeftButton:
        replaceImgTexture = 'leftButton';
        buttonImg.setTexture(replaceImgTexture);
        buttonImg.setVisible(true);
        console.log('change to leftButton');
        break;
      case ButtonType.RightButton:
        replaceImgTexture = 'rightButton';
        buttonImg.setTexture(replaceImgTexture);
        buttonImg.setVisible(true);
        console.log('change to rightButton');
        break;
      case ButtonType.PutButton:
        replaceImgTexture = 'putButton';
        buttonImg.setTexture(replaceImgTexture);
        buttonImg.setVisible(true);
        console.log('change to putButton');
        break;
      case ButtonType.PickButton:
        replaceImgTexture = 'pickButton';
        buttonImg.setTexture(replaceImgTexture);
        buttonImg.setVisible(true);
        console.log('change to pickButton');
        break;
      default:
        return;
    }

    buttonImg.setVisible(true);
  };

  // Button을 드래그하여 올렸을 때 버튼 이미지를 등록하는 함수
  registerConditionBtn = (inputBtn: ControlButton) => {};

  /** Control Button */
  addControlButton(button: ControlButton, x: number, y: number): void {
    this.controlButtons.push(button);
    this.add(button);

    button.setPosition(x, y);
  }

  /** Guideline */
  addGuildeline = (): InputGuideline => {
    console.log('가이드라인 추가');
    const inputGutideline = new InputGuideline(
      this.scene,
      guidelinePositions,
      'inputGuideline'
    );

    // this.add(inputGutideline);
    this.scene.add.existing(inputGutideline);
    return inputGutideline;
  };
}

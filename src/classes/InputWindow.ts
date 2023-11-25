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
import PlaygroundScene from '../scenes/PlaygroundScene';
import StateCircle from './StateCircle';
import { NextStateButton } from './NextStateButton';
import {
  inputContainerConfig,
  options,
  buttonConfigurations,
  conditionInputPoints,
  moveInputPoints,
  nextStatePoints,
  guidelinePositions,
} from '../configurations';
import StateCircleManager from './StateCircleManager';

export class InputWindow extends Phaser.GameObjects.Container {
  private diagramScene: DiagramScene;
  private stateCircleId: number = -1;
  private controlButtons: ControlButton[] = [];
  private dropdownButtons: DropdownMenu[] = [];
  private nextStateButtons: NextStateButton[] = [];
  private tempSensorInputs: SensorType[] = []; // Store selected sensor button
  private inputRowCount: number = 1; // 줄 순서대로 입력을 강제하기 위한 인수
  private inputGuideline!: InputGuideline;
  private isActive!: boolean;
  private dummyButtons: { [key: string]: Phaser.GameObjects.Image } = {};
  [key: string]: any;
  // private dummynextStateButtons: { [key: string]: NextStateButton} = {}
  private tempStateInputs: StateInput[] = Array(5)
    .fill(null)
    .map(() => ({ sensorChecks: [], move: [], nextState: -1 }));
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

    this.diagramScene = this.scene.scene.get('DiagramScene') as DiagramScene;
    this.diagramScene.events.on(
      'updatedStateCircles',
      this.updateRegisteredStates,
      this
    );

    /** Continaer Graphic (Input) */
    const containerStyle = {
      width: 500,
      height: 380,
      borderRadius: 10,
      backgroundColor: 0xfcf6f5,
    };
    this.containerGraphic = this.scene.add.graphics({
      fillStyle: { color: inputContainerConfig.backgroundColor },
    });
    this.containerGraphic.fillRoundedRect(
      inputContainerConfig.x,
      inputContainerConfig.y,
      inputContainerConfig.width,
      inputContainerConfig.height,
      inputContainerConfig.borderRadius
    );
    /** Continaer Graphic (Control) */
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

    /** Label Images (Move, NextState) */
    const moveLabel = this.scene.add.image(861, 431, 'moveLabel');
    const nextStateLabel = this.scene.add.image(1000, 431, 'nextStateLabel');

    // Add objects into Scene
    this.add(this.containerGraphic);
    this.add(controlContainerGraphic);
    this.add(moveLabel);
    this.add(nextStateLabel);

    // Initialize - NextState Button (default: invisible)
    for (let i = nextStatePoints.length - 1; i >= 0; i--) {
      const point = nextStatePoints[i];
      const buttonId = i + 1;
      const buttonTexture = 'nextStateButton2';
      const backgroundTexture = 'nextStateButton';
      const options = this.registeredStates;

      const nextStateButton: NextStateButton = this.createNextStateButton(
        point.x,
        point.y,
        buttonId,
        buttonTexture,
        backgroundTexture,
        options
      );
      nextStateButton.setVisible(false);
      this.nextStateButtons.unshift(nextStateButton);
    }
    // Default: Set 1st.NextState Button visible
    this.nextStateButtons[0].setVisible(true);

    // Initialize - Condition button images (default: invisible)
    conditionInputPoints.forEach((point) => {
      this.dummyButtons[point.key] = this.scene.add.image(
        point.x,
        point.y,
        'yesNoButton'
      );
      this.dummyButtons[point.key].setVisible(false);
      this.makeDummyButtonDraggable(this.dummyButtons[point.key], point.key);
      this.add(this.dummyButtons[point.key]);
    });

    // Initialize - Move button images (default: invisible)
    moveInputPoints.forEach((point) => {
      this.dummyButtons[point.key] = this.scene.add.image(
        point.x,
        point.y,
        'forwardButton'
      );
      this.dummyButtons[point.key].setVisible(false);
      this.makeDummyButtonDraggable(this.dummyButtons[point.key], point.key);
      this.add(this.dummyButtons[point.key]);
    });

    scene.add.existing(this);

    /** Guideline */
    this.inputGuideline = this.addGuildeline();
    // Control Buttons (Condition buttons, Move buttons)
    this.addControlButtons();
    // Dropddown buttons (Sensors)
    this.createSensorDropdownButton(580, 432, 'dropdownButton', options);

    this.registerInputRow(0);

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

  ///////** STATE UPDATE METHODS *//////////////////////////////////////////////////////////////////////////////////////////////////////

  // InputWindow의 활성 상태 반환
  getInputwindowActive = (): boolean => {
    return this.isActive;
  };

  // InputWindow의 활성 상태를 설정
  setInputWindowActive(active: boolean): void {
    this.active = active; // InputWindow의 활성 상태 업데이트
    this.setVisible(active); // InputWindow의 가시성도 업데이트
    this.updateControlButtonsActiveState(active); // ControlButton 객체들의 활성 상태도 업데이트
    // this.updateDropdownButtonsActiveState(active);
  }

  /** USER INPUT DATA UPDATE FUNCTIONS */
  // StateCircle의 StateInputs 업데이트 역할 (POST to StateCircle)

  // 이 InputWindow 객체가 소속된 StateCircle 객체 반환
  getStateCircleById(): StateCircle {
    // const diagramScene = this.scene.scene.get('DiagramScene') as DiagramScene;

    return this.diagramScene.stateCircleManager.getStateCircleById(
      this.stateCircleId
    );
  }

  updateStateCircleStateInput = () => {
    const stateCircle = this.getStateCircleById();

    if (stateCircle) {
      console.log('(Inputwindow.ts) updateStateCircleStateInput함수 ');
      const tempStateInputs = this.tempStateInputs;
      stateCircle.addStateInputs(tempStateInputs);
    }
  };

  // Sensor(input) update ( When select Dropdown option )
  updateTempSensorInputs = (sensorType: SensorType): void => {
    const index = this.tempSensorInputs.length;

    if (index >= 0 && index < 5) {
      this.tempSensorInputs[index] = sensorType;
    } else {
      console.log('Index out of bounds: ', index);
    }
  };

  // Update - Condition input
  // SensorCheck: {sensor: SensorType, condition: ButtonType}
  updateConditionButtonInput = (
    sensorNumber: number, // 등록된 Sensor 순번 (index X_)
    rowNumber: number, // 줄 순번 (index _X)
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
      this.updateStateCircleStateInput();
      return;
    } else {
      const targetElement = this.tempStateInputs[stateInputOrder];
      targetElement.sensorChecks.push(sensorCheck);

      // StateCircle의 StateInputs 업데이트
      this.updateStateCircleStateInput();
    }
  };

  clearConditionButtonInput = (
    rowNumber: number, // 줄 순번 (index _X)
    sensorNumber: number // 등록된 Sensor 순번 (index X_)
  ): void => {
    const stateInputOrder = rowNumber - 1; // StateInput 배열의 index
    const sensorChecksOrder = sensorNumber - 1; // SensorChecks 배열의 index

    // 해당 sensorCheck가 존재하는지 확인
    if (this.tempStateInputs[stateInputOrder].sensorChecks[sensorChecksOrder]) {
      // 해당 sensorCheck의 condition만 -1로 설정
      this.tempStateInputs[stateInputOrder].sensorChecks[
        sensorChecksOrder
      ].condition = undefined;

      // StateCircle의 StateInputs 업데이트
      this.updateStateCircleStateInput();
    }
  };

  // Update - Move input
  updateMoveButtonInput = (
    moveButtonIndex: number,
    rowNumber: number,
    buttonType: ButtonType
  ): void => {
    const stateInputOrder = rowNumber - 1;
    const moveInputIndex = moveButtonIndex - 5;

    const targetElement = this.tempStateInputs[stateInputOrder];
    targetElement.move[moveInputIndex] = buttonType;

    // StateCircle의 StateInputs 업데이트
    this.updateStateCircleStateInput();
  };

  clearMoveButtonInput = (rowNumber: number, buttonsOrder: number): void => {
    const stateInputOrder = rowNumber - 1; // StateInput 배열의 index
    const moveButtonsOrder = buttonsOrder - 5; // SensorChecks 배열의 index

    if (
      this.tempStateInputs[stateInputOrder].move[moveButtonsOrder] !== undefined
    ) {
      this.tempStateInputs[stateInputOrder].move[moveButtonsOrder] = null;
    }
  };

  // Update -  NextState input
  updateNextStateInput(buttonId: number, nextStateId: number): void {
    const stateInputIndex = buttonId - 1;

    this.tempStateInputs[stateInputIndex].nextState = nextStateId;

    // StateCircle의 StateInputs 업데이트
    console.log('(InputWindow.ts) updateNextStateInput 함수');
    this.updateStateCircleStateInput();
  }

  // RegisteredStates update { id: number; name: string }[] - DiagramScene에서 StateCircles가 update되면, 바로 실행
  updateRegisteredStates = (
    updatedStateCircles: { id: number; name: string }[]
  ): void => {
    this.registeredStates = updatedStateCircles;

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

  // Change the boolean value indicating whether the line registered or not
  registerInputRow = (rowNumber: number) => {
    switch (rowNumber) {
      case 1:
        this.registeredRow1 = true;
        this.inputRowCount++;
        break;
      case 2:
        this.registeredRow2 = true;

        this.inputRowCount++;
        this.nextStateButtons[1].setVisible(true);
        // for (let i = 0; i < this.inputRowCount; i++) {
        // this.inputGuideline.setGuidelineVisible(true, 2);
        // }
        break;
      case 3:
        this.registeredRow3 = true;
        this.inputRowCount++;
        this.nextStateButtons[2].setVisible(true);
        break;
      case 4:
        this.registeredRow4 = true;
        this.inputRowCount++;
        this.nextStateButtons[3].setVisible(true);
        break;
      case 5:
        this.registeredRow5 = true;
        this.inputRowCount++;
        this.nextStateButtons[4].setVisible(true);
        break;
      default:
        return;
    }
  };

  // Button을 드래그하여 올렸을 때 버튼 이미지를 등록하는 함수
  registerConditionBtn = (inputBtn: ControlButton) => {};

  ///////** UNTILITY METHODS */////////////////////////////////////////////////////////////////////////////////////////////

  /** Graphic  */
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

  /** Sensor Dropdown Button */
  // Used to create a dropdown button into Scene (Initial)
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

  // Used to create addtional dropdown button, when option selected
  addSensorDropdownButton(clickedDropdown: DropdownMenu) {
    const registedSensorCount = this.tempSensorInputs.length;

    if (registedSensorCount < 3) {
      let newX = clickedDropdown.getX + 50;
      let newY = clickedDropdown.getY;

      const newDropdownButton = this.createSensorDropdownButton(
        newX,
        newY,
        'dropdownButton',
        options
      );

      this.dropdownButtons.push(newDropdownButton);
      return;
    }
  }

  // TODO: 이거 다시 분류할 것
  checkRegistedSensor = (sensorType: SensorType): void => {
    // 배열에 sensorType이 이미 존재하는지 확인
    if (this.tempSensorInputs.includes(sensorType)) {
      // sensorType이 이미 존재하면, 알림 팝업을 표시하고 함수를 반환합니다.
      alert('The sensor type is already registered');
      return;
    }
  };

  /** NextState Dropdown Button */
  createNextStateButton = (
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
  // create control button object
  createControlButton = (
    x: number,
    y: number,
    texture: string,
    type: ButtonType
  ): ControlButton => {
    const newControlButton = new ControlButton(this.scene, x, y, texture, type);

    return newControlButton;
  };
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

  // Set ControlButton Draggable
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
          newButton.setDepth(100);

          if (
            this.tempSensorInputs.length > 0 &&
            (newButton.getType === ButtonType.YesButton ||
              newButton.getType === ButtonType.NoButton ||
              newButton.getType === ButtonType.YesNoButton)
          ) {
            for (let i = 0; i < this.inputRowCount; i++) {
              guideline.setGuidelineVisible(true, i);
            }
          } else if (
            this.tempSensorInputs.length > 0 &&
            (newButton.getType === ButtonType.ForwardButton ||
              newButton.getType === ButtonType.LeftButton ||
              newButton.getType === ButtonType.RightButton ||
              newButton.getType === ButtonType.PickButton ||
              newButton.getType === ButtonType.PutButton)
          ) {
            for (let i = 0; i < this.inputRowCount - 1; i++) {
              guideline.setGuidelineVisible(true, i);
            }
          }
        }
      }
    );

    button.on('dragend', (pointer: Phaser.Input.Pointer) => {
      if (newButton) {
        newButton.setDepth(1);
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

              const registedSensorCount: number = this.tempSensorInputs.length; // 등록된 sensor 갯수
              const targetSensorIndex: number = parseInt(
                point.key.split('_')[1][1]
              ); // 입력 sensor 번호
              const rowNumber: number = parseInt(point.key.split('_')[1][0]); // 입력 줄 번호

              if (
                registedSensorCount === 0 ||
                registedSensorCount < targetSensorIndex ||
                rowNumber > this.inputRowCount
              ) {
                return;
              }
              const pointKey: string = point.key;
              const buttonType: ButtonType = newButton.getType;
              this.changeButtonImage(this.dummyButtons[pointKey], buttonType);
              this.registerInputRow(rowNumber);
              this.updateConditionButtonInput(
                targetSensorIndex,
                rowNumber,
                buttonType
              );
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

      guideline.setAllGuidelinesVisible(false);
    });
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
        break;
      case ButtonType.NoButton:
        replaceImgTexture = 'noButton';
        buttonImg.setTexture(replaceImgTexture);
        buttonImg.setVisible(true);
        break;
      case ButtonType.YesNoButton:
        replaceImgTexture = 'yesNoButton';
        buttonImg.setTexture(replaceImgTexture);
        buttonImg.setVisible(true);
        break;
      case ButtonType.ForwardButton:
        replaceImgTexture = 'forwardButton';
        buttonImg.setTexture(replaceImgTexture);
        buttonImg.setVisible(true);
        break;
      case ButtonType.LeftButton:
        replaceImgTexture = 'leftButton';
        buttonImg.setTexture(replaceImgTexture);
        buttonImg.setVisible(true);
        break;
      case ButtonType.RightButton:
        replaceImgTexture = 'rightButton';
        buttonImg.setTexture(replaceImgTexture);
        buttonImg.setVisible(true);
        break;
      case ButtonType.PutButton:
        replaceImgTexture = 'putButton';
        buttonImg.setTexture(replaceImgTexture);
        buttonImg.setVisible(true);
        break;
      case ButtonType.PickButton:
        replaceImgTexture = 'pickButton';
        buttonImg.setTexture(replaceImgTexture);
        buttonImg.setVisible(true);
        break;
      default:
        return;
    }

    buttonImg.setVisible(true);
  };

  /** Dummy Button Images for Input (Condition, Move) */
  // Set DummyButton Images for condition input and move input draggable
  makeDummyButtonDraggable = (
    image: Phaser.GameObjects.Image,
    pointKey: string
  ) => {
    const originalPosition = { x: image.x, y: image.y };

    image.setInteractive();
    this.scene.input.setDraggable(image);

    image.on(
      'drag',
      (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        image.x = dragX;
        image.y = dragY;
      }
    );

    image.on(
      'dragend',
      (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        const containerGraphicBounds = {
          x: 550,
          y: 400,
          width: 500,
          height: 380,
        };

        const isInsideContainer: boolean =
          pointer.x >= containerGraphicBounds.x &&
          pointer.x <=
            containerGraphicBounds.x + containerGraphicBounds.width &&
          pointer.y >= containerGraphicBounds.y &&
          pointer.y <= containerGraphicBounds.y + containerGraphicBounds.height;

        // 원래 자리로 이동
        image.x = originalPosition.x;
        image.y = originalPosition.y;

        if (!isInsideContainer) {
          image.setVisible(false);

          const rowNumber: number = parseInt(pointKey.split('_')[1][0]);
          const targetSensorIndex: number = parseInt(pointKey.split('_')[1][1]);

          this.clearConditionButtonInput(rowNumber, targetSensorIndex);
        }
      }
    );
  };

  /** Guideline */
  addGuildeline = (): InputGuideline => {
    const inputGutideline = new InputGuideline(
      this.scene,
      guidelinePositions,
      'inputGuideline'
    );

    this.scene.add.existing(inputGutideline);
    return inputGutideline;
  };

  /** Cleanup function to destroy all created objects */
  cleanup = (): void => {
    // Destroy all control buttons
    this.controlButtons.forEach((button) => {
      button.destroy();
    });

    this.nextStateButtons.forEach((button) => {
      button.destroy();
    });

    // Destroy all dummy buttons
    Object.values(this.dummyButtons).forEach((buttonImg) => {
      buttonImg.destroy();
    });

    // Destroy other created objects if any
    // 예: this.someOtherObject.destroy();

    // Optionally, clear arrays or other data structures
    this.controlButtons = [];
    this.dummyButtons = {};
    // 예: this.someOtherArray = [];

    // Additional cleanup actions if required
    // 예: this.scene.events.off('some-event', this.someEventHandler);
  };
}

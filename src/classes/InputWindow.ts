import Phaser from 'phaser';
import {
  DropdownMenu,
  DropdownOption,
  SensorType,
} from '../classes/DropdownMenu';
import { InputGuideline } from '../classes/InputGuideline';
import ControlButton, { ButtonType } from './ControlButton';
import DiagramScene from '../scenes/DiagramScene';
import StateCircle from './StateCircle';

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

const inputCoordinates = [
  { key: 'dummyButton_11', x: 586, y: 490 },
  { key: 'dummyButton_12', x: 636, y: 490 },
  { key: 'dummyButton_13', x: 686, y: 490 },
  { key: 'dummyButton_14', x: 736, y: 490 },
];
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
  private dummyButton_11!: Phaser.GameObjects.Image;
  private dummyButton_12!: Phaser.GameObjects.Image;
  private dummyButton_13!: Phaser.GameObjects.Image;
  private dummyButton_14!: Phaser.GameObjects.Image;
  [key: string]: any;

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
    dividerGraphics.lineBetween(775, 408, 775, 774);
    dividerGraphics.lineBetween(950, 408, 950, 774);
    // Set Divider for Controller container
    dividerGraphics.lineBetween(230, 700, 510, 700);

    // Label for Inputwindow
    const moveLabel = this.scene.add.image(862.5, 433, 'moveLabel');
    const nextStateLabel = this.scene.add.image(995, 433, 'nextStateLabel');

    // this.dummyButton_11 = this.scene.add.image(586, 490, 'yesNoButton');
    // const dummyButton_12 = this.scene.add.image(636, 490, 'yesNoButton');
    // this.dummyButton_11.setVisible(false);

    this.inputGuideline = this.addGuildeline();

    // Add objects into Scene
    this.add(containerGraphic);
    this.add(controlContainerGraphic);
    this.add(moveLabel);
    this.add(nextStateLabel);

    inputCoordinates.forEach((coordinate) => {
      this[coordinate.key] = this.scene.add.image(
        coordinate.x,
        coordinate.y,
        'yesNoButton'
      );

      this[coordinate.key].setVisible(false);
      this.add(this[coordinate.key]);
    });
    // this.add(this.dummyButton_11);
    // this.add(thidummyButton_12);

    scene.add.existing(this);

    this.addDummyButtons();
    this.addControlButtons();
    this.addDropdownButton(586, 432, options);
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  /** METHODS */
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
  // Used to add dropdown button
  addDropdownButton = (
    x: number,
    y: number,
    options: DropdownOption[]
  ): DropdownMenu => {
    const dropdownButton = new DropdownMenu(
      this.scene,
      x,
      y,
      'dropdownButton',
      options,
      this
    );
    // dropdownButton.setDepth(2);
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

  handleDropdownClick(clickedDropdown: DropdownMenu) {
    console.log('handleDropdownClick function executed');
    if (this.currentDropdownCount < 3 && this.getInputwindowActive()) {
      let newX = clickedDropdown.getX + 50;
      let newY = clickedDropdown.getY;

      const newDropdownButton = this.addDropdownButton(newX, newY, options);

      this.dropdownButtons.push(newDropdownButton);
      console.log('New Dropdown Button:', newDropdownButton); // Log the new DropdownMenu instance
      console.log('Dropdown Buttons Array:', this.dropdownButtons); //
      this.currentDropdownCount++; // Increment the count here

      return;
    }
  }

  /** Control Buttons */
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

      // console.log(button);
      this.scene.add.existing(button);
    });
  };

  // Dummy Buttons for Drag Input
  addDummyButtons = (): void => {
    // this.scene.add.image(586, 490, 'yesNoButton');
    // dummyButtonConfigurations.forEach((config) => {
    //   // const dummyButton = this.createControlButton(
    //   //   config.x,
    //   //   config.y,
    //   //   config.texture,
    //   //   config.type
    //   // );
    //   // dummyButton.name = config.name;
    //   const dummyButton = this.scene.add.image(
    //     config.x,
    //     config.y,
    //     config.texture
    //   );
    //   dummyButton.setDepth(0);
    //   // dummyButton.setVisible(false);
    //   this.scene.add.existing(dummyButton);
    //   // TODO: DELETE TEST CODE
    //   console.log('더미 코드 추가됨', dummyButton.depth);
    // });
  };

  // onDummyButtons = () => {
  //   this.dummyButtons.forEach((dummyButton) => {
  //     this.scene.tweens.add({
  //       targets: dummyButton,
  //       duration: 300,
  //       ease: 'Sine.easeOut',
  //       onStart: () => dummyButton.setVisible(true),
  //     });
  //   });
  // };

  createControlButton = (
    x: number,
    y: number,
    texture: string,
    type: ButtonType
  ): ControlButton => {
    const newControlButton = new ControlButton(this.scene, x, y, texture, type);

    return newControlButton;
  };

  /** Function set ControllButton Draggable */
  setButtonDraggable = (
    button: ControlButton,
    selectedButtonImage: string,
    guideline: InputGuideline
  ): void => {
    button.setInteractive();

    this.scene.input.setDraggable(button);

    let newButton: ControlButton | null = null;

    button.on('dragstart', (pointer: Phaser.Input.Pointer) => {
      newButton = this.createControlButton(
        pointer.x,
        pointer.y,
        selectedButtonImage,
        button.getType
      );
      if (newButton) {
        newButton!.setSelected = true;
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
        const distance = Phaser.Math.Distance.Between(
          newButton.x,
          newButton.y,
          586,
          490
        );

        if (distance <= 40) {
          console.log('40 이하');
          newButton.setSelected = false;
          newButton.destroy();

          if (newButton.getType === ButtonType.YesButton) {
            console.log('타임은 YES');
            this.changeButtonImage(this.dummyButton_11, 'yesButton');
          } else if (newButton.getType === ButtonType.NoButton) {
            console.log('타임은 NO');
            this.changeButtonImage(this.dummyButton_11, 'noButton');
          } else if (newButton.getType === ButtonType.YesNoButton) {
            console.log('타임은 YESNO');
            this.changeButtonImage(this.dummyButton_11, 'yesNoButton');
          }

          // const originButtonImage = newButton.texture.key.slice(0, -8);
          // newButton.setTexture(`${originButtonImage}`);

          // const selectedStateCircle = this.findSelectedStateCircle();

          // if (selectedStateCircle) {
          //   const inputWindow = selectedStateCircle.getInputWindow();
          //   if (inputWindow) {
          //     inputWindow.addControlButton(newButton, 586, 490); // Add the new button to the InputWindow of the selected StateCircle
          //   }
          // }

          // newButton.setPosition(586, 490);
        } else {
          newButton.destroy();
        }
      }

      guideline.setAllGuidelinesVisible(false);
    });
  };

  // Button을 드래그하여 올렸을 때 버튼 이미지를 등록하는 함수
  registerConditionBtn = (inputBtn: ControlButton) => {};

  // Button Image 변경하는 함수
  changeButtonImage = (
    buttonImg: Phaser.GameObjects.Image,
    replaceImgTexture: string
  ): void => {
    buttonImg.setTexture(replaceImgTexture);
    buttonImg.setVisible(true);
  };

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

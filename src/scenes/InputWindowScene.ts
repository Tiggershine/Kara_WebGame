import Phaser from 'phaser';
import ControlButton, { ButtonType } from '../classes/ControlButton';

export default class InputWindowScene extends Phaser.Scene {
  private validArea!: Phaser.GameObjects.Rectangle;
  private yesButton!: ControlButton;
  private noButton!: ControlButton;
  private yesNoButton!: ControlButton;

  constructor() {
    super('InputWindowScene');
  }

  // Values for Style
  private containerStyle = {
    x: 550,
    y: 400,
    width: 500,
    height: 380,
    borderRadius: 10,
    backgroundColor: 0xfcf6f5,
  };

  private bookmarkStyle = {
    x: 550,
    y: 360,
    width: 80,
    height: 60,
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

  preload() {
    this.load.image('yesButtonImage', 'assets/YesButton.png');
    this.load.image('noButtonImage', 'assets/NoButton.png');
    this.load.image('yesNoButtonImage', 'assets/YesNoButton.png');
    this.load.image('yesButtonSelectedImage', 'assets/YesButtonSelected.png');
    this.load.image('noButtonSelectedImage', 'assets/NoButtonSelected.png');
    this.load.image(
      'yesNoButtonSelectedImage',
      'assets/YesNoButtonSelected.png'
    );
  }

  create() {
    // Background for Input container
    const containerGraphics = this.createRoundRectGraphics(
      this.containerStyle.x,
      this.containerStyle.y,
      this.containerStyle.width,
      this.containerStyle.height,
      this.containerStyle.borderRadius,
      this.containerStyle.backgroundColor
    );

    // Label for Input container
    const bookmarkGraphics = this.createRoundRectGraphics(
      this.bookmarkStyle.x,
      this.bookmarkStyle.y,
      this.bookmarkStyle.width,
      this.bookmarkStyle.height,
      this.bookmarkStyle.borderRadius,
      this.bookmarkStyle.backgroundColor
    );

    // Background for Controller Container
    const controllerContainerGraphics = this.createRoundRectGraphics(
      this.controllerContainerStyle.x,
      this.controllerContainerStyle.y,
      this.controllerContainerStyle.width,
      this.controllerContainerStyle.height,
      this.controllerContainerStyle.borderRadius,
      this.controllerContainerStyle.backgroundColor
    );

    // Divider lines of background container
    const dividerGraphics = this.add.graphics({
      lineStyle: {
        width: 1,
        color: 14277081, // #D9D9D9
      },
    });
    // Divider for Input container
    dividerGraphics.lineBetween(559, 457, 1041, 457);
    dividerGraphics.lineBetween(750, 408, 750, 774);
    dividerGraphics.lineBetween(950, 428, 950, 774);
    // Divider for Controller container
    dividerGraphics.lineBetween(230, 700, 510, 700);

    // Yes button object
    this.yesButton = this.createControlButton(
      375,
      665,
      'yesButtonImage',
      ButtonType.YesButton
    );
    this.add.existing(this.yesButton);
    this.setButtonDraggable(this.yesButton, 'yesButtonSelectedImage'); // Set Draggable

    // No button object
    this.noButton = this.createControlButton(
      435,
      665,
      'noButtonImage',
      ButtonType.NoButton
    );
    this.add.existing(this.noButton);
    this.setButtonDraggable(this.noButton, 'noButtonSelectedImage');

    // YesNo button object
    this.yesNoButton = this.createControlButton(
      495,
      665,
      'yesNoButtonImage',
      ButtonType.YesNoButton
    );
    this.add.existing(this.yesNoButton);
    this.setButtonDraggable(this.yesNoButton, 'yesNoButtonSelectedImage');
  }

  // Function returns the RoundRectGraphics onject
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

  createControlButton = (
    x: number,
    y: number,
    texture: string,
    type: ButtonType
  ): ControlButton => {
    const newControlButton = new ControlButton(this, x, y, texture, type);

    return newControlButton;
  };

  setButtonDraggable = (button: ControlButton, selectedButtonImage: string) => {
    button.setInteractive();

    this.input.setDraggable(button);

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
        }
      }
    );

    button.on('dragend', (pointer: Phaser.Input.Pointer) => {
      newButton?.destroy();
    });
  };
}

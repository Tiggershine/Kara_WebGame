import { GameObjects } from 'phaser';

export enum ButtonType {
  YesButton,
  NoButton,
  YesNoButton,
  ForwardButton,
  LeftButton,
  RightButton,
  PutButton,
  PickButton,
  DummyButton,
}

export default class ControlButton extends GameObjects.Image {
  private inputValue: string = '';
  private selected: boolean = false;
  private buttonType!: ButtonType;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    type: ButtonType
  ) {
    super(scene, x, y, texture);

    switch (type) {
      case ButtonType.YesButton:
        this.inputValue = 'yes';
        this.buttonType = ButtonType.YesButton;
        break;
      case ButtonType.NoButton:
        this.inputValue = 'no';
        this.buttonType = ButtonType.NoButton;
        break;
      case ButtonType.YesNoButton:
        this.inputValue = 'yesNo';
        this.buttonType = ButtonType.YesNoButton;
        break;
      case ButtonType.ForwardButton:
        this.inputValue = 'forward';
        this.buttonType = ButtonType.ForwardButton;
        break;
      case ButtonType.LeftButton:
        this.inputValue = 'left';
        this.buttonType = ButtonType.LeftButton;
        break;
      case ButtonType.RightButton:
        this.inputValue = 'right';
        this.buttonType = ButtonType.RightButton;
        break;
      case ButtonType.PutButton:
        this.inputValue = 'put';
        this.buttonType = ButtonType.PutButton;
        break;
      case ButtonType.PickButton:
        this.inputValue = 'pick';
        this.buttonType = ButtonType.PickButton;
        break;
    }

    // Adds an existing Game Object to this Scene.
    scene.add.existing(this);
  }

  /**
   * @description Getter for Input value: string
   */
  get getInputValue(): string {
    return this.inputValue;
  }
  /**
   * @description Getter for Button type: ButtonType
   */
  get getType(): ButtonType {
    return this.buttonType;
  }
  /**
   * @description Getter for Selected: boolean
   */
  get getSelected(): boolean {
    return this.selected;
  }
  /**
   * @description Setter for Selected: boolean
   */
  set setSelected(newSelected: boolean) {
    this.selected = newSelected;
  }
}

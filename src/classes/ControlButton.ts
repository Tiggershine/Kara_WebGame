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
    }

    scene.add.existing(this);
    // scene.physics.add.existing(this);
  }

  get getInputValue(): string {
    return this.inputValue;
  }
  get getType(): ButtonType {
    return this.buttonType;
  }

  get getSelected(): boolean {
    return this.selected;
  }
  set setSelected(newSelected: boolean) {
    this.selected = newSelected;
  }
}

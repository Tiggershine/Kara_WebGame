// Yes, No, YesNo, Forward, Left, Right, Put, Pick

import Phaser from 'phaser';
import ControllButton from './ControllButton';

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

export default class ControllerContainer extends Phaser.GameObjects.Container {
  id: string = '';
  isSelected: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number, type: ButtonType) {
    super(scene, x, y);

    // Condition buttons
    switch (type) {
      case ButtonType.YesButton:
        this.createButton(x, y, 'yesButtonImage', 'yes', false);
        console.log('yes');
        break;
      case ButtonType.NoButton:
        this.createButton(x, y, 'noButtonImage', 'no', false);
        this.id = 'no';
        this.isSelected = false;
        break;
    }
  }

  preload() {}

  private createButton(
    x: number,
    y: number,
    texture: string,
    id: string,
    isSelected: boolean
  ): ControllButton {
    const button = new ControllButton(
      this.scene,
      x,
      y,
      texture
    ).setInteractive();
    button.id = id;
    button.isSelected = isSelected;
    this.add(button);

    console.log('test');

    return button;
  }
}

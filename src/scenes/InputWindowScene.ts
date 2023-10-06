import Phaser from 'phaser';
import ControllerContainer, {
  ButtonType,
} from '../classes/ControllerContainer';

export default class InputWindowScene extends Phaser.Scene {
  private yesButton!: ControllerContainer;

  constructor() {
    super('InputWindowScene');
  }

  preload() {
    this.load.image('yesButtonImage', 'assets/YesButton.png');
    // this.load.image('noButtonImage', 'assets/NoButton.png');
  }

  create() {
    this.yesButton = new ControllerContainer(
      this,
      210,
      620,
      ButtonType.YesButton
    );
    this.add.existing(this.yesButton);
    // this.add.text(210, 620, 'Test');
    // this.add.image(0, 0, 'yesButtonImage').setOrigin(0, 0);
  }
}

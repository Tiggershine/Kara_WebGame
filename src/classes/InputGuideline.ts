import Phaser from 'phaser';
import ControlButton from './ControlButton';

export class InputGuideline extends Phaser.GameObjects.Container {
  // private guidelineImages: Phaser.GameObjects.Image[] = [];
  // private validArea: Phaser.Geom.Rectangle[] = [];
  guidelineImage!: Phaser.GameObjects.Image;
  validArea!: Phaser.Geom.Rectangle;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number
    // positions: { x: number; y: number }[]
    // texture: string
  ) {
    super(scene);

    // positions.forEach((pos) => {
    this.guidelineImage = this.scene.add.image(x, y, 'inputGuideline');
    this.scene.add.existing(this.guidelineImage);
    this.guidelineImage.setVisible(false);
    // this.guidelineImages.push(guidelineImage);

    // Valid ranges for Guidline
    this.validArea = new Phaser.Geom.Rectangle(
      x - this.guidelineImage.width / 2,
      y - this.guidelineImage.height / 2,
      this.guidelineImage.width,
      this.guidelineImage.height
    );
    // this.validArea.push(validArea);
    // });
  }

  // Check whether object is in valid area for guildeline
  public isInsideValidArea = (
    object: ControlButton,
    dragX: number,
    dragY: number
  ): boolean => {
    console.log('isInsideValidArea 실행');
    return this.validArea.contains(dragX, dragY);

    // for (let i = 0; i < this.validArea.length; i++) {
    //   if (this.validArea[i].contains(dragX, dragY)) {
    //     this.setAllGuidelinesVisible(false); // 모든 guideline을 먼저 숨깁니다.
    //     this.setGuidelineVisible(true, i); // 해당 guideline만 보이게 합니다.
    //     return true;
    //   }
    // }
    // this.setAllGuidelinesVisible(false);
    // return false;
  };

  public setGuidelineVisible = () => {
    console.log();
    this.guidelineImage.setVisible(true);
  };

  public setGuidelineInvisible = () => {
    this.guidelineImage.setVisible(false);
  };

  // public setGuidelineVisible = (visible: boolean, index: number): void => {
  //   this.guidelineImages[index].setVisible(visible);
  // };

  // public setAllGuidelinesVisible = (visible: boolean): void => {
  //   this.guidelineImages.forEach((image) => image.setVisible(visible));
  // };
}

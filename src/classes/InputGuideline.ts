import Phaser from 'phaser';
import ControlButton from './ControlButton';

export class InputGuideline extends Phaser.GameObjects.Container {
  private validArea: Phaser.Geom.Rectangle[] = [];
  private guidelineImages: Phaser.GameObjects.Image[] = [];

  constructor(
    scene: Phaser.Scene,
    positions: { x: number; y: number }[],
    texture: string
  ) {
    super(scene);

    positions.forEach((pos) => {
      const guidelineImage = this.scene.add.image(pos.x, pos.y, texture);
      this.add(guidelineImage);
      guidelineImage.setVisible(false);
      this.guidelineImages.push(guidelineImage);

      // Valid ranges for Guidline
      const validArea = new Phaser.Geom.Rectangle(
        pos.x - guidelineImage.width / 2,
        pos.y - guidelineImage.height / 2,
        guidelineImage.width,
        guidelineImage.height
      );
      this.validArea.push(validArea);
    });
  }

  // Check whether object is in valid area for guildeline
  public isInsideValidArea = (
    object: ControlButton,
    dragX: number,
    dragY: number
  ): boolean => {
    console.log('isInsideValidArea 실행');
    for (let i = 0; i < this.validArea.length; i++) {
      if (this.validArea[i].contains(dragX, dragY)) {
        this.setAllGuidelinesVisible(false); // 모든 guideline을 먼저 숨깁니다.
        this.setGuidelineVisible(true, i); // 해당 guideline만 보이게 합니다.
        return true;
      }
    }
    this.setAllGuidelinesVisible(false);
    return false;
  };

  public setGuidelineVisible = (visible: boolean, index: number): void => {
    this.guidelineImages[index].setVisible(visible);
  };

  public setAllGuidelinesVisible = (visible: boolean): void => {
    this.guidelineImages.forEach((image) => image.setVisible(visible));
  };
}

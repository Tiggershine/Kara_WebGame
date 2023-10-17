import Phaser from 'phaser';
import DiagramScene from '../scenes/DiagramScene';

export interface Label {
  id: number;
  label: Phaser.GameObjects.Text;
  graphc: Phaser.GameObjects.Graphics;
}

export class InputLabel extends Phaser.GameObjects.Container {
  private label!: Phaser.GameObjects.Text;
  private graphic!: Phaser.GameObjects.Graphics;
  // private inputLabels: Label[] = [];
  private isSelected: boolean = false;
  private stateId: number = 0;

  constructor(
    scene: Phaser.Scene,
    stateId: number,
    x: number,
    y: number,
    name: string,
    isSelected: boolean
  ) {
    super(scene, x, y);

    this.stateId = stateId;
    this.isSelected = isSelected;

    const backgroundColor = this.isSelected ? 0xfcf6f5 : 6710886;
    const textColor = this.isSelected ? '#666666' : '#FCF6F5';

    // Graphic 생성
    this.graphic = scene.add
      .graphics()
      .fillStyle(backgroundColor)
      .fillRoundedRect(0, 0, 80, 60, 10);

    // Label 생성
    this.label = scene.add
      .text(0, 0, name, {
        fontSize: '14px',
        fontFamily: 'RobotoFlex',
        color: textColor,
      })
      .setOrigin(0.5)
      .setPosition(80 / 2, 43 / 2);

    this.add(this.graphic);
    this.add(this.label);

    this.setDepth(-1);

    scene.add.existing(this);

    // const stateCircle = scene.getStateCircles.find(circle => circle.id === stateId);
    // if (stateCircle) {
    //   stateCircle.on('selectedChanged', this.updateLabelColor);
    // }
  }

  set setIsSelected(isSelected: boolean) {
    this.isSelected = isSelected;
  }

  get getId(): number {
    return this.stateId;
  }
  get getIsSelected(): boolean {
    return this.isSelected;
  }
}

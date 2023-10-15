import Phaser from 'phaser';

export interface Label {
  id: number;
  label: Phaser.GameObjects.Text;
  graphc: Phaser.GameObjects.Graphics;
}

export class InputLabel extends Phaser.GameObjects.Container {
  private label!: Phaser.GameObjects.Text;
  private graphic!: Phaser.GameObjects.Graphics;
  private inputLabels: Label[] = [];
  private isSelected: boolean = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    name: string,
    isSelected: boolean
  ) {
    const backgroundColor = isSelected ? 0xfcf6f5 : 0x666666b2;
    const textColor = isSelected ? '#666666B2' : '#FCF6F5';
    super(scene, x, y);

    this.isSelected = isSelected;

    // Graphic 생성
    this.graphic = scene.add
      .graphics()
      .fillStyle(backgroundColor)
      .fillRoundedRect(0, 0, 80, 60, 10);
    this.add(this.graphic);

    // Label 생성
    this.label = scene.add
      .text(0, 0, name, {
        fontSize: '14px',
        fontFamily: 'RobotoFlex',
        color: '#1B1C1D',
      })
      .setOrigin(0.5)
      .setPosition(80 / 2, 43 / 2);

    this.setDepth(10);

    scene.add.existing(this);
  }

  setSelected(isSelected: boolean) {
    this.isSelected = isSelected;
  }
}

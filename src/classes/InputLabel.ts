import Phaser from 'phaser';
import InputWindowScene from '../scenes/InputWindowScene';
import DiagramScene from '../scenes/DiagramScene';
import StateCircle from './StateCircle';

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
  // private labelName: string = '';
  // private InputWindowScene?: InputWindowScene;
  // private DiagramScene?: DiagramScene;

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
    this.name = name;

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

    this.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, 80, 60),
      Phaser.Geom.Rectangle.Contains
    );

    // Set to handle pointerdown event
    this.on('pointerdown', () => {
      if (this.getIsSelected) {
        return;
      } else {
        const diagramScene = this.scene.scene.get(
          'DiagramScene'
        ) as DiagramScene;

        // Find the corresponding StateCircle object
        const correspondingStateCircle = diagramScene.getStateCircles.find(
          (stateCircle) => stateCircle.getId === this.getId
        );

        if (correspondingStateCircle) {
          // Trigger the pointerdown event on the corresponding StateCircle object
          correspondingStateCircle.emit('pointerdown');
        }
      }
    });

    this.add(this.graphic);
    this.add(this.label);

    // InputWindow보다 아래 위치하도록 depth 설정
    this.setDepth(-1);
    this.label.setDepth(2);

    scene.add.existing(this);
  }

  set setNewName(newName: string) {
    this.name = newName;
  }

  get getId(): number {
    return this.stateId;
  }

  // get getLabelName(): string {
  //   return this.labelName;
  // }

  get getName(): string {
    return this.name;
  }

  get getIsSelected(): boolean {
    return this.isSelected;
  }
}

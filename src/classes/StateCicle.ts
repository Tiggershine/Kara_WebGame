import Phaser from 'phaser';

export default class StateCircle extends Phaser.GameObjects.Container {
  id: number;
  name: string;
  isSelected: boolean;
  prevStateId: number | null;
  nextStateId: number | null;
  circle: Phaser.GameObjects.Arc;
  label: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    id: number,
    name: string
  ) {
    super(scene, x, y);

    this.id = id;
    this.name = name;
    this.isSelected = false;
    this.prevStateId = null;
    this.nextStateId = null;

    this.circle = new Phaser.GameObjects.Arc(
      scene,
      0,
      0,
      25,
      0,
      360,
      false,
      this.isSelected ? 0xef3d38 : 0xfcf6f5
    );
    this.circle.setStrokeStyle(3, 1776669);

    this.label = new Phaser.GameObjects.Text(scene, 0, 0, name, {
      fontSize: '14px',
      fontFamily: 'Roboto Flex',
      color: '1776669', // #1B1C1D
    });
    this.label.setOrigin(0.5);

    this.add(this.circle);
    this.add(this.label);

    this.circle.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown && pointer.getDuration() > 1000) {
        // 1초 이상 클릭
        const newName = prompt('Please Enter New Name:');
        if (newName) {
          this.label.setText(newName);
        }
      }
    });

    scene.add.existing(this);
  }

  setSelected(selected: boolean): void {
    this.isSelected = selected;
    this.circle.setFillStyle(this.isSelected ? 0xef3d38 : 0xfcf6f5);
  }
}

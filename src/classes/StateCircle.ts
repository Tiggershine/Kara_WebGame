import Phaser from 'phaser';
import { StateInput } from './InputManager';

export interface StateCircleType {
  name: string;
  stateInputs: StateInput[];
  prevState: string;
  nextState: string;
  isSelected: boolean;
}

export default class StateCircle extends Phaser.GameObjects.Container {
  name: string;
  prevState: number | null;
  nextState: number | null;
  isSelected: boolean;
  stateInputs: StateInput[];
  circle: Phaser.GameObjects.Image;
  label: Phaser.GameObjects.Text;
  validArea!: Phaser.Geom.Rectangle;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    name: string,
    texture: string,
    validArea: Phaser.Geom.Rectangle
  ) {
    super(scene, x, y);

    this.name = name;
    this.prevState = null;
    this.nextState = null;
    this.isSelected = false;
    this.stateInputs = [];
    this.validArea = validArea;

    this.circle = this.scene.add
      .image(0, 0, texture)
      .setInteractive({ draggable: true })
      .setData('stateInputs', this.stateInputs)
      .on('pointerdown', () => {
        this.setSelected(true);
      });

    this.circle.on(
      'drag',
      (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        if (this.validArea.contains(dragX, dragY)) {
          this.x = dragX;
          this.y = dragY;
        } else {
          // 오른쪽 경계를 넘지 않도록 함
          if (dragX > this.validArea.right) {
            this.x = this.validArea.right;
          }
          // 왼쪽 경계를 넘지 않도록 함
          if (dragX < this.validArea.left) {
            this.x = this.validArea.left;
          }
          // 아래 경계를 넘지 않도록 함
          if (dragY > this.validArea.bottom) {
            this.y = this.validArea.bottom;
          }
          // 위 경계를 넘지 않도록 함
          if (dragY < this.validArea.top) {
            this.y = this.validArea.top;
          }
        }
      }
    );

    this.add(this.circle);

    // this.circle = new Phaser.GameObjects.Arc(
    //   scene,
    //   0,
    //   0,
    //   25,
    //   0,
    //   360,
    //   false,
    //   this.isSelected ? 0xef3d38 : 0xfcf6f5
    // );
    // this.circle.setStrokeStyle(3, 1776669);

    this.label = new Phaser.GameObjects.Text(scene, 0, 0, name, {
      fontSize: '14px',
      fontFamily: 'Roboto Flex',
      color: '#1B1C1D',
    });
    this.label.setOrigin(0.5);

    this.add(this.label);

    scene.add.existing(this);
  }

  setSelected(selected: boolean): void {
    this.isSelected = selected;
    this.label.setColor(this.isSelected ? '#FCF6F5' : '#1B1C1D');
    this.circle.setTexture('stateCircleSelected');
  }
}

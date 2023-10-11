import Phaser from 'phaser';
import StateCircle from '../classes/StateCircle';
import { InputManager } from '../classes/InputManager';

export default class DiagramScene extends Phaser.Scene {
  stateCircles: StateCircle[] = [];
  validArea!: Phaser.Geom.Rectangle;

  constructor() {
    super('DiagramScene');
  }

  // Values for the style of container
  private container = {
    x: 550,
    y: 90,
    width: 500,
    height: 250,
    borderRadius: 10,
    backgroundColor: 0xfcf6f5,
  };

  preload() {
    this.load.image('addState', 'assets/AddState.png');
    this.load.image('startState', 'assets/StartState.png');
    this.load.image('stateCircle', 'assets/StateCircle.png');
    this.load.image('stateCircleSelected', 'assets/StateCircleSelected.png');
  }

  create() {
    this.createAddButton();

    // Valid area allows state circle on
    this.validArea = new Phaser.Geom.Rectangle(750, 165, 500 - 50, 250 - 50);

    // Background container
    const containerGraphics = this.add.graphics({
      fillStyle: { color: this.container.backgroundColor },
    });
    containerGraphics.fillRoundedRect(
      this.container.x,
      this.container.y,
      this.container.width,
      this.container.height,
      this.container.borderRadius
    );
  }

  // Add button for creating new state circle
  createAddButton() {
    const addButton = this.add.image(575, 55, 'addState').setInteractive();
    this.input.setDraggable(addButton);

    let newStateCircle: StateCircle | null = null;

    addButton.on('dragstart', (pointer: Phaser.Input.Pointer) => {
      newStateCircle = this.createStateCircle(pointer.x, pointer.y);
      if (newStateCircle) {
        newStateCircle.setSelected(true); // Set color to sign selected
      }
    });

    addButton.on(
      'drag',
      (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        if (newStateCircle) {
          newStateCircle.setPosition(dragX, dragY);
        }
      }
    );

    addButton.on('dragend', (pointer: Phaser.Input.Pointer) => {
      if (!this.validArea.contains(pointer.x, pointer.y) && newStateCircle) {
        newStateCircle.destroy();
        this.stateCircles.pop();
      }
      newStateCircle = null;
    });
  }
  createStateCircle(x: number, y: number): StateCircle {
    const newStateCircle = new StateCircle(
      this,
      x,
      y,
      'State ' + this.stateCircles.length,
      'stateCircle',
      this.validArea
    );

    this.stateCircles.push(newStateCircle);

    // newStateCircle.setInteractive(
    //   new Phaser.Geom.Circle(0, 0, 25),
    //   Phaser.Geom.Circle.Contains
    // );

    // this.input.setDraggable(newStateCircle);
    newStateCircle.on(
      'drag',
      (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        if (this.validArea.contains(dragX, dragY)) {
          newStateCircle.x = dragX;
          newStateCircle.y = dragY;
        } else {
          // 오른쪽 경계를 넘지 않도록 함
          if (dragX > this.validArea.right) {
            newStateCircle.x = this.validArea.right;
          }
          // 왼쪽 경계를 넘지 않도록 함
          if (dragX < this.validArea.left) {
            newStateCircle.x = this.validArea.left;
          }
          // 아래 경계를 넘지 않도록 함
          if (dragY > this.validArea.bottom) {
            newStateCircle.y = this.validArea.bottom;
          }
          // 위 경계를 넘지 않도록 함
          if (dragY < this.validArea.top) {
            newStateCircle.y = this.validArea.top;
          }
        }
      }
    );

    // 새로운 State를 Input Manager에 추가
    const inputManager = new InputManager();
    inputManager.addStateInput(newStateCircle.name);

    return newStateCircle;
  }
}

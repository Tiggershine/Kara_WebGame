import Phaser from 'phaser';
import StateCircle from '../classes/StateCicle';
import { InputManager } from '../classes/InputManager';

export default class DiagramScene extends Phaser.Scene {
  stateCircles: StateCircle[] = [];
  validArea!: Phaser.GameObjects.Rectangle;

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

  create() {
    this.createAddButton();
    this.createAddButtonLabel();

    // Valid area allows state circle on that
    this.validArea = this.add.rectangle(800, 215, 500 - 50, 250 - 50);

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
    const addButton = this.add.circle(575, 55, 25, 0xfcf6f5).setInteractive();
    addButton.setStrokeStyle(3, 0x2bae66);
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
      if (
        !this.validArea.getBounds().contains(pointer.x, pointer.y) &&
        newStateCircle
      ) {
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
      this.stateCircles.length,
      'State' + this.stateCircles.length
    );
    this.stateCircles.push(newStateCircle);
    newStateCircle.setInteractive(
      new Phaser.Geom.Circle(0, 0, 25),
      Phaser.Geom.Circle.Contains
    );

    this.input.setDraggable(newStateCircle);
    newStateCircle.on(
      'drag',
      (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        if (this.validArea.getBounds().contains(dragX, dragY)) {
          newStateCircle.x = dragX;
          newStateCircle.y = dragY;
        }
      }
    );

    // 새로운 State를 Input Manager에 추가
    const inputManager = new InputManager();
    inputManager.addStateInput(newStateCircle.name);

    return newStateCircle;
  }

  // Add label on addButton
  createAddButtonLabel() {
    const addButtonLabel = this.add
      .text(575, 55, 'New\nState', {
        fontFamily: 'Roboto Flex',
        fontSize: '14px',
        color: '1776669',
        align: 'center',
      })
      .setOrigin(0.5, 0.5);
  }
}

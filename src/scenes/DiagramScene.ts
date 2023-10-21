import Phaser from 'phaser';
import StateCircle from '../classes/StateCircle';
import InputWindowScene from './InputWindowScene';
import InputManager from '../classes/InputManager';
import { StateInput } from '../classes/InputManager';

export default class DiagramScene extends Phaser.Scene {
  validArea!: Phaser.GameObjects.Rectangle;
  inputManager: InputManager = new InputManager();
  private inputWindowScene?: InputWindowScene;
  private stateCircles: StateCircle[] = [];
  private startStateCircle!: StateCircle;

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
    this.inputWindowScene = this.scene.get(
      'InputWindowScene'
    ) as InputWindowScene;

    this.createAddButton();
    this.createButtonLabel(575, 55, 'New');

    this.createStartStateCircle();
    this.createButtonLabel(625, 186 + 25, 'Start');

    // Valid area allows state circle on that
    this.validArea = this.add.rectangle(800, 215, 500 - 30, 250 - 30);

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

  createAddButton() {
    const addButton = this.add
      .circle(575, 55, 25, 0xfcf6f5)
      .setStrokeStyle(3, 0x2bae66)
      .setInteractive();

    this.input.setDraggable(addButton);

    let newStateCircle: StateCircle | null = null;

    addButton.on('dragstart', (pointer: Phaser.Input.Pointer) => {
      newStateCircle = this.createStateCircle(pointer.x, pointer.y);
      newStateCircle && newStateCircle.select();

      // Transfer the drag event from the addButton to the newStateCircle
      if (newStateCircle) {
        this.input.setDraggable(newStateCircle);
        newStateCircle.emit('dragstart', pointer);
      }
    });

    addButton.on(
      'drag',
      (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        newStateCircle && newStateCircle.setPosition(dragX, dragY);
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
    const stateId = this.stateCircles.length + 1;
    const stateName = 'State ' + Number(this.stateCircles.length + 1);
    const newStateInput: StateInput[] = [];

    const newStateCircle = new StateCircle(
      this,
      x,
      y,
      stateId,
      stateName,
      newStateInput
    );

    // Deselect all other circles
    this.stateCircles.forEach((circle) => {
      circle.deselect();
    });
    // Ensure the newStateCircle is selected upon creation
    newStateCircle.select();

    this.stateCircles.push(newStateCircle); // stateCircles 배열에 추가

    // Add corresponding InputLabel
    if (this.inputWindowScene) {
      this.inputWindowScene.addLabels();
    }

    return newStateCircle;
  }

  createStartStateCircle(): void {
    const startButton = this.add
      .circle(625, 186 + 25, 25, 0xfcf6f5)
      .setInteractive();
    startButton.setStrokeStyle(3, 1776669);
    this.input.setDraggable(startButton);

    startButton.setDepth(1);
  }

  // Add label on addButton 575, 55, New\nState
  createButtonLabel = (x: number, y: number, name: string) => {
    const buttonLabel = this.add
      .text(x, y, name, {
        fontFamily: 'Roboto Flex',
        fontSize: '14px',
        color: '1776669',
        align: 'center',
      })
      .setOrigin(0.5, 0.5);

    buttonLabel.setDepth(1);

    return buttonLabel;
  };

  connectCircles = (circleA: StateCircle, circleB: StateCircle): void => {
    const edge = this.add.graphics();
    circleA.connectedCircles.push({ targetCircle: circleB, edge: edge });
    circleB.connectedCircles.push({ targetCircle: circleA, edge: edge });
    circleA.updateEdges();
    circleB.updateEdges();
  };

  // Getter for StateCircles (Array contains generated states)
  get getStateCircles(): StateCircle[] {
    return this.stateCircles;
  }
}

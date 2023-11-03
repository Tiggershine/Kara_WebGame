import Phaser from 'phaser';
import StateCircle from '../classes/StateCircle';
import InputWindowScene from './InputWindowScene';
import InputManager from '../classes/InputManager';
import { StateInput } from '../classes/InputManager';
import { InputWindow } from '../classes/InputWindow';
import { InputLabel } from '../classes/InputLabel';
import { InputGuideline } from '../classes/InputGuideline';

export default class DiagramScene extends Phaser.Scene {
  validArea!: Phaser.GameObjects.Rectangle;
  inputManager: InputManager = new InputManager();
  private inputWindowScene?: InputWindowScene;
  stateCircles: StateCircle[] = []; // 등록된 StateCircle 모음 Array
  private inputLabels: InputLabel[] = [];
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
    this.createEndStateCircle();
    // TODO: DELETE TEST CODE
    // this.testCreateEdge();

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

    // StateCircle 객체의 StateInputs가 update 되었을 때 EVENT EMMITER
    // StateCircles 배열의 Update
    this.events.on('stateInputsChanged', this.updateStateCircleInputs, this);

    this.scene.moveAbove('InputWindowScene', 'DiagramScene');
    this.scene.moveAbove('DiagramScene', 'PlaygroundScene');
  }

  updateStateCircleInputs(id: number, newInputs: StateInput[]) {
    const stateCircle = this.stateCircles.find((circle) => circle.id === id);
    if (stateCircle) {
      stateCircle.stateInputs = newInputs;
      console.log('(DiagramScene.ts) stateCircles: ', this.stateCircles);
      // Emit an event with the updated state inputs
      this.scene
        .get('PlaygroundScene')
        .events.emit('stateInputDataUpdated', this.stateCircles);
    }
  }

  extractIdAndNameFromStateCircles(): { id: number; name: string }[] {
    return this.stateCircles.map((stateCircle) => ({
      id: stateCircle.id,
      name: stateCircle.name,
    }));
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

  ///////** METHODS*////////////////////////////////////////////////////////////////////////////////////

  // stateCircles array 관련 함수
  // StateCircle 중 Select된 객체 알려줌
  getSelectedCircle = (): StateCircle | undefined => {
    return this.stateCircles.find((circle) => circle.isSelected);
  };

  // StateCircle 객체 관련 함수
  createStateCircle(x: number, y: number): StateCircle {
    // Before creating a new state, remove the endStateCircle from the array
    const endStateCircle = this.stateCircles.pop();

    const stateId = this.stateCircles.length;
    const stateName = 'State ' + Number(this.stateCircles.length);
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

    // Re-add the endStateCircle to the end of the array
    if (endStateCircle) {
      this.stateCircles.push(endStateCircle);
    }

    this.addLabels();

    // StateCirle 객체에 InputWindow 객체 추가
    // const inputWindow = new InputWindow(this, 0, 0, stateId);

    // newStateCircle.setInputWindow(inputWindow);

    // Event emit -> stateCircle: { id, name } emit
    this.events.emit(
      'updatedStateCircles',
      this.stateCircles.map((stateCircle) => {
        console.log('(DiagramScene.ts) stateCircles: ', stateCircle);
        return {
          id: stateCircle.getId,
          name: stateCircle.getName,
        };
      })
    );

    return newStateCircle;
  }

  createStartStateCircle(): void {
    // const newStateInput: StateInput[] = [];
    // const startButton = new StateCircle(
    //   this,
    //   625,
    //   211,
    //   0,
    //   'Start',
    //   newStateInput
    // );

    // startButton.deselect();
    // startButton.setDepth(1);
    // this.stateCircles.push(startButton);
    // this.add.existing(startButton);
    const stateId = 0;
    const stateName = 'Start';
    const newStateInput: StateInput[] = [];

    const startStateCircle = new StateCircle(
      this,
      625,
      211,
      stateId,
      stateName,
      newStateInput
    );

    startStateCircle.setDepth(1);
    this.stateCircles.push(startStateCircle); // stateCircles 배열에 추가

    this.addLabels();

    // Event emit -> stateCircle: { id, name } emit
    this.events.emit(
      'updatedStateCircles',
      this.stateCircles.map((stateCircle) => {
        console.log('(DiagramScene.ts) stateCircles: ', stateCircle);
        return {
          id: stateCircle.getId,
          name: stateCircle.getName,
        };
      })
    );
  }

  // createEndStateCircle(): void {
  //   const newStateInput: StateInput[] = [];

  //   const endButton = new StateCircle(this, 1000, 211, 0, 'End', newStateInput);

  //   endButton.deselect();
  //   endButton.setDepth(1);

  //   // this.stateCircles[100] = endButton;

  //   this.add.existing(endButton);
  // }
  createEndStateCircle(): void {
    const stateId = 100;
    const stateName = 'End';
    const newStateInput: StateInput[] = [];

    const endStateCircle = new StateCircle(
      this,
      1000,
      211,
      stateId,
      stateName,
      newStateInput
    );

    endStateCircle.deselect();
    endStateCircle.setDepth(1);

    // Add the endStateCircle to the stateCircles array
    this.stateCircles.push(endStateCircle);
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

  // Getter for StateCircles (Array contains generated states)
  get getStateCircles(): StateCircle[] {
    return this.stateCircles;
  }

  getStateCircleById = (id: number): StateCircle | undefined => {
    return this.stateCircles.find((circle) => circle.id === id);
  };

  /** InputWindow Label */
  // InputLabel 그래픽 추가
  addLabels = () => {
    // Start Coordinate - x: 550, y: 360
    let startX = 550;
    const y = 360;
    const gap = 95;

    // Update 시, 기존의 Array 초기화
    this.inputLabels = [];

    const excludingStartEnd = this.getStateCircles.filter(
      (stateCircle, index) => {
        // return index !== 0 && index !== 100;
        return stateCircle.getId !== 100;
      }
    );

    // Start, End가 제외된 StateCircles 배열에 대한 Label 생성
    excludingStartEnd.forEach((state) => {
      const label = new InputLabel(
        this,
        state.id,
        startX,
        y,
        state.name,
        state.isSelected
      );
      this.inputLabels.push(label);
      this.add.existing(label);
      startX += gap;
    });

    // this.getStateCircles.forEach((state) => {
    //   const label = new InputLabel(
    //     this,
    //     state.id,
    //     startX,
    //     y,
    //     state.name,
    //     state.isSelected
    //   );
    //   this.inputLabels.push(label);
    //   this.add.existing(label);
    //   startX += gap;
    // });
  };

  /** Edge */
  createEdge(circleA: StateCircle, circleB: StateCircle): void {
    const edge = this.add.graphics();
    edge.lineStyle(2, 0x000000).setDepth(1); // Set line style

    if (circleA.id === circleB.id) {
      // Create a self-edge
      // Create a self-edge
      const centerX = circleA.x;
      const centerY = circleA.y;
      const radius = circleA.circle.radius - 5; // Adjust as needed
      const startAngle = -Math.PI / 4;
      const endAngle = Math.PI / 4;

      // Create a circular path for self edge
      const path = new Phaser.Curves.Ellipse(
        centerX,
        centerY - radius,
        radius,
        radius
      );
      const points = path.getPoints(64); // 64 is the resolution, adjust as needed

      edge.beginPath();
      points.forEach((point, index) => {
        if (index === 0) {
          edge.moveTo(point.x, point.y);
        } else {
          edge.lineTo(point.x, point.y);
        }
      });

      // Draw arrowhead at the end of the curve
      const arrowHeadLength = 10; // Adjust as needed
      const arrowHeadWidth = 5; // Adjust as needed
      const angle = endAngle;
      const endX = centerX + radius * Math.cos(angle);
      const endY = centerY + radius * Math.sin(angle);
      edge.moveTo(
        endX - arrowHeadLength * Math.cos(angle - Math.PI / 6),
        endY - arrowHeadLength * Math.sin(angle - Math.PI / 6)
      );
      edge.lineTo(endX, endY);
      edge.lineTo(
        endX - arrowHeadLength * Math.cos(angle + Math.PI / 6),
        endY - arrowHeadLength * Math.sin(angle + Math.PI / 6)
      );

      edge.strokePath();
    } else {
      // Create an edge between different circles
      const angle = Math.atan2(circleB.y - circleA.y, circleB.x - circleA.x);

      const radius = circleA.circle.radius;

      const startX = circleA.x + radius * Math.cos(angle);
      const startY = circleA.y + radius * Math.sin(angle);

      const endX = circleB.x - radius * Math.cos(angle);
      const endY = circleB.y - radius * Math.sin(angle);

      edge.moveTo(startX, startY);
      edge.lineTo(endX, endY);

      // Draw arrowhead
      const arrowHeadLength = 10; // Adjust as needed
      const arrowHeadWidth = 5; // Adjust as needed
      edge.moveTo(
        endX - arrowHeadLength * Math.cos(angle - Math.PI / 6),
        endY - arrowHeadLength * Math.sin(angle - Math.PI / 6)
      );
      edge.lineTo(endX, endY);
      edge.lineTo(
        endX - arrowHeadLength * Math.cos(angle + Math.PI / 6),
        endY - arrowHeadLength * Math.sin(angle + Math.PI / 6)
      );

      edge.strokePath(); // Draw the line and arrowhead

      // Store the edge in both circles' edges array for updating later
      circleA.edges.push(edge);
      circleB.edges.push(edge);
    }
  }
}

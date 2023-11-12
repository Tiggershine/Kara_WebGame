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

    this.createEdgesForStateCircles();

    // StateCircle 객체의 StateInputs가 update 되었을 때 EVENT EMMITER
    // StateCircles 배열의 Update
    this.events.on('stateInputsChanged', this.updateStateCircleInputs, this);

    // Listen for the updateLabels event
    this.events.on('updateLabels', this.addLabels, this);
    this.events.on('updateName', this.updateNameById, this);

    this.scene.moveAbove('InputWindowScene', 'DiagramScene');
    this.scene.moveAbove('DiagramScene', 'PlaygroundScene');
  }

  updateNameById = (id: number, newName: string): void => {
    // stateCircles 배열에서 id에 해당하는 StateCircle 객체 찾기
    const stateCircle = this.stateCircles.find((circle) => circle.getId === id);
    if (stateCircle) {
      // StateCircle 객체의 이름 변경
      stateCircle.setName(newName);
    }

    // inputLabels 배열에서 id에 해당하는 InputLabel 객체 찾기
    const inputLabel = this.inputLabels.find((label) => label.getId === id);
    if (inputLabel) {
      // InputLabel 객체의 텍스트 변경
      inputLabel.setLabelText = newName;
    }

    // Event emit -> stateCircle: { id, name } emit
    this.events.emit(
      'updatedStateCircles',
      this.stateCircles.map((stateCircle) => {
        // TODO: DELETE TEST CODE
        // console.log('(DiagramScene.ts) stateCircles: ', stateCircle);
        return {
          id: stateCircle.getId,
          name: stateCircle.getName,
        };
      })
    );
  };

  updateStateCircleInputs(id: number, newInputs: StateInput[]) {
    const stateCircle = this.stateCircles.find((circle) => circle.id === id);
    if (stateCircle) {
      stateCircle.stateInputs = newInputs;
      console.log('(DiagramScene.ts) stateCircles: ', this.stateCircles);

      this.createEdgesForStateCircles();

      // Emit an event with the updated state inputs
      this.scene
        .get('PlaygroundScene')
        .events.emit('stateInputDataUpdated', this.stateCircles);
    }
  }

  // StateCircles 배열을 순회하면서 각 StateCircle과 그 다음 StateCircle 간에 edge를 만듭니다.
  createEdgesForStateCircles() {
    // 먼저 모든 기존 엣지를 제거합니다.
    this.stateCircles.forEach((circle) => {
      circle.edges.forEach((edge) => edge.destroy());
      circle.edges = [];
    });

    // nextState가 있는 StateCircle 간에만 엣지를 생성합니다.
    this.stateCircles.forEach((circle) => {
      circle.stateInputs.forEach((input) => {
        if (input.nextState !== undefined) {
          if (input.nextState === circle.id) {
            // Create a self edge
            this.createSelfEdge(circle);
          }
          // Check if the nextState is different from the current circle's id
          // to avoid creating a self edge again
          if (input.nextState !== circle.id) {
            const nextStateCircle = this.stateCircles.find(
              (c) => c.id === input.nextState
            );
            if (nextStateCircle) {
              // 이미 edge가 존재하지 않는 경우에만 새로운 edge를 생성합니다.
              if (
                !circle.edges.some(
                  (edge) =>
                    edge.data && edge.data.get('endCircle') === nextStateCircle
                )
              ) {
                this.createEdge(circle, nextStateCircle);
              }
            }
          }
        }
      });
    });
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
        this.inputLabels = this.inputLabels.filter((label) => {
          if (label.getId === newStateCircle?.getId) {
            label.destroy();
            return false;
          }
          return true;
        });

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
        // TODO: DELETE TEST CODE
        // console.log('(DiagramScene.ts) stateCircles: ', stateCircle);
        return {
          id: stateCircle.getId,
          name: stateCircle.getName,
        };
      })
    );

    return newStateCircle;
  }

  createStartStateCircle(): void {
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
        // TODO: DELETE TEST CODE
        // console.log('(DiagramScene.ts) stateCircles: ', stateCircle);
        return {
          id: stateCircle.getId,
          name: stateCircle.getName,
        };
      })
    );
  }

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

  public deleteStateCircleById = (id: number): void => {
    // StateCircle 배열에서 해당 ID를 가진 요소 찾아서 제거
    // this.stateCircles = this.stateCircles.filter(
    //   (circle) => circle.getId !== id
    // );

    const circleToDelete = this.getStateCircleById(id);
    if (!circleToDelete) {
      console.error('StateCircle not found with id:', id);
      return;
    }
    const connectedCircles = this.getStateCircles.filter((circle) =>
      circle.edges.some(
        (edge) =>
          edge.data.get('startCircle') === circleToDelete ||
          edge.data.get('endCircle') === circleToDelete
      )
    );
    // 삭제할 StateCircle의 모든 에지 제거
    circleToDelete.edges.forEach((edge) => edge.destroy());

    // 연결된 StateCircle들의 에지 업데이트
    connectedCircles.forEach((circle) => circle.updateEdges());

    this.stateCircles = this.stateCircles.filter(
      (circle) => circle.getId !== id
    );

    circleToDelete.destroy();
  };

  /** InputWindow Label */
  // InputLabel 그래픽 추가
  addLabels = () => {
    // Start Coordinate - x: 550, y: 360
    let startX = 550;
    const y = 360;
    const gap = 95;

    // Update 시, 기존의 Array 초기화
    this.inputLabels.forEach((inputLabel) => {
      inputLabel.destroy();
    });
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
  };

  createEdge(
    circleA: StateCircle,
    circleB: StateCircle,
    baseYOffset: number = 15
  ): Phaser.GameObjects.Graphics {
    const edge = this.add.graphics();
    edge.lineStyle(2, 0x000000).setDepth(1); // Set line style

    // Calculate the angle between the two circles
    const angle = Math.atan2(circleB.y - circleA.y, circleB.x - circleA.x);

    const radius = circleA.circle.radius;

    // Calculate the offset from the center of circleA to the edge point
    const offsetX_A = radius * Math.cos(angle);
    const offsetY_A = radius * Math.sin(angle);

    // Calculate the offset from the center of circleB to the edge point
    const offsetX_B = radius * Math.cos(angle + Math.PI); // Add PI to reverse direction
    const offsetY_B = radius * Math.sin(angle + Math.PI);

    // Calculate startX and startY for circleA
    const startX = circleA.x + offsetX_A + (3 / 4) * radius * Math.sin(angle);
    const startY = circleA.y + offsetY_A - (3 / 4) * radius * Math.cos(angle);

    // Calculate endX and endY for circleB
    const endX = circleB.x + offsetX_B + (3 / 4) * radius * Math.sin(angle);
    const endY = circleB.y + offsetY_B - (3 / 4) * radius * Math.cos(angle);

    edge.moveTo(startX, startY);
    edge.lineTo(endX, endY);

    // Draw arrowhead (화살표 꼭지 그리기)
    const arrowHeadLength = 10; // Adjust arrowhead size if necessary
    const arrowAngle = Math.PI / 8; // Adjust arrowhead angle for a wider arrow

    edge.moveTo(
      endX - arrowHeadLength * Math.cos(angle - arrowAngle),
      endY - arrowHeadLength * Math.sin(angle - arrowAngle)
    );
    edge.lineTo(endX, endY);
    edge.lineTo(
      endX - arrowHeadLength * Math.cos(angle + arrowAngle),
      endY - arrowHeadLength * Math.sin(angle + arrowAngle)
    );

    edge.strokePath(); // Draw the line and arrowhead

    // Initialize the data manager for the edge if it doesn't exist
    edge.setDataEnabled();

    // Store references to the connected circles in the edge's data
    edge.data.set('startCircle', circleA);
    edge.data.set('endCircle', circleB);

    // Store the edge in both circles' edges array for updating later
    circleA.edges.push(edge);
    circleB.edges.push(edge);

    return edge; // Return the edge so it can be stored
  }

  createSelfEdge(circle: StateCircle) {
    const edge = this.add.graphics(); // 여기서 this는 DiagramScene을 참조합니다.
    edge.lineStyle(2, 0x000000); // Set line style

    const radius = circle.circle.radius;
    const selfEdgeRadius = (radius * 2) / 3; // Self edge radius is 2/3 of the state circle radius
    const startAngle = (2 * Math.PI) / 4; // Start angle at 120 degrees
    const endAngle = Math.PI / 4; // End angle at 60 degrees

    // Calculate the center of the self edge circle
    const selfEdgeCenterX = circle.x + radius * Math.cos(startAngle);
    const selfEdgeCenterY = circle.y - selfEdgeRadius - 33; // Move up by 2/3 of the radius

    // Draw the self edge circle
    edge.beginPath();
    edge.arc(
      selfEdgeCenterX,
      selfEdgeCenterY,
      selfEdgeRadius,
      startAngle,
      endAngle
    );
    edge.strokePath();

    // Draw the arrowhead for the self edge
    // Calculate the end point of the self edge
    const arrowStartX = selfEdgeCenterX + selfEdgeRadius * Math.cos(endAngle);
    const arrowStartY = selfEdgeCenterY + selfEdgeRadius * Math.sin(endAngle);

    // Arrowhead dimensions
    const arrowLength = 10;
    const arrowWidth = 5;

    // Calculate the points for the arrowhead
    const arrowPointX =
      arrowStartX + arrowLength * Math.cos(endAngle + Math.PI / 2);
    const arrowPointY =
      arrowStartY + arrowLength * Math.sin(endAngle + Math.PI / 2);

    const arrowLeftX = arrowStartX + arrowWidth * Math.cos(endAngle + Math.PI);
    const arrowLeftY = arrowStartY + arrowWidth * Math.sin(endAngle + Math.PI);

    const arrowRightX = arrowStartX + arrowWidth * Math.cos(endAngle);
    const arrowRightY = arrowStartY + arrowWidth * Math.sin(endAngle);

    // Draw the arrowhead
    edge.beginPath();
    edge.moveTo(arrowLeftX, arrowLeftY);
    edge.lineTo(arrowPointX, arrowPointY);
    edge.lineTo(arrowRightX, arrowRightY);
    edge.closePath();
    edge.fillPath();

    // Set the data for the self-edge
    edge.setData('startCircle', circle);
    edge.setData('endCircle', circle);

    // Store the self edge in the circle's edges array for updating later
    circle.edges.push(edge);

    return edge; // Return the edge so it can be stored
  }
}

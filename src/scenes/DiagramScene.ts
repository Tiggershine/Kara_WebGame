import Phaser from 'phaser';
import StateCircle from '../classes/StateCircle';
import InputWindowScene from './InputWindowScene';
import InputManager from '../classes/InputManager';
import { StateInput } from '../classes/InputManager';
import { InputWindow } from '../classes/InputWindow';
import { InputLabel } from '../classes/InputLabel';
// import { InputGuideline } from '../classes/InputGuideline';
import EdgeManager from '../classes/EdgeManager';

export default class DiagramScene extends Phaser.Scene {
  validArea!: Phaser.GameObjects.Rectangle;
  inputManager: InputManager = new InputManager();
  private inputWindowScene?: InputWindowScene;
  stateCircles: StateCircle[] = []; // 등록된 StateCircle 모음 Array
  private inputLabels: InputLabel[] = [];
  private startStateCircle!: StateCircle;
  private edgeManager!: EdgeManager;
  private idCount: number = 1;

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

    this.edgeManager = new EdgeManager(this);

    this.createAddButton();

    this.createStartStateCircle();
    this.createEndStateCircle();

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
    this.events.on(
      'updateStateCircleName',
      this.updateStateCircleNameById,
      this
    );

    this.scene.moveAbove('InputWindowScene', 'DiagramScene');
    this.scene.moveAbove('DiagramScene', 'PlaygroundScene');
  }

  ///////** Getter *//////////////////////////////////////////////////////////////////////////////////////////////////////
  get getStateCircles(): StateCircle[] {
    return this.stateCircles;
  }

  // StateCircle id로 해당 StateCircle 찾아서 return
  // getStateCircleById = (id: number): StateCircle | undefined => {
  //   return this.stateCircles.find((circle) => circle.id === id);
  // };

  // getInputLabelById = (id: number): InputLabel | undefined => {
  //   return this.inputLabels.find((inputLabel) => inputLabel.getId === id);
  // };
  getStateCircleById = (id: number): StateCircle => {
    const circle = this.stateCircles.find((circle) => circle.id === id);
    if (!circle) {
      throw new Error(`StateCircle with id ${id} not found`);
    }
    return circle;
  };

  getInputLabelById = (id: number): InputLabel => {
    const label = this.inputLabels.find((label) => label.getId === id);
    if (!label) {
      throw new Error(`InputLabel with id ${id} not found`);
    }
    return label;
  };

  ///////** STATE UPDATE METHODS *//////////////////////////////////////////////////////////////////////////////////////////////////////

  // StateCircles의 id를 찾아서 새로운 이름으로 변경 + InputLabels도 그에 따라 변경
  updateStateCircleNameById = (id: number, newName: string): void => {
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

    console.log(
      '(DiagramScene.ts)',
      'stateCircles: ',
      this.stateCircles,
      'inputLables: ',
      this.inputLabels
    );
    // // Event emit -> stateCircle: { id, name } emit
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

  extractIdAndNameFromStateCircles(): { id: number; name: string }[] {
    return this.stateCircles.map((stateCircle) => ({
      id: stateCircle.id,
      name: stateCircle.name,
    }));
  }

  // stateCircles array 관련 함수
  // StateCircle 중 Select된 객체 알려줌
  // getSelectedCircle = (): StateCircle | undefined => {
  //   return this.stateCircles.find((circle) => circle.isSelected);
  // };
  getSelectedCircle = (): StateCircle => {
    const selectedCircle = this.stateCircles.find(
      (circle) => circle.isSelected
    );
    if (!selectedCircle) {
      throw new Error('No circle is currently selected');
    }
    return selectedCircle;
  };

  // Add label on addButton 575, 55, New\nState
  // createButtonLabel = (x: number, y: number, name: string) => {
  //   const buttonLabel = this.add
  //     .text(x, y, name, {
  //       fontFamily: 'Roboto Flex',
  //       fontSize: '14px',
  //       color: '1776669',
  //       align: 'center',
  //     })
  //     .setOrigin(0.5, 0.5);

  //   buttonLabel.setDepth(1);

  //   return buttonLabel;
  // };

  // Id를 가지고 StateCircle과 InputLabel 파괴
  public deleteStateCircleById = (id: number): void => {
    // StateCircle 찾기
    const circleToDelete = this.getStateCircleById(id);
    if (!circleToDelete) {
      console.error('StateCircle not found with id:', id);
      return;
    }
    // edge로 연결된 StateCircles 찾기
    const connectedCircles = this.getStateCircles.filter((circle) =>
      circle.edges.some(
        (edge) =>
          edge.data.get('startCircle') === circleToDelete ||
          edge.data.get('endCircle') === circleToDelete
      )
    );
    // 삭제할 StateCircle의 모든 에지 제거
    if (circleToDelete) {
      circleToDelete.edges.forEach((edge) => {
        if (edge) {
          edge.destroy();
        }
      });
      circleToDelete.destroy();
    }

    // 연결된 StateCircle들의 에지 업데이트
    connectedCircles.forEach((circle) => circle.updateEdges());

    this.stateCircles = this.stateCircles.filter(
      (circle) => circle.getId !== id
    );
    if (circleToDelete) {
      circleToDelete.destroy();
    }

    const inputLabelToDelete = this.getInputLabelById(id);
    this.inputLabels = this.inputLabels.filter(
      (inputLabel) => inputLabel.getId !== id
    );
    if (inputLabelToDelete) {
      inputLabelToDelete?.destroy();
    }

    this.addLabels();

    console.log(
      '(DiagramScene.ts',
      'StateCircles: ',
      this.stateCircles,
      'InputLabels: ',
      this.inputLabels
    );
  };

  ///////** UNTILITY METHODS */////////////////////////////////////////////////////////////////////////////////////////////

  /** Add Button */
  createAddButton() {
    const addButton = this.add.image(575, 55, 'addButton');
    addButton.setDepth(5).setInteractive();
    this.input.setDraggable(addButton);

    // // Create new StateCircle object
    // let newStateCircle: StateCircle = this.createStateCircle(0, 0);
    // newStateCircle.setVisible(false);

    addButton.on('dragstart', (pointer: Phaser.Input.Pointer) => {
      addButton.setTexture('addButtonSelected');
    });

    addButton.on(
      'drag',
      (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        addButton.setPosition(dragX, dragY);
      }
    );

    addButton.on('dragend', (pointer: Phaser.Input.Pointer) => {
      if (addButton) {
        addButton.destroy();
      }

      if (this.validArea.getBounds().contains(pointer.x, pointer.y)) {
        // Create new StateCircle object
        let newStateCircle: StateCircle | null = null;
        newStateCircle = this.createStateCircle(pointer.x, pointer.y);
        // newStateCircle.setPosition(pointer.x, pointer.y).setVisible(true);
        newStateCircle && newStateCircle.select();
      }
      this.createAddButton();
      return;
    });
  }

  // StateCircle 객체 관련 함수
  createStateCircle(x: number, y: number): StateCircle {
    // Before creating a new state, remove the endStateCircle from the array
    const endStateCircle = this.stateCircles.pop();

    const stateId = this.idCount;
    this.idCount++;
    console.log('idCount: ', this.idCount);
    const stateName = 'State ' + stateId;
    const newStateInput: StateInput[] = [];
    const inputLabel: InputLabel = new InputLabel(
      this,
      stateId,
      0,
      0,
      stateName,
      false
    );
    this.inputLabels.push(inputLabel);

    const newStateCircle = new StateCircle(
      this,
      x,
      y,
      stateId,
      stateName,
      newStateInput,
      this.edgeManager,
      inputLabel
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
    const inputLabel = new InputLabel(this, stateId, 0, 0, stateName, false);
    this.inputLabels.push(inputLabel);

    const startStateCircle = new StateCircle(
      this,
      625,
      211,
      stateId,
      stateName,
      newStateInput,
      this.edgeManager,
      inputLabel
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
    const inputLabel = new InputLabel(
      this,
      stateId,
      0,
      0,
      stateName,
      false
    ).setVisible(false);
    this.inputLabels.push(inputLabel);

    const endStateCircle = new StateCircle(
      this,
      1000,
      211,
      stateId,
      stateName,
      newStateInput,
      this.edgeManager,
      inputLabel
    );

    endStateCircle.deselect();
    endStateCircle.setDepth(1);

    // Add the endStateCircle to the stateCircles array
    this.stateCircles.push(endStateCircle);
  }

  /** InputWindow Label */
  // InputLabel 그래픽 추가
  addLabels = () => {
    // Start Coordinate - x: 550, y: 360
    let startX = 550;
    const y = 360;
    const gap = 90;

    // Update 시, 기존의 Array 초기화
    this.inputLabels.forEach((inputLabel) => {
      if (inputLabel) {
        inputLabel.destroy();
      }
    });
    this.inputLabels = [];

    // Exclude end stateCircle
    const excludingEnd = this.getStateCircles.filter((stateCircle, index) => {
      return stateCircle.getId !== 100;
    });

    // End가 제외된 StateCircles 배열에 대한 Label 생성
    excludingEnd.forEach((state) => {
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

  /** Edge */
  // StateCircles 배열을 순회하면서 각 StateCircle과 그 다음 StateCircle 간에 edge를 만듭니다.
  createEdgesForStateCircles() {
    // 먼저 모든 기존 엣지를 제거합니다.
    this.stateCircles.forEach((circle) => {
      circle.edges.forEach((edge) => {
        if (edge) {
          edge.destroy();
        }
      });
      circle.edges = [];
    });

    // nextState가 있는 StateCircle 간에만 엣지를 생성합니다.
    this.stateCircles.forEach((circle) => {
      circle.stateInputs.forEach((input) => {
        if (input.nextState !== undefined) {
          if (input.nextState === circle.id) {
            // Create a self edge
            this.edgeManager.createSelfEdge(circle);
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
                this.edgeManager.createEdge(circle, nextStateCircle);
              }
            }
          }
        }
      });
    });
  }

  // Call this function before stopping the scene
  cleanup() {
    // Destroy all state circles and their associated edges
    this.stateCircles.forEach((circle) => {
      // Destroy edges associated with each circle
      circle.edges.forEach((edge) => {
        if (edge) {
          edge.destroy();
        }
        const circleInputWindow = circle.getInputWindow();
        circleInputWindow?.cleanup();
        circleInputWindow?.destroy();
      });

      // Destroy the circle itself
      circle.destroy();
    });
    this.stateCircles = [];

    // Destroy all input labels
    this.inputLabels.forEach((label) => label.destroy());
    this.inputLabels = [];

    this.idCount = 1;
  }
}

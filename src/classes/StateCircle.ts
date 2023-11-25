import Phaser, { Input } from 'phaser';
import InputManager, { StateInput } from './InputManager';
import DiagramScene from '../scenes/DiagramScene';
import InputWindowScene from '../scenes/InputWindowScene';
import { InputWindow } from './InputWindow';
import EdgeManager from './EdgeManager';
import { InputLabel } from './InputLabel';
import UIManager from './UIManager';

interface StateCircleType {
  id: number;
  name: string;
  x: number;
  y: number;
  isSelected: boolean;
  stateInputs: StateInput[];
}

export default class StateCircle extends Phaser.GameObjects.Container {
  circle: Phaser.GameObjects.Image;
  label: Phaser.GameObjects.Text;
  id: number;
  name: string;
  stateInputs: StateInput[] = [];
  edgeManager!: EdgeManager;
  inputLabel!: InputLabel;
  isSelected: boolean = false;
  inputManager: InputManager = new InputManager();
  inputWindowScene?: InputWindowScene;
  edges: Phaser.GameObjects.Graphics[] = [];
  private inputWindow?: InputWindow;
  uiManager: UIManager;
  diagramScene: DiagramScene;

  constructor(
    diagramScene: DiagramScene,
    x: number,
    y: number,
    id: number,
    name: string,
    stateInputs: StateInput[],
    edgeManager: EdgeManager, // EdgeManager 인스턴스를 생성자로 전달
    inputLabel: InputLabel
  ) {
    super(diagramScene, x, y);
    this.diagramScene = diagramScene;

    this.id = id;
    this.name = name;
    this.stateInputs = stateInputs;
    this.isSelected = true;
    this.edges = [];
    this.edgeManager = edgeManager;
    this.inputLabel = inputLabel;
    this.uiManager = new UIManager(this.scene as DiagramScene);

    this.circle = new Phaser.GameObjects.Image(
      this.diagramScene,
      0,
      0,
      'stateCircle'
    );
    this.add(this.circle);

    // Create Text on Circle
    this.label = new Phaser.GameObjects.Text(
      this.diagramScene,
      0,
      0,
      this.name,
      {
        fontSize: '16px',
        fontFamily: 'Roboto Condensed',
        color: '#1B1C1D',
      }
    );
    this.label.setOrigin(0.5);
    this.add(this.label);

    // Set interactive
    this.setInteractive(
      new Phaser.Geom.Circle(0, 0, 35),
      Phaser.Geom.Circle.Contains
    );
    this.diagramScene.input.setDraggable(this);

    // Set to handle drag event
    this.on(
      'drag',
      (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        if (
          (this.diagramScene as DiagramScene).diagramValidArea
            .getBounds()
            .contains(dragX, dragY)
        ) {
          this.x = dragX;
          this.y = dragY;

          this.updateEdges(); // Update Edges btw. connected circles
        }
      }
    );

    // Set to handle pointerdown event
    this.on('pointerdown', () => {
      // console.log('pointerdown event', this.label);
      if (this.isSelected) {
        return;
      } else {
        this.select();

        const diagramScene = this.scene.scene.get(
          'DiagramScene'
        ) as DiagramScene;
        diagramScene.getStateCircles.forEach((circle) => {
          if (circle !== this) {
            circle.deselect();
          }
        });
      }
      this.setLabel();
    });

    // Add the object to scene
    this.add(this.circle);
    this.add(this.label);

    this.diagramScene.add.existing(this);

    this.inputWindow = new InputWindow(this.scene, 0, 0, id);
    // this.inputWindow.setVisible(false);
  }

  updateEdges = (): void => {
    // Get a reference to the DiagramScene
    // const diagramScene = this.scene.scene.get('DiagramScene') as DiagramScene;

    // Create a temporary array to hold the new edges
    const newEdges: Phaser.GameObjects.Graphics[] = [];

    this.edges.forEach((edge) => {
      // Check if the data property is enabled before accessing it
      if (edge.data) {
        const startCircle: StateCircle = edge.data.get('startCircle');
        const endCircle: StateCircle = edge.data.get('endCircle');

        // Check if this is a self-edge
        if (startCircle === this && endCircle === this) {
          // Handle the self-edge update
          if (edge) {
            edge.destroy(); // Destroy the old self-edge
          }

          // Create a new self-edge and add it to the temporary array
          const newSelfEdge = this.edgeManager.createSelfEdge(this); // Assuming you have a method to create self-edges
          newEdges.push(newSelfEdge);
        } else {
          // Handle the regular edge update
          const otherCircle = startCircle === this ? endCircle : startCircle;

          // Destroy the old edge
          if (edge) {
            edge.destroy();
          }

          // Create a new edge and add it to the temporary array
          const newEdge = this.edgeManager.createEdge(startCircle, endCircle);
          newEdges.push(newEdge);

          // Update the edges array for the other circle as well
          const otherCircleEdges = otherCircle.edges;
          const otherEdgeIndex = otherCircleEdges.indexOf(edge);
          if (otherEdgeIndex !== -1) {
            otherCircleEdges[otherEdgeIndex] = newEdge;
          }
        }
      }
    });

    // Replace the old edges array with the new array
    this.edges = newEdges;
  };

  cleanUpEdges = () => {
    this.edges.forEach((edge) => {
      if (edge) {
        edge.destroy();
      }
    });
    this.edges = [];
  };

  // 새로운 StateInput을 DiagramScene의 StateCircles 배열에 업데이트
  addStateInputs = (newStateInputs: StateInput[]): void => {
    // Filter out the elements based on the given conditions
    const filteredStateInputs = newStateInputs.filter((input) => {
      const hasSensorChecks = input.sensorChecks.length > 0;
      const hasMoveInputs = input.move.length > 0;
      const hasNextState = input.nextState !== -1;
      return hasSensorChecks || hasMoveInputs || hasNextState;
    });

    this.stateInputs = filteredStateInputs;

    console.log(
      '(StateCircle.ts) id: ',
      this.id,
      '업데이트 된 StateInputs',
      this.stateInputs
    );

    // DiagramScene에 StateInputs 상태 변경을 알리기 위한 이벤트 발생
    const diagramScene = this.scene as DiagramScene;
    // diagramScene.events.emit('stateInputsChanged', this.id, this.stateInputs);
    diagramScene.stateCircleManager.updateStateCircleInputs(
      this.id,
      this.stateInputs
    );
  };

  setLabelText(text: string): string {
    const maxLength = 10; // Maximum number of characters
    const ellipsis = '...';
    const finalText =
      text.length > maxLength
        ? text.substring(0, maxLength - ellipsis.length) + ellipsis
        : text;
    // this.label.setText(finalText);
    return finalText;
  }

  select = (): void => {
    this.setIsSelected(true);

    if (this.inputWindow) {
      // TODO: DELETE TEST CODE
      // console.log(this.getId, 'select() triggered');
      this.inputWindow.setInputWindowActive(true);

      // TODO: DELETE TEST CODE
      // console.log(this.inputWindow.getInputwindowActive());
      this.inputWindow.setVisible(true); // Show the InputWindow
    }
  };

  deselect = (): void => {
    this.setIsSelected(false);

    if (this.inputWindow) {
      // TODO: DELETE TEST CODE
      // console.log(this.getId, 'deselect() treiggered');
      this.inputWindow.setInputWindowActive(false);

      // TODO: DELETE TEST CODE
      // console.log(this.inputWindow.getInputwindowActive());
      // this.inputWindow.setVisible(false); // Hide the InputWindow
    }
  };

  setIsSelected(selected: boolean): void {
    // console.log('setIsSelected called', selected, this.label);
    this.isSelected = selected;
    if (this.label) {
      this.label.setColor(this.isSelected ? '#000000' : '#1B1C1D');
      this.label.setFontStyle('bold');
    } else {
      console.error('Label is null in setIsSelected');
    }
    this.circle.setTexture(
      this.isSelected ? 'stateCircleSelected' : 'stateCircle'
    );
  }

  // Call function in InputWindowScene to render InputLabels
  setLabel = (): void => {
    // const diagramScene = this.scene.scene.get('DiagramScene') as DiagramScene;

    // diagramScene.addLabels();
    this.uiManager.addLabels();
  };

  get getId(): number {
    return this.id;
  }

  get getName(): string {
    return this.name;
  }

  get getX(): number {
    return this.x;
  }

  get getY(): number {
    return this.y;
  }

  get getIsSelected(): boolean {
    return this.isSelected;
  }

  get getStateInputs(): StateInput[] {
    return this.stateInputs;
  }

  get getInputLabel(): InputLabel {
    return this.inputLabel;
  }

  set setId(id: number) {
    this.id = id;
  }

  // Used to change name of StateCircle + name of corresponded InputLabel
  updateStateCircleName = (newName: string): void => {
    this.name = newName;
    this.label.text = newName;
    // this.inputLabel.setLabelText = newName;
    // console.log('StateCircle.ts', 'name: ', this.name);

    this.scene.events.emit('updateStateCircleName', this.id, this.name);
  };

  /** InputWindow */
  setInputWindow(inputWindow: InputWindow): void {
    this.inputWindow = inputWindow;
  }

  getInputWindow(): InputWindow | undefined {
    return this.inputWindow;
  }
}

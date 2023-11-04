import Phaser from 'phaser';
import InputManager, { StateInput } from './InputManager';
import DiagramScene from '../scenes/DiagramScene';
import InputWindowScene from '../scenes/InputWindowScene';
import { InputWindow } from './InputWindow';

interface StateCircleType {
  id: number;
  name: string;
  x: number;
  y: number;
  isSelected: boolean;
  stateInputs: StateInput[];
}

export default class StateCircle extends Phaser.GameObjects.Container {
  circle: Phaser.GameObjects.Arc;
  label: Phaser.GameObjects.Text;
  id: number;
  name: string;
  isSelected: boolean = false;
  stateInputs: StateInput[] = [];
  inputManager: InputManager = new InputManager();
  inputWindowScene?: InputWindowScene;
  edges: Phaser.GameObjects.Graphics[] = [];
  private inputWindow?: InputWindow | undefined;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    id: number,
    name: string,
    stateInputs: StateInput[]
  ) {
    super(scene, x, y);

    this.id = id;
    this.name = name;
    this.stateInputs = stateInputs;
    this.isSelected = true;
    this.edges = [];

    // Create StateCircle Object
    this.circle = new Phaser.GameObjects.Arc(
      scene,
      0,
      0,
      30,
      0,
      360,
      false,
      this.isSelected ? 0xef3d38 : 0xfcf6f5
    );
    this.circle.setStrokeStyle(3, 1776669);
    // this.circle.setDepth(1);

    // Create Text on Circle
    this.label = new Phaser.GameObjects.Text(scene, 0, 0, this.name, {
      fontSize: '14px',
      fontFamily: 'Roboto Flex',
      color: '#1B1C1D',
    });
    this.label.setOrigin(0.5);

    // Set interactive
    this.setInteractive(
      new Phaser.Geom.Circle(0, 0, 25),
      Phaser.Geom.Circle.Contains
    );
    scene.input.setDraggable(this);

    // Set to handle drag event
    this.on(
      'drag',
      (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        if (
          (scene as DiagramScene).validArea.getBounds().contains(dragX, dragY)
        ) {
          this.x = dragX;
          this.y = dragY;

          this.updateEdges(); // Update Edges btw. connected circles
        }
      }
    );

    // Set to handle pointerdown event
    this.on('pointerdown', () => {
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

    scene.add.existing(this);

    this.inputWindow = new InputWindow(this.scene, 0, 0, id);
    // this.inputWindow.setVisible(false);
  }

  // Update Edge btw. this StateCircle and Next StateCircle
  updateEdges = (): void => {
    // Get a reference to the DiagramScene
    const diagramScene = this.scene.scene.get('DiagramScene') as DiagramScene;

    // Create a temporary array to hold the new edges
    const newEdges: Phaser.GameObjects.Graphics[] = [];

    this.edges.forEach((edge) => {
      // Check if the data property is enabled before accessing it
      if (edge.data) {
        const startCircle: StateCircle = edge.data.get('startCircle');
        const endCircle: StateCircle = edge.data.get('endCircle');
        const otherCircle = startCircle === this ? endCircle : startCircle;

        // First, destroy the old edge
        edge.destroy();

        // Then, create a new edge and add it to the temporary array
        const newEdge = diagramScene.createEdge(startCircle, endCircle);
        newEdges.push(newEdge);

        // Update the edges array for the other circle as well
        const otherCircleEdges = otherCircle.edges;
        const otherEdgeIndex = otherCircleEdges.indexOf(edge);
        if (otherEdgeIndex !== -1) {
          otherCircleEdges[otherEdgeIndex] = newEdge;
        }
      }
    });

    // Replace the old edges array with the new array
    this.edges = newEdges;
  };

  addStateInputs = (newStateInputs: StateInput[]): void => {
    // Filter out the elements based on the given conditions
    const filteredStateInputs = newStateInputs.filter((input) => {
      const hasSensorChecks = input.sensorChecks.length > 0;
      const hasMoveInputs = input.move.length > 0;
      const hasNextState = input.nextState !== 0;
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
    this.scene.events.emit('stateInputsChanged', this.id, this.stateInputs);
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
      console.log(this.getId, 'select() triggered');
      this.inputWindow.setInputWindowActive(true);

      // TODO: DELETE TEST CODE
      console.log(this.inputWindow.getInputwindowActive());
      this.inputWindow.setVisible(true); // Show the InputWindow
    }
  };

  deselect = (): void => {
    this.setIsSelected(false);

    if (this.inputWindow) {
      // TODO: DELETE TEST CODE
      console.log(this.getId, 'deselect() treiggered');
      this.inputWindow.setInputWindowActive(false);

      // TODO: DELETE TEST CODE
      console.log(this.inputWindow.getInputwindowActive());
      // this.inputWindow.setVisible(false); // Hide the InputWindow
    }
  };

  setIsSelected(selected: boolean): void {
    this.isSelected = selected;
    this.label.setColor(this.isSelected ? '#FCF6F5' : '#1B1C1D');
    this.circle.setFillStyle(this.isSelected ? 0xef3d38 : 0xfcf6f5);
  }

  // Call function in InputWindowScene to render InputLabels
  setLabel = (): void => {
    const diagramScene = this.scene.scene.get('DiagramScene') as DiagramScene;

    diagramScene.addLabels();
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

  set setId(id: number) {
    this.id = id;
  }

  updateName = (newName: string): void => {
    this.name = newName;
    this.label.text = newName;
  };

  /** InputWindow */
  setInputWindow(inputWindow: InputWindow): void {
    this.inputWindow = inputWindow;
  }

  getInputWindow(): InputWindow | undefined {
    return this.inputWindow;
  }

  /** Edge */
  // updateEdges = (): void => {
  //   for (const edge of this.edges) {
  //     edge.clear();
  //     const otherCircle = this.getOtherCircleConnectedByEdge(edge);
  //     if (otherCircle) {
  //       const diagramScene = this.scene.scene.get(
  //         'DiagramScene'
  //       ) as DiagramScene;
  //       diagramScene.createEdge(this, otherCircle);
  //     }
  //   }
  // };

  getOtherCircleConnectedByEdge(
    edge: Phaser.GameObjects.Graphics
  ): StateCircle | null {
    const diagramScene = this.scene.scene.get('DiagramScene') as DiagramScene;
    for (const circle of diagramScene.getStateCircles) {
      if (circle !== this && circle.edges.includes(edge)) {
        return circle;
      }
    }
    return null;
  }

  // updateEdges() {
  //   this.edges.forEach((edge) => {
  //     // edge.data에 저장된 두 StateCircle의 참조를 가져옵니다.
  //     const { startCircle, endCircle } = edge.data.values;

  //     // 에지를 다시 그리기 전에 이전 그래픽을 지웁니다.
  //     edge.clear();
  //     edge.lineStyle(2, 0x000000); // 에지 스타일 설정

  //     // 에지의 새로운 시작점과 끝점을 계산합니다.
  //     const startX = startCircle.x + startCircle.width / 2;
  //     const startY = startCircle.y + startCircle.height / 2;
  //     const endX = endCircle.x + endCircle.width / 2;
  //     const endY = endCircle.y + endCircle.height / 2;

  //     // 에지를 다시 그립니다.
  //     edge.moveTo(startX, startY);
  //     edge.lineTo(endX, endY);

  //     // 화살표 꼭지를 다시 그립니다.
  //     const arrowSize = 10; // 화살표 크기
  //     const angle = Math.atan2(endY - startY, endX - startX);
  //     edge.lineTo(
  //       endX - arrowSize * Math.cos(angle - Math.PI / 6),
  //       endY - arrowSize * Math.sin(angle - Math.PI / 6)
  //     );
  //     edge.moveTo(endX, endY);
  //     edge.lineTo(
  //       endX - arrowSize * Math.cos(angle + Math.PI / 6),
  //       endY - arrowSize * Math.sin(angle + Math.PI / 6)
  //     );

  //     // 에지를 화면에 그립니다.
  //     edge.strokePath();
  //   });
  // }

  // updateEdges = (): void => {
  //   for (const connection of this.connectedCircles) {
  //     const targetCircle = connection.targetCircle;
  //     const edge = connection.edge;

  //     edge.clear();

  //     const startX = this.x;
  //     const startY = this.y;
  //     const endX = targetCircle.x;
  //     const endY = targetCircle.y;

  //     // 컨트롤 포인트 계산 (곡선의 커브를 조절하기 위한 지점)
  //     const cpX = (startX + endX) / 2;
  //     const cpY = startY - 50; // -50은 곡선의 높이를 조절합니다. 필요에 따라 조절 가능

  //     const startVec = new Phaser.Math.Vector2(startX, startY);
  //     const cpVec = new Phaser.Math.Vector2(cpX, cpY);
  //     const endVec = new Phaser.Math.Vector2(endX, endY);

  //     const curve = new Phaser.Curves.QuadraticBezier(startVec, cpVec, endVec);
  //     const points = curve.getPoints(64); // 64는 곡선의 해상도입니다. 필요에 따라 조절 가능

  //     edge.lineStyle(2, 0x000000);
  //     edge.beginPath();
  //     edge.moveTo(points[0].x, points[0].y);

  //     for (let i = 1; i < points.length; i++) {
  //       edge.lineTo(points[i].x, points[i].y);
  //     }

  //     edge.strokePath();

  //     // TODO: 화살표 그리기
  //     const arrowSize = 10; // 화살표 크기
  //     const endDirection = new Phaser.Math.Vector2(
  //       endX - cpX,
  //       endY - cpY
  //     ).normalize();
  //     const arrowPoint1 = new Phaser.Math.Vector2(
  //       endX - endDirection.x * arrowSize,
  //       endY - endDirection.y * arrowSize
  //     );
  //     const arrowPoint2 = new Phaser.Math.Vector2()
  //       .setToPolar(endDirection.angle() + Math.PI / 8, arrowSize)
  //       .add(endVec);
  //     const arrowPoint3 = new Phaser.Math.Vector2()
  //       .setToPolar(endDirection.angle() - Math.PI / 8, arrowSize)
  //       .add(endVec);

  //     edge.lineStyle(2, 0x000000);
  //     edge.beginPath();
  //     edge.moveTo(arrowPoint1.x, arrowPoint1.y);
  //     edge.lineTo(arrowPoint2.x, arrowPoint2.y);
  //     edge.lineTo(endX, endY);
  //     edge.lineTo(arrowPoint3.x, arrowPoint3.y);
  //     edge.lineTo(arrowPoint1.x, arrowPoint1.y);
  //     edge.closePath();
  //     edge.strokePath();
  //   }
  // };
}

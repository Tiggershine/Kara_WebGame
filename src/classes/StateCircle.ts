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
  stateInput: StateInput[];
}

export default class StateCircle extends Phaser.GameObjects.Container {
  circle: Phaser.GameObjects.Arc;
  label: Phaser.GameObjects.Text;
  id: number;
  name: string;
  isSelected: boolean = false;
  stateInput: StateInput[] = [];
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
    stateInput: StateInput[]
  ) {
    super(scene, x, y);

    // this.inputWindow = new InputWindow(this.scene, )

    this.id = id;
    this.name = name;
    this.stateInput = stateInput;
    this.isSelected = true;

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
          // this.updateEdges(); // Update Edges btw. connected circles
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
  }

  addStateInput = (input: StateInput): void => {
    this.stateInput.push(input);
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
      this.inputWindow.setInputWindowActive(true);
      // TODO: DELETE TEST CODE
      console.log(this.getId, 'Visible true');
      console.log(this.inputWindow.getInputwindowActive());
      // this.inputWindow.setVisible(true); // Show the InputWindow
    }
  };

  deselect = (): void => {
    this.setIsSelected(false);

    if (this.inputWindow) {
      this.inputWindow.setInputWindowActive(false);
      // TODO: DELETE TEST CODE
      console.log(this.getId, 'Visible false');
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

  get getStateInput(): StateInput[] {
    return this.stateInput;
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
  updateEdges = (): void => {
    for (const edge of this.edges) {
      edge.clear();
      const otherCircle = this.getOtherCircleConnectedByEdge(edge);
      if (otherCircle) {
        const diagramScene = this.scene.scene.get(
          'DiagramScene'
        ) as DiagramScene;
        diagramScene.createEdge(this, otherCircle);
      }
    }
  };

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

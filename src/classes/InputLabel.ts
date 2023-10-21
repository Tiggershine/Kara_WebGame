import Phaser from 'phaser';
import DiagramScene from '../scenes/DiagramScene';
import InputWindowScene from '../scenes/InputWindowScene';
import StateCircle from './StateCircle';

export class InputLabel extends Phaser.GameObjects.Container {
  private label!: Phaser.GameObjects.Text;
  private graphic!: Phaser.GameObjects.Graphics;
  private isSelected: boolean = false;
  private stateId: number = 0;
  private timerEvent?: Phaser.Time.TimerEvent;

  constructor(
    scene: Phaser.Scene,
    stateId: number,
    x: number,
    y: number,
    name: string,
    isSelected: boolean
  ) {
    super(scene, x, y);

    this.stateId = stateId;
    this.name = name;
    this.isSelected = isSelected;

    const backgroundColor = this.isSelected ? 0xfcf6f5 : 6710886;
    const textColor = this.isSelected ? '#666666' : '#FCF6F5';

    // Label Graphic
    this.graphic = scene.add
      .graphics()
      .fillStyle(backgroundColor)
      .fillRoundedRect(0, 0, 80, 60, 10);

    // Label Text
    this.label = scene.add
      .text(0, 0, name, {
        fontSize: '14px',
        fontFamily: 'RobotoFlex',
        color: textColor,
      })
      .setOrigin(0.5)
      .setPosition(80 / 2, 43 / 2);

    this.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, 80, 60),
      Phaser.Geom.Rectangle.Contains
    );

    // Set to handle pointerdown event
    // this.on('pointerdown', () => {
    //   if (this.getIsSelected) {
    //     return;
    //   } else {
    //     const diagramScene = this.scene.scene.get(
    //       'DiagramScene'
    //     ) as DiagramScene;

    //     // Find the corresponding StateCircle object
    //     const correspondingStateCircle = diagramScene.getStateCircles.find(
    //       (stateCircle) => stateCircle.getId === this.getId
    //     );

    //     if (correspondingStateCircle) {
    //       // Trigger the pointerdown event on the corresponding StateCircle object
    //       correspondingStateCircle.emit('pointerdown');
    //     }
    //   }
    // });

    // Set to handle pointerdown event
    this.on('pointerdown', () => {
      this.timerEvent = scene.time.addEvent({
        delay: 1000, // 1초 후에 실행
        callback: this.handleLongPress,
        callbackScope: this,
      });
    });

    // Set to handle pointerup event
    this.on('pointerup', () => {
      if (this.timerEvent) {
        this.timerEvent.remove(); // pointerup 이벤트가 발생하면 타이머 이벤트를 제거
        this.handleShortPress();
      }
    });

    this.add(this.graphic);
    this.add(this.label);

    // Label positioned below InputWindow (Set depth)
    this.setDepth(-1);
    this.label.setDepth(2);

    scene.add.existing(this);
  }

  private handleLongPress = (): void => {
    console.log(this.getX, this.getY);
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.value = this.label.text;
    inputField.style.position = 'absolute';

    // Get the Phaser Canvas element and its bounding box
    // const canvas = this.scene.game.canvas;
    // const boundingBox = canvas.getBoundingClientRect();

    // inputField.style.left = `${this.getX + boundingBox.left - 35}px`;
    // inputField.style.top = `${
    //   this.getY + boundingBox.top - inputField.clientHeight / 2 - 15
    // }px`;
    inputField.style.left = `${this.getX}px`;
    inputField.style.top = `${this.getY}px`;

    // Set width and height
    inputField.style.width = '70px'; // Set the width to 100 pixels
    inputField.style.height = '20px'; // Set the height to 30 pixels

    // Add keyup event listener
    inputField.addEventListener('keyup', this.handleKeyUp);

    document.body.appendChild(inputField);
    inputField.focus();
  };

  private handleKeyUp = (event: KeyboardEvent): void => {
    // Check if the key pressed is Enter
    if (event.key === 'Enter') {
      const inputField = event.target as HTMLInputElement;
      const newName = inputField.value;
      this.label.text = newName;

      const diagramScene = this.scene.scene.get('DiagramScene') as DiagramScene;
      const correspondingStateCircle = diagramScene.getStateCircles.find(
        (stateCircle) => stateCircle.getId === this.getId
      );
      if (correspondingStateCircle) {
        correspondingStateCircle.updateName(newName);
      }

      // Remove the inputField from the document
      document.body.removeChild(inputField);
    }
  };

  private handleShortPress = (): void => {
    console.log('ShortPress event');
    // Select + Interconnect with the stateCircle object
    if (this.getIsSelected) {
      return;
    } else {
      const diagramScene = this.scene.scene.get('DiagramScene') as DiagramScene;

      // Find the corresponding StateCircle object
      const correspondingStateCircle = diagramScene.getStateCircles.find(
        (stateCircle) => stateCircle.getId === this.getId
      );

      if (correspondingStateCircle) {
        // Trigger the pointerdown event on the corresponding StateCircle object
        correspondingStateCircle.emit('pointerdown');
      }
    }
  };

  get getId(): number {
    return this.stateId;
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
}

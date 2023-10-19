import Phaser from 'phaser';
import InputWindowScene from '../scenes/InputWindowScene';
import DiagramScene from '../scenes/DiagramScene';
import StateCircle from './StateCircle';

export interface Label {
  id: number;
  label: Phaser.GameObjects.Text;
  graphc: Phaser.GameObjects.Graphics;
}

export class InputLabel extends Phaser.GameObjects.Container {
  private label!: Phaser.GameObjects.Text;
  private graphic!: Phaser.GameObjects.Graphics;
  private isSelected: boolean = false;
  private stateId: number = 0;
  private pressDuration: number = 0;
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
    this.isSelected = isSelected;
    this.name = name;

    const backgroundColor = this.isSelected ? 0xfcf6f5 : 6710886;
    const textColor = this.isSelected ? '#666666' : '#FCF6F5';

    // Graphic 생성
    this.graphic = scene.add
      .graphics()
      .fillStyle(backgroundColor)
      .fillRoundedRect(0, 0, 80, 60, 10);

    // Label 생성
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
        delay: 1000, // 2초 후에 실행
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

    // Label이 InputWindow보다 아래 위치하도록 depth 설정
    this.setDepth(-1);
    this.label.setDepth(2);

    scene.add.existing(this);
  }

  private updatePressDuration = (): void => {
    this.pressDuration += 100;
  };

  private handleLongPress = (): void => {
    console.log('LongPress event');
    // 길게 누르면 실행될 코드를 여기에 작성하세요.
    // 예: 이름 변경 UI 표시
    // this.showNameChangeUI();
  };

  private handleShortPress = (): void => {
    console.log('ShortPress event');
    // 기존 pointerdown 이벤트 핸들러 코드를 여기로 이동
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

  set setNewName(newName: string) {
    this.name = newName;
  }

  get getId(): number {
    return this.stateId;
  }

  get getName(): string {
    return this.name;
  }

  get getIsSelected(): boolean {
    return this.isSelected;
  }
}

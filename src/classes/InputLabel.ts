import Phaser from 'phaser';
import DiagramScene from '../scenes/DiagramScene';
import InputWindowScene from '../scenes/InputWindowScene';
import StateCircle from './StateCircle';

export class InputLabel extends Phaser.GameObjects.Container {
  private label!: Phaser.GameObjects.Text;
  private graphic!: Phaser.GameObjects.Graphics;
  private isSelected: boolean = false;
  private stateId: number = 0;
  private labelText: string = '';
  private timerEvent?: Phaser.Time.TimerEvent;
  private lastClickTime: number = 0;
  private doubleClickDelay: number = 300;

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
    this.labelText = name;
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
      .text(0, 0, this.labelText, {
        fontSize: '14px',
        fontFamily: 'RobotoFlex',
        color: textColor,
        align: 'center',
      })
      .setOrigin(0.5)
      .setPosition(80 / 2, 43 / 2);

    this.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, 80, 60),
      Phaser.Geom.Rectangle.Contains
    );

    // Set to handle pointerdown event
    // this.on('pointerdown', () => {
    //   this.timerEvent = scene.time.addEvent({
    //     delay: 1000, // 1초 후에 실행
    //     callback: this.deleteInputLabel,
    //     callbackScope: this,
    //   });
    // });

    // // Set to handle pointerup event
    // this.on('pointerup', () => {
    //   if (this.timerEvent) {
    //     this.timerEvent.remove(); // pointerup 이벤트가 발생하면 타이머 이벤트를 제거
    //     this.handleShortPress();
    //   }
    // });

    // Set to handle pointerdown event
    this.on('pointerdown', () => {
      const currentTime = new Date().getTime();
      if (currentTime - this.lastClickTime < this.doubleClickDelay) {
        // DoubleClick 감지
        this.editInputLabel();
      } else {
        this.timerEvent = scene.time.addEvent({
          delay: 1000, // 1초 후에 실행
          callback: this.deleteInputLabel,
          callbackScope: this,
        });
      }
      this.lastClickTime = currentTime;
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

  private editInputLabel = (): void => {
    // Store the original text in case no new text is entered
    const originalText = this.label.text;
    // Change the label's color to indicate editing
    this.label.setColor('#EF3D38');

    // HTML input 요소 생성 및 설정
    const htmlInput = document.createElement('input');
    htmlInput.type = 'text';
    htmlInput.style.opacity = '0'; // 보이지 않게 설정
    document.body.appendChild(htmlInput);

    // input 이벤트 리스너 함수
    const onInput = (event: Event) => {
      const target = event.target as HTMLInputElement;
      this.label.text = this.formatText(target.value) + '|';
    };

    // HTML input 요소에 이벤트 리스너 추가
    htmlInput.addEventListener('input', onInput);

    // HTML input 요소에 포커스 설정하여 가상 키보드 활성화
    htmlInput.focus();

    const cursorBlink = this.scene.time.addEvent({
      delay: 530,
      callback: () => {
        this.label.text =
          this.formatText(htmlInput.value) +
          (this.label.text.endsWith('|') ? '' : '|');
      },
      loop: true,
    });

    this.scene.input.on(
      'pointerdown',
      (pointer: Phaser.Input.Pointer) => {
        if (!this.getBounds().contains(pointer.x, pointer.y)) {
          htmlInput.style.display = 'none'; // HTML input 요소 숨기기
          htmlInput.removeEventListener('input', onInput); // 이벤트 리스너 제거
          document.body.removeChild(htmlInput); // HTML input 요소 제거

          // 사용자 입력이 없는 경우 원래 텍스트 유지
          if (!htmlInput.value) {
            this.label.text = originalText;
          }
          cursorBlink.remove(); // cursorBlink 중지
          this.finishEditing(cursorBlink, htmlInput.value, this.label.text); // 편집 완료 처리
        }
      },
      this
    );
  };

  private formatText = (text: string): string => {
    // If the text is longer than 10 characters, truncate and add ellipsis
    if (text.length > 8) {
      return text.substring(0, 7) + '..';
    }
    // If the text is longer than 6 characters, insert a newline
    // if (text.length > 6) {
    //   return text.substring(0, 6) + '\n' + text.substring(6);
    // }
    return text;
  };

  private finishEditing = (
    cursorBlink: Phaser.Time.TimerEvent,
    newText: string,
    originalText: string
  ): void => {
    // Stop the cursor blinking effect
    cursorBlink.remove();

    // newText가 비어 있으면 originalText 사용, 그렇지 않으면 newText 사용
    const finalText = newText.trim().length > 0 ? newText : originalText;

    // Remove the cursor from the label
    this.label.text = this.formatText(newText) || originalText;
    this.label.setOrigin(0.5, 0.5);

    // Change the label's color back to its original color
    this.label.setColor('#666666');

    // Remove the keyboard listener
    this.scene.input.keyboard.off('keydown');

    // Remove the pointerdown listener
    this.scene.input.off('pointerdown');

    // Update the corresponding StateCircle object
    const diagramScene = this.scene.scene.get('DiagramScene') as DiagramScene;
    const correspondingStateCircle = diagramScene.getStateCircles.find(
      (stateCircle) => stateCircle.getId === this.getId
    );
    if (correspondingStateCircle) {
      correspondingStateCircle.updateStateCircleName(
        this.formatText(finalText)
      );
    }
  };

  private deleteInputLabel = (): void => {
    console.log('LongPress event - StateCircle 삭제');

    // DiagramScene 참조
    const diagramScene = this.scene.scene.get('DiagramScene') as DiagramScene;
    diagramScene.deleteStateCircleById(this.stateId);

    // // 해당 StateCircle 찾아서 삭제
    // const stateCircle = diagramScene.getStateCircles.find(
    //   (circle) => circle.getId === this.stateId
    // );

    // if (stateCircle) {
    //   // StateCircle 삭제
    //   diagramScene.deleteStateCircleById(this.stateId);
    //   // stateCircle.destroy(); // StateCircle 객체 파괴

    //   // Emit an event to update labels
    //   diagramScene.events.emit('updateLabels');
    // }

    // InputLabel 객체 파괴
    // this.destroy();
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

  get getLabelText(): string {
    return this.labelText;
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

  set setLabelText(newText: string) {
    this.labelText = newText;
  }
}

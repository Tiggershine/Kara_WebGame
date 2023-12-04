import Phaser from 'phaser';
import InputWindow from './InputWindow';
import DiagramScene from '../scenes/DiagramScene';

export class NextStateButton extends Phaser.GameObjects.Container {
  private buttonId: number = -1;
  private options: { id: number; name: string }[] = []; // string으로 바꾸고
  private buttonTexture: string = '';
  private backgroundTexture: string = '';
  private isMenuOpen: boolean = false;
  private buttonContainer: Phaser.GameObjects.Container;
  // private optionContainer!: Phaser.GameObjects.Container;
  private buttonLabel: Phaser.GameObjects.Text;
  // private label: Phaser.GameObjects.Text;
  private menuItems: Phaser.GameObjects.Container[] = [];
  private inputWindow?: InputWindow;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    buttonId: number,
    buttonTexture: string,
    backgroundTexture: string,
    options: { id: number; name: string }[],
    inputWindow: InputWindow // Adding a new parameter to store a reference to the InputWindow instance
  ) {
    super(scene, x, y);
    if (!scene) {
      throw new Error('NextStateButton requires a valid Phaser.Scene');
    }

    this.inputWindow = inputWindow; // Storing the reference to the InputWindow instance

    this.buttonId = buttonId;
    this.options = options;
    this.buttonTexture = buttonTexture;
    this.backgroundTexture = backgroundTexture;
    this.buttonContainer = this.scene.add.container(0, 0);
    // unfold 전에 보여지는 NextState 버튼
    const buttonRectangle = this.scene.add
      .rectangle(0, 0, 70, 24, 0xfcf6f5)
      .setOrigin(0.5, 0.5)
      .setStrokeStyle(2, 1776669);

    // Calculate the position of the triangle based on the buttonRectangle
    const triangleX = buttonRectangle.x + buttonRectangle.width / 2 - 3 - 7; // 7 is half the base of the triangle
    const triangleY = buttonRectangle.y + 3;

    // Create the inverted triangle using a Graphics object
    const triangle = this.scene.add.graphics({ x: triangleX, y: triangleY });
    triangle.fillStyle(0x000000, 1); // Fill color of the triangle
    triangle.fillTriangle(0, 0, -7, 7, 7, 7).setAngle(180);

    this.buttonLabel = this.scene.add.text(-30, -7, 'SELECT', {
      fontSize: '14px',
      fontFamily: 'Roboto Condensed',
      color: '#1B1C1D',
    });
    this.buttonContainer.add(buttonRectangle);
    this.buttonContainer.add(triangle);
    this.buttonContainer.add(this.buttonLabel);
    this.buttonContainer
      .setInteractive(
        new Phaser.Geom.Rectangle(-40, -12, 80, 24),
        Phaser.Geom.Rectangle.Contains
      )
      .setDepth(1);
    this.buttonContainer.on('pointerdown', this.toggleMenu, this);
    this.add(this.buttonContainer);
    // this.unfoldOptions();
    this.scene.events.once('create', () => {
      this.unfoldOptions();
    });
    scene.add.existing(this);
    this.scene.input.on('pointerdown', this.handleOutsideClick, this);
  }

  unfoldOptions() {
    // Destroy existing menu items
    this.menuItems.forEach((item) => {
      item.destroy();
    });
    this.menuItems = [];

    // Create new menu items
    this.options.forEach((option: { id: number; name: string }, index) => {
      if (!this.scene) {
        // console.error('Scene is not available in NextStateButton');
        return;
      }
      const optionContainer: Phaser.GameObjects.Container =
        this.scene.add.container(0, 0);
      const menuItemRectangle = this.scene.add
        .rectangle(0, 0, 73, 26, 142140)
        .setOrigin(0.5, 0.5);
      const menuItemText = this.scene.add.text(-20, -7, option.name, {
        fontSize: '14px',
        fontFamily: 'Roboto Condensed',
        color: '#FCF6F5',
      });
      optionContainer.add(menuItemRectangle);
      optionContainer.add(menuItemText);
      optionContainer
        .setInteractive(
          new Phaser.Geom.Rectangle(-36.5, -13, 73, 26),
          Phaser.Geom.Rectangle.Contains
        )
        .setVisible(false)
        .on('pointerdown', (pointer: Phaser.Input.Pointer) => {
          this.scene.sound.play('buttonSound2');
          pointer.event.stopPropagation();
          // if (this.inputWindow) {
          //   this.inputWindow.updateNextStateInput(this.buttonId, option.id);
          // } else {
          //   console.error('InputWindow is not available in NextStateButton');
          // }
          this.selectedHighlight(menuItemRectangle);
          console.log('(NextStateButton.ts) option.id: ', option.id);

          // 선택한 옵션의 이름으로 buttonLabel의 텍스트를 업데이트
          this.buttonLabel.setText(option.name);
          this.inputWindow?.updateNextStateInput(this.buttonId, option.id);

          this.closeMenu();
        });
      this.menuItems.push(optionContainer);
      this.add(optionContainer);
    });
    // this.scene.add.existing(this);
    // this.scene.input.on('pointerdown', this.handleOutsideClick, this);
  }

  toggleMenu = () => {
    this.scene.sound.play('buttonSound1');
    this.isMenuOpen ? this.closeMenu() : this.openMenu();
  };

  private openMenu = () => {
    this.isMenuOpen = true;
    this.menuItems.forEach((item, index) => {
      this.scene.tweens.add({
        targets: item,
        y: index * 24,
        duration: 300,
        ease: 'Sine.easeOut',
        onStart: () => item.setVisible(true).setDepth(10),
      });
    });
  };

  private closeMenu = () => {
    this.isMenuOpen = false;
    this.menuItems.forEach((item) => {
      this.scene.tweens.add({
        targets: item,
        y: 0,
        duration: 500,
        ease: 'Sine.easeIn',
        onComplete: () => item.setVisible(false),
      });
    });
  };

  private handleOutsideClick(pointer: Phaser.Input.Pointer) {
    if (this.isMenuOpen) {
      const clickedOnMenuButton = this.buttonContainer
        .getBounds()
        .contains(pointer.x, pointer.y);
      const clickedOnMenuItem = this.menuItems.some(
        (item) =>
          item.getBounds().contains(pointer.x, pointer.y) && item.visible
      );

      if (!clickedOnMenuButton && !clickedOnMenuItem) {
        this.closeMenu();
      }
    }
  }

  /**
   * @description Highlight the selected option by changing its texture for a short duration.
   * @param menuItem The menu item to highlight.
   * @param originalTexture The original texture of the menu item.
   */
  private selectedHighlight = (
    menuItemRectangle: Phaser.GameObjects.Rectangle
  ): void => {
    menuItemRectangle.setFillStyle(0xf9a02d);

    this.scene.time.delayedCall(500, () => {
      menuItemRectangle.setFillStyle(0x142140);
    });
  };

  set setOptions(newOptions: { id: number; name: string }[]) {
    this.options = newOptions;
    this.unfoldOptions();
  }
}

import Phaser from 'phaser';
import { SensorCheck } from './InputManager';
import InputWindowScene from '../scenes/InputWindowScene';
import { InputWindow } from './InputWindow';

export enum SensorType {
  WallFront,
  WallLeft,
  WallRight,
  MonsterFront,
  StarBottom,
}

export interface DropdownOption {
  texture: string;
  value: string;
  type: SensorType;
}

export class DropdownMenu extends Phaser.GameObjects.Container {
  private options: DropdownOption[] = [];
  private isMenuOpen: boolean = false;
  private button!: Phaser.GameObjects.Image;
  private menuItems: Phaser.GameObjects.Image[] = [];
  private selectedOptionTexture: string = '';
  private sensorButtonHeight: number = 42;
  private hasEventHandlerExecuted: boolean = false;
  private inputWindow?: InputWindow;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    buttonTexture: string,
    options: DropdownOption[],
    inputWindow?: InputWindow // Adding a new parameter to store a reference to the InputWindow instance
  ) {
    super(scene, x, y);
    this.inputWindow = inputWindow; // Storing the reference to the InputWindow instance

    this.options = options;
    this.button = this.scene.add.image(0, 0, buttonTexture).setInteractive();
    // Adding a tween animation to the button when it is added
    this.scene.tweens.add({
      targets: this.button,
      alpha: { from: 0, to: 1 }, // Fade-in effect
      ease: 'Sine.easeOut', // Easing function
      duration: 500, // Duration of the animation in milliseconds
    });
    this.button.on('pointerdown', this.toggleMenu, this);
    this.add(this.button);

    options.forEach((option, index) => {
      const menuItem = this.scene.add
        .image(0, (index + 1) * 40, option.texture)
        .setInteractive()
        .setVisible(false)
        .setData('value', option.value)
        .setDepth(10)
        .on('pointerdown', () => {
          // TODO: DELETE the under test code
          // console.log(option.value + ' selected!');

          this.selectedOptionTexture = option.texture;
          this.selectedHightlight(menuItem, this.selectedOptionTexture);
          this.button.setTexture(this.selectedOptionTexture);
          console.log('(DropdownMenu.ts) option: ', option);
          // this.handleOptionSelection(option);

          this.closeMenu();

          // Check if the event handler has already been executed
          if (
            !this.hasEventHandlerExecuted &&
            this.inputWindow?.getInputwindowActive()
          ) {
            // Set the flag to true after executing the event handler
            this.hasEventHandlerExecuted = true;

            this.inputWindow.updateTempSensorInputs(option.type);
            this.inputWindow?.addSensorDropdownButton(this);
          }
        });
      this.menuItems.push(menuItem);
      this.add(menuItem);
    });

    // Add an existing Game Object to this Scene
    scene.add.existing(this);

    // If user click outside the dropdown menu, it will close
    this.scene.input.on('pointerdown', this.handleOutsideClick, this);
  }

  unfoldOptions = () => {
    this.options.forEach((option, index) => {
      const menuItem = this.scene.add
        .image(0, (index + 1) * 40, option.texture)
        .setInteractive()
        .setVisible(false)
        .setData('value', option.value)
        .setDepth(10)
        .on('pointerdown', () => {
          // TODO: DELETE the under test code
          // console.log(option.value + ' selected!');

          this.selectedOptionTexture = option.texture;
          this.selectedHightlight(menuItem, this.selectedOptionTexture);
          this.button.setTexture(this.selectedOptionTexture);
          this.closeMenu();

          // Check if the event handler has already been executed
          // if (
          //   !this.hasEventHandlerExecuted &&
          //   this.inputWindow?.getInputwindowActive()
          // ) {
          //   this.inputWindow?.handleDropdownClick(this);

          //   // Set the flag to true after executing the event handler
          //   this.hasEventHandlerExecuted = true;
          // }
        });
      this.menuItems.push(menuItem);
      this.add(menuItem);
    });
  };

  /***
   * @description Toggle on and off
   */
  toggleMenu = () => {
    this.isMenuOpen ? this.closeMenu() : this.openMenu();
  };

  /**
   * @description Toggle open (all options are expanded downward)
   * @description Y coordinate of each option - index * height of option image
   */
  private openMenu = () => {
    this.isMenuOpen = true;
    this.menuItems.forEach((item, index) => {
      // TODO: DELETE TEST CODE
      // console.log(item.depth);
      this.scene.tweens.add({
        targets: item,
        y: (index + 1) * this.sensorButtonHeight,
        duration: 300,
        ease: 'Sine.easeOut',
        onStart: () => item.setVisible(true).setDepth(10),
      });
    });
  };

  /**
   * @description Toggle close (all options are folded again)
   */
  private closeMenu = () => {
    this.isMenuOpen = false;
    this.menuItems.forEach((item) => {
      this.scene.tweens.add({
        targets: item,
        y: 0,
        duration: 500,
        ease: 'Sine.easeInOut',
        onComplete: () => item.setVisible(false),
      });
    });
  };

  // Dropdown의 option이 선택되면 Inputwindow의 임시 저장소에 SensorType 저장
  private handleOptionSelection(option: DropdownOption): void {
    this.inputWindow && this.inputWindow.updateTempSensorInputs(option.type);
    return;
  }

  /**
   * @description Close the dropdown menu, if munu is opened and user click the outside area of menu
   * @param pointer Mouse (or touch) input
   */
  private handleOutsideClick(pointer: Phaser.Input.Pointer) {
    if (this.isMenuOpen) {
      const clickedOnMenuButton = this.button
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
  private selectedHightlight = (
    menuItem: Phaser.GameObjects.Image,
    originalTexture: string
  ): void => {
    menuItem.setTexture(originalTexture + 'Selected');

    this.scene.time.delayedCall(500, () => {
      menuItem.setTexture(originalTexture);
    });
  };

  /**
   * @description Used to clean up resources and event listeners associated with the DropdownMenu object, ensuring a proper cleanup process when the object is no longer needed.
   * @param fromScene boolean
   */
  destroy(fromScene?: boolean) {
    this.scene.input.off('pointerdown', this.handleOutsideClick, this);
    super.destroy(fromScene);
  }

  get getX() {
    return this.x;
  }

  get getY() {
    return this.y;
  }
}

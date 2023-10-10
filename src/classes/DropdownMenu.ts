import Phaser from 'phaser';

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
  private isMenuOpen: boolean = false;
  private button!: Phaser.GameObjects.Image;
  private menuItems: Phaser.GameObjects.Image[] = [];
  private selectedOptionTexture: string = '';
  private sensorButtonHeight: number = 42;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    buttonTexture: string,
    options: DropdownOption[]
  ) {
    super(scene, x, y);

    this.button = this.scene.add.image(0, 0, buttonTexture).setInteractive();
    this.button.on('pointerdown', this.toggleMenu, this);
    this.add(this.button);

    options.forEach((option, index) => {
      const menuItem = this.scene.add
        .image(0, (index + 1) * 40, option.texture)
        .setInteractive()
        .setVisible(false)
        .setData('value', option.value)
        .on('pointerdown', () => {
          // TODO: DELETE the under test code
          console.log(option.value + ' selected!');
          this.selectedOptionTexture = option.texture;
          this.button.setTexture(this.selectedOptionTexture);
          this.closeMenu();
        });
      this.menuItems.push(menuItem);
      this.add(menuItem);
    });

    // Add an existing Game Object to this Scene
    scene.add.existing(this);

    // If user click outside the dropdown menu, it will close
    this.scene.input.on('pointerdown', this.handleOutsideClick, this);
  }

  /***
   * @description Function for Toggle on and off
   */
  toggleMenu = () => {
    this.isMenuOpen ? this.closeMenu() : this.openMenu();
  };

  /**
   * @description Function for Toggle open (all options are expanded downward)
   * @description Y coordinate of each option - index * height of option image
   */
  openMenu = () => {
    this.isMenuOpen = true;
    this.menuItems.forEach((item, index) => {
      this.scene.tweens.add({
        targets: item,
        y: (index + 1) * this.sensorButtonHeight,
        duration: 300,
        ease: 'Sine.easeOut',
        onStart: () => item.setVisible(true),
      });
    });
  };

  /**
   * @description Funciton for Toggle close (all options are folded again)
   */
  closeMenu = () => {
    this.isMenuOpen = false;
    this.menuItems.forEach((item) => {
      this.scene.tweens.add({
        targets: item,
        y: 0,
        duration: 400,
        ease: 'Sine.easeInOut',
        onComplete: () => item.setVisible(false),
      });
    });
  };

  /**
   * @description Function for closing the dropdown menu, if munu is opened and user click the outside area of menu
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

  destroy(fromScene?: boolean) {
    this.scene.input.off('pointerdown', this.handleOutsideClick, this);
    super.destroy(fromScene);
  }
}

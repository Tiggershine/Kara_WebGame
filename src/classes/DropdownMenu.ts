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

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    buttonTexture: string,
    options: DropdownOption[]
  ) {
    super(scene, x, y);

    this.button = this.scene.add.image(0, 0, buttonTexture).setInteractive(); // 위치를 (0, 0)으로 변경
    this.button.on('pointerdown', this.toggleMenu, this);
    this.add(this.button);

    options.forEach((option, index) => {
      const menuItem = this.scene.add
        .image(0, (index + 1) * 40, option.texture)
        .setInteractive()
        .setVisible(false)
        .setData('value', option.value)
        .on('pointerdown', () => {
          console.log(option.value + ' selected!');
          this.closeMenu();
        });
      this.menuItems.push(menuItem);
      this.add(menuItem);
    });

    scene.add.existing(this);
  }

  toggleMenu = () => {
    this.isMenuOpen ? this.closeMenu() : this.openMenu();
  };

  openMenu = () => {
    this.isMenuOpen = true;
    this.menuItems.forEach((item, index) => {
      this.scene.tweens.add({
        targets: item,
        y: index * (this.button.height - 8),
        duration: 300,
        ease: 'Sine.easeOut',
        onStart: () => item.setVisible(true),
      });
    });
  };

  closeMenu = () => {
    this.isMenuOpen = false;
    this.menuItems.forEach((item) => {
      this.scene.tweens.add({
        targets: item,
        y: 0,
        duration: 300,
        ease: 'Sine.easeIn',
        onComplete: () => item.setVisible(false),
      });
    });
  };
}

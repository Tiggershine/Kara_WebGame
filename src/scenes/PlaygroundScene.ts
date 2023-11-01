import Phaser from 'phaser';
import Player from '../classes/sprites/Player';
import Wall from '../classes/sprites/Wall';
import Star from '../classes/sprites/Star';
import Stars from '../tasks/Stars';

export default class PlaygroundScene extends Phaser.Scene {
  constructor() {
    super('PlaygroundScene');
  }

  private taskStars!: Stars;
  private player!: Player;
  private wall!: Wall;
  private star!: Star;
  private star2!: Star;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  // Values for Style
  private containerStyle = {
    size: 500,
    borderRadius: 10,
    backgroundColor: 0xfcf6f5,
  };
  private tileStyle = {
    size: 50,
    lineWidth: 1,
    lineColor: 0x2bae66,
    lineColorAlpha: 128 / 255,
  };

  create() {
    // Set position of the Scene
    this.cameras.main.setViewport(30, 90, 500, 500);

    // Container Object
    const containerGraphics = this.add.graphics({
      fillStyle: { color: this.containerStyle.backgroundColor },
    });
    containerGraphics.fillRoundedRect(
      0,
      0,
      this.containerStyle.size,
      this.containerStyle.size,
      this.containerStyle.borderRadius
    );

    // Tile Object
    const tileGraphics = this.add.graphics({
      lineStyle: {
        width: this.tileStyle.lineWidth,
        color: this.tileStyle.lineColor,
        alpha: this.tileStyle.lineColorAlpha,
      },
    });
    for (let i = 1; i < 10; i++) {
      tileGraphics.lineBetween(
        i * this.tileStyle.size,
        0,
        i * this.tileStyle.size,
        this.containerStyle.size
      ); // Vertical line
      tileGraphics.lineBetween(
        0,
        i * this.tileStyle.size,
        this.containerStyle.size,
        i * this.tileStyle.size
      ); // Horizontal line
    }

    this.taskStars = new Stars(this, 0, 0);

    // this.player = new Player(this, 125, 225);
    // this.wall = new Wall(this, 375, 225);
    // this.star = new Star(this, 175, 225);
    // this.star2 = new Star(this, 275, 225);

    // this.add.existing(this.player);
    // this.add.existing(this.wall);
    // this.add.existing(this.star);
    // this.add.existing(this.star2);

    // this.star.checkStarObjectAt(175, 225);

    // 키보드 입력을 받기 위한 CursorKeys 객체를 생성합니다.
    this.cursors = this.input.keyboard.createCursorKeys();

    this.taskStars.processStateInputData();
    // this.taskStars.testCode();
  }

  update() {
    // const angle = this.player.angle % 360;
    // this.star.checkStarObjectAt(175, 225);
    // this.star2.checkStarObjectAt(275, 225);
    // if (Phaser.Input.Keyboard.JustUp(this.cursors.right)) {
    //   this.player.moveRight();
    // } else if (Phaser.Input.Keyboard.JustUp(this.cursors.left)) {
    //   this.player.moveLeft();
    // }
  }
}

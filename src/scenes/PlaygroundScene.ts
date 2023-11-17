import Phaser from 'phaser';
import Stars from '../tasks/Stars';
import TunnelFinder from '../tasks/TunnelFinder';
import { StateInput } from '../classes/InputManager';
import StateCircle from '../classes/StateCircle';

export default class PlaygroundScene extends Phaser.Scene {
  private stateCircles: StateCircle[] = [];
  private stateInputData: { id: number; stateInputs: StateInput[] }[] = [];
  private taskStars!: Stars;
  private tunnelFinder!: TunnelFinder;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private playButton!: Phaser.GameObjects.Sprite;
  private highlightToggle!: Phaser.GameObjects.Image;
  private isSimulationPlaying: boolean = false;
  containerGraphics!: Phaser.GameObjects.Graphics;
  tileGraphics!: Phaser.GameObjects.Graphics;
  private highlightSelected: boolean = false;

  constructor() {
    super('PlaygroundScene');
  }

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
    this.events.on(
      'stateInputDataUpdated',
      this.handleStateCirclesUpdated,
      this
    );

    // Container Object
    this.containerGraphics = this.add.graphics({
      fillStyle: { color: this.containerStyle.backgroundColor },
    });
    this.containerGraphics.fillRoundedRect(
      30,
      90,
      this.containerStyle.size,
      this.containerStyle.size,
      this.containerStyle.borderRadius
    );

    // Tile Object
    this.tileGraphics = this.add.graphics({
      lineStyle: {
        width: this.tileStyle.lineWidth,
        color: this.tileStyle.lineColor,
        alpha: this.tileStyle.lineColorAlpha,
      },
    });
    for (let i = 1; i < 10; i++) {
      this.tileGraphics.lineBetween(
        i * this.tileStyle.size + 30,
        90,
        i * this.tileStyle.size + 30,
        this.containerStyle.size + 90
      ); // Vertical line
      this.tileGraphics.lineBetween(
        30,
        i * this.tileStyle.size + 90,
        this.containerStyle.size + 30,
        i * this.tileStyle.size + 90
      ); // Horizontal line
    }

    // Task 생성
    this.taskStars = new Stars(this, 30, 90);

    // Play Button
    this.playButton = this.add.sprite(65, 645, 'playButton').setInteractive();
    this.load.image('playButton', 'playButton');
    this.load.image('pauseButton', 'pauseButton');

    this.playButton.on('pointerdown', () => {
      if (this.isSimulationPlaying) {
        this.isSimulationPlaying = false;
        this.playButton.setTexture('playButton');
      } else {
        this.isSimulationPlaying = true;
        this.playButton.setTexture('pauseButton');

        const stateInputData = this.stateInputData;
        this.taskStars.processStateInputData(
          stateInputData,
          this.highlightSelected
        );
      }
    });

    // Hightlight On/Off Button
    this.highlightToggle = this.add.image(64, 689, 'hightlightToggleOff');
    this.highlightToggle.setInteractive();
    this.highlightToggle.on('pointerdown', () => {
      if (!this.highlightSelected) {
        this.highlightToggle.setTexture('hightlightToggleOn');
        this.highlightSelected = true;
      } else {
        this.highlightToggle.setTexture('hightlightToggleOff');
        this.highlightSelected = false;
      }
    });
  }

  update() {}
  private handleStateCirclesUpdated(stateCircles: StateCircle[]) {
    this.stateCircles = stateCircles;

    this.stateInputData = stateCircles.map((stateCircle) => ({
      id: stateCircle.id,
      stateInputs: stateCircle.stateInputs,
    }));

    for (const inputData of this.stateInputData) {
      console.log(
        '(PlaygroundScene.ts)',
        'stateId: ',
        inputData.id,
        'stateInputs: ',
        inputData.stateInputs
      );
    }
  }
}

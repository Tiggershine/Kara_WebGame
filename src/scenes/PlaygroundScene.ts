import Phaser from 'phaser';
import Player from '../classes/sprites/Player';
import Wall from '../classes/sprites/Wall';
import Star from '../classes/sprites/Star';
import Stars from '../tasks/Stars';
import TunnelFinder from '../tasks/TunnelFinder';
import SimulationHighlight from '../classes/SimulationHighlight';
import DiagramScene from './DiagramScene';
import { StateInput } from '../classes/InputManager';
import StateCircle from '../classes/StateCircle';

export default class PlaygroundScene extends Phaser.Scene {
  private stateCircles: StateCircle[] = [];
  private stateInputData: { id: number; stateInputs: StateInput[] }[] = [];
  private taskStars!: Stars;
  private tunnelFinder!: TunnelFinder;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private playButton!: Phaser.GameObjects.Sprite;
  private isSimulationPlaying: boolean = false;
  // private player!: Player;
  // private wall!: Wall;
  // private star!: Star;
  // private star2!: Star;

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

    // const diagramScene = this.scene.get('DiagramScene') as DiagramScene;
    // diagramScene.events.on(
    //   'updatedStateCircles',
    //   this.handleStateInputDataUpdated,
    //   this
    // );
    // Set position of the Scene
    // this.cameras.main.setViewport(30, 90, 500, 500);
    // this.cameras.main.setViewport(0, 0, 1050, 1050);

    // Container Object
    const containerGraphics = this.add.graphics({
      fillStyle: { color: this.containerStyle.backgroundColor },
    });
    containerGraphics.fillRoundedRect(
      30,
      90,
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
        i * this.tileStyle.size + 30,
        90,
        i * this.tileStyle.size + 30,
        this.containerStyle.size + 90
      ); // Vertical line
      tileGraphics.lineBetween(
        30,
        i * this.tileStyle.size + 90,
        this.containerStyle.size + 30,
        i * this.tileStyle.size + 90
      ); // Horizontal line
    }

    // Task 생성
    this.taskStars = new Stars(this, 30, 90);

    // Play Button
    this.playButton = this.add.sprite(65, 615, 'playButton').setInteractive();
    this.load.image('playButton', 'playButton');
    this.load.image('pauseButton', 'pauseButton');

    // Input event listener for the play button
    this.playButton.on('pointerdown', () => {
      if (this.isSimulationPlaying) {
        // Pause the simulation
        this.isSimulationPlaying = false;
        this.playButton.setTexture('playButton');
        // Code to pause processStateInputData
      } else {
        // Start the simulation
        this.isSimulationPlaying = true;
        this.playButton.setTexture('pauseButton');

        const stateInputData = this.stateInputData;
        this.taskStars.processStateInputData(stateInputData);
        // Code to start or resume processStateInputData
      }
    });

    // this.taskStars.processStateInputData();

    // this.tunnelFinder = new TunnelFinder(this, 0, 0);
    // this.tunnelFinder.processStateInputData();

    // const simulationHighlight = new SimulationHighlight(this, 'inputHighlight');
    // simulationHighlight.setDepth(10);
    // simulationHighlight.processStateInputData();

    // this.star.checkStarObjectAt(175, 225);

    // 키보드 입력을 받기 위한 CursorKeys 객체를 생성합니다.
    this.cursors = this.input.keyboard.createCursorKeys();

    this.scene.moveAbove('DiagramScene', 'PlaygroundScene');
    // this.scene.moveAbove('PlaygroundScene', 'DiagramScene');
    // this.scene.moveAbove('PlaygroundScene', 'InputWindowScene');

    this.scene.moveAbove('InputWindowScene', 'PlaygroundScene');
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
    // You can now use id and newInputs to perform further actions in this scene
  }
}

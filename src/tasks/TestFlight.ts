import Phaser from 'phaser';
import Player from '../classes/sprites/Player';
import Wall from '../classes/sprites/Wall';
import Star from '../classes/sprites/Star';
import TaskHelper from '../classes/TaskHelper';

export default class TestFlight extends Phaser.GameObjects.Container {
  private player!: Player;
  private wall!: Wall;
  private star!: Star;
  private taskHelper!: TaskHelper;
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.player = new Player(this.scene, 155, 315);
    this.player.setAngle(90);
    this.taskHelper = new TaskHelper(scene, this.player);

    this.star = new Star(this.scene, 355, 315);
    this.wall = new Wall(this.scene, 405, 315);

    scene.add.existing(this.player);
    scene.add.existing(this.star);
    scene.add.existing(this.wall);
  }

  reoranizeGameObjects = () => {
    this.player.cleanUpStars();
    this.player.setPosition(155, 315).setAngle(90);
    this.player.playerHighlight.setPosition(155, 315);

    this.star = new Star(this.scene, 355, 315);
    this.scene.add.existing(this.star);
  };

  restartSimulation = (stateInputData: any, highlightOn: boolean) => {
    this.reoranizeGameObjects();
    if (!highlightOn && this.player.getPlayerHighlight) {
      this.player.playerHighlightOff();
    } else if (highlightOn) {
      this.player.playerHighlightOn();
    }
    this.startSimulation(stateInputData, highlightOn);
  };

  startSimulation = (stateInputData: any, highlightOn: boolean) => {
    if (!highlightOn && this.player.getPlayerHighlight) {
      this.player.playerHighlightOff();
    } else if (highlightOn) {
      this.player.playerHighlightOn();
    }
    this.taskHelper.executeSimulation(this, stateInputData, highlightOn);
  };

  checkObjectPositions(): boolean {
    const isPlayerAt355315 = this.scene.children.list.some(
      (child) => child instanceof Player && child.x === 355 && child.y === 315
    );
    const isWallAt405315 = this.scene.children.list.some(
      (child) => child instanceof Wall && child.x === 405 && child.y === 315
    );
    const isOtherObjectsExist =
      this.scene.children.list.some(
        (child) =>
          (child instanceof Player || child instanceof Wall) &&
          !(
            (child.x === 355 && child.y === 315) ||
            (child.x === 405 && child.y === 315)
          )
      ) || this.scene.children.list.some((child) => child instanceof Star);

    return isPlayerAt355315 && isWallAt405315 && !isOtherObjectsExist;
  }

  getSuccessMessage = (): string => {
    this.taskHelper.setIsSuccessPopupShowed = true;
    return `" Congratulations on completing \n   your first mission! "`;
  };

  getFailureMessage = (): string => {
    return `" So close! \n  Would you like to try again? "`;
  };

  // playBGM() {
  //   this.scene.sound.play('softGameBGM', { loop: true });
  // }
}

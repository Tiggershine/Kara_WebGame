import Phaser from 'phaser';
import Player from '../classes/sprites/Player';
import Wall from '../classes/sprites/Wall';
import TaskHelper from '../classes/TaskHelper';
import PopupWindow from '../classes/PopupWindow';
import DiagramScene from '../scenes/DiagramScene';

export default class TestFlight extends Phaser.GameObjects.Container {
  private player!: Player;
  private wall!: Wall;
  private taskHelper!: TaskHelper;
  private isSuccessPopupShowed: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.player = new Player(this.scene, 155, 315);
    this.player.setAngle(90);
    this.taskHelper = new TaskHelper(scene, this.player);

    this.wall = new Wall(this.scene, 405, 315);

    scene.add.existing(this.player);
    scene.add.existing(this.wall);
  }

  restartSimulation = (stateInputData: any, highlightOn: boolean) => {
    this.player.cleanUpStars();
    this.player.setPosition(155, 315).setAngle(90);
    this.player.playerHighlight.setPosition(155, 315);

    this.processStateInputData(stateInputData, highlightOn);
  };

  processStateInputData = (stateInputData: any, highlightOn: boolean) => {
    this.taskHelper.processStateInputData(stateInputData, highlightOn, () => {
      if (this.taskHelper.wasInfiniteLoopDetected()) {
        // Display infinite loop warning popup
        const diagramScene = this.scene.scene.get(
          'DiagramScene'
        ) as DiagramScene;
        diagramScene.popupWindow = new PopupWindow(
          diagramScene,
          'smBack',
          `" Oops! \n  Looks like we're going in circles! \n  Check your instructions again.   "`,
          false
        );
        diagramScene.popupWindow.create();
        diagramScene.add.existing(diagramScene.popupWindow);
      } else {
        const positionsCorrect = this.checkObjectPositions();

        console.log('this.isSuccessPopupShowed', this.isSuccessPopupShowed);
        if (!this.isSuccessPopupShowed) {
          if (positionsCorrect) {
            const diagramScene = this.scene.scene.get(
              'DiagramScene'
            ) as DiagramScene;

            setTimeout(() => {
              diagramScene.popupWindow = new PopupWindow(
                diagramScene,
                'smBack',
                `" Congratulations on completing \n   your first mission! "`,
                false
              );
              diagramScene.popupWindow.create();
              diagramScene.add.existing(diagramScene.popupWindow);
            }, 800);

            this.isSuccessPopupShowed = true;
          } else {
            const diagramScene = this.scene.scene.get(
              'DiagramScene'
            ) as DiagramScene;

            setTimeout(() => {
              diagramScene.popupWindow = new PopupWindow(
                diagramScene,
                'smBack',
                `" So close! \n  Would you like to try again? "`,
                false
              );
              diagramScene.popupWindow.create();
              diagramScene.add.existing(diagramScene.popupWindow);
            }, 800);

            this.isSuccessPopupShowed = true;
          }
        }
        console.log(positionsCorrect ? 'Success' : 'Fail');
      }
    });
  };

  private checkObjectPositions(): boolean {
    const isPlayerAt355315 = this.scene.children.list.some(
      (child) => child instanceof Player && child.x === 355 && child.y === 315
    );
    const isWallAt405315 = this.scene.children.list.some(
      (child) => child instanceof Wall && child.x === 405 && child.y === 315
    );
    const isOtherObjectsExist = this.scene.children.list.some(
      (child) =>
        (child instanceof Player || child instanceof Wall) &&
        !(
          (child.x === 355 && child.y === 315) ||
          (child.x === 405 && child.y === 315)
        )
    );

    return isPlayerAt355315 && isWallAt405315 && !isOtherObjectsExist;
  }
}

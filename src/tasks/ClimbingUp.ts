import Phaser from 'phaser';
import Player from '../classes/sprites/Player';
import Star from '../classes/sprites/Star';
import Wall from '../classes/sprites/Wall';
import TaskHelper from '../classes/TaskHelper';

const wallPositions = [
  { x: 205, y: 565 },
  { x: 255, y: 565 },
  { x: 305, y: 565 },
  { x: 355, y: 565 },
  { x: 405, y: 565 },
  { x: 455, y: 565 },
  { x: 505, y: 565 },
  { x: 255, y: 515 },
  { x: 305, y: 515 },
  { x: 355, y: 515 },
  { x: 405, y: 515 },
  { x: 455, y: 515 },
  { x: 505, y: 515 },
  { x: 305, y: 465 },
  { x: 355, y: 465 },
  { x: 405, y: 465 },
  { x: 455, y: 465 },
  { x: 505, y: 465 },
  { x: 355, y: 415 },
  { x: 405, y: 415 },
  { x: 455, y: 415 },
  { x: 505, y: 415 },
  { x: 405, y: 365 },
  { x: 455, y: 365 },
  { x: 505, y: 365 },
  { x: 455, y: 315 },
  { x: 505, y: 315 },
  { x: 505, y: 265 },
];

export default class StarFindInForest extends Phaser.GameObjects.Container {
  private player!: Player;
  private star1!: Star;
  private star2!: Star;
  private walls!: Wall[];
  private taskHelper!: TaskHelper;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.player = new Player(this.scene, 155, 565);
    this.player.setAngle(90);
    scene.add.existing(this.player);
    this.taskHelper = new TaskHelper(scene, this.player);

    this.star1 = new Star(this.scene, 305, 415);
    this.star2 = new Star(this.scene, 505, 215);
    scene.add.existing(this.star1);
    scene.add.existing(this.star2);

    this.walls = wallPositions.map((pos) => new Wall(this.scene, pos.x, pos.y));
    this.walls.forEach((wall) => scene.add.existing(wall));
  }

  restartSimulation = (stateInputData: any, highlightOn: boolean) => {
    this.player.cleanUpStars();
    this.player.setPosition(155, 565).setAngle(90);
    this.player.playerHighlight.setPosition(155, 565);

    this.star1 = new Star(this.scene, 305, 415);
    this.star2 = new Star(this.scene, 505, 215);
    this.scene.add.existing(this.star1);
    this.scene.add.existing(this.star2);

    // this.scene.children.list.forEach((child) => {
    //   console.log(child);
    // });

    this.startSimulation(stateInputData, highlightOn);
  };

  startSimulation = (stateInputData: any, highlightOn: boolean) => {
    this.taskHelper.executeSimulation(this, stateInputData, highlightOn);
  };

  // processStateInputData = (stateInputData: any, highlightOn: boolean) => {
  //   this.taskHelper.processStateInputData(stateInputData, highlightOn, () => {
  //     if (this.taskHelper.wasInfiniteLoopDetected()) {
  //       // Display infinite loop warning popup
  //       setTimeout(() => {
  //         const diagramScene = this.scene.scene.get(
  //           'DiagramScene'
  //         ) as DiagramScene;
  //         diagramScene.popupWindow = new PopupWindow(
  //           diagramScene,
  //           'smAlert',
  //           `" Oops! \n  Looks like we're going in circles! \n  Check your instructions again.    "`,
  //           false
  //         );
  //         diagramScene.popupWindow.create();
  //         diagramScene.add.existing(diagramScene.popupWindow);
  //       }, 800);
  //     } else {
  //       const positionsCorrect = this.checkObjectPositions();

  //       console.log('this.isSuccessPopupShowed', this.isSuccessPopupShowed);
  //       if (!this.isSuccessPopupShowed) {
  //         if (positionsCorrect) {
  //           const diagramScene = this.scene.scene.get(
  //             'DiagramScene'
  //           ) as DiagramScene;

  //           setTimeout(() => {
  //             diagramScene.popupWindow = new PopupWindow(
  //               diagramScene,
  //               'sm',
  //               `" Awesome! \n  Mission achieved! "`,
  //               false
  //             );
  //             diagramScene.popupWindow.create();
  //             diagramScene.add.existing(diagramScene.popupWindow);
  //           }, 800);

  //           this.isSuccessPopupShowed = true;
  //         } else {
  //           const diagramScene = this.scene.scene.get(
  //             'DiagramScene'
  //           ) as DiagramScene;

  //           setTimeout(() => {
  //             diagramScene.popupWindow = new PopupWindow(
  //               diagramScene,
  //               'smAlert',
  //               `" Not the result we wanted.\n   Want to go again? "`,
  //               false
  //             );
  //             diagramScene.popupWindow.create();
  //             diagramScene.add.existing(diagramScene.popupWindow);
  //           }, 800);
  //         }
  //       }
  //       this.scene.events.emit('simulationEnd');
  //       console.log(positionsCorrect ? 'Success' : 'Fail');
  //     }
  //   });
  // };

  checkObjectPositions(): boolean {
    const isPlayerAt505215 = this.scene.children.list.some(
      (child) => child instanceof Player && child.x === 505 && child.y === 215
    );
    const areWallsCorrect = wallPositions.every((pos) =>
      this.scene.children.list.some(
        (child) =>
          child instanceof Wall && child.x === pos.x && child.y === pos.y
      )
    );

    // const isOtherObjectsExist = this.scene.children.list.some(
    //   (child) =>
    //     ((child instanceof Star ||
    //       child instanceof Player ||
    //       child instanceof Wall) &&
    //       wallPositions.some(
    //         (pos) =>
    //           (child as Phaser.GameObjects.Sprite).x === pos.x &&
    //           (child as Phaser.GameObjects.Sprite).y === pos.y
    //       )) ||
    //     ((child instanceof Star ||
    //       child instanceof Player ||
    //       child instanceof Wall) &&
    //       (child as Phaser.GameObjects.Sprite).x === 505 &&
    //       (child as Phaser.GameObjects.Sprite).y === 215)
    // );
    const isStarOBjectExist = this.scene.children.list.some(
      (child) => child instanceof Star
    );

    console.log(
      'isPlayerAt505215',
      isPlayerAt505215,
      'areWallsCorrect',
      areWallsCorrect,
      'isStarOBjectExist',
      isStarOBjectExist
    );
    return isPlayerAt505215 && areWallsCorrect && !isStarOBjectExist;
  }

  getSuccessMessage = (): string => {
    this.taskHelper.setIsSuccessPopupShowed = true;
    return `" Awesome! \n  Mission achieved! "`;
  };

  getFailureMessage = (): string => {
    return `" Not the result we wanted.\n   Want to go again? "`;
  };
}

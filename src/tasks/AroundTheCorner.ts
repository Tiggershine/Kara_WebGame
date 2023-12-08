import Phaser from 'phaser';
import Player from '../classes/sprites/Player';
import Star from '../classes/sprites/Star';
import Wall from '../classes/sprites/Wall';
import TaskHelper from '../classes/TaskHelper';

export default class AroundTheCorner extends Phaser.GameObjects.Container {
  private player!: Player;
  private star1!: Star;
  private star2!: Star;
  private star3!: Star;
  private wall1!: Wall;
  private wall2!: Wall;
  private wall3!: Wall;
  private taskHelper!: TaskHelper;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.player = new Player(this.scene, 105, 315);
    this.player.setAngle(90);
    this.taskHelper = new TaskHelper(scene, this.player);

    this.wall1 = new Wall(this.scene, 155, 315);
    this.wall2 = new Wall(this.scene, 255, 315);
    this.wall3 = new Wall(this.scene, 405, 315);

    this.star1 = new Star(this.scene, 205, 315);
    this.star2 = new Star(this.scene, 355, 315);
    this.star3 = new Star(this.scene, 455, 315);

    scene.add.existing(this.player);
    scene.add.existing(this.wall1);
    scene.add.existing(this.wall2);
    scene.add.existing(this.wall3);
    scene.add.existing(this.star1);
    scene.add.existing(this.star2);
    scene.add.existing(this.star3);

    this.createGuidelineGraphic();
  }

  reoranizeGameObjects = () => {
    this.player.cleanUpStars();
    this.player.setPosition(105, 315).setAngle(90);
    this.player.playerHighlight.setPosition(105, 315);

    this.star1 = new Star(this.scene, 205, 315);
    this.star2 = new Star(this.scene, 355, 315);
    this.star3 = new Star(this.scene, 455, 315);
    this.scene.add.existing(this.star1);
    this.scene.add.existing(this.star2);
    this.scene.add.existing(this.star3);
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
    const isPlayerAt455315 = this.scene.children.list.some(
      (child) => child instanceof Player && child.x === 455 && child.y === 315
    );
    const isWallAt155315 = this.scene.children.list.some(
      (child) => child instanceof Wall && child.x === 155 && child.y === 315
    );
    const isWallAt255315 = this.scene.children.list.some(
      (child) => child instanceof Wall && child.x === 255 && child.y === 315
    );
    const isWallAt405315 = this.scene.children.list.some(
      (child) => child instanceof Wall && child.x === 405 && child.y === 315
    );
    const isOtherObjectsExist = this.scene.children.list.some(
      (child) =>
        (child instanceof Player ||
          child instanceof Wall ||
          child instanceof Star) &&
        !(
          (child.x === 455 && child.y === 315) ||
          (child.x === 155 && child.y === 315) ||
          (child.x === 255 && child.y === 315) ||
          (child.x === 405 && child.y === 315)
        )
    );

    return (
      isPlayerAt455315 &&
      isWallAt155315 &&
      isWallAt255315 &&
      isWallAt405315 &&
      !isOtherObjectsExist
    );
  }

  getSuccessMessage = (): string => {
    this.taskHelper.setIsSuccessPopupShowed = true;
    return `" Great job! \n  Let's take on the next mission. "`;
  };

  getFailureMessage = (): string => {
    return `" So close! \n  Would you like to try again? "`;
  };

  createGuidelineGraphic = () => {
    const guidelineGraphic = this.scene.add.graphics({
      lineStyle: {
        width: 2, //  line tickness
        color: 0xef3d38, // line color
      },
    });

    // Coordinate of guideline
    const points = [
      { x: 105, y: 290 },
      { x: 105, y: 265 },
      { x: 192, y: 265 },
      { x: 192, y: 315 },
      { x: 217, y: 315 },
      { x: 217, y: 265 },
      { x: 305, y: 265 },
      { x: 305, y: 315 },
      { x: 355, y: 315 },
      { x: 355, y: 265 },
      { x: 455, y: 265 },
      { x: 455, y: 290 },
    ];

    // making dotted line
    const drawDottedLine = (
      from: { x: number; y: number },
      to: { x: number; y: number },
      dash = 3,
      gap = 1
    ) => {
      const distance = Phaser.Math.Distance.Between(from.x, from.y, to.x, to.y);
      const dashCount = Math.floor(distance / (dash + gap));
      let startX = from.x;
      let startY = from.y;

      for (let i = 0; i < dashCount; i++) {
        const t1 = (i * (dash + gap)) / distance;
        const t2 = ((i + 1) * dash + i * gap) / distance;

        const x1 = Phaser.Math.Interpolation.Linear([from.x, to.x], t1);
        const y1 = Phaser.Math.Interpolation.Linear([from.y, to.y], t1);
        const x2 = Phaser.Math.Interpolation.Linear([from.x, to.x], t2);
        const y2 = Phaser.Math.Interpolation.Linear([from.y, to.y], t2);

        guidelineGraphic.lineBetween(startX, startY, x1, y1);
        startX = x2;
        startY = y2;
      }
    };

    // drawingdotted line
    for (let i = 0; i < points.length - 1; i++) {
      drawDottedLine(points[i], points[i + 1]);
    }

    // making arrow
    const arrowSize = 10; // 화살표 크기
    const lastPoint = points[points.length - 1];
    const secondLastPoint = points[points.length - 2];

    // calculating direction of arrow
    const angle = Math.atan2(
      lastPoint.y - secondLastPoint.y,
      lastPoint.x - secondLastPoint.x
    );

    // calculating end point of arrow
    const arrowEnd1 = {
      x: lastPoint.x - arrowSize * Math.cos(angle - Math.PI / 4),
      y: lastPoint.y - arrowSize * Math.sin(angle - Math.PI / 4),
    };
    const arrowEnd2 = {
      x: lastPoint.x - arrowSize * Math.cos(angle + Math.PI / 4),
      y: lastPoint.y - arrowSize * Math.sin(angle + Math.PI / 4),
    };

    // drawing arrow
    guidelineGraphic.lineBetween(
      lastPoint.x,
      lastPoint.y,
      arrowEnd1.x,
      arrowEnd1.y
    );
    guidelineGraphic.lineBetween(
      lastPoint.x,
      lastPoint.y,
      arrowEnd2.x,
      arrowEnd2.y
    );
  };
}

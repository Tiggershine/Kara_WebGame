import Phaser from 'phaser';

interface GameSceneData {
  level: number;
  mission: number;
  isFromPlaygroundScene: boolean;
}

export default class Game extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    const imageSources = {
      // Image for Background
      backgroundImg: 'assets/BackgroundImg.png',
      // Images for Sprites
      player: 'assets/Player.png',
      star: 'assets/Star.png',
      wall: 'assets/Wall.png',
      // Images for StateCircle
      stateCircle: 'assets/StateCircle1.png',
      stateCircleSelected: 'assets/StateCircleSelected1.png',
      // Images for Button on Header
      iconBack: 'assets/IconBack.png',
      iconBackClick: 'assets/IconBackClick.png',
      iconReset: 'assets/IconReset.png',
      iconResetClick: 'assets/IconResetClick.png',
      // Images for ControlButtons
      addButton: 'assets/AddButton.png',
      addButtonSelected: 'assets/AddButtonSelected.png',
      yesButton: 'assets/YesButton.png',
      noButton: 'assets/NoButton.png',
      yesNoButton: 'assets/YesNoButton.png',
      yesButtonSelected: 'assets/YesButtonSelected.png',
      noButtonSelected: 'assets/NoButtonSelected.png',
      yesNoButtonSelected: 'assets/YesNoButtonSelected.png',
      forwardButton: 'assets/ForwardButton.png',
      leftButton: 'assets/LeftButton.png',
      rightButton: 'assets/RightButton.png',
      putButton: 'assets/PutButton.png',
      pickButton: 'assets/PickButton.png',
      forwardButtonSelected: 'assets/ForwardButtonSelected.png',
      leftButtonSelected: 'assets/LeftButtonSelected.png',
      rightButtonSelected: 'assets/RightButtonSelected.png',
      putButtonSelected: 'assets/PutButtonSelected.png',
      pickButtonSelected: 'assets/PickButtonSelected.png',
      // Images for DropdownMenu
      dropdownButton: 'assets/DropdownButton.png',
      wallFront: 'assets/WallFront.png',
      wallLeft: 'assets/WallLeft.png',
      wallRight: 'assets/WallRight.png',
      monsterFront: 'assets/MonsterFront.png',
      starBottom: 'assets/StarBottom.png',
      wallFrontSelected: 'assets/WallFrontSelected.png',
      wallLeftSelected: 'assets/WallLeftSelected.png',
      wallRightSelected: 'assets/WallRightSelected.png',
      monsterFrontSelected: 'assets/MonsterFrontSelected.png',
      starBottomSelected: 'assets/StarBottomSelected.png',
      // Images for Label
      moveLabel: 'assets/LabelMove.png',
      nextStateLabel: 'assets/LabelNextState.png',
      // Image for NextButton
      nextStateButton: 'assets/NextStateButton.png',
      nextStateButton2: 'assets/NextStateButton2.png',
      // Image for Inputguideline
      inputGuideline: 'assets/InputGuideline.png',
      // Images for Simulation Highlight
      playerHighlight: 'assets/PlayerHighlight.png',
      inputHighlight: 'assets/InputHighlight.png',
      // Images for Simulation Buttons
      playButton: 'assets/PlayButton.png',
      pauseButton: 'assets/PauseButton.png',
      hightlightToggleOff: 'assets/HightlightToggleOff.png',
      hightlightToggleOn: 'assets/HightlightToggleOn.png',
    };

    for (let key in imageSources) {
      if (imageSources.hasOwnProperty(key)) {
        this.load.image(key, imageSources[key as keyof typeof imageSources]);
      }
    }
  }

  create(data: GameSceneData) {
    if (data.isFromPlaygroundScene) {
      this.scene.start('SubMenuScene', { level: data.level });
    }

    this.cameras.main.fadeIn(500, 0, 0, 0);

    this.add.image(0, 0, 'backgroundImg').setOrigin(0, 0);

    console.log('(Game.ts', {
      level: data.level,
      mission: data.mission,
    });

    this.scene.launch('DiagramScene');
    this.scene.launch('InputWindowScene');
    this.scene.launch('PlaygroundScene', {
      level: data.level,
      mission: data.mission,
    });
  }

  update() {}
}

import Phaser from 'phaser';

interface GameSceneData {
  level: number;
  mission: number;
  isFromDiagramScene: boolean;
}

export default class Game extends Phaser.Scene {
  private iconBack!: Phaser.GameObjects.Image;

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
      stateCircleSelected1: 'assets/StateCircleSelected1.png',
      stateCircleSelected: 'assets/StateCircleSelected.png',
      // Images for Button on Header
      iconBack: 'assets/IconBack.png',
      iconBackClick: 'assets/IconBackClick.png',
      iconReset: 'assets/IconReset.png',
      iconResetClick: 'assets/IconResetClick.png',
      iconInfo: 'assets/IconInfo.png',
      iconInfoClick: 'assets/IconInfoClick.png',
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
      stopButton: 'assets/StopButton.png',
      highlightToggleOff: 'assets/HighlightToggleOff.png',
      highlightToggleOn: 'assets/HighlightToggleOn.png',
      // Images for Mission Infos
      missionInfo11: 'assets/MissionInfo11.png',
      missionInfo12: 'assets/MissionInfo12.png',
      missionInfo13: 'assets/MissionInfo13.png',
      missionInfo14: 'assets/MissionInfo14.png',
      missionInfo21: 'assets/MissionInfo21.png',
      missionInfo22: 'assets/MissionInfo22.png',
      missionInfo23: 'assets/MissionInfo23.png',
      missionInfo24: 'assets/MissionInfo24.png',
      missionInfo31: 'assets/MissionInfo31.png',
      // Images for Popup Window
      defaultPopup: 'assets/PopupMd.png',
      popupSmBack: 'assets/PopupSmBack.png',
      popupSm: 'assets/PopupSm.png',
      popupSmAlert: 'assets/PopupSmAlert.png',
      popupMd: 'assets/PopupMd.png',
      popupMdAlert: 'assets/PopupMdAlert.png',
      popupYesBtn: 'assets/PopupYes.png',
      popupYesBtnHover: 'assets/PopupYesHover.png',
      popupNoBtn: 'assets/PopupNo.png',
      popupNoBtnHover: 'assets/PopupNoHover.png',
      popupOKBtn: 'assets/PopupOK.png',
      popupOKBtnHover: 'assets/PopupOKHover.png',
      popupInfinite: 'assets/PopupInfinite.png',
      popupBoundary: 'assets/PopupBoundary.png',
      popupWall: 'assets/PopupWall.png',
    };

    for (let key in imageSources) {
      if (imageSources.hasOwnProperty(key)) {
        this.load.image(key, imageSources[key as keyof typeof imageSources]);
      }
    }

    ////////// LOAD AUDIOS //////////
    this.load.audio('softGameBGM', 'assets/sounds/softGameBGM.mp3');
    this.load.audio('softGameBGM2', 'assets/sounds/softGameBGM2.mp3');
    this.load.audio('ecxiteGameBGM', 'assets/sounds/ecxiteGameBGM.mp3');
    this.load.audio('ecxiteGameBGM2', 'assets/sounds/ecxiteGameBGM2.mp3');
    this.load.audio('ecxiteGameBGM3', 'assets/sounds/ecxiteGameBGM3.mp3');
    this.load.audio('joyGameBGM', 'assets/sounds/joyGameBGM.mp3');

    this.load.audio('menuClickSound', 'assets/sounds/menuClickSound.ogg');
    this.load.audio('addStateSound', 'assets/sounds/addStateSound.mp3');
    this.load.audio('buttonSound1', 'assets/sounds/buttonSound1.mp3');
    this.load.audio('buttonSound2', 'assets/sounds/buttonSound2.mp3');
    this.load.audio('buttonRemoveSound', 'assets/sounds/buttonRemoveSound.mp3');
    this.load.audio('backButtonSound', 'assets/sounds/backButtonSound.mp3');
    this.load.audio('stateSelectSound', 'assets/sounds/stateSelectSound.mp3');
    this.load.audio('toggleOnSound', 'assets/sounds/toggleOnSound.mp3');
    this.load.audio('toggleOffSound', 'assets/sounds/toggleOffSound.mp3');
    this.load.audio('mistakeSound', 'assets/sounds/mistakeSound.mp3');

    this.load.audio(
      'missionSuccessSound',
      'assets/sounds/missionSuccessSound.mp3'
    );
    this.load.audio('missionFailSound', 'assets/sounds/missionFailSound.mp3');
  }

  async create(data: GameSceneData) {
    if (data.isFromDiagramScene) {
      this.scene.start('SubMenuScene', { level: data.level });

      return;
    }

    this.add.image(0, 0, 'backgroundImg').setOrigin(0, 0);

    this.scene.launch('DiagramScene', {
      level: data.level,
      mission: data.mission,
    });
  }

  update() {}

  transitionToNewScene(selectedLevel: number) {
    console.log('Current Scene Objects:', this); // Log the current state

    // this.cleanupCurrentScene();
    this.scene.start('SubMenuScene', {
      level: selectedLevel,
    });
  }
}

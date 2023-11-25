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
    };

    for (let key in imageSources) {
      if (imageSources.hasOwnProperty(key)) {
        this.load.image(key, imageSources[key as keyof typeof imageSources]);
      }
    }
  }

  async create(data: GameSceneData) {
    if (data.isFromDiagramScene) {
      this.scene.start('SubMenuScene', { level: data.level });

      return;
    }

    this.add.image(0, 0, 'backgroundImg').setOrigin(0, 0);

    // let isPlaygroundSceneReady: boolean = false;
    // let isDiagramSceneReady: boolean = false;
    // let isInputWindowSceneReady: boolean = false;

    // this.scene.get('PlaygroundScene').events.on('playgroundSceneReady', () => {
    //   isPlaygroundSceneReady = true;
    // });
    // this.scene.get('DiagramScene').events.on('diagramSceneReady', () => {
    //   isDiagramSceneReady = true;
    // });
    // this.scene
    //   .get('InputWindowScene')
    //   .events.on('inputWindowSceneReady', () => {
    //     isInputWindowSceneReady = true;
    //   });

    // console.log(
    //   isPlaygroundSceneReady,
    //   isDiagramSceneReady,
    //   isInputWindowSceneReady
    // );
    // if (
    //   isPlaygroundSceneReady &&
    //   isDiagramSceneReady &&
    //   isInputWindowSceneReady
    // ) {
    //   this.scene.launch('PlaygroundScene', {
    //     level: data.level,
    //     mission: data.mission,
    //   });
    //   this.scene.launch('DiagramScene');
    //   this.scene.launch('InputWindowScene');
    // }

    this.scene.launch('DiagramScene', {
      level: data.level,
      mission: data.mission,
    });

    // this.scene.launch('PlaygroundScene', {
    //   level: data.level,
    //   mission: data.mission,
    // });
    // setTimeout(() => {
    //   this.scene.launch('DiagramScene');
    //   // this.scene.launch('InputWindowScene');
    // }, 10);

    // await Promise.all([
    //   this.waitForSceneReady('PlaygroundScene', 'playgroundSceneReady'),
    //   this.waitForSceneReady('DiagramScene', 'diagramSceneReady'),
    //   this.waitForSceneReady('InputWindowScene', 'inputWindowSceneReady'),
    // ]);

    // // Now that all scenes are ready, launch them
    // this.scene.launch('PlaygroundScene', {
    //   level: data.level,
    //   mission: data.mission,
    // });
    // this.scene.launch('DiagramScene');
    // this.scene.launch('InputWindowScene');
  }

  update() {}

  // waitForSceneReady(sceneKey: string, readyEvent: string): Promise<void> {
  //   return new Promise((resolve) => {
  //     this.scene.get(sceneKey).events.once(readyEvent, () => {
  //       resolve();
  //     });
  //   });
  // }

  transitionToNewScene(selectedLevel: number) {
    console.log('Current Scene Objects:', this); // Log the current state

    // this.cleanupCurrentScene();
    this.scene.start('SubMenuScene', {
      level: selectedLevel,
    });
  }
}

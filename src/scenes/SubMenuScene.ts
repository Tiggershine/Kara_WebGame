import Phaser from 'phaser';

interface SubMenuSceneData {
  level: number;
  mission: number;
}

interface MissionLog {
  mission: number;
  isSuccess: boolean;
}

const missionButtonConfig = [
  { id: 1, x: 255, y: 543, texture: 'missionBtn1' },
  { id: 2, x: 429, y: 543, texture: 'missionBtn2' },
  { id: 3, x: 603, y: 543, texture: 'missionBtn3' },
  { id: 4, x: 777, y: 543, texture: 'missionBtn4' },
];

export default class SubMenuScene extends Phaser.Scene {
  private iconBack!: Phaser.GameObjects.Image;
  private missionBtn1!: Phaser.GameObjects.Image;
  private missionBtn2!: Phaser.GameObjects.Image;
  private missionBtn3!: Phaser.GameObjects.Image;
  private missionBtn4!: Phaser.GameObjects.Image;
  private selectedLevel: number = 0;
  private selectedMission: number = 0;
  static MissionLog1: MissionLog[] = [
    { mission: 1, isSuccess: true },
    { mission: 2, isSuccess: true },
    { mission: 3, isSuccess: true },
    { mission: 4, isSuccess: true },
  ];
  static MissionLog2: MissionLog[] = [
    { mission: 1, isSuccess: true },
    { mission: 2, isSuccess: true },
    { mission: 3, isSuccess: false },
    { mission: 4, isSuccess: false },
  ];
  static MissionLog3: MissionLog[] = [
    { mission: 1, isSuccess: true },
    { mission: 2, isSuccess: false },
    { mission: 3, isSuccess: false },
    { mission: 4, isSuccess: false },
  ];

  constructor() {
    super({ key: 'SubMenuScene' });
  }

  preload() {
    ////////// LOAD IMAGES //////////
    const imageSources = {
      backgroundImg: 'assets/BackgroundImg.png',
      iconBack: 'assets/IconBack.png',
      iconBackClick: 'assets/IconBackClick.png',
      subMenuImg1: 'assets/SubMenuImg1.png',
      subMenuImg2: 'assets/SubMenuImg2.png',
      subMenuImg3: 'assets/SubMenuImg3.png',
      missionBtn1: 'assets/MissionBtn1.png',
      missionBtn2: 'assets/MissionBtn2.png',
      missionBtn3: 'assets/MissionBtn3.png',
      missionBtn4: 'assets/MissionBtn4.png',
      missionBtn1Hover: 'assets/MissionBtn1Hover.png',
      missionBtn2Hover: 'assets/MissionBtn2Hover.png',
      missionBtn3Hover: 'assets/MissionBtn3Hover.png',
      missionBtn4Hover: 'assets/MissionBtn4Hover.png',
      missionBtnLock: 'assets/MissionBtnLock.png',
      missionBtnLockHover: 'assets/MissionBtnLockHover.png',
    };
    for (let key in imageSources) {
      if (imageSources.hasOwnProperty(key)) {
        this.load.image(key, imageSources[key as keyof typeof imageSources]);
      }
    }

    ////////// LOAD AUDIOS //////////
    this.load.audio('menuClickSound', 'assets/sounds/menuClickSound.mp3');
    this.load.audio('backButtonSound', 'assets/sounds/backButtonSound.mp3');
  }

  create(data: SubMenuSceneData) {
    this.cameras.main.fadeIn(500, 0, 0, 0);

    this.add.image(0, 0, 'backgroundImg').setOrigin(0, 0);
    this.iconBack = this.add.image(106, 90, 'iconBack');
    this.iconBack.setInteractive();
    this.iconBack.on('pointerdown', () => {
      this.sound.play('backButtonSound', { volume: 0.7 });

      this.cameras.main.fadeOut(500, 0, 0, 0, (_: any, progress: number) => {
        this.scene.start('MenuScene', {
          level: data.level,
        });
      });
    });
    this.iconBack.on('pointerover', () => {
      this.iconBack.setTexture('iconBackClick');
    });
    this.iconBack.on('pointerout', () => {
      this.iconBack.setTexture('iconBack');
    });

    this.selectedLevel = data.level;
    // 배경 이미지 Init (Level에 따라서)
    if (data.level) {
      // console.log('data.level: ', data.level);
      this.setupInitialImg(data.level);
    }
  }

  // Level에 따른 배경 이미지 (Level1 / Level2 / Level3)
  setupInitialImg = (level: number): void => {
    // console.log('setupInitialImg 실행 - level: ', level);
    switch (level) {
      case 1:
        this.add.image(540, 243, 'subMenuImg1');
        this.setupMissionImgList('MissionLog1');
        break;
      case 2:
        this.add.image(540, 243, 'subMenuImg2');
        this.setupMissionImgList('MissionLog2');
        break;
      case 3:
        this.add.image(540, 243, 'subMenuImg3');
        this.setupMissionImgList('MissionLog3');
        break;
      default:
        console.log('Mission must be selected!');
    }
  };

  setupMissionImgList = (missionLogName: string) => {
    const missionLogs =
      SubMenuScene[missionLogName as keyof typeof SubMenuScene];
    // console.log(missionLogs);

    if (!Array.isArray(missionLogs)) {
      console.log('Invalid mission log name or not an array');
      return;
    }

    missionLogs.forEach((missionLog, index) => {
      if (missionLog.isSuccess) {
        // console.log('missionLogs forEach isSuccess');
        this.createMissionButtons(
          missionButtonConfig[index].x,
          missionButtonConfig[index].y,
          missionButtonConfig[index].texture,
          index + 1
        );
      } else {
        // console.log('missionLogs forEach isNotSuccess');
        this.createMissionButtons(
          missionButtonConfig[index].x,
          missionButtonConfig[index].y,
          'missionBtnLock'
        );
      }
    });
  };

  createMissionButtons = (
    // isSuccess: boolean,
    x: number,
    y: number,
    texture: string,
    mission?: number
  ) => {
    // console.log(x, y, texture, mission);
    const missionBtn = this.add.image(x, y, texture).setInteractive();
    this.scene.scene.add.existing(missionBtn);
    const selectedTexture: string = texture + 'Hover';
    // console.log(selectedTexture);
    missionBtn.on('pointerover', () => {
      missionBtn.setTexture(selectedTexture);
    });
    missionBtn.on('pointerout', () => {
      missionBtn.setTexture(texture);
    });
    missionBtn.on('pointerdown', () => {
      this.sound.play('menuClickSound', { volume: 0.7 });
      if (mission) this.handleImageClick(mission);
    });
  };

  handleImageClick(mission: number) {
    const level = this.selectedLevel;

    this.cameras.main.fadeOut(500, 0, 0, 0, (_: any, progress: number) => {
      if (progress === 1) {
        // 페이드 아웃이 완료되면 새 장면 시작
        this.scene.start('GameScene', {
          level: level,
          mission: mission,
        });
      }
    });
  }
}

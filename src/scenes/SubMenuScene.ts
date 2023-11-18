import Phaser from 'phaser';

interface SubMenuSceneData {
  level: number;
  mission: number;
}

export default class SubMenuScene extends Phaser.Scene {
  private iconBack!: Phaser.GameObjects.Image;
  private missionBtn1!: Phaser.GameObjects.Image;
  private missionBtn2!: Phaser.GameObjects.Image;
  private missionBtn3!: Phaser.GameObjects.Image;
  private missionBtn4!: Phaser.GameObjects.Image;
  private selectedMission: number = 0;

  constructor() {
    super({ key: 'SubMenuScene' });
  }

  preload() {
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
  }

  create(data: SubMenuSceneData) {
    this.add.image(0, 0, 'backgroundImg').setOrigin(0, 0);
    this.iconBack = this.add.image(106, 90, 'iconBack');
    this.iconBack.setInteractive();
    this.iconBack.on('pointerdown', () => {
      this.cameras.main.fadeOut(1000, 0, 0, 0, (_: any, progress: number) => {
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

    this.missionBtn1 = this.add.image(255, 543, 'missionBtn1');
    this.add.image(429, 543, 'missionBtnLock');
    this.add.image(603, 543, 'missionBtnLock');
    this.add.image(777, 543, 'missionBtnLock');

    this.missionBtn1.setInteractive().on('pointerdown', () => {
      this.selectedMission = 1;
      this.missionBtn1.setTexture('missionBtn1Hover');
      this.cameras.main.fadeOut(500, 0, 0, 0, (_: any, progress: number) => {
        this.handleImageClick(data.level);

        // if (progress === 1) {
        //   // 페이드 아웃이 완료되면 새 장면 시작
        //   this.scene.start('GameScene');
        // }
      });
    });
    this.missionBtn1.on('pointerover', () => {
      this.missionBtn1.setTexture('missionBtn1Hover');
    });
    this.missionBtn1.on('pointerout', () => {
      this.missionBtn1.setTexture('missionBtn1');
    });

    if (data.level) {
      console.log('data.level: ', data.level);
      this.setupInitialImg(data.level);
    }
  }

  setupInitialImg = (level: number): void => {
    console.log('setupInitialImg 실행 - level: ', level);
    switch (level) {
      case 1:
        this.add.image(540, 243, 'subMenuImg1');
        break;
      case 2:
        this.add.image(540, 243, 'subMenuImg2');
        break;
      case 3:
        this.add.image(540, 243, 'subMenuImg3');
        break;
      default:
        console.log('Mission must be selected!');
    }
  };

  handleImageClick(selectedLevel: number) {
    const level = selectedLevel;

    let mission: number;
    switch (this.selectedMission) {
      case 1:
        mission = 1;
        break;
      case 2:
        mission = 2;
        break;
      case 3:
        mission = 3;
        break;
      case 4:
        mission = 4;
        break;
      default:
        console.log('Unknown image');
        return;
    }

    this.cameras.main.fadeOut(500, 0, 0, 0, (_: any, progress: number) => {
      if (progress === 1) {
        // 페이드 아웃이 완료되면 새 장면 시작
        this.scene.start('GameScene', { level: level, mission: mission });
      }
    });
  }
}

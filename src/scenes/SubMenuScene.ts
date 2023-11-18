import Phaser from 'phaser';

interface SubMenuSceneData {
  selectedMission: number;
}

export default class SubMenuScene extends Phaser.Scene {
  private iconBack!: Phaser.GameObjects.Image;
  private missionBtn1!: Phaser.GameObjects.Image;
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
      missionBtnNumber: 'assets/MissionBtnNumber.png',
      missionBtn1Hover: 'assets/MissionBtn1Hover.png',
      missionBtnLock: 'assets/MissionBtnLock.png',
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
    this.iconBack.setInteractive().on('pointerdown', () => {
      this.iconBack.setTexture('iconBackClick');
      this.cameras.main.fadeOut(1000, 0, 0, 0, (_: any, progress: number) => {
        this.scene.start('MenuScene', {
          selectedMission: data.selectedMission,
        });
      });
    });

    this.missionBtn1 = this.add.image(255, 543, 'missionBtnNumber');
    this.add.image(429, 543, 'missionBtnLock');
    this.add.image(603, 543, 'missionBtnLock');
    this.add.image(777, 543, 'missionBtnLock');

    this.missionBtn1.setInteractive().on('pointerdown', () => {
      this.missionBtn1.setTexture('missionBtn1Hover');
      this.cameras.main.fadeOut(500, 0, 0, 0, (_: any, progress: number) => {
        if (progress === 1) {
          // 페이드 아웃이 완료되면 새 장면 시작
          this.scene.start('GameScene');
        }
      });
    });

    if (data.selectedMission) {
      console.log('data.selectedMission: ', data.selectedMission);
      this.setSubMenuImg(data.selectedMission);
    }
  }

  setSubMenuImg = (selectedMission: number): void => {
    switch (selectedMission) {
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
}

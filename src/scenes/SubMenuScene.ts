import Phaser from 'phaser';

interface SubMenuSceneData {
  selectedMission: number;
}

export default class SubMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SubMenuScene' });
  }

  preload() {
    const imageSources = {
      backgroundImg: 'assets/BackgroundImg.png',
      subMenuImg1: 'assets/SubMenuImg1.png',
      subMenuImg2: 'assets/SubMenuImg2.png',
      subMenuImg3: 'assets/SubMenuImg3.png',
      missionBtnNumber: 'assets/MissionBtnNumber.png',
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
    // this.add.image(540, 243, 'subMenuImg1');
    this.add.image(255, 543, 'missionBtnNumber');
    this.add.image(429, 543, 'missionBtnLock');
    this.add.image(603, 543, 'missionBtnLock');
    this.add.image(777, 543, 'missionBtnLock');

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

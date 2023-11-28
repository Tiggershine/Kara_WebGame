import Phaser from 'phaser';

export default class StartScene extends Phaser.Scene {
  private startBtn!: Phaser.GameObjects.Image;

  constructor() {
    super({ key: 'StartScene' });
  }

  preload() {
    const imageSources = {
      startSceneImg: 'assets/StartSceneImg.png',
      startBtn: 'assets/StartBtn.png',
      startBtnHover: 'assets/StartBtnHover.png',
      backgroundImg: 'assets/BackgroundImg.png',
      // Images for Popup Window
      defaultPopup: 'assets/PopupMd.png',
      popupSm: 'assets/PopupSm.png',
      popupSmAlert: 'assets/PopupSmAlert.png',
      popupMd: 'assets/PopupMd.png',
      popupMdAlert: 'assets/PopupMdAlert.png',
    };
    for (let key in imageSources) {
      if (imageSources.hasOwnProperty(key)) {
        this.load.image(key, imageSources[key as keyof typeof imageSources]);
      }
    }
  }

  create() {
    // this.add
    //   .graphics({ fillStyle: { color: 0xfcf6f5 } })
    //   .fillRect(0, 0, 1080, 810);
    this.add.image(0, 0, 'backgroundImg').setOrigin(0, 0);

    this.add.image(139, 108, 'startSceneImg').setOrigin(0, 0);
    this.startBtn = this.add.image(540, 572, 'startBtn');
    this.startBtn.setInteractive().on('pointerover', () => {
      this.startBtn.setTexture('startBtnHover');
    });
    this.startBtn.on('pointerout', () => {
      this.startBtn.setTexture('startBtn');
    });
    this.startBtn.on('pointerdown', () => {
      this.cameras.main.fadeOut(300, 0, 0, 0, (_: any, progress: number) => {
        if (progress === 1) {
          // 페이드 아웃이 완료되면 새 장면 시작
          this.scene.start('MenuScene');
        }
      });
    });
  }
}

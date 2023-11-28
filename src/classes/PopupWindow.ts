import Phaser from 'phaser';

const popupTypeConfig = [
  { id: 'sm', texture: 'popupSm' },
  { id: 'smAlert', texture: 'popupSmAlert' },
  { id: 'md', texture: 'popupMd' },
  { id: 'mmAlert', texture: 'popupMdAlert' },
  { id: 'default', texture: 'popupMd' },
];

export default class PopupWindow extends Phaser.GameObjects.Container {
  private popupWindow!: Phaser.GameObjects.Container;
  private popupType: string = '';
  private popupText: string = '';

  constructor(scene: Phaser.Scene, popupType: string, popupText: string) {
    super(scene);

    this.popupType = popupType;
    this.popupText = popupText;
  }

  // preload() {
  //   const imageSources = {
  //     defaultPopup: 'assets/PopupMd.png',
  //     popupSm: 'assets/PopupSm.png',
  //     popupSmAlert: 'assets/PopupSmAlert.png',
  //     popupMd: 'assets/PopupMd.png',
  //     popupMdAlert: 'assets/PopupMdAlert.png',
  //   };
  //   for (let key in imageSources) {
  //     if (imageSources.hasOwnProperty(key)) {
  //       this.scene.load.image(
  //         key,
  //         imageSources[key as keyof typeof imageSources]
  //       );
  //     }
  //   }
  // }

  create() {
    this.createPopupWindow(this.popupType, this.popupText);
  }

  createPopupWindow = (popupType: string, popupText: string) => {
    console.log('Popup window 그립니다.');
    const texture =
      popupTypeConfig.find((typeConfig) => typeConfig.id === popupType)
        ?.texture ||
      popupTypeConfig.find((typeConfig) => typeConfig.id === 'default')
        ?.texture ||
      'defaultPopup';

    const popupImage = this.scene.add.image(0, 0, texture);
    this.scene.add.existing(popupImage);

    const text = this.scene.add.text(-130, -60, popupText, {
      fontSize: '25px',
      fontFamily: 'Roboto Condensed',
      color: '#1B1C1D',
    });
    text.setFontStyle('bold');
    // text.setOrigin(0.01, 0.01);

    this.scene.add.existing(text);

    this.popupWindow = this.scene.add.container(
      this.scene.cameras.main.centerX,
      this.scene.cameras.main.centerY
    );
    this.popupWindow.add(popupImage);
    this.popupWindow.add(text);

    // 필요한 경우 Container의 크기 조정
    this.popupWindow.setSize(popupImage.width, popupImage.height);
    this.popupWindow.setInteractive();
    this.popupWindow.setDepth(10);
  };
}

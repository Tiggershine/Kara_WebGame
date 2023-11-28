import Phaser from 'phaser';

const popupTypeConfig = [
  { id: 'smBack', texture: 'popupSmBack' },
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
  private isBtnOption: boolean = false;

  constructor(
    scene: Phaser.Scene,
    popupType: string,
    popupText: string,
    isBtnOption: boolean
  ) {
    super(scene);

    this.popupType = popupType;
    this.popupText = popupText;
    this.isBtnOption = isBtnOption;
  }

  create() {
    this.createPopupWindow(this.popupType, this.popupText, this.isBtnOption);
  }

  createPopupWindow = (
    popupType: string,
    popupText: string,
    isBtnOption: boolean
  ) => {
    this.popupWindow = this.scene.add.container(
      this.scene.cameras.main.centerX,
      this.scene.cameras.main.centerY
    );

    console.log('Popup window 그립니다.');
    const texture =
      popupTypeConfig.find((typeConfig) => typeConfig.id === popupType)
        ?.texture ||
      popupTypeConfig.find((typeConfig) => typeConfig.id === 'default')
        ?.texture ||
      'defaultPopup';

    const popupImage = this.scene.add.image(0, 0, texture);
    this.scene.add.existing(popupImage);
    this.popupWindow.add(popupImage);

    if (isBtnOption) {
      const text = this.scene.add.text(-135, -55, popupText, {
        fontSize: '25px',
        fontFamily: 'Roboto Condensed',
        color: '#1B1C1D',
      });
      text.setFontStyle('bold');
      this.scene.add.existing(text);

      const yesBtn = this.scene.add
        .image(-85, 50, 'popupYesBtn')
        .setInteractive();
      yesBtn.on('pointerover', () => {
        yesBtn.setTexture('popupYesBtnHover');
      });
      yesBtn.on('pointerout', () => {
        yesBtn.setTexture('popupYesBtn');
      });
      yesBtn.on('pointerdown', () => {
        this.scene.tweens.add({
          targets: this.popupWindow,
          alpha: 0,
          duration: 500,
          onComplete: () => {
            this.popupWindow.setVisible(false);
            this.scene.events.emit('popupResponse', true);
          },
        });
      });
      this.scene.add.existing(yesBtn);

      const noBtn = this.scene.add.image(85, 50, 'popupNoBtn').setInteractive();
      noBtn.on('pointerover', () => {
        noBtn.setTexture('popupNoBtnHover');
      });
      noBtn.on('pointerout', () => {
        noBtn.setTexture('popupNoBtn');
      });
      noBtn.on('pointerdown', () => {
        this.scene.tweens.add({
          targets: this.popupWindow,
          alpha: 0,
          duration: 500,
          onComplete: () => {
            this.popupWindow.setVisible(false);
            this.scene.events.emit('popupResponse', false);
          },
        });
      });
      this.scene.add.existing(noBtn);

      this.popupWindow.add(yesBtn);
      this.popupWindow.add(noBtn);
      this.popupWindow.add(text);
    } else {
      const text = this.scene.add.text(-135, -55, popupText, {
        fontSize: '25px',
        fontFamily: 'Roboto Condensed',
        color: '#1B1C1D',
      });
      text.setFontStyle('bold');
      this.scene.add.existing(text);
      this.popupWindow.add(text);
    }

    this.popupWindow.setSize(popupImage.width, popupImage.height);
    this.popupWindow.setInteractive();
    this.popupWindow.setDepth(10);
  };
}

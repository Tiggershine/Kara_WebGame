import Phaser from 'phaser';

const popupTypeConfig = [
  { id: 'smBack', texture: 'popupSmBack' },
  { id: 'sm', texture: 'popupSm' },
  { id: 'smAlert', texture: 'popupSmAlert' },
  { id: 'md', texture: 'popupMd' },
  { id: 'mdAlert', texture: 'popupMdAlert' },
  { id: 'default', texture: 'popupSm' },
  { id: 'smInfinite', texture: 'popupInfinite' },
  { id: 'smBoundary', texture: 'popupBoundary' },
  { id: 'smStateDelete', texure: 'popupSm' },
  { id: 'smBackBtn', texture: 'popupSm' },
];

export default class PopupWindow extends Phaser.GameObjects.Container {
  private popupWindow!: Phaser.GameObjects.Container;
  private popupType: string = '';
  private popupText: string = '';
  private isBtnOption: boolean = false;

  constructor(
    scene: Phaser.Scene,
    popupType: string,
    isBtnOption: boolean,
    popupText?: string
  ) {
    super(scene);

    this.popupType = popupType;
    this.popupText = popupText ? popupText : '';
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

    console.log('Popup window 그립니다.', this.popupType);
    const texture =
      popupTypeConfig.find((typeConfig) => typeConfig.id === this.popupType)
        ?.texture ||
      popupTypeConfig.find((typeConfig) => typeConfig.id === 'default')
        ?.texture ||
      'defaultPopup';

    const popupImage = this.scene.add.image(0, 0, texture);
    this.scene.add.existing(popupImage);
    this.popupWindow.add(popupImage);

    if (isBtnOption) {
      const text = this.scene.add.text(-135, -60, popupText, {
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
        this.scene.sound.play('buttonSound1');
        this.scene.tweens.add({
          targets: this.popupWindow,
          alpha: 0,
          duration: 500,
          onComplete: () => {
            this.popupWindow.setVisible(false);
            if (this.popupType === 'smBackBtn') {
              this.scene.events.emit('backPopupResponse', true);
            } else if (this.popupType === 'smStateDelete') {
              this.scene.events.emit('deletePopupResponse', true);
            }
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
        this.scene.sound.play('buttonSound1');
        this.scene.tweens.add({
          targets: this.popupWindow,
          alpha: 0,
          duration: 500,
          onComplete: () => {
            this.popupWindow.setVisible(false);
            if (this.popupType === 'smBackBtn') {
              this.scene.events.emit('backPopupResponse', false);
            } else if (this.popupType === 'smStateDelete') {
              this.scene.events.emit('deletePopupResponse', false);
            }
          },
        });
      });
      this.scene.add.existing(noBtn);

      this.popupWindow.add(yesBtn);
      this.popupWindow.add(noBtn);
      this.popupWindow.add(text);
    } else {
      const text = this.scene.add.text(-135, -60, popupText, {
        fontSize: '25px',
        fontFamily: 'Roboto Condensed',
        color: '#1B1C1D',
      });
      text.setFontStyle('bold');
      this.scene.add.existing(text);
      this.popupWindow.add(text);

      const okBtn = this.scene.add.image(0, 50, 'popupOKBtn').setInteractive();
      okBtn.on('pointerover', () => {
        okBtn.setTexture('popupOKBtnHover');
      });
      okBtn.on('pointerout', () => {
        okBtn.setTexture('popupOKBtn');
      });
      okBtn.on('pointerdown', () => {
        this.scene.tweens.add({
          targets: this.popupWindow,
          alpha: 0,
          duration: 500,
          onComplete: () => {
            this.popupWindow.setVisible(false);
          },
        });
      });
      this.scene.add.existing(okBtn);
      this.popupWindow.add(okBtn);
    }

    this.popupWindow.setSize(popupImage.width, popupImage.height);
    this.popupWindow.setInteractive();
    this.popupWindow.setDepth(10);
  };
}

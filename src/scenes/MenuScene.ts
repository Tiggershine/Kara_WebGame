import Phaser from 'phaser';

interface MenuSceneData {
  selectedMission: number;
}

export default class MenuScene extends Phaser.Scene {
  private startPoint!: Phaser.Geom.Point;
  private endPoint!: Phaser.Geom.Point;
  private isSwiping: boolean = false;
  private swipeThreshold: number = 150;
  private isSwipe: boolean = false; // Flag to indicate if the action is a swipe
  private currentImage!: Phaser.GameObjects.Image;
  private leftImage!: Phaser.GameObjects.Image;
  private leftImage2!: Phaser.GameObjects.Image;
  private rightImage!: Phaser.GameObjects.Image;
  private rightImage2!: Phaser.GameObjects.Image;

  constructor() {
    super({ key: 'MenuScene' });
  }

  preload() {
    const imageSources = {
      menuImg1: 'assets/MenuImg1.png',
      menuImg2: 'assets/MenuImg2.png',
      menuImg3: 'assets/MenuImg3.png',
    };
    for (let key in imageSources) {
      if (imageSources.hasOwnProperty(key)) {
        this.load.image(key, imageSources[key as keyof typeof imageSources]);
      }
    }
  }

  create(data: MenuSceneData) {
    const imagePosition = {
      center: [540, 359.5],
      left: [30, 359.5],
      right: [1050, 359.5],
    };

    this.add
      .graphics({ fillStyle: { color: 0xfcf6f5 } })
      .fillRect(0, 0, 1080, 810);

    this.setupInitialImages(data.selectedMission);
    // Initialize images
    // this.currentImage = this.add.image(
    //   imagePosition.center[0],
    //   imagePosition.center[1],
    //   'menuImg1'
    // );
    // // Set up events for the initial currentImage
    // this.setupImageClickEvents(this.currentImage);

    // this.rightImage = this.add
    //   .image(imagePosition.right[0], imagePosition.right[1], 'menuImg2')
    //   .setScale(0.5);
    // this.rightImage2 = this.add.image(1560, 359.5, 'menuImg3');

    this.startPoint = new Phaser.Geom.Point();
    this.endPoint = new Phaser.Geom.Point();
    // this.isSwiping = false;

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.startPoint.setTo(pointer.x, pointer.y);
      this.isSwiping = true;

      this.isSwipe = false;
    });

    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      if (!this.isSwiping) return;

      this.endPoint.setTo(pointer.x, pointer.y);
      const swipeDistance = Phaser.Math.Distance.Between(
        this.startPoint.x,
        this.startPoint.y,
        this.endPoint.x,
        this.endPoint.y
      );

      if (swipeDistance > this.swipeThreshold) {
        this.isSwipe = true;
        this.handleSwipe();
      }

      this.isSwiping = false;
    });
  }

  setupInitialImages = (level?: number): void => {
    switch (level) {
      case 1:
        this.currentImage = this.add.image(540, 359.5, 'menuImg1');
        this.setupImageClickEvents(this.currentImage);
        this.rightImage = this.add.image(1050, 359.5, 'menuImg2').setScale(0.5);
        this.rightImage2 = this.add
          .image(1560, 359.5, 'menuImg3')
          .setScale(0.5);
        break;
      case 2:
        this.currentImage = this.add.image(540, 359.5, 'menuImg2');
        this.setupImageClickEvents(this.currentImage);
        this.leftImage = this.add.image(30, 359.5, 'menuImg1').setScale(0.5);
        this.rightImage = this.add.image(1050, 359.5, 'menuImg3').setScale(0.5);
        break;
      case 3:
        this.currentImage = this.add.image(540, 359.5, 'menuImg3');
        this.setupImageClickEvents(this.currentImage);
        this.leftImage = this.add.image(30, 359.5, 'menuImg2').setScale(0.5);
        this.leftImage2 = this.add.image(-480, 359.5, 'menuImg1').setScale(0.5);
        break;
      default:
        this.currentImage = this.add.image(540, 359.5, 'menuImg1');
        this.setupImageClickEvents(this.currentImage);
        this.rightImage = this.add.image(1050, 359.5, 'menuImg2').setScale(0.5);
        this.rightImage2 = this.add
          .image(1560, 359.5, 'menuImg3')
          .setScale(0.5);
        break;
    }
  };

  setupImageClickEvents = (image: Phaser.GameObjects.Image): void => {
    image.setInteractive().on('pointerdown', () => {
      if (!this.isSwipe) {
        this.handleImageClick();
      }
    });
  };

  handleSwipe() {
    const swipeDirection =
      this.endPoint.x > this.startPoint.x ? 'right' : 'left';

    const imagePosition = {
      center: [540, 359.5],
      left: [30, 359.5],
      left2: [-480, 359.5],
      right: [1050, 359.5],
      right2: [1560, 359.5],
    };

    if (swipeDirection === 'left') {
      if (this.currentImage.texture.key === 'menuImg1') {
        // Tween currentImage to the left
        this.tweens.add({
          targets: this.currentImage,
          x: imagePosition.left[0],
          y: imagePosition.left[1],
          scale: 0.5,
          duration: 300,
        });
        this.leftImage = this.currentImage;

        this.tweens.add({
          targets: this.rightImage,
          x: imagePosition.center[0],
          y: imagePosition.center[1],
          scale: 1,
          duration: 300,
        });
        this.currentImage = this.rightImage;
        this.currentImage.texture.key = 'menuImg2';
        this.setupImageClickEvents(this.currentImage);

        // Set menuImg3 to the right
        this.tweens.add({
          targets: this.rightImage2,
          x: imagePosition.right[0],
          y: imagePosition.right[1],
          scale: 0.5,
          duration: 300,
        });
        this.rightImage = this.rightImage2;
      } else if (this.currentImage.texture.key === 'menuImg2') {
        // Tween currentImage to the left
        this.tweens.add({
          targets: this.leftImage,
          x: imagePosition.left2[0],
          y: imagePosition.left2[1],
          scale: 0.5,
          duration: 300,
        });
        this.leftImage2 = this.leftImage;

        // Tween currentImage to the left
        this.tweens.add({
          targets: this.currentImage,
          x: imagePosition.left[0],
          y: imagePosition.left[1],
          scale: 0.5,
          duration: 300,
        });
        this.leftImage = this.currentImage;

        // Tween menuImg3 to the center
        this.tweens.add({
          targets: this.rightImage,
          x: imagePosition.center[0],
          y: imagePosition.center[1],
          scale: 1,
          duration: 300,
        });
        this.currentImage = this.rightImage;
        this.currentImage.texture.key = 'menuImg3';
        this.setupImageClickEvents(this.currentImage);
      } else if (this.currentImage.texture.key === 'menuImg3') {
        return;
      }
    } else if (swipeDirection === 'right') {
      if (this.currentImage.texture.key === 'menuImg3') {
        // Tween currentImage to the right
        this.tweens.add({
          targets: this.currentImage,
          x: imagePosition.right[0],
          y: imagePosition.right[1],
          scale: 0.5,
          duration: 300,
        });
        this.rightImage = this.currentImage;

        // Tween menuImg2 to the center
        this.tweens.add({
          targets: this.leftImage,
          x: imagePosition.center[0],
          y: imagePosition.center[1],
          scale: 1,
          duration: 300,
        });
        this.currentImage = this.leftImage;
        this.currentImage.texture.key = 'menuImg2';
        this.setupImageClickEvents(this.currentImage);

        // Set menuImg1 to the left
        this.tweens.add({
          targets: this.leftImage2,
          x: imagePosition.left[0],
          y: imagePosition.left[1],
          scale: 0.5,
          duration: 300,
        });
        this.leftImage = this.leftImage2;
      } else if (this.currentImage.texture.key === 'menuImg2') {
        // Tween menuImg2 to the right2
        this.tweens.add({
          targets: this.rightImage,
          x: imagePosition.right2[0],
          y: imagePosition.right2[1],
          scale: 0.5,
          duration: 300,
        });
        this.rightImage2 = this.rightImage;

        // Tween menuImg2 to the right
        this.tweens.add({
          targets: this.currentImage,
          x: imagePosition.right[0],
          y: imagePosition.right[1],
          scale: 0.5,
          duration: 300,
        });
        this.rightImage = this.currentImage;

        // Tween menuImg1 to the center
        this.tweens.add({
          targets: this.leftImage,
          x: imagePosition.center[0],
          y: imagePosition.center[1],
          scale: 1,
          duration: 300,
        });
        this.currentImage = this.leftImage;
        this.currentImage.texture.key = 'menuImg1';
        this.setupImageClickEvents(this.currentImage);
      } else if (this.currentImage.texture.key === 'menuImg1') {
        return;
      }
    }
  }

  handleImageClick() {
    let selectedMission;
    switch (this.currentImage.texture.key) {
      case 'menuImg1':
        console.log('menuImg1');
        selectedMission = 1;
        break;
      case 'menuImg2':
        console.log('menuImg2');
        selectedMission = 2;
        break;
      case 'menuImg3':
        console.log('menuImg3');
        selectedMission = 3;
        break;
      default:
        console.log('Unknown image');
        return;
    }

    this.scene.start('SubMenuScene', { selectedMission: selectedMission });
  }
}

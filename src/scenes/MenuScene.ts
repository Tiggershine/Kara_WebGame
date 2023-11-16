import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
  private startPoint!: Phaser.Geom.Point;
  private endPoint!: Phaser.Geom.Point;
  private isSwiping: boolean = false;
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

  create() {
    const imagePosition = {
      center: [540, 359.5],
      left: [30, 359.5],
      right: [1050, 359.5],
    };

    // this.add.image(0, 0, 'backgroundImg').setOrigin(0, 0);
    this.add
      .graphics({ fillStyle: { color: 0xfcf6f5 } })
      .fillRect(0, 0, 1080, 810);

    // this.add.image(540.5, 359.5, 'menuImg1');
    // this.add.image(1050, 359.5, 'menuImg2').setScale(1 / 2);

    // Initialize images
    this.currentImage = this.add.image(
      imagePosition.center[0],
      imagePosition.center[1],
      'menuImg1'
    );
    this.rightImage = this.add
      .image(imagePosition.right[0], imagePosition.right[1], 'menuImg2')
      .setScale(0.5);
    this.rightImage2 = this.add.image(1560, 359.5, 'menuImg3');

    this.startPoint = new Phaser.Geom.Point();
    this.endPoint = new Phaser.Geom.Point();
    // this.isSwiping = false;

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.startPoint.setTo(pointer.x, pointer.y);
      this.isSwiping = true;
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

      if (swipeDistance > 150) {
        // 스와이프 거리 임계값
        this.handleSwipe();
      }

      this.isSwiping = false;
    });
  }

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
        // Tween currentImage to the right
        this.tweens.add({
          targets: this.rightImage,
          x: imagePosition.right2[0],
          y: imagePosition.right2[1],
          scale: 0.5,
          duration: 300,
        });
        this.rightImage2 = this.rightImage;

        // Tween menuImg2 to the center
        this.tweens.add({
          targets: this.currentImage,
          x: imagePosition.right[0],
          y: imagePosition.right[1],
          scale: 0.5,
          duration: 300,
        });
        this.rightImage = this.currentImage;

        // Hide the rightImage
        this.tweens.add({
          targets: this.leftImage,
          x: imagePosition.center[0],
          y: imagePosition.center[1],
          scale: 1,
          duration: 300,
        });
        this.currentImage = this.leftImage;
      } else if (this.currentImage.texture.key === 'menuImg1') {
        return;
      }
    }
  }
}

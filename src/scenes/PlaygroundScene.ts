import Phaser from 'phaser';
import Stars from '../tasks/Stars';
import TunnelFinder from '../tasks/TunnelFinder';
import { StateInput } from '../classes/InputManager';
import StateCircle from '../classes/StateCircle';
import Game from './Game';
import DiagramScene from './DiagramScene';

interface PlaygroundSceneData {
  level: number;
  mission: number;
}

export default class PlaygroundScene extends Phaser.Scene {
  private stateCircles: StateCircle[] = [];
  private stateInputData: { id: number; stateInputs: StateInput[] }[] = [];
  private taskStars!: Stars;
  private tunnelFinder!: TunnelFinder;
  private playButton!: Phaser.GameObjects.Sprite;
  private highlightToggle!: Phaser.GameObjects.Image;
  private isSimulationPlaying: boolean = false;
  containerGraphics!: Phaser.GameObjects.Graphics;
  tileGraphics!: Phaser.GameObjects.Graphics;
  private highlightOn: boolean = false;
  private selectedLevel: number = 0;
  private selectedMission: number = 0;
  private iconBack!: Phaser.GameObjects.Image;
  private iconReset!: Phaser.GameObjects.Image;
  private isMissionInitiated: boolean = false;

  constructor() {
    super('PlaygroundScene');
  }

  // Values for Style
  private containerStyle = {
    size: 500,
    borderRadius: 10,
    backgroundColor: 0xfcf6f5,
  };
  private tileStyle = {
    size: 50,
    lineWidth: 1,
    lineColor: 0x2bae66,
    lineColorAlpha: 128 / 255,
  };

  preload() {
    this.load.image('pauseButton', 'pauseButton');
  }

  create(data: PlaygroundSceneData) {
    this.selectedLevel = data.level;
    this.selectedMission = data.mission;

    this.events.on(
      'stateInputDataUpdated',
      this.handleStateCirclesUpdated,
      this
    );

    // Container Object
    this.containerGraphics = this.add.graphics({
      fillStyle: { color: this.containerStyle.backgroundColor },
    });
    this.containerGraphics.fillRoundedRect(
      30,
      90,
      this.containerStyle.size,
      this.containerStyle.size,
      this.containerStyle.borderRadius
    );

    // Tile Object
    this.tileGraphics = this.add.graphics({
      lineStyle: {
        width: this.tileStyle.lineWidth,
        color: this.tileStyle.lineColor,
        alpha: this.tileStyle.lineColorAlpha,
      },
    });
    for (let i = 1; i < 10; i++) {
      this.tileGraphics.lineBetween(
        i * this.tileStyle.size + 30,
        90,
        i * this.tileStyle.size + 30,
        this.containerStyle.size + 90
      ); // Vertical line
      this.tileGraphics.lineBetween(
        30,
        i * this.tileStyle.size + 90,
        this.containerStyle.size + 30,
        i * this.tileStyle.size + 90
      ); // Horizontal line
    }

    this.iconBack = this.add.image(50, 50, 'iconBack').setInteractive();
    this.iconBack.on('pointerover', () => {
      this.iconBack.setTexture('iconBackClick');
    });
    this.iconBack.on('pointerout', () => {
      this.iconBack.setTexture('iconBack');
    });
    this.iconBack.on('pointerdown', () => {
      const scene = this;
      this.cameras.main.fadeOut(500, 0, 0, 0, (_: any, progress: number) => {
        if (progress === 1) {
          //   // 다른 장면들이 활성 상태인지 확인하고 종료
          //   if (this.scene.isActive('DiagramScene')) {
          //     this.scene.stop('DiagramScene');
          //   }
          //   if (this.scene.isActive('InputWindowScene')) {
          //     this.scene.stop('InputWindowScene');
          //   }

          //   // 페이드 아웃이 완료되면 새 장면 시작
          //   this.scene.start('GameScene', {
          //     level: this.selectedLevel,
          //     mission: this.selectedMission,
          //     isFromPlaygroundScene: true,
          //   });
          // }
          this.cleanupCurrentScene();
          this.transitionToNewScene('SubMenuScene', data.level);
        }
      });
    });

    this.iconReset = this.add.image(100, 50, 'iconReset').setInteractive();
    this.iconReset.on('pointerover', () => {
      this.iconReset.setTexture('iconResetClick');
    });
    this.iconReset.on('pointerout', () => {
      this.iconReset.setTexture('iconReset');
    });
    this.iconReset.on('pointerdown', () => {
      this.cleanupCurrentScene();

      const gameScene: Phaser.Scene = this.scene.get('GameScene');
      gameScene.scene.restart();
    });

    // Load Task - 미션을 위한 파일 로드 feats. 객체들
    this.gameLoader(this.selectedLevel, this.selectedMission);

    // Simulation Play Button
    this.playButton = this.add.sprite(65, 645, 'playButton').setInteractive();
    this.load.image('playButton', 'playButton');

    this.events.on('simulationEnd', () => {
      this.playButton.setTexture('playButton');
      this.isSimulationPlaying = false;
    });

    this.playButton.on('pointerdown', () => {
      // 시뮬 중, 멈춤 버튼 누르면 시뮬 초기화 되면서 play버튼 나타나기
      if (this.isSimulationPlaying) {
        this.playButton.setTexture('playButton');
        this.isSimulationPlaying = false;
      } else {
        // 시뮬 중이 아니면, 정지 버튼으로 바뀌면서 시뮬 시작
        this.playButton.setTexture('stopButton');
        this.isSimulationPlaying = true;

        const stateInputData = this.stateInputData;
        const level = data.level;
        const mission = data.mission;

        switch (level) {
          case 1:
            switch (mission) {
              case 1:
                if (this.taskStars) {
                  if (this.isMissionInitiated) {
                    this.taskStars.restartSimulation(
                      stateInputData,
                      this.highlightOn
                    );
                  } else {
                    this.taskStars.processStateInputData(
                      stateInputData,
                      this.highlightOn
                    );
                    this.isMissionInitiated = true;
                  }
                } else {
                  console.log('Mission is not loaded yet.');
                }
            }
          case 2:
            switch (mission) {
              case 1:
                if (this.tunnelFinder) {
                  if (this.isMissionInitiated) {
                    this.tunnelFinder.restartSimulation(
                      stateInputData,
                      this.highlightOn
                    );
                  } else {
                    this.tunnelFinder.processStateInputData(
                      stateInputData,
                      this.highlightOn
                    );
                    this.isMissionInitiated = true;
                  }
                } else {
                  console.log('Mission is not loaded yet.');
                }
            }
        }
      }
    });

    // Hightlight On/Off Button
    this.highlightToggle = this.add.image(64, 689, 'hightlightToggleOff');
    this.highlightToggle.setInteractive();
    this.highlightToggle.on('pointerdown', () => {
      if (!this.highlightOn) {
        this.highlightToggle.setTexture('hightlightToggleOn');
        this.highlightOn = true;
      } else {
        this.highlightToggle.setTexture('hightlightToggleOff');
        this.highlightOn = false;
      }
    });
  }

  update() {}
  private handleStateCirclesUpdated(stateCircles: StateCircle[]) {
    this.stateCircles = stateCircles;

    this.stateInputData = stateCircles.map((stateCircle) => ({
      id: stateCircle.id,
      stateInputs: stateCircle.stateInputs,
    }));

    for (const inputData of this.stateInputData) {
      // console.log(
      //   '(PlaygroundScene.ts)',
      //   'stateId: ',
      //   inputData.id,
      //   'stateInputs: ',
      //   inputData.stateInputs
      // );
    }
  }

  gameLoader = (level: number, mission: number) => {
    switch (level) {
      case 1:
        switch (mission) {
          case 1:
            this.taskStars = new Stars(this, 30, 90);
            break;
        }
        break;
      case 2:
        switch (mission) {
          case 1:
            this.tunnelFinder = new TunnelFinder(this, 30, 90);
            break;
        }
        break;
    }
  };

  cleanupCurrentScene() {
    // 다른 활성화된 장면 정리
    if (this.scene.isActive('DiagramScene')) {
      const diagramScene = this.scene.get('DiagramScene') as DiagramScene;
      // Call cleanup on the DiagramScene
      diagramScene.cleanup();

      // Now stop the scene
      this.scene.stop('DiagramScene');
      this.scene.stop('DiagramScene');
    }
    if (this.scene.isActive('InputWindowScene')) {
      // console.log('this.scene.stop(InputWindowScene)');
      this.scene.stop('InputWindowScene');
    }
    if (this.scene.isActive('PlaygroundScene')) {
      // console.log('this.scene.stop(PlaygroundScene)');
      this.scene.stop('PlaygroundScene');
    }
    if (this.scene.isActive('GameScene')) {
      // console.log('this.scene.stop(GameScene)');
      this.scene.stop('GameScene');
    }
  }

  // 새 장면으로 전환하는 메서드
  transitionToNewScene(sceneName: string, selectedLevel?: number) {
    this.cleanupCurrentScene();

    if (selectedLevel) {
      this.scene.launch(sceneName, { level: selectedLevel });
    }
    this.scene.launch(sceneName);
  }
}

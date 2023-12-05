import Phaser from 'phaser';
import DiagramScene from '../scenes/DiagramScene';
import StateCircle from './StateCircle';
import PopupWindow from './PopupWindow';
import { StateInput } from './InputManager';
import InputLabel from './InputLabel';
import {
  diagramContainerConfig,
  playgroundContainerConfig,
  playgroundTileConfig,
  backButtonConfig,
  resetButtonConfig,
  stageLabelConfig,
  infoButtonConfig,
  playButtonConfig,
  highligtToggleConfig,
} from '../configurations';

export default class UIManager {
  private diagramScene: DiagramScene;

  constructor(diagramScene: DiagramScene) {
    this.diagramScene = diagramScene;
  }

  ///////////////////////// DIAGRAM SCENE /////////////////////////

  //////////  STATE CIRCLE  //////////
  /** Add Button for createing new stateCircle */
  createAddButton() {
    const addButton = this.diagramScene.add.image(575, 55, 'addButton');
    addButton.setDepth(2).setInteractive();
    this.diagramScene.input.setDraggable(addButton);

    // // Create new StateCircle object
    // let newStateCircle: StateCircle = this.createStateCircle(0, 0);
    // newStateCircle.setVisible(false);

    addButton.on('pointerover', () => {
      addButton.setTexture('addButtonSelected');
    });
    addButton.on('pointerout', () => {
      addButton.setTexture('addButton');
    });

    addButton.on('dragstart', (pointer: Phaser.Input.Pointer) => {
      addButton.setTexture('addButtonSelected');
    });

    addButton.on(
      'drag',
      (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        addButton.setPosition(dragX, dragY);
      }
    );

    addButton.on('dragend', (pointer: Phaser.Input.Pointer) => {
      if (addButton) {
        addButton.destroy();
      }

      if (
        this.diagramScene.diagramValidArea
          .getBounds()
          .contains(pointer.x, pointer.y)
      ) {
        // Create new StateCircle object
        let newStateCircle: StateCircle | null = null;
        newStateCircle = this.createStateCircle(pointer.x, pointer.y);
        // newStateCircle.setPosition(pointer.x, pointer.y).setVisible(true);
        newStateCircle && newStateCircle.select();
        this.createAddButton();
        this.diagramScene.sound.play('addStateSound', { volume: 0.7 });
      } else {
        this.diagramScene.sound.play('mistakeSound', { volume: 0.5 });
        this.createAddButton();
      }
      return;
    });
  }

  /** Create new StateCircle */
  // Create new stateCircle object
  createStateCircle(x: number, y: number): StateCircle | null {
    // The number of StateCiecle cannot over 5 (includes Start, End)
    if (this.diagramScene.getStateCircles.length > 5) {
      return null;
    }

    // Before creating a new state, remove the endStateCircle from the array
    const endStateCircle = this.diagramScene.stateCircles.pop();

    const stateId = this.diagramScene.getIdCount;
    this.diagramScene.setIdCount = this.diagramScene.getIdCount + 1;
    console.log('idCount: ', this.diagramScene.getIdCount);
    const stateName = 'State ' + stateId;
    const newStateInput: StateInput[] = [];
    const inputLabel: InputLabel = new InputLabel(
      this.diagramScene,
      stateId,
      0,
      0,
      stateName,
      false
    );
    this.diagramScene.inputLabels.push(inputLabel);

    const newStateCircle = new StateCircle(
      this.diagramScene,
      x,
      y,
      stateId,
      stateName,
      newStateInput,
      this.diagramScene.edgeManager,
      inputLabel
    );

    // Deselect all other circles
    this.diagramScene.getStateCircles &&
      this.diagramScene.stateCircles.forEach((circle) => {
        if (circle) {
          circle.deselect();
        }
      });
    // Ensure the newStateCircle is selected upon creation
    if (newStateCircle) {
      newStateCircle.select();
    }

    this.diagramScene.stateCircles.push(newStateCircle); // stateCircles 배열에 추가

    // Re-add the endStateCircle to the end of the array
    if (endStateCircle) {
      this.diagramScene.stateCircles.push(endStateCircle);
    }

    this.addLabels();

    // StateCirle 객체에 InputWindow 객체 추가
    // const inputWindow = new InputWindow(this, 0, 0, stateId);
    // newStateCircle.setInputWindow(inputWindow);

    // Event emit -> stateCircle: { id, name } emit
    this.diagramScene.events.emit(
      'updatedStateCircles',
      this.diagramScene.getStateCircles.map((stateCircle) => {
        // TODO: DELETE TEST CODE
        // console.log('(DiagramScene.ts) stateCircles: ', stateCircle);
        return {
          id: stateCircle.getId,
          name: stateCircle.getName,
        };
      })
    );

    return newStateCircle;
  }

  /** Create START-stateCircle (used only once on init) */
  createStartStateCircle(): void {
    const stateId = 0;
    const stateName = 'START';
    const newStateInput: StateInput[] = [];
    const inputLabel = new InputLabel(
      this.diagramScene,
      stateId,
      0,
      0,
      stateName,
      false
    );
    this.diagramScene.inputLabels.push(inputLabel);

    const startStateCircle = new StateCircle(
      this.diagramScene,
      600,
      150,
      stateId,
      stateName,
      newStateInput,
      this.diagramScene.edgeManager,
      inputLabel
    );

    // Deselect all other circles

    this.diagramScene.getStateCircles &&
      this.diagramScene.getStateCircles.forEach((circle) => {
        if (circle) {
          circle.deselect();
        }
      });
    // Ensure the newStateCircle is selected upon creation
    if (startStateCircle) {
      startStateCircle.select();
    }

    startStateCircle.setDepth(1);
    this.diagramScene.stateCircles.push(startStateCircle); // stateCircles 배열에 추가

    this.addLabels();

    // Event emit -> stateCircle: { id, name } emit
    this.diagramScene.events.emit(
      'updatedStateCircles',
      this.diagramScene.getStateCircles.map((stateCircle) => {
        return {
          id: stateCircle.getId,
          name: stateCircle.getName,
        };
      })
    );
  }
  /** Create END-StateCircle (used only once on init) */
  createEndStateCircle(): void {
    const stateId = 100;
    const stateName = 'STOP';
    const newStateInput: StateInput[] = [];
    const inputLabel = new InputLabel(
      this.diagramScene,
      stateId,
      0,
      0,
      stateName,
      false
    ).setVisible(false);
    inputLabel.setDepth(-10);
    this.diagramScene.inputLabels.push(inputLabel);

    const endStateCircle = new StateCircle(
      this.diagramScene,
      1000,
      280,
      stateId,
      stateName,
      newStateInput,
      this.diagramScene.edgeManager,
      inputLabel
    );

    endStateCircle.deselect();
    endStateCircle.setDepth(1);

    // Add the endStateCircle to the stateCircles array
    this.diagramScene.stateCircles.push(endStateCircle);
  }

  //////////  INPUT LABEL  //////////
  // InputLabel 그래픽 추가
  addLabels = (): void => {
    // Start Coordinate - x: 550, y: 360
    let startX = 550;
    const y = 360;
    const gap = 90;

    // Update 시, 기존의 Array 초기화
    this.diagramScene.inputLabels.forEach((inputLabel) => {
      if (inputLabel) {
        inputLabel.destroy();
      }
    });
    this.diagramScene.inputLabels = [];

    // Exclude end stateCircle
    const excludingEnd = this.diagramScene.getStateCircles.filter(
      (stateCircle, index) => {
        return stateCircle.getId !== 100;
      }
    );

    // End가 제외된 StateCircles 배열에 대한 Label 생성
    excludingEnd.forEach((state) => {
      const label = new InputLabel(
        this.diagramScene,
        state.id,
        startX,
        y,
        state.name,
        state.isSelected
      );
      this.diagramScene.inputLabels.push(label);
      this.diagramScene.add.existing(label);
      startX += gap;
    });
  };

  //////////  EDGE of STATE CIRCLE  //////////
  /** Edge */
  // StateCircles 배열을 순회하면서 각 StateCircle과 그 다음 StateCircle 간에 edge를 만듭니다.
  createEdgesForStateCircles(): void {
    // 먼저 모든 기존 엣지를 제거합니다.
    console.log('엣지 함수 시작');
    this.diagramScene.getStateCircles.forEach((circle) => {
      circle.edges.forEach((edge) => {
        if (edge) {
          edge.destroy();
        }
      });
      circle.edges = [];
    });

    // nextState가 있는 StateCircle 간에만 엣지를 생성합니다.
    this.diagramScene.getStateCircles.forEach((circle) => {
      circle.stateInputs.forEach((input) => {
        if (input.nextState !== undefined) {
          if (input.nextState === circle.id) {
            // nextState가 자기 자신인 경우
            // Create a self edge
            this.diagramScene.edgeManager.createSelfEdge(circle);
          }
          // Check if the nextState is different from the current circle's id
          // to avoid creating a self edge again
          if (input.nextState !== circle.id) {
            const nextStateCircle = this.diagramScene.stateCircles.find(
              (c) => c.id === input.nextState
            );
            if (nextStateCircle) {
              // 이미 edge가 존재하지 않는 경우에만 새로운 edge를 생성합니다.
              if (
                !circle.edges.some(
                  (edge) =>
                    edge.data && edge.data.get('endCircle') === nextStateCircle
                )
              ) {
                // console.log(
                //   'createdge 코앞',
                //   'circle: ',
                //   circle,
                //   'nextStateCircle: ',
                //   nextStateCircle
                // );
                this.diagramScene.edgeManager.createEdge(
                  circle,
                  nextStateCircle
                );
              }
            }
          }
        }
      });
    });
  }

  //////////  DIAGRAM CONTAINER  //////////
  createDiagramContainer = (): void => {
    const diagramContainerGraphic = this.diagramScene.add.graphics({
      fillStyle: { color: diagramContainerConfig.backgroundColor },
    });
    diagramContainerGraphic.fillRoundedRect(
      diagramContainerConfig.x,
      diagramContainerConfig.y,
      diagramContainerConfig.width,
      diagramContainerConfig.height,
      diagramContainerConfig.borderRadius
    );
  };

  ///////////////////////// PLAYGROUND SECTION /////////////////////////
  //////////  PLAYGROUND CONTAINER  //////////
  createPlaygroundContainer = (): void => {
    const playgroundGraphic = this.diagramScene.add.graphics({
      fillStyle: { color: playgroundContainerConfig.backgroundColor },
    });
    playgroundGraphic.fillRoundedRect(
      playgroundContainerConfig.x,
      playgroundContainerConfig.y,
      playgroundContainerConfig.size,
      playgroundContainerConfig.size,
      playgroundContainerConfig.borderRadius
    );

    const playgroundTileGraphic = this.diagramScene.add.graphics({
      lineStyle: {
        width: playgroundTileConfig.lineWidth,
        color: playgroundTileConfig.lineColor,
        alpha: playgroundTileConfig.lineColorAlpha,
      },
    });
    for (let i = 1; i < 10; i++) {
      playgroundTileGraphic.lineBetween(
        i * playgroundTileConfig.size + 30,
        90,
        i * playgroundTileConfig.size + 30,
        playgroundContainerConfig.size + 90
      ); // Vertical line
      playgroundTileGraphic.lineBetween(
        30,
        i * playgroundTileConfig.size + 90,
        playgroundContainerConfig.size + 30,
        i * playgroundTileConfig.size + 90
      ); // Horizontal line
    }
  };
  //////////  BACK BUTTON (PLAYGROUND)  //////////
  createBackButton = (selectedLevel?: number): void => {
    const backButton = this.diagramScene.add
      .image(backButtonConfig.x, backButtonConfig.y, backButtonConfig.texture)
      .setInteractive();
    backButton.on('pointerover', () => {
      backButton.setTexture(backButtonConfig.selectedTexture);
    });
    backButton.on('pointerout', () => {
      backButton.setTexture(backButtonConfig.texture);
    });
    backButton.on('pointerdown', () => {
      this.diagramScene.sound.play('backButtonSound');
      this.diagramScene.popupWindow = new PopupWindow(
        this.diagramScene,
        'smBack',
        `" Would you like to return to \n   the menu? "`,
        true
      );
      this.diagramScene.popupWindow.create();
      this.diagramScene.add.existing(this.diagramScene.popupWindow);

      this.diagramScene.events.on('popupResponse', (response: boolean) => {
        if (response) {
          this.diagramScene.cameras.main.fadeOut(
            500,
            0,
            0,
            0,
            (_: any, progress: number) => {
              if (progress === 1) {
                this.diagramScene.sound.stopAll(); // BGM STOP

                if (this.diagramScene.scene.isActive('DiagramScene')) {
                  this.diagramScene.scene.stop('DiagramScene');
                }

                this.diagramScene.missionManager.cleanUpDiagramScene();

                this.diagramScene.scene.launch('GameScene', {
                  level: selectedLevel,
                  isFromDiagramScene: true,
                });
              }
            }
          );
        } else {
          return;
        }
      });
    });
  };
  //////////  RESET BUTTON (PLAYGROUND)  //////////
  createResetButton = (): void => {
    const backButton = this.diagramScene.add
      .image(
        resetButtonConfig.x,
        resetButtonConfig.y,
        resetButtonConfig.texture
      )
      .setInteractive();
    backButton.on('pointerover', () => {
      backButton.setTexture(resetButtonConfig.selectedTexture);
    });
    backButton.on('pointerout', () => {
      backButton.setTexture(resetButtonConfig.texture);
    });
    backButton.on('pointerdown', () => {
      this.diagramScene.sound.stopAll(); // BGM STOP

      this.diagramScene.missionManager.cleanUpDiagramScene();

      this.diagramScene.scene.restart();
    });
  };

  private resetDiagramScene(): void {
    this.diagramScene.missionManager.cleanUpDiagramScene();
    this.diagramScene.scene.restart();
  }
  //////////  STAGE LABEL (PLAYGROUND)  //////////
  createStageLabel = (level: number, mission: number): void => {
    const stageLabel = this.diagramScene.add.text(
      stageLabelConfig.x,
      stageLabelConfig.y,
      `Stage ${level ? level : ''}-${mission ? mission : ''}`,
      {
        fontSize: stageLabelConfig.fontSize,
        fontFamily: stageLabelConfig.fontFamily,
        color: stageLabelConfig.color,
      }
    );
    stageLabel.setFontStyle('bold');
  };
  //////////  INFO BUTTON FOR MISSON (PLAYGROUND)  //////////
  createInfoButton = (): void => {
    const infoButton = this.diagramScene.add
      .image(infoButtonConfig.x, infoButtonConfig.y, infoButtonConfig.texture)
      .setInteractive();
    infoButton.on('pointerover', () => {
      infoButton.setTexture(infoButtonConfig.selectedTexture);
    });
    infoButton.on('pointerout', () => {
      infoButton.setTexture(infoButtonConfig.texture);
    });

    infoButton.on('pointerdown', (): void => {
      if (!this.diagramScene.getIsMissionInfoOn) {
        // this.diagramScene.missionInfoImage.setVisible(true);
        this.fadeInMissionInfo();
        this.diagramScene.setIsMissionInfoOn = true;
      } else {
        // this.diagramScene.missionInfoImage.setVisible(false);
        this.fadeOutMissionInfo();
        this.diagramScene.setIsMissionInfoOn = false;
      }
    });
  };
  //////////  INFO IMAGE FOR MISSON (PLAYGROUND)  //////////
  createMissionInfo = (
    level: number,
    mission: number
  ): Phaser.GameObjects.Image => {
    const infoImageTexture: string = `missionInfo${level}${mission}`;

    const missionInfoImg: Phaser.GameObjects.Image = this.diagramScene.add
      .image(
        this.diagramScene.cameras.main.centerX,
        this.diagramScene.cameras.main.centerY,
        infoImageTexture
      )
      .setInteractive();
    missionInfoImg.setDepth(5).setVisible(false);

    return missionInfoImg;
  };
  // FadeIn Effect for MissionInfo Image
  fadeInMissionInfo = (): void => {
    this.diagramScene.tweens.add({
      targets: this.diagramScene.missionInfoImage,
      alpha: { from: 0, to: 1 },
      duration: 300,
      ease: 'Sine.easeInOut',
      onStart: () => {
        this.diagramScene.missionInfoImage.setVisible(true);
      },
    });
  };
  // FadeOut Effect for MissionInfo Image
  fadeOutMissionInfo = (): void => {
    this.diagramScene.tweens.add({
      targets: this.diagramScene.missionInfoImage,
      alpha: { from: 1, to: 0 },
      duration: 300,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        this.diagramScene.missionInfoImage.setVisible(false);
      },
    });
  };

  //////////  PLAY BUTTON FOR SIMULATION (PLAYGROUND)  //////////
  createPlayButton = (level: number, mission: number): void => {
    const playButton = this.diagramScene.add
      .image(playButtonConfig.x, playButtonConfig.y, playButtonConfig.texture)
      .setInteractive();

    this.diagramScene.events.on('simulationEnd', () => {
      playButton.setTexture(playButtonConfig.texture);
      this.diagramScene.setIsSimulationPlaying = false;
    });

    playButton.on('pointerdown', () => {
      this.diagramScene.sound.play('buttonSound1', { volume: 0.7 });
      if (this.diagramScene.getIsSimulationPlaying) {
        playButton.setTexture(playButtonConfig.texture);
        this.diagramScene.setIsSimulationPlaying = false;
      } else {
        playButton.setTexture(playButtonConfig.selectedTexture);
        this.diagramScene.setIsSimulationPlaying = true;
      }

      const stateInputData =
        this.diagramScene.stateCircleManager.extractIdAndStateInputStateCircles();

      this.diagramScene.missionManager.simulationLoader(
        level,
        mission,
        stateInputData
      );
    });
  };
  //////////  HIGHLIGHT TOGGLE BUTTON FOR SIMULATION (PLAYGROUND)  //////////
  createHighlightToggleButton = (): void => {
    const highlightToggle = this.diagramScene.add
      .image(
        highligtToggleConfig.x,
        highligtToggleConfig.y,
        highligtToggleConfig.texture
      )
      .setInteractive();
    this.diagramScene.setIsHighlightOn = false;

    highlightToggle.on('pointerdown', () => {
      if (!this.diagramScene.getIsHighlightOn) {
        this.diagramScene.sound.play('toggleOnSound', { volume: 0.7 });
        console.log('on', this.diagramScene.getIsHighlightOn);
        highlightToggle.setTexture(highligtToggleConfig.selectedTexture);
        this.diagramScene.setIsHighlightOn = true;
      } else {
        this.diagramScene.sound.play('toggleOffSound', { volume: 0.7 });
        console.log('on', this.diagramScene.getIsHighlightOn);
        highlightToggle.setTexture(highligtToggleConfig.texture);
        this.diagramScene.setIsHighlightOn = false;
      }
    });
  };
}

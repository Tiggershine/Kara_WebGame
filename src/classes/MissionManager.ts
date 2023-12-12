import DiagramScene from '../scenes/DiagramScene';
import TaskHelper from './TaskHelper';
import TestFlight from '../tasks/TestFlight';
import TunnelFinder from '../tasks/TunnelFinder';
import ClimbingUp from '../tasks/ClimbingUp';
import BetweenWall from '../tasks/BetweenWall';
import Stars from '../tasks/Stars';
import AroundTheCorner from '../tasks/AroundTheCorner';
import TunnelFinder2 from '../tasks/TunnelFinder2';
import NazcaLine from '../tasks/NazcaLine';
import { StateInput } from './InputManager';
import { playButtonConfig } from '../configurations';

interface MissionInterface {
  checkObjectPositions(): boolean;
  getSuccessMessage(): string;
  getFailureMessage(): string;
}

export default class MissionManager {
  private diagramScene: DiagramScene;
  private missionTestFlight!: TestFlight;
  private minssionTunnelFinder!: TunnelFinder;
  private missionClimbingUp!: ClimbingUp;
  private missionBetweenWall!: BetweenWall;
  private missionStars!: Stars;
  private missionAroundTheCorner!: AroundTheCorner;
  private missionTunnelFinder2!: TunnelFinder2;
  private missionNazcaLine!: NazcaLine;

  bgmKeys = [
    'softGameBGM',
    'softGameBGM2',
    'ecxiteGameBGM',
    'ecxiteGameBGM2',
    'ecxiteGameBGM3',
    'joyGameBGM',
  ]; // 사용할 BGM 키들

  constructor(diagaramScene: DiagramScene) {
    this.diagramScene = diagaramScene;
  }

  playRandomBGM() {
    // const bgmKeys = [
    //   'softGameBGM',
    //   'softGameBGM2',
    //   'ecxiteGameBGM',
    //   'ecxiteGameBGM2',
    //   'ecxiteGameBGM3',
    //   'joyGameBGM',
    // ]; // 사용할 BGM 키들
    const randomIndex = Math.floor(Math.random() * this.bgmKeys.length);
    const selectedBGM = this.bgmKeys[randomIndex];
    // this.diagramScene.setSelectedBGM = selectedBGM;

    this.diagramScene.sound.play(selectedBGM, { volume: 0.2, loop: true });
  }

  // Mission Loader according to level & mission
  missionLoader = (level: number, mission: number): void => {
    this.playRandomBGM();

    switch (level) {
      case 1:
        switch (mission) {
          case 1:
            this.missionTestFlight = new TestFlight(
              this.diagramScene,
              playButtonConfig.x,
              playButtonConfig.y
            );
            // this.missionTestFlight.playBGM();
            break;
          case 2:
            this.minssionTunnelFinder = new TunnelFinder(
              this.diagramScene,
              playButtonConfig.x,
              playButtonConfig.y
            );
            break;
          case 3:
            this.missionClimbingUp = new ClimbingUp(
              this.diagramScene,
              playButtonConfig.x,
              playButtonConfig.y
            );
            break;
          case 4:
            this.missionBetweenWall = new BetweenWall(
              this.diagramScene,
              playButtonConfig.x,
              playButtonConfig.y
            );
            break;
        }
        break;
      case 2:
        switch (mission) {
          case 1:
            this.missionStars = new Stars(
              this.diagramScene,
              playButtonConfig.x,
              playButtonConfig.y
            );
            break;
          case 2:
            this.missionAroundTheCorner = new AroundTheCorner(
              this.diagramScene,
              playButtonConfig.x,
              playButtonConfig.y
            );
            break;
          case 3:
            this.missionTunnelFinder2 = new TunnelFinder2(
              this.diagramScene,
              playButtonConfig.x,
              playButtonConfig.y
            );
            break;
        }
        break;
      case 3:
        switch (mission) {
          case 1:
            this.missionNazcaLine = new NazcaLine(
              this.diagramScene,
              playButtonConfig.x,
              playButtonConfig.y
            );
            break;
        }
        break;
      default:
        this.missionTestFlight = new TestFlight(
          this.diagramScene,
          playButtonConfig.x,
          playButtonConfig.y
        );
        break;
    }
  };

  simulationLoader = (
    level: number,
    mission: number,
    stateInputData: { id: number; stateInputs: StateInput[] }[]
  ) => {
    switch (level) {
      case 1:
        switch (mission) {
          case 1:
            if (this.missionTestFlight) {
              if (this.diagramScene.getIsMissionInitiated) {
                this.missionTestFlight.restartSimulation(
                  stateInputData,
                  this.diagramScene.getIsHighlightOn
                );
              } else {
                this.missionTestFlight.startSimulation(
                  stateInputData,
                  this.diagramScene.getIsHighlightOn
                );
                this.diagramScene.setIsMissionInitiated = true;
              }
              break;
            } else {
              console.log('Mission is not loaded yet.');
              break;
            }
          case 2:
            if (this.minssionTunnelFinder) {
              if (this.diagramScene.getIsMissionInitiated) {
                this.minssionTunnelFinder.restartSimulation(
                  stateInputData,
                  this.diagramScene.getIsHighlightOn
                );
              } else {
                this.minssionTunnelFinder.startSimulation(
                  stateInputData,
                  this.diagramScene.getIsHighlightOn
                );
                this.diagramScene.setIsMissionInitiated = true;
              }
              break;
            } else {
              console.log('Mission is not loaded yet.');
              break;
            }
          case 3:
            if (this.missionClimbingUp) {
              if (this.diagramScene.getIsMissionInitiated) {
                this.missionClimbingUp.restartSimulation(
                  stateInputData,
                  this.diagramScene.getIsHighlightOn
                );
              } else {
                this.missionClimbingUp.startSimulation(
                  stateInputData,
                  this.diagramScene.getIsHighlightOn
                );
                this.diagramScene.setIsMissionInitiated = true;
              }
              break;
            } else {
              console.log('Mission is not loaded yet.');
              break;
            }
          case 4:
            if (this.missionBetweenWall) {
              if (this.diagramScene.getIsMissionInitiated) {
                this.missionBetweenWall.restartSimulation(
                  stateInputData,
                  this.diagramScene.getIsHighlightOn
                );
              } else {
                this.missionBetweenWall.startSimulation(
                  stateInputData,
                  this.diagramScene.getIsHighlightOn
                );
                this.diagramScene.setIsMissionInitiated = true;
              }
              break;
            } else {
              console.log('Mission is not loaded yet.');
              break;
            }
        }
        break;
      case 2:
        switch (mission) {
          case 1:
            if (this.missionStars) {
              console.log('Restart Simulation');
              if (this.diagramScene.getIsMissionInitiated) {
                this.missionStars.restartSimulation(
                  stateInputData,
                  this.diagramScene.getIsHighlightOn
                );
              } else {
                console.log('New Simulation');
                this.missionStars.startSimulation(
                  stateInputData,
                  this.diagramScene.getIsHighlightOn
                );
                this.diagramScene.setIsMissionInitiated = true;
              }
              break;
            } else {
              console.log('Mission is not loaded yet.');
              break;
            }
          case 2:
            if (this.missionAroundTheCorner) {
              if (this.diagramScene.getIsMissionInitiated) {
                this.missionAroundTheCorner.restartSimulation(
                  stateInputData,
                  this.diagramScene.getIsHighlightOn
                );
              } else {
                this.missionAroundTheCorner.startSimulation(
                  stateInputData,
                  this.diagramScene.getIsHighlightOn
                );
                this.diagramScene.setIsMissionInitiated = true;
              }
              break;
            } else {
              console.log('Mission is not loaded yet.');
              break;
            }
          case 3:
            if (this.missionTunnelFinder2) {
              if (this.diagramScene.getIsMissionInitiated) {
                this.missionTunnelFinder2.restartSimulation(
                  stateInputData,
                  this.diagramScene.getIsHighlightOn
                );
              } else {
                this.missionTunnelFinder2.startSimulation(
                  stateInputData,
                  this.diagramScene.getIsHighlightOn
                );
                this.diagramScene.setIsMissionInitiated = true;
              }
              break;
            } else {
              console.log('Mission is not loaded yet.');
              break;
            }
        }
        break;
      case 3:
        switch (mission) {
          case 1:
            if (this.missionNazcaLine) {
              if (this.diagramScene.getIsMissionInitiated) {
                this.missionNazcaLine.restartSimulation(
                  stateInputData,
                  this.diagramScene.getIsHighlightOn
                );
              } else {
                this.missionNazcaLine.startSimulation(
                  stateInputData,
                  this.diagramScene.getIsHighlightOn
                );
                this.diagramScene.setIsMissionInitiated = true;
              }
              break;
            } else {
              console.log('Mission is not loaded yet.');
              break;
            }
        }
        break;
    }
  };

  // Function for Back button on Diagram Scene
  transitionToSubMenuScene = (selectedLevel?: number): void => {
    this.cleanUpDiagramScene();

    if (selectedLevel) {
      this.diagramScene.scene.launch('SubMenuScene', { level: selectedLevel });
    }
    this.diagramScene.scene.launch('SubMenuScene');
  };

  // Clean up the Diagram Scene(destroy all ch  anged elements) used for Back button or Reset button
  cleanUpDiagramScene(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.diagramScene.cleanup();

      if (this.diagramScene.scene.isActive('DiagramScene')) {
        this.diagramScene.scene.stop('DiagramScene');
      }
      resolve();
    });
  }
}

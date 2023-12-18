import DiagramScene from '../scenes/DiagramScene';
import TaskHelper from './TaskHelper';
import TestFlight from '../tasks/TestFlight';
import TunnelFinder from '../tasks/TunnelFinder';
import ClimbingUp from '../tasks/ClimbingUp';
import BetweenWall from '../tasks/BetweenWall';
import Stars from '../tasks/Stars';
import AroundTheCorner from '../tasks/AroundTheCorner';
import TunnelFinder2 from '../tasks/TunnelFinder2';
import Labyrinth from '../tasks/Labyrinth';
import NazcaLine from '../tasks/NazcaLine';
import ReversePicture from '../tasks/ReversePicture';
import { StateInput } from './InputManager';
import { playButtonConfig } from '../configurations';

interface MissionInterface {
  checkObjectPositions(): boolean;
  getSuccessMessage(): string;
  getFailureMessage(): string;
}

interface MissionClasses {
  [key: string]: {
    [key: string]: new (...args: any[]) => any;
  };
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
  private missionLabyrinth!: Labyrinth;
  private missionNazcaLine!: NazcaLine;
  private missionReversePicture!: ReversePicture;
  // 레벨과 미션에 따른 미션 클래스 맵
  private missionClassMap: MissionClasses = {
    1: {
      1: TestFlight,
      2: TunnelFinder,
      3: ClimbingUp,
      4: BetweenWall,
    },
    2: {
      1: Stars,
      2: AroundTheCorner,
      3: TunnelFinder2,
      4: Labyrinth,
    },
    3: {
      1: NazcaLine,
      2: ReversePicture,
    },
  };
  private missions: Map<string, any> = new Map();

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

  // 미션 객체 생성을 위한 함수
  private createMission(level: number, mission: number) {
    const MissionClass = this.missionClassMap[level]?.[mission];
    if (MissionClass) {
      return new MissionClass(
        this.diagramScene,
        playButtonConfig.x,
        playButtonConfig.y
      );
    } else {
      console.log('Invalid level or mission number.');
      return null;
    }
  }

  // 미션 로더 함수
  missionLoader = (level: number, mission: number): void => {
    this.playRandomBGM();
    const missionInstance = this.createMission(level, mission);
    if (missionInstance) {
      this.missions.set(`mission${level}_${mission}`, missionInstance);
    }
  };

  // 시뮬레이션 로더 함수
  simulationLoader = (
    level: number,
    mission: number,
    stateInputData: { id: number; stateInputs: StateInput[] }[]
  ): void => {
    const missionKey = `mission${level}_${mission}`;
    const missionInstance = this.missions.get(missionKey);
    if (missionInstance) {
      if (this.diagramScene.getIsMissionInitiated) {
        missionInstance.restartSimulation(
          stateInputData,
          this.diagramScene.getIsHighlightOn
        );
      } else {
        missionInstance.startSimulation(
          stateInputData,
          this.diagramScene.getIsHighlightOn
        );
        this.diagramScene.setIsMissionInitiated = true;
      }
    } else {
      console.log('Mission is not loaded yet.');
    }
  };

  // Mission Loader according to level & mission
  // missionLoader = (level: number, mission: number): void => {
  //   this.playRandomBGM();

  //   switch (level) {
  //     case 1:
  //       switch (mission) {
  //         case 1:
  //           this.missionTestFlight = new TestFlight(
  //             this.diagramScene,
  //             playButtonConfig.x,
  //             playButtonConfig.y
  //           );
  //           break;
  //         case 2:
  //           this.minssionTunnelFinder = new TunnelFinder(
  //             this.diagramScene,
  //             playButtonConfig.x,
  //             playButtonConfig.y
  //           );
  //           break;
  //         case 3:
  //           this.missionClimbingUp = new ClimbingUp(
  //             this.diagramScene,
  //             playButtonConfig.x,
  //             playButtonConfig.y
  //           );
  //           break;
  //         case 4:
  //           this.missionBetweenWall = new BetweenWall(
  //             this.diagramScene,
  //             playButtonConfig.x,
  //             playButtonConfig.y
  //           );
  //           break;
  //       }
  //       break;
  //     case 2:
  //       switch (mission) {
  //         case 1:
  //           this.missionStars = new Stars(
  //             this.diagramScene,
  //             playButtonConfig.x,
  //             playButtonConfig.y
  //           );
  //           break;
  //         case 2:
  //           this.missionAroundTheCorner = new AroundTheCorner(
  //             this.diagramScene,
  //             playButtonConfig.x,
  //             playButtonConfig.y
  //           );
  //           break;
  //         case 3:
  //           this.missionTunnelFinder2 = new TunnelFinder2(
  //             this.diagramScene,
  //             playButtonConfig.x,
  //             playButtonConfig.y
  //           );
  //           break;
  //         case 4:
  //           this.missionLabyrinth = new Labyrinth(
  //             this.diagramScene,
  //             playButtonConfig.x,
  //             playButtonConfig.y
  //           );
  //           break;
  //       }
  //       break;
  //     case 3:
  //       switch (mission) {
  //         case 1:
  //           this.missionNazcaLine = new NazcaLine(
  //             this.diagramScene,
  //             playButtonConfig.x,
  //             playButtonConfig.y
  //           );
  //           break;
  //         case 2:
  //           this.missionReversePicture = new ReversePicture(
  //             this.diagramScene,
  //             playButtonConfig.x,
  //             playButtonConfig.y
  //           );
  //           break;
  //       }
  //       break;
  //     default:
  //       this.missionTestFlight = new TestFlight(
  //         this.diagramScene,
  //         playButtonConfig.x,
  //         playButtonConfig.y
  //       );
  //       break;
  //   }
  // };

  // simulationLoader = (
  //   level: number,
  //   mission: number,
  //   stateInputData: { id: number; stateInputs: StateInput[] }[]
  // ) => {
  //   switch (level) {
  //     case 1:
  //       switch (mission) {
  //         case 1:
  //           if (this.missionTestFlight) {
  //             if (this.diagramScene.getIsMissionInitiated) {
  //               this.missionTestFlight.restartSimulation(
  //                 stateInputData,
  //                 this.diagramScene.getIsHighlightOn
  //               );
  //             } else {
  //               this.missionTestFlight.startSimulation(
  //                 stateInputData,
  //                 this.diagramScene.getIsHighlightOn
  //               );
  //               this.diagramScene.setIsMissionInitiated = true;
  //             }
  //             break;
  //           } else {
  //             console.log('Mission is not loaded yet.');
  //             break;
  //           }
  //         case 2:
  //           if (this.minssionTunnelFinder) {
  //             if (this.diagramScene.getIsMissionInitiated) {
  //               this.minssionTunnelFinder.restartSimulation(
  //                 stateInputData,
  //                 this.diagramScene.getIsHighlightOn
  //               );
  //             } else {
  //               this.minssionTunnelFinder.startSimulation(
  //                 stateInputData,
  //                 this.diagramScene.getIsHighlightOn
  //               );
  //               this.diagramScene.setIsMissionInitiated = true;
  //             }
  //             break;
  //           } else {
  //             console.log('Mission is not loaded yet.');
  //             break;
  //           }
  //         case 3:
  //           if (this.missionClimbingUp) {
  //             if (this.diagramScene.getIsMissionInitiated) {
  //               this.missionClimbingUp.restartSimulation(
  //                 stateInputData,
  //                 this.diagramScene.getIsHighlightOn
  //               );
  //             } else {
  //               this.missionClimbingUp.startSimulation(
  //                 stateInputData,
  //                 this.diagramScene.getIsHighlightOn
  //               );
  //               this.diagramScene.setIsMissionInitiated = true;
  //             }
  //             break;
  //           } else {
  //             console.log('Mission is not loaded yet.');
  //             break;
  //           }
  //         case 4:
  //           if (this.missionBetweenWall) {
  //             if (this.diagramScene.getIsMissionInitiated) {
  //               this.missionBetweenWall.restartSimulation(
  //                 stateInputData,
  //                 this.diagramScene.getIsHighlightOn
  //               );
  //             } else {
  //               this.missionBetweenWall.startSimulation(
  //                 stateInputData,
  //                 this.diagramScene.getIsHighlightOn
  //               );
  //               this.diagramScene.setIsMissionInitiated = true;
  //             }
  //             break;
  //           } else {
  //             console.log('Mission is not loaded yet.');
  //             break;
  //           }
  //       }
  //       break;
  //     case 2:
  //       switch (mission) {
  //         case 1:
  //           if (this.missionStars) {
  //             console.log('Restart Simulation');
  //             if (this.diagramScene.getIsMissionInitiated) {
  //               this.missionStars.restartSimulation(
  //                 stateInputData,
  //                 this.diagramScene.getIsHighlightOn
  //               );
  //             } else {
  //               console.log('New Simulation');
  //               this.missionStars.startSimulation(
  //                 stateInputData,
  //                 this.diagramScene.getIsHighlightOn
  //               );
  //               this.diagramScene.setIsMissionInitiated = true;
  //             }
  //             break;
  //           } else {
  //             console.log('Mission is not loaded yet.');
  //             break;
  //           }
  //         case 2:
  //           if (this.missionAroundTheCorner) {
  //             if (this.diagramScene.getIsMissionInitiated) {
  //               this.missionAroundTheCorner.restartSimulation(
  //                 stateInputData,
  //                 this.diagramScene.getIsHighlightOn
  //               );
  //             } else {
  //               this.missionAroundTheCorner.startSimulation(
  //                 stateInputData,
  //                 this.diagramScene.getIsHighlightOn
  //               );
  //               this.diagramScene.setIsMissionInitiated = true;
  //             }
  //             break;
  //           } else {
  //             console.log('Mission is not loaded yet.');
  //             break;
  //           }
  //         case 3:
  //           if (this.missionTunnelFinder2) {
  //             if (this.diagramScene.getIsMissionInitiated) {
  //               this.missionTunnelFinder2.restartSimulation(
  //                 stateInputData,
  //                 this.diagramScene.getIsHighlightOn
  //               );
  //             } else {
  //               this.missionTunnelFinder2.startSimulation(
  //                 stateInputData,
  //                 this.diagramScene.getIsHighlightOn
  //               );
  //               this.diagramScene.setIsMissionInitiated = true;
  //             }
  //             break;
  //           } else {
  //             console.log('Mission is not loaded yet.');
  //             break;
  //           }
  //         case 4:
  //           if (this.missionLabyrinth) {
  //             if (this.diagramScene.getIsMissionInitiated) {
  //               this.missionLabyrinth.restartSimulation(
  //                 stateInputData,
  //                 this.diagramScene.getIsHighlightOn
  //               );
  //             } else {
  //               this.missionLabyrinth.startSimulation(
  //                 stateInputData,
  //                 this.diagramScene.getIsHighlightOn
  //               );
  //               this.diagramScene.setIsMissionInitiated = true;
  //             }
  //             break;
  //           } else {
  //             console.log('Mission is not loaded yet.');
  //             break;
  //           }
  //       }
  //       break;
  //     case 3:
  //       switch (mission) {
  //         case 1:
  //           if (this.missionNazcaLine) {
  //             if (this.diagramScene.getIsMissionInitiated) {
  //               this.missionNazcaLine.restartSimulation(
  //                 stateInputData,
  //                 this.diagramScene.getIsHighlightOn
  //               );
  //             } else {
  //               this.missionNazcaLine.startSimulation(
  //                 stateInputData,
  //                 this.diagramScene.getIsHighlightOn
  //               );
  //               this.diagramScene.setIsMissionInitiated = true;
  //             }
  //             break;
  //           } else {
  //             console.log('Mission is not loaded yet.');
  //             break;
  //           }
  //         case 2:
  //           if (this.missionReversePicture) {
  //             if (this.diagramScene.getIsMissionInitiated) {
  //               this.missionReversePicture.restartSimulation(
  //                 stateInputData,
  //                 this.diagramScene.getIsHighlightOn
  //               );
  //             } else {
  //               this.missionReversePicture.startSimulation(
  //                 stateInputData,
  //                 this.diagramScene.getIsHighlightOn
  //               );
  //               this.diagramScene.setIsMissionInitiated = true;
  //             }
  //             break;
  //           } else {
  //             console.log('Mission is not loaded yet.');
  //             break;
  //           }
  //       }
  //       break;
  //   }
  // };

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

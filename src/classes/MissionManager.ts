import DiagramScene from '../scenes/DiagramScene';
import Stars from '../tasks/Stars';
import StarFindInForest from '../tasks/StarFindInForest';
import TunnelFinder from '../tasks/TunnelFinder';
import { StateInput } from './InputManager';
import { playButtonConfig } from '../configurations';

export default class MissionManager {
  private diagramScene: DiagramScene;
  private missionStars!: Stars;
  private missionStarFindInForest!: StarFindInForest;
  private minssionTunnelFinder!: TunnelFinder;

  constructor(diagaramScene: DiagramScene) {
    this.diagramScene = diagaramScene;
  }

  // Mission Loader according to level & mission
  missionLoader = (level: number, mission: number): void => {
    switch (level) {
      case 1:
        switch (mission) {
          case 1:
            this.missionStars = new Stars(
              this.diagramScene,
              playButtonConfig.x,
              playButtonConfig.y
            );
            break;
          case 2:
            this.missionStarFindInForest = new StarFindInForest(
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
            this.minssionTunnelFinder = new TunnelFinder(
              this.diagramScene,
              playButtonConfig.x,
              playButtonConfig.y
            );
            break;
        }
        break;
      default:
        this.missionStarFindInForest = new StarFindInForest(
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
            if (this.missionStars) {
              if (this.diagramScene.getIsMissionInitiated) {
                this.missionStars.restartSimulation(
                  stateInputData,
                  this.diagramScene.getIsHighlightOn
                );
              } else {
                this.missionStars.processStateInputData(
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
            if (this.missionStarFindInForest) {
              if (this.diagramScene.getIsMissionInitiated) {
                this.missionStarFindInForest.restartSimulation(
                  stateInputData,
                  this.diagramScene.getIsHighlightOn
                );
              } else {
                this.missionStarFindInForest.processStateInputData(
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
      case 2:
        switch (mission) {
          case 1:
            if (this.minssionTunnelFinder) {
              if (this.diagramScene.getIsMissionInitiated) {
                this.minssionTunnelFinder.restartSimulation(
                  stateInputData,
                  this.diagramScene.getIsHighlightOn
                );
              } else {
                this.minssionTunnelFinder.processStateInputData(
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

  // Clean up the Diagram Scene(destroy all changed elements) used for Back button or Reset button
  cleanUpDiagramScene = (): void => {
    this.diagramScene.cleanup();

    if (this.diagramScene.scene.isActive('DiagramScene')) {
      this.diagramScene.scene.stop('DiagramScene');
    }
  };
}

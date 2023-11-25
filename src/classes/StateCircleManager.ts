import Phaser from 'phaser';
import DiagramScene from '../scenes/DiagramScene';
import StateCircle from './StateCircle';
import { InputLabel } from './InputLabel';
import { StateInput } from '../classes/InputManager';

export default class StateCircleManager {
  private diagramScene: DiagramScene;

  constructor(diagramScene: DiagramScene) {
    this.diagramScene = diagramScene;
  }

  // Find StateCircle by id
  getStateCircleById = (id: number): StateCircle => {
    const circle = this.diagramScene.stateCircles.find(
      (circle) => circle.id === id
    );
    if (!circle) {
      throw new Error(`StateCircle with id ${id} not found`);
    }
    return circle;
  };

  // Find InputLabel by id
  getInputLabelById = (id: number): InputLabel => {
    const label = this.diagramScene.inputLabels.find(
      (label) => label.getId === id
    );
    if (!label) {
      throw new Error(`InputLabel with id ${id} not found`);
    }
    return label;
  };

  extractIdAndStateInputStateCircles = (): {
    id: number;
    stateInputs: StateInput[];
  }[] => {
    let newStateCircles: { id: number; stateInputs: StateInput[] }[] = [];

    newStateCircles = this.diagramScene.stateCircles.map((stateCircle) => ({
      id: stateCircle.id,
      stateInputs: stateCircle.stateInputs,
    }));

    return newStateCircles;
  };

  // Find StateCircle by id => CHANGE name of the StateCircle && the correspondent InputLabel
  updateStateCircleNameById = (id: number, newName: string): void => {
    // stateCircles 배열에서 id에 해당하는 StateCircle 객체 찾기
    const stateCircle = this.diagramScene.stateCircles.find(
      (circle) => circle.getId === id
    );
    if (stateCircle) {
      // StateCircle 객체의 이름 변경
      stateCircle.setName(newName);
    }

    // inputLabels 배열에서 id에 해당하는 InputLabel 객체 찾기
    const inputLabel = this.diagramScene.inputLabels.find(
      (label) => label.getId === id
    );
    if (inputLabel) {
      // InputLabel 객체의 텍스트 변경
      inputLabel.setLabelText = newName;
    }

    console.log(
      '(DiagramScene.ts)',
      'stateCircles: ',
      this.diagramScene.stateCircles,
      'inputLables: ',
      this.diagramScene.inputLabels
    );
    // // Event emit -> stateCircle: { id, name } emit
    this.diagramScene.events.emit(
      'updatedStateCircles',
      this.diagramScene.stateCircles.map((stateCircle) => {
        // TODO: DELETE TEST CODE
        // console.log('(DiagramScene.ts) stateCircles: ', stateCircle);
        return {
          id: stateCircle.getId,
          name: stateCircle.getName,
        };
      })
    );
  };

  // Find StateCircle by id => DELETE the StateCircle && InputLable && Edge
  public deleteStateCircleById = (id: number): void => {
    // StateCircle 찾기
    const circleToDelete =
      this.diagramScene.stateCircleManager.getStateCircleById(id);
    if (!circleToDelete) {
      console.error('StateCircle not found with id:', id);
      return;
    }
    // edge로 연결된 StateCircles 찾기
    const connectedCircles = this.diagramScene.getStateCircles.filter(
      (circle) =>
        circle.edges.some(
          (edge) =>
            edge.data.get('startCircle') === circleToDelete ||
            edge.data.get('endCircle') === circleToDelete
        )
    );
    // 삭제할 StateCircle의 모든 에지 제거
    if (circleToDelete) {
      circleToDelete.edges.forEach((edge) => {
        if (edge) {
          edge.destroy();
        }
      });
      circleToDelete.destroy();
    }

    // 연결된 StateCircle들의 에지 업데이트
    connectedCircles.forEach((circle) => circle.updateEdges());

    this.diagramScene.stateCircles = this.diagramScene.stateCircles.filter(
      (circle) => circle.getId !== id
    );
    if (circleToDelete) {
      circleToDelete.destroy();
    }

    const inputLabelToDelete =
      this.diagramScene.stateCircleManager.getInputLabelById(id);
    this.diagramScene.inputLabels = this.diagramScene.inputLabels.filter(
      (inputLabel) => inputLabel.getId !== id
    );
    if (inputLabelToDelete) {
      inputLabelToDelete?.destroy();
    }

    this.diagramScene.uiManager.addLabels();

    console.log(
      '(DiagramScene.ts',
      'StateCircles: ',
      this.diagramScene.stateCircles,
      'InputLabels: ',
      this.diagramScene.inputLabels
    );
  };

  // Find StateCircle by id => UPDATE StateInput of the StateCircle
  updateStateCircleInputs(id: number, newInputs: StateInput[]) {
    const stateCircle = this.diagramScene.getStateCircles.find(
      (circle) => circle.id === id
    );
    if (stateCircle) {
      stateCircle.stateInputs = newInputs;
      console.log(
        '(StateCircleManager.ts) stateCircles: ',
        this.diagramScene.stateCircles
      );

      this.diagramScene.uiManager.createEdgesForStateCircles();

      // Emit an event with the updated state inputs
      this.diagramScene.scene
        .get('PlaygroundScene')
        .events.emit('stateInputDataUpdated', this.diagramScene.stateCircles);
    }
  }
}

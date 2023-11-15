import Phaser from 'phaser';

const conditionInputPoints = [
  { key: '11', x: 580, y: 490 },
  { key: '12', x: 630, y: 490 },
  { key: '13', x: 680, y: 490 },
  { key: '14', x: 730, y: 490 },
  { key: '21', x: 580, y: 555 },
  { key: '22', x: 630, y: 555 },
  { key: '23', x: 680, y: 555 },
  { key: '24', x: 730, y: 555 },
  { key: '31', x: 580, y: 620 },
  { key: '32', x: 630, y: 620 },
  { key: '33', x: 680, y: 620 },
  { key: '34', x: 730, y: 620 },
  { key: '41', x: 580, y: 685 },
  { key: '42', x: 630, y: 685 },
  { key: '43', x: 680, y: 685 },
  { key: '44', x: 730, y: 685 },
  { key: '51', x: 580, y: 750 },
  { key: '52', x: 630, y: 750 },
  { key: '53', x: 680, y: 750 },
  { key: '54', x: 730, y: 750 },
];

const moveInputPoints = [
  { key: '15', x: 785, y: 490 },
  { key: '16', x: 835, y: 490 },
  { key: '17', x: 885, y: 490 },
  { key: '18', x: 935, y: 490 },
  { key: '25', x: 785, y: 555 },
  { key: '26', x: 835, y: 555 },
  { key: '27', x: 885, y: 555 },
  { key: '28', x: 935, y: 555 },
  { key: '35', x: 785, y: 620 },
  { key: '36', x: 835, y: 620 },
  { key: '37', x: 885, y: 620 },
  { key: '38', x: 935, y: 620 },
  { key: '45', x: 785, y: 685 },
  { key: '46', x: 835, y: 685 },
  { key: '47', x: 885, y: 685 },
  { key: '48', x: 935, y: 685 },
  { key: '55', x: 785, y: 750 },
  { key: '56', x: 835, y: 750 },
  { key: '57', x: 885, y: 750 },
  { key: '58', x: 935, y: 750 },
];

const nextStatePoints = [
  { key: '19', x: 1005, y: 488 },
  { key: '29', x: 1005, y: 553 },
  { key: '39', x: 1005, y: 618 },
  { key: '49', x: 1005, y: 683 },
  { key: '59', x: 1005, y: 748 },
];

const stateInputData = [
  // {
  //   id: 0,
  //   stateInputs: [{ sensorChecks: [], moves: [], nextStateId: 1 }],
  // },
  {
    id: 1, // bottomStar
    stateInputs: [
      {
        sensorChecks: [{ sensor: 4, condition: 0 }], // 아래에 별 있으면
        moves: [7], // pickStar
        nextStateId: 2,
      },
      {
        sensorChecks: [{ sensor: 4, condition: 1 }], // 아래에 별 없으면
        moves: [6], // putStar
        nextStateId: 2,
      },
    ],
  },
  {
    id: 2, // frontWall
    stateInputs: [
      {
        sensorChecks: [{ sensor: 0, condition: 1 }], // 벽 앞 X
        moves: [3], // forward
        nextStateId: 1,
      },
      {
        sensorChecks: [{ sensor: 0, condition: 0 }], // 벽 앞 O
        moves: [],
        nextStateId: 100, // stop
      },
    ],
  },
  {
    id: 100,
    stateInputs: [{ sensorChecks: [], moves: [], nextStateId: 101 }],
  },
];

class SimulationHighlight extends Phaser.GameObjects.Image {
  constructor(scene: Phaser.Scene, texture: string) {
    // super(scene, 0, 0, texture);
    super(scene, 0, 0, 'inputHighlight');
    scene.add.existing(this);
    this.setVisible(false);
    this.setDepth(100);
  }

  async processStateInputData() {
    for (const stateInput of stateInputData) {
      for (let i = 0; i < stateInput.stateInputs.length; i++) {
        const input = stateInput.stateInputs[i];
        // const prefix = stateInput.id.toString();
        const prefix = (i + 1).toString();
        console.log('input: ', input, 'prefix: ', prefix);

        // Process sensorChecks
        for (let j = 0; j < input.sensorChecks.length; j++) {
          // const sensorCheck = input.sensorChecks[j];
          const key = prefix + (j + 1).toString();
          const point = conditionInputPoints.find((p) => p.key === key);
          if (point) {
            console.log('condition point: ', point, '좌표:', point.x, point.y);
            await this.moveImageTo(point.x, point.y);
          }
        }

        // Process moves
        for (let j = 0; j < input.moves.length; j++) {
          const move = input.moves[j];
          const key = prefix + (j + 5).toString();
          const point = moveInputPoints.find((p) => p.key === key);
          if (point) {
            console.log('move point: ', point, '좌표:', point.x, point.y);
            await this.moveImageTo(point.x, point.y);
          }
        }

        // Process nextState
        const nextStateKey = prefix + '9';
        const nextStatePoint = nextStatePoints.find(
          (p) => p.key === nextStateKey
        );
        if (nextStatePoint) {
          console.log(
            'nextStatePoint: ',
            nextStatePoint,
            '좌표:',
            nextStatePoint.x,
            nextStatePoint.y
          );
          await this.moveImageTo(nextStatePoint.x, nextStatePoint.y);
        }
      }
    }
  }

  moveImageTo(x: number, y: number): Promise<void> {
    return new Promise((resolve) => {
      this.showHighlight(this.x, this.y, x, y);
      this.scene.time.delayedCall(500, resolve);
    });
  }

  showHighlight(x1: number, y1: number, x2: number, y2: number) {
    this.setPosition(x1, y1);
    this.setVisible(true);

    this.scene.tweens.add({
      targets: this,
      x: x2,
      y: y2,
      duration: 500, // 이동하는데 걸리는 시간 (밀리초)
      // ease: 'Linear', // 이동하는 방식
      // onComplete: () => {
      //   this.setVisible(false);
      // },
    });
  }
}

export default SimulationHighlight;

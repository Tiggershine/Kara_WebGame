import Phaser from 'phaser';
import StateCircle from './StateCircle';
import DiagramScene from '../scenes/DiagramScene';

export default class EdgeManager {
  private diagramScene: DiagramScene;

  constructor(diagramScene: DiagramScene) {
    this.diagramScene = diagramScene;
  }

  createEdge(
    circleA: StateCircle,
    circleB: StateCircle,
    baseYOffset: number = 15
  ): Phaser.GameObjects.Graphics {
    console.log('Crate Edge btw ', circleA, ' and ', circleB);
    const edge = this.diagramScene.add.graphics();
    edge.lineStyle(2, 0x000000); // Set line style

    // Calculate the angle between the two circles
    const angle = Math.atan2(circleB.y - circleA.y, circleB.x - circleA.x);

    const radius = circleA.circle.width / 2;
    // Calculate the offset from the center of circleA to the edge point
    const offsetX_A = radius * Math.cos(angle);
    const offsetY_A = radius * Math.sin(angle);
    // Calculate the offset from the center of circleB to the edge point
    const offsetX_B = radius * Math.cos(angle + Math.PI); // Add PI to reverse direction
    const offsetY_B = radius * Math.sin(angle + Math.PI);

    // Calculate startX and startY for circleA
    const startX = circleA.x + offsetX_A + (3 / 4) * radius * Math.sin(angle);
    const startY = circleA.y + offsetY_A - (3 / 4) * radius * Math.cos(angle);
    // Calculate endX and endY for circleB
    const endX = circleB.x + offsetX_B + (3 / 4) * radius * Math.sin(angle);
    const endY = circleB.y + offsetY_B - (3 / 4) * radius * Math.cos(angle);

    edge.moveTo(startX, startY);
    edge.lineTo(endX, endY);

    // Draw arrowhead (화살표 꼭지 그리기)
    const arrowHeadLength = 10; // Adjust arrowhead size if necessary
    const arrowAngle = Math.PI / 8; // Adjust arrowhead angle for a wider arrow

    edge.moveTo(
      endX - arrowHeadLength * Math.cos(angle - arrowAngle),
      endY - arrowHeadLength * Math.sin(angle - arrowAngle)
    );
    edge.lineTo(endX, endY);
    edge.lineTo(
      endX - arrowHeadLength * Math.cos(angle + arrowAngle),
      endY - arrowHeadLength * Math.sin(angle + arrowAngle)
    );

    edge.strokePath(); // Draw the line and arrowhead
    edge.setDepth(1);
    // Initialize the data manager for the edge if it doesn't exist
    edge.setDataEnabled();

    // Store references to the connected circles in the edge's data
    edge.data.set('startCircle', circleA);
    edge.data.set('endCircle', circleB);

    // Store the edge in both circles' edges array for updating later
    circleA.edges.push(edge);
    circleB.edges.push(edge);

    return edge; // Return the edge so it can be stored
  }

  createSelfEdge(circle: StateCircle) {
    const edge = this.diagramScene.add.graphics();
    edge.lineStyle(2, 0x000000); // Set line style

    const radius = circle.circle.width / 2;
    const selfEdgeRadius = (radius * 2) / 3; // Self edge radius is 2/3 of the state circle radius
    const startAngle = (2 * Math.PI) / 4; // Start angle at 120 degrees
    const endAngle = Math.PI / 4; // End angle at 60 degrees

    // Calculate the center of the self edge circle
    const selfEdgeCenterX = circle.x + radius * Math.cos(startAngle);
    const selfEdgeCenterY = circle.y - selfEdgeRadius - 36; // Move up by 2/3 of the radius

    edge.fillStyle(0x000000, 1);
    // Draw the self edge circle
    edge.beginPath();
    edge.arc(
      selfEdgeCenterX,
      selfEdgeCenterY,
      selfEdgeRadius,
      startAngle,
      endAngle
    );
    edge.strokePath();

    // Draw the arrowhead for the self edge
    // Calculate the end point of the self edge
    const arrowStartX = selfEdgeCenterX + selfEdgeRadius * Math.cos(endAngle);
    const arrowStartY = selfEdgeCenterY + selfEdgeRadius * Math.sin(endAngle);

    // Arrowhead dimensions
    const arrowLength = 10;
    const arrowWidth = 5;

    // Calculate the points for the arrowhead
    const arrowPointX =
      arrowStartX + arrowLength * Math.cos(endAngle + Math.PI / 2);
    const arrowPointY =
      arrowStartY + arrowLength * Math.sin(endAngle + Math.PI / 2);

    const arrowLeftX = arrowStartX + arrowWidth * Math.cos(endAngle + Math.PI);
    const arrowLeftY = arrowStartY + arrowWidth * Math.sin(endAngle + Math.PI);

    const arrowRightX = arrowStartX + arrowWidth * Math.cos(endAngle);
    const arrowRightY = arrowStartY + arrowWidth * Math.sin(endAngle);

    // Draw the arrowhead
    edge.beginPath();
    edge.moveTo(arrowLeftX, arrowLeftY);
    edge.lineTo(arrowPointX, arrowPointY);
    edge.lineTo(arrowRightX, arrowRightY);
    edge.closePath();
    edge.fillPath();
    edge.setDepth(100);

    // Set the data for the self-edge
    edge.setData('startCircle', circle);
    edge.setData('endCircle', circle);

    // Store the self edge in the circle's edges array for updating later
    circle.edges.push(edge);

    return edge; // Return the edge so it can be stored
  }

  destroyAllEdges() {
    this.diagramScene.getStateCircles.forEach((stateCircle: StateCircle) => {
      stateCircle.edges.forEach((edge: Phaser.GameObjects.Graphics) => {
        if (edge) {
          edge.destroy();
        }
      });

      // Clear the edges array after destroying all edges
      stateCircle.edges = [];
    });
  }
}

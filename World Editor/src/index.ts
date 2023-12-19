import { CANVAS_ID } from "./globalConstants";
import { clearCanvas, initializeCanvas } from "./Canvas/canvasHelpers";
import { Graph } from "./Canvas/Graph/Graph";
import { IGraph } from "./Canvas/Graph/IGraph";
import { Point } from "./Canvas/Graph/Point/Point";
import { Segment } from "./Canvas/Graph/Segment/Segment";

const canvas = initializeCanvas(CANVAS_ID);
const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');

const p1 = new Point(200, 200);
const p2 = new Point(500, 200);
const p3 = new Point(400, 400);
const p4 = new Point(100, 300);

const s1 = new Segment(p1, p2);
const s2 = new Segment(p1, p3);
const s3 = new Segment(p1, p4);
const s4 = new Segment(p2, p3);

const graph: IGraph = new Graph([p1, p2, p3, p4], [s1, s2, s3, s4]);
graph.draw(ctx);

document.getElementById('controlls')?.children[0].addEventListener('click', addRandomPoint);

function addRandomPoint() {
    const randomPoint = new Point(Math.random() * canvas.width, Math.random() * canvas.height);
    graph.tryAddPoint(randomPoint);
    
    clearCanvas(ctx, canvas);
    graph.draw(ctx);
}

document.getElementById('controlls')?.children[1].addEventListener('click', addRandomSegment);

function addRandomSegment() {
    const index1 = Math.floor(Math.random() * graph.points.length);
    const index2 = Math.floor(Math.random() * graph.points.length);

    const point1 = graph.points[index1];
    const point2 = graph.points[index2];

    const segment = new Segment(point1, point2);

    graph.tryAddSegment(segment);
   
    clearCanvas(ctx, canvas);
    graph.draw(ctx);        
}
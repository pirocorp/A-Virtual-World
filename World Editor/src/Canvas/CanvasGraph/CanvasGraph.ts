import { Graph } from "../Graph/Graph";
import { ICanvasGraph } from "./ICanvasGraph";
import { IPoint } from "../Graph/Point/IPoint";
import { ISegment } from "../Graph/Segment/ISegment";
import { CANVAS_ID, CANVAS_SIZE_HEIGHT, CANVAS_SIZE_WIDTH } from "../../globalConstants";
import { Point } from "../Graph/Point/Point";
import { Segment } from "../Graph/Segment/Segment";

export class CanvasGraph extends Graph implements ICanvasGraph {
    private readonly _canvasContainer: HTMLElement;
    private readonly _canvas: HTMLCanvasElement;
    private readonly _context: CanvasRenderingContext2D;

    constructor(
        canvasContainer: HTMLElement,
        points: IPoint[] = [], 
        segments: ISegment[] = []) {
        super(points, segments);

        this._canvasContainer = canvasContainer;

        this._canvas = this.initializeCanvas();
        this._context = <CanvasRenderingContext2D>this._canvas.getContext('2d');

        this.addRandomPoint = this.addRandomPoint.bind(this);
        this.addRandomSegment = this.addRandomSegment.bind(this);
        this.removeRandomSegment = this.removeRandomSegment.bind(this);
        this.removeRandomPoint = this.removeRandomPoint.bind(this);

        this.draw();
    }

    public addRandomPoint(): void {
        const randomPoint = new Point(Math.random() * this._canvas.width, Math.random() * this._canvas.height);
        this.tryAddPoint(randomPoint);
        
        this.clearCanvas();
        this.draw();
    }

    public addRandomSegment(): void {
        if(this._points.length < 2){
            return
        }
    
        const index1 = Math.floor(Math.random() * this._points.length);
        const index2 = Math.floor(Math.random() * this._points.length);
    
        const point1 = this._points[index1];
        const point2 = this._points[index2];
    
        const segment = new Segment(point1, point2);
    
        this.tryAddSegment(segment);
       
        this.clearCanvas();
        this.draw();    
    }

    public removeRandomSegment(): void {
        if(this._segments.length == 0){   
            return;
        }
    
        const index = Math.floor(Math.random() * this._segments.length);
        const segment = this._segments[index];
    
        this.tryRemoveSegment(segment);
    
        this.clearCanvas();
        this.draw();
    }

    public removeRandomPoint(): void {
        if(this._points.length == 0){  
            return;
        }
    
        const index = Math.floor(Math.random() * this._points.length);
        const point = this._points[index];
    
        this.tryRemovePoint(point);
    
        this.clearCanvas();
        this.draw();
    }

    public removeAll(): void {
        this.dispose();
    
        this.clearCanvas();
        this.draw();
    }

    private initializeCanvas(): HTMLCanvasElement {
        const canvas = <HTMLCanvasElement>document.createElement('canvas');
    
        canvas.id = CANVAS_ID;
        canvas.width = CANVAS_SIZE_WIDTH;
        canvas.height = CANVAS_SIZE_HEIGHT;
        canvas.style.border = '1px solid'
    
        this._canvasContainer.appendChild(canvas);
        return canvas;
    }

    private draw(): void {
        for(const segment of this._segments){
            segment.draw(this._context);
        }

        for(const point of this._points){
            point.draw(this._context);
        }
    }

    private clearCanvas(): void{
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }
}
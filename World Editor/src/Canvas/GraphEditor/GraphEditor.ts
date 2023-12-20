import { IGraphEditor } from "./IGraphEditor";
import { IGraph } from "../Graph/IGraph";
import { CANVAS_ID, CANVAS_SIZE_HEIGHT, CANVAS_SIZE_WIDTH } from "../../globalConstants";
import { Point } from "../Graph/Point/Point";
import { Segment } from "../Graph/Segment/Segment";
import { IPoint } from "../Graph/Point/IPoint";
import { IPointOptions } from "../Graph/Point/IPointOptions";
import { Color } from "../Color";
import { MouseButton } from "../MouseButton";
import { ISegment } from "../Graph/Segment/ISegment";
import { ISegmentOptions } from "../Graph/Segment/ISegmentOptions";

export class GraphEditor implements IGraphEditor {
    private readonly _pointTresholdDistance: number = 10;
    private readonly _pointOptions: IPointOptions = { 
        size: 18, 
        color: Color.Black, 
        outline: false,
        fill: false 
    };
    private readonly _segmentOptions: ISegmentOptions = {
        width: 2,
        color: Color.Black,
        dash: []
    };

    private readonly _canvasContainer: HTMLElement;
    private readonly _canvas: HTMLCanvasElement;
    private readonly _context: CanvasRenderingContext2D;
    private readonly _graph: IGraph;

    private _selected: IPoint | null = null;
    private _hovered: IPoint | null = null;
    private _dragging: boolean = false;
    private _mouse: IPoint = null!;

    constructor(
        canvasContainer: HTMLElement,
        graph: IGraph) {
        this._canvasContainer = canvasContainer;
        this._graph = graph;

        this._canvas = this.initializeCanvas();
        this._context = <CanvasRenderingContext2D>this._canvas.getContext('2d');

        this.onMouseDownEventHandler = this.onMouseDownEventHandler.bind(this);
        this.onMouseMoveEventHandler = this.onMouseMoveEventHandler.bind(this);
        this.onContextMenuEventHandler = this.onContextMenuEventHandler.bind(this);
        this.onMouseUpEventHandler = this.onMouseUpEventHandler.bind(this);

        this.addEventListeners();
    }

    public addRandomSegment(): void {
        if(this._graph.points.length < 2){
            return
        }
    
        const index1 = Math.floor(Math.random() * this._graph.points.length);
        const index2 = Math.floor(Math.random() * this._graph.points.length);
    
        const point1 = this._graph.points[index1];
        const point2 = this._graph.points[index2];
    
        const segment = new Segment(point1, point2);
    
        this._graph.tryAddSegment(segment); 
    }

    public removeRandomSegment(): void {
        if(this._graph.segments.length == 0){   
            return;
        }
    
        const index = Math.floor(Math.random() * this._graph.segments.length);
        const segment = this._graph.segments[index];
    
        this._graph.tryRemoveSegment(segment);
    }

    public removeAll(): void {
        this._graph.dispose();
    }

    public draw(): void {
        for(const segment of this._graph.segments){
            segment.draw(this._context);
        }

        for(const point of this._graph.points){
            point.draw(this._context, this._pointOptions);
        }

        if(this._selected) {
            this._selected.draw(this._context, { ... this._pointOptions, outline: true });

            const intent = this._hovered ?? this._mouse;
            const segment = new Segment(this._selected, intent);
            segment.draw(this._context, {... this._segmentOptions, dash: [3, 3] });
        }

        if(this._hovered) {
            this._hovered.draw(this._context, { ... this._pointOptions, fill: true });
        }
    }

    public clearCanvas(): void {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
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

    private addEventListeners() {
        this._canvas.addEventListener("mousedown", this.onMouseDownEventHandler);
        this._canvas.addEventListener("mousemove", this.onMouseMoveEventHandler);
        this._canvas.addEventListener("contextmenu", this.onContextMenuEventHandler);
        this._canvas.addEventListener("mouseup", this.onMouseUpEventHandler);
    }

    private onMouseDownEventHandler(mouseEvent: MouseEvent) {
        if(mouseEvent.button == MouseButton.RigthClick) {           
            if(this._hovered){
                this.removePoint(this._hovered);
            } else {
                this._selected = null;
            }
        }

        if(mouseEvent.button == MouseButton.LeftClick) {
            if(this._hovered) {
                this.selectPoint(this._hovered);
                this._dragging = true;

                return
            }
    
            const success = this._graph.tryAddPoint(this._mouse);
    
            if(success){
                this.selectPoint(this._mouse);
                this._hovered = this._mouse; 
            }
        }        
    } 
    
    private onMouseMoveEventHandler(mouseEvent: MouseEvent) {
        this._mouse = new Point(mouseEvent.offsetX, mouseEvent.offsetY);
        this._hovered = Point.getNearestPoint(this._mouse, this._graph.points, this._pointTresholdDistance);

        if(this._dragging == true) {
            this._selected?.mutate(this._mouse);
        }
    }

    private onMouseUpEventHandler(mouseEvent: MouseEvent) {
        this._dragging = false;
    }

    private onContextMenuEventHandler(mouseEvent: MouseEvent) {
        mouseEvent.preventDefault();
    }

    private selectPoint(point: IPoint) {
        if(this._selected){
            const segment: ISegment = new Segment(this._selected, point);                                     
            this._graph.tryAddSegment(segment);
        }

        this._selected = point;
    }

    private removePoint(point: IPoint) {
        this._graph.tryRemovePoint(point);
        this._hovered = null; 

        if(this._selected == point){
            this._selected = null;
        }
    }
}
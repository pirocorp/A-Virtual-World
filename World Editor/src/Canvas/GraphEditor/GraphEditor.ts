import { CANVAS_ID, CANVAS_SIZE_HEIGHT, CANVAS_SIZE_WIDTH } from "../../globalConstants";

import { IGraphEditor } from "./IGraphEditor";
import { IViewport } from "../Viewport/IViewport";
import { IPoint } from "../Graph/Point/IPoint";
import { IPointOptions } from "../Graph/Point/IPointOptions";
import { ISegment } from "../Graph/Segment/ISegment";
import { ISegmentOptions } from "../Graph/Segment/ISegmentOptions";
import { IGraph } from "../Graph/IGraph";
import { Viewport } from "../Viewport/Viewport";
import { Point } from "../Graph/Point/Point";
import { Segment } from "../Graph/Segment/Segment";
import { Graph } from "../Graph/Graph";
import { Color } from "../Color";
import { MouseButton } from "../MouseButton";

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
    private readonly _graph: IGraph;
    private readonly _viewport: IViewport

    private _selected: IPoint | null = null;
    private _hovered: IPoint | null = null;
    private _dragging: boolean = false;
    private _mouse: IPoint = null!;

    constructor(
        canvasContainer: HTMLElement,
        points: IPoint[] = [], 
        segments: ISegment[] = []) {
        this._canvasContainer = canvasContainer;
        this._graph = new Graph(points, segments);

        this._canvas = this.initializeCanvas();
        this._viewport = new Viewport(this._canvas);

        this.onMouseDownEventHandler = this.onMouseDownEventHandler.bind(this);
        this.onMouseMoveEventHandler = this.onMouseMoveEventHandler.bind(this);
        this.onContextMenuEventHandler = this.onContextMenuEventHandler.bind(this);
        this.onMouseUpEventHandler = this.onMouseUpEventHandler.bind(this);

        this.draw = this.draw.bind(this);

        this.addEventListeners();
    }

    public display(): void {
        this._viewport.reset();
        this.draw(this._viewport.context);    
    }

    private draw(ctx: CanvasRenderingContext2D): void {
        for(const segment of this._graph.segments){
            segment.draw(ctx);
        }

        for(const point of this._graph.points){
            point.draw(ctx, this._pointOptions);
        }

        if(this._selected) {
            this._selected.draw(ctx, { ... this._pointOptions, outline: true });

            const intent = this._hovered ?? this._mouse;
            const segment = new Segment(this._selected, intent);
            segment.draw(ctx, {... this._segmentOptions, dash: [3, 3] });
        }

        if(this._hovered) {
            this._hovered.draw(ctx, { ... this._pointOptions, fill: true });
        }
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

    private addEventListeners(): void {
        this._canvas.addEventListener("mousedown", this.onMouseDownEventHandler);
        this._canvas.addEventListener("mousemove", this.onMouseMoveEventHandler);
        this._canvas.addEventListener("contextmenu", this.onContextMenuEventHandler);
        this._canvas.addEventListener("mouseup", this.onMouseUpEventHandler);
    }

    private onMouseDownEventHandler(mouseEvent: MouseEvent): void {
        if(mouseEvent.button == MouseButton.RigthButton) {           
            this.handleRightClick();
        }

        if(mouseEvent.button == MouseButton.LeftButton) {
            this.handleLeftClick();
        }        
    } 
    
    private onMouseMoveEventHandler(mouseEvent: MouseEvent): void {
        this._mouse = this._viewport.getMouse(mouseEvent, true);

        const adaptiveThreshold = this._pointTresholdDistance * this._viewport.zoom;
        this._hovered = Point.getNearestPoint(this._mouse, this._graph.points, adaptiveThreshold);

        if(this._dragging == true) {
            this._selected?.mutate(this._mouse);
        }
    }

    private onMouseUpEventHandler(mouseEvent: MouseEvent): void {
        this._dragging = false;
    }

    private onContextMenuEventHandler(mouseEvent: MouseEvent): void {
        mouseEvent.preventDefault();
    }

    private handleLeftClick(): void {
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

    private handleRightClick(): void {
        if(this._selected) {
            this._selected = null;
        } else if(this._hovered) {
            this.removePoint(this._hovered);
        }
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
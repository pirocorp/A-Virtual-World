import { IGraphEditor } from "./IGraphEditor";
import { IPoint } from "../Graph/Point/IPoint";
import { ISegment } from "../Graph/Segment/ISegment";
import { IGraph } from "../Graph/IGraph";
import { IStoredGraph } from "../Graph/StoredGraph/IStoredGraph";
import { Point } from "../Graph/Point/Point";
import { Segment } from "../Graph/Segment/Segment";
import { Graph } from "../Graph/Graph";
import { IStoredPoint } from "../Graph/StoredGraph/IStoredPoint";
import { IViewport } from "../Canvas/Viewport/IViewport";
import { Viewport } from "../Canvas/Viewport/Viewport";
import { CANVAS_ID, CANVAS_SIZE_HEIGHT, CANVAS_SIZE_WIDTH } from "../globalConstants";
import { MouseButton } from "../Canvas/MouseButton";

export class GraphEditor implements IGraphEditor {
    private readonly _localStorageKey = 'graph';
    private readonly _pointTresholdDistance: number = 10;

    private readonly _canvasContainer: HTMLElement;
    private readonly _controlsContainer: HTMLElement;
    private readonly _canvas: HTMLCanvasElement;
    private readonly _graph: IGraph;
    private readonly _viewport: IViewport

    private _selected: IPoint | null = null;
    private _hovered: IPoint | null = null;
    private _dragging: boolean = false;
    private _mouse: IPoint = null!;

    constructor(
        canvasContainer: HTMLElement,
        controlsContainer: HTMLElement,
        points: IPoint[] = [], 
        segments: ISegment[] = []) {
        this._canvasContainer = canvasContainer;
        this._controlsContainer = controlsContainer;

        this._graph = new Graph(points, segments);

        this._canvas = this.initializeCanvas();
        this._viewport = new Viewport(this._canvas);

        this.onMouseDownEventHandler = this.onMouseDownEventHandler.bind(this);
        this.onMouseMoveEventHandler = this.onMouseMoveEventHandler.bind(this);
        this.onContextMenuEventHandler = this.onContextMenuEventHandler.bind(this);
        this.onMouseUpEventHandler = this.onMouseUpEventHandler.bind(this);
        this.onSaveButtonClickHandler = this.onSaveButtonClickHandler.bind(this);
        this.onDeleteButtonClickHandler = this.onDeleteButtonClickHandler.bind(this);

        this.draw = this.draw.bind(this);
        
        this.addEventListeners();
        this.loadControls();

        this.loadSavedGraph();
    }
    
    public get context(): CanvasRenderingContext2D {
        return this._viewport.context;
    }

    public get graph(): IGraph {
        return this._graph;
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
            point.draw(ctx);
        }

        if(this._selected) {
            this._selected.draw(ctx, { outline: true });

            const intent = this._hovered ?? this._mouse;
            const segment = new Segment(this._selected, intent);
            segment.draw(ctx, { dash: [3, 3] });
        }

        if(this._hovered) {
            this._hovered.draw(ctx, { fill: true });
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

    private onSaveButtonClickHandler(event: MouseEvent): void {
        localStorage.setItem(this._localStorageKey, JSON.stringify(this._graph));     
    }

    private onDeleteButtonClickHandler(event: MouseEvent): void {
        this.dispose();  
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

    private selectPoint(point: IPoint): void {
        if(this._selected){
            const segment: ISegment = new Segment(this._selected, point);                                     
            this._graph.tryAddSegment(segment);
        }

        this._selected = point;
    }

    private removePoint(point: IPoint): void {
        this._graph.tryRemovePoint(point);
        this._hovered = null; 

        if(this._selected == point){
            this._selected = null;
        }
    }

    private dispose(): void {
        this._graph.dispose();
        this._hovered = null;
        this._selected = null;
    }

    private loadControls(): void {
        const saveGraphButton = document.createElement('button');
        saveGraphButton.textContent = '💾';
        saveGraphButton.addEventListener('click', this.onSaveButtonClickHandler);

        const deleteGraphButton = document.createElement('button');
        deleteGraphButton.textContent = '🗑️';
        deleteGraphButton.addEventListener('click', this.onDeleteButtonClickHandler);

        this._controlsContainer.appendChild(saveGraphButton);
        this._controlsContainer.appendChild(deleteGraphButton);
    }

    private loadSavedGraph(): void {
        const graphString: string| null = localStorage.getItem("graph");
        const graphInfo : IStoredGraph | null = graphString 
            ? JSON.parse(graphString)
            : null;

        if(graphInfo){
            this._graph.dispose();     
            
            graphInfo._points
                .map(Point.parse)
                .forEach(x => this._graph.tryAddPoint(x));

            for (const segmentInfo of graphInfo._segments) {  
                const pointA = <IPoint>this.findPointInGraph(segmentInfo.pointA);
                const pointB = <IPoint>this.findPointInGraph(segmentInfo.pointB);
                const segment = new Segment(pointA, pointB)

                this._graph.tryAddSegment(segment);
            }
        }
    }

    private findPointInGraph(point: IStoredPoint): IPoint | undefined  {      
        const pointA = this._graph.points
            .find(p => p.x === point._x && p.y === point._y);

        return pointA;
    }
}
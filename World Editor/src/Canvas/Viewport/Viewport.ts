import { IViewport } from "./IViewport";
import { IPoint } from "../Graph/Point/IPoint";
import { Point } from "../Graph/Point/Point";
import { IDrag } from "./IDrag";
import { MouseButton } from "../MouseButton";

export class Viewport implements IViewport {
    private readonly _zoomStep = 0.1;
    private readonly _minZoom = 1;
    private readonly _maxZoom = 5;

    private readonly _canvas: HTMLCanvasElement;
    private readonly _context: CanvasRenderingContext2D;

    private _zoom: number;
    private _center: IPoint;
    private _offset: IPoint;
    private _drag: IDrag;

    constructor(
        canvas: HTMLCanvasElement) {
        this._canvas = canvas;
        this._context = <CanvasRenderingContext2D>this._canvas.getContext('2d');
        
        this._zoom = 1;
        this._center = new Point(this._canvas.width / 2, this._canvas.height / 2);
        this._offset = this._center.scale(-1);
        this._drag = {
            start: new Point(0, 0),
            end: new Point(0, 0),
            offset: new Point(0, 0),
            active: false
        };

        this.onMoueseWheelEventHandler = this.onMoueseWheelEventHandler.bind(this);
        this.onMoueseDownEventHandler = this.onMoueseDownEventHandler.bind(this);
        this.onMoueseMoveEventHandler = this.onMoueseMoveEventHandler.bind(this);
        this.onMoueseUpEventHandler = this.onMoueseUpEventHandler.bind(this);
        this.getMouse = this.getMouse.bind(this);

        this.addEventListeners();
    }

    public get zoom(): number {
        return this._zoom;
    }

    public get context(): CanvasRenderingContext2D {
        return this._context;
    }

    public getMouse(mouseEvent: MouseEvent, subtractDragOffset: boolean = false) : IPoint {
        const point =  new Point(
            (mouseEvent.offsetX - this._center.x) * this._zoom - this._offset.x,
            (mouseEvent.offsetY - this._center.y) * this._zoom - this._offset.y
        )

        return subtractDragOffset
            ? point.subtract(this._drag.offset)
            : point;
    }

    public reset(): void {
        this._context.restore();

        this.clearCanvas();

        this._context.save();

        this.centerAndZoomTheCanvas();
    }

    private getOffset(): IPoint {
        return this._offset.add(this._drag.offset);
    }

    private addEventListeners(): void {
        this._canvas.addEventListener("mousewheel", (evt) => this.onMoueseWheelEventHandler(<WheelEvent>evt));
        this._canvas.addEventListener("mousedown", this.onMoueseDownEventHandler);
        this._canvas.addEventListener("mousemove", this.onMoueseMoveEventHandler);
        this._canvas.addEventListener("mouseup", this.onMoueseUpEventHandler);
    }

    private onMoueseWheelEventHandler(event: WheelEvent) {
        const direction: number = Math.sign(event.deltaY);
        this._zoom += direction * this._zoomStep;
        this._zoom = Math.max(this._minZoom, Math.min(this._maxZoom, this._zoom));     
    }

    private onMoueseDownEventHandler(event: MouseEvent) {
        if(event.button == MouseButton.MiddleButton) {
            this._drag.start = this.getMouse(event);
            this._drag.active = true;
        }     
    }

    private onMoueseMoveEventHandler(event: MouseEvent) {
        if(this._drag.active) {
            this._drag.end = this.getMouse(event);
            this._drag.offset = this._drag.end.subtract(this._drag.start);
        }
    }

    private onMoueseUpEventHandler(event: MouseEvent) {
        if(this._drag.active) {
            this._offset = this._offset.add(this._drag.offset);
            this._drag = {
                start: new Point(0, 0),
                end: new Point(0, 0),
                offset: new Point(0, 0),
                active: false
            }
        }
    }

    private clearCanvas(): void {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }

    private centerAndZoomTheCanvas(): void {
        this._context.translate(this._center.x, this._center.y);
        this._context.scale(1 / this._zoom, 1 / this._zoom);
        const offset = this.getOffset();
        this._context.translate(offset.x, offset.y);
    }
}
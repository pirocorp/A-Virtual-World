import { Color } from "../../Color";
import { IPoint } from "../Point/IPoint";
import { ISegment } from "./ISegment";

export class Segment implements ISegment {
    private readonly _a: IPoint;
    private readonly _b: IPoint;

    constructor(a: IPoint, b: IPoint){
        this._a = a;
        this._b = b;
    }

    public get pointA(): IPoint {
        return this._a;
    }

    public get pointB(): IPoint {
        return this._b;
    }

    draw(ctx: CanvasRenderingContext2D, width: number = 2, color: Color = Color.Black): void {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.moveTo(this._a.x, this._a.y);
        ctx.lineTo(this._b.x, this._b.y);
        ctx.stroke();
    }
}
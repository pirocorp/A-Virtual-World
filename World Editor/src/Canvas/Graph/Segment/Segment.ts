import { Color } from "../../Color";
import { IStoredSegment } from "../../StoredGraph/IStoredSegment";
import { IPoint } from "../Point/IPoint";
import { Point } from "../Point/Point";
import { ISegment } from "./ISegment";
import { ISegmentOptions } from "./ISegmentOptions";

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

    public equals(segment: ISegment): boolean {        
        return this.includes(segment.pointA) && this.includes(segment.pointB);
    }

    public includes(point: IPoint): boolean {
        return this.pointA.equals(point) || this.pointB.equals(point);
    }

    public draw(
        ctx: CanvasRenderingContext2D, 
        segmentOptions: ISegmentOptions = { width: 2, color: Color.Black, dash: [] }
    ): void {
        ctx.beginPath();
        ctx.lineWidth = segmentOptions.width;
        ctx.strokeStyle = segmentOptions.color;
        ctx.setLineDash(segmentOptions.dash);
        ctx.moveTo(this._a.x, this._a.y);
        ctx.lineTo(this._b.x, this._b.y);
        ctx.stroke();
        ctx.setLineDash([]);
    }
}
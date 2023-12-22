import { Color } from "../../Canvas/Color";
import { lerp } from "../../Math/utils";
import { IPoint } from "../Point/IPoint";
import { IIntersection } from "./IIntersection";
import { ISegment } from "./ISegment";
import { ISegmentOptions } from "./ISegmentOptions";

export class Segment implements ISegment {
    private _defaultOptions: ISegmentOptions = {
        width: 2, 
        color: Color.Black, 
        dash: []
    };

    public pointA: IPoint;
    public pointB: IPoint;

    constructor(a: IPoint, b: IPoint){
        this.pointA = a;
        this.pointB = b;
    }

    public equals(segment: ISegment): boolean {        
        return this.includes(segment.pointA) && this.includes(segment.pointB);
    }

    public includes(point: IPoint): boolean {
        return this.pointA.equals(point) || this.pointB.equals(point);
    }

    public draw(
        ctx: CanvasRenderingContext2D, 
        options?: ISegmentOptions
    ): void {
        options = {... this._defaultOptions, ...options}

        ctx.beginPath();
        ctx.lineWidth = options.width!;
        ctx.strokeStyle = options.color!;
        ctx.setLineDash(options.dash!);
        ctx.moveTo(this.pointA.x, this.pointA.y);
        ctx.lineTo(this.pointB.x, this.pointB.y);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    public static getIntersection(segmentA: ISegment, segmentB: ISegment): IIntersection | null {
        let intersection = null;

        const A = segmentA.pointA;
        const B = segmentA.pointB;
        const C = segmentB.pointA;
        const D = segmentB.pointB;

        const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
        const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
        const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

        if(bottom != 0) {
            const t = tTop / bottom;
            const u = uTop / bottom;

            if(t >= 0 && t <= 1 && u >= 0 && u <= 1) {
                intersection = {
                    x: lerp(A.x, B.x, t),
                    y: lerp(A.y, B.y, t),
                    offset: t
                };
            }
        }
        
        return intersection;
    }
}
import { IPolygon } from "./IPolygon";
import { IPolygonOptions } from "./IPolygonOptions";

import { Color } from "../../Canvas/Color";
import { getRandomColor } from "../../Canvas/CssColor";
import { IPoint } from "../../Graph/Point/IPoint";
import { ISegment } from "../../Graph/Segment/ISegment";
import { Segment } from "../../Graph/Segment/Segment";
import { Point } from "../../Graph/Point/Point";


export class Polygon implements IPolygon {
    private readonly _defaultOptions: IPolygonOptions = {
        stroke: Color.Blue,
        lineWidth: 2,
        fill: "rgba(0, 0, 255, 0.3)"
    }

    private readonly _points: IPoint[];
    private readonly _segments: ISegment[];

    constructor(points: IPoint[]) {
        this._points = points;
        this._segments = [];

        this.initializeSegments();
    }

    public draw(
        ctx: CanvasRenderingContext2D, 
        options?: IPolygonOptions
    ): void {
        options = { ... this._defaultOptions, ...options };

        ctx.beginPath();

        ctx.fillStyle = options.fill!;
        ctx.strokeStyle = options.stroke!;
        ctx.lineWidth = options.lineWidth!;

        ctx.moveTo(this._points[0].x, this._points[0].y);

        for (let i = 1; i < this._points.length; i++) {
            const point = this._points[i];
            ctx.lineTo(point.x, point.y);
        }

        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    public drawSegments(ctx: CanvasRenderingContext2D) {
        for (let i = 0; i < this._segments.length; i++) {
            const segment = this._segments[i];
            segment.draw(ctx, { color: getRandomColor(), width: 5 })
        }
    }

    private initializeSegments(): void {
        if(this._points.length < 2) {
            return
        }

        for (let i = 1; i <= this._points.length; i++) {
            const prevPoint = this._points[i - 1];
            const currentPoint = this._points[i % this._points.length];

            const segment = new Segment(prevPoint, currentPoint);
            this._segments.push(segment);
        }
    }

    public static break(polygonA: Polygon, polygonB: Polygon) {
        const segmentsPoligonA = polygonA._segments;
        const segmentsPoligonB = polygonB._segments;

        for (let i = 0; i < segmentsPoligonA.length; i++) {
            const segmentA = segmentsPoligonA[i];
            
            for (let j = 0; j < segmentsPoligonB.length; j++) {
                const segmentB = segmentsPoligonB[j];
                
                const intersection = Segment.getIntersection(segmentA, segmentB);

                if(intersection 
                    && intersection.offset != 1
                    && intersection.offset != 0) {
                    const point = new Point(intersection.x, intersection.y);

                    let original = segmentA.pointB;
                    segmentA.pointB = point;                                   

                    segmentsPoligonA.splice(i + 1, 0, new Segment(point, original));

                    original = segmentB.pointB;
                    segmentB.pointB = point;

                    segmentsPoligonB.splice(j + 1, 0, new Segment(point, original));
                }
            }
        }
    }
    
    public static multiBreak(polygons: Polygon[]) {
        for (let i = 0; i < polygons.length - 1; i++) {
            const prevPolygon = polygons[i];

            for (let j = i + 1; j < polygons.length; j++) {
                const nextPolygon = polygons[j];
                Polygon.break(prevPolygon, nextPolygon);
            }       
        }
    }
}
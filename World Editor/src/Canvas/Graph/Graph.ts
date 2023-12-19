import { IGraph } from "./IGraph";
import { IPoint } from "./Point/IPoint";
import { ISegment } from "./Segment/ISegment";

export class Graph implements IGraph{
    private readonly _points: IPoint[];
    private readonly _segments: ISegment[];

    constructor(points: IPoint[] = [], segments: ISegment[] = []){
        this._points = points;
        this._segments = segments;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        for(const segment of this._segments){
            segment.draw(ctx);
        }

        for(const point of this._points){
            point.draw(ctx);
        }
    }
}
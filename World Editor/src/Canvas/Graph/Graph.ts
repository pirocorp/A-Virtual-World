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

    public get points(): IPoint[] {
        return this._points.map(x => x);
    }

    public get segments(): ISegment[] {
        return this._segments.map(x => x);
    }

    public tryAddPoint(point: IPoint): boolean{
        if(this.containsPoint(point)){
            return false;
        }

        this._points.push(point);
        return true;
    }

    public tryAddSegment(segment: ISegment): boolean{
        if(this.containsSegment(segment) || segment.pointA.equals(segment.pointB)){
            return false;
        }
        
        this._segments.push(segment);
        return true;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        for(const segment of this._segments){
            segment.draw(ctx);
        }

        for(const point of this._points){
            point.draw(ctx);
        }
    }

    private containsPoint(point: IPoint): boolean{
        return this._points.some(p => p.equals(point))
    }

    private containsSegment(segment: ISegment): boolean{
        return this._segments.some(s => s.equals(segment));
    }
}
import { IGraph } from "./IGraph";
import { IPoint } from "./Point/IPoint";
import { ISegment } from "./Segment/ISegment";

export class Graph implements IGraph{
    protected readonly _points: IPoint[];
    protected readonly _segments: ISegment[];

    constructor(points: IPoint[] = [], segments: ISegment[] = []){
        this._points = points;
        this._segments = segments;
    }
    
    public get points(): IPoint[] {
        return this._points;
    }

    public get segments(): ISegment[] {
        return this._segments;
    }

    public tryAddPoint(point: IPoint): boolean {
        if(this.containsPoint(point)){
            return false;
        }

        this._points.push(point);
        return true;
    }

    public tryAddSegment(segment: ISegment): boolean{
        if(this.containsSegment(segment) 
            || segment.pointA.equals(segment.pointB)) {
            return false;
        }
        
        this._segments.push(segment);
        return true;
    }

    public tryRemovePoint(point: IPoint): boolean {
        if(this._points.length == 0){        
            return false;
        }

        const index = this._points.indexOf(point);

        if(index < 0){
            return false;
        }

        const segments = this.getSegmentsContainingPoint(point);

        for (const segment of segments) {
            this.tryRemoveSegment(segment);
        }

        this._points.splice(index, 1);

        return true;
    }

    public tryRemoveSegment(segment: ISegment): boolean {
        if(this._segments.length == 0){        
            return false;
        }

        const index = this._segments.indexOf(segment);

        if(index < 0){
            return false;
        }

        this._segments.splice(index, 1);
        return true;
    }

    public dispose(): void {
        this._points.length = 0;
        this._segments.length = 0;
    }

    private containsPoint(point: IPoint): boolean{
        return this._points.some(p => p.equals(point))
    }

    private containsSegment(segment: ISegment): boolean{
        return this._segments.some(s => s.equals(segment));
    }

    private getSegmentsContainingPoint(point: IPoint): ISegment[] {
        let segments: ISegment[] = [];

        for (const segment of this._segments) {
            if(segment.includes(point)){
                segments.push(segment);
            }
        }

        return segments;
    }
}
import { IPoint } from "./Point/IPoint";
import { ISegment } from "./Segment/ISegment";

export interface IGraph {
    points: IPoint[];
    segments: ISegment[];

    tryAddPoint(point: IPoint): boolean;

    tryAddSegment(segment: ISegment): boolean

    draw(ctx: CanvasRenderingContext2D): void;
}
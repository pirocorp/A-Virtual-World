import { IPoint } from "../Point/IPoint";
import { ISegmentOptions } from "./ISegmentOptions";

export interface ISegment {
    pointA: IPoint;
    pointB: IPoint;

    equals(segment: ISegment): boolean;

    includes(point: IPoint): boolean;

    draw(ctx: CanvasRenderingContext2D, segmentOptions?: ISegmentOptions): void;
}
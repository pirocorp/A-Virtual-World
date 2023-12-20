import { Color } from "../../Color";
import { IPoint } from "../Point/IPoint";

export interface ISegment {
    pointA: IPoint;
    pointB: IPoint;

    equals(segment: ISegment): boolean;

    includes(point: IPoint): boolean;

    draw(ctx: CanvasRenderingContext2D, width?: number, color?: Color): void;
}
import { Color } from "../../Color";
import { IPoint } from "../Point/IPoint";

export interface ISegment {
    pointA: IPoint;
    pointB: IPoint;

    draw(ctx: CanvasRenderingContext2D, width?: number, color?: Color): void;
}
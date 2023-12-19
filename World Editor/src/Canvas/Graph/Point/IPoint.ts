import { Color } from "../../Color";

export interface IPoint {
    x: number;
    y: number;

    equals(point: IPoint): boolean;

    draw(ctx: CanvasRenderingContext2D, size?: number, color?: Color): void;
}
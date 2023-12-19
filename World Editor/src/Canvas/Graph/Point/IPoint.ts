import { Color } from "../../Color";

export interface IPoint {
    x: number;
    y: number;

    draw(ctx: CanvasRenderingContext2D, size?: number, color?: Color): void;
}
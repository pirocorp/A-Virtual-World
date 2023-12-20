import { IPointOptions } from "./IPointOptions";

export interface IPoint {
    x: number;
    y: number;

    equals(point: IPoint): boolean;

    distance(point: IPoint): number;

    mutate(point: IPoint): void;

    draw(ctx: CanvasRenderingContext2D, options?: IPointOptions): void
}
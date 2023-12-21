import { IPointOptions } from "./IPointOptions";

export interface IPoint {
    x: number;
    y: number;

    equals(point: IPoint): boolean;

    add(point: IPoint): IPoint;

    subtract(point: IPoint): IPoint;

    distance(point: IPoint): number;

    scale(scale: number): IPoint;

    mutate(point: IPoint): void;

    draw(ctx: CanvasRenderingContext2D, options?: IPointOptions): void
}
import { IPointOptions } from "./IPointOptions";

export interface IPoint {
    x: number;
    y: number;

    equals(point: IPoint): boolean;

    distance(point: IPoint): number;

    angle(): number;

    add(point: IPoint): IPoint;

    subtract(point: IPoint): IPoint;

    scale(scale: number): IPoint;

    translate(angle: number, offset: number): IPoint;

    mutate(point: IPoint): void;

    draw(ctx: CanvasRenderingContext2D, options?: IPointOptions): void
}
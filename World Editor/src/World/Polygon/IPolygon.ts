import { IPolygonOptions } from "./IPolygonOptions";

export interface IPolygon {
    draw(ctx: CanvasRenderingContext2D, options?: IPolygonOptions): void;

    drawSegments(ctx: CanvasRenderingContext2D): void;
};
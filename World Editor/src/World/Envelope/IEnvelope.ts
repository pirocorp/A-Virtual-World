import { Polygon } from "../Polygon/Polygon";

export interface IEnvelope {
    polygon: Polygon;

    draw(ctx: CanvasRenderingContext2D): void;
}
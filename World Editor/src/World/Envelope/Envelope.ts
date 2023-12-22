import { IEnvelope } from "./IEnvelope";
import { Polygon } from "../Polygon/Polygon";
import { ISegment } from "../../Graph/Segment/ISegment";
import { Point } from "../../Graph/Point/Point";
import { IPoint } from "../../Graph/Point/IPoint";

export class Envelope implements IEnvelope {
    private readonly _skeleton: ISegment;
    private readonly _polygon: Polygon;

    constructor(skeleton: ISegment, width: number, roundness: number = 0){
        this._skeleton = skeleton;
        this._polygon = this.generatePolygon(width, roundness);
    }

    public get polygon(): Polygon {
        return this._polygon;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this._polygon.draw(ctx);
        this._polygon.drawSegments(ctx);
    }

    private generatePolygon(width: number, roundness: number): Polygon {
        const { pointA, pointB } = this._skeleton;
        const radius: number = width / 2;

        const alpha: number = Point.angle(pointA.subtract(pointB)); // Angle between Point A and Point B
        const alpha_cw: number = alpha + Math.PI / 2; // Angle offset 90 degrees clock wise
        const alpha_ccw: number = alpha - Math.PI / 2; // Angle offset 90 degrees counter clock wise

        const points: IPoint[] = [];
        const step = Math.PI / Math.max(1 , roundness);
        const epsilon = step / 2; // correction for the float numbers

        for(let i = alpha_ccw; i <= alpha_cw + epsilon; i += step) {
            points.push(pointA.translate(i, radius));
        }

        for(let i = alpha_ccw; i <= alpha_cw + epsilon; i += step) {
            points.push(pointB.translate(Math.PI + i, radius));
        }

        return new Polygon(points);
    }
};
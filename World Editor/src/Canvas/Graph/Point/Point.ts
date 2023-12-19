import { Color } from "../../Color";
import { IPoint } from "./IPoint";

export class Point implements IPoint {

    private readonly _x: number;
    private readonly _y: number;

    constructor(
        x: number, 
        y: number) {
        this._x = x;
        this._y = y;
    }

    public get x(): number {
        return this._x;
    }

    public get y(): number {
        return this._y;
    }

    draw(ctx: CanvasRenderingContext2D, size: number = 18, color: Color = Color.Black): void {    
        const radius = size / 2;

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(this._x, this._y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
}
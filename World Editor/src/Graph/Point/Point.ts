import { IPoint } from "./IPoint";
import { IPointOptions } from "./IPointOptions";
import { IStoredPoint } from "../StoredGraph/IStoredPoint";
import { Color } from "../../Canvas/Color";

export class Point implements IPoint {
    private readonly _defaultOptions: IPointOptions = {
        size: 18, 
        color: Color.Black, 
        outline: false,
        fill: false 
    }

    private _x: number;
    private _y: number;

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

    public equals(point: IPoint): boolean {
        return this._x === point.x && this._y === point.y;
    }

    public distance(point: IPoint): number {
        return Math.hypot(this._x - point.x, this._y - point.y);
    }

    public angle(): number {
        return Math.atan2(this._y, this._x);
    }

    public add(point: IPoint): IPoint {
        return new Point(this._x + point.x, this._y + point.y);
    }

    public subtract(point: IPoint): IPoint {
        return new Point(this._x - point.x, this._y - point.y);
    }

    public scale(scale: number): IPoint {
        return new Point(this._x * scale, this._y * scale);
    }

    public translate(angle: number, offset: number): IPoint {
        return new Point(
            this._x + Math.cos(angle) * offset,
            this._y + Math.sin(angle) * offset
        );
    }

    public mutate(point: IPoint): void {
        this._x = point.x;
        this._y = point.y;
    }

    public draw(
        ctx: CanvasRenderingContext2D, 
        options?: IPointOptions
    ): void {  
        options = {... this._defaultOptions, ...options}

        const radius = options.size! / 2;

        ctx.beginPath();
        ctx.fillStyle = options.color!;
        ctx.arc(this._x, this._y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        if(options.outline){
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = Color.Yellow;
            ctx.arc(this._x, this._y, radius * 0.6, 0, Math.PI * 2);
            ctx.stroke();
        }

        if(options.fill){
            ctx.beginPath();
            ctx.fillStyle = Color.Yellow;
            ctx.arc(this._x, this._y, radius * 0.4, 0, Math.PI * 2);
            ctx.fill()
        }
    }

    public static getNearestPoint(current: IPoint, points: IPoint[], threshold: number = Number.MAX_SAFE_INTEGER): IPoint | null {
        let minDistance = Number.MAX_SAFE_INTEGER;
        let nearest: IPoint | null = null;

        for (const point of points) {
            const currentDistance = current.distance(point);          

            if(currentDistance < minDistance && currentDistance < threshold){
                nearest = point;
                minDistance = currentDistance;
            }
        }

        return nearest;
    }

    public static parse (point: IStoredPoint) {
        return new Point(point._x, point._y);
    }

    public static angle(point: {x: number, y: number}): number {
        return Math.atan2(point.y, point.x);
    }
}
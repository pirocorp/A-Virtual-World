import { CANVAS_SIZE_WIDTH } from "../globalConstants";
import { CANVAS_SIZE_HEIGHT } from "../globalConstants";

export function initializeCanvas(id: string): HTMLCanvasElement {
    const canvas = <HTMLCanvasElement>document.createElement('canvas');

    canvas.id = id;
    canvas.width = CANVAS_SIZE_WIDTH;
    canvas.height = CANVAS_SIZE_HEIGHT;
    canvas.style.border = '1px solid'

    document.body.childNodes[1].after(canvas);
    //document.body.appendChild(canvas);

    return canvas;
}

export function clearCanvas(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
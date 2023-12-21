import { IPoint } from "../Graph/Point/IPoint";

export interface IViewport {
    zoom: number;

    context: CanvasRenderingContext2D;

    getMouse(mouseEvent: MouseEvent, subtractDragOffset?: boolean) : IPoint;

    reset(): void;
}
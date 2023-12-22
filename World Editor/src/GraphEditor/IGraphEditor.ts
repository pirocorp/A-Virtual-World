import { IGraph } from "../Graph/IGraph";

export interface IGraphEditor {
    context: CanvasRenderingContext2D;

    graph: IGraph;

    display(): void;
}
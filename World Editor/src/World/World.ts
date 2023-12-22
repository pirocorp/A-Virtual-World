import { IEnvelope } from "./Envelope/IEnvelope";
import { IWorld } from "./IWorld";

import { Envelope } from "./Envelope/Envelope";
import { Polygon } from "./Polygon/Polygon";
import { IGraph } from "../Graph/IGraph";

export class World implements IWorld {
    private readonly _graph: IGraph
    private readonly _roadWidth: number;
    private readonly _roadRoundness: number;
    private readonly _envelopes: IEnvelope[];

    constructor(graph: IGraph, roadWidth: number = 100, roadRoundness = 3) {
        this._graph = graph;
        this._roadWidth = roadWidth;
        this._roadRoundness = roadRoundness;

        this._envelopes = [];
        this.generate();
    }

    public generate(): void {
        this.generateEnvelopes();
        Polygon.multiBreak(this._envelopes.map(e => e.polygon));
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.drawEnvelopes(ctx);
    }

    private generateEnvelopes(): void {
        this._envelopes.length = 0;

        for(const segment of this._graph.segments){
            const envelope = new Envelope(segment, this._roadWidth, this._roadRoundness);
            this._envelopes.push(envelope);
        }
    }

    private drawEnvelopes(ctx: CanvasRenderingContext2D): void {
        for (const envelope of this._envelopes) {
            envelope.draw(ctx);
        }
    }
}
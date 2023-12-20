import { IPoint } from "./Point/IPoint";
import { ISegment } from "./Segment/ISegment";

export interface IGraph {
    points: IPoint[];
    segments: ISegment[];

    tryAddPoint(point: IPoint): boolean;

    tryAddSegment(segment: ISegment): boolean;

    tryRemoveSegment(segment: ISegment): boolean;

    tryRemovePoint(point: IPoint): boolean;

    dispose(): void;
}
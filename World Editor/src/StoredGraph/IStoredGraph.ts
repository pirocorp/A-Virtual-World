import { IStoredPoint } from "./IStoredPoint";
import { IStoredSegment } from "./IStoredSegment";

export interface IStoredGraph {
    _points: IStoredPoint[],
    _segments: IStoredSegment[]
}
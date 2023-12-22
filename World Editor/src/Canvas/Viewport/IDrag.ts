import { IPoint } from "../../Graph/Point/IPoint";

export interface IDrag {
    start: IPoint,
    end: IPoint,
    offset: IPoint,
    active: boolean
}
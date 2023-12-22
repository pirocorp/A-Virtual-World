import { Color } from "../../Canvas/Color";
import { CssColor } from "../../Canvas/CssColor";

export interface IPolygonOptions {
    stroke?: Color | undefined,
    lineWidth?: number | undefined,
    fill?: CssColor | undefined
}
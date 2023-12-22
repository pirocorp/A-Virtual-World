import { CssColor } from "../../Canvas/CssColor";

export interface ISegmentOptions {
    width?: number | undefined;
    color?: CssColor | undefined;
    dash?: number[] | undefined;
}
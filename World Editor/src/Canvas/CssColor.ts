import { Color } from "./Color";

type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;
type HSL = `hsl(${number}, ${number}%, ${number}%)`;

export type CssColor = RGB | RGBA | HEX | HSL | Color;

export function getRandomColor(): CssColor {
    const hue = 290 + Math.random() * 260;
    
    return `hsl(${hue}, 100%, 60%)`;
}
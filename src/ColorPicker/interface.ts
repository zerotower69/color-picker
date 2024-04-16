import type { Color } from './color';
import {CSSProperties} from "react";

export interface HSL {
    h: number | string;
    s: number | string;
    l: number | string;
}

export interface RGB {
    r: number | string;
    g: number | string;
    b: number | string;
}

export interface HSLA extends HSL {
    a: number;
}

export interface RGBA extends RGB {
    a: number;
}

export type ColorType =
    | string
    | number
    | RGB
    | RGBA
    | HSL
    | HSLA
    | Color;

export interface PaletteProps {
    className?:string;
    style?:CSSProperties;
    color:Color;
    onChange?:(color:Color)=>void;
}
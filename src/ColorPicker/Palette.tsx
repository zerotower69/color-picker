import {CSSProperties, FC, useRef} from "react";
import cs from "classnames"
import {Color} from "./color.ts";
import Handler from "./Handler.tsx";
import Transform from "./Transform.tsx";
import useColorDrag from "./useColorDrag.ts";
import {calculateColor, calculateOffset} from "./utils.ts";

export interface PaletteProps{
    className?:string;
    style?:CSSProperties;
    color:Color;
    onChange?:(color:Color)=>void;
}

const Palette:FC<PaletteProps> =({
    className,
    style,
    color,
    onChange
})=>{
    const classNames =cs('color-picker-panel-palette',className);
    const transformRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [offset,dragStartHandle] = useColorDrag({
        containerRef,
        targetRef:transformRef,
        color,
        onDragChange(offsetValue){
            const newColor = calculateColor({
                offset:offsetValue,
                containerRef,
                targetRef:transformRef,
                color
            });
            onChange?.(newColor)
        },
        calculate:()=>{
            return calculateOffset(containerRef,transformRef,color)
        }
    })
    return (
        <div ref={containerRef} className={classNames} onMouseDown={dragStartHandle}>
            <Transform ref={transformRef} offset={offset}>
                <Handler color={color.toRgbString()}/>
            </Transform>
            <div className="color-picker-panel-palette-main" style={style}></div>
        </div>
    )
}

export default Palette
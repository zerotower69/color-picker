import {FC, useRef, useState} from "react";
import cs from "classnames"
import Handler from "./Handler.tsx";
import Transform from "./Transform.tsx";
import useColorDrag from "./useColorDrag.ts";
import {calculateColor, calculateOffset} from "./utils.ts";
import {PaletteProps} from "./interface.ts";
import {Color} from "./color.ts";

export interface PickSaturationProps extends PaletteProps{
}

const PickSaturation:FC<PickSaturationProps> =({
    className,
    color,
    onChange,
})=>{
    const classNames =cs('color-picker-panel-palette','color-picker-panel-palette-main',className);
    const transformRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [pickColor,setPickColor] = useState<Color>(()=>{
        return color
    })

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
            setPickColor(newColor)
            // console.log(`%c 输出颜色,${newColor.toHexString()}`, `color:${newColor.toRgbString()}`)
            onChange?.(newColor)
        },
        onColorChange(color,offset){
            const newColor = calculateColor(
                {
                    offset,
                    containerRef,
                    targetRef:transformRef,
                    color
                }
            );
            setPickColor(newColor);
            onChange?.(newColor)
        },
        calculate:()=>{
            return calculateOffset(containerRef,transformRef,color)
        }
    });

    return (
        <div ref={containerRef} className={classNames} onMouseDown={dragStartHandle}>
            <Transform ref={transformRef} offset={offset}>
                <Handler color={pickColor.toRgbString()}/>
            </Transform>
            <div className={`color-picker-panel-palette-saturation`} style={{
                backgroundColor:`${color.toRgbString()}`,
                backgroundImage:`linear-gradient(0deg, rgb(0, 0, 0), transparent), linear-gradient(90deg, rgb(255, 255, 255), rgba(255, 255, 255, 0))`
            }}></div>
        </div>
    )
}

export default PickSaturation
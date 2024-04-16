import {CSSProperties, FC, useRef, useState} from "react";
import cs from "classnames"
import Handler from "./Handler.tsx";
import Transform from "./Transform.tsx";
import useColorDrag from "./useColorDrag.ts";
import {calculateAlphaOffset, formatNumber} from "./utils.ts";
import {Color} from "./color.ts";

export interface PickAlphaProps{
    className?:string;
    style?:CSSProperties;
    color:Color;
    onChange?:(alpha:number)=>void
}

const PickAlpha:FC<PickAlphaProps> =({
                                               className,
                                               color,
                                               onChange,
                                           })=>{
    const classNames =cs('color-picker-panel-palette','is-alpha',className);
    const transformRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const colorRef =useRef<HTMLDivElement>(null)
    const [pickColor,setPickColor] = useState<Color>(color)
    const [offset,dragStartHandle] = useColorDrag({
        containerRef,
        targetRef:transformRef,
        color,
        direction:'x',
        onDragChange(offsetValue){
            //计算透明度
            const {x} = offsetValue;
            const {width} = colorRef.current!.getBoundingClientRect();
            //处理边界情况
            let alpha = 1;
            if(x<0){
                alpha=0
            } else if(x>=width){
                alpha=1
            } else{
                alpha = x/width;
            }
            alpha = formatNumber(alpha,2);
            setPickColor(new Color({
                r:color.r,
                g:color.g,
                b:color.b,
                a:alpha
            }))
            onChange?.(alpha)
        },
        calculate:()=>{
            return calculateAlphaOffset(colorRef,transformRef,color)
        }
    })
    return (
        <div ref={containerRef} className={classNames} onMouseDown={dragStartHandle}>
            <Transform ref={transformRef} offset={offset} >
                <Handler color={pickColor.toRgbString()} size={'small'}/>
            </Transform>
            <div ref={colorRef} className={`color-picker-panel-palette-gradient`} style={{
                background:`linear-gradient(to right, rgba(255,0,4,0),${color.toRgbString()})`
            }}></div>
        </div>
    )
}

export default PickAlpha
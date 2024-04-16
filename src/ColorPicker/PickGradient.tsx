import {FC, useRef} from "react";
import cs from "classnames"
import Handler from "./Handler.tsx";
import Transform from "./Transform.tsx";
import useColorDrag from "./useColorDrag.ts";
import {calculateHueOffset} from "./utils.ts";
import {PaletteProps} from "./interface.ts";
import {Color} from "./color.ts";

export interface PickGradientProps extends PaletteProps{
}

const PickGradient:FC<PickGradientProps> =({
   className,
   style,
   color,
   onChange,
   })=>{
    const classNames =cs('color-picker-panel-palette',className);
    const transformRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const colorRef =useRef<HTMLDivElement>(null)

    const [offset,dragStartHandle] = useColorDrag({
        containerRef,
        targetRef:transformRef,
        color,
        direction:'x',
        onDragChange(offsetValue){
          //计算色相
            let hue=0;
            const {width} = colorRef.current!.getBoundingClientRect();
            //处理边界情况
            if(offsetValue.x<0){
                hue=0
            } else if(offsetValue.x>width){
                hue=359
            } else{
                const percent = (offsetValue.x *100)/width
                hue= (360* percent)/100
            }
            onChange?.(new Color({
                h:hue,
                s:1,
                v:1
            }))
        },
        calculate:()=>{
            return calculateHueOffset(colorRef,transformRef,color)
        }
    })
    return (
        <div ref={containerRef} className={classNames} onMouseDown={dragStartHandle} style={style}>
            <Transform ref={transformRef} offset={offset} >
                <Handler color={color.toRgbString()} size={'small'}/>
            </Transform>
            <div ref={colorRef} className={`color-picker-panel-palette-gradient`} style={{
                background: `linear-gradient(to right, rgb(255, 0, 0), rgb(255, 255, 0), rgb(0, 255, 0), rgb(0, 255, 255), rgb(0, 0, 255), rgb(255, 0, 255), rgb(255, 0, 0))`
            }}></div>
        </div>
    )
}

export default PickGradient
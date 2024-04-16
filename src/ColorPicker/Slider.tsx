import {CSSProperties, FC} from "react";
import cs from "classnames"

export interface SliderProps{
    className?:string;
    style?:CSSProperties
}

const Slider:FC<SliderProps>=({className,style})=>{
    const classNames = cs('color-picker-panel-slider',className)
    return (
        <div className={classNames} style={style}>

        </div>
    )
}

export default Slider
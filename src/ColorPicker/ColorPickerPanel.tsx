import {CSSProperties, useEffect, useState} from "react"
import cs from "classnames"
import "./index.less"
import {ColorType} from "./interface.ts";
import {Color} from "./color.ts";
import PickSaturation from "./PickSaturation.tsx";
import PickGradient from "./PickGradient.tsx";
import PickAlpha from "./PickAlpha.tsx";

export interface ColorPickerProps{
    className?:string;
    style?:CSSProperties;
    //颜色类型用string不太好，我们应该设置一个颜色类，来实现RGB，HSL,HEX等的自由切换
    value?:ColorType;
    onChange?:(color:Color)=>void;
}

function ColorPickerPanel(props:ColorPickerProps){
    const {className,style,value,onChange} = props;

    //最终颜色
    const [colorValue,setColorValue] = useState<Color>(()=>{
        //是color类型返回，否则实例化一个Color类
        if(value instanceof Color){
            return value
        }
        return new Color(value)
    });

    //色相选择颜色
    const [hueColor,setHueColor] = useState<Color>(()=>{
        const color = value instanceof Color? value:new Color(value);
        return new Color({
            r:color.r,
            g:color.g,
            b:color.b,
            a:1
        })
    });
    //透明度块颜色
    const [alphaColor,setAlphaColor] = useState<Color>(()=>{
        return hueColor
    })
    //色块选择
    const [pickColor,setPickColor] = useState<Color>(()=>{
        const color = value instanceof Color? value:new Color(value);
        return color
    })
    const [alpha,setAlpha] = useState<number>(()=>{
        if(!value) return 1
        const color = value instanceof Color? value:new Color(value);
        return color.getAlpha()
    })

    const classNames = cs('color-picker',className);

    useEffect(()=>{
       const color = value instanceof Color ? value:new Color(value);
       setHueColor(new Color(color.toRgbString()))
    },[])

    //选择颜色
    function pickSaturationChange(color:Color){
        setAlphaColor(color)
        setPickColor(color)
    }

    //选择色相
    function pickHueChange(color:Color){
        setHueColor(color);
        // setPickColor(color)
        setAlphaColor(color);
    }

    //选择透明度
    function pickAlphaChange(alpha:number){
        setAlpha(alpha)
    }

    useEffect(() => {
        const newColor = new Color({
            r:pickColor.r,
            g:pickColor.g,
            b:pickColor.b,
            a:alpha
        });
        setColorValue(newColor);
        onChange?.(newColor)
    }, [pickColor,alpha]);


    return <div className={classNames} style={style}>
        <PickSaturation color={hueColor} onChange={pickSaturationChange}
                        className={`color-picker-panel-palette-select`}/>
        <div className="color-picker-panel-slider-container">
            <div className="color-picker-panel-slider-group">
                {/*    色相选择器*/}
                <PickGradient color={hueColor} style={{
                    marginBottom: '10px'
                }} onChange={pickHueChange}/>
                {/*    透明度选择器*/}
                <PickAlpha color={alphaColor} onChange={pickAlphaChange}/>
            </div>
            <div className="color-picker-panel-clock">
                <div className="color-picker-panel-clock-inner" style={{
                    background: `${colorValue.toPercentageRgbString()}`
                }}></div>
            </div>
        </div>
        {/*<div className={`color-picker-panel-input`}>*/}
        {/*    <input type={'text'} value={colorValue.toHexString()}/>*/}
        {/*    <input type={'number'} value={colorValue.getAlpha()}/>*/}
        {/*</div>*/}
    </div>
}

export default ColorPickerPanel
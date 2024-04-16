import { TransformOffset } from "./Transform";
import { Color } from "./color";
import React from "react";

//用 x/width 用 y/height 求出一个比例来
export const calculateColor = (props: {
    offset: TransformOffset;
    containerRef: React.RefObject<HTMLDivElement>;
    targetRef: React.RefObject<HTMLDivElement>;
    color: Color;
}): Color => {
    const { offset, targetRef, containerRef, color } = props;

    const { width, height } = containerRef.current!.getBoundingClientRect();
    const {
        width: targetWidth,
        height: targetHeight
    } = targetRef.current!.getBoundingClientRect();

    const centerOffsetX = targetWidth / 2;
    const centerOffsetY = targetHeight / 2;

    const saturation = (offset.x + centerOffsetX) / width;
    const lightness = 1 - (offset.y + centerOffsetY) / height;
    const hsv = color.toHsv();

    return new Color({
        h: hsv.h, //色相
        s: saturation <= 0 ? 0 : (saturation>=1 ? 1:saturation),//饱和度
        v: lightness >= 1 ? 1 : (lightness<=0? 0 :lightness),//亮度
        a:1
    });
}

//根据初始颜色，计算初始位置
export const calculateOffset = (
    containerRef: React.RefObject<HTMLDivElement>,
    targetRef: React.RefObject<HTMLDivElement>,
    color: Color
): TransformOffset => {
    const { width, height } = containerRef.current!.getBoundingClientRect();
    const {
        width: targetWidth,
        height: targetHeight
    } = targetRef.current!.getBoundingClientRect();
    const centerOffsetX = targetWidth / 2;
    const centerOffsetY = targetHeight / 2;
    const hsv = color.toHsv();

    return {
        x: hsv.s * width - centerOffsetX,
        y: (1 - hsv.v) * height - centerOffsetY,
    };
};

//计算色相选择器的偏移量
export const calculateHueOffset=(
    containerRef: React.RefObject<HTMLDivElement>,
    targetRef: React.RefObject<HTMLDivElement>,
    color:Color
)=>{
    const hue = color.toHsv().h;
    const { width:containerWidth, height:containerHeight } = containerRef.current!.getBoundingClientRect();
    const {
        width: targetWidth,
        height: targetHeight
    } = targetRef.current!.getBoundingClientRect();
    const centerOffsetX = targetWidth / 2;
    const centerOffsetY = targetHeight / 2;
    return {
        x:(hue/360)* containerWidth-centerOffsetX,
        y:containerHeight-centerOffsetY
    }
}

export const calculateAlphaOffset=(
    containerRef: React.RefObject<HTMLDivElement>,
    targetRef: React.RefObject<HTMLDivElement>,
    color:Color
)=>{
    const alpha = color.getAlpha()
    const { width:containerWidth, height:containerHeight } = containerRef.current!.getBoundingClientRect();
    const {
        width: targetWidth,
        height: targetHeight
    } = targetRef.current!.getBoundingClientRect();
    const centerOffsetX = targetWidth / 2;
    const centerOffsetY = targetHeight / 2;
    return {
        x:alpha* containerWidth-centerOffsetX,
        y:containerHeight-centerOffsetY
    }
}

export const formatNumber=(value:number,percision:number)=>{
    const res= parseFloat(value.toFixed(percision));
    return res;
}
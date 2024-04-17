import {TransformOffset} from "./Transform"
import React, {useEffect, useRef, useState} from "react";
import {Color} from "./color";

type EventType =
    | MouseEvent //这是ts内置的鼠标事件类型
    |React.MouseEvent<Element,MouseEvent> //react提供鼠标事件类型

type EventHandle=(e:EventType)=>void

interface useColorDragProps {
    offset?:TransformOffset;
    color:Color,
    containerRef:React.RefObject<HTMLDivElement>;
    targetRef:React.RefObject<HTMLDivElement>;
    direction?:'x'|'y';
    onDragChange?:(offset:TransformOffset)=>void;
    onColorChange?:(color:Color,offset:TransformOffset)=>void
    calculate?:()=>TransformOffset
}

function useColorDrag(
    props:useColorDragProps
):[TransformOffset,EventHandle]{
    const {
        offset,
        color,
        targetRef,
        containerRef,
        direction,
        onDragChange,
        onColorChange,
        calculate
    } = props;

    //保存offset信息
    const [offsetValue,setOffsetValue] = useState(offset|| {x:0,y:0});
    //is dragging? tip flag
    const dragRef = useRef({
        flag:false
    });

    useEffect(() => {
        if(!dragRef.current.flag){
            const calcOffset = calculate?.();
            if(calcOffset){
                setOffsetValue(calcOffset);
            }
            // onDragChange?.(offsetValue)
        }
    }, []);

    useEffect(() => {
        onColorChange?.(color,offsetValue)
    }, [color]);

    useEffect(() => {
        document.removeEventListener('mousemove',onDragMove);
        document.removeEventListener('mouseup',onDragStop);
    }, []);

    //更新拖动位置
    const updateOffset:EventHandle=e=>{
        const scrollXOffset = document.documentElement.scrollLeft || document.body.scrollLeft;
        const scrollYOffset = document.documentElement.scrollTop || document.body.scrollTop;

        //距离页面顶部和右边的距离，减去 scrollLeft 和 scrollTop 之后就是离可视区域顶部和左边的距离了。
        const pageX = e.pageX - scrollXOffset;
        const pageY = e.pageY - scrollYOffset;

        const {
            x: rectX,
            y: rectY,
            width,
            height
        } = containerRef.current!.getBoundingClientRect();

        //然后减去 handler 圆点点的半径。
        const {
            width: targetWidth,
            height: targetHeight
        } = targetRef.current!.getBoundingClientRect();

        //handler是个原点，我们要计算其真正的中心点
        const centerOffsetX = targetWidth /2;
        const centerOffsetY = targetHeight/2;

        //拖动不能超出 container 的区域，所以用 Math.max 来限制在 0 到 width、height 之间拖动
        const offsetX = Math.max(0, Math.min(pageX - rectX, width)) - centerOffsetX;
        const offsetY = Math.max(0, Math.min(pageY - rectY, height)) - centerOffsetY;

        const calcOffset = {
            x: offsetX,
            y: direction === 'x' ? offsetValue.y : offsetY,
        };

        setOffsetValue(calcOffset);
        onDragChange?.({
            x:direction === 'y'? 0 : calcOffset.x+centerOffsetX,
            y:direction ==='x'? 0: calcOffset.y+centerOffsetY
        });
    }

    //拖动结束了，移除事件，拖动标记置为false
    // @ts-ignore
    const onDragStop:EventHandle=e=>{
        document.removeEventListener('mousemove',onDragMove);
        document.removeEventListener('mouseup',onDragStop);
        targetRef.current!.style.cursor='default'
        dragRef.current.flag=false
    }

    //拖动时去更新位置信息
    const onDragMove: EventHandle = e => {
        targetRef.current!.style.cursor='pointer'
        e.preventDefault();
        updateOffset(e);
    };

    //拖动开始，添加事件，拖动标记置为true
    // @ts-expect-error
    const onDragStart: EventHandle = e => {
        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('mouseup', onDragStop);

        dragRef.current.flag = true;
    };

    return [offsetValue,onDragStart]
}

export default useColorDrag
import {FC} from "react";
import classNames from "classnames"

type HandlerSize = "default"|"small"

interface HandlerProps {
    size?:HandlerSize;
    color?:string;
}

const Handler:FC<HandlerProps>=({size='default',color})=>{
    return (<div className={classNames(`color-picker-panel-palette-handler`,{
        [`color-picker-panel-palette-handler-sm`]:size === 'small'
    })}
    style={{
        backgroundColor:color
    }}
    ></div>)
}

export default Handler
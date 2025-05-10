'use client'
import React from "react";
const Status = ({color = "",text}:any) => {
    return (
        <span  className={`text-xs text-white font-medium me-2 px-2 py-1 rounded   bg-${color}-600 ${!color ? " bg-orange-600" :""}`}>
            {text}
          </span>
    )
}
export default Status;
import React from 'react'

import "./Box.css"

export const Box = ({ value, onClick}) => {
    const style = value === "X" ? "box X" : "box O";
      return (
    <button className={style} onClick={onClick}>{value}</button>
  )
}

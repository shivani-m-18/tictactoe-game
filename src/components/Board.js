import React from 'react'

import { Box } from "./Box"
import "./Board.css"



export const Board = ({board, onClick,gameStarted}) => {
  return (
    <div className='board'>
      {board.map((value, idx) =>{
        return <Box key={idx} value={value} onClick={() =>  gameStarted && value === null && onClick(idx)}
        
        />
      })}
      
      </div>
      
  )
}

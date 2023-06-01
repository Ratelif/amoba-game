import React from 'react'
import "./Menu.css"

const Menu = ({resetGame}) => {
  
  const handleNewGame = ()=>{
   resetGame()
  }

  return (
    <div className='menu'>
      <button onClick={handleNewGame}>New Game</button>
    </div>
  )
}

export default Menu

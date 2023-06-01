import React from 'react'
import { useState } from 'react'
import "./GameBoard.css"
import Menu from './Menu'

const GameBoard = () => {
   const ROWS = 10
   const COLUMNS = 10
   const [board, setBoard] = useState(generateInitialState())
   const [symbol, setSymbol] = useState('X')
   const [winner, setWinner] = useState(null)

   function transpose(array) {                        
      return array[0].map((_, colIndex) => array.map(row => row[colIndex]));  // megfordítja a bord elemeit, sorokból oszlopok
   }  
   
   function generateInitialState() {         // alap state generálás 
      const initBoard = []
      for (let i = 0; i < ROWS; i++) {
         initBoard.push([])
         for (let j = 0; j < COLUMNS; j++) {
            initBoard[i].push(null)
         }         
      }
      return initBoard;
   } 

   const resetGame = ()=> {
      setBoard(generateInitialState())
      setSymbol("X")
      setWinner(null)
  }


//   ****************** WINNER CHECK **********************
  function getWinnerInRow(row) {
      let symbolCount = 0
      for (const cell of row) {
         if(cell === symbol){
            symbolCount++
         } else {
            symbolCount = 0
         }
         if(symbolCount === 5) {
            return symbol
         }
      }
      return null
  }

  function getWinnerInRowList(board) {
      for (const row of board) {
         const winner = getWinnerInRow(row)
         if(winner != null ) {
            return winner
         }
      }
      return null
  } 

  function getDiagonal(board, x, y) {
      let diag = []  
      while(Array.isArray(board[x]) && typeof board[x][y] !== "undefined") {
         diag.push(board[x][y])
         x++
         y++
      }
      return diag
  }

  function getWinner(board) {

      const boardTransposed = transpose(board)

      let diagList = [
         ...board,            // horizontal array
         ...boardTransposed,  // vertical array 
      ]
      
      // main diagonal
      // cross diagonal
      let boardR = board.map(row => [...row].reverse())     // megfordítja a tömb elemeinek sorrendjét


      // ÁTLÓK ÖSSZEGYÜJTÉSE
      diagList.push(getDiagonal(board, 0, 0))
      diagList.push(getDiagonal(boardR, 0, 0))
      
      let maxLen = Math.max(ROWS,COLUMNS)

      for (let i = 0; i < maxLen; i++) {
         diagList.push(getDiagonal(board, i, 0))
         diagList.push(getDiagonal(board, 0, i))
         diagList.push(getDiagonal(boardR, i, 0))
         diagList.push(getDiagonal(boardR, 0, i))
      }
      
      diagList = diagList.filter(num => num.length >= 5)

      return getWinnerInRowList(diagList)
  }
// *************** END OF WINNER CHECK ******************
   

  const handleCellClick = (e) => {

      const {row, col} = e.target.dataset
      console.log(row,col);
      if(board[row][col] !== null || winner !== null) return   // vizsgálat, történt-e már click oda
      const newBoard = JSON.parse(JSON.stringify(board))       // klónozni kell az eredeti board tömböt, amikor a referenciákat megváltoztatjuk(melyik tömb melyik elemre mutat) const newBoard = board nem jó !!!!
      newBoard[row][col] = symbol
      setWinner(getWinner(newBoard))
      setBoard(newBoard)
      setSymbol(symbol === "X" ? "O" : "X")
      
      // classList:
      console.log(e.currentTarget.classList);
   } 

   function generateRowJsx(row, rowIndex) {
      const cells = []
      for (let i = 0; i < row.length; i++) {
         let classList = "gomoku-cell"
         if(row[i] === null && winner === null) {
            classList += " empty"                              // ide kell a szóköz az empty elé!!!!!
         }
         cells.push(<td className={classList} key={rowIndex + "-" + i + "-" + row[i]} onClick={handleCellClick} data-row={rowIndex} data-col={i} >{row[i]}</td>)    // ez itt az a "row" amit átadunk a függvénynek meghíváskor
      }
      return (
         <tr key={JSON.stringify({row, rowIndex})}>
            {console.log(cells)}
            {cells}
         </tr>
      )
   }

   function generateBoardJsx() {                   // JÁTÉKTÉR GENERÁLÁSA
      const rows = []
      for (let i = 0; i < board.length; i++) {     // ez a useState board
         rows.push(generateRowJsx(board[i], i))         
      }
      return (
         <table className='gomoku-board'>
            <tbody>
               {/* {console.log(rows)} */}
               {rows}
            </tbody>
         </table>
      );
   }

   return (
      <div>
         <Menu resetGame = {resetGame}/>
         Győztes: {winner}
         {generateBoardJsx()}
      </div>
   )
}

export default GameBoard

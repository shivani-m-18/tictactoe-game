
import React, { useState } from 'react';
import PlayerForm from './components/PlayerForm';
import './App.css';
import { Board } from './components/Board';
import { ScoreBoard } from './components/ScoreBoard';
import { ResetButton } from './components/ResetButton';
import ModalDisplay from './components/ModalDisplay';
import Modal from 'react-modal';
import StatsModal from './components/StatsModal';

Modal.setAppElement('#root');

function App() {
  const Win_Conditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  const [board, setBoard] = useState(Array(9).fill(null));
  const [xPlaying, setXPlaying] = useState(true);
  const [scores, setScores] = useState({ xScore: 0, oScore: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false); 
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false); 
  const [playersStats, setPlayersStats] = useState([]);

  const [players, setPlayers] = useState({
    player1: { name: '', symbol: 'X' },
    player2: { name: '', symbol: 'O' },
  });
  const [gameStarted, setGameStarted] = useState(false);

  const handleBoxClick = async (boxIdx) => {
    if (board[boxIdx] || gameOver || !gameStarted) return;

    const updatedBoard = board.map((value, idx) => {
      if (idx === boxIdx) {
        return xPlaying ? "X" : "O";
      } else {
        return value;
      }
    });

    const winner = checkWinner(updatedBoard);

    if (winner) {
      setWinner(winner);
      setTimeout(() => setIsWinnerModalOpen(true), 1000); 

      if (winner === players.player2.symbol) {
        setScores({ ...scores, oScore: scores.oScore + 1 });
      } else if (winner === players.player1.symbol) {
        setScores({ ...scores, xScore: scores.xScore + 1 });
      }

      await updateMatchesWon(winner);
    }

    setBoard(updatedBoard);
    setXPlaying(!xPlaying);
  };

  const checkWinner = (board) => {
    for (let i = 0; i < Win_Conditions.length; i++) {
      const [x, y, z] = Win_Conditions[i];

      if (board[x] && board[x] === board[y] && board[x] === board[z]) {
        setGameOver(true);
        return board[x];  
      }
    }

    if (board.every((value) => value !== null)) {
      setGameOver(true);
      return "Draw";  
    }

    return null;
  };

  const resetBoard = () => {
    setGameOver(false);
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsWinnerModalOpen(false); 
    setGameStarted(false);
  };

  const handlePlayerSubmit = (playerData) => {
    setPlayers({
      player1: { name: playerData.player1.name, symbol: 'X' },
      player2: { name: playerData.player2.name, symbol: 'O' },
    });
    setGameStarted(true);
    submitPlayersToBackend(playerData);
  };

  const submitPlayersToBackend = async (playerData) => {
    try {
      const response = await fetch('http://localhost:5000/api/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          player1: { name: playerData.player1.name, symbol: 'X' },
          player2: { name: playerData.player2.name, symbol: 'O' }
        }),
      });

      const data = await response.json();
      console.log('Response from server:', data);
    } catch (error) {
      console.error('Error submitting player data:', error);
    }
  };

  const updateMatchesWon = async (winner) => {
    if (winner === "Draw") return;

    console.log('Updating matches won for:', winner);
    const winnerName = winner === players.player1.symbol ? players.player1.name : players.player2.name;
    try {
      const response = await fetch('http://localhost:5000/api/players/win', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ winnerName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Network response was not ok: ${response.status} - ${errorData.error}`);
      }

      const data = await response.json();
      console.log('Response from server:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchPlayersStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/players');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setPlayersStats(data);
    } catch (error) {
      console.error('Error fetching player stats:', error);
    }
  };

  const openStatsModal = () => {
    setIsStatsModalOpen(true);
    fetchPlayersStats(); 
  };

  const closeStatsModal = () => {
    setIsStatsModalOpen(false);
  };

  return (
    <div className="App">
    <div className="main-container">
      
        <PlayerForm onSubmit={handlePlayerSubmit} />
      </div>
      <div className="Boardcontainer">
       <div className="ScoreBoard">
        <ScoreBoard scores={scores} xPlaying={xPlaying} />
      </div>
      <div className="TicTacToeBoard">
        <Board board={board} onClick={handleBoxClick} gameStarted={gameStarted} />
      </div>
       <ResetButton resetBoard={resetBoard} />
      </div>
      <ModalDisplay isOpen={isWinnerModalOpen} winner={winner} winnerName={winner === "Draw" ? "Draw" : (winner === players.player1.symbol ? players.player1.name : players.player2.name)} onClose={resetBoard} />
       <button onClick={openStatsModal}>Show Player Stats</button>
      <StatsModal isOpen={isStatsModalOpen} onClose={closeStatsModal} playersStats={playersStats} />
    </div>
  );
}

export default App;

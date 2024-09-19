import React, { useState } from 'react';
import './PlayerForm.css';

const PlayerForm = ({ onSubmit }) => {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!player1 || !player2) {
      setError('Both player names are required');
      return;
    }

    const players = {
      player1: { name: player1, symbol: 'X' },
      player2: { name: player2, symbol: 'O' },
    };

    try {
      onSubmit(players);
      setError('');
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to submit player names');
    }
  };

  return (
    <form className="player-form" onSubmit={handleSubmit}>
      <h2>Enter Player Names</h2>
      <div className="input-group">
        <label htmlFor="player1">
          Player 1 (X):
          <input
            id="player1"
            type="text"
            value={player1}
            onChange={(e) => setPlayer1(e.target.value)}
            placeholder="Enter Player 1's name"
          />
        </label>
      </div>
      <div className="input-group">
        <label htmlFor="player2">
          Player 2 (O):
          <input
            id="player2"
            type="text"
            value={player2}
            onChange={(e) => setPlayer2(e.target.value)}
            placeholder="Enter Player 2's name"
          />
        </label>
      </div>
      <button type="submit" className="submit-button">Start Game</button>
      {error && <p className="error-message">{error}</p>}
    </form>
  );
};

export default PlayerForm;



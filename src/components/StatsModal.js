import React from 'react';
import './StatsModal.css'; 

const StatsModal = ({ isOpen, onClose, playersStats }) => {
  if (!isOpen) return null;

  return (
    <div className="stats-modal-overlay">
      <div className="stats-modal-content">
        <h2>Player Stats</h2>
        <table className="stats-modal-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Matches Played</th>
              <th>Matches Won</th>
            </tr>
          </thead>
          <tbody>
            {playersStats.map((player, index) => (
              <tr key={index}>
                <td>{player.name}</td>
                <td>{player.matchesPlayed}</td>
                <td>{player.matchesWon}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="stats-modal-close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default StatsModal;

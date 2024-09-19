
import React from 'react';
import Modal from 'react-modal';
import './ModalDisplay.css'; 

const ModalDisplay = ({ isOpen, winner,winnerName, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Game Over"
      className="Modal"       
      overlayClassName="Overlay"  
    >
      <div className="modal-content">
        <h2>{winner === "Draw" ? "It's a Draw!" : `${winnerName} Wins!`}</h2>
        <button onClick={onClose}>Close</button>
      </div>
    </Modal>
  );
};

export default ModalDisplay;

import React from "react";
import "./confirmModal.css";

function ConfirmModal({ title, message, description, onCancel, onConfirm, isOpen = true }) {
  if (!isOpen) return null; // não renderiza se fechado

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h4 className="modal-title">{title}</h4>
        <p className="modal-message">{message || description}</p>

        <div className="modal-buttons">
          <button className="btn-cancel" onClick={onCancel}>
            Cancelar
          </button>
          <button className="btn-confirm" onClick={onConfirm}>
            Apagar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;

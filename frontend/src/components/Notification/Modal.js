// Modal.js
import React from "react";
import "./Modal.css"; // Create this CSS file for styling the modal

// const Modal = ({ message, onClose }) => {
//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <h3>{message}</h3>
//         <button onClick={onClose}>Close</button>
//       </div>
//     </div>
//   );
// };

const Modal = ({ message, onClose, children, showCloseButton = true }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{message}</h3>
        <div>{children}</div> {/* Render additional content passed as children */}
        {showCloseButton && (
          <button className="modal-close-btn" onClick={onClose}>
            Close
          </button>
        )}
      </div>
    </div>
  );
};
export default Modal;

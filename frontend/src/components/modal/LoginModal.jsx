import Modal from "react-modal";
import "./LoginModal.css";

Modal.setAppElement("#root");

function LoginModal({ isOpen, onClose, children }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      closeTimeoutMS={300}
      contentLabel="Login Modal"
      style={{
        content: {
          border: "none",
          padding: "20px",
          backgroundColor: "rgba(249, 249, 249, 0)",
          overflow: "hidden",
          position: "static",
        },
        overlay: {
          backgroundColor: "rgba(249, 249, 249, 0.9)",
          zIndex: 9999,
        },
      }}
    >
      <button
        onClick={onClose}
        style={{
          float: "right",
          fontSize: "1rem",
          background: "transparent",
          border: "none",
          cursor: "pointer",
        }}
      >
        ✖️
      </button>
      {children}
    </Modal>
  );
}

export default LoginModal;

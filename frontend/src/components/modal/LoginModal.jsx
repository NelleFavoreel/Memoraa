import Modal from "react-modal";
import "./LoginModal.css";
import { color } from "three/tsl";

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
          backgroundColor: "rgba(60, 75, 100, 0)",
          overflow: "hidden",
          position: "static",
        },
        overlay: {
          backgroundColor: "rgba(60, 75, 100, 0.6)",
          zIndex: 9999,
        },
      }}
    >
      <button
        onClick={onClose}
        style={{
          float: "right",
          fontSize: "0.5rem",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: "white",
        }}
      >
        ❌
      </button>
      {children}
    </Modal>
  );
}

export default LoginModal;

import Modal from "react-modal";
import "./LoginModal.css";
Modal.setAppElement("#root");
import FullButton from "../button/FullButton";
function LoginModal({ isOpen, onClose, children }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Login Modal"
      style={{
        content: {
          top: "250px",
          left: "50%",
          right: "auto",
          bottom: "auto",
          transform: "translate(-50%, -50%)",
          maxWidth: "500px",
          border: "none",
          width: "80%",
          padding: "20px",
          backgroundColor: "rgba(28, 28, 28, 0)",
        },
        overlay: {
          backgroundColor: "rgba(28, 28, 28, 0.81)",
          zIndex: 9999,
        },
      }}
    >
      <button onClick={onClose} style={{ float: "right", fontSize: "1.5rem", background: "transparent", border: "none" }}>
        ×
      </button>
      {children}
    </Modal>
  );
}

export default LoginModal;

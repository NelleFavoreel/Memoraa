import Modal from "react-modal";
import "./LoginModal.css";
Modal.setAppElement("#root");
import FullButton from "../button/FullButton";
import DeleteButton from "../button/DeleteButton";
function LoginModal({ isOpen, onClose, children }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Login Modal"
      style={{
        content: {
          right: "auto",
          bottom: "auto",
          minWidth: "30%",
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
      <button onClick={onClose} style={{ float: "right", fontSize: "1rem", background: "transparent", border: "none" }}>
        ✖️
      </button>
      {children}
    </Modal>
  );
}

export default LoginModal;

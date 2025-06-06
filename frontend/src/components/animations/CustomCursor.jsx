// components/CustomCursor.js
import { motion } from "framer-motion";

function CustomCursor({ x, y }) {
  return (
    <motion.div className="custom-cursor" initial={{ opacity: 0 }} animate={{ opacity: 1, x: x - 25, y: y - 25 }} exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
      <span
        className="material-symbols-outlined"
        style={{
          fontVariationSettings: "'FILL' 0, 'wght' 700, 'GRAD' 0, 'opsz' 24",
          fontSize: "50px",
          color: "white",
        }}
      >
        arrow_forward_ios
      </span>
    </motion.div>
  );
}

export default CustomCursor;

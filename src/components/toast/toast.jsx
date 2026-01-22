import { useEffect } from "react";
import "./toast.css";

function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return <div className="toast">{message}</div>;
}

export default Toast;

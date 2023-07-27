import { toast } from "react-hot-toast";
import { AiFillCloseCircle } from "react-icons/ai";

export default function Toast(status, message, duration) {
  if (status === "error") {
    toast.error(
      (t) => (
        <span className="flex items-center gap-2">
          {message}
          <button onClick={() => toast.dismiss(t.id)}>
            <AiFillCloseCircle size={18} />
          </button>
        </span>
      ),
      {
        style: {
          fontSize: "12px",
        },
        duration,
      }
    );
  } else if (status === "success") {
    toast.success(
      (t) => (
        <span className="flex items-center gap-2">
          {message}
          <button onClick={() => toast.dismiss(t.id)}>
            <AiFillCloseCircle size={18} />
          </button>
        </span>
      ),
      {
        style: {
          fontSize: "12px",
        },
        duration,
      }
    );
  }
}

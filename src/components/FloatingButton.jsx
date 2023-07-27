import { useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import HandlePost from "./HandlePost";

const FloatingButton = ({ refetch }) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div>
      <button onClick={handleClick}>
        <AiOutlinePlusCircle
          size={48}
          className="text-white hover:text-slate-300 fixed bottom-4 right-4 shadow"
        />
      </button>
      {open && (
        <HandlePost
          onClose={() => setOpen(false)}
          name={"Create"}
          create={true}
          refetch={refetch}
        />
      )}
    </div>
  );
};

export default FloatingButton;

import { useState, useEffect } from "react";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import Toast from "../utils/Toast";

const LikeButton = ({ postId, refetch, token, like }) => {
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setIsLiked(like > 0);
  }, [like]);

  const handleLikes = async (id) => {
    try {
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);

      await axios(
        `${import.meta.env.VITE_APP_BASE_URL}/post/${
          newIsLiked ? "like" : "unlike"
        }/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (refetch) {
        refetch();
      }
    } catch (error) {
      Toast("error", error.response.data.message);
    }
  };

  return (
    <button onClick={() => handleLikes(postId)}>
      {isLiked ? (
        <FaHeart className="text-red-500" />
      ) : (
        <FaHeart className="text-slate-100" />
      )}
    </button>
  );
};

export default LikeButton;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHeart } from "react-icons/fa";

const LikeButton = ({ postId, refetch, token, like }) => {
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    const likesFromStorage = localStorage.getItem("likes");
    if (likesFromStorage) {
      setLikes(JSON.parse(likesFromStorage));
    }
  }, []);

  useEffect(() => {
    // Update Local Storage when 'likes' state changes
    localStorage.setItem("likes", JSON.stringify(likes));
  }, [likes]);

  const handleLikes = async (id) => {
    try {
      const endpoint = likes.includes(id) ? "unlike" : "like";

      await axios(
        `${import.meta.env.VITE_APP_BASE_URL}/post/${endpoint}/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (endpoint === "like") {
        setLikes([...likes, id]);
      } else {
        setLikes(likes.filter((item) => item !== id));
      }

      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const isPostLikedByCurrentUser = (postId) => {
    return likes.includes(postId);
  };

  return (
    <button onClick={() => handleLikes(postId)}>
      {isPostLikedByCurrentUser(postId) ? (
        <FaHeart className="text-red-500" />
      ) : (
        <FaHeart className="text-slate-100" />
      )}
    </button>
  );
};

export default LikeButton;

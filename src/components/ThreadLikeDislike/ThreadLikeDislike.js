import React, { useState, useEffect } from "react";
import {
  doc,
  updateDoc,
  increment,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../../firebase";
import { auth } from "../../firebase";

const ThreadLikeDislike = ({
  threadId,
  initialLikes,
  likedByUser,
  onUpdate,
  userName,
}) => {
  const [isLiked, setIsLiked] = useState(likedByUser);
  const [likes, setLikes] = useState(initialLikes);
  const user = auth.currentUser;

  useEffect(() => {
    setIsLiked(likedByUser);
  }, [likedByUser]);

  const toggleLike = async () => {
    try {
      if (!user) throw new Error("User not authenticated");
      const userRef = doc(db, "users", userName);
      const threadRef = doc(userRef, "threads", threadId);

      if (isLiked) {
        await updateDoc(threadRef, {
          likes: increment(-1),
          likesList: arrayRemove(user.displayName),
        });
        setLikes(likes - 1);
      } else {
        await updateDoc(threadRef, {
          likes: increment(1),
          likesList: arrayUnion(user.displayName),
        });
        setLikes(likes + 1);
      }

      setIsLiked(!isLiked);
      onUpdate();
    } catch (error) {
      console.error("Error updating thread likes: ", error);
    }
  };

  return (
    <div>
      <button
        onClick={toggleLike}
        style={{ backgroundColor: isLiked ? "red" : "green" }}
      >
        {isLiked ? "Dislike" : "Like"}
      </button>
    </div>
  );
};

export default ThreadLikeDislike;

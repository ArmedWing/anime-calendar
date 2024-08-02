// ThreadLikeDislike.jsx
import React, { useState, useEffect } from "react";
import {
  doc,
  updateDoc,
  increment,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../../firebase"; // Adjust the import as needed
import { auth } from "../../firebase"; // Adjust the import as needed

const ThreadLikeDislike = ({
  threadId,
  initialLikes,
  likedByUser,
  onUpdate,
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

      const userRef = doc(db, "users", user.displayName);
      const threadRef = doc(userRef, "threads", threadId);

      if (isLiked) {
        // Unlike the thread
        await updateDoc(threadRef, {
          likes: increment(-1),
          likesList: arrayRemove(user.displayName),
        });
        setLikes(likes - 1);
      } else {
        // Like the thread
        await updateDoc(threadRef, {
          likes: increment(1),
          likesList: arrayUnion(user.displayName),
        });
        setLikes(likes + 1);
      }

      setIsLiked(!isLiked);
      onUpdate(); // Call the parent function to refresh or update the state
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

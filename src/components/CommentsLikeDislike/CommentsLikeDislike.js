import React, { useState, useEffect } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { auth } from "../../firebase";

const CommentLikeDislike = ({
  threadId,
  commentId,
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

      const threadSnap = await getDoc(threadRef);
      const threadData = threadSnap.data();
      const comments = threadData?.comments || [];

      const commentIndex = comments.findIndex(
        (comment) => comment.id === commentId
      );
      if (commentIndex === -1) {
        throw new Error("Comment not found");
      }

      const comment = comments[commentIndex];
      const updatedLikes = isLiked ? comment.likes - 1 : comment.likes + 1;

      comments[commentIndex] = {
        ...comment,
        likes: updatedLikes,
        likesList: isLiked
          ? comment.likesList.filter(
              (userName) => userName !== user.displayName
            )
          : [...comment.likesList, user.displayName],
      };

      const updateData = {
        comments: comments,
      };

      await updateDoc(threadRef, updateData);

      setLikes(updatedLikes);
      setIsLiked(!isLiked);

      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error updating comment likes: ", error);
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

export default CommentLikeDislike;

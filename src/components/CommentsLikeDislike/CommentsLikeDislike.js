import React, { useState, useEffect } from "react";
import {
  doc,
  updateDoc,
  increment,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase"; // Adjust the import as needed
import { auth } from "../../firebase"; // Adjust the import as needed

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

      // Fetch the current thread data
      const threadSnap = await getDoc(threadRef);
      const threadData = threadSnap.data();
      const comments = threadData?.comments || [];

      // Find the index of the comment to update
      const commentIndex = comments.findIndex((comment) => comment.id === commentId);
      if (commentIndex === -1) {
        throw new Error("Comment not found");
      }

      const comment = comments[commentIndex];
      const updatedLikes = isLiked ? comment.likes - 1 : comment.likes + 1;

      // Update the comment with new likes
      comments[commentIndex] = {
        ...comment,
        likes: updatedLikes,
        likesList: isLiked
          ? comment.likesList.filter(userName => userName !== user.displayName)
          : [...comment.likesList, user.displayName]
      };

      // Prepare update data
      const updateData = {
        comments: comments,
      };

      // Update the document
      await updateDoc(threadRef, updateData);

      // Update local state
      setLikes(updatedLikes);
      setIsLiked(!isLiked);

      // Notify parent component of the update
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
      <p>Likes: {likes}</p>
    </div>
  );
};

export default CommentLikeDislike;

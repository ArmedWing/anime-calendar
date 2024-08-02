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

      const threadSnap = await getDoc(threadRef);
      const threadData = threadSnap.data();
      const comments = threadData?.comments || [];

      // Function to find and update the comment or reply
      const updateLikes = (commentsArray, targetId) => {
        return commentsArray.map((comment) => {
          if (comment.id === targetId) {
            const updatedLikes = isLiked
              ? comment.likes - 1
              : comment.likes + 1;
            return {
              ...comment,
              likes: updatedLikes,
              likesList: isLiked
                ? comment.likesList.filter(
                    (userName) => userName !== user.displayName
                  )
                : [...comment.likesList, user.displayName],
            };
          } else if (comment.replies && Array.isArray(comment.replies)) {
            return {
              ...comment,
              replies: updateLikes(comment.replies, targetId), // Recursive call for nested replies
            };
          }
          return comment;
        });
      };

      const updatedComments = updateLikes(comments, commentId);

      await updateDoc(threadRef, { comments: updatedComments });

      setLikes(isLiked ? likes - 1 : likes + 1);
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

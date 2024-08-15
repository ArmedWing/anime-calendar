// import React, { useState, useEffect, useContext } from "react";
// import { doc, updateDoc, getDoc } from "firebase/firestore";
// import { db } from "../../firebase";
// import { auth } from "../../firebase";
// import ErrorContext from "../../context/ErrorContext";

// const CommentLikeDislike = ({
//   threadId,
//   commentId,
//   initialLikes,
//   likedByUser,
//   onUpdate,
//   userName,
// }) => {
//   const [isLiked, setIsLiked] = useState(likedByUser);
//   const [likes, setLikes] = useState(initialLikes);
//   const { handleError } = useContext(ErrorContext);
//   const user = auth.currentUser;

//   useEffect(() => {
//     setIsLiked(likedByUser);
//   }, [likedByUser]);

//   const toggleLike = async () => {
//     try {
//       if (!user) throw new Error("User not authenticated");

//       const userRef = doc(db, "users", userName);
//       const threadRef = doc(userRef, "threads", threadId);
//       const threadSnap = await getDoc(threadRef);
//       const threadData = threadSnap.data();
//       const comments = threadData?.comments || [];

//       const updateLikes = (commentsArray, targetId) => {
//         return commentsArray.map((comment) => {
//           if (comment.id === targetId) {

//             const likesList = Array.isArray(comment.likesList)
//               ? comment.likesList
//               : [];

//             const updatedLikes = isLiked
//               ? comment.likes - 1
//               : comment.likes + 1;

//             return {
//               ...comment,
//               likes: updatedLikes,
//               likesList: isLiked
//                 ? likesList.filter((userName) => userName !== user.displayName)
//                 : [...likesList, user.displayName],
//             };
//           } else if (comment.replies && Array.isArray(comment.replies)) {
//             return {
//               ...comment,
//               replies: updateLikes(comment.replies, targetId),
//             };
//           }
//           return comment;
//         });
//       };

//       const updatedComments = updateLikes(comments, commentId);

//       await updateDoc(threadRef, { comments: updatedComments });

//       setLikes(isLiked ? likes - 1 : likes + 1);
//       setIsLiked(!isLiked);

//       if (onUpdate) onUpdate();
//     } catch (error) {
//       handleError(error.message);
//     }
//   };

//   return (
//     <div>
//       <button
//         onClick={toggleLike}
//         style={{ backgroundColor: isLiked ? "red" : "green" }}
//       >
//         {isLiked ? "Dislike" : "Like"}
//       </button>
//     </div>
//   );
// };

// export default CommentLikeDislike;

import React, { useState, useEffect, useContext } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { auth } from "../../firebase";
import ErrorContext from "../../context/ErrorContext";

const CommentLikeDislike = ({
  threadId,
  commentId,
  initialLikes,
  likedByUser,
  onUpdate,
  userName,
  isReply = false, // Added prop to distinguish if it's a reply
}) => {
  const [isLiked, setIsLiked] = useState(likedByUser);
  const [likes, setLikes] = useState(initialLikes);
  const { handleError } = useContext(ErrorContext);
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

      const updateLikes = (commentsArray, targetId) => {
        return commentsArray.map((comment) => {
          if (comment.id === targetId) {
            const likesList = Array.isArray(comment.likesList)
              ? comment.likesList
              : [];

            const updatedLikes = isLiked
              ? comment.likes - 1
              : comment.likes + 1;

            return {
              ...comment,
              likes: updatedLikes,
              likesList: isLiked
                ? likesList.filter((userName) => userName !== user.displayName)
                : [...likesList, user.displayName],
            };
          } else if (comment.replies && Array.isArray(comment.replies)) {
            return {
              ...comment,
              replies: updateLikes(comment.replies, targetId),
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
      handleError(error.message);
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

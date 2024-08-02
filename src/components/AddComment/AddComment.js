import React, { useState, useEffect } from "react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../firebase";
import { useId } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";

const AddComment = ({
  thread,
  parentComment = null,
  commentToEdit = null,
  onUpdate,
  onCancel,
}) => {
  const [user] = useAuthState(auth);
  const [addComment, setAddComment] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const commentId = useId();

  useEffect(() => {
    const today = new Date().toString().slice(0, 21);
    setCurrentDate(today);

    if (commentToEdit) {
      setAddComment(commentToEdit.comment);
    } else {
      setAddComment("");
    }
  }, [thread, parentComment, commentToEdit]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const threadRef = doc(
        db,
        "users",
        thread.username,
        "threads",
        thread.id
      );

      if (commentToEdit) {
        const updatedComments = updateComment(
          thread.comments || [],
          commentToEdit,
          addComment
        );
        await updateDoc(threadRef, { comments: updatedComments });
      } else if (parentComment) {
        const updatedComments = addReply(thread.comments || [], parentComment, {
          user: user.displayName,
          comment: addComment,
          id: commentId,
          likes: 0,
          likesList: [],
          date: currentDate,
        });
        await updateDoc(threadRef, { comments: updatedComments });
      } else {
        const newComment = {
          user: user.displayName,
          comment: addComment,
          id: commentId,
          likes: 0,
          likesList: [],
          date: currentDate,
        };
        await updateDoc(threadRef, {
          comments: arrayUnion(newComment),
        });
      }

      onUpdate();
    } catch (error) {
      alert("Error updating document: " + error.message);
    }
  };

  const updateComment = (comments, commentToUpdate, newCommentText) => {
    return comments.map((comment) => {
      if (comment.id === commentToUpdate.id) {
        return {
          ...comment,
          comment: newCommentText,
        };
      } else {
        return {
          ...comment,
          replies: comment.replies
            ? updateComment(comment.replies, commentToUpdate, newCommentText)
            : [],
        };
      }
    });
  };

  const addReply = (comments, parent, newReply) => {
    return comments.map((comment) => {
      if (comment.id === parent.id) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply],
        };
      } else {
        return {
          ...comment,
          replies: comment.replies
            ? addReply(comment.replies, parent, newReply)
            : [],
        };
      }
    });
  };

  return (
    <div className="edit-modal">
      <div className="edit-modal-content">
        <h2>
          {commentToEdit
            ? "Edit Comment"
            : parentComment
            ? "Reply to Comment"
            : "Add Comment"}
        </h2>
        <form onSubmit={handleUpdate}>
          <div>
            <label htmlFor="commentText">Text</label>
            <textarea
              id="commentText"
              value={addComment}
              onChange={(e) => setAddComment(e.target.value)}
              required
            />
          </div>
          <button type="submit">
            {commentToEdit
              ? "Save"
              : parentComment
              ? "Add Reply"
              : "Add Comment"}
          </button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddComment;

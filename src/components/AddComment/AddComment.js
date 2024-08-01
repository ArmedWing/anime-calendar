import React, { useState, useEffect } from "react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../firebase";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";

const AddComment = ({ thread, onUpdate, onCancel }) => {
  const [user] = useAuthState(auth);
  const [addComment, setAddComment] = useState("");

  useEffect(() => {
    if (thread) {
      setAddComment("");
    }
  }, [thread]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const threadRef = doc(
        db,
        "users",
        user.displayName,
        "threads",
        thread.id
      );
      await updateDoc(threadRef, {
        comments: arrayUnion({ user: user.displayName, comment: addComment }),
      });
      onUpdate();
    } catch (error) {
      alert("Error updating document: " + error.message);
    }
  };

  return (
    <div className="edit-modal">
      <div className="edit-modal-content">
        <h2>Add Comment</h2>
        <form onSubmit={handleUpdate}>
          <div>
            <label htmlFor="editText">Text</label>
            <textarea
              id="editText"
              value={addComment}
              onChange={(e) => setAddComment(e.target.value)}
              required
            />
          </div>
          <button type="submit">Add Comment</button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddComment;

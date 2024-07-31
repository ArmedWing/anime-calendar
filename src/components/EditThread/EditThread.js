import React, { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import "./EditThread.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";

const EditThread = ({ thread, onUpdate, onCancel }) => {
  const [editTitle, setEditTitle] = useState("");
  const [editText, setEditText] = useState("");
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (thread) {
      setEditTitle(thread.title);
      setEditText(thread.text);
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
        title: editTitle,
        text: editText,
      });
      onUpdate();
    } catch (error) {
      alert("Error updating document: " + error.message);
      console.log(user);
    }
  };

  return (
    <div className="edit-modal">
      <div className="edit-modal-content">
        <h2>Edit Thread</h2>
        <form onSubmit={handleUpdate}>
          <div>
            <label htmlFor="editTitle">Title</label>
            <input
              type="text"
              id="editTitle"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="editText">Text</label>
            <textarea
              id="editText"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              required
            />
          </div>
          <button type="submit">Update Thread</button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditThread;

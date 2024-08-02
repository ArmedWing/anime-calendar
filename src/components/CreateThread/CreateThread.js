import { useState, useEffect } from "react";
import { addDoc, doc, collection, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";

const CreateThread = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const today = new Date().toString().slice(0, 21);
    setCurrentDate(today);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userRef = doc(db, "users", user.displayName);
      const threadsCollectionRef = collection(userRef, "threads");

      await addDoc(threadsCollectionRef, {
        title: title,
        text: text,
        date: currentDate,
        username: user.displayName,
        likes: 0,
      });
    } catch (error) {
      alert(error);
    }
    setTitle();
    setText();

    navigate("/forum");
  };

  const handleCancel = () => {
    navigate("/forum");
  };
  return (
    <div>
      <h2 className="threadTitle">Create a Thread</h2>
      <form className="threadForm" onSubmit={handleSubmit}>
        <div className="threadContainer">
          <label htmlFor="thread">Title</label>
          <input
            type="text"
            name="threadTitle"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label htmlFor="thread">Text</label>
          <textarea
            name="threadText"
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <button type="submit" className="createThreadBtn">
          CREATE THREAD
        </button>
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
};
export default CreateThread;

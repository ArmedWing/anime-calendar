import { useState, useEffect, useContext } from "react";
import { addDoc, doc, collection, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import ErrorContext from "../../context/ErrorContext";

const CreateThread = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const { handleError } = useContext(ErrorContext);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const today = new Date().toString().slice(0, 21);
    setCurrentDate(today);
  }, []);

  const validateForm = () => {
    const errors = {};

    if (title.trim().length < 5) {
      errors.title = "Title must be at least 5 characters long.";
    }

    if (text.trim().length < 10) {
      errors.text = "Text must be at least 10 characters long.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

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
      handleError(error.message);
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
          {errors.title && <p className="error">{errors.title}</p>}

          <label htmlFor="thread">Text</label>
          <textarea
            name="threadText"
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {errors.text && <p className="error">{errors.text}</p>}
        </div>
        <button type="submit" className="createThreadBtn">
          CREATE THREAD
        </button>
        <button type="button" onClick={handleCancel} className="cancelBtn">
          Cancel
        </button>
      </form>
    </div>
  );
};
export default CreateThread;

import { useState } from "react";
import { addDoc, doc, collection, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import { db } from "../../firebase";

const CreateThread = () => {
  const [user] = useAuthState(auth);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [threads, setThreads] = useState([]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userRef = doc(db, "users", user.displayName);
      const threadsCollectionRef = collection(userRef, "threads");

      await addDoc(threadsCollectionRef, {
        title: title,
        text: text,
      });
    } catch (error) {
      alert(error);
    }
    console.log(user);
    console.log({ title });
    console.log({ text });
    setTitle();
    setText();
  };
  return (
    <div>
      <h2 className="threadTitle">Create a Thread</h2>
      <form className="threadForm" onSubmit={handleSubmit}>
        <div className="threadContainer">
          <label htmlFor="thread">Title</label>
          <input
            type="text"
            name="thread"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label htmlFor="thread">Text</label>
          <input
            type="text"
            name="thread"
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <button type="submit" className="createThreadBtn">
          CREATE THREAD
        </button>
      </form>
    </div>
  );
};
export default CreateThread;

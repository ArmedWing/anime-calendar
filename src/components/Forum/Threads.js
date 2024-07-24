import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  limit,
  query,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";

const Threads = () => {
  const navigate = useNavigate();
  const createThread = () => {
    navigate("/create-thread");
  };

  const [user] = useAuthState(auth);
  const [threads, setThreads] = useState([]);

  const fetchThreads = useCallback(async () => {
    try {
      const userRef = doc(db, "users", user.displayName);
      const threadsCollectionRef = collection(userRef, "threads");
      const querySnapshot = await getDocs(threadsCollectionRef);
      const threadsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setThreads(threadsList);
    } catch (e) {
      alert("Error fetching documents: ", e.message);
    }
  }, [threads]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  return (
    <div>
      <button onClick={() => createThread()}>Create Thread</button>
      <h1>All Threads</h1>
      <div className="threads">
        {threads && threads.length > 0 ? (
          threads.map((thread) => (
            <div key={thread.id} className="thread">
              <h2>{thread.title}</h2>
              <p>{thread.text}</p>
            </div>
          ))
        ) : (
          <p>No threads available.</p>
        )}
      </div>
    </div>
  );
};

export default Threads;

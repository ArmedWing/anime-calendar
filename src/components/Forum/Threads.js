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
  const [users, setUsers] = useState([]);

  const fetchThreads = useCallback(async () => {
    try {
      // Fetch all users
      const usersCollectionRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollectionRef);
      const usersList = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);

      // Fetch threads for each user
      let allThreads = [];
      for (const user of usersList) {
        const threadsCollectionRef = collection(
          db,
          "users",
          user.id,
          "threads"
        );
        const threadsSnapshot = await getDocs(threadsCollectionRef);
        const userThreads = threadsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        allThreads = allThreads.concat(userThreads);
      }

      setThreads(allThreads);
    } catch (e) {
      alert("Error fetching documents: " + e.message);
    }
  }, [threads]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  return (
    <div>
      <button onClick={createThread}>Create Thread</button>
      <h1>All Threads</h1>

      <div className="threads">
        {threads && threads.length > 0 ? (
          threads.map((thread) => (
            <div key={thread.id} className="thread">
              <h1>Posted by: {thread.username}</h1>
              <h2>Title: {thread.title}</h2>
              <p>{thread.text}</p>
              <p>Posted: {thread.date}</p>
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

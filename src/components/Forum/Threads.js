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
import EditThread from "../EditThread/EditThread";

const Threads = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [threads, setThreads] = useState([]);
  const [users, setUsers] = useState([]);
  const [likes, setLikes] = useState({});
  const [editingThread, setEditingThread] = useState(null);
  const createThread = () => {
    navigate("/create-thread");
  };

  const addLike = async (thread) => {
    try {
      const newLikes = thread.likes + 1;
      const userRef = doc(db, "users", user.displayName);
      const threadRef = doc(userRef, "threads", thread.id);

      await updateDoc(threadRef, { likes: newLikes });
      setThreads((prevThreads) =>
        prevThreads.map((t) =>
          t.id === thread.id ? { ...t, likes: newLikes } : t
        )
      );
      setLikes((prevLikes) => ({ ...prevLikes, [thread.id]: true }));
    } catch (error) {
      alert("Error updating likes:", error);
    }
  };

  const unlike = async (thread) => {
    try {
      const newLikes = thread.likes - 1;
      const userRef = doc(db, "users", user.displayName);
      const threadRef = doc(userRef, "threads", thread.id);

      await updateDoc(threadRef, { likes: newLikes });
      setThreads((prevThreads) =>
        prevThreads.map((t) =>
          t.id === thread.id ? { ...t, likes: newLikes } : t
        )
      );
      setLikes((prevLikes) => ({ ...prevLikes, [thread.id]: false }));
    } catch (error) {
      alert("Error updating likes:", error);
    }
  };

  const DeleteThread = async (key) => {
    const usersRef = doc(db, "users", user.displayName);
    const currentThread = threads.find((thread) => thread.id === key);
    await deleteDoc(doc(usersRef, "threads", `${currentThread.id}`));

    alert("Thread deleted");
    console.log(currentThread);
  };

  const fetchThreads = useCallback(async () => {
    try {
      const usersCollectionRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollectionRef);
      const usersList = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);

      let allThreads = [];
      const maxThreads = 3; // total number of threads to fetch
      let fetchedThreads = 0;

      for (const user of usersList) {
        if (fetchedThreads >= maxThreads) break;

        const threadsCollectionRef = collection(
          db,
          "users",
          user.id,
          "threads"
        );
        const threadsQuery = query(
          threadsCollectionRef,
          limit(maxThreads - fetchedThreads)
        );
        const threadsSnapshot = await getDocs(threadsQuery);
        const userThreads = threadsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        allThreads = allThreads.concat(userThreads);
        fetchedThreads += userThreads.length;
      }

      setThreads(allThreads.slice(0, maxThreads));
    } catch (e) {
      alert("Error fetching documents: " + e.message);
    }
  }, [threads]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  const handleEdit = (thread) => {
    setEditingThread(thread);
  };

  const handleUpdate = () => {
    setEditingThread(null);
    fetchThreads();
  };

  const handleCancel = () => {
    setEditingThread(null);
  };

  return (
    <div className="container">
      <button onClick={createThread}>Create Thread</button>
      <h1 className="page-title">All Threads</h1>

      <div className="threads">
        {threads && threads.length > 0 ? (
          threads.map((thread) => (
            <div key={thread.id} className="thread">
              <h1>Posted by: {thread.username}</h1>
              <h2>Title: {thread.title}</h2>
              <p>{thread.text}</p>
              <p>Posted: {thread.date}</p>
              <p>Likes: {thread.likes}</p>
              {thread.username === user.displayName && (
                <div>
                  <button onClick={() => handleEdit(thread)}>
                    Edit Thread
                  </button>
                  <button
                    key={thread.id}
                    onClick={() => DeleteThread(thread.id)}
                  >
                    Delete Thread
                  </button>
                  {likes[thread.id] ? (
                    <button
                      onClick={() => unlike(thread)}
                      style={{ backgroundColor: "red" }}
                    >
                      Unlike
                    </button>
                  ) : (
                    <button onClick={() => addLike(thread)}>Like</button>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No threads available.</p>
        )}
      </div>
      {editingThread && (
        <EditThread
          thread={editingThread}
          onUpdate={handleUpdate}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default Threads;

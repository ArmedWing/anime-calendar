import { useEffect, useState, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  limit,
  query,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faThumbsUp, faComment } from "@fortawesome/free-solid-svg-icons";
import ErrorContext from "../../context/ErrorContext";
import ThreadLikeDislike from "../ThreadLikeDislike/ThreadLikeDislike";
import EditThread from "../EditThread/EditThread";

library.add(faThumbsUp, faComment);

const Threads = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [threads, setThreads] = useState([]);
  const [users, setUsers] = useState([]);
  const [deletionMessage, setDeletionMessage] = useState("");
  const { handleError } = useContext(ErrorContext);
  const [editingThread, setEditingThread] = useState(null);

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
      const maxThreads = 6;
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
      handleError(e.message);
    }
  }, [handleError, threads]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  const DeleteThread = async (key) => {
    const usersRef = doc(db, "users", user.displayName);
    const currentThread = threads.find((thread) => thread.id === key);
    await deleteDoc(doc(usersRef, "threads", `${currentThread.id}`));
    setDeletionMessage("Thread deleted");
    setTimeout(() => {
      setDeletionMessage("");
    }, 2000);
  };

  const handleThreadUpdate = () => {
    fetchThreads();
  };

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
      <button onClick={() => navigate("/create-thread")}>Create Thread</button>
      <h1 className="page-title">All Threads</h1>

      {deletionMessage && (
        <div className="deletion-message">{deletionMessage}</div>
      )}

      <div className="threads">
        {threads && threads.length > 0 ? (
          threads.map((thread) => (
            <div key={thread.id} className="thread">
              <h2>
                <a href={`/threads/${thread.username}/${thread.id}`}>
                  {thread.title}
                </a>
              </h2>
              <article className="textArea">{thread.text}</article>
              <p>
                Posted: {thread.date} by {thread.username}
              </p>
              <p>
                <FontAwesomeIcon icon="thumbs-up" className="icon-large" />{" "}
                <span className="counter-large"> {thread.likes}</span>{" "}
                <FontAwesomeIcon icon="comment" className="icon-large" />{" "}
                <span className="counter-large">
                  {thread.comments?.length || 0}
                </span>
              </p>
              {thread.username === user.displayName ? (
                <div className="actionBtns">
                  <button onClick={() => handleEdit(thread)}>Edit</button>
                  <button onClick={() => DeleteThread(thread.id)}>
                    Delete
                  </button>
                  <ThreadLikeDislike
                    userName={thread.username}
                    threadId={thread.id}
                    initialLikes={thread.likes}
                    likedByUser={
                      thread.likesList &&
                      thread.likesList.includes(user.displayName)
                    }
                    onUpdate={handleThreadUpdate}
                  />
                </div>
              ) : (
                <ThreadLikeDislike
                  userName={thread.username}
                  threadId={thread.id}
                  initialLikes={thread.likes}
                  likedByUser={
                    thread.likesList &&
                    thread.likesList.includes(user.displayName)
                  }
                  onUpdate={handleThreadUpdate}
                />
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

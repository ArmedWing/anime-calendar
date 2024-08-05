import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  limit,
  query,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import EditThread from "../EditThread/EditThread";
import AddComment from "../AddComment/AddComment";
import ThreadLikeDislike from "../ThreadLikeDislike/ThreadLikeDislike";
import CommentLikeDislike from "../CommentsLikeDislike/CommentsLikeDislike";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { faComment } from "@fortawesome/free-solid-svg-icons";
// import { faComment } from "@fortawesome/free-regular-svg-icons";

const Threads = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [threads, setThreads] = useState([]);
  const [users, setUsers] = useState([]);
  const [likes, setLikes] = useState({});
  const [editingThread, setEditingThread] = useState(null);
  const [addComment, setAddComment] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [editComment, setEditComment] = useState(null);
  const [showComments, setShowComments] = useState(false);
  library.add(faThumbsUp);
  library.add(faComment);

  const createThread = () => {
    navigate("/create-thread");
  };

  const DeleteComment = async (thread, commentId) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const usersRef = doc(db, "users", user.displayName);
      const threadRef = doc(usersRef, "threads", thread);
      const threadSnap = await getDoc(threadRef);

      if (!threadSnap.exists()) throw new Error("Thread not found");

      const threadData = threadSnap.data();
      let comments = threadData.comments || [];

      // Function to recursively remove a comment or reply by ID
      const removeCommentOrReply = (commentsArray, targetId) => {
        return commentsArray
          .map((comment) => {
            if (comment.id === targetId) {
              return null;
            } else if (comment.replies && Array.isArray(comment.replies)) {
              // Recursively handle nested replies
              comment.replies = removeCommentOrReply(comment.replies, targetId);
            }
            return comment;
          })
          .filter((comment) => comment !== null); // Filter out the deleted comments
      };

      comments = removeCommentOrReply(comments, commentId);

      await updateDoc(threadRef, { comments });

      console.log("Comment/reply deleted successfully");
    } catch (error) {
      console.error("Error deleting comment/reply: ", error);
      console.log(thread);
      alert("Error deleting comment/reply: " + error.message);
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

  const handleComment = (
    thread,
    parentComment = null,
    commentToEdit = null
  ) => {
    setAddComment(thread);
    setReplyTo(parentComment);
    setEditComment(commentToEdit);
  };

  const handleUpdate = () => {
    setEditingThread(null);
    setAddComment(null);
    setReplyTo(null);
    setEditComment(null);
    fetchThreads();
  };

  const handleCancel = () => {
    setEditingThread(null);
    setAddComment(null);
    setReplyTo(null);
    setEditComment(null);
  };

  const handleThreadUpdate = () => {
    fetchThreads();
  };

  const handleCommentUpdate = () => {
    fetchThreads();
  };

  const renderComments = (comments, thread, replyTo = null) => {
    if (!comments) return null;

    return comments.map((comment, index) => (
      <div
        key={index}
        className="comment-container"
        style={{ marginLeft: replyTo ? "20px" : "0" }}
      >
        <div className="comment">
          <article className="textArea">{comment.comment}</article>

          <p>
            Posted: {comment.date} by {comment.user}
          </p>
          <p>
            <FontAwesomeIcon icon="thumbs-up" /> {comment.likes}
          </p>
          {thread.username === user.displayName ? (
            <div className="actionBtns">
              <button onClick={() => handleComment(thread, null, comment)}>
                Edit
              </button>
              <button onClick={() => handleComment(thread, comment)}>
                Reply
              </button>
              <button
                key={comment.id}
                onClick={() => DeleteComment(thread.id, comment.id)}
              >
                Delete
              </button>
              <CommentLikeDislike
                userName={thread.username}
                threadId={thread.id}
                commentId={comment.id}
                initialLikes={comment.likes}
                likedByUser={
                  comment.likesList &&
                  comment.likesList.includes(user.displayName)
                }
                onUpdate={handleCommentUpdate}
              />
            </div>
          ) : (
            <div className="actionBtns">
              <button onClick={() => handleComment(thread)}>Reply</button>
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
          )}
        </div>

        {comment.replies && renderComments(comment.replies, thread, comment)}
      </div>
    ));
  };

  const countReplies = (comments) => {
    let totalReplies = 0;

    const countNestedReplies = (commentsArray) => {
      for (const comment of commentsArray) {
        if (comment.replies && Array.isArray(comment.replies)) {
          totalReplies += comment.replies.length;
          countNestedReplies(comment.replies);
        }
      }
    };

    countNestedReplies(comments);
    return totalReplies;
  };

  return (
    <div className="container">
      <button onClick={createThread}>Create Thread</button>
      <h1 className="page-title">All Threads</h1>

      <div className="threads">
        {threads && threads.length > 0 ? (
          threads.map((thread) => (
            <div key={thread.id} className="thread">
              <h2>Title: {thread.title}</h2>
              <article className="textArea">{thread.text}</article>
              <p>
                Posted: {thread.date} by {thread.username}
              </p>
              <p>
                <FontAwesomeIcon icon="thumbs-up" className="icon-large" />{" "}
                <span className="counter-large"> {thread.likes}</span>{" "}
                <FontAwesomeIcon icon="fa-comment" className="icon-large" />{" "}
                <span className="counter-large">
                  {" "}
                  {thread.comments.length + countReplies(thread.comments)}
                </span>{" "}
              </p>
              {thread.username === user.displayName ? (
                <div className="actionBtns">
                  <button onClick={() => handleEdit(thread)}>Edit</button>
                  <button onClick={() => handleComment(thread)}>Reply</button>
                  <button
                    key={thread.id}
                    onClick={() => DeleteThread(thread.id)}
                  >
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
                <div className="actionBtns">
                  <button onClick={() => handleComment(thread)}>Reply</button>
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
              )}
              <button
                onClick={() =>
                  setShowComments((prev) => ({
                    ...prev,
                    [thread.id]: !prev[thread.id],
                  }))
                }
              >
                {showComments[thread.id] ? "Hide Comments" : "Show Comments"}
              </button>
              {showComments[thread.id] &&
                renderComments(thread.comments, thread)}
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
      {addComment && (
        <AddComment
          thread={addComment}
          parentComment={replyTo}
          commentToEdit={editComment}
          onUpdate={handleUpdate}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default Threads;

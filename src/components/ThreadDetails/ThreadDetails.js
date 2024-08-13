import { useEffect, useState, useCallback, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import ThreadLikeDislike from "../ThreadLikeDislike/ThreadLikeDislike";
import CommentLikeDislike from "../CommentsLikeDislike/CommentsLikeDislike";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faThumbsUp, faComment } from "@fortawesome/free-solid-svg-icons";
import ErrorContext from "../../context/ErrorContext";
import EditThread from "../EditThread/EditThread";

library.add(faThumbsUp, faComment);

const ThreadDetails = () => {
  const navigate = useNavigate();
  const { thread_id, username } = useParams();
  const [user] = useAuthState(auth);
  const [thread, setThread] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [editComment, setEditComment] = useState(null);
  const [editingThread, setEditingThread] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const { handleError } = useContext(ErrorContext);
  const [deletionMessage, setDeletionMessage] = useState("");

  const fetchThread = useCallback(async () => {
    try {
      if (!user || !user.displayName) throw new Error("User not authenticated");

      const threadRef = doc(db, "users", username, "threads", thread_id);
      const threadSnap = await getDoc(threadRef);

      if (threadSnap.exists()) {
        setThread(threadSnap.data());
        setComments(threadSnap.data().comments || []);
      } else {
        console.error("Thread not found!");
      }
    } catch (error) {
      handleError(error.message);
    }
  }, [thread_id, user, handleError]);

  useEffect(() => {
    fetchThread();
  }, [fetchThread]);

  const handleEdit = (thread) => {
    setEditingThread({ ...thread, thread_id: thread_id });
  };

  const handleUpdate = () => {
    setEditingThread(null);
    fetchThread();
  };

  const handleCancel = () => {
    setEditingThread(null);
  };

  const DeleteThread = async (threadId) => {
    try {
      const usersRef = doc(db, "users", username);
      const threadRef = doc(usersRef, "threads", threadId);
      await deleteDoc(threadRef);
      setTimeout(() => {
        navigate("/forum");
      }, 1000);
      setDeletionMessage("Thread deleted, redirecting to the forum");
      setTimeout(() => {
        setDeletionMessage("");
      }, 2000);
    } catch (error) {
      handleError(error.message);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const threadRef = doc(db, "users", username, "threads", thread_id);
      const comment = {
        id: Date.now().toString(),
        comment: newComment,
        user: username,
        date: new Date().toLocaleString(),
        likes: 0,
        likesList: [],
        replies: [],
      };

      const updatedComments = [...comments, comment];
      await updateDoc(threadRef, { comments: updatedComments });

      setComments(updatedComments);
      setNewComment("");
      setReplyTo(null);
      setEditComment(null);
    } catch (error) {
      handleError(error.message);
    }
  };

  const handleReplyToComment = async (parentCommentId) => {
    if (!newComment.trim()) return;

    try {
      const threadRef = doc(db, "users", username, "threads", thread_id);
      const threadSnap = await getDoc(threadRef);
      const threadData = threadSnap.data() || {};
      const parentComment = threadData.comments.find(
        (comment) => comment.id === parentCommentId
      );

      if (!parentComment) return;

      const newReply = {
        id: Date.now().toString(),
        comment: newComment,
        user: username,
        date: new Date().toLocaleString(),
        likes: 0,
        likesList: [],
      };

      const updatedComments = threadData.comments.map((c) =>
        c.id === parentCommentId
          ? { ...c, replies: [...(c.replies || []), newReply] }
          : c
      );

      await updateDoc(threadRef, { comments: updatedComments });
      setComments(updatedComments);
      setNewComment("");
      setReplyTo(null);
      setEditComment(null);
    } catch (error) {
      handleError(error.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const threadRef = doc(
        db,
        "users",
        user.displayName,
        "threads",
        thread_id
      );
      const threadSnap = await getDoc(threadRef);
      const threadData = threadSnap.data() || {};

      const removeCommentOrReply = (commentsArray, targetId) => {
        return commentsArray
          .map((comment) => {
            if (comment.id === targetId) {
              return null;
            } else if (comment.replies && Array.isArray(comment.replies)) {
              comment.replies = removeCommentOrReply(comment.replies, targetId);
            }
            return comment;
          })
          .filter((comment) => comment !== null);
      };

      const updatedComments = removeCommentOrReply(
        threadData.comments,
        commentId
      );
      await updateDoc(threadRef, { comments: updatedComments });
      setComments(updatedComments);
    } catch (error) {
      handleError(error.message);
    }
  };

  const renderComments = (comments, thread, replyTo = null) => {
    if (!comments) return null;

    return comments.map((comment) => (
      <div
        key={comment.id}
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
          {comment.user === user.displayName ? (
            <div className="actionBtns">
              <button onClick={() => handleDeleteComment(comment.id)}>
                Delete
              </button>
              <button onClick={() => setReplyTo(comment)}>Reply</button>
              <CommentLikeDislike
                userName={thread.username}
                threadId={thread_id}
                commentId={comment.id}
                initialLikes={comment.likes}
                likedByUser={
                  comment.likesList?.includes(user.displayName) || false
                }
                onUpdate={() => fetchThread()}
              />
            </div>
          ) : (
            <div className="actionBtns">
              <button onClick={() => setReplyTo(comment)}>Reply</button>
              <ThreadLikeDislike
                userName={thread.username}
                threadId={thread.id}
                initialLikes={thread.likes}
                likedByUser={
                  thread.likesList?.includes(user.displayName) || false
                }
                onUpdate={() => fetchThread()}
              />
            </div>
          )}
        </div>
        {comment.replies && renderComments(comment.replies, thread, comment)}
      </div>
    ));
  };

  return (
    <div className="container">
      {deletionMessage && (
        <div className="deletion-message">{deletionMessage}</div>
      )}
      {thread ? (
        <>
          <h1>{thread.title}</h1>
          <p>{thread.text}</p>
          <p>
            Posted: {thread.date} by {thread.username}
          </p>
          <p>
            <FontAwesomeIcon icon="thumbs-up" className="icon-large" />
            <span className="counter-large"> {thread.likes}</span>
            <FontAwesomeIcon icon="fa-comment" className="icon-large" />
            <span className="counter-large">
              {thread.comments?.length +
                thread.comments?.reduce(
                  (acc, comment) => acc + (comment.replies?.length || 0),
                  0
                ) || 0}
            </span>
          </p>
          <ThreadLikeDislike
            userName={thread.username}
            threadId={thread_id}
            initialLikes={thread.likes}
            likedByUser={thread.likesList?.includes(user.displayName) || false}
            onUpdate={fetchThread}
          />
          {thread.username === user.displayName && (
            <div>
              <button thread={thread_id} onClick={() => handleEdit(thread)}>
                Edit
              </button>
              <button onClick={() => DeleteThread(thread_id)}>Delete</button>
            </div>
          )}
          <button onClick={() => setShowComments((prev) => !prev)}>
            {showComments ? "Hide Comments" : "Show Comments"}
          </button>
          {showComments && renderComments(comments, thread)}
          <div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
            />
            <button
              onClick={() =>
                replyTo ? handleReplyToComment(replyTo.id) : handleAddComment()
              }
            >
              {replyTo ? "Reply" : "Add Comment"}
            </button>
            {replyTo && (
              <button onClick={() => setReplyTo(null)}>Cancel Reply</button>
            )}
          </div>
          {editingThread && (
            <EditThread
              thread={editingThread}
              thread_id={thread_id}
              onUpdate={handleUpdate}
              onCancel={handleCancel}
            />
          )}
        </>
      ) : (
        <p>Loading thread details...</p>
      )}
    </div>
  );
};

export default ThreadDetails;

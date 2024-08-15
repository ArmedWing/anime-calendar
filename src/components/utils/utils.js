export const addReply = (comments, parent, newReply) => {
  return comments.map((comment) => {
    if (comment.id === parent.id) {
      return {
        ...comment,
        replies: [...(comment.replies || []), { ...newReply, replies: [] }], // Ensure new replies have an empty replies array
      };
    } else {
      return {
        ...comment,
        replies: comment.replies
          ? addReply(comment.replies, parent, newReply)
          : [],
      };
    }
  });
};

export const findCommentById = (comments, id) => {
  for (let comment of comments) {
    if (comment.id === id) {
      return comment;
    }
    if (comment.replies) {
      const found = findCommentById(comment.replies, id);
      if (found) {
        return found;
      }
    }
  }
  return null;
};

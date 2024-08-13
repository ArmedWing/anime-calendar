import React from "react";

export const ErrorComponent = ({ errorMessage, onClose }) => {
  if (!errorMessage) return null;

  return (
    <div style={styles.errorContainer}>
      <p>{errorMessage}</p>
      <button onClick={onClose} style={styles.closeButton}>
        X
      </button>
    </div>
  );
};

const styles = {
  errorContainer: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "red",
    color: "white",
    padding: "10px",
    textAlign: "center",
    zIndex: 1000,
  },
  closeButton: {
    background: "none",
    border: "none",
    color: "white",
    marginLeft: "20px",
    cursor: "pointer",
  },
};

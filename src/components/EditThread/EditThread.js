import React, { useEffect, useContext } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import "./EditThread.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import ErrorContext from "../../context/ErrorContext";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaEdit } from "../Validations/ThreadValidation";

const EditThread = ({ thread, thread_id, onUpdate, onCancel }) => {
  const [user] = useAuthState(auth);
  const { handleError } = useContext(ErrorContext);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaEdit),
  });

  useEffect(() => {
    if (thread) {
      setValue("editTitle", thread.title);
      setValue("editText", thread.text);
    }
  }, [thread, setValue]);

  const onSubmit = async (data) => {
    try {
      const threadRef = doc(
        db,
        "users",
        user.displayName,
        "threads",
        thread_id || thread.id
      );
      await updateDoc(threadRef, {
        title: data.editTitle,
        text: data.editText,
      });
      onUpdate();
    } catch (error) {
      handleError(error.message);
    }
  };

  return (
    <div className="edit-modal">
      <div className="edit-modal-content">
        <h2>Edit Thread</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="editTitle">Title</label>
            <Controller
              name="editTitle"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <input type="text" id="editTitle" {...field} required />
              )}
            />
            {errors.editTitle && (
              <p className="error">{errors.editTitle.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="editText">Text</label>
            <Controller
              name="editText"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <textarea id="editText" {...field} required />
              )}
            />
            {errors.editText && (
              <p className="error">{errors.editText.message}</p>
            )}
          </div>
          <button type="submit">Update Thread</button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditThread;

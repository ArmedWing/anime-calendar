import { useState, useEffect, useContext } from "react";
import { addDoc, doc, collection, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import ErrorContext from "../../context/ErrorContext";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { schema } from "../Validations/ThreadValidation";


const CreateThread = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const { handleError } = React.useContext(ErrorContext);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const userRef = doc(db, "users", user.displayName);
      const threadsCollectionRef = collection(userRef, "threads");

      await addDoc(threadsCollectionRef, {
        ...data,
        date: new Date().toString().slice(0, 21),
        username: user.displayName,
        likes: 0,
      });

      navigate("/forum");
    } catch (error) {
      handleError(error.message);
    }
  };

  const handleCancel = () => {
    navigate("/forum");
  };

  return (
    <div>
      <h2 className="threadTitle">Create a Thread</h2>
      <form className="threadForm" onSubmit={handleSubmit(onSubmit)}>
        <div className="threadContainer">
          <label htmlFor="title">Title</label>
          <Controller
            name="title"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <input type="text" id="title" {...field} required />
            )}
          />
          {errors.title && <p className="error">{errors.title.message}</p>}

          <label htmlFor="text">Text</label>
          <Controller
            name="text"
            control={control}
            defaultValue=""
            render={({ field }) => <textarea id="text" {...field} required />}
          />
          {errors.text && <p className="error">{errors.text.message}</p>}
        </div>
        <button type="submit" className="createThreadBtn">
          CREATE THREAD
        </button>
        <button type="button" onClick={handleCancel} className="cancelBtn">
          Cancel
        </button>
      </form>
    </div>
  );
};

export default CreateThread;

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { userSchema } from "../Validations/UserValidation";
import { Formik, Form, Field, ErrorMessage } from "formik";

const Register = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);
    try {
      await userSchema.validate(values, { abortEarly: false });

      const { username, email, password } = values;
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: username,
      });
      await setDoc(doc(db, "users", username), {});

      navigate("/home");
    } catch (err) {
      if (err.name === "ValidationError") {
        const formErrors = {};
        err.inner.forEach((error) => {
          formErrors[error.path] = error.message;
        });
        setErrors(formErrors);
      } else {
        switch (err.code) {
          case "auth/email-already-in-use":
            setErrors({
              email: "This email is already in use. Please use another email.",
            });
            break;
          case "auth/invalid-email":
            setErrors({
              email: "Please enter a valid email address, including '@'.",
            });
            break;
          case "auth/operation-not-allowed":
            setErrors({
              general:
                "Registration is currently disabled. Please try again later.",
            });
            break;
          case "auth/weak-password":
            setErrors({
              password:
                "Your password is too weak. Please use a stronger password.",
            });
            break;
          default:
            setErrors({
              general: "An unexpected error occurred. Please try again later.",
            });
            break;
        }
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="registerContainer">
      <h1>Register</h1>
      <Formik
        initialValues={{ username: "", email: "", password: "" }}
        validationSchema={userSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form className="inputbox">
            <div className="credentials">
              <label htmlFor="username"></label>
              <Field
                type="text"
                id="username"
                name="username"
                placeholder="Username"
              />
              <ErrorMessage
                name="username"
                component="div"
                className="error-message"
                style={{ color: "red" }}
              />

              <label htmlFor="email"></label>
              <Field
                type="email"
                id="email"
                name="email"
                placeholder="Email address"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="error-message"
                style={{ color: "red" }}
              />
              <div>
                <label htmlFor="password"></label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error-message"
                  style={{ color: "red" }}
                />
              </div>
            </div>

            {errors.general && <p style={{ color: "red" }}>{errors.general}</p>}

            <button
              type="submit"
              className="registerBtn"
              disabled={isSubmitting}
            >
              Sign up
            </button>
          </Form>
        )}
      </Formik>
      <p>
        Already have an account?{" "}
        <NavLink to="/login" className="login">
          Login
        </NavLink>
      </p>
    </div>
  );
};

export default Register;

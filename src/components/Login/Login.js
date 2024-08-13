import React from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { NavLink, useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { loginSchema } from "../Validations/UserValidation";

const Login = () => {
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user.displayName) {
        const userDocRef = doc(db, "users", user.displayName);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          await setDoc(userDocRef, {});
        }
      } else {
        throw new Error("Google user does not have a display name.");
      }
      navigate("/home");
    } catch (error) {
      console.error("Failed to sign in with Google:", error.message);
    }
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);
    try {
      // Validate form data using Yup schema
      await loginSchema.validate(values, { abortEarly: false });

      const { email, password } = values;
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (err) {
      if (err.name === "ValidationError") {
        // Yup validation errors
        const formErrors = {};
        err.inner.forEach((error) => {
          formErrors[error.path] = error.message;
        });
        setErrors(formErrors);
      } else {
        // Firebase errors
        switch (err.code) {
          case "auth/invalid-email":
            setErrors({
              email: "Please enter a valid email address, including '@'.",
            });
            break;
          case "auth/user-not-found":
            setErrors({ general: "No account found with this email." });
            break;
          case "auth/wrong-password":
            setErrors({ password: "Incorrect password. Please try again." });
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
    <section className="loginPage">
      <div className="loginContainer">
        <h1>Login</h1>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors }) => (
            <Form className="inputbox">
              <div className="credentials">
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
              </div>

              <div className="credentials">
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

              {errors.general && (
                <p style={{ color: "red" }}>{errors.general}</p>
              )}

              <button
                type="submit"
                className="loginBtn"
                disabled={isSubmitting}
              >
                Log in
              </button>
            </Form>
          )}
        </Formik>
        <div className="otherOptions">
          <h2 className="googleLogin">Or login with</h2>
          <div className="imgContainer">
            <img
              src={require("../../images/google-logo.png")}
              alt="Google"
              onClick={signInWithGoogle}
            />
          </div>
          <NavLink to="/signup" className="register">
            Register
          </NavLink>
        </div>
      </div>
    </section>
  );
};

export default Login;

import { Link } from "react-router-dom";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import styled from "styled-components";

const Navigation = {
  marginRight: "10px",
  textDecoration: "none",
  fontSize: "22px",
};

const Header = () => {
  const [user] = useAuthState(auth);

  const signUserOut = async () => {
    await signOut(auth);
  };

  return (
    <div className="navbar">
      <div className="links">
        <Link to="/home" style={Navigation}>
          {" "}
          Home{" "}
        </Link>
        {!user ? (
          <div>
            <Link to="/register" style={Navigation}>
              {" "}
              Register{" "}
            </Link>
            <Link to="/login" style={Navigation}>
              {" "}
              Login{" "}
            </Link>
          </div>
        ) : (
          <Link to="/profile" style={Navigation}>
            {" "}
            Profile{" "}
          </Link>
        )}
      </div>

      {user && (
        <div className="user">
          <p> {user?.displayName} </p>
          <img src={user?.photoURL || ""} width="50" height="50" />
          <button onClick={signUserOut}> Log Out </button>
        </div>
      )}
    </div>
  );
};

export default Header;

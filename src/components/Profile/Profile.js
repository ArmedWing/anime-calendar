import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";

const Profile = () => {
  const [user] = useAuthState(auth);
  return (
    <div>
      <h1>{user.displayName}</h1>
    </div>
  );
};

export default Profile;

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import { collection, getDocs, doc } from "firebase/firestore";
import { db } from "../../firebase";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Profile = () => {
  const [user] = useAuthState(auth);
  const [animes, setAnimes] = useState([]);

  useEffect(() => {
    const fetchAnimes = async () => {
      if (!user) {
        return <div>No user</div>;
      }

      try {
        const userRef = doc(db, "users", user.displayName);
        const animeCollectionRef = collection(userRef, "animes");
        const querySnapshot = await getDocs(animeCollectionRef);
        const animesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAnimes(animesList);
      } catch (e) {
        console.error("Error fetching documents: ", e.message);
      }
    };

    fetchAnimes();
  }, []);

  return (
    <div>
      <h1>My Added Animes</h1>

      <div className="anime-card">
        {animes.map((anime) => (
          <div key={anime.id} className="card">
            <h2>{anime.anime[0].title}</h2>
            <img
              src={anime.anime[0].images.jpg.image_url}
              className="animeImg"
            />
            <div className="cardText">
              <div className="groupText">
                <h3>Status</h3>
                <p>{anime.anime[0].status}</p>
              </div>
              <a href={anime.anime[0].trailer.embed_url}>Watch Trailer</a>
              <Link to={`/anime/${anime.id}`}>
                <button className="detailsBtn">View Details</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;

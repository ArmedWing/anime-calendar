import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import { collection, getDocs, doc } from "firebase/firestore";
import { db } from "../../firebase";
import React, { useEffect, useState } from "react";

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
          <div key={anime.id} className="profile-anime-card">
            <h2>{anime.anime[0].title}</h2>
            <img src={anime.anime[0].images.jpg.image_url} />
            <p>Aired: {anime.anime[0].aired.from.split("-")[0]}</p>
            <p>Ended: {anime.anime[0].aired.to?.split("-")[0]}</p>
            <p>Broadcast: {anime.anime[0].broadcast?.string}</p>
            <p>Studio name: {anime.anime[0].studios[0].name}</p>
            <p>Score: {anime.anime[0].score}</p>
            <p>Status: {anime.anime[0].status}</p>
            <p>Genre: {anime.anime[0].genres[0].name}</p>
            <a href={anime.anime[0].trailer.embed_url}>Watch Trailer</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Details = {
  border: "2px solid",
  borderRadius: "6px",
  padding: "5px",
  backgroundImage: "linear-gradient(85deg, #61c7ef, #4833fb)",
  color: "white",
  fontSize: "18px",
  textDecoration: "none",
};

const Profile = () => {
  const [user] = useAuthState(auth);
  const [animes, setAnimes] = useState([]);

  const addEpisode = async (anime) => {
    try {
      const newEpisodesWatched = anime.episodesWatched + 1;
      const userRef = doc(db, "users", user.displayName);
      const animeRef = doc(userRef, "animes", anime.id);

      await updateDoc(animeRef, { episodesWatched: newEpisodesWatched });
      setAnimes(
        animes.map((a) =>
          a.id === anime.id ? { ...a, episodesWatched: newEpisodesWatched } : a
        )
      );
    } catch (error) {
      console.error("Error updating episodes watched:", error);
    }
  };

  const addCompleted = async (key) => {
    const currentAnime = animes.find((anime) => anime.id === key);
    try {
      const usersRef = doc(db, "users", user.displayName);
      const animeRef = collection(usersRef, "completed");
      await addDoc(animeRef, {
        ...currentAnime,

        episodesWatched: currentAnime.episodesWatched,
      });

      await deleteDoc(doc(usersRef, "animes", `${currentAnime.id}`));

      alert("Anime completed");
    } catch (e) {
      console.log("Error", e.message);
    }
  };

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
        console.log(animesList);
        console.log(animes);
      } catch (e) {
        console.error("Error fetching documents: ", e.message);
      }
    };

    fetchAnimes();
  }, [user]);

  return (
    <div>
      <h1 className="heading">My List</h1>

      <div className="anime-card">
        {animes && animes.length > 0 ? (
          animes.map((anime) => (
            <div key={anime.id} className="card">
              {anime.anime && anime.anime[0] ? (
                <>
                  <h2>{anime.anime[0].title}</h2>
                  <img
                    src={anime.anime[0].images.jpg.image_url}
                    className="animeImg"
                    alt={anime.anime[0].title}
                  />
                  <div className="cardText">
                    <div className="groupText">
                      <p>Status: {anime.anime[0].status}</p>
                      <p>Rating: {anime.anime[0].score}</p>

                      <p>
                        Episodes watched: {anime.episodesWatched}/
                        {anime.anime[0].episodes}
                        <button
                          onClick={() => addEpisode(anime)}
                          className="addEpisodeButton"
                        >
                          +
                        </button>
                      </p>
                    </div>
                    <div className="actionsContainer">
                      <a href={anime.anime[0].trailer.embed_url}>
                        Watch Trailer
                      </a>
                      <Link
                        to={`/anime/${anime.animeId}`}
                        style={{ textDecoration: "none" }}
                      >
                        View Details
                      </Link>
                      <button
                        key={anime.id}
                        onClick={() => addCompleted(anime.id)}
                        className="addCompletedBtn"
                      >
                        Add Completed
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <p>Anime data is missing</p>
              )}
            </div>
          ))
        ) : (
          <div>You have no added animes</div>
        )}
      </div>
    </div>
  );
};

export default Profile;

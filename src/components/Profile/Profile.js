import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  limit,
  query,
} from "firebase/firestore";
import { db } from "../../firebase";
import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";

const Profile = () => {
  const [user] = useAuthState(auth);
  const [animes, setAnimes] = useState([]);

  const fetchAnimes = useCallback(async () => {
    if (!user) {
      return <div>No user</div>;
    }

    try {
      const userRef = doc(db, "users", user.displayName);
      const animeCollectionRef = collection(userRef, "animes");
      const limited = query(animeCollectionRef, limit(5)); // this limits to only 5 animes shown, it saves me lots of usage in firestore.
      const querySnapshot = await getDocs(limited);
      const animesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAnimes(animesList);
    } catch (e) {
      alert("Error fetching documents: ", e.message);
    }
  }, [animes]);

  const addEpisode = async (anime) => {
    try {
      const newEpisodesWatched = anime.episodesWatched + 1;
      const userRef = doc(db, "users", user.displayName);
      const animeRef = doc(userRef, "animes", anime.id);

      await updateDoc(animeRef, { episodesWatched: newEpisodesWatched });
      setAnimes((prevAnimes) =>
        prevAnimes.map((a) =>
          a.id === anime.id ? { ...a, episodesWatched: newEpisodesWatched } : a
        )
      );
    } catch (error) {
      alert("Error updating episodes watched:", error);
    }
  };

  const addCompleted = async (key) => {
    const currentAnime = animes.find((anime) => anime.id === key);
    const { id, ...animeWithoutId } = currentAnime;
    try {
      const usersRef = doc(db, "users", user.displayName);
      const animeRef = collection(usersRef, "completed");
      await addDoc(animeRef, {
        ...animeWithoutId,
        episodesWatched: currentAnime.episodesWatched,
      });

      await deleteDoc(doc(usersRef, "animes", `${currentAnime.id}`));

      alert("Anime completed");
    } catch (e) {
      alert("Error", e.message);
    }
  };

  const deleteAnime = async (key) => {
    const usersRef = doc(db, "users", user.displayName);
    const currentAnime = animes.find((anime) => anime.id === key);
    await deleteDoc(doc(usersRef, "animes", `${currentAnime.id}`));
    alert("Anime deleted");
  };

  useEffect(() => {
    fetchAnimes();
  }, [fetchAnimes]);

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
                      <a
                        href={anime.anime[0].trailer.embed_url}
                        className="actionBtn"
                      >
                        Watch Trailer
                      </a>
                      <Link
                        to={`/anime/${anime.animeId}`}
                        className="actionBtn"
                        style={{ textDecoration: "none" }}
                      >
                        View Details
                      </Link>
                      <button
                        key={anime.id}
                        onClick={() => addCompleted(anime.id)}
                        className="actionBtn"
                      >
                        Add Completed
                      </button>
                      <button
                        key={anime.id}
                        onClick={() => deleteAnime(anime.id)}
                        className="actionBtn"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <h1 className="heading">Anime data is missing</h1>
              )}
            </div>
          ))
        ) : (
          <h1 className="no-animes">You have no added animes</h1>
        )}
      </div>
    </div>
  );
};

export default Profile;

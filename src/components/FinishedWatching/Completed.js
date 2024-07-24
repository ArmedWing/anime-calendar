import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  limit,
  query,
} from "firebase/firestore";
import { db } from "../../firebase";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Completed = () => {
  const [user] = useAuthState(auth);
  const [animes, setAnimes] = useState([]);

  const deleteAnime = async (key) => {
    const usersRef = doc(db, "users", user.displayName);
    const currentAnime = animes.find((anime) => anime.id === key);
    await deleteDoc(doc(usersRef, "completed", `${currentAnime.id}`));

    alert("Anime deleted");
  };

  useEffect(() => {
    const fetchAnimes = async () => {
      if (!user) {
        return <div>No user</div>;
      }

      try {
        const userRef = doc(db, "users", user.displayName);
        const animeCollectionRef = collection(userRef, "completed");
        const limited = query(animeCollectionRef, limit(2)); // this limits to only 2 animes shown, it saves me lots of usage in firestore.
        const querySnapshot = await getDocs(limited);

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
  }, [user, animes]);

  return (
    <div>
      <h1 className="heading">Completed</h1>

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
                        Episodes watched:&nbsp;&nbsp;
                        {anime.anime[0].episodes}
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
                      >
                        View Details
                      </Link>
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

export default Completed;

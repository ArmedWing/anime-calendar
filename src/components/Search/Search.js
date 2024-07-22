import React, { useEffect, useContext, useState } from "react";
import {
  addDoc,
  doc,
  setDoc,
  collection,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import SearchContext from "../../context/search";
import { db } from "../../firebase";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { SearchResultsContext } from "../SearchResultContext";

const Search = () => {
  const [user] = useAuthState(auth);
  const { search } = useContext(SearchContext);
  const [input, setInput] = useState("");
  const { searchResults, setSearchResults } = useContext(SearchResultsContext);
  const [animes, setAnimes] = useState([]);

  const addToCalendar = async (key) => {
    const currentAnime = searchResults.filter((anime) => anime.mal_id === key);

    const userRef = doc(db, "users", user.displayName);
    const animeCollectionRef = collection(userRef, "animes");
    const querySnapshot = await getDocs(animeCollectionRef);
    const animesList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setAnimes(animesList);
    const animeExists = animesList.some(
      (a) => a.animeId === currentAnime[0].mal_id
    );

    if (!animeExists) {
      try {
        const usersRef = doc(db, "users", user.displayName);
        const animeRef = collection(usersRef, "animes");
        await addDoc(animeRef, {
          username: user.displayName,
          animeId: currentAnime[0].mal_id,
          animeName: currentAnime[0].title,
          anime: currentAnime,
          episodesWatched: 0,
        });
        alert("Anime added to list");
      } catch (e) {
        alert("Error", e.message);
      }
    } else alert("Anime already in list");
  };

  const handleSearch = (event) => {
    // event.preventDefault();
    search(input).then((data) => {
      setSearchResults(data.data);
    });
  };

  return (
    <div className="homePage">
      <h1>Search</h1>
      <div className="searchContainer">
        <div>
          <input
            placeholder="search anime"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            className="searchInput"
          />
        </div>
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="anime-list">
        {searchResults.map((anime) => (
          <div key={anime.mal_id} className="anime">
            {" "}
            <a href={`${anime.url}`} className="anime-card">
              <div className="anime-title">{anime.title}</div>
            </a>
            <img src={anime.images.jpg.image_url} alt={anime.title} />{" "}
            <p>Status: {anime.status}</p>
            <p>Rating: {anime.score}</p>
            <div className="actionsContainer">
              <a href={anime.trailer.embed_url} className="actionBtn">
                Watch Trailer
              </a>
              <button
                className="actionBtn"
                key={anime.mal_id}
                onClick={() => addToCalendar(anime.mal_id)}
              >
                Add to list
              </button>
              <Link to={`/anime/${anime.mal_id}`} className="actionBtn">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;

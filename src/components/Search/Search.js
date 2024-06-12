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

const Details = {
  border: "2px solid",
  borderRadius: "6px",
  padding: "3px",
  backgroundImage: "linear-gradient(85deg, #61c7ef, #4833fb)",
  color: "white",
  fontSize: "20px",
  textDecoration: "none",
  marginLeft: "20px",
};

const Search = () => {
  const [user] = useAuthState(auth);
  const { search } = useContext(SearchContext);
  const [input, setInput] = useState("");
  const { searchResults, setSearchResults } = useContext(SearchResultsContext);

  const addToCalendar = async (key) => {
    const currentAnime = searchResults.filter((anime) => anime.mal_id === key);

    try {
      const usersRef = doc(db, "users", user.displayName);
      const animeRef = collection(usersRef, "animes");
      await addDoc(animeRef, {
        username: user.displayName,
        animeId: currentAnime[0].mal_id,
        animeName: currentAnime[0].title,
        anime: currentAnime,
      });
      alert("Anime added to list");
    } catch (e) {
      console.log("Error", e.message);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    search(input).then((data) => {
      setSearchResults(data.data);
    });
  };

  return (
    <div className="home-page">
      <h1>Search</h1>
      <input
        placeholder="search anime"
        value={input}
        onChange={(event) => setInput(event.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <div className="anime-list">
        {searchResults.map((anime) => (
          <div key={anime.mal_id} className="anime">
            {" "}
            <a href={`${anime.url}`} className="anime-card">
              <div className="anime-title">{anime.title}</div>
            </a>
            <img src={anime.images.jpg.image_url} alt={anime.title} />{" "}
            <button
              className="addToCalendarBtn"
              key={anime.mal_id}
              onClick={() => addToCalendar(anime.mal_id)}
            >
              Add to list
            </button>
            <Link to={`/anime/${anime.mal_id}`} style={Details}>
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;

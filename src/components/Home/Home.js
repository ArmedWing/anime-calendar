import React, { useContext, useState } from "react";
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

const Home = () => {
  const [user] = useAuthState(auth);
  const search = useContext(SearchContext);
  const [input, setInput] = useState("");
  const [searchedAnime, setSearchedAnime] = useState([]);

  const addToCalendar = async (key) => {
    const currentAnime = searchedAnime.filter((anime) => anime.mal_id === key);

    try {
      const usersRef = doc(db, "users", user.displayName);
      const animeRef = collection(usersRef, "animes");
      await addDoc(animeRef, {
        username: user.displayName,
        animeId: searchedAnime[0].mal_id,
        animeName: searchedAnime[0].title,
        anime: currentAnime,
      });
      console.log("Added");
    } catch (e) {
      console.log("error");
    }
  };

  const handleSearch = (event) => {
    search.search(input).then((data) => {
      setSearchedAnime(data.data);
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
        {searchedAnime.map((anime) => (
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
            {/* <Link to={`/anime/${anime.mal_id}`}>
              <button className="detailsBtn">View Details</button>
            </Link> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

import React, { useContext, useState } from "react";

import SearchContext from "../../context/search";

const Home = () => {
  const search = useContext(SearchContext);
  const [input, setInput] = useState("");
  const [searchedAnime, setSearchedAnime] = useState([]);

  const handleSearch = (event) => {
    search.search(input).then((data) => {
      setSearchedAnime(data.data);
      // console.log(data.data);
    });
  };

  return (
    <div>
      <h1>Home Page</h1>
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
              <img src={anime.images.jpg.image_url} alt={anime.title} />{" "}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

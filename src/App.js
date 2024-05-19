import "./App.css";
import Header from "./components/Header/Header";
import "./components/Header/Header.css";
import Home from "./components/Home/Home";
import "./components/Home/Home.css";
import React, { useState } from "react";
import SearchContext from "./context/search";

function App() {
  const [animeData, setAnimeData] = useState([]);
  const [singleData, setSingleData] = useState({});

  const setData = (data) => {
    setAnimeData(data);
  };

  const setSingle = (data) => {
    setSingleData(data);
  };

  const search = (searchTerm) => {
    return fetch(`https://api.jikan.moe/v4/anime?q=${searchTerm}&sfw`).then(
      (response) => response.json()
    );
  };

  return (
    <SearchContext.Provider
      value={{ search, animeData, setData, singleData, setSingle }}
    >
      <div className="App">
        <Header />
        <Home />
      </div>
    </SearchContext.Provider>
  );
}

export default App;

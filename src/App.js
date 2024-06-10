import "./App.css";
import Header from "./components/Header/Header";
import "./components/Header/Header.css";
import "./components/Profile/Profile.css";
import Home from "./components/Home/Home";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import "./components/Home/Home.css";
import React, { useState } from "react";
import SearchContext from "./context/search";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Profile from "./components/Profile/Profile";
import AnimeDetails from "./components/AnimeDetails/AnimeDetails";
import "./components/AnimeDetails/AnimeDetails.css";
import { SearchResultsProvider } from "./components/SearchResultContext";

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
    <SearchResultsProvider>
      <Router>
        <SearchContext.Provider
          value={{ search, animeData, setData, singleData, setSingle }}
        >
          <div className="App">
            <Header />
            <section>
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/anime/:mal_id" element={<AnimeDetails />} />
              </Routes>
            </section>
          </div>
        </SearchContext.Provider>
      </Router>
    </SearchResultsProvider>
  );
}

export default App;

import "./App.css";
import Header from "./components/Header/Header";
import "./components/Header/Header.css";
import "./components/Profile/Profile.css";
import Search from "./components/Search/Search";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import "./components/Search/Search.css";
import React, { useState } from "react";
import SearchContext from "./context/search";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Profile from "./components/Profile/Profile";
import AnimeDetails from "./components/AnimeDetails/AnimeDetails";
import "./components/AnimeDetails/AnimeDetails.css";
import { SearchResultsProvider } from "./components/SearchResultContext";
import Home from "./components/Home/Home";
import "./components/Home/Home.css";
import { HomePageProvider } from "./components/HomePageContext";
import "./components/Login/Login.css";

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
    <HomePageProvider>
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
                  <Route path="/search" element={<Search />} />
                  <Route path="/signup" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/anime/:mal_id" element={<AnimeDetails />} />
                </Routes>
              </section>
            </div>
          </SearchContext.Provider>
        </Router>
      </SearchResultsProvider>
    </HomePageProvider>
  );
}

export default App;

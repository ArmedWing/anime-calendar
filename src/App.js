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
import { SearchResultsProvider } from "./context/SearchResultContext";
import Home from "./components/Home/Home";
import "./components/Home/Home.css";
import { HomePageProvider } from "./context/HomePageContext";
import "./components/Login/Login.css";
import "./components/Register/Register.css";
import Completed from "./components/FinishedWatching/Completed";
import "./components/FinishedWatching/Completed.css";
import Threads from "./components/Forum/Threads";
import "./components/Forum/Threads.css";
import CreateThread from "./components/CreateThread/CreateThread";
import "./components/CreateThread/CreateThread.css";
import "font-awesome/css/font-awesome.min.css";
import AuthGuard from "./components/Guards/isAuthGuard";
import AlreadyAuthenticatedGuard from "./components/Guards/isNotAuthGuard";
import { ErrorProvider } from "./context/ErrorContext";

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
    <ErrorProvider>
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
                    <Route element={<AlreadyAuthenticatedGuard />}>
                      <Route path="/signup" element={<Register />} />
                      <Route path="/login" element={<Login />} />
                    </Route>
                    <Route element={<AuthGuard />}>
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/completed" element={<Completed />} />
                      <Route path="/anime/:mal_id" element={<AnimeDetails />} />
                      <Route path="/forum" element={<Threads />} />
                      <Route path="/create-thread" element={<CreateThread />} />
                    </Route>
                  </Routes>
                </section>
              </div>
            </SearchContext.Provider>
          </Router>
        </SearchResultsProvider>
      </HomePageProvider>
    </ErrorProvider>
  );
}

export default App;

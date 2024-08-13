import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { addDoc, doc, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import { SearchResultsContext } from "../../context/SearchResultContext";
import ErrorContext from "../../context/ErrorContext";

const Home = () => {
  const [user] = useAuthState(auth);
  const { searchResults, setSearchResults } = useContext(SearchResultsContext);
  const [filterByGenre, setFilterByGenre] = useState([]);
  const [animes, setAnimes] = useState([]);
  const [currentAnimes, setCurrentAnimes] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { handleError } = useContext(ErrorContext);
  const [addAnime, setAddAnime] = useState("");
  const animesPerPage = 12;

  const getTopAnime = async (page = 1) => {
    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/top/anime?page=${page}&limit=${animesPerPage}`
      );
      const data = await response.json();

      setAnimes(data.data);
      setCurrentPage(data.pagination.current_page || 1);
      setTotalPages(data.pagination.last_visible_page || 1);
      setSelectedGenre(null);
    } catch (error) {
      handleError(error.message);
      setAnimes([]);
    }
  };

  const getAnimesByGenre = async (genreId, page = 1) => {
    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/anime?genres=${genreId}&page=${page}&limit=${animesPerPage}`
      );
      const data = await response.json();
      setAnimes(data.data);
      setCurrentPage(data.pagination.current_page || 1);
      setTotalPages(data.pagination.last_visible_page || 1);
    } catch (error) {
      handleError(error.message);
      setAnimes([]);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
    getAnimesByGenre(genre.mal_id);
    setCurrentPage(1);
  };

  const getAnimeGenre = async () => {
    try {
      const response = await fetch(`https://api.jikan.moe/v4/genres/anime`);
      const data = await response.json();
      setFilterByGenre(data.data || []);
    } catch (error) {
      handleError(error.message);
      setFilterByGenre([]);
    }
  };
  const addToCalendar = async (anime) => {
    const userRef = doc(db, "users", user.displayName);
    const animeCollectionRef = collection(userRef, "animes");
    const querySnapshot = await getDocs(animeCollectionRef);
    const animesList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const animeExists = animesList.some((a) => a.animeId === anime.mal_id);

    if (!animeExists) {
      try {
        const usersRef = doc(db, "users", user.displayName);
        const animeRef = collection(usersRef, "animes");
        await addDoc(animeRef, {
          username: user.displayName,
          animeId: anime.mal_id,
          animeName: anime.title,
          anime: [anime],
          episodesWatched: 0,
        });
        setAddAnime("Anime added to list");

        setTimeout(() => {
          setAddAnime("");
        }, 2000);
      } catch (e) {
        handleError(e.message);
      }
    } else setAddAnime("Anime already in list");
    setTimeout(() => {
      setAddAnime("");
    }, 2000);
  };

  useEffect(() => {
    if (selectedGenre) {
      getAnimesByGenre(selectedGenre.mal_id, currentPage);
    } else {
      getTopAnime(currentPage);
    }
  }, [currentPage, selectedGenre]);

  const allowedGenres = [1, 2, 4, 8, 10, 14, 7, 22, 24, 30, 37, 62, 18, 27];
  const filteredGenres = filterByGenre.filter((genre) =>
    allowedGenres.includes(genre.mal_id)
  );

  return (
    <div className="Animes">
      {addAnime && <div className="deletion-message">{addAnime}</div>}
      <button onClick={() => getTopAnime(currentPage)} className="filter">
        Filter by Rating
      </button>
      <button onClick={getAnimeGenre} className="filter">
        Filter by Genres
      </button>
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>

      <div>
        {filteredGenres.map((genre) => (
          <button
            key={genre.mal_id}
            onClick={() => handleGenreClick(genre)}
            className="genres"
          >
            {genre.name}
          </button>
        ))}

        <div
          className="anime-card"
          key={selectedGenre ? `genre-${selectedGenre.mal_id}` : "top-anime"}
        >
          {animes.length > 0 ? (
            animes.map((anime) => (
              <div key={anime.mal_id} className="card">
                <h2>{anime.title}</h2>
                <img
                  src={anime.images.jpg.image_url}
                  className="animeImg"
                  alt={anime.title}
                />
                <div className="cardText">
                  <div className="groupText">
                    <p>Status: {anime.status}</p>
                    <p>Rating: {anime.score}</p>
                  </div>
                  <div className="actionsContainer">
                    <a href={anime.trailer.embed_url} className="actionBtn">
                      Watch Trailer
                    </a>
                    {user && (
                      <button
                        className="actionBtn"
                        key={anime.mal_id}
                        onClick={() => addToCalendar(anime)}
                      >
                        Add to list
                      </button>
                    )}

                    <Link
                      to={`/anime/${anime.mal_id}`}
                      state={{ anime }}
                      style={{ textDecoration: "none" }}
                      className="actionBtn"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No animes available</p>
          )}
        </div>
        <div className="pagination">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

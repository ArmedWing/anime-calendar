import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";

const Details = {
  border: "2px solid",
  borderRadius: "6px",
  padding: "5px",
  backgroundImage: "linear-gradient(85deg, #61c7ef, #4833fb)",
  color: "white",
  fontSize: "20px",
  textDecoration: "none",
  marginLeft: "20px",
};

const Home = () => {
  const [filterByGenre, setFilterByGenre] = useState([]);
  const [animes, setAnimes] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showTopAnimes, setShowTopAnimes] = useState(false);
  const animesPerPage = 12;

  const getTopAnime = async (page = 1) => {
    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/top/anime?page=${page}&limit=${animesPerPage}`
      );
      const data = await response.json();

      setAnimes(data.data); //
      setCurrentPage(data.pagination.current_page || 1);
      setTotalPages(data.pagination.last_visible_page || 1);
      setSelectedGenre(null);
    } catch (error) {
      console.error("Failed to fetch top animes:", error);
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
      setShowTopAnimes(false);
    } catch (error) {
      console.error("Failed to fetch animes by genre:", error);
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
    // getAnimesByGenre(genre.mal_id);
    setCurrentPage(1);
  };

  const getAnimeGenre = async () => {
    try {
      const response = await fetch(`https://api.jikan.moe/v4/genres/anime`);
      const data = await response.json();
      setFilterByGenre(data.data || []);
    } catch (error) {
      console.error("Failed to fetch genres:", error);
      setFilterByGenre([]);
    }
  };

  useEffect(() => {
    if (selectedGenre) {
      getAnimesByGenre(selectedGenre.mal_id, currentPage);
    } else {
      getTopAnime(currentPage);
    }
  }, [currentPage, selectedGenre, showTopAnimes]);

  const allowedGenres = [1, 2, 4, 8, 10, 14, 7, 22, 24, 30, 37, 62, 18, 27];
  const filteredGenres = filterByGenre.filter((genre) =>
    allowedGenres.includes(genre.mal_id)
  );

  return (
    <div className="Animes">
      <button onClick={() => getTopAnime(currentPage)}>Filter by Rating</button>
      <button onClick={getAnimeGenre}>Filter by Genres</button>
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
          <button key={genre.mal_id} onClick={() => handleGenreClick(genre)}>
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
                  <a href={anime.trailer.embed_url}>Watch Trailer</a>
                  <Link
                    to={`/anime/${anime.mal_id}`}
                    style={{ textDecoration: "none" }}
                  >
                    View Details
                  </Link>
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

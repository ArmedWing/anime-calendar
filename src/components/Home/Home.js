import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { HomePageContext } from "../HomePageContext";

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
  const [topAnime, SetTopAnime] = useState([]);
  const { homePageResults, setHomePageResults } = useContext(HomePageContext);

  const getTopAnime = async () => {
    const temp = await fetch(`https://api.jikan.moe/v4/top/anime`).then((res) =>
      res.json()
    );

    const top12Anime = temp.data.slice(0, 12);
    console.log(top12Anime);

    setHomePageResults(top12Anime);
  };
  useEffect(() => {
    getTopAnime();
  }, []);

  return (
    <div className="topAnime">
      <h1>Top Animes</h1>

      <div className="anime-card">
        {homePageResults.map((anime) => (
          <div key={anime.mal_id} className="card">
            <h2>{anime.title}</h2>
            <img src={anime.images.jpg.image_url} className="animeImg" />
            <div className="cardText">
              <div className="groupText">
                <p>Status: {anime.status}</p>
                <p>Rating: {anime.score}</p>
              </div>
              <a href={anime.trailer.embed_url}>Watch Trailer</a>
              <Link to={`/anime/${anime.mal_id}`} style={Details}>
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

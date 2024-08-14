import React, { useContext, useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { doc, collection, where, query, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { auth } from "../../firebase";
import { SearchResultsContext } from "../../context/SearchResultContext";
import { HomePageContext } from "../../context/HomePageContext";
import ErrorContext from "../../context/ErrorContext";

const AnimeDetails = () => {
  const { mal_id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { searchResults } = useContext(SearchResultsContext);
  const [anime, setAnime] = useState(location.state?.anime || null);
  const { homePageResults } = useContext(HomePageContext);
  const { handleError } = useContext(ErrorContext);

  useEffect(() => {
    if (!anime) {
      fetchAnimeDetails(mal_id);
    }
  }, [mal_id, anime]);

  const fetchAnimeDetails = async (mal_id) => {
    // throw new Error("Simulated error");
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.displayName);
      const animeCompletedDocRef = collection(userRef, "completed");
      const animeCompletedRef = query(
        animeCompletedDocRef,
        where("animeId", "==", Number(mal_id))
      );
      const animeDocRef = collection(userRef, "animes");
      const animeRef = query(
        animeDocRef,
        where("animeId", "==", Number(mal_id))
      );
      const querySnapshot = await getDocs(animeRef);
      const queryCompletedSnapshot = await getDocs(animeCompletedRef);
      const animeDetails = querySnapshot.docs;
      const animeCompletedDetails = queryCompletedSnapshot.docs;

      if (animeDetails.length) {
        setAnime(animeDetails[0].data().anime[0]);
      } else if (animeCompletedDetails.length) {
        setAnime(animeCompletedDetails[0].data().anime[0]);
      } else {
        const animeFromSearch = searchResults.find(
          (anime) => anime.mal_id === parseInt(mal_id)
        );
        if (animeFromSearch) {
          setAnime(animeFromSearch);
        } else {
          const animeHomePage = homePageResults.find(
            (anime) => anime.mal_id === parseInt(mal_id)
          );
          if (animeHomePage) {
            setAnime(animeHomePage);
          } else {
            navigate("/404", { replace: true }); // This will replace the current URL in the history stack with the 404 URL, so if the user presses "back", they won't return to the invalid URL.
          }
        }
      }
    } catch (error) {
      handleError(error.message);
    }
  };

  if (!anime) {
    return null;
  }

  return (
    <div>
      <div className="details-container">
        <div className="leftSection">
          <h1>{anime.title}</h1>
          <img src={anime.images.jpg.large_image_url} className="animeImg" />
          <a href={anime.trailer.embed_url}>Watch Trailer</a>
          <a href={anime.url}>My Anime List</a>
        </div>
        <div className="rightSection">
          <p style={{ color: "black" }}>Story:</p>
          <p>
            {anime.synopsis && anime.synopsis.length > 10
              ? anime.synopsis.slice(0, -25)
              : anime.synopsis}
          </p>
          <p>
            <span style={{ color: "black" }}>Status:</span> {anime.status}
          </p>
          <div className="groupText">
            <p>
              <span style={{ color: "black" }}>Aired:</span>{" "}
              {anime.aired.from.split("-")[0]}
            </p>
          </div>
          <div className="groupText">
            <p>
              <span style={{ color: "black" }}>Ended:</span>{" "}
              {anime.aired.to?.split("-")[0]}
            </p>
          </div>
          <div className="groupText">
            <p>
              <span style={{ color: "black" }}>Broadcast:</span>{" "}
              {anime.broadcast?.string}
            </p>
          </div>
          <div className="groupText">
            <p>
              <span style={{ color: "black" }}>Studio name:</span>{" "}
              {anime.studios[0].name}
            </p>
          </div>
          <div className="groupText">
            <p>
              <span style={{ color: "black" }}>Score:</span> {anime.score}
            </p>
          </div>
          <div className="groupText">
            <p>
              <span style={{ color: "black" }}>Genre:</span>{" "}
              {anime.genres[0].name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetails;

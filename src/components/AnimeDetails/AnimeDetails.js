import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  where,
  query,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import { SearchResultsContext } from "../SearchResultContext";
import { HomePageContext } from "../HomePageContext";

const AnimeDetails = () => {
  const { mal_id } = useParams();
  // const { animeId } = useParams();
  const { searchResults } = useContext(SearchResultsContext);
  const [anime, setAnime] = useState(null);
  const { homePageResults } = useContext(HomePageContext);

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(db, "users", user.displayName);
        const animeDocRef = collection(userRef, "animes");
        const animeRef = query(
          animeDocRef,
          where("animeId", "==", Number(mal_id))
        );
        const querySnapshot = await getDocs(animeRef);
        const animeDetails = querySnapshot.docs;

        if (animeDetails.length) {
          setAnime(animeDetails[0].data().anime[0]);
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
            }
          }
        }
      } catch (error) {
        console.error("Error fetching anime details:", error);
      }
    };

    fetchAnimeDetails();
  }, [mal_id, searchResults, homePageResults]);

  if (!anime) {
    return <div className="noAnimes">No Anime Details</div>;
  }

  return (
    <div className="details-container">
      <div className="leftSection">
        <h1>{anime.title}</h1>
        <img src={anime.images.jpg.large_image_url} className="animeImg" />
        <a href={anime.trailer.embed_url}>Watch Trailer</a>
        <a href={anime.url}>My Anime List</a>
      </div>
      <div className="rightSection">
        <h2>Story:</h2>
        <p>
          {anime.synopsis && anime.synopsis.length > 10
            ? anime.synopsis.slice(0, -25)
            : anime.synopsis}
        </p>
        <p>Status: {anime.status}</p>
        <div className="groupText">
          <p>Aired: {anime.aired.from.split("-")[0]}</p>
        </div>
        <div className="groupText">
          <p>Ended: {anime.aired.to?.split("-")[0]}</p>
        </div>
        <div className="groupText">
          <p>Broadcast: {anime.broadcast?.string}</p>
        </div>
        <div className="groupText">
          <p>Studio name: {anime.studios[0].name}</p>
        </div>
        <div className="groupText">
          <p>Score: {anime.score}</p>
        </div>
        <div className="groupText">
          <p>Genre: {anime.genres[0].name}</p>
          {/* <div>
              {animeDetails.genres && animeDetails.genres.length > 0 ? (
                animeDetails.genres.map((genre) => <p>{genre.name}</p>)
              ) : (
                <p>No genres available</p>
              )}
            </div> */}
        </div>
      </div>
    </div>
  );
};

export default AnimeDetails;

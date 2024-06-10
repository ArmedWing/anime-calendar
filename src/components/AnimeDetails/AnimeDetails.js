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

const AnimeDetails = () => {
  const { mal_id } = useParams();
  const { animeId } = useParams();
  const { searchResults } = useContext(SearchResultsContext);
  const [anime, setAnime] = useState(null);

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
        console.log(animeDetails);

        if (animeDetails.length) {
          setAnime(animeDetails[0].data().anime[0]);
        } else {
          const animeFromSearch = searchResults.find(
            (anime) => anime.mal_id === parseInt(mal_id)
          );
          if (animeFromSearch) {
            setAnime(animeFromSearch);
          } else {
            console.log("Anime not found!");
          }
        }
      } catch (error) {
        console.error("Error fetching anime details:", error);
      }
    };

    fetchAnimeDetails();
  }, [mal_id, searchResults]);

  if (!anime) {
    return <div>No Anime Details</div>;
  }
  console.log(anime);
  return (
    <div className="details-container">
      <div>
        <h1>{anime.animeName}</h1>
        <img src={anime.images.jpg.large_image_url} className="animeImg" />
        <a href={anime.trailer.embed_url}>Watch Trailer</a>
        <a href={anime.url}>My Anime List</a>
      </div>
      <div>
        <h3>Story</h3>
        <p>{anime.synopsis}</p>
        <p>{anime.status}</p>
        <div className="groupText">
          <h3>Aired</h3>
          <p>{anime.aired.from.split("-")[0]}</p>
        </div>
        <div className="groupText">
          <h3>Ended</h3>
          <p>{anime.aired.to?.split("-")[0]}</p>
        </div>
        <div className="groupText">
          <h3>Broadcast</h3>
          <p>{anime.broadcast?.string}</p>
        </div>
        <div className="groupText">
          <h3>Studio name</h3>
          <p>{anime.studios[0].name}</p>
        </div>
        <div className="groupText">
          <h3>Score</h3>
          <p>{anime.score}</p>
        </div>
        <div className="groupText">
          <h3>Genre</h3>
          <p>{anime.genres[0].name}</p>
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

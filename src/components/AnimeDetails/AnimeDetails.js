import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";

const AnimeDetails = () => {
  const { animeId } = useParams();
  const [animeDetails, setAnime] = useState(null);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        const userRef = doc(db, "users", user.displayName);
        const docRef = doc(userRef, "animes", animeId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setAnime({ id: docSnap.animeId, ...docSnap.data() });
        } else {
          console.log("No such document!");
        }
      } catch (e) {
        console.error("Error fetching document: ", e.message);
      }
    };

    fetchAnimeDetails();
  }, [animeId]);

  if (!animeDetails) return <div>No anime details</div>;

  return (
    <div className="details-container">
      <div>
        <h1>{animeDetails.animeName}</h1>
        <img
          src={animeDetails.anime[0].images.jpg.large_image_url}
          className="animeImg"
        />
        <a href={animeDetails.anime[0].trailer.embed_url}>Watch Trailer</a>
        <a href={animeDetails.anime[0].url}>My Anime List</a>
      </div>
      <div>
        <h3>Story</h3>
        <p>{animeDetails.anime[0].synopsis}</p>
        <p>{animeDetails.anime[0].status}</p>
        <div className="groupText">
          <h3>Aired</h3>
          <p>{animeDetails.anime[0].aired.from.split("-")[0]}</p>
        </div>
        <div className="groupText">
          <h3>Ended</h3>
          <p>{animeDetails.anime[0].aired.to?.split("-")[0]}</p>
        </div>
        <div className="groupText">
          <h3>Broadcast</h3>
          <p>{animeDetails.anime[0].broadcast?.string}</p>
        </div>
        <div className="groupText">
          <h3>Studio name</h3>
          <p>{animeDetails.anime[0].studios[0].name}</p>
        </div>
        <div className="groupText">
          <h3>Score</h3>
          <p>{animeDetails.anime[0].score}</p>
        </div>
        <div className="groupText">
          <h3>Genre</h3>
          <p>{animeDetails.anime[0].genres[0].name}</p>
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

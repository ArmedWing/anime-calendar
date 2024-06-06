<div>
  <div className="groupText">
    <h3>Aired</h3>
    <p>{anime.anime[0].aired.from.split("-")[0]}</p>
  </div>
  <div className="groupText">
    <h3>Ended</h3>
    <p>{anime.anime[0].aired.to?.split("-")[0]}</p>
  </div>
  <div className="groupText">
    <h3>Broadcast</h3>
    <p>{anime.anime[0].broadcast?.string}</p>
  </div>
  <div className="groupText">
    <h3>Studio name</h3>
    <p>{anime.anime[0].studios[0].name}</p>
  </div>
  <div className="groupText">
    <h3>Score</h3>
    <p>{anime.anime[0].score}</p>
  </div>
  <div className="groupText">
    <h3>Genre</h3>
    <p>{anime.anime[0].genres[0].name}</p>
  </div>
</div>;

/* .groupText {
  h3 {
    letter-spacing: 1.2px;
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 2px;
  }
  p {
    font-size: 16px;
  }
} */

/* .card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
  align-items: flex-start;
  max-height: 750px;
  
  margin-top: 20px;
  margin-left: 20px;
  margin-right: auto;
  flex: 1 0 41%;

  max-width: 30%;
  background-image: linear-gradient(90deg, #489be2, #0f629c);
  overflow: hidden;
  text-decoration: none;
  border-radius: 8px;
  border: 2px solid black;
} */

/* .animeImg {
  /* position: relative; */
/* width: 300px; */

/* max-height: 380px;
  transform: translate(250px, -586px); */
/* display: block; */

/* .anime-card {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
} */

// const fetchAnimeDetails = async (key) => {
//   if (!user) {
//     console.log("No user");
//     return;
//   }

//   try {
//     const userRef = doc(db, "users", user.displayName);
//     const animeCollectionRef = collection(userRef, "animes");
//     const querySnapshot = await getDocs(animeCollectionRef);
//     const animesDetails = querySnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));
//     setAnimeDetails(animesDetails);
//     const currentAnimeDetails = animesDetails.filter(
//       (anime) => anime.id === key
//     );
//     console.log(key);

//     console.log(currentAnimeDetails);
//   } catch (e) {
//     console.error("Error fetching anime details: ", e.message);
//   }
// };

// const [animeDetails, setAnimeDetails] = useState([]);

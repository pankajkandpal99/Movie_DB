import { useSelector } from "react-redux";
import "./style.scss";

const Genres = ({ data }) => {
  const { genres } = useSelector((state) => state.home);
//   console.log(genres); // isme poora genres ka object print hoga, jisme id: ke andar uss id ki details rahengi like name jisme mobie/tv ka type hota hai(genres)..

  return (
    <div className="genres">
    {/* isme neeche line me genre_ids me map kiya ja ra hai jo ki data ke naam se hai */}
      {data?.map((genre) => {
        {
          /* console.log(genre);     // isme genres ki ids print hogi...  */
        }
        {
          /* console.log(genres[genre].name); */
        }
        if (!genres[genre]?.name) return;
        return (
          <div key={genre} className="genre">
            {genres[genre]?.name}                {/* ye kuchh iss tarah ka hoga --> geners[12].name = action/drama/horror. yahi isme div ke andar accesss karke print kiya ja ra hai .. */}
          </div>
        );
      })}
    </div>
  );
};

export default Genres;

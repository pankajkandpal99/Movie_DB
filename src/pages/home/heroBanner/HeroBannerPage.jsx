import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import { useSelector } from "react-redux";
import Img from "../../../components/lazyLoadImage/Img";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";

import "./style.scss";

const HeroBannerPage = () => {
  const navigate = useNavigate();
  const [background, setBackground] = useState("");
  const [query, setQuery] = useState(""); // this is for search bar....
  const { url } = useSelector((state) => state.home);
  const { data, loading } = useFetch("/movie/upcoming"); // iss url ke response me backdrop_path milega....

  useEffect(() => {
    const bg =
      url.backdrop +
      data?.results?.[Math.floor(Math.random() * 20)]?.backdrop_path; // 20 se multiply isliye kiya gaya hai kyuki hamare api se response me only 20 results ka hi aayenge isliye max 20 tak hi jana chiye aur kisi bhi results ke andar se hame data receive ho jayega randomly... ?. ko optional chaining kaha jata hai
    setBackground(bg); //iss poore useEffect ka kaam aur useFetch custom hook ka kaam itna hai ki jab bhi page load ho to baar baar ye apne aap background me aane wali image ko change krta rahe....
  }, [data]); // jab data aa jayega fetch hoke tab ye wala useEffect chalega aur data ke andar response aa jayega...

  const searchQueryHandler = (event) => {
    if (event.key === "Enter" && query.length > 0) {
      navigate(`/search/${query}`);
    }
  };

  const inputChangeHandler = (event) => {
    setQuery(event.target.value);          // jab hum input field me tupe karte hain to ye uski ek ek value ko setQuery me put karta jata hai.
  };

  const searchButtonHandler = (event) => {
    if (query.length > 0) {
      navigate(`/search/${query}`);
    }
  };

  return (
    <div className="heroBanner">
      {!loading && (
        <div className="backdrop-img">
          <Img src={background} />
        </div>
      )}

      <div className="opacity-layer"></div>

      <ContentWrapper>
        <div className="heroBannerContent">
          <span className="title">Welcome</span>
          <span className="subTitle">
            Millions of movies, TV shows and people to discover. Explore now
          </span>
          <div className="searchInput">
            <input
              type="text"
              placeholder="Search for a movie or TV Shows..."
              onKeyUp={searchQueryHandler}
              onChange={inputChangeHandler}
            />
            <button onClick={searchButtonHandler}>Search</button>
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
};

export default HeroBannerPage;

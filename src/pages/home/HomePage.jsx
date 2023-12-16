import HeroBannerPage from "./heroBanner/HeroBannerPage";
import Trending from "./trending/Trending";
import Popular from "./popular/popular";
import "./style.scss";
import TopRated from "./topRated/TopRated";

const HomePage = () => {
  return (
    <div className="homePage">
      <HeroBannerPage />
      <Trending />
      <Popular />
      <TopRated />
    </div>
  );
};

export default HomePage;

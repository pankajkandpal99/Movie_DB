import HeroBannerPage from "./heroBanner/HeroBannerPage";
import Trending from "./trending/Trending";
import Popular from "./popular/Popular";
import TopRated from "./topRated/TopRated";
import "./style.scss";

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

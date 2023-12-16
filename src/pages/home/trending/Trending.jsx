import { useState } from "react";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import SwitchTabs from "../../../components/switchTabs/SwitchTab";
import useFetch from "../../../hooks/useFetch";
import Carousel from "../../../components/carousel/Carousel";

const Trending = () => {
  const [endPoint, setEndPoint] = useState("day"); // "day" ko hum capital nahi bana sakte hain kyuki hame use endpoint me bhejna hai ...
  const { data, loading } = useFetch(`/trending/all/${endPoint}`); // ye tab ke sath switch karne per original url hai jo ki IMDB ki hai -> trending/{media_type}/{time_window}... isme humne {media_type} k jagah all pass kar diya hai taki TV shows aur Movies dono ka data aa jaye and {time_window} me humne endPoint state ko use kar liya hai ....

  const onTabChange = (tab, index) => {
    setEndPoint(tab === "Day" ? "day" : "week");
  };

  return (
    <div className="carouselSection">
      <ContentWrapper>
        <span className="carouselTitle">Trending</span>
        <SwitchTabs data={["Day", "Week"]} onTabChange={onTabChange} />
      </ContentWrapper>
      <Carousel data={data?.results} loading={loading} endPoint={endPoint} />
    </div>
  );
};

export default Trending;

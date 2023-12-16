import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import DetailsBanner from "./detailsBanner/DetailsBanner";
import "./style.scss";
import Cast from "./cast/Cast";
import VideoSection from "./videosSection/VideoSection";
import Similar from "./carousels/Similar";
import Recommendation from "./carousels/Recommendation";

const DetailsPage = () => {
  const { mediaType, id } = useParams();
  const { data, loading } = useFetch(`/${mediaType}/${id}/videos`);
  const { data: credits, loading: creditsLoading } = useFetch(
    `/${mediaType}/${id}/credits`
  );

  // console.log(data);
  // console.log(credits);

  return (
    <div>
      <DetailsBanner video={data?.results?.[0]} crew={credits?.crew} />
      <Cast data={credits?.cast} loading={creditsLoading} />
      {data?.results?.length > 0 && <VideoSection data={data} loading={loading} />}
      <Similar mediaType={mediaType} id={id} />
      <Recommendation mediaType={mediaType} id={id} />
    </div>
  );
};

export default DetailsPage;

// 5:22:30

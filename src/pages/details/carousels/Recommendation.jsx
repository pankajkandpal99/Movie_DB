import Carousel from "../../../components/carousel/Carousel";
import useFetch from "../../../hooks/useFetch";

const Recommendation = ({ mediaType, id }) => {
  const { data, loading, error } = useFetch(
    `/${mediaType}/${id}/recommendations`
  );

  // console.log(data);

  return (
    <>
      {data?.results?.length > 0 && (
        <Carousel
          title="Recommendations"
          data={data?.results}
          loading={loading}
          endPoint={mediaType}
        />
      )}
    </>
  );
};

export default Recommendation;

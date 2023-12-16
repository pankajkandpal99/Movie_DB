import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "../../components/spinner/Spinner";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import "./style.scss";
import MovieCard from "../../components/movieCard/MovieCard";

const SearchResultPage = () => {
  const [data, setData] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const { query } = useParams(); // ye query url se extract hokar aayegi.

  const fetchInitialData = () => {
    setLoading(true);
    fetchDataFromApi(`/search/multi?query=${query}&page=${pageNum}`).then(
      (res) => {
        setData(res);
        setPageNum((prev) => prev + 1);
        setLoading(false);
      }
    );
  };

  const fetchNextPageData = () => {
    fetchDataFromApi(`/search/multi?query=${query}&page=${pageNum}`).then(
      (res) => {
        if (data?.results) {
          setData({ ...data, results: [...data.results, ...res.results] });
        } // iska ye matlab hai ki jitna data pehle load hua tha wo to rahega hi setData ke andar aur jo avi load hua hai naya page change hone se wo v usme merge ho jayega. kyuki results array bhi data ke andar hi hai to usi ke andar hame response mil raha hai jitna bhi search query se fetch hoga wo sab data.results ke andar hame milega. chuki results ke andar pehle page ka data aur baki sab page ka data aayega page change hone per to hame un sab page ka data hame merge karna hai aapas me. iss upper wali line ka yahi matlab hai.
        else {
          setData(res);
        }
        setPageNum((prev) => prev + 1);
      }
    );
  };

  useEffect(() => {
    setPageNum(1);
    fetchInitialData();
  }, [query]);

  return (
    <div className="searchResultsPage">
      {loading && <Spinner initial={true} />}
      {!loading && (
        <ContentWrapper>
          {data?.results?.length > 0 ? (
            <>
              <div className="pageTitle">
                {`Search ${
                  data?.total_results > 1 ? "results" : "result"
                } of '${query}'`}
              </div>
              <InfiniteScroll
                className="content"
                dataLength={data?.results?.length || []}
                next={fetchNextPageData}
                hasMore={pageNum <= data?.total_pages}
                loader={<Spinner />}
              >
                {data?.results?.map((item, index) => {
                  if (item.media_type === "person") {
                    return;
                  }
                  return (
                    <MovieCard key={index} data={item} fromSearch={true} />
                  );
                })}
              </InfiniteScroll>
            </>
          ) : (
            <span className="resultNotFound">Sorry, Results not found!</span>
          )}
        </ContentWrapper>
      )}
    </div>
  );
};

export default SearchResultPage;

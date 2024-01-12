import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";
// import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "../../components/spinner/Spinner";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import MovieCard from "../../components/movieCard/MovieCard";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import "./style.scss";

const SearchResultPage = () => {
  const [data, setData] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [selectPageNum, setSelectPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const paginationContainer = useRef();
  const { query } = useParams();

  const fetchInitialData = () => {
    setLoading(true);
    fetchDataFromApi(`/search/multi?query=${query}&page=${pageNum}`).then(
      (res) => {
        setData(res);
        // setPageNum((prev) => prev + 1); // for infinite scrolling
        setLoading(false);
      }
    );
  };

  // for Infinite scrolling
  // const fetchNextPageData = () => {
  //   fetchDataFromApi(`/search/multi?query=${query}&page=${pageNum}`).then(
  //     (res) => {
  //       if (data?.results) {
  //         setData({ ...data, results: [...data.results, ...res.results] });
  //       } else {
  //         setData(res);
  //       }
  //       setPageNum((prev) => prev + 1);
  //     }
  //   );
  // };

  const handlePage = (index) => {
    setPageNum(index);
    setSelectPageNum(index);
  };

  const navigation = (direction) => {
    const container = paginationContainer.current;
    const scrollAmount =
      direction === "left"
        ? container.scrollLeft - (container.offsetWidth + 0) // jab left scroll wale button per click kiya jayega tab wo uske container ki width ke barabar aur usme 20 plus karke age badh jayega...
        : container.scrollLeft + (container.offsetWidth + 0); //  iska ye matlab hai ki scroll left aur scroll right karne wala arrow move hota hai wo position pe jaha hum use ye code se set karte hain
    container.scrollTo({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    setPageNum(1);
    fetchInitialData();
  }, [query]);

  useEffect(() => {
    if (data) {
      setLoading(true);
      fetchDataFromApi(`/search/multi?query=${query}&page=${pageNum}`).then(
        (res) => {
          if (data?.results) {
            setData({ ...data, results: [...res.results] });
          }
          setLoading(false);
        }
      );
    }
  }, [pageNum]);

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

              {/* Infinite Scrolling */}
              {/*<InfiniteScroll
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
              </InfiniteScroll> */}

              <div className="content">
                {data?.results?.map((item, index) => {
                  if (item.media_type === "person") {
                    return;
                  }
                  return (
                    <MovieCard key={index} data={item} fromSearch={true} />
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="parent">
                <div className="pageContent">{`Showing page no ${pageNum} of total ${data?.total_pages} pages`}</div>
                <div className="pagination">
                  <div className="left-icon arrow ">
                    <ChevronLeftIcon
                      className={`${pageNum === 1 ? "disable" : ""}`}
                      onClick={() => navigation("left")}
                    />
                  </div>

                  <div
                    className="paginationNumbersContainer"
                    ref={paginationContainer}
                  >
                    {Array.from({ length: data.total_pages || 0 }).map(
                      (el, index) => (
                        <div
                          key={index}
                          onClick={() => handlePage(index + 1)}
                          className={`paginationNumber ${
                            pageNum === index + 1
                              ? "paginationNumberActive"
                              : ""
                          }`}
                        >
                          {index + 1}
                        </div>
                      )
                    )}
                  </div>

                  <div className="right-icon arrow">
                    <ChevronRightIcon
                      className={`${
                        pageNum === data.total_pages ? "disable" : ""
                      }`}
                      onClick={() => navigation("right")}
                    />
                  </div>
                </div>
              </div>
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

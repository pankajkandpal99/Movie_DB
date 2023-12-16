import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Select from "react-select";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import useFetch from "../../hooks/useFetch";
import Spinner from "../../components/spinner/Spinner";
import InfiniteScroll from "react-infinite-scroll-component";
import MovieCard from "../../components/movieCard/MovieCard";
import { fetchDataFromApi } from "../../utils/api";
import "./style.scss";

let filters = {};

const sortbyData = [
  { value: "popularity.desc", label: "Popularity Descending" },
  { value: "popularity.asc", label: "Popularity Ascending" },
  { value: "vote_average.desc", label: "Rating Descending" },
  { value: "vote_average.asc", label: "Rating Ascending" },
  { value: "primary_release_date.desc", label: "Release Date Descending" },
  { value: "primary_release_date.asc", label: "Release Date Ascending" },
  { value: "original_title.asc", label: "Title (A-Z)" },
];

const ExplorePage = () => {
  const { mediaType } = useParams();
  const [data, setData] = useState(null);
  const [genre, setGenre] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [sortby, setSortBy] = useState(null);

  const { data: genresData } = useFetch(`/genre/${mediaType}/list`);
  // console.log(genresData);

  const fetchInitialData = () => {
    setLoading(true);
    fetchDataFromApi(`/discover/${mediaType}`, filters).then((res) => {
      setData(res);
      setPageNum((prev) => prev + 1);
      setLoading(false);
    });
  };

  const fetchNextPageData = () => {
    fetchDataFromApi(`/discover/${mediaType}?page=${pageNum}`, filters).then(
      (res) => {
        if (data?.results) {
          setData({ ...data, results: [...data?.results, ...res.results] });
        } else {
          setData(res);
        }
        setPageNum((prev) => prev + 1);
      }
    );
  };

  useEffect(() => {
    filters = {};
    setData(null);
    setPageNum(1);
    setSortBy(null);
    setGenre(null);
    fetchInitialData();
  }, [mediaType]);

  const onChange = (selectedItems, action) => {
    // ise hum web page me inspect bhi kar sakte hain --> inspect > source > search explore.jsx page > then debug it...
    if (action.name === "sortby") {
      // console.log(action.name);
      setSortBy(selectedItems);
      console.log(selectedItems.value);

      if (action.action !== "clear") {
        console.log(selectedItems);
        filters.sort_by = selectedItems.value;
      } else {
        delete filters.sort_by;
      }
    }

    if (action.name === "genres") {
      setGenre(selectedItems);
      if (action.action !== "clear") {
        // console.log(selectedItems);    // selectedItems ek array ke form ka hai kyuki iske andar multiple genres hain.
        let genreId = selectedItems.map((g) => {
          console.log(g); // map array return karta hai.
          return g.id;
        });
        // console.log(genreId);
        genreId = JSON.stringify(genreId).slice(1, -1); // yaha slice method se hame array ke brackets hatane me help milti hai.
        // console.log(genreId);
        filters.with_genres = genreId; // isme filter objetc ke andar "with_genres" key banayi jisme wo selected genres store kiye jayenge jo multiple genres select karne ke liye hai.
      } else {
        console.log(action.action); // its for clear.
        delete filters.with_genres;
      }
    }

    setPageNum(1);
    fetchInitialData();
  };

  return (
    <div className="explorePage">
      <ContentWrapper>
        <div className="pageHeader">
          <div className="pageTitle">
            {mediaType === "tv" ? "Explore TV Shows" : "Explore Movies"}
          </div>
          <div className="filters">
            <Select
              isMulti // This prop is used when you want to allow multiple selections. In this case, since it's set to true, users can select multiple genres.
              name="genres"
              value={genre} // The current value of the <select> element, controlled by the genre state.
              closeMenuOnSelect={false} // When set to false, the dropdown menu will remain open after an option is selected.
              options={genresData?.genres} // An array of options to be displayed in the dropdown. It is derived from the genresData fetched through the useFetch hook.
              getOptionLabel={(option) => option.name} // These functions are used to determine how to display the options (getOptionLabel) and how to identify each option (getOptionValue) based on the data structure of each genre.
              getOptionValue={(option) => option.id}
              onChange={onChange} // The function to be called when the user selects an option. This is where you can handle the change in the genre state.
              placeholder="Select genres" // The text to display when no option is selected.
              className="react-select-container genresDD"
              classNamePrefix="react-select"
            />
            <Select
              name="sortby"
              value={sortby}
              options={sortbyData}
              onChange={onChange}
              isClearable={true}
              placeholder="Sort by"
              className="react-select-container sortbyDD"
              classNamePrefix="react-select"
            />
          </div>
        </div>

        {loading && <Spinner initial={true} />}
        {!loading && (
          <>
            {data?.results?.length > 0 ? (
              <InfiniteScroll
                className="content"
                dataLength={data?.results?.length || []}
                next={fetchNextPageData}
                hasMore={pageNum <= data?.total_pages} // Infinite scrolling tab tk chalegi jab tk pageNum ki value data.total_pages ke barabar tk reach nahi kar jati ...
                loader={<Spinner />}
              >
                {data?.results.map((item, index) => {
                  if (item.media_type === "person") return;
                  return (
                    <MovieCard key={index} data={item} mediaType={mediaType} />
                  );
                })}
              </InfiniteScroll>
            ) : (
              <span className="resultNotFound">Sorry, Results not found!</span>
            )}
          </>
        )}
      </ContentWrapper>
    </div>
  );
};

export default ExplorePage;

// 6:13:00

import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";
import ContentWrapper from "../contentWrapper/ContentWrapper";
import Img from "../lazyLoadImage/Img";
import dayjs from "dayjs";
import PosterFallBack from "../../assets/no-poster.png";
import CircleRating from "../circleRating/CircleRating";
import Genres from "../genres/Genres";
import "./style.scss";

const Carousel = ({ title, data, loading, endPoint }) => {
  // console.log(data);
  const carouselContainer = useRef(); // jaise javascript me kisi bhi html element ko select karne ke liye document.getElement ya fir document.querySelector use kiya jata hai but react me aise ni kiya jata hai, react me kisi bhi element or Node ko select karke access karne ke liye uska refrence liya jata hai useRef() hook ke dwara, jo ki uss element ka refrence hame de deta hai currenct property ke through...
  const { url } = useSelector((state) => state.home); // store me rootReducer se homeSlice ke andar state se url ko extract kiya gaya hai...
  const navigate = useNavigate();

  const navigation = (dir) => {
    const container = carouselContainer.current;
    const scrollAmount =
      dir === "left"
        ? container.scrollLeft - (container.offsetWidth + 20) // jab left scroll wale button per click kiya jayega tab wo uske container ki width ke barabar aur usme 20 plus karke age badh jayega...
        : container.scrollLeft + (container.offsetWidth + 20); //  iska ye matlab hai ki scroll left aur scroll right karne wala arrow move hota hai wo position pe jaha hum use ye code se set karte hain
    container.scrollTo({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  const skeletonItem = () => {
    return (
      <div className="skeletonItem">
        <div className="posterBlock skeleton">
          {/* skeleton ki css index.scss me present hai... */}
          <div className="textBlock">
            <div className="title"></div>
            <div className="date"></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="carousel">
      <ContentWrapper>
        {title && <div className="carouselTitle">{title}</div>}

        <BsFillArrowLeftCircleFill
          className="carouselLeftNav arrow"
          onClick={() => navigation("left")}
        />
        <BsFillArrowRightCircleFill
          className="carouselRightNav arrow"
          onClick={() => navigation("right")}
        />

        {!loading ? (
          <div className="carouselItems" ref={carouselContainer}>
            {data?.map((item) => {
              // console.log(item);
              const posterUrl = item.poster_path
                ? url.poster + item.poster_path
                : PosterFallBack;
              return (
                <div
                  key={item.id}
                  className="carouselItem"
                  onClick={() =>
                    navigate(`/${item.media_type || endPoint}/${item.id}`)
                  }
                >
                  {" "}
                  {/* har returned object me media_type name ka key hoti hai jisme movie ka type diya gaya rehta hai... */}
                  <div className="posterBlock">
                    <Img src={posterUrl} />
                    <CircleRating rating={item.vote_average.toFixed(1)} />
                    <Genres data={item.genre_ids.slice(0, 2)} />{" "}
                    {/* item object ke andar genre_ids: [ 16, 28, 10751, 35 ] bhi hai jise hum extract krke data ke andar save kr re hain. isme humne slice method ka use krke geners ke 2 hi values ko use kiya hai jaise --> action, drama, horror, entertainment etc... inme se starting ki 2 values hi genres me aayengi aur screen per 2 hi genres ke type dikhenge. */}
                  </div>
                  <div className="textBlock">
                    <span className="title">{item.title || item.name}</span>
                    <span className="date">
                      {dayjs(item.release_Date).format("MMM DD, YYYY")}
                    </span>{" "}
                    {/* MMM: Represents the abbreviated month name (3 letters). For example, "Jan" for January.... DD: Represents the day of the month as two digits. For example, "01" for the first day..... YYYY: Represents the four-digit year. For example, "2023". */}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="loadingSkeleton">
            {/* this is only for when incoming data is loading state... */}
            {skeletonItem()}
            {skeletonItem()}
            {skeletonItem()}
            {skeletonItem()}
            {skeletonItem()}
          </div>
        )}
      </ContentWrapper>
    </div>
  );
};

export default Carousel;

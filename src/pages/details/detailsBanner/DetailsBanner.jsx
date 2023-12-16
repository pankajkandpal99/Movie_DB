import React, { useState } from "react";
import PosterFallback from "../../../assets/no-poster.png";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import { useParams } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import { useSelector } from "react-redux";
import Img from "../../../components/lazyLoadImage/img";
import dayjs from "dayjs";
import Genres from "../../../components/genres/Genres";
import CircleRating from "../../../components/circleRating/CircleRating";
import { PlayButton } from "../PlayButton";
import "./style.scss";
import VideoPopup from "../../../components/videoPopup/VideoPopup";

const DetailsBanner = ({ video, crew }) => {
  const [show, setShow] = useState(false);
  const [videoId, setVideoId] = useState(null);

  const { mediaType, id } = useParams(); // ye media_type aur id ko url se fetch karega jo ki homePage me available items ko click karne per IMDB ke server ko bhejta hai aur server se response ko useFetch leke aata hai api.js file ki help se.
  const { data, loading } = useFetch(`/${mediaType}/${id}`);
  // console.log(data);

  const { url } = useSelector((state) => state.home);
  // console.log(url.backdrop);

  const _genres = data?.genres?.map((gen) => gen.id);
  const director = crew?.filter((person) => person.job === "Director"); // hame wo sab ek array me chiye jinka job 'Director' ho...
  const writer = crew?.filter(
    (person) =>
      person.job === "Screenplay" ||
      person.job === "Story" ||
      person.job === "Writer"
  );

  const toHoursAndMinuts = (totalMinutes) => {
    // ye function movie ki length ko format karke dega ki movie kitni badi hai...
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes > 0 ? `${minutes}m` : ""}`;
  };

  return (
    <div className="detailsBanner">
      {!loading ? (
        <>
          {!!data && (
            <React.Fragment>
              <div className="backdrop-img">
                <Img src={url.backdrop + data?.backdrop_path} />
              </div>
              <div className="opacity-layer"></div>
              <ContentWrapper>
                <div className="content">
                  <div className="left">
                    {data.poster_path ? (
                      <Img
                        className="posterImg"
                        src={url.backdrop + data.poster_path}
                      />
                    ) : (
                      <Img className="posterImg" src={PosterFallback} />
                    )}
                  </div>
                  <div className="right">
                    <div className="title">
                      {/* data.name tv shows ke case me aur data.title movies ke case me aayega */}
                      {`${data.name || data.title} (${dayjs(
                        data?.release_date
                      ).format("YYYY")})`}
                    </div>
                    <div className="subtitle">{data.tagline}</div>
                    <Genres data={_genres} />

                    <div className="row">
                      <CircleRating rating={data.vote_average.toFixed(1)} />
                      <div
                        className="playbtn"
                        onClick={() => {
                          setShow(true);
                          setVideoId(video.key);
                        }}
                      >
                        <PlayButton />
                        <span className="text">Watch Trailer</span>
                      </div>
                    </div>

                    <div className="overview">
                      <div className="heading">Overview</div>
                      <div className="description">{data.overview}</div>
                    </div>

                    <div className="info">
                      {data?.status && (
                        <div className="infoItem">
                          <span className="text bold">Status: </span>
                          <span className="text">{data.status}</span>
                        </div>
                      )}
                      {data?.release_date && (
                        <div className="infoItem">
                          <span className="text bold">Release Date: </span>
                          <span className="text">
                            {dayjs(data.release_date).format("MMM DD, YYYY")}
                          </span>
                        </div>
                      )}
                      {data?.runtime && (
                        <div className="infoItem">
                          <span className="text bold">Runtime: </span>
                          <span className="text">
                            {toHoursAndMinuts(data.runtime)}
                          </span>
                        </div>
                      )}
                    </div>

                    {director?.length > 0 && (
                      <div className="info">
                        <span className="text bold">Director: </span>
                        <span className="text">
                          {director?.map((dir, idx) => (
                            <span key={idx}>
                              {dir.name}
                              {/* director.length - 1 !== idx: This part checks if the current director (specified by the index idx) is not the last director in the array. It compares the index idx with the length of the director array reduced by 1. If they are not equal, it means the current director is not the last one. agar wo last index nahi hai to usme comma add karo. */}
                              {director.length - 1 !== idx && ", "}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}

                    {writer?.length > 0 && (
                      <div className="info">
                        <span className="text bold">Writer: </span>
                        <span className="text">
                          {writer?.map((wr, idx) => (
                            <span key={idx}>
                              {wr.name}
                              {writer.length - 1 === idx ? "" : ", "}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}

                    {data?.created_by?.length > 0 && (
                      <div className="info">
                        <span className="text bold">Creator: </span>
                        <span className="text">
                          {data?.created_by?.map((d, idx) => (
                            <span key={idx}>
                              {d.name}
                              {data.created_by.length - 1 !== idx && ", "}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </ContentWrapper>

              <VideoPopup
                show={show}
                videoId={videoId}
                setShow={setShow}
                setVideoId={setVideoId}
              />
            </React.Fragment>
          )}
        </>
      ) : (
        <div className="detailsBannerSkeleton">
          <ContentWrapper>
            <div className="left skeleton"></div>
            <div className="right">
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
            </div>
          </ContentWrapper>
        </div>
      )}
    </div>
  );
};

export default DetailsBanner;

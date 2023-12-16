import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const Img = ({ className, src }) => {
  return (
    <LazyLoadImage
      className={className || ""}
      alt=""
      effect="opacity"
      src={src}
    />
  );
};

export default Img;

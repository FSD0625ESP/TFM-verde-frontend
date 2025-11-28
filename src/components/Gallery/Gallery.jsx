import { useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "swiper/css/zoom";
import "swiper/css/thumbs";

// import required modules
import { Navigation, Thumbs, FreeMode, Zoom } from "swiper/modules";
import "./Gallery.css";

export default function Gallery({ images }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <div id="gallery">
      <Swiper
        // Default parameters
        initialSlide={1}
        slidesPerView={1}
        spaceBetween={20}
        navigation={true}
        speed={700}
        loop={true}
        zoom={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[Navigation, Thumbs, FreeMode, Zoom]}
        className="mySwiper"
        style={{ maxWidth: "100%", margin: "0 auto 10px auto" }}
      >
        {images.map((img, idx) => {
          console.log("img", img);
          return (
            <SwiperSlide>
              <div key={idx} className="swiper-zoom-container ">
                <img src={img} className="rounded-lg" />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <Swiper
        onSwiper={setThumbsSwiper}
        initialSlide={1}
        loop={true}
        spaceBetween={10}
        slidesPerView={5}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[Navigation, Thumbs, FreeMode]}
        className="myThumbsSwiper"
      >
        {images.map((img, idx) => {
          console.log("img", img);
          return (
            <SwiperSlide>
              <img key={`thumb-${idx}`} alt={`Thumbnail ${idx}`} src={img} className="rounded-lg" />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}

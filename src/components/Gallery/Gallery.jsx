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
        initialSlide={0}
        slidesPerView={1}
        spaceBetween={20}
        navigation={true}
        speed={700}
        loop={false}
        zoom={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[Navigation, Thumbs, FreeMode, Zoom]}
        className="mySwiper"
        style={{ maxWidth: "100%", margin: "0 auto 10px auto" }}
      >
        {images.map((img, idx) => {
          return (
            <SwiperSlide key={img.public_id}>
              <div className="swiper-zoom-container ">
                <img
                  src={img.url}
                  className="rounded-lg"
                  alt={`Image ${idx}`}
                />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <Swiper
        onSwiper={setThumbsSwiper}
        initialSlide={0}
        loop={false}
        spaceBetween={10}
        slidesPerView={5}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[Navigation, Thumbs, FreeMode]}
        className="myThumbsSwiper"
      >
        {images.map((img, idx) => {
          return (
            <SwiperSlide key={`thumb-${img.public_id}`}>
              <img
                alt={`Thumbnail ${idx}`}
                src={img.url}
                className="rounded-lg"
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}

import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

// import required modules
import { EffectFade, Autoplay, Navigation, Pagination } from "swiper/modules";
import "./Slider.css";
import { Card, CardHeader, CardFooter, Image, Button } from "@heroui/react";
import ListElement from "../ListElement/ListElement";

export default function Slider({ items, type, numSlides }) {
  const safeItems = Array.isArray(items) ? items : [];
  if (safeItems.length === 0) return null;

  const shouldLoop = safeItems.length > 1;
  const swiperKey = `${type || "item"}-${numSlides}-${safeItems.length}`;

  return (
    <>
      {numSlides === 1 && (
        <Swiper
          key={swiperKey}
          navigation={true}
          pagination={{
            clickable: true,
          }}
          effect={"fade"}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={shouldLoop}
          speed={1200}
          modules={[Autoplay, EffectFade, Navigation, Pagination]}
          className="mySwiper slider-single-element"
          style={{ maxWidth: "100%", margin: "0 auto" }}
        >
          {safeItems.map((i, idx) => (
            <SwiperSlide key={i?._id || idx}>
              <div
                style={{
                  height: "50vh",
                  minHeight: "400px",
                  width: "100%",
                  color: "#fff",
                  padding: "40px 20px",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundImage: `url(${type === "store" ? i.image : i.images[0]
                    })`,
                }}
              >
                <div className="slide-content">
                  <h2 className="text-white font-bold text-2xl text-center mb-3 drop-shadow-lg">
                    {type === "store" ? i.name : i.title}
                  </h2>
                  <p className="text-white font-bold text-center drop-shadow-lg">
                    {i.description}
                  </p>
                </div>
                {type === "store" && (
                  <div className="shop-logo">
                    <img src={i.logo} alt={`${i.name} logo`} />
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      {numSlides > 1 && (
        <Swiper
          key={swiperKey}
          // Default parameters
          slidesPerView={1}
          spaceBetween={16}
          // Responsive breakpoints
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            480: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 16,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 16,
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
          }}
          navigation={true}
          pagination={{
            clickable: true,
          }}
          speed={700}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={shouldLoop}
          modules={[Autoplay, Navigation, Pagination]}
          className="mySwiper slider-list-elements"
          style={{ maxWidth: "100%", margin: "0 auto" }}
        >
          {safeItems.map((i, idx) => (
            <SwiperSlide key={i._id || idx}>
              <ListElement item={i} type={type} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </>
  );
}

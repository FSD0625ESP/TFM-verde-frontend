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

export default function Slider({ items, type, numSlides }) {
  return (
    <>
      {numSlides === 1 && (
        <Swiper
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
          loop={true}
          speed={1200}
          modules={[Autoplay, EffectFade, Navigation, Pagination]}
          className="mySwiper"
          style={{ maxWidth: "100%", margin: "0 auto" }}
        >
          {items.map((i, idx) => (
            <SwiperSlide>
              <div
                key={idx}
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
                  <h2 className="text-white font-bold font-medium text-2xl text-center mb-3 drop-shadow-lg">
                    {type === "store" ? i.name : i.title}
                  </h2>
                  <p className="text-white font-bold font-medium text-center drop-shadow-lg">
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
          // Default parameters
          slidesPerView={1}
          spaceBetween={16}
          // Responsive breakpoints
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 0,
            },
            480: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            560: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            840: {
              slidesPerView: 3,
              spaceBetween: 16,
            },
            1200: {
              slidesPerView: 4,
              spaceBetween: 16,
            },
          }}
          navigation={true}
          speed={700}
          modules={[Navigation]}
          className="mySwiper"
          style={{ maxWidth: "100%", margin: "0 auto" }}
        >
          {items.map((i, idx) => (
            <SwiperSlide>
              <Card
                isFooterBlurred
                className="slider-card w-full h-[260px] col-span-12 sm:col-span-5"
                key={idx}
              >
                <CardHeader className="absolute z-10 top-1 flex-row items-start">
                  {type === "product" && i.nuevo && (
                    <p className="tag tag-nuevo text-tiny uppercase font-bold">
                      Nuevo
                    </p>
                  )}
                  {type === "product" && i.oferta && (
                    <p className="tag tag-oferta text-tiny uppercase font-bold">
                      Oferta
                    </p>
                  )}
                </CardHeader>
                <Image
                  removeWrapper
                  alt="Card example background"
                  className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
                  src={type === "store" ? `${i.image}` : `${i.images[0]}`}
                />
                <CardFooter className="absolute bg-white/60 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
                  <div>
                    <h5 className="text-black font-bold">
                      {type === "store" ? i.name : i.title}
                    </h5>
                  </div>
                  <Button
                    className="text-tiny text-white"
                    color="primary"
                    radius="sm"
                    size="sm"
                    shadow="sm"
                  >
                    VER
                  </Button>
                </CardFooter>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </>
  );
}

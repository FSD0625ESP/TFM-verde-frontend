import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Slider.css";
import { Card, CardHeader, CardFooter, Image, Button } from "@heroui/react";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const slides = [
  { title: "Slide One", subtitle: "This is the first slide.", bg: "#1abc9c" },
  { title: "Slide Two", subtitle: "Here's the second slide.", bg: "#3498db" },
  { title: "Slide Three", subtitle: "And the third slide.", bg: "#9b59b6" },
  { title: "Slide Four", subtitle: "And the fourth slide.", bg: "#34495e" },
  { title: "Slide Five", subtitle: "And the fifth slide.", bg: "#16a085" },
  { title: "Slide Six", subtitle: "And the sixth slide.", bg: "#27ae60" },
];

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
};

const settings2 = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
  arrows: true,
  /*nextArrow: (
    <div>
      <div className="next-slick-arrow">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          stroke="#26a69a"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
        >
          <path d="m242-200 200-280-200-280h98l200 280-200 280h-98Zm238 0 200-280-200-280h98l200 280-200 280h-98Z" />
        </svg>
      </div>
    </div>
  ),

  prevArrow: (
    <div>
      <div className="next-slick-arrow rotate-180">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          stroke="#26a69a"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
        >
          <path d="m242-200 200-280-200-280h98l200 280-200 280h-98Zm238 0 200-280-200-280h98l200 280-200 280h-98Z" />
        </svg>
      </div>
    </div>
  ),*/
};

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

/*import "./styles.css";*/

// import required modules
import { Navigation, Pagination } from "swiper/modules";

export default function HeroSlider() {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay(),
  ]);

  return (
    <>
      <h1>React Slick Slider </h1>
      <div className="hero-slider" style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Slider {...settings}>
          {slides.map((s, idx) => (
            <div key={idx}>
              <div
                style={{
                  minHeight: 320,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  color: "#fff",
                  background: s.bg,
                  padding: "40px 20px",
                }}
              >
                <h2 style={{ margin: 0 }}>{s.title}</h2>
                <p style={{ marginTop: 8 }}>{s.subtitle}</p>
              </div>
            </div>
          ))}
        </Slider>
        <br />
        <br />
        <br />
        <br />

        <Slider {...settings2}>
          <div>
            <Card
              isFooterBlurred
              className="slider-card w-full h-[260px] col-span-12 sm:col-span-5"
            >
              <CardHeader className="absolute z-10 top-1 flex-col items-start">
                <p className="text-tiny text-white/60 uppercase font-bold">
                  New
                </p>
                <h4 className="text-black font-medium text-2xl">Store Name</h4>
              </CardHeader>
              <Image
                removeWrapper
                alt="Card example background"
                className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
                src="https://picsum.photos/200/200?random=1"
              />
              <CardFooter className="absolute bg-white/60 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
                <div>
                  <p className="text-black text-tiny">Store Description</p>
                </div>
                <Button
                  className="text-tiny"
                  color="primary"
                  radius="sm"
                  size="sm"
                  shadow="sm"
                >
                  Ver
                </Button>
              </CardFooter>
            </Card>
          </div>
          <div>
            <Card
              isFooterBlurred
              className="slider-card w-full h-[260px] col-span-12 sm:col-span-5"
            >
              <CardHeader className="absolute z-10 top-1 flex-col items-start">
                <p className="text-tiny text-white/60 uppercase font-bold">
                  New
                </p>
                <h4 className="text-black font-medium text-2xl">Store Name</h4>
              </CardHeader>
              <Image
                removeWrapper
                alt="Card example background"
                className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
                src="https://picsum.photos/200/200?random=2"
              />
              <CardFooter className="absolute bg-white/60 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
                <div>
                  <p className="text-black text-tiny">Store Description</p>
                </div>
                <Button
                  className="text-tiny"
                  color="primary"
                  radius="sm"
                  size="sm"
                  shadow="sm"
                >
                  Ver
                </Button>
              </CardFooter>
            </Card>
          </div>
          <div>
            <Card
              isFooterBlurred
              className="slider-card w-full h-[260px] col-span-12 sm:col-span-5"
            >
              <CardHeader className="absolute z-10 top-1 flex-col items-start">
                <p className="text-tiny text-white/60 uppercase font-bold">
                  New
                </p>
                <h4 className="text-black font-medium text-2xl">Store Name</h4>
              </CardHeader>
              <Image
                removeWrapper
                alt="Card example background"
                className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
                src="https://picsum.photos/200/200?random=3"
              />
              <CardFooter className="absolute bg-white/60 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
                <div>
                  <p className="text-black text-tiny">Store Description</p>
                </div>
                <Button
                  className="text-tiny"
                  color="primary"
                  radius="sm"
                  size="sm"
                  shadow="sm"
                >
                  Ver
                </Button>
              </CardFooter>
            </Card>
          </div>
          <div>
            <Card
              isFooterBlurred
              className="slider-card w-full h-[260px] col-span-12 sm:col-span-5"
            >
              <CardHeader className="absolute z-10 top-1 flex-col items-start">
                <p className="text-tiny text-white/60 uppercase font-bold">
                  New
                </p>
                <h4 className="text-black font-medium text-2xl">Store Name</h4>
              </CardHeader>
              <Image
                removeWrapper
                alt="Card example background"
                className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
                src="https://picsum.photos/200/200?random=4"
              />
              <CardFooter className="absolute bg-white/60 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
                <div>
                  <p className="text-black text-tiny">Store Description</p>
                </div>
                <Button
                  className="text-tiny"
                  color="primary"
                  radius="sm"
                  size="sm"
                  shadow="sm"
                >
                  Ver
                </Button>
              </CardFooter>
            </Card>
          </div>
          <div>
            <Card
              isFooterBlurred
              className="slider-card w-full h-[260px] col-span-12 sm:col-span-5"
            >
              <CardHeader className="absolute z-10 top-1 flex-col items-start">
                <p className="text-tiny text-white/60 uppercase font-bold">
                  New
                </p>
                <h4 className="text-black font-medium text-2xl">Store Name</h4>
              </CardHeader>
              <Image
                removeWrapper
                alt="Card example background"
                className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
                src="https://picsum.photos/200/200?random=5"
              />
              <CardFooter className="absolute bg-white/60 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
                <div>
                  <p className="text-black text-tiny">Store Description</p>
                </div>
                <Button
                  className="text-tiny"
                  color="primary"
                  radius="sm"
                  size="sm"
                  shadow="sm"
                >
                  Ver
                </Button>
              </CardFooter>
            </Card>
          </div>
        </Slider>
      </div>

      <br />
      <br />
      <br />
      <br />

      <h1>React Embla Carousel Example</h1>

      <div className="embla max-w-[1200px] mx-auto" ref={emblaRef}>
        <div className="embla__container embla__25">
          <div className="embla__slide">
            <Card
              isFooterBlurred
              className="slider-card w-full h-[260px] col-span-12 sm:col-span-5"
            >
              <CardHeader className="absolute z-10 top-1 flex-col items-start">
                <p className="text-tiny text-white/60 uppercase font-bold">
                  New
                </p>
                <h4 className="text-black font-medium text-2xl">Store Name</h4>
              </CardHeader>
              <Image
                removeWrapper
                alt="Card example background"
                className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
                src="https://picsum.photos/200/200?random=2"
              />
              <CardFooter className="absolute bg-white/60 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
                <div>
                  <p className="text-black text-tiny">Store Description</p>
                </div>
                <Button
                  className="text-tiny"
                  color="primary"
                  radius="sm"
                  size="sm"
                  shadow="sm"
                >
                  Ver
                </Button>
              </CardFooter>
            </Card>
          </div>
          <div className="embla__slide">
            <Card
              isFooterBlurred
              className="slider-card w-full h-[260px] col-span-12 sm:col-span-5"
            >
              <CardHeader className="absolute z-10 top-1 flex-col items-start">
                <p className="text-tiny text-white/60 uppercase font-bold">
                  New
                </p>
                <h4 className="text-black font-medium text-2xl">Store Name</h4>
              </CardHeader>
              <Image
                removeWrapper
                alt="Card example background"
                className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
                src="https://picsum.photos/200/200?random=3"
              />
              <CardFooter className="absolute bg-white/60 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
                <div>
                  <p className="text-black text-tiny">Store Description</p>
                </div>
                <Button
                  className="text-tiny"
                  color="primary"
                  radius="sm"
                  size="sm"
                  shadow="sm"
                >
                  Ver
                </Button>
              </CardFooter>
            </Card>
          </div>
          <div className="embla__slide">
            <Card
              isFooterBlurred
              className="slider-card w-full h-[260px] col-span-12 sm:col-span-5"
            >
              <CardHeader className="absolute z-10 top-1 flex-col items-start">
                <p className="text-tiny text-white/60 uppercase font-bold">
                  New
                </p>
                <h4 className="text-black font-medium text-2xl">Store Name</h4>
              </CardHeader>
              <Image
                removeWrapper
                alt="Card example background"
                className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
                src="https://picsum.photos/200/200?random=4"
              />
              <CardFooter className="absolute bg-white/60 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
                <div>
                  <p className="text-black text-tiny">Store Description</p>
                </div>
                <Button
                  className="text-tiny"
                  color="primary"
                  radius="sm"
                  size="sm"
                  shadow="sm"
                >
                  Ver
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="embla__slide">
            <Card
              isFooterBlurred
              className="slider-card w-full h-[260px] col-span-12 sm:col-span-5"
            >
              <CardHeader className="absolute z-10 top-1 flex-col items-start">
                <p className="text-tiny text-white/60 uppercase font-bold">
                  New
                </p>
                <h4 className="text-black font-medium text-2xl">Store Name</h4>
              </CardHeader>
              <Image
                removeWrapper
                alt="Card example background"
                className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
                src="https://picsum.photos/200/200?random=6"
              />
              <CardFooter className="absolute bg-white/60 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
                <div>
                  <p className="text-black text-tiny">Store Description</p>
                </div>
                <Button
                  className="text-tiny"
                  color="primary"
                  radius="sm"
                  size="sm"
                  shadow="sm"
                >
                  Ver
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="embla__slide">
            <Card
              isFooterBlurred
              className="slider-card w-full h-[260px] col-span-12 sm:col-span-5"
            >
              <CardHeader className="absolute z-10 top-1 flex-col items-start">
                <p className="text-tiny text-white/60 uppercase font-bold">
                  New
                </p>
                <h4 className="text-black font-medium text-2xl">Store Name</h4>
              </CardHeader>
              <Image
                removeWrapper
                alt="Card example background"
                className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
                src="https://picsum.photos/200/200?random=7"
              />
              <CardFooter className="absolute bg-white/60 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
                <div>
                  <p className="text-black text-tiny">Store Description</p>
                </div>
                <Button
                  className="text-tiny"
                  color="primary"
                  radius="sm"
                  size="sm"
                  shadow="sm"
                >
                  Ver
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="embla__slide">
            <Card
              isFooterBlurred
              className="slider-card w-full h-[260px] col-span-12 sm:col-span-5"
            >
              <CardHeader className="absolute z-10 top-1 flex-col items-start">
                <p className="text-tiny text-white/60 uppercase font-bold">
                  New
                </p>
                <h4 className="text-black font-medium text-2xl">Store Name</h4>
              </CardHeader>
              <Image
                removeWrapper
                alt="Card example background"
                className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
                src="https://picsum.photos/200/200?random=8"
              />
              <CardFooter className="absolute bg-white/60 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
                <div>
                  <p className="text-black text-tiny">Store Description</p>
                </div>
                <Button
                  className="text-tiny"
                  color="primary"
                  radius="sm"
                  size="sm"
                  shadow="sm"
                >
                  Ver
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      <br />
      <br />
      <br />
      <br />

      <h1>React Swiper Carousel Example</h1>
      <Swiper
        navigation={true}
        pagination={{
          clickable: true,
        }}
        modules={[Navigation, Pagination]}
        className="mySwiper"
        style={{ maxWidth: 1200, margin: "0 auto" }}
      >
        {slides.map((s, idx) => (
          <SwiperSlide key={idx}>
            <div
              style={{
                minHeight: 320,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                color: "#fff",
                background: s.bg,
                padding: "40px 20px",
              }}
            >
              <h2 style={{ margin: 0 }}>{s.title}</h2>
              <p style={{ marginTop: 8 }}>{s.subtitle}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <br />
      <br />
      <br />
      <br />

      <Swiper
        slidesPerView={4}
        spaceBetween={16}
        navigation={true}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination, Navigation]}
        className="mySwiper"
        style={{ maxWidth: 1200, margin: "0 auto" }}
      >
        <SwiperSlide>
          <Card
            isFooterBlurred
            className="slider-card w-full h-[260px] col-span-12 sm:col-span-5"
          >
            <CardHeader className="absolute z-10 top-1 flex-col items-start">
              <p className="text-tiny text-white/60 uppercase font-bold">New</p>
              <h4 className="text-black font-medium text-2xl">Store Name</h4>
            </CardHeader>
            <Image
              removeWrapper
              alt="Card example background"
              className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
              src="https://picsum.photos/200/200?random=1"
            />
            <CardFooter className="absolute bg-white/60 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
              <div>
                <p className="text-black text-tiny">Store Description</p>
              </div>
              <Button
                className="text-tiny"
                color="primary"
                radius="sm"
                size="sm"
                shadow="sm"
              >
                Ver
              </Button>
            </CardFooter>
          </Card>
        </SwiperSlide>
        <SwiperSlide>
          <Card
            isFooterBlurred
            className="slider-card w-full h-[260px] col-span-12 sm:col-span-5"
          >
            <CardHeader className="absolute z-10 top-1 flex-col items-start">
              <p className="text-tiny text-white/60 uppercase font-bold">New</p>
              <h4 className="text-black font-medium text-2xl">Store Name</h4>
            </CardHeader>
            <Image
              removeWrapper
              alt="Card example background"
              className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
              src="https://picsum.photos/200/200?random=2"
            />
            <CardFooter className="absolute bg-white/60 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
              <div>
                <p className="text-black text-tiny">Store Description</p>
              </div>
              <Button
                className="text-tiny"
                color="primary"
                radius="sm"
                size="sm"
                shadow="sm"
              >
                Ver
              </Button>
            </CardFooter>
          </Card>
        </SwiperSlide>
        <SwiperSlide>
          <Card
            isFooterBlurred
            className="slider-card w-full h-[260px] col-span-12 sm:col-span-5"
          >
            <CardHeader className="absolute z-10 top-1 flex-col items-start">
              <p className="text-tiny text-white/60 uppercase font-bold">New</p>
              <h4 className="text-black font-medium text-2xl">Store Name</h4>
            </CardHeader>
            <Image
              removeWrapper
              alt="Card example background"
              className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
              src="https://picsum.photos/200/200?random=3"
            />
            <CardFooter className="absolute bg-white/60 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
              <div>
                <p className="text-black text-tiny">Store Description</p>
              </div>
              <Button
                className="text-tiny"
                color="primary"
                radius="sm"
                size="sm"
                shadow="sm"
              >
                Ver
              </Button>
            </CardFooter>
          </Card>
        </SwiperSlide>
        <SwiperSlide>
          <Card
            isFooterBlurred
            className="slider-card w-full h-[260px] col-span-12 sm:col-span-5"
          >
            <CardHeader className="absolute z-10 top-1 flex-col items-start">
              <p className="text-tiny text-white/60 uppercase font-bold">New</p>
              <h4 className="text-black font-medium text-2xl">Store Name</h4>
            </CardHeader>
            <Image
              removeWrapper
              alt="Card example background"
              className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
              src="https://picsum.photos/200/200?random=4"
            />
            <CardFooter className="absolute bg-white/60 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
              <div>
                <p className="text-black text-tiny">Store Description</p>
              </div>
              <Button
                className="text-tiny"
                color="primary"
                radius="sm"
                size="sm"
                shadow="sm"
              >
                Ver
              </Button>
            </CardFooter>
          </Card>
        </SwiperSlide>
        <SwiperSlide>
          <Card
            isFooterBlurred
            className="slider-card w-full h-[260px] col-span-12 sm:col-span-5"
          >
            <CardHeader className="absolute z-10 top-1 flex-col items-start">
              <p className="text-tiny text-white/60 uppercase font-bold">New</p>
              <h4 className="text-black font-medium text-2xl">Store Name</h4>
            </CardHeader>
            <Image
              removeWrapper
              alt="Card example background"
              className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
              src="https://picsum.photos/200/200?random=5"
            />
            <CardFooter className="absolute bg-white/60 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
              <div>
                <p className="text-black text-tiny">Store Description</p>
              </div>
              <Button
                className="text-tiny"
                color="primary"
                radius="sm"
                size="sm"
                shadow="sm"
              >
                Ver
              </Button>
            </CardFooter>
          </Card>
        </SwiperSlide>
        <SwiperSlide>
          <Card
            isFooterBlurred
            className="slider-card w-full h-[260px] col-span-12 sm:col-span-5"
          >
            <CardHeader className="absolute z-10 top-1 flex-col items-start">
              <p className="text-tiny text-white/60 uppercase font-bold">New</p>
              <h4 className="text-black font-medium text-2xl">Store Name</h4>
            </CardHeader>
            <Image
              removeWrapper
              alt="Card example background"
              className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
              src="https://picsum.photos/200/200?random=6"
            />
            <CardFooter className="absolute bg-white/60 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
              <div>
                <p className="text-black text-tiny">Store Description</p>
              </div>
              <Button
                className="text-tiny"
                color="primary"
                radius="sm"
                size="sm"
                shadow="sm"
              >
                Ver
              </Button>
            </CardFooter>
          </Card>
        </SwiperSlide>
        <SwiperSlide>
          <Card
            isFooterBlurred
            className="slider-card w-full h-[260px] col-span-12 sm:col-span-5"
          >
            <CardHeader className="absolute z-10 top-1 flex-col items-start">
              <p className="text-tiny text-white/60 uppercase font-bold">New</p>
              <h4 className="text-black font-medium text-2xl">Store Name</h4>
            </CardHeader>
            <Image
              removeWrapper
              alt="Card example background"
              className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
              src="https://picsum.photos/200/200?random=7"
            />
            <CardFooter className="absolute bg-white/60 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
              <div>
                <p className="text-black text-tiny">Store Description</p>
              </div>
              <Button
                className="text-tiny"
                color="primary"
                radius="sm"
                size="sm"
                shadow="sm"
              >
                Ver
              </Button>
            </CardFooter>
          </Card>
        </SwiperSlide>
        <SwiperSlide>
          <Card
            isFooterBlurred
            className="slider-card w-full h-[260px] col-span-12 sm:col-span-5"
          >
            <CardHeader className="absolute z-10 top-1 flex-col items-start">
              <p className="text-tiny text-white/60 uppercase font-bold">New</p>
              <h4 className="text-black font-medium text-2xl">Store Name</h4>
            </CardHeader>
            <Image
              removeWrapper
              alt="Card example background"
              className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
              src="https://picsum.photos/200/200?random=8"
            />
            <CardFooter className="absolute bg-white/60 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
              <div>
                <p className="text-black text-tiny">Store Description</p>
              </div>
              <Button
                className="text-tiny"
                color="primary"
                radius="sm"
                size="sm"
                shadow="sm"
              >
                Ver
              </Button>
            </CardFooter>
          </Card>
        </SwiperSlide>
      </Swiper>
    </>
  );
}

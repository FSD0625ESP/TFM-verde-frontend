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

export default function SliderStorePage({ images, storeName, storeDescription, storeLogo }) {
    return (
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
            {images && images.length > 0 && images.map((image, idx) => (
                <SwiperSlide key={idx}>

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
                            backgroundImage: `url(${image})`,
                        }}
                    >
                        <div className="slider-overlay"></div>
                        <div className="slide-content">
                            <h2 className="text-white font-bold font-medium text-2xl text-center mb-3 drop-shadow-lg">
                                {storeName}
                            </h2>
                            <p className="text-white font-bold font-medium text-center drop-shadow-lg">
                                {storeDescription}
                            </p>
                        </div>
                        {storeLogo && (
                            <div className="shop-logo">
                                <img src={storeLogo} alt={`${storeName} logo`} />
                            </div>
                        )}
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}

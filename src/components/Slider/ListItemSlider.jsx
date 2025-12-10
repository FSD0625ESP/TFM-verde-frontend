import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// import required modules
import { Navigation } from "swiper/modules";
import ListElement from "../ListElement/ListElement";

/**
 * ListItemSlider Component
 * Renders a list of items (products or stores) in a Swiper slider
 * 
 * @param {Array} items - Array of items to display (products or stores)
 * @param {string} type - Type of items: "product" or "store"
 * @param {Object} breakpoints - Custom breakpoints configuration for responsive slides
 *   Default: { 320: 1, 480: 1, 560: 2, 840: 3, 1200: 4 }
 *   Format: { [breakpointWidth]: slidesPerView }
 * @example
 * <ListItemSlider 
 *   items={products} 
 *   type="product"
 *   breakpoints={{ 320: 1, 640: 2, 1024: 4 }}
 * />
 */
export default function ListItemSlider({ items, type = "product", breakpoints }) {
    // Default breakpoints if not provided
    const defaultBreakpoints = {
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
    };

    // Convert simple breakpoints format to full format if needed
    const formatBreakpoints = (bp) => {
        if (!bp) return defaultBreakpoints;

        const formatted = {};
        Object.entries(bp).forEach(([key, value]) => {
            formatted[key] = {
                slidesPerView: value,
                spaceBetween: 16,
            };
        });
        return formatted;
    };

    const finalBreakpoints = breakpoints
        ? formatBreakpoints(breakpoints)
        : defaultBreakpoints;

    if (!items || items.length === 0) {
        return null;
    }

    return (
        <Swiper
            slidesPerView={1}
            spaceBetween={16}
            breakpoints={finalBreakpoints}
            navigation={true}
            speed={700}
            modules={[Navigation]}
            className="mySwiper"
            style={{ maxWidth: "100%", margin: "0 auto" }}
        >
            {items.map((item) => (
                <SwiperSlide key={item._id}>
                    <ListElement item={item} type={type} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}

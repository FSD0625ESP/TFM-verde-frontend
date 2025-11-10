import { useState } from "react";
import { Star } from "lucide-react";
import { PropTypes } from "prop-types";

const Rating = ({
  initialValue = 0,
  maxStars = 5,
  onRatingChange,
  readonly = false,
  size = "md",
}) => {
  const [rating, setRating] = useState(initialValue);
  const [hoverRating, setHoverRating] = useState(0);

  // Mapeo de tamaños a clases
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const handleClick = (value) => {
    if (readonly) return;
    setRating(value);
    if (onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (readonly) return;
    setHoverRating(value);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverRating(0);
  };

  return (
    <div className="flex items-center gap-1" onMouseLeave={handleMouseLeave}>
      {[...Array(maxStars)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = hoverRating
          ? starValue <= hoverRating
          : starValue <= rating;

        return (
          <Star
            key={index}
            className={`${sizeClasses[size]} cursor-${
              readonly ? "default" : "pointer"
            } transition-colors duration-150 ${
              isFilled ? "text-primary fill-primary" : "text-gray-300"
            }`}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
          />
        );
      })}
    </div>
  );
};

Rating.propTypes = {
  initialValue: PropTypes.number,
  maxStars: PropTypes.number,
  onRatingChange: PropTypes.func,
  readonly: PropTypes.bool,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
};

export default Rating;

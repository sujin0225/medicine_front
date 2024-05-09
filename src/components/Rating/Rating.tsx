import React, { useState, useMemo } from "react";
import './Rating.css'

interface RatingProps {
  count: number;
  value: number; 
  onChange: (value: number) => void;
  size?: number; 
  color?: string;
  hoverColor?: string;
  activeColor?: string;
  emptyIconPath?: string; 
  fullIconPath?: string; 
}

interface IconProps {
  size?: number;
  color?: string;
  path: string;
}

const StarIcon = ({ size = 30, color = "#aaa", path }: IconProps) => (
  <svg height={size} viewBox="0 0 25 25">
    <path d={path} fill={color} /> 
  </svg>
);

const defaultFullIconPath = "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";
const defaultEmptyIconPath = "M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z";
 
const Rating: React.FC<RatingProps> = ({
  count,
  value,
  onChange,
  size,
  color = "#DDD5C2",
  hoverColor = "#DDD5C2",
  activeColor = "#DDD5C2",
  emptyIconPath = defaultEmptyIconPath,
  fullIconPath = defaultFullIconPath
}) => {
  const [hoverValue, setHoverValue] = useState<number | undefined>(undefined);

  const getColor = (index: number) => 
  (hoverValue !== undefined && index <= hoverValue) ? hoverColor : 
  (index < value ? activeColor : color); 
  const stars = useMemo(() => (
    Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        onMouseEnter={() => setHoverValue(i)}
        onMouseLeave={() => setHoverValue(undefined)}
        onClick={() => onChange(i + 1)} 
      >
        <StarIcon
          size={size}
          color={getColor(i)}
          path={hoverValue !== undefined && i <= hoverValue ? fullIconPath : i < value ? fullIconPath : emptyIconPath}
        />
      </div>
    ))
  ), [count, value, hoverValue, size]);

  return <div className="rating">{stars}</div>;
};

export default Rating;
const BookmarkIcon = ({ size = 24, color = "currentColor", filled = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5 3H19C19.55 3 20 3.45 20 4V21L12 17.5L4 21V4C4 3.45 4.45 3 5 3Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default BookmarkIcon;

const BoldIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4 3h5a3 3 0 0 1 0 6H4V3ZM4 9h5.5a3.5 3.5 0 0 1 0 7H4V9Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

export default BoldIcon;

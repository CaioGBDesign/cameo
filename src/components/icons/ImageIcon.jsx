const ImageIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke={color} strokeWidth="1.5" />
    <circle cx="5.5" cy="6" r="1" fill={color} />
    <path d="M1.5 11l3-3.5 2.5 3 2.5-2.5 4 5" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

export default ImageIcon;

const UnderlineIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 2v5a4 4 0 0 0 8 0V2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M2.5 14h11" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default UnderlineIcon;

const AddToListIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 5L16 5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M20 5H20.009" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 12H20.009" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 19H20.009" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 12L16 12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M4 19L16 19" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export default AddToListIcon;

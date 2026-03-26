const BulletListIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="2.5" cy="4" r="1.5" fill={color} />
    <rect x="6" y="3" width="8" height="2" rx="1" fill={color} />
    <circle cx="2.5" cy="8" r="1.5" fill={color} />
    <rect x="6" y="7" width="8" height="2" rx="1" fill={color} />
    <circle cx="2.5" cy="12" r="1.5" fill={color} />
    <rect x="6" y="11" width="8" height="2" rx="1" fill={color} />
  </svg>
);

export default BulletListIcon;

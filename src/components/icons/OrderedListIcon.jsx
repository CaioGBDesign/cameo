const OrderedListIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.5 2.5V6M1.5 2.5H2.5M1.5 2.5H.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    <path d="M.5 10h2l-2 2.5h2" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="6" y="3" width="8" height="2" rx="1" fill={color} />
    <rect x="6" y="7.5" width="8" height="2" rx="1" fill={color} />
    <rect x="6" y="12" width="8" height="2" rx="1" fill={color} />
  </svg>
);

export default OrderedListIcon;

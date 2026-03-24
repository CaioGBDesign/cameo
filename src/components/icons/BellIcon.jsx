const BellIcon = ({ size = 24, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.00195 17C9.00195 18.1046 9.89738 19 11.002 19H13.002C14.1065 19 15.002 18.1046 15.002 17M5.5 9.5C5.5 6.46243 7.96243 4 11 4H13C16.0376 4 18.5 6.46243 18.5 9.5V14.5L20 16H4L5.5 14.5V9.5Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default BellIcon;

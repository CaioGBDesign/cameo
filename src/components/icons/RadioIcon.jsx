const RadioIcon = ({ size = 20, filled = false }) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
  >
    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
    {filled && <circle cx="10" cy="10" r="5" fill="currentColor" />}
  </svg>
);

export default RadioIcon;

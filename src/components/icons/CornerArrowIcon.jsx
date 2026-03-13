const CornerArrowIcon = ({ size = 13, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 13 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.47368 12.5263C0.929858 13.0701 -1.14963e-07 12.685 -1.82198e-07 11.9159L-1.9325e-07 11.7895L-5.24536e-07 8.00001C-9.10794e-07 3.58173 3.58172 9.10795e-07 8 5.24537e-07L11.7895 1.9325e-07C12.6052 1.21936e-07 13.0137 0.986263 12.4369 1.56308L12.4174 1.58264L1.47368 12.5263Z"
      fill={color}
    />
  </svg>
);

export default CornerArrowIcon;

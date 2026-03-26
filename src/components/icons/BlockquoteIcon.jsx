const BlockquoteIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3 4C3 4 2 6 2 8C2 9.1 2.9 10 4 10C5.1 10 6 9.1 6 8C6 6.9 5.1 6 4 6H3.5C3.5 6 4 4.5 5.5 4H3Z"
      fill={color}
    />
    <path
      d="M9 4C9 4 8 6 8 8C8 9.1 8.9 10 10 10C11.1 10 12 9.1 12 8C12 6.9 11.1 6 10 6H9.5C9.5 6 10 4.5 11.5 4H9Z"
      fill={color}
    />
  </svg>
);

export default BlockquoteIcon;

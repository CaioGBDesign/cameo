const DragHandleIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={10} height={size} viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="2" cy="2" r="1.5" fill={color} />
    <circle cx="8" cy="2" r="1.5" fill={color} />
    <circle cx="2" cy="8" r="1.5" fill={color} />
    <circle cx="8" cy="8" r="1.5" fill={color} />
    <circle cx="2" cy="14" r="1.5" fill={color} />
    <circle cx="8" cy="14" r="1.5" fill={color} />
  </svg>
);

export default DragHandleIcon;

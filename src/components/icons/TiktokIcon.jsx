const TiktokIcon = ({ size = 21, color = "white" }) => (
  <svg width={size} height={size} viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#tiktok-clip)">
      <path
        d="M1.43176 10.5C1.43176 6.22523 1.43176 4.08784 2.75976 2.75983C4.08778 1.43182 6.22517 1.43182 10.4999 1.43182C14.7747 1.43182 16.9121 1.43182 18.2402 2.75983C19.5681 4.08784 19.5681 6.22523 19.5681 10.5C19.5681 14.7747 19.5681 16.9122 18.2402 18.2402C16.9121 19.5682 14.7747 19.5682 10.4999 19.5682C6.22517 19.5682 4.08778 19.5682 2.75976 18.2402C1.43176 16.9122 1.43176 14.7747 1.43176 10.5Z"
        stroke={color} strokeWidth="1.5" strokeLinejoin="round"
      />
      <path
        d="M9.10245 9.5526C8.31967 9.44197 6.53545 9.62505 5.66056 11.2428C4.78566 12.8605 5.66742 14.5442 6.21766 15.1838C6.76103 15.7822 8.48807 16.9155 10.32 15.8091C10.774 15.5348 11.3397 15.3303 11.9815 13.1873L11.9068 4.755C11.783 5.68353 12.8087 7.86138 15.729 8.11906"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="tiktok-clip">
        <rect width="21" height="21" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default TiktokIcon;

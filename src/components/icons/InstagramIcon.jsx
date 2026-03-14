const InstagramIcon = ({ size = 21, color = "white" }) => (
  <svg width={size} height={size} viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#instagram-clip)">
      <path
        d="M1.43176 10.5C1.43176 6.22523 1.43176 4.08784 2.75976 2.75983C4.08778 1.43182 6.22517 1.43182 10.4999 1.43182C14.7747 1.43182 16.9121 1.43182 18.2402 2.75983C19.5681 4.08784 19.5681 6.22523 19.5681 10.5C19.5681 14.7747 19.5681 16.9122 18.2402 18.2402C16.9121 19.5682 14.7747 19.5682 10.4999 19.5682C6.22517 19.5682 4.08778 19.5682 2.75976 18.2402C1.43176 16.9122 1.43176 14.7747 1.43176 10.5Z"
        stroke={color} strokeWidth="1.5" strokeLinejoin="round"
      />
      <path
        d="M14.795 10.5C14.795 12.8724 12.8719 14.7955 10.4996 14.7955C8.12724 14.7955 6.2041 12.8724 6.2041 10.5C6.2041 8.12773 8.12724 6.20459 10.4996 6.20459C12.8719 6.20459 14.795 8.12773 14.795 10.5Z"
        stroke={color} strokeWidth="1.5"
      />
      <path
        d="M15.7578 5.25H15.7488"
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="instagram-clip">
        <rect width="21" height="21" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default InstagramIcon;

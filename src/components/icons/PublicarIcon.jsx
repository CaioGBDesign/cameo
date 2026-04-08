export default function PublicarIcon({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <g clipPath="url(#publicar-clip)">
        <path d="M9.98706 4.677C9.98706 4.677 10.3204 5.01034 10.6537 5.677C10.6537 5.677 11.7125 4.01034 12.6537 3.677" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.66327 1.3476C4.99763 1.27708 3.71079 1.46896 3.71079 1.46896C2.89822 1.52706 1.34101 1.98261 1.34103 4.64307C1.34104 7.28091 1.3238 10.5329 1.34103 11.8293C1.34103 12.6214 1.83144 14.4689 3.52888 14.5679C5.59211 14.6883 9.30853 14.7139 11.0137 14.5679C11.4701 14.5422 12.9898 14.1838 13.1821 12.5304C13.3814 10.8176 13.3417 9.62718 13.3417 9.34384" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14.6666 4.67708C14.6666 6.51803 13.1728 8.01044 11.3301 8.01044C9.48733 8.01044 7.99353 6.51803 7.99353 4.67708C7.99353 2.83614 9.48733 1.34375 11.3301 1.34375C13.1728 1.34375 14.6666 2.83614 14.6666 4.67708Z" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.65369 8.677H7.32033" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.65369 11.3438H9.987" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="publicar-clip">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

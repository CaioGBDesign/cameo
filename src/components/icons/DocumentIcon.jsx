export default function DocumentIcon({ size = 24, color = "currentColor", ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M15 7C15 7 15.5 7.5 16 8.5C16 8.5 17.5882 6 19 5.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.0144 2.00578C7.51591 1.9 5.58565 2.18782 5.58565 2.18782C4.3668 2.27496 2.03099 2.95829 2.03101 6.94898C2.03103 10.9058 2.00517 15.7837 2.03101 17.7284C2.03101 18.9164 2.76663 21.6877 5.31279 21.8363C8.40763 22.0168 13.9822 22.0552 16.54 21.8363C17.2247 21.7976 19.5042 21.2602 19.7927 18.7801C20.0915 16.2107 20.032 14.4251 20.032 14.0001"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22.0193 7C22.0193 9.76142 19.7785 12 17.0145 12C14.2504 12 12.0096 9.76142 12.0096 7C12.0096 4.23858 14.2504 2 17.0145 2C19.7785 2 22.0193 4.23858 22.0193 7Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M7 13H11"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M7 17H15"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
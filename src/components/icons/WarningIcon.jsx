const WarningIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.28289 14H6.71646C3.62951 14 2.08604 14 1.51725 12.996C0.948457 11.9919 1.73792 10.6609 3.31684 7.99898L4.60006 5.83555C6.11674 3.27852 6.87508 2 7.99967 2C9.12427 2 9.88261 3.27852 11.3993 5.83555L12.6825 7.99898C14.2614 10.6609 15.0509 11.9919 14.4821 12.996C13.9133 14 12.3698 14 9.28289 14Z" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 6V9" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 11.3281V11.3348" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default WarningIcon;

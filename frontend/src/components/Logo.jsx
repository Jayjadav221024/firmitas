// Animated brand mark. `className` controls the size, the rest is fixed artwork.
function Logo({ className = 'w-11 h-11' }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`${className} shrink-0 select-none`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path className="logo-swoosh swoosh-navy animate-draw" d="M 24 55 C 22 71, 26 82, 36 88" pathLength="100" stroke="#163983" strokeWidth="12" strokeLinecap="round" />
      <path className="logo-swoosh swoosh-blue animate-draw [animation-delay:0.2s]" d="M 28 37 C 42 13, 72 11, 88 27" pathLength="100" stroke="#8faadc" strokeWidth="12" strokeLinecap="round" />
      <path className="logo-swoosh swoosh-orange animate-draw [animation-delay:0.4s]" d="M 14 15 C 14 49, 24 67, 44 67 C 64 67, 78 55, 78 37" pathLength="100" stroke="#ffffff" strokeWidth="18" strokeLinecap="round" />
      <path className="logo-swoosh swoosh-orange animate-draw [animation-delay:0.4s]" d="M 14 15 C 14 49, 24 67, 44 67 C 64 67, 78 55, 78 37" pathLength="100" stroke="#ea6535" strokeWidth="12" strokeLinecap="round" />
    </svg>
  );
}

export default Logo;

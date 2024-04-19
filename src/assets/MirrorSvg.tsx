interface MirrorSvgProps {
  size: number
}

const MirrorSvg = ({ size }: MirrorSvgProps) => (
  <svg
    version="1.0"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 32 32"
    stroke="currentColor"
    width={size}
    height={size}
  >
    <g fill="none" strokeWidth="1.0" strokeLinejoin="round" stroke="currentColor">
      <polygon points="12,22 3,27 3,5 12,10"></polygon>
      <line x1="16" y1="04" x2="16" y2="06"></line>
      <line x1="16" y1="27" x2="16" y2="29"></line>
      <line x1="16" y1="15" x2="16" y2="18"></line>
      <line x1="16" y1="09" x2="16" y2="12"></line>
      <line x1="16" y1="21" x2="16" y2="24"></line>
      <polygon points="20,10 29,5 29,27 20,22"></polygon>
    </g>
  </svg>
)

export default MirrorSvg

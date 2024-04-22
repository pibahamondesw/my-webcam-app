import { Box, IconButton } from "@mui/material"

interface CloseButtonProps {
  closeAction: () => void
  mobile: boolean
}

interface CloseSvgProps {
  size: number
}

const CloseSvg = ({ size }: CloseSvgProps) => (
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
      <line x1="4" y1="4" x2="28" y2="28"></line>
      <line x1="4" y1="28" x2="28" y2="4"></line>
    </g>
  </svg>
)

const CloseButton = ({ closeAction, mobile }: CloseButtonProps) => {
  const buttonSize = mobile ? 32 : 48
  return (
    <Box width={buttonSize} height={buttonSize} position="absolute" top={buttonSize / 2} left={buttonSize / 2} zIndex={9999}>
      <IconButton
        onClick={closeAction}
        sx={{
          width: buttonSize,
          height: buttonSize,
          borderRadius: buttonSize / 2,
          color: "rgba(255, 255, 255, 0.8)",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          boxShadow: "0 0 1rem 0 rgba(0, 0, 0, 0.25)!important",
          "&:hover": {
            backgroundColor: "rgba(127, 0, 0, 0.5)",
          },
        }}
      >
        <CloseSvg size={20} />
      </IconButton>
    </Box>
  )
}

export default CloseButton

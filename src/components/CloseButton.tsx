import { CloseOutlined } from "@mui/icons-material"
import { Box, Button, IconButton } from "@mui/material"

interface CloseButtonProps {
  closeAction: () => void
  mobile: boolean
}

const CloseButton = ({ closeAction, mobile }: CloseButtonProps) => {
  const buttonSize = 32
  return mobile ? (
    <Box width={buttonSize} height={buttonSize} position="absolute" top={buttonSize / 2} left={buttonSize / 2} zIndex={9999}>
      <IconButton
        onClick={closeAction}
        sx={{
          width: buttonSize,
          height: buttonSize,
          borderRadius: buttonSize / 2,
          color: "rgba(255, 255, 255, 0.8)",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={20} height={20} viewBox="0 0 50 50" fill="currentColor">
          <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"></path>
        </svg>
      </IconButton>
    </Box>
  ) : (
    <Box position="absolute" zIndex={9999} top={30} left={30}>
      <Button
        startIcon={<CloseOutlined />}
        sx={{
          position: "absolute",
          color: "white",
          backgroundColor: "rgba(127, 0, 0, 0.75)!important",
          p: 2,
        }}
        onClick={closeAction}
      >
        Cancelar
      </Button>
    </Box>
  )
}

export default CloseButton

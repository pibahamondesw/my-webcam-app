import { CameraAlt } from "@mui/icons-material"
import { Box, Button, IconButton, Stack, Typography } from "@mui/material"

interface CaptureButtonProps {
  capture: () => void
  horizontal: boolean
  mobile: boolean
}

const CaptureButton = ({ capture, horizontal, mobile }: CaptureButtonProps) => {
  const buttonSize = 72
  return mobile ? (
    <Box
      style={{
        width: buttonSize,
        height: buttonSize,
        position: "absolute",
        bottom: horizontal ? `calc(50% - ${buttonSize / 2}px)` : 12,
        left: horizontal ? "" : `calc(50% - ${buttonSize / 2}px)`,
        right: horizontal ? 12 : "",
        boxShadow: "0 0 1rem 0 rgba(0, 0, 0, 0.25)!important",
        zIndex: 9999,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        borderRadius: buttonSize / 2,
      }}
    >
      <IconButton
        onClick={capture}
        sx={{
          width: buttonSize,
          height: buttonSize,
          border: 0,
          borderRadius: buttonSize / 2,
        }}
      >
        <Box bgcolor="rgba(255, 255, 255, 0.75)" width={(2 * buttonSize) / 3} height={(2 * buttonSize) / 3} borderRadius={buttonSize / 3} />
      </IconButton>
    </Box>
  ) : (
    <Box position="absolute" zIndex={9999} width="100vw" bottom={150} display="flex" justifyContent="center">
      <Button
        sx={{
          position: "absolute",
          color: "white",
          backgroundColor: "rgba(255, 255, 255, 0.25) !important",
          height: 150,
          width: 200,
          borderRadius: 0,
        }}
        onClick={capture}
      >
        <Stack spacing={1} direction="column" alignItems="center">
          <CameraAlt sx={{ fontSize: 75 }} />
          <Typography fontSize="small">Tomar foto</Typography>
        </Stack>
      </Button>
    </Box>
  )
}

export default CaptureButton

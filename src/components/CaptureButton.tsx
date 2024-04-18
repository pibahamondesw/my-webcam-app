import { Box, IconButton } from "@mui/material"

interface CaptureButtonProps {
  capture: () => void
  horizontal: boolean
}

const CaptureButton = ({ capture, horizontal }: CaptureButtonProps) => {
  return (
    <Box
      style={{
        width: 72,
        height: 72,
        position: "absolute",
        bottom: horizontal ? "calc(50% - 36px)" : 8,
        left: horizontal ? "" : "calc(50% - 36px)",
        right: horizontal ? 8 : "",
        zIndex: 9999,
      }}
    >
      <IconButton
        onClick={capture}
        sx={{
          width: 72,
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: 0,
          borderRadius: 36,
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        }}
      >
        <Box
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.75)",
            width: 48,
            height: 48,
            borderRadius: 24,
          }}
        />
      </IconButton>
    </Box>
  )
}

export default CaptureButton

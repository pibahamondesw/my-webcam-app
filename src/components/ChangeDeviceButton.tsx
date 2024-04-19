import { Box, Button, IconButton, Stack, Typography } from "@mui/material"

import ChangeDeviceSvg from "../assets/ChangeDeviceSvg"

interface ChangeDeviceButtonProps {
  changeDevice: () => void
  horizontal: boolean
  mobile: boolean
}

const ChangeDeviceButton = ({ changeDevice, horizontal, mobile }: ChangeDeviceButtonProps) => {
  const buttonSize = 48
  return mobile ? (
    <Box
      sx={{
        width: buttonSize,
        height: buttonSize,
        position: "absolute",
        bottom: buttonSize / 2,
        left: horizontal ? "" : buttonSize / 2,
        right: horizontal ? buttonSize / 2 : "",
        zIndex: 9900,
      }}
    >
      <IconButton
        onClick={changeDevice}
        sx={{
          width: buttonSize,
          height: buttonSize,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: 0,
          borderRadius: buttonSize / 2,
          color: "white",
          backgroundColor: "rgba(0, 0, 0, 0.3) !important",
          boxShadow: "0 0 1rem 0 rgba(0, 0, 0, 0.25)!important",
        }}
      >
        <ChangeDeviceSvg size={buttonSize / 2} />
      </IconButton>
    </Box>
  ) : (
    <Box position="absolute" zIndex={9999} width="calc(100vw - 1rem)" bottom={135} display="flex" justifyContent="left" pl="1rem">
      <Button
        sx={{
          position: "absolute",
          color: "white",
          backgroundColor: "rgba(255, 255, 255, 0.25) !important",
          height: 120,
          width: 120,
          borderRadius: 60,
        }}
        onClick={changeDevice}
      >
        <Stack spacing={0} direction="column" alignItems="center">
          <ChangeDeviceSvg size={48} />
          <Typography fontSize="x-small" textTransform="none">
            Cambiar
          </Typography>
        </Stack>
      </Button>
    </Box>
  )
}

export default ChangeDeviceButton

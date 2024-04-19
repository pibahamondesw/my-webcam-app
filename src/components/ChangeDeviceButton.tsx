import { Box, Button, IconButton, Stack, Typography } from "@mui/material"

interface ChangeDeviceButtonProps {
  changeDevice: () => void
  horizontal: boolean
  mobile: boolean
}

interface changeDeviceSvgProps {
  size: number
}

const ChangeDeviceSvg = ({ size }: changeDeviceSvgProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 6h-1.5a.5.5 0 0 1-.5-.5A1.502 1.502 0 0 0 17.5 4h-6A1.502 1.502 0 0 0 10 5.5a.5.5 0 0 1-.5.5H8V5H4v1H3a2.002 2.002 0 0 0-2 2v10a2.002 2.002 0 0 0 2 2h18a2.002 2.002 0 0 0 2-2V8a2.002 2.002 0 0 0-2-2zm1 12a1.001 1.001 0 0 1-1 1H3a1.001 1.001 0 0 1-1-1V8a1.001 1.001 0 0 1 1-1h2V6h2v1h2.5A1.502 1.502 0 0 0 11 5.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 .5.5A1.502 1.502 0 0 0 19.5 7H21a1.001 1.001 0 0 1 1 1zM8.2 13h-1a4.796 4.796 0 0 1 8.8-2.644V9h1v3h-3v-1h1.217A3.79 3.79 0 0 0 8.2 13zm7.6 0h1A4.796 4.796 0 0 1 8 15.644V17H7v-3h3v1H8.783a3.79 3.79 0 0 0 7.017-2z" />
    <path fill="none" d="M0 0h24v24H0z" />
  </svg>
)

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
        }}
      >
        <ChangeDeviceSvg size={buttonSize / 2} />
      </IconButton>
    </Box>
  ) : (
    <Box position="absolute" zIndex={9999} width="calc(100vw - 25vw)" bottom="15.5vh" display="flex" justifyContent="left" pl="25vw">
      <Button
        sx={{
          position: "absolute",
          color: "white",
          backgroundColor: "rgba(0, 0, 0, 0.5) !important",
          height: "11vh",
          width: "11vh",
        }}
        onClick={changeDevice}
      >
        <Stack spacing={0} direction="column" alignItems="center">
          <ChangeDeviceSvg size={24} />
          <Typography fontSize="xx-small" textTransform="none">
            Cambiar
          </Typography>
        </Stack>
      </Button>
    </Box>
  )
}

export default ChangeDeviceButton

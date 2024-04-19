import { Box, Button, IconButton, Stack, Typography } from "@mui/material"

import MirrorSvg from "../assets/MirrorSvg"

interface MirrorButtonProps {
  mirrorAction: () => void
  horizontal: boolean
  mobile: boolean
}

const MirrorButton = ({ mirrorAction, horizontal, mobile }: MirrorButtonProps) => {
  const buttonSize = 48
  return mobile ? (
    <Box
      width={buttonSize}
      height={buttonSize}
      position="absolute"
      bottom={horizontal ? "" : buttonSize / 2}
      top={horizontal ? buttonSize / 2 : ""}
      right={buttonSize / 2}
      zIndex={9900}
    >
      <IconButton
        onClick={mirrorAction}
        sx={{
          width: buttonSize,
          height: buttonSize,
          borderRadius: buttonSize / 2,
          color: "rgb(255, 255, 255)",
          backgroundColor: "rgba(0, 0, 0, 0.3)!important",
          boxShadow: "0 0 1rem 0 rgba(0, 0, 0, 0.25)!important",
        }}
      >
        <MirrorSvg size={buttonSize / 2} />
      </IconButton>
    </Box>
  ) : (
    <Box position="absolute" zIndex={9999} width="calc(100vw - 1rem)" bottom={135} display="flex" justifyContent="right" pr="1rem">
      <Button
        sx={{
          position: "absolute",
          color: "white",
          backgroundColor: "rgba(255, 255, 255, 0.25)!important",
          height: 120,
          width: 120,
          borderRadius: 60,
        }}
        onClick={mirrorAction}
      >
        <Stack spacing={0.5} direction="column" alignItems="center">
          <MirrorSvg size={48} />
          <Typography fontSize="small" textTransform="none">
            Modo espejo
          </Typography>
        </Stack>
      </Button>
    </Box>
  )
}

export default MirrorButton

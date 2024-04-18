import { Box, IconButton } from "@mui/material";

interface ChangeDeviceButtonProps {
  changeDevice: () => void;
  horizontal: boolean;
}

const ChangeDeviceButton = ({ changeDevice, horizontal }: ChangeDeviceButtonProps) => {
  return (
    <Box
      sx={{
        width: 48,
        height: 48,
        position: "absolute",
        bottom: 20,
        left: horizontal ? "" : 20,
        right: horizontal ? 20 : "",
        zIndex: 9900,
      }}
    >
      <IconButton
        onClick={changeDevice}
        sx={{
          width: 48,
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: 0,
          borderRadius: 24,
          color: "white",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 6h-1.5a.5.5 0 0 1-.5-.5A1.502 1.502 0 0 0 17.5 4h-6A1.502 1.502 0 0 0 10 5.5a.5.5 0 0 1-.5.5H8V5H4v1H3a2.002 2.002 0 0 0-2 2v10a2.002 2.002 0 0 0 2 2h18a2.002 2.002 0 0 0 2-2V8a2.002 2.002 0 0 0-2-2zm1 12a1.001 1.001 0 0 1-1 1H3a1.001 1.001 0 0 1-1-1V8a1.001 1.001 0 0 1 1-1h2V6h2v1h2.5A1.502 1.502 0 0 0 11 5.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 .5.5A1.502 1.502 0 0 0 19.5 7H21a1.001 1.001 0 0 1 1 1zM8.2 13h-1a4.796 4.796 0 0 1 8.8-2.644V9h1v3h-3v-1h1.217A3.79 3.79 0 0 0 8.2 13zm7.6 0h1A4.796 4.796 0 0 1 8 15.644V17H7v-3h3v1H8.783a3.79 3.79 0 0 0 7.017-2z" />
          <path fill="none" d="M0 0h24v24H0z" />
        </svg>
      </IconButton>
    </Box>
  );
};

export default ChangeDeviceButton;

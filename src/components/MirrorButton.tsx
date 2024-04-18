import { Box, IconButton } from "@mui/material";

interface MirrorButtonProps {
  mirrorAction: () => void;
  horizontal: boolean;
}

const MirrorButton = ({ mirrorAction, horizontal }: MirrorButtonProps) => {
  const buttonSize = 48;
  return (
    <Box
      style={{
        width: 48,
        height: 48,
        position: "absolute",
        bottom: horizontal ? "" : 20,
        top: horizontal ? 20 : "",
        right: 20,
        zIndex: 9900,
      }}
    >
      <IconButton
        onClick={mirrorAction}
        sx={{
          width: buttonSize,
          height: buttonSize,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: 0,
          borderRadius: buttonSize / 2,
          color: "rgb(255, 255, 255)",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        }}
      >
        <svg
          version="1.0"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 32 32"
          stroke="currentColor"
          width={24}
          height={24}
        >
          <g fill="none" strokeWidth="1.0" strokeLinejoin="round" stroke="currentColor">
            <polygon points="12,22 3,27 3,5 12,10"></polygon>
            <line x1="16" y1="03" x2="16" y2="6"></line>
            <line x1="16" y1="27" x2="16" y2="30"></line>
            <line x1="16" y1="15" x2="16" y2="18"></line>
            <line x1="16" y1="09" x2="16" y2="12"></line>
            <line x1="16" y1="21" x2="16" y2="24"></line>
            <polygon points="20,10 29,5 29,27 20,22"></polygon>
          </g>
        </svg>
      </IconButton>
    </Box>
  );
};

export default MirrorButton;

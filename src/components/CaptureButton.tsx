interface CaptureButtonProps {
  capture: () => void;
}

const CaptureButton = ({ capture }: CaptureButtonProps) => {
  return (
    <button
      onClick={capture}
      style={{
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
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.75)",
          width: 48,
          height: 48,
          borderRadius: 24,
        }}
      ></div>
    </button>
  );
};

export default CaptureButton;

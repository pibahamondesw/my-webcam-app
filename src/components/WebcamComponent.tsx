import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Webcam from "react-webcam";

import { Box, Button } from "@mui/material";

import CaptureButton from "./CaptureButton";
import ChangeDeviceButton from "./ChangeDeviceButton";
import CloseButton from "./CloseButton";
import MirrorButton from "./MirrorButton";

interface WebcamComponentProps {
  facingMode?: "user" | "environment";
}

const WebcamComponent = ({ facingMode }: WebcamComponentProps) => {
  const [isCameraActive, setIsCameraActive] = useState(false);

  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [noCamera, setNoCamera] = useState<boolean | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[] | null>(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [src, setSrc] = useState<string | null>(null);
  const [horizontal, setHorizontal] = useState<boolean>(window.innerWidth >= window.innerHeight);
  const [useMirror, setUseMirror] = useState<boolean>(facingMode === undefined || facingMode === "user");

  const webcamRef = useRef<Webcam | null>(null);

  useEffect(() => {
    if (!webcamRef?.current?.video) return;

    webcamRef.current.video.onloadeddata = () => {
      width !== window.innerWidth && setWidth(window.innerWidth);
      height !== window.innerHeight && setHeight(window.innerHeight);
    };
  }, [webcamRef?.current?.video, width, height]);

  // const [rotated, setRotated] = useState<boolean>(
  //   window.screen.orientation.angle == 90 || window.screen.orientation.angle == 270
  // );

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();

    if (!imageSrc) return alert("No se pudo tomar la foto");

    exitFullscreen();
    setSrc("data:image/webp;base64," + imageSrc.substring(23));
  };

  const videoConstraints = useMemo(
    () =>
      ({
        video: {
          height: { exact: height },
          width: { exact: width },
        },
        deviceId: selectedDeviceId,
        audio: true,
        ...(facingMode && { facingMode: facingMode }),
      } as MediaTrackConstraints),
    [height, width, selectedDeviceId, facingMode]
  );

  const orientationOnchange = useCallback(() => {
    window.navigator.mediaDevices
      .getUserMedia({ video: videoConstraints })
      .then(() => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
      })
      .catch((err) => alert("Error:" + err));
    setHorizontal(window.innerWidth >= window.innerHeight);
  }, [videoConstraints]);

  window.onresize = () => {
    window.navigator.mediaDevices
      .getUserMedia({ video: videoConstraints })
      .then(() => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
      })
      .catch((err) => alert("Error:" + err));
    setHorizontal(window.innerWidth >= window.innerHeight);
  };

  const handleStartCamera = async () => {
    try {
      navigator.mediaDevices
        .getUserMedia({ video: videoConstraints })
        .then(() => setIsCameraActive(true))
        .catch((err) => alert("Error:" + err));
    } catch (err) {
      alert("Error accessing camera:" + err);
    }
  };

  const goFullScreen = () => {
    const docElement = document.documentElement as HTMLElement & {
      mozRequestFullScreen(): Promise<void>;
      webkitRequestFullscreen(): Promise<void>;
      webkitEnterFullScreen(): Promise<void>;
      msRequestFullscreen(): Promise<void>;
    };
    if (docElement.requestFullscreen) {
      // W3C standard
      docElement.requestFullscreen();
    } else if (docElement.webkitRequestFullscreen) {
      // WebKit (Apple)
      docElement.webkitRequestFullscreen();
    } else if (docElement.mozRequestFullScreen) {
      // Mozilla (Firefox)
      docElement.mozRequestFullScreen();
    } else if (docElement.msRequestFullscreen) {
      // Microsoft
      docElement.msRequestFullscreen();
    } else {
      const video = document.getElementsByTagName("video")[0] as HTMLVideoElement & {
        mozRequestFullScreen(): Promise<void>;
        webkitRequestFullscreen(): Promise<void>;
        webkitEnterFullScreen(): Promise<void>;
        msRequestFullscreen(): Promise<void>;
      };
      if (!video) {
        alert("Fullscreen not supported");
        return setIsFullscreen(false);
      }
      if (video.requestFullscreen) {
        // WebKit (Apple)
        video.requestFullscreen();
      } else if (video.mozRequestFullScreen) {
        // Mozilla (Firefox)
        video.mozRequestFullScreen();
      } else if (video.webkitRequestFullscreen) {
        // W3C standard
        video.webkitRequestFullscreen();
      } else if (video.webkitEnterFullScreen) {
        // W3C standard
        video.webkitEnterFullScreen();
      } else if (video.msRequestFullscreen) {
        // Microsoft
        video.msRequestFullscreen();
      } else {
        alert("Fullscreen not supported");
        return setIsFullscreen(false);
      }
    }
    setIsFullscreen(true);
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      // W3C standard
      document.exitFullscreen();
    } else if (
      (
        document as unknown as {
          webkitExitFullscreen(): Promise<void>;
        }
      ).webkitExitFullscreen
    ) {
      // WebKit (Apple)
      (
        document as unknown as {
          webkitExitFullscreen(): Promise<void>;
        }
      ).webkitExitFullscreen();
    } else if (
      (
        document as unknown as {
          mozCancelFullScreen(): Promise<void>;
        }
      ).mozCancelFullScreen
    ) {
      // Mozilla (Firefox)
      (
        document as unknown as {
          mozCancelFullScreen(): Promise<void>;
        }
      ).mozCancelFullScreen();
    } else if (
      (
        document as unknown as {
          msExitFullscreen(): Promise<void>;
        }
      ).msExitFullscreen
    ) {
      // Microsoft
      (
        document as unknown as {
          msExitFullscreen(): Promise<void>;
        }
      ).msExitFullscreen();
    } else {
      const videoElement = document.getElementsByTagName("video")[0] as HTMLVideoElement & {
        exitFullscreen(): Promise<void>;
        mozCancelFullScreen(): Promise<void>;
        webkitExitFullscreen(): Promise<void>;
        webkitExitFullScreen(): Promise<void>;
        msExitFullscreen(): Promise<void>;
      };
      if (!videoElement) {
        alert("Fullscreen not supported");
        return setIsFullscreen(false);
      }
      if (videoElement.exitFullscreen) {
        // WebKit (Apple)
        videoElement.exitFullscreen();
      } else if (videoElement.mozCancelFullScreen) {
        // Mozilla (Firefox)
        videoElement.mozCancelFullScreen();
      } else if (videoElement.webkitExitFullscreen) {
        // W3C standard
        videoElement.webkitExitFullscreen();
      } else if (videoElement.webkitExitFullScreen) {
        // W3C standard
        videoElement.webkitExitFullScreen();
      } else if (videoElement.msExitFullscreen) {
        // Microsoft
        videoElement.msExitFullscreen();
      } else {
        alert("Fullscreen not supported");
      }
    }
    setIsFullscreen(false);
  };

  const startFullScreen = () => {
    handleStartCamera();
    goFullScreen();
  };

  const isInFullScreen = () => {
    const doc = document as Document & {
      fullscreenElement: Element;
      webkitFullscreenElement: Element;
      mozFullScreenElement: Element;
      msFullscreenElement: Element;
    };
    return doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement;
  };

  const exitFullscreen = useCallback(() => {
    isInFullScreen() && exitFullScreen();
    isFullscreen && setIsFullscreen(false);
    setIsCameraActive(false);
  }, [isFullscreen]);

  useEffect(() => {
    if (devices != null) return;

    const getDevices = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true, ...(facingMode && { facingMode: facingMode }) });
        try {
          const mediaDevices = await navigator.mediaDevices.enumerateDevices();
          setDevices(mediaDevices.filter((device) => device.deviceId !== "" && device.kind === "videoinput"));
        } catch {
          setDevices([]);
        }
      } catch {
        setNoCamera(true);
      }
    };

    getDevices();
  }, [devices, facingMode]);

  useEffect(() => {
    if (devices === null || devices.length === 0) return;

    setSelectedDeviceId(devices[0].deviceId);
  }, [devices]);

  const nextDevice = () => {
    if (devices === null || devices.length === 0) return;

    const index = devices.findIndex((device) => device.deviceId === selectedDeviceId);

    if (index === -1) return setSelectedDeviceId(devices[0].deviceId);
    setSelectedDeviceId(devices[(index + 1) % devices.length].deviceId);
  };

  useEffect(() => {
    if (!selectedDeviceId) return;

    window.navigator.mediaDevices
      .getUserMedia({ video: videoConstraints })
      .then(() => setNoCamera(false))
      .catch(() => setNoCamera(true));

    // Exit fullscreen on change
    document.onfullscreenchange = () => {
      if (!document.fullscreenElement) exitFullscreen();
    };

    if (window.screen.orientation) {
      window.screen.orientation.onchange = orientationOnchange;
    }
  }, [selectedDeviceId, videoConstraints, exitFullscreen, orientationOnchange]);

  const style = useMemo(
    () => ({
      position: "absolute" as "absolute",
      top: 0,
      left: 0,
      height: height,
      width: width,
      background: "black",
      objectFit: "cover" as "cover",
      aspectRatio: `${((width * 1.0) / height) * 1.0}`,
      display: "block",
      transform: useMirror ? "scaleX(-1) " : "",
      ...(isFullscreen && { zIndex: 9900 }), // Set a higher z-index for fullscreen
    }),
    [height, width, isFullscreen, useMirror]
  );

  return noCamera ? (
    <>
      <h1 style={{ color: "red" }}>Asegúrese de entregarle permisos a la cámara</h1>
    </>
  ) : devices === null ? (
    <></>
  ) : devices.length === 0 ? (
    <h1 style={{ color: "red" }}>No se han encontrado cámaras en este dispositivo</h1>
  ) : (
    <>
      {isCameraActive ? (
        <>
          <Webcam ref={webcamRef} audio={false} videoConstraints={videoConstraints} height={height} width={width} style={style} />
          <CloseButton closeAction={exitFullscreen} />
          {!facingMode && devices.length > 1 && <ChangeDeviceButton changeDevice={nextDevice} horizontal={horizontal} />}
          <CaptureButton capture={capture} horizontal={horizontal} />
          <MirrorButton mirrorAction={() => setUseMirror(!useMirror)} horizontal={horizontal} />
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          {src && (
            <img
              src={src}
              style={{
                width: "80vw",
                maxWidth: 300,
                borderRadius: "1rem",
              }}
              alt="Foto capturada"
            />
          )}
          <Button
            onClick={startFullScreen}
            id="open-camera"
            disabled={devices === undefined || devices.length === 0}
            sx={{
              padding: "1.5rem",
              color: "white",
              backgroundColor: "black",
              border: "0 solid black",
              borderRadius: "1rem",
              boxShadow: "0 0 1rem rgba(0, 0, 0, 0.25)",
              textOverflow: "ellipsis",
              maxWidth: "80vw",
              textTransform: "none",
              fontSize: "1.5rem",
            }}
          >
            Iniciar cámara
          </Button>
        </Box>
      )}
    </>
  );
};

export default WebcamComponent;

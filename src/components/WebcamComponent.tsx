import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Webcam from "react-webcam"

import { VideocamOff } from "@mui/icons-material"
import { Alert, Box, Button, CircularProgress } from "@mui/material"

import CaptureButton from "./CaptureButton"
import ChangeDeviceButton from "./ChangeDeviceButton"
import CloseButton from "./CloseButton"
import MirrorButton from "./MirrorButton"

interface WebcamComponentProps {
  facingMode?: "user" | "environment"
}

const WebcamComponent = ({ facingMode }: WebcamComponentProps) => {
  const [isCameraActive, setIsCameraActive] = useState(false)

  const [width, setWidth] = useState(window.innerWidth)
  const [height, setHeight] = useState(window.innerHeight)
  const [noCamera, setNoCamera] = useState<boolean | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [devices, setDevices] = useState<MediaDeviceInfo[] | null>(null)
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("")
  const [src, setSrc] = useState<string | null>(null)
  const [horizontal, setHorizontal] = useState<boolean>(window.innerWidth >= window.innerHeight)
  const [useMirror, setUseMirror] = useState<boolean>(facingMode === undefined || facingMode === "user")

  const webcamRef = useRef<Webcam | null>(null)

  const updateSizes = useCallback(() => {
    setWidth(window.innerWidth)
    setHeight(window.innerHeight)
    setHorizontal(window.innerWidth >= window.innerHeight)
  }, [])

  useEffect(() => {
    if (!webcamRef?.current?.video) return

    webcamRef.current.video.onloadeddata = () => {
      updateSizes()
    }
  }, [webcamRef?.current?.video, updateSizes])

  // const [rotated, setRotated] = useState<boolean>(
  //   window.screen.orientation.angle == 90 || window.screen.orientation.angle == 270
  // );

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot()

    if (!imageSrc) return alert("No se pudo tomar la foto")

    exitFullscreen()
    setSrc("data:image/webp;base64," + imageSrc.substring(23))
  }

  const videoConstraints = useMemo(
    () =>
      ({
        video: {
          height: { exact: height },
          width: { exact: width },
          frameRate: { ideal: 60 },
        },
        deviceId: selectedDeviceId,
        audio: true,
        ...(facingMode && { facingMode: facingMode }),
      } as MediaTrackConstraints),
    [height, width, selectedDeviceId, facingMode]
  )

  window.onresize = updateSizes

  const handleStartCamera = async () => {
    try {
      navigator.mediaDevices
        .getUserMedia({ video: videoConstraints })
        .then(() => setIsCameraActive(true))
        .catch((err) => {
          alert("Error accessing camera: " + err)
          setIsCameraActive(false)
        })
    } catch (err) {
      alert("Error accessing camera: " + err)
      setIsCameraActive(false)
    }
  }

  const goFullScreen = () => {
    const docElement = document.documentElement as HTMLElement & {
      mozRequestFullScreen(): Promise<void>
      webkitRequestFullscreen(): Promise<void>
      webkitEnterFullScreen(): Promise<void>
      msRequestFullscreen(): Promise<void>
    }
    if (docElement.requestFullscreen) docElement.requestFullscreen() // W3C standard
    else if (docElement.webkitRequestFullscreen) docElement.webkitRequestFullscreen() // WebKit (Apple)
    else if (docElement.mozRequestFullScreen) docElement.mozRequestFullScreen() // Mozilla (Firefox)
    else if (docElement.msRequestFullscreen) docElement.msRequestFullscreen() // Microsoft
    else {
      const video = document.getElementsByTagName("video")[0] as HTMLVideoElement & {
        mozRequestFullScreen(): Promise<void>
        webkitRequestFullscreen(): Promise<void>
        webkitEnterFullScreen(): Promise<void>
        msRequestFullscreen(): Promise<void>
      }
      if (!video) {
        alert("Fullscreen not supported")
        return setIsFullscreen(false)
      }
      if (video.requestFullscreen) video.requestFullscreen() // W3C standard
      else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen() // WebKit (Apple)
      else if (video.webkitEnterFullScreen) video.webkitEnterFullScreen() // WebKit (Apple)
      else if (video.mozRequestFullScreen) video.mozRequestFullScreen() // Mozilla (Firefox)
      else if (video.msRequestFullscreen) video.msRequestFullscreen() // Microsoft
      else {
        alert("Fullscreen not supported")
        return setIsFullscreen(false)
      }
    }
    setIsFullscreen(true)
  }

  const exitFullScreen = () => {
    const doc = document as Document & {
      webkitExitFullscreen(): Promise<void>
      mozCancelFullScreen(): Promise<void>
      msExitFullscreen(): Promise<void>
    }
    if (doc.exitFullscreen) doc.exitFullscreen() // W3C standard
    else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen() // WebKit (Apple)
    else if (doc.mozCancelFullScreen) doc.mozCancelFullScreen() // Mozilla (Firefox)
    else if (doc.msExitFullscreen) doc.msExitFullscreen() // Microsoft
    else {
      const videoElement = document.getElementsByTagName("video")[0] as HTMLVideoElement & {
        exitFullscreen(): Promise<void>
        mozCancelFullScreen(): Promise<void>
        webkitExitFullscreen(): Promise<void>
        msExitFullscreen(): Promise<void>
      }
      if (!videoElement) {
        alert("Fullscreen not supported")
        return setIsFullscreen(false)
      }
      if (videoElement.exitFullscreen) videoElement.exitFullscreen() // W3C standard
      else if (videoElement.webkitExitFullscreen) videoElement.webkitExitFullscreen() // WebKit (Apple)
      else if (videoElement.mozCancelFullScreen) videoElement.mozCancelFullScreen() // Mozilla (Firefox)
      else if (videoElement.msExitFullscreen) videoElement.msExitFullscreen() // Microsoft
      else alert("Fullscreen not supported")
    }
    setIsFullscreen(false)
  }

  const startFullScreen = () => {
    handleStartCamera()
    goFullScreen()
  }

  const isInFullScreen = () => {
    const doc = document as Document & {
      fullscreenElement: Element
      webkitFullscreenElement: Element
      mozFullScreenElement: Element
      msFullscreenElement: Element
    }
    return doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement
  }

  const exitFullscreen = useCallback(() => {
    isInFullScreen() && exitFullScreen()
    isFullscreen && setIsFullscreen(false)
    setIsCameraActive(false)
  }, [isFullscreen])

  useEffect(() => {
    if (devices != null) return

    const getDevices = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true, ...(facingMode && { facingMode: facingMode }) })

        try {
          const mediaDevices = await navigator.mediaDevices.enumerateDevices()
          const videoDevices = mediaDevices.filter((device) => device.deviceId !== "" && device.kind === "videoinput")
          setDevices(videoDevices)
          if (videoDevices.length === 0) return setNoCamera(true)

          setSelectedDeviceId(videoDevices[0].deviceId)
        } catch {
          setDevices([])
        }
      } catch {
        setNoCamera(true)
      }
    }

    getDevices()
  }, [devices, facingMode])

  const nextDevice = () => {
    if (devices === null || devices.length === 0) return

    const index = devices.findIndex((device) => device.deviceId === selectedDeviceId)

    if (index === -1) return setSelectedDeviceId(devices[0].deviceId)
    setSelectedDeviceId(devices[(index + 1) % devices.length].deviceId)
  }

  useEffect(() => {
    if (!selectedDeviceId) return

    window.navigator.mediaDevices
      .getUserMedia({ video: videoConstraints })
      .then(() => setNoCamera(false))
      .catch(() => setNoCamera(true))

    // Exit fullscreen on change
    document.onfullscreenchange = () => {
      if (!document.fullscreenElement) exitFullscreen()
    }

    if (window.screen.orientation) {
      window.screen.orientation.onchange = updateSizes
    }
  }, [selectedDeviceId, videoConstraints, exitFullscreen, updateSizes])

  const style = useMemo(
    () => ({
      position: "absolute" as "absolute",
      top: 0,
      left: 0,
      height: height,
      width: width,
      backgroundColor: "black",
      objectFit: "cover" as "cover",
      aspectRatio: `${((width * 1.0) / height) * 1.0}`,
      display: "block",
      transform: useMirror ? "scaleX(-1) " : "",
      ...(isFullscreen && { zIndex: 9900 }),
    }),
    [height, width, isFullscreen, useMirror]
  )

  return noCamera ? (
    <Alert icon={<VideocamOff />} severity="error" sx={{ boxShadow: "0 0 1rem rgba(0, 0, 0, 0.25)" }}>
      Asegúrese de entregarle permisos a la cámara
    </Alert>
  ) : devices === null ? (
    <Box width={100} color="white">
      <CircularProgress color="inherit" />
    </Box>
  ) : devices.length === 0 ? (
    <Alert icon={<VideocamOff />} severity="error" sx={{ boxShadow: "0 0 1rem rgba(0, 0, 0, 0.25)" }}>
      No se han encontrado cámaras en este dispositivo
    </Alert>
  ) : (
    <>
      {isCameraActive ? (
        <Box id="webcam-interface">
          <Webcam ref={webcamRef} audio={false} videoConstraints={videoConstraints} height={height} width={width} style={style} />
          <CloseButton closeAction={exitFullscreen} />
          {!facingMode && devices.length > 1 && <ChangeDeviceButton changeDevice={nextDevice} horizontal={horizontal} />}
          <CaptureButton capture={capture} horizontal={horizontal} />
          <MirrorButton mirrorAction={() => setUseMirror(!useMirror)} horizontal={horizontal} />
        </Box>
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
          {src && <Box component="img" src={src} sx={{ width: "80vw", maxWidth: 300, borderRadius: "1rem" }} alt="Captura" />}
          <Button
            onClick={startFullScreen}
            id="open-camera"
            disabled={selectedDeviceId === ""}
            sx={{
              display: isCameraActive ? "none" : "block",
              padding: "1.5rem",
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.35)",
              border: "0 solid black",
              borderRadius: "1rem",
              boxShadow: selectedDeviceId === "" ? "" : "0 0 1rem rgba(0, 0, 0, 0.25)",
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
  )
}

export default WebcamComponent

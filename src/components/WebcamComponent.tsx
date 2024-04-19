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
  const [width, setWidth] = useState(window.innerWidth)
  const [height, setHeight] = useState(window.innerHeight)
  const [noCamera, setNoCamera] = useState<boolean | null>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [devices, setDevices] = useState<MediaDeviceInfo[] | null>(null)
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("")
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [src, setSrc] = useState<string | null>(null)
  const [horizontal, setHorizontal] = useState<boolean>(window.innerWidth >= window.innerHeight)
  const [useMirror, setUseMirror] = useState<boolean>(facingMode === undefined || facingMode === "user")
  const [isMobile, setIsMobile] = useState<boolean>(window.innerHeight < 600 || window.innerWidth < 600)

  const webcamRef = useRef<Webcam | null>(null)

  const updateSizes = useCallback(() => {
    setWidth(window.innerWidth)
    setHeight(window.innerHeight)
    setHorizontal(window.innerWidth >= window.innerHeight)
    setIsMobile(window.innerHeight < 600 || window.innerWidth < 600)
  }, [])

  useEffect(() => {
    if (!webcamRef.current?.video) return

    webcamRef.current.video.onloadeddata = updateSizes
  }, [webcamRef.current?.video, updateSizes])

  window.onresize = updateSizes

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot()

    if (!imageSrc) return alert("No se pudo tomar la foto")

    exitFullscreen()
    exitStream()
    setSrc("data:image/png;base64," + imageSrc.substring(23))
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

  const handleStartCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints })
      setStream(stream)

      setIsCameraActive(true)
    } catch (err) {
      setIsCameraActive(false)
      alert("Error accessing camera: " + err)
    }
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

  const goFullScreen = () => {
    const docElement = document.documentElement as HTMLElement & {
      webkitRequestFullscreen(): Promise<void>
      webkitEnterFullScreen(): Promise<void>
      mozRequestFullScreen(): Promise<void>
      msRequestFullscreen(): Promise<void>
    }
    if (docElement.requestFullscreen) docElement.requestFullscreen() // W3C standard
    else if (docElement.webkitRequestFullscreen) docElement.webkitRequestFullscreen() // WebKit (Apple)
    else if (docElement.webkitEnterFullScreen) docElement.webkitEnterFullScreen() // WebKit (Apple alternative)
    else if (docElement.mozRequestFullScreen) docElement.mozRequestFullScreen() // Mozilla (Firefox)
    else if (docElement.msRequestFullscreen) docElement.msRequestFullscreen() // Microsoft
    else {
      const video = document.getElementsByTagName("video")[0] as HTMLVideoElement & {
        webkitRequestFullscreen(): Promise<void>
        webkitEnterFullScreen(): Promise<void>
        mozRequestFullScreen(): Promise<void>
        msRequestFullscreen(): Promise<void>
      }
      if (!video) return alert("Fullscreen not supported")

      if (video.requestFullscreen) video.requestFullscreen() // W3C standard
      else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen() // WebKit (Apple)
      else if (video.webkitEnterFullScreen) video.webkitEnterFullScreen() // WebKit (Apple)
      else if (video.mozRequestFullScreen) video.mozRequestFullScreen() // Mozilla (Firefox)
      else if (video.msRequestFullscreen) video.msRequestFullscreen() // Microsoft
      else return alert("Fullscreen not supported")
    }
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
        webkitExitFullscreen(): Promise<void>
        mozCancelFullScreen(): Promise<void>
        msExitFullscreen(): Promise<void>
      }
      if (!videoElement) alert("Fullscreen not supported")
      else if (videoElement.exitFullscreen) videoElement.exitFullscreen() // W3C standard
      else if (videoElement.webkitExitFullscreen) videoElement.webkitExitFullscreen() // WebKit (Apple)
      else if (videoElement.mozCancelFullScreen) videoElement.mozCancelFullScreen() // Mozilla (Firefox)
      else if (videoElement.msExitFullscreen) videoElement.msExitFullscreen() // Microsoft
      else alert("Fullscreen not supported")
    }
  }

  const startFullScreen = () => {
    handleStartCamera()
    goFullScreen()
  }

  const exitFullscreen = () => {
    isInFullScreen() && exitFullScreen()
    setIsCameraActive(false)
    exitStream()
  }

  const exitStream = () => {
    stream?.getTracks()?.forEach((track) => track.stop())
    setStream(null)
  }

  useEffect(() => {
    if (devices != null) return

    const getDevices = async () => {
      try {
        // Get user permissions on start
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, ...(facingMode && { facingMode: facingMode }) })
        stream.getTracks().forEach((track) => track.stop())

        try {
          const mediaDevices = await navigator.mediaDevices.enumerateDevices()
          const videoDevices = mediaDevices.filter((device) => device.deviceId !== "" && device.kind === "videoinput")
          setDevices(videoDevices)
          if (videoDevices.length === 0) return setNoCamera(true)

          setSelectedDeviceId(videoDevices[0].deviceId)
        } catch {
          setDevices([])
        }
      } catch (e) {
        alert(e)
        setNoCamera(true)
      }
    }

    getDevices()
  }, [devices, facingMode])

  const nextDevice = () => {
    if (devices === null || devices.length === 0) return

    exitStream()

    const index = devices.findIndex((device) => device.deviceId === selectedDeviceId)

    if (index === -1) return setSelectedDeviceId(devices[0].deviceId)
    setSelectedDeviceId(devices[(index + 1) % devices.length].deviceId)
  }

  useEffect(() => {
    if (window.screen.orientation) window.screen.orientation.onchange = updateSizes
  }, [updateSizes])

  document.onfullscreenchange = () => !isInFullScreen() && exitFullscreen()

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
      zIndex: 9900,
    }),
    [height, width, useMirror]
  )

  console.log("isMobile:", isMobile)

  return noCamera ? (
    <Alert icon={<VideocamOff />} severity="error" sx={{ boxShadow: "0 0 1rem rgba(0, 0, 0, 0.25)" }}>
      Asegúrese de entregarle permisos a la cámara
    </Alert>
  ) : devices === null ? (
    <Box width={100}>
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
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap="1rem" my={3}>
          {src && <Box component="img" src={src} width="80vw" maxWidth={500} borderRadius="1rem" alt="Captura" />}
          <Button
            onClick={startFullScreen}
            id="open-camera"
            disabled={!selectedDeviceId}
            sx={{
              display: isCameraActive ? "none" : "flex",
              p: "1.5rem",
              m: 3,
              color: "white",
              bgcolor: "rgba(0, 0, 0, 0.35)",
              border: "0 solid black",
              borderRadius: "1rem",
              boxShadow: selectedDeviceId ? "0 0 1rem rgba(0, 0, 0, 0.25)" : "",
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

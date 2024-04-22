import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import Webcam from "react-webcam"

import { VideocamOff } from "@mui/icons-material"
import { Alert, Box, Button, CircularProgress } from "@mui/material"

import FullscreenContext from "../contexts/FullscreenContext"
import CaptureButton from "./CaptureButton"
import ChangeDeviceButton from "./ChangeDeviceButton"
import CloseButton from "./CloseButton"
import MirrorButton from "./MirrorButton"

interface WebcamComponentProps {
  facingMode?: "user" | "environment"
}

interface AuxMediaDeviceInfo extends MediaDeviceInfo {
  getCapabilities?: () => { facingMode: string; height: { max: number }; width: { max: number } }
}

const WebcamComponent = ({ facingMode }: WebcamComponentProps) => {
  const [width, setWidth] = useState(Math.min(window.innerWidth, window.screen.width))
  const [height, setHeight] = useState(Math.min(window.innerHeight, window.screen.height))
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [devices, setDevices] = useState<MediaDeviceInfo[] | null>(null)
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [src, setSrc] = useState<string | null>(null)
  const [horizontal, setHorizontal] = useState<boolean>(
    Math.min(window.innerWidth, window.screen.width) >= Math.min(window.innerHeight, window.screen.height)
  )
  const [useMirror, setUseMirror] = useState<boolean>(facingMode === undefined || facingMode === "user")
  const [isMobile, setIsMobile] = useState<boolean>(
    Math.min(window.innerHeight, window.screen.height) < 600 || Math.min(window.innerWidth, window.screen.width) < 600
  )

  const webcamRef = useRef<Webcam | null>(null)

  const { enterFullscreen, exitFullscreen, isFullscreen } = useContext(FullscreenContext)

  const updateSizes = useCallback(() => {
    setWidth(Math.min(window.innerWidth, window.screen.width))
    setHeight(Math.min(window.innerHeight, window.screen.height))
    setHorizontal(Math.min(window.innerWidth, window.screen.width) >= Math.min(window.innerHeight, window.screen.height))
    setIsMobile(Math.min(window.innerHeight, window.screen.height) < 600 || Math.min(window.innerWidth, window.screen.width) < 600)
  }, [])

  window.onresize = updateSizes

  useEffect(() => {
    if (!webcamRef.current?.video) return

    webcamRef.current.video.onloadeddata = updateSizes
  }, [webcamRef.current?.video, updateSizes])

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot()

    if (!imageSrc) return alert("No se pudo tomar la foto")

    exitWebcam()
    setSrc(imageSrc)
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

  const startStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints })
      setStream(stream)

      setIsCameraActive(true)
    } catch (err) {
      setIsCameraActive(false)
      alert("Error accessing camera: " + err)
    }
  }

  const startWebcam = () => {
    startStream()
    enterFullscreen()
  }

  const exitWebcam = () => {
    exitStream()
    isFullscreen() && exitFullscreen()
    setIsCameraActive(false)
  }

  const exitStream = () => {
    if (!stream) return

    stream.getTracks().forEach((track) => track.stop())
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
          let videoDevices = mediaDevices.filter((device) => device.deviceId !== "" && device.kind === "videoinput")
          if (videoDevices.length > 2) {
            // Keep one environment and one user or the first two
            const user = videoDevices.find((device) => {
              const auxDevice = device as AuxMediaDeviceInfo
              const capabilities = auxDevice.getCapabilities && auxDevice.getCapabilities()
              return (
                device.label.toLowerCase().includes("front") ||
                device.label.toLowerCase().includes("user") ||
                device.label.toLowerCase().includes("selfie") ||
                device.label.toLowerCase().includes("frontal") ||
                device.label.toLowerCase().includes("face") ||
                capabilities?.facingMode?.includes("user") ||
                (capabilities &&
                  ((capabilities.facingMode?.length === 0 && capabilities.height?.max) || 0) > (capabilities.width?.max || 0))
              )
            })
            const environment = videoDevices.find((device) => {
              const auxDevice = device as AuxMediaDeviceInfo
              const capabilities = auxDevice.getCapabilities && auxDevice.getCapabilities()
              return (
                device.label.toLowerCase().includes("back") ||
                device.label.toLowerCase().includes("environment") ||
                device.label.toLowerCase().includes("rear") ||
                device.label.toLowerCase().includes("world") ||
                device.label.toLowerCase().includes("posterior") ||
                capabilities?.facingMode?.includes("environment") ||
                (capabilities &&
                  ((capabilities.facingMode?.length === 0 && capabilities.width?.max) || 0) > (capabilities.height?.max || 0))
              )
            })
            if (user && environment) videoDevices = [user, environment]
            else videoDevices = videoDevices.slice(0, 2)
          }

          setDevices(videoDevices)
          if (videoDevices.length === 0) return setSelectedDeviceId("")

          setSelectedDeviceId(videoDevices[0].deviceId)
        } catch {
          setDevices([])
        }
      } catch (e) {
        alert(e)
        setSelectedDeviceId("")
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
    if (stream) return

    if (selectedDeviceId) {
      navigator.mediaDevices.getUserMedia({ video: videoConstraints }).then((stream) => setStream(stream))
    }
  }, [stream, selectedDeviceId, videoConstraints])

  useEffect(() => {
    if (!stream) return

    const expectedFacingMode = stream.getTracks()[0].getSettings().facingMode
    setUseMirror(expectedFacingMode !== "environment")
  }, [stream, selectedDeviceId])

  useEffect(() => {
    if (window.screen.orientation) window.screen.orientation.onchange = updateSizes
    window.onresize = updateSizes
  }, [updateSizes])

  document.onfullscreenchange = () => !isFullscreen() && exitWebcam()

  const style = useMemo(
    () => ({
      position: "absolute" as "absolute",
      top: 0,
      left: 0,
      height: isMobile ? height : height - 150,
      width: width,
      backgroundColor: "black",
      objectFit: isMobile ? ("cover" as "cover") : ("contain" as "contain"),
      aspectRatio: `${((width * 1.0) / height) * 1.0}`,
      display: "block",
      transform: useMirror ? "scaleX(-1) " : "",
      zIndex: 9900,
    }),
    [isMobile, height, width, useMirror]
  )

  const otherStyle = useMemo(
    () => ({
      bgcolor: "rgba(0, 0, 0, 1)",
      height: height,
      width: width,
    }),
    [height, width]
  )

  // Exit on escape
  document.onkeyup = (e) => {
    e.preventDefault()
    if (e.key === "Escape") exitWebcam()
    else if (e.key === "Enter") capture()
  }

  return selectedDeviceId === "" ? (
    <Alert icon={<VideocamOff />} severity="error" sx={{ boxShadow: "0 0 1rem rgba(0, 0, 0, 0.25)" }}>
      Asegúrese de entregarle permisos a la cámara
    </Alert>
  ) : devices === null ? (
    <Box display="flex" justifyContent="center" alignItems="center" width={width} height={height}>
      <CircularProgress color="inherit" />
    </Box>
  ) : devices?.length === 0 ? (
    <Alert icon={<VideocamOff />} severity="error" sx={{ boxShadow: "0 0 1rem rgba(0, 0, 0, 0.25)" }}>
      No se han encontrado cámaras en este dispositivo
    </Alert>
  ) : (
    <>
      {isCameraActive ? (
        <Box id="webcam-interface" sx={otherStyle}>
          <Webcam
            ref={webcamRef}
            audio={false}
            videoConstraints={videoConstraints}
            height={isMobile ? height : 0.6 * height}
            width={isMobile ? width : 0.6 * width}
            style={style}
            screenshotFormat={"image/webp"}
            screenshotQuality={1.0}
            forceScreenshotSourceSize={true}
          />
          <CloseButton closeAction={exitWebcam} mobile={isMobile} />
          {!facingMode && devices.length > 1 && <ChangeDeviceButton changeDevice={nextDevice} horizontal={horizontal} mobile={isMobile} />}
          <CaptureButton capture={capture} horizontal={horizontal} mobile={isMobile} />
          <MirrorButton mirrorAction={() => setUseMirror(!useMirror)} horizontal={horizontal} mobile={isMobile} />
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap="1rem" my={3} minHeight={height}>
          {src && <Box component="img" src={src} width="90vw" maxWidth={500} borderRadius="1rem" alt="Captura" />}
          <Button
            onClick={startWebcam}
            id="open-camera"
            disabled={!selectedDeviceId}
            sx={{
              display: isCameraActive ? "none" : "flex",
              p: "1.5rem",
              m: 3,
              color: "white",
              bgcolor: "rgba(0, 0, 0, 0.5)",
              border: "0 solid black",
              borderRadius: "1rem",
              boxShadow: selectedDeviceId ? "0 0 1rem rgba(0, 0, 0, 0.25)" : "",
              textOverflow: "ellipsis",
              maxWidth: "80vw",
              textTransform: "none",
              fontSize: "1.5rem",
              "&:hover": {
                bgcolor: "rgba(0, 0, 0, 0.75)",
              },
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

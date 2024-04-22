import FullscreenContext from "./FullscreenContext"

interface FullscreenProviderProps {
  children: JSX.Element
}

const FullscreenProvider = ({ children }: FullscreenProviderProps) => {
  const isFullscreen = () => {
    const doc = document as Document & {
      fullscreenElement: Element
      webkitFullscreenElement: Element
      mozFullScreenElement: Element
      msFullscreenElement: Element
    }
    if (doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement) return true

    return false
  }

  const enterFullscreen = () => {
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
      if (!video) return console.error("Fullscreen not supported")

      if (video.requestFullscreen) video.requestFullscreen() // W3C standard
      else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen() // WebKit (Apple)
      else if (video.webkitEnterFullScreen) video.webkitEnterFullScreen() // WebKit (Apple)
      else if (video.mozRequestFullScreen) video.mozRequestFullScreen() // Mozilla (Firefox)
      else if (video.msRequestFullscreen) video.msRequestFullscreen() // Microsoft
      else return console.error("Fullscreen not supported")
    }
  }

  const exitFullscreen = () => {
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
      if (!videoElement) console.error("Fullscreen not supported")
      else if (videoElement.exitFullscreen) videoElement.exitFullscreen() // W3C standard
      else if (videoElement.webkitExitFullscreen) videoElement.webkitExitFullscreen() // WebKit (Apple)
      else if (videoElement.mozCancelFullScreen) videoElement.mozCancelFullScreen() // Mozilla (Firefox)
      else if (videoElement.msExitFullscreen) videoElement.msExitFullscreen() // Microsoft
      else console.error("Fullscreen not supported")
    }
  }

  const value = { isFullscreen, enterFullscreen, exitFullscreen }

  return <FullscreenContext.Provider value={value}>{children}</FullscreenContext.Provider>
}

export default FullscreenProvider

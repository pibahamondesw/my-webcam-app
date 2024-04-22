import { createContext } from "react"

interface FullscreenContextType {
  isFullscreen: () => boolean
  enterFullscreen: () => void
  exitFullscreen: () => void
}

const FullscreenContext = createContext<FullscreenContextType>({
  isFullscreen: () => false,
  enterFullscreen: () => {},
  exitFullscreen: () => {},
})

export default FullscreenContext

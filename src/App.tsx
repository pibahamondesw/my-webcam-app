import "./App.css"

import { Box } from "@mui/material"

import WebcamComponent from "./components/WebcamComponent"
import FullscreenProvider from "./contexts/FullscreenProvider"

function App() {
  return (
    <FullscreenProvider>
      <Box className="App" overflow="hidden" alignContent="center" alignItems="center" display="flex" justifyContent="center" color="white">
        <WebcamComponent />
      </Box>
    </FullscreenProvider>
  )
}

export default App

import "./App.css"

import { Box } from "@mui/material"

import WebcamComponent from "./components/WebcamComponent"

function App() {
  return (
    <Box className="App" overflow="hidden" alignContent="center" alignItems="center" display="flex" justifyContent="center" color="white">
      <WebcamComponent />
    </Box>
  )
}

export default App

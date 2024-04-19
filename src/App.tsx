import "./App.css"

import { Box } from "@mui/material"

import WebcamComponent from "./components/WebcamComponent"

function App() {
  return (
    <Box
      className="App"
      height="100%"
      minHeight="100vh"
      width="100%"
      minWidth="100vw"
      overflow="hidden"
      alignContent="center"
      alignItems="center"
      display="flex"
      justifyContent="center"
      color="white"
    >
      <WebcamComponent />
    </Box>
  )
}

export default App

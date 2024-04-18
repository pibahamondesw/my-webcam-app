import "./App.css";

import WebcamComponent from "./components/WebcamComponent";

function App() {
  return (
    <div
      className="App"
      style={{
        height: "100%",
        minHeight: "100vh",
        overflow: "hidden",
        alignContent: "center",
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        backgroundColor: "darkcyan",
      }}
    >
      <WebcamComponent />
    </div>
  );
}

export default App;

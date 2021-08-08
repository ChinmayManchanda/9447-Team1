import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import MiniDrawer from "./components/MiniDrawer";
import { Router } from "react-router-dom";

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <MiniDrawer />
    </React.Fragment>
  );
}

export default App;

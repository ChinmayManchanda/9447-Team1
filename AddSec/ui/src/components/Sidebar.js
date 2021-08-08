import { Typography } from "@material-ui/core";
import React from "react";

const Sidebar = () => {
  const onDragStart = (event, nodeType , label) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.setData("application/reactflow2", label);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside>
      <Typography>
        You can drag these nodes to the pane on the right.
        </Typography>
    
      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, "default" , "SonarCloud Scan (SAST)")}
        draggable
      >
        SonarCloud Scan (SAST)
      </div>
      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, "default" , "OWASP ZAP (DAST)")}
        draggable
      >
        OWASP ZAP (DAST)
      </div>
      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, "default" , "Docker Image Scanner")}
        draggable
      >
        Snyk Docker Image Scanner
      </div>
      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, "default" , "NIX Reproducible build process")}
        draggable
      >
        NIX Reproducible build process
      </div>
    </aside>
  );
};

export default Sidebar
import React, { useState, useRef } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  removeElements,
  Controls,
} from "react-flow-renderer";

import Button from "@material-ui/core/Button";
import Sidebar from "./Sidebar";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import "../css/dnd.css";
import { Card, CardContent, Grid, Typography } from "@material-ui/core";
import SecurityIcon from "@material-ui/icons/Security";
import SnackBar from "./SnackBar";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";

// const initialElements = [
//   {
//     id: "1",
//     type: "input",
//     sourcePosition: "right",
//     data: { label: "Code Commit" },
//     position: { x: 250, y: 100 },
//   },
//   {
//     id: "2",
//     sourcePosition: "right",
//     targetPosition: "left",
//     data: { label: "Build" },
//     position: { x: 500, y: 100 },
//   },
//   {
//     id: "3",
//     type: "input",
//     sourcePosition: "left",
//     data: { label: "Deploy" },
//     position: { x: 750, y: 100 },
//   },

//   {
//     id: "e1-2",
//     source: "1",
//     type: "smoothstep",
//     target: "2",
//     animated: true,
//   },
//   {
//     id: "e2-3",
//     source: "2",
//     type: "smoothstep",
//     target: "3",
//     animated: true,
//   },
// ];

// let id = 3;
// const getId = () => `dndnode_${id++}`;

const FlowChart = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [elements, setElements] = useState([]);
  const [value, setValue] = React.useState("Condensed");
  const [slack, setSlack] = React.useState(false);
  const [precommit1, setCommit1] = React.useState(false);
  const [precommit2, setCommit2] = React.useState(false);

  const [open, setOpen] = React.useState(false);
  const onConnect = (params) => setElements((els) => addEdge(params, els));
  const onElementsRemove = (elementsToRemove) =>
    setElements((els) => removeElements(elementsToRemove, els));

  const getImpElements = (data) => {
    var list = data.steps;
    var finalElements = [];
    var pipeline = [];
    var id = 1;
    var x = 200;
    var y = 100;
    var flag = 0;
    for (var i = 0; i < list.length; i++) {
      if (
        list[i]["visible"] &&
        Object.values(data["pos"]).includes(list[i]["name"])
      ) {
        if (list[i]["name"] === data["pos"]["commit"]) {
          finalElements.push({
            id: String(id++),
            type: "input",
            sourcePosition: "right",
            data: { label: list[i]["name"] + "- COMMIT" },
            position: { x: x, y: y },
          });
        } else if (list[i]["name"] === data["pos"]["deploy"]) {
          finalElements.push({
            id: String(id++),
            type: "input",
            sourcePosition: "left",
            data: { label: list[i]["name"] + "- DEPLOY" },
            position: { x: x, y: y },
          });
        } else {
          finalElements.push({
            id: String(id++),
            sourcePosition: "right",
            targetPosition: "left",
            data: { label: list[i]["name"] + "- BUILD" },
            position: { x: x, y: y },
          });
        }

        if (flag === 0) {
          if (x === 800) {
            flag = 1;
            y += 100;
          } else {
            x += 200;
          }
        } else {
          if (x !== 200) {
            x -= 200;
          } else {
            flag = 0;
            y += 100;
          }
        }
      }
    }
    pipeline = finalElements;
    //console.log(finalElements.length)
    var len = finalElements.length;
    for (var k = 1; k < len; k++) {
      var j = k + 1;
      pipeline.push({
        id: "e" + k.toString() + "-" + j.toString(),
        source: k.toString(),
        type: "smoothstep",
        target: j.toString(),
        animated: true,
      });
    }
    return pipeline;
  };
  const getElements = (list) => {
    var finalElements = [];
    var pipeline = [];
    var id = 1;
    var x = 200;
    var y = 100;
    var flag = 0;
    for (var i = 0; i < list.length; i++) {
      if (list[i]["visible"]) {
        if (finalElements.length === 0) {
          finalElements.push({
            id: String(id++),
            // type: "input",
            sourcePosition: "right",
            // targetPosition: "left",
            data: { label: list[i]["name"] },
            position: { x: x, y: y },
          });
        } else if (i === list.length - 1) {
          finalElements.push({
            id: String(id++),
            type: "input",
            sourcePosition: "left",
            // targetPosition: "left",
            data: { label: list[i]["name"] },
            position: { x: x, y: y },
          });
        } else {
          finalElements.push({
            id: String(id++),
            sourcePosition: "right",
            targetPosition: "left",
            data: { label: list[i]["name"] },
            position: { x: x, y: y },
          });
        }

        if (flag === 0) {
          if (x === 800) {
            flag = 1;
            y += 100;
          } else {
            x += 200;
          }
        } else {
          if (x !== 200) {
            x -= 200;
          } else {
            flag = 0;
            y += 100;
          }
        }
      }
    }
    pipeline = finalElements;
    //console.log(finalElements.length)
    var len = finalElements.length;
    for (var k = 1; k < len; k++) {
      var j = k + 1;
      pipeline.push({
        id: "e" + k.toString() + "-" + j.toString(),
        source: k.toString(),
        type: "smoothstep",
        target: j.toString(),
        animated: true,
      });
    }
    return pipeline;
  };

  React.useEffect(() => {
    const fetchProducts = async () => {
      const products = await fetch("http://localhost:5000/getNamesPos")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
          var finalElements = [];
          if (value === "Condensed") {
            finalElements = getImpElements(data);
          } else {
            finalElements = getElements(data.steps);
          }

          return finalElements;
        });

      setElements(products);
    };
    fetchProducts();
  }, [value]);

  const handleSlack = (event) => {
    setSlack(event.target.checked);
  };
  const handlePreCommit1 = (event) => {
    setCommit1(event.target.checked);
  };
  const handlePreCommit2 = (event) => {
    setCommit2(event.target.checked);
  };

  const handleRadio = (event) => {
    setValue(event.target.value);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const getId = () => `dndnode_${elements.length++}`;
  const onLoad = (_reactFlowInstance) => {
    _reactFlowInstance.fitView({ padding: 0.2 });
    setReactFlowInstance(_reactFlowInstance);
  };
  const handleIntegrate = () => {
    console.log(elements);
    var obj = {}
    obj['steps'] = elements
    obj['slack'] = slack
    obj['pre_commit'] = precommit1
    console.log(obj)
    fetch("http://localhost:5000/setToolNames", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    }).then((response) => {
      if (response.ok) {
        console.log("Succesfully Integrated !");
        setOpen(true);
      } else {
        console.log("Integration Failed !");
      }
    });
  };
  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };
  const graphStyles = { width: "100%", height: "400px" };
  const onDrop = (event) => {
    event.preventDefault();

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const type = event.dataTransfer.getData("application/reactflow");
    const label = event.dataTransfer.getData("application/reactflow2");
    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });
    const newNode = {
      id: getId(),
      type,
      position,
      data: { label: label },
    };

    setElements((es) => es.concat(newNode));
  };

  return (
    <div className="dndflow">
      {console.log(elements.length)}
      <ReactFlowProvider>
        <Grid container alignItems="center" justify="center">
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Pipeline View</FormLabel>

              <RadioGroup
                aria-label="Pipeline View"
                name="gender1"
                value={value}
                onChange={handleRadio}
              >
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormControlLabel
                      value={"Condensed"}
                      control={<Radio />}
                      label="Condensed Pipeline"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      value={"Full"}
                      control={<Radio />}
                      label="Full Pipeline"
                    />
                  </Grid>
                </Grid>
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={10}>
            <div className="reactflow-wrapper" ref={reactFlowWrapper}>
              <ReactFlow
                elements={elements}
                onConnect={onConnect}
                onElementsRemove={onElementsRemove}
                onLoad={onLoad}
                onDrop={onDrop}
                onDragOver={onDragOver}
                style={graphStyles}
              >
                <Controls />
              </ReactFlow>
            </div>
          </Grid>
          <Grid item xs={2}>
            <Card style={{ height: "100%" }}>
              <CardContent>
                <Sidebar />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={3}></Grid>
          <Grid item xs={6}>
            <Button
              startIcon={<SecurityIcon />}
              style={{
                backgroundColor: "#12824C",
                color: "#FFFFFF",
                width: "80%",
              }}
              variant="contained"
              onClick={handleIntegrate}
            >
              Intergate
            </Button>
          </Grid>
          <Grid item xs={3}>
            <SnackBar
              open={open}
              handleClose={handleClose}
              type={"success"}
              message={"Configuration Saved Successfully !"}
            />
          </Grid>
          <Grid style={{'paddingTop' : "50px"}}item xs={12}>
            <Typography>Notification System :</Typography>
          <FormControlLabel
            control={
              <Checkbox
              checked={slack}
              onChange={handleSlack}
              inputProps={{ "aria-label": "primary checkbox" }}
            />
            }
            label="Slack Bot"
          />
          </Grid>
          <Grid style={{'paddingTop' : "5px"}} item xs={12}>
          <Typography>Pre-Commit Hooks :</Typography>
          <FormControlLabel
            control={
              <Checkbox
            checked={precommit1}
            onChange={handlePreCommit1}
            inputProps={{ "aria-label": "primary checkbox" }}
          />
            }
            label="AWS Git Secrets"
          />
         <FormControlLabel
            control={
              <Checkbox
              checked={precommit2}
              onChange={handlePreCommit2}
              inputProps={{ "aria-label": "primary checkbox" }}
            />
            }
            label="Dev dependency scanning"
          />
          </Grid>
         
        </Grid>
      </ReactFlowProvider>
    </div>
  );
};

export default FlowChart;

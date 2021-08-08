import { React, useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { InputLabel, Select, MenuItem } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import SnackBar from "./SnackBar";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Label() {
  const classes = useStyles();
  const [stages, setStages] = useState(["Stage 1"]);
  const [config, setConfig] = useState({ commit: "", build: "", deploy: "" });
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/getNames")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        var name_list = data.map((stage) => {
          return stage["name"];
        });
        setStages(name_list);
      });
  }, [0]);

  const handleClose1 = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen1(false);
  };
  const handleClose2 = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen2(false);
  };

  const handleSave = () => {
    if (Object.values(config).includes("")) {
      console.log("Select a value for all 3 stages !");
      setOpen1(true);
    } else {
      fetch("http://localhost:5000/setStagePos", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pos: config }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          setOpen2(true);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  return (
    <div className={classes.paper}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <InputLabel id="commit">Code Commit Stage</InputLabel>
          <Select
            labelId="commit"
            id="commit"
            value={config.commit}
            variant="outlined"
            fullWidth
            autoFocus
            onChange={(event) =>
              setConfig({ ...config, commit: event.target.value })
            }
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {stages !== "undefined" &&
              stages.map((stage, index) => {
                return (
                  <MenuItem key={index} value={stage}>
                    {stage}
                  </MenuItem>
                );
              })}
          </Select>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InputLabel id="build">Build Stage</InputLabel>
          <Select
            labelId="build"
            id="build"
            value={config.build}
            variant="outlined"
            fullWidth
            autoFocus
            onChange={(event) =>
              setConfig({ ...config, build: event.target.value })
            }
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {stages.map((stage, index) => {
              return (
                <MenuItem key={index} value={stage}>
                  {stage}
                </MenuItem>
              );
            })}
          </Select>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InputLabel id="deploy">Deploy Stage</InputLabel>
          <Select
            labelId="deploy"
            id="deploy"
            value={config.deploy}
            variant="outlined"
            fullWidth
            autoFocus
            onChange={(event) =>
              setConfig({ ...config, deploy: event.target.value })
            }
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {stages.map((stage, index) => {
              return (
                <MenuItem key={index} value={stage}>
                  {stage}
                </MenuItem>
              );
            })}
          </Select>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox value="allowExtraEmails" color="primary" />}
            label="I accept that  : AWS >>> Other Cloud Providers"
          />
        </Grid>
      </Grid>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
        startIcon={<SaveIcon />}
        onClick={handleSave}
      >
        Save Congifuration
      </Button>
      <SnackBar
        open={open1}
        setOpen={setOpen1}
        handleClose={handleClose1}
        type={"error"}
        message={"Select ALL 3 stages !"}
      />
      <SnackBar
        open={open2}
        setOpen={setOpen2}
        handleClose={handleClose2}
        type={"success"}
        message={"Configuration Saved Successfully !"}
      />
    </div>
  );
}

export default Label;

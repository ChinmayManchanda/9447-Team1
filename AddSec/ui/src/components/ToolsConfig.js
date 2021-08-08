import { React, useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { InputLabel, Select, MenuItem } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import SnackBar from "./SnackBar";
import { TextField } from "@material-ui/core";
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

function ToolsConfig() {
  const classes = useStyles();
  const [config, setConfig] = useState({ url:"" , orgkey:"" , projectkey:"" });
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);

  const handleChange = (event) => {
    if(event.target.id === "url"){
      setConfig( {...config , url : event.target.value })
    } else if(event.target.id === "org") {
      setConfig({...config , orgkey : event.target.value})
    } else {
      setConfig({...config , projectkey : event.target.value})
    }
  }

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
      console.log("Enter Valid repo/filename");
      setOpen1(true);
    } else {
      fetch("http://localhost:5000/setConfig", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
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
        <Grid item xs={12} >
          <InputLabel id="org" style={{paddingBottom : "10px"}}>SonarCloud Configuration</InputLabel>
          <TextField id="org" fullWidth={true} label="Organisation Key" onChange={handleChange} variant="outlined" />

        </Grid>
        <Grid item xs={12} >
          <TextField id="projectkey" fullWidth={true} label="Project Key"  onChange={handleChange} variant="outlined" />
        </Grid>
        <Grid item xs={12} >
          <InputLabel id="url" style={{paddingBottom : "10px"}}>ZAP Configuration</InputLabel>
          <TextField id="url" fullWidth={true} label="Deployment URL" onChange={handleChange} variant="outlined" />

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
        Upload Config
      </Button>
      <SnackBar
        open={open1}
        setOpen={setOpen1}
        handleClose={handleClose1}
        type={"error"}
        message={"Cannot find the appropriate config !"}
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

export default ToolsConfig;

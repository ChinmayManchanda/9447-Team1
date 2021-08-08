import React from "react";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import SaveIcon from "@material-ui/icons/Save";
import SnackBar from "./SnackBar";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {show : false}
    this.handleUploadImage = this.handleUploadImage.bind(this);
    this.handleClose1 = this.handleClose1.bind(this)
  }
  handleClose1 = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({show:false});
  };
  
  handleUploadImage(ev) {
    ev.preventDefault();

    const data = new FormData();
    data.append("file", this.uploadInput.files[0]);
    data.append("filename", this.fileName.value);

    fetch("http://localhost:5000/upload", {
      method: "POST",
      body: data,
    }).then((response) => {
      if (response.ok) {
        console.log("Succesfully uploaded");
        this.setState({show:true})
      }
    });
  }

  render() {
    return (
      <form onSubmit={this.handleUploadImage}>
        <div>
          <input
            ref={(ref) => {
              this.uploadInput = ref;
              this.fileName = ref;
            }}
            type="file"
          />
        </div>

        <br />

        <div>
          <Button
            type="submit"
            variant="outlined"
            color="primary"
            startIcon={<CloudUploadIcon />}
          >
            Upload
          </Button>
          <SnackBar
        open={this.state.show}
        handleClose={this.handleClose1}
        type={"success"}
        message={"Pipeline Uploaded Successfully !"}
      />
        </div>
      </form>
    );
  }
}

export default Main;

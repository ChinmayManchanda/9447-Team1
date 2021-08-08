import React, { useState } from "react";
import Button from "@material-ui/core/Button";

export default function Update() {
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  };

	
	const uploadFile = (e) => {
		//e.preventDefault();
		//let file = selectedFile;
		const formData = new FormData();
	
		formData.append("file", selectedFile);
	
		fetch("https://localhost:5000/upload", {
			method: "POST",
			body: formData
		})
			.then(res => console.log(res))
			.catch(err => console.warn(err));
	}
  const handleSubmission = () => {
    const formData = new FormData();

    formData.append("File", selectedFile);

    fetch("https://freeimage.host/api/1/upload?key=<YOUR_API_KEY>", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Success:", result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <input type="file" name="file" onChange={changeHandler} />
      {isFilePicked ? (
        <div>
          <p>Filename: {selectedFile.name}</p>
          <p>Filetype: {selectedFile.type}</p>
          <p>Size in bytes: {selectedFile.size}</p>
          <p>
            lastModifiedDate:{" "}
            {selectedFile.lastModifiedDate.toLocaleDateString()}
          </p>
        </div>
      ) : (
        <p>Select a file to show details</p>
      )}
      <div>
        <Button variant="outlined" color="primary" onClick={uploadFile}>
          Submit
        </Button>
      </div>
    </div>
  );
}

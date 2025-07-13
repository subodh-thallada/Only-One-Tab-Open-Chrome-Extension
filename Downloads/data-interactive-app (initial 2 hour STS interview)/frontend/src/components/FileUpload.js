import React from "react";

const FileUpload = () => {
  const handleUpload = (event) => {
    const file = event.target.files[0];
    console.log(file);
    alert("File upload feature is not implemented yet.");
  };

  return (
    <div>
      <h2>Upload Dataset</h2>
      <input type="file" onChange={handleUpload} />
    </div>
  );
};

export default FileUpload;

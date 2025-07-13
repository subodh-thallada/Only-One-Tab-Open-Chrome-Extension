import React from "react";
import FileUpload from "./components/FileUpload";
import DataTable from "./components/DataTable";
// import Charts from "./components/Charts"; // Temporarily disabled

function App() {
  return (
    <div>
      <h1>Interactive Data Application</h1>
      <FileUpload />
      <DataTable />
      {/* <Charts /> */} {/* Temporarily disabled */}
    </div>
  );
}

export default App;

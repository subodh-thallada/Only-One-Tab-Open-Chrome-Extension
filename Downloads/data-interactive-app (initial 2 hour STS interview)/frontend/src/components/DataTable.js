import React, { useEffect, useState } from "react";

const DataTable = () => {
  const [data, setData] = useState([]); // State to hold table data
  const [newRow, setNewRow] = useState({}); // State to hold new row data
  const [editingIndex, setEditingIndex] = useState(null); // Track the row being edited

  // Fetch data from the backend on component mount
  useEffect(() => {
    fetch("http://127.0.0.1:5000/data")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data from the server");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched data:", data); // Debug: Log fetched data
        setData(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Function to handle adding a new row
  const handleAddRow = () => {
    fetch("http://127.0.0.1:5000/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRow),
    })
      .then(() => {
        setData([...data, newRow]); // Add the new row to the table
        setNewRow({}); // Clear input fields
      })
      .catch((error) => console.error("Error adding row:", error));
  };

  // Function to handle deleting a row
  const handleDelete = (index) => {
    fetch(`http://127.0.0.1:5000/data/${index}`, { method: "DELETE" })
      .then(() => {
        setData(data.filter((_, i) => i !== index)); // Remove the row from the table
      })
      .catch((error) => console.error("Error deleting row:", error));
  };

  // Function to start editing a row
  const handleEdit = (index) => {
    const rowToEdit = data[index];
    setNewRow(rowToEdit); // Populate input fields with row data
    setEditingIndex(index); // Set the row index being edited
  };

  // Function to save the edited row
  const handleSaveEdit = () => {
    fetch("http://127.0.0.1:5000/data", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index: editingIndex, row: newRow }),
    })
      .then(() => {
        const updatedData = [...data];
        updatedData[editingIndex] = newRow; // Update the row in the table
        setData(updatedData);
        setNewRow({}); // Clear input fields
        setEditingIndex(null); // Exit edit mode
      })
      .catch((error) => console.error("Error editing row:", error));
  };

  return (
    <div>
      <h2>Data Table</h2>

      {/* Add New Row / Edit Row */}
      <div>
        <h3>{editingIndex !== null ? "Edit Row" : "Add New Row"}</h3>
        {data.length > 0 && Object.keys(data[0]).map((key) => (
          <input
            key={key}
            placeholder={key}
            value={newRow[key] || ""}
            onChange={(e) =>
              setNewRow({ ...newRow, [key]: e.target.value })
            }
          />
        ))}
        {editingIndex !== null ? (
          <button onClick={handleSaveEdit}>Save Edit</button>
        ) : (
          <button onClick={handleAddRow}>Add Row</button>
        )}
      </div>

      {/* Data Table */}
      <table>
        <thead>
          <tr>
            {data.length > 0 &&
              Object.keys(data[0]).map((key) => <th key={key}>{key}</th>)}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((value, i) => (
                <td key={i}>{value}</td>
              ))}
              <td>
                <button onClick={() => handleEdit(index)}>Edit</button>
                <button onClick={() => handleDelete(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;

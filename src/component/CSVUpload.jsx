import React from "react";
import Papa from "papaparse";
import { useState } from "react";

const CSVUpload = () => {
  const [parsedData, setParsedData] = useState([]);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          console.log("CSV → JSON:", result.data);
          setParsedData(result.data);
        },
      });
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
    </div>
  );
};

export default CSVUpload;

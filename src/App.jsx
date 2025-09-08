import { useState } from "react";
import "./App.css";
import UserInputForm from "./component/UserInputForm";
import EmployeeTable from "./component/EmployeeTable";
import Papa from "papaparse";
import api from "./utils/api";

function App() {
  const [employees, setEmployees] = useState([]);

  const handleAddEmployee = async (formData) => {
    setEmployees([...employees, formData]);
   
    try {
      const response = await api.post("/employee", formData); //change to employee?
      if (response.status === 200) {
        console.log("Sucess");
      }         
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleDownloadCSV = () => {
    if (employees.length === 0) {
      alert("No employee records found.");
      return;
    }

    const csv = Papa.unparse(employees);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "employees.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div>
        <h1>Register Employee Information</h1>
        <hr />
        <div>
          <h2>Add Employee Manually</h2>
          <p>
            Fill out the form to register a single employee and download the CSV
            file.
          </p>
          <UserInputForm onSubmit={handleAddEmployee} />
          <p></p>
          <EmployeeTable employees={employees} />
        
          <button onClick={handleDownloadCSV}>📥 Download CSV </button>
        </div>
      
  
      </div>
    </>
  );
}

export default App;

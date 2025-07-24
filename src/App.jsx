import { useState } from "react";
import UserInputForm from "./component/UserInputForm";
import EmployeeTable from "./component/EmployeeTable";
import refineData from "./utils/refineData";
import Papa from "papaparse";
import "./App.css";

function App() {
  const [employees, setEmployees] = useState([]);

  const handleAddEmployee = (formData) => {
    setEmployees([...employees, formData]);
    console.log("employees", employees);
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
        <h1>Employee Payroll</h1>
        <UserInputForm onSubmit={handleAddEmployee} />
        <EmployeeTable employees={employees} />
        <button onClick={handleDownloadCSV}>📥 Download CSV </button>
      </div>
    </>
  );
}

export default App;

import { useState } from "react";
import UserInputForm from './component/UserInputForm'
import EmployeeTable from './component/EmployeeTable'; 
import "./App.css";

function App() {
  const [employees, setEmployees] =useState([]);
  
  const handleAddEmployee = (formData)=>{
    setEmployees([...employees, formData]);
  } 
  

  return (

  <>
  <div>
    <h1>Employee Payroll</h1>
    <UserInputForm onSubmit={handleAddEmployee} />
    <EmployeeTable employees={employees} />
  </div>
  </>);
}

export default App;

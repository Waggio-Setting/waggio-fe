import React from "react";
import { useState } from "react";
import Papa from "papaparse";

const UserInputForm = () => {
  const [userInputs, setUserInputs] = useState([
    {
      ID: 1,
      Name: "Alice Kim",
      PayPeriodStart: "2024-06-01",
      PayPeriodEnd: "2024-06-15",
      BaseSalary: 2000,
      Bonus: 200,
      Allowance: 100,
      OvertimePay: 50,
      TaxDeduction: 300,
      Pension: 100,
      HealthInsurance: 80,
      OtherDeductions: 20,
      NetPay: 1850,
    },
  ]);
  const handleExportCSV = () => {
    const csv = Papa.unparse(userInputs);
    console.log("csv", csv);
  };

  return (
    <div>
      <h2>📄 Payroll Data</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>BaseSalary</th>
            <th>Bonus</th>
            <th>NetPay</th>
          </tr>
        </thead>
        <tbody>
          {userInputs.map((row, index) => (
            <tr key={index}>
              <td>{row.ID}</td>
              <td>{row.Name}</td>
              <td>{row.BaseSalary}</td>
              <td>{row.Bonus}</td>
              <td>{row.NetPay}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleExportCSV}>Download CSV</button>
    </div>
  );
};

export default UserInputForm;

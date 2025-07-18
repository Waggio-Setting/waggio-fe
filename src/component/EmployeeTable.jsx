import React from 'react';

const EmployeeTable = ({ employees }) => {
  return (
    <table border="1" cellPadding="10" style={{ marginTop: '20px' }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>SIN</th>
          <th>Pay Date</th>
          <th>Type</th>
          <th>Hourly Rate</th>
          <th>Hours</th>
          <th>Salary</th>
          <th>Vacation %</th>
          <th>Bonus</th>
          <th>Bank Name</th>
          <th>Account #</th>
          <th>Transit #</th>
          <th>Institution #</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((emp, index) => (
          <tr key={index}>
            <td>{emp.fullName}</td>
            <td>{emp.sin}</td>
            <td>{emp.payDate}</td>
            <td>{emp.employmentType}</td>
            <td>{emp.hourlyRate}</td>
            <td>{emp.hoursWorked}</td>
            <td>{emp.salary}</td>
            <td>{emp.vacationPay}</td>
            <td>{emp.bonus}</td>
            <td>{emp.bankName}</td>
            <td>{emp.bankAccount}</td>
            <td>{emp.transitNumber}</td>
            <td>{emp.institutionNumber}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EmployeeTable;

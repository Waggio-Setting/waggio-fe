import React,{useState} from 'react'

 const initialForm = { //initialForm: 입력값 초기 상태
    fullName: '',
    sin: '',
    payDate: '',
    employmentType: 'Full-time',
    hourlyRate: '',
    hoursWorked: '',
    salary: '',
    vacationPay: 4,
    bonus: 0,
    bankName: '',
    bankAccount: '',
    transitNumber: '',
    institutionNumber: '',
  };


export const UserInputForm = ( {onSubmit }) => {
  const [formData, setFormData] = useState(initialForm); //입력값관리

  const handleChange =(e)=>{
    const {name, value} = e.target;
    setFormData({...formData,[name]:value});
  } //사용자가 input에 입력할 때마다 상태를 업데이트

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);  //상위로 전달
    setFormData(initialForm); //초기화
  }; //submit 버튼 눌렀을 때 실행 
 
  
  return (
     <form onSubmit={handleSubmit}>
      <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" required />
      <input name="sin" value={formData.sin} onChange={handleChange} placeholder="SIN" maxLength={9} required />
      <input name="payDate" type="date" value={formData.payDate} onChange={handleChange} required />
      <select name="employmentType" value={formData.employmentType} onChange={handleChange}>
        <option>Full-time</option>
        <option>Part-time</option>
        <option>Contract</option>
      </select>
      <input name="hourlyRate" type="number" value={formData.hourlyRate} onChange={handleChange} placeholder="Hourly Rate" />
      <input name="hoursWorked" type="number" value={formData.hoursWorked} onChange={handleChange} placeholder="Hours Worked" />
      <input name="salary" type="number" value={formData.salary} onChange={handleChange} placeholder="Salary" />
      <input name="vacationPay" type="number" value={formData.vacationPay} onChange={handleChange} placeholder="Vacation Pay %" />
      <input name="bonus" type="number" value={formData.bonus} onChange={handleChange} placeholder="Bonus" />
      <input name="bankName" value={formData.bankName} onChange={handleChange} placeholder="Bank Name" required />
      <input name="bankAccount" value={formData.bankAccount} onChange={handleChange} placeholder="Bank Account #" required />
      <input name="transitNumber" value={formData.transitNumber} onChange={handleChange} placeholder="Transit Number" maxLength={5} required />
      <input name="institutionNumber" value={formData.institutionNumber} onChange={handleChange} placeholder="Institution #" maxLength={3} required />
      <button type="submit">Add Employee</button>
    </form>
  );
}

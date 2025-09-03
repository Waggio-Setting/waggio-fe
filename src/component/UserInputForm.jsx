import React,{useState} from 'react'

 const initialForm = { //initialForm: 입력값 초기 상태
    // 기본 인적
  firstName: "",
  lastName: "",
  email: "",
  sin: "",
  birthDate: "",     // yyyy-mm-dd
  hireDate: "",      // yyyy-mm-dd

  // 고용/급여 정책
  employmentType: "Full-time", // ['Full-time','Part-time','Contractor']
  payGroup: "bi-weekly",       // ['bi-weekly','monthly']
  payType: "hourly",           // ['hourly','salary']

  hourlyRate: "",              // payType === 'hourly' 일 때 필수
  salary: "",                  // payType === 'salary'  일 때 필수
  vacationPay: 4,              // min 4
  bonus: 0,

  federalTD1: 15492,
  provincialTD1: 12298,

  // 지급 수단
  paymentMethod: "Cheque",     // ['Cheque','Direct Deposit']
  bankName: "",
  bankAccount: "",
  transitNumber: "",
  institutionNumber: "",

  // 주소
  line1: "",
  line2: "",
  city: "",
  province: "ON",
  postal: "",
  country: "CA",
  };


  export default function UserInputForm({ onSubmit }) {
    const [formData, setFormData] = useState(initialForm);
  
    const isDirectDeposit = formData.paymentMethod === "Direct Deposit";
    const isHourly = formData.payType === "hourly";
    const isSalary = formData.payType === "salary";
  
    // 숫자 필드 헬퍼: 빈문자 → "" 유지, 값이 있으면 숫자로
    const coerceNumber = (v) => (v === "" || v === null ? "" : Number(v));
  
    const handleChange = (e) => {
      const { name, value } = e.target;
  
      // 숫자 필드 강제 변환
      const numberFields = new Set([
        "hourlyRate",
        "hoursWorked", // (직원 폼에선 사용 안함. 참고용)
        "salary",
        "vacationPay",
        "bonus",
        "federalTD1",
        "provincialTD1",
        "institutionNumber",
        "transitNumber",
      ]);
  
      setFormData((prev) => ({
        ...prev,
        [name]: numberFields.has(name) ? coerceNumber(value) : value,
      }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
  
      // 간단 유효성(필요시 더 강화 가능)
      if (isHourly && (formData.hourlyRate === "" || Number(formData.hourlyRate) <= 0)) {
        alert("Hourly pay type requires a positive hourlyRate.");
        return;
      }
      if (isSalary && (formData.salary === "" || Number(formData.salary) <= 0)) {
        alert("Salary pay type requires a positive salary.");
        return;
      }
      if (Number(formData.vacationPay) < 4) {
        alert("Vacation Pay must be at least 4%.");
        return;
      }
      if (isDirectDeposit) {
        const bankOk =
          formData.bankName &&
          /^\d{7,12}$/.test(String(formData.bankAccount)) &&
          /^\d{5}$/.test(String(formData.transitNumber)) &&
          /^\d{3}$/.test(String(formData.institutionNumber));
        if (!bankOk) {
          alert("Direct Deposit requires valid bank info:\n- Account 7-12 digits\n- Transit 5 digits\n- Institution 3 digits");
          return;
        }
      }
      // SIN 간단 검증(9자리)
      if (!/^\d{9}$/.test(String(formData.sin))) {
        alert("SIN must be exactly 9 digits.");
        return;
      }
      // 캐나다 우편번호(스키마 정규식과 일치)
      const postalOk = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(formData.postal || "");
      if (!postalOk) {
        alert("Invalid Canadian postal code.");
        return;
      }
  
      // 스키마 구조에 맞춰 payload 구성
      const employeePayload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        sin: String(formData.sin).trim(),
        birthDate: formData.birthDate ? new Date(formData.birthDate) : null,
        hireDate: formData.hireDate ? new Date(formData.hireDate) : null,
  
        employmentType: formData.employmentType, // 'Contractor' 정확히 사용
        payGroup: formData.payGroup,             // 'bi-weekly' | 'monthly'
        payType: formData.payType,               // 'hourly' | 'salary'
  
        hourlyRate: isHourly ? Number(formData.hourlyRate) : undefined,
        salary: isSalary ? Number(formData.salary) : undefined,
        vacationPay: Number(formData.vacationPay),
        bonus: Number(formData.bonus),
  
        federalTD1: Number(formData.federalTD1),
        provincialTD1: Number(formData.provincialTD1),
  
        paymentMethod: formData.paymentMethod,
        bankName: isDirectDeposit ? formData.bankName : undefined,
        bankAccount: isDirectDeposit ? String(formData.bankAccount) : undefined,
        transitNumber: isDirectDeposit ? String(formData.transitNumber) : undefined,
        institutionNumber: isDirectDeposit ? String(formData.institutionNumber) : undefined,
  
        address: {
          line1: formData.line1,
          line2: formData.line2 || "",
          city: formData.city,
          province: formData.province || "ON",
          postal: formData.postal,
          country: formData.country || "CA",
        },
      };
  
      onSubmit(employeePayload);     // 상위로 올려서 /api/employees 등으로 POST
      setFormData(initialForm);      // 초기화
    };
  
    return (
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8, maxWidth: 520 }}>
        <h3>Employee Profile</h3>
  
        {/* 이름/이메일 */}
        <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required />
        <input name="lastName"  value={formData.lastName}  onChange={handleChange} placeholder="Last Name" required />
        <input name="email"     type="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
  
        {/* SIN / 생년 / 입사일 */}
        <input name="sin" value={formData.sin} onChange={handleChange} placeholder="SIN (9 digits)" maxLength={9} required />
        <label>Birth Date</label>
        <input name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} required />
        <label>Hire Date</label>
        <input name="hireDate" type="date" value={formData.hireDate} onChange={handleChange} required />
  
        {/* 고용 형태/급여 주기/급여 타입 */}
        <label>Employment Type</label>
        <select name="employmentType" value={formData.employmentType} onChange={handleChange}>
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Contractor</option>
        </select>
  
        <label>Pay Group</label>
        <select name="payGroup" value={formData.payGroup} onChange={handleChange}>
          <option value="bi-weekly">bi-weekly</option>
          <option value="monthly">monthly</option>
        </select>
  
        <label>Pay Type</label>
        <select name="payType" value={formData.payType} onChange={handleChange}>
          <option value="hourly">hourly</option>
          <option value="salary">salary</option>
        </select>
  
        {/* 시급/연봉 조건부 */}
        {isHourly && (
          <input
            name="hourlyRate"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={formData.hourlyRate}
            onChange={handleChange}
            placeholder="Hourly Rate"
            required
          />
        )}
        {isSalary && (
          <input
            name="salary"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={formData.salary}
            onChange={handleChange}
            placeholder="Salary (annual)"
            required
          />
        )}
  
        {/* 휴가/보너스 */}
        <label>Vacation Pay % (min 4)</label>
        <input name="vacationPay" type="number" min="4" step="0.1" value={formData.vacationPay} onChange={handleChange} />
        <label>Bonus</label>
        <input name="bonus" type="number" min="0" step="0.01" value={formData.bonus} onChange={handleChange} />
  
        {/* TD1 */}
        <label>Federal TD1</label>
        <input name="federalTD1" type="number" min="0" step="1" value={formData.federalTD1} onChange={handleChange} />
        <label>Provincial TD1 (ON)</label>
        <input name="provincialTD1" type="number" min="0" step="1" value={formData.provincialTD1} onChange={handleChange} />
  
        {/* 지급 수단 */}
        <label>Payment Method</label>
        <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
          <option>Cheque</option>
          <option>Direct Deposit</option>
        </select>
  
        {/* Direct Deposit일 때만 노출 */}
        {isDirectDeposit && (
          <>
            <input name="bankName" value={formData.bankName} onChange={handleChange} placeholder="Bank Name" required={isDirectDeposit} />
            <input name="bankAccount" value={formData.bankAccount} onChange={handleChange} placeholder="Bank Account #" required={isDirectDeposit} />
            <input name="transitNumber" value={formData.transitNumber} onChange={handleChange} placeholder="Transit Number (5)" maxLength={5} required={isDirectDeposit} />
            <input name="institutionNumber" value={formData.institutionNumber} onChange={handleChange} placeholder="Institution # (3)" maxLength={3} required={isDirectDeposit} />
          </>
        )}
  
        {/* 주소 */}
        <h4>Address</h4>
        <input name="line1" value={formData.line1} onChange={handleChange} placeholder="Address line 1" required />
        <input name="line2" value={formData.line2} onChange={handleChange} placeholder="Address line 2 (optional)" />
        <input name="city" value={formData.city} onChange={handleChange} placeholder="City" required />
        <input name="province" value={formData.province} onChange={handleChange} placeholder="Province (e.g., ON)" required />
        <input name="postal" value={formData.postal} onChange={handleChange} placeholder="Postal Code (e.g., M5V 2T6)" required />
        <input name="country" value={formData.country} onChange={handleChange} placeholder="Country (e.g., CA)" required />
  
        <button type="submit">Add Employee</button>
      </form>
    );
  }
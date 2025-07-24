export default function refineData(rawData) {
  return rawData.map((item) => ({
    fullName: item.fullName,
    sin: item.sin?.replace(/^\d{3}-\d{3}/, "***-***"), // SIN 마스킹
    payDate: item.payDate,
    employmentType: item.employmentType,
    hourlyRate: parseFloat(item.hourlyRate) || 0,
    hoursWorked: parseFloat(item.hoursWorked) || 0,
    salary: parseFloat(item.salary) || 0,
    vacationPay: parseFloat(item.vacationPay) || 0,
    bonus: parseFloat(item.bonus) || 0,
    bankName: item.bankName,
    bankAccount: item.bankAccount,
    transitNumber: item.transitNumber,
    institutionNumber: item.institutionNumber,
  }));
}

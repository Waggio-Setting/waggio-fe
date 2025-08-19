import React from "react";
import Papa from "papaparse";
import { useState } from "react";
import { useMemo } from "react";

const SYSTEM_FIELDS = [
  "fullName",
  "sin",
  "employmentType",
  "payDate",
  "hourlyRate",
  "hoursWorked",
  "salary",
  "vacationPay",
  "bonus",
  "bankName",
  "bankAccount",
  "transitNumber",
  "institutionNumber",
];
const REQUIRED_FIELDS = ["fullName", "sin", "employmentType", "payDate"];

const CSVUpload = () => {
  const [parsedData, setParsedData] = useState([]);
  const [headers, setHeaders] = useState([]); //csv 파일에서 읽어온 header값
  const [fieldMap, setFieldMap] = useState({}); // 우리 데베랑 매핑한 header값
  const [defaults, setDefaults] = useState({
    employmentType: "", // CSV에 없을 때 전체행에 일괄 적용
    payDate: "", // yyyy-mm-dd
  });
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
          const rows = result.data;

          setParsedData(rows);

          const headers = Object.keys(rows[0] || {}); // (11) 첫 번째 행의 key들 = 원본 CSV 헤더 목록
          setHeaders(headers);
          console.log("header", headers);

          const guess = {};
          headers.forEach((header) => {
            const normalization = header.toLowerCase().replace(/[\s_]/g, "");
            if (normalization.includes("name")) guess[header] = "fullName";
            else if (
              normalization.includes("basesalary") ||
              normalization === "salary"
            )
              guess[header] = "salary";
            else if (normalization.includes("bonus")) guess[header] = "bonus";
            else if (
              normalization.includes("payperiodend") ||
              normalization.includes("paydate")
            )
              guess[header] = "payDate";
            else if (
              normalization.includes("allowance") ||
              normalization.includes("vacation")
            )
              guess[header] = "vacationPay";
            else guess[header] = "";
          });
          setFieldMap(guess);
          console.log("Mapping (guess)", guess);
        },
      });
    };
    reader.readAsText(file);
  };

  const handleMappingChange = (userHeader, selectedHeader) => {
    setFieldMap((prev) => ({ ...prev, [userHeader]: selectedHeader }));
  };

  const selectedTargets = useMemo(
    () => new Set(Object.values(fieldMap).filter(Boolean)),
    [fieldMap]
  );

  const transformRows = () => {
    return parsedData.map((row) => {
      const out = {};
      // 드롭다운 매핑 적용
      for (const [from, to] of Object.entries(fieldMap)) {
        if (to) out[to] = row[from];
      }
      // 기본값(비어 있으면만 덮어쓰기)
      if (!out.employmentType && defaults.employmentType)
        out.employmentType = defaults.employmentType;
      if (!out.payDate && defaults.payDate) out.payDate = defaults.payDate;
      return out;
    });
  };

  const handleApplyMapping = () => {
    const mapped = transformRows();

    // 어떤 시스템 필드들이 매핑됐는지(드롭다운 기준)
    const mappedTargets = new Set(Object.values(fieldMap).filter(Boolean));
    // 필수 충족 여부(기본값으로 보완됐는지도 체크)
    const missing = REQUIRED_FIELDS.filter((f) => {
      if (f === "employmentType")
        return !(mappedTargets.has(f) || !!defaults.employmentType);
      if (f === "payDate") return !(mappedTargets.has(f) || !!defaults.payDate);
      // fullName, sin은 CSV 매핑을 가정(기본값 넣기 부적절)
      return !mappedTargets.has(f);
    });

    if (missing.length) {
      alert(`필수 필드 매핑/기본값 누락: ${missing.join(", ")}`);
      return;
    }

    console.log("Mapped rows:", mapped);
    // 상위로 전달하거나 여기서 바로 POST
    // onMapped가 props로 넘어왔다면:
    // onMapped?.(mapped, { fieldMap, defaults });

    alert(`매핑 완료! ${mapped.length}건 변환됨`);
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      {headers.length > 0 && (
        <>
          <h4>Mapping</h4>
          <div style={{ overflowX: "auto" }}>
            <table border="1" cellPadding="6">
              <thead>
                <tr>
                  {headers.map((header) => (
                    <th>
                      <select
                        value={fieldMap[header] || ""}
                        onChange={(e) =>
                          handleMappingChange(header, e.target.value)
                        }
                      >
                        <option value="">(Ignore)</option>
                        {SYSTEM_FIELDS.map((field) => (
                          <option
                            value={field}
                            disabled={
                              fieldMap[header] !== field &&
                              selectedTargets.has(field)
                            }
                          >
                            {field}
                          </option>
                        ))}
                      </select>
                    </th>
                  ))}
                </tr>
                <tr>
                  {headers.map((header) => (
                    <th>
                      <code>{header}</code>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {parsedData.slice(0, 5).map((row, i) => (
                  <tr>
                    {headers.map((header) => (
                      <td>{String(row[header] ?? "")}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {headers.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <strong>기본값(전체 행에 일괄 적용, 비우면 적용 안 함)</strong>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  marginTop: 8,
                  flexWrap: "wrap",
                }}
              >
                <label>
                  employmentType:&nbsp;
                  <select
                    value={defaults.employmentType}
                    onChange={(e) =>
                      setDefaults((s) => ({
                        ...s,
                        employmentType: e.target.value,
                      }))
                    }
                  >
                    <option value="">(선택 안 함)</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contractor">Contractor</option>
                  </select>
                </label>
                <label>
                  payDate:&nbsp;
                  <input
                    type="date"
                    value={defaults.payDate}
                    onChange={(e) =>
                      setDefaults((s) => ({ ...s, payDate: e.target.value }))
                    }
                  />
                </label>
              </div>
              <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
                ※ <code>sin</code>은 CSV로 매핑하는 걸 권장합니다(개인
                식별값이라 일괄 기본값 부적절).
              </div>
            </div>
          )}
          {headers.length > 0 && (
            <button style={{ marginTop: 12 }} onClick={handleApplyMapping}>
              매핑 적용
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default CSVUpload;

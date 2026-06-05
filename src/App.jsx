import { useState } from "react";
import { jsPDF } from "jspdf";
import"./App.css";

function App() {
  const [name, setName] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [summary, setSummary] = useState("");
  const [department, setDepartment] = useState("");
  const [urgency, setUrgency] = useState("");
  const [risk, setRisk] = useState("");
  const [action, setAction] = useState("");
  const [conditions, setConditions] = useState([]);
  const [severity, setSeverity] = useState(0);
  const [riskLevel, setRiskLevel] = useState("");
  const [totalPatients, setTotalPatients] = useState(0);
  const [emergencyCount, setEmergencyCount] = useState(0);
  const [urgentCount, setUrgentCount] = useState(0);
  const [routineCount, setRoutineCount] = useState(0);
  const [history, setHistory] = useState([]);

  const generateSummary = () => {
    if (symptoms.trim() === "") {
      alert("Please enter symptoms");
      return;
    }

    setTotalPatients((prev) => prev + 1);

    setSummary(`Patient reports: ${symptoms}`);

    const lower = symptoms.toLowerCase();

    if (
      lower.includes("fever") ||
      lower.includes("cough") ||
      lower.includes("cold")
    ) {
      setDepartment("General Medicine");
    } else if (
      lower.includes("skin") ||
      lower.includes("rash") ||
      lower.includes("itching")
    ) {
      setDepartment("Dermatology");
    } else if (
      lower.includes("chest pain") ||
      lower.includes("heart")
    ) {
      setDepartment("Cardiology");
    } else {
      setDepartment("General Checkup");
    }

    if (
      lower.includes("chest pain") ||
      lower.includes("difficulty breathing")
    ) {
      setUrgency("Emergency");
      setEmergencyCount((prev) => prev + 1);
      setRisk("Possible Cardiac Emergency");
      setAction("Seek immediate medical attention");

      setConditions([
      "Cardiac Emergency",
      "Respiratory Distress"
      ]);

      setSeverity(9);
      setRiskLevel("High");
      
    } else if (
      lower.includes("high fever") ||
      lower.includes("severe pain")
    ) {
      setUrgency("Urgent");
      setUrgentCount((prev) => prev + 1);
      setRisk("Moderate Medical Concern");
      setAction("Consult a doctor within 24 hours");

      setConditions([
      "Influenza",
      "Viral Infection",
      "Bacterial Infection"
      ]);

      setSeverity(6);
      setRiskLevel("Moderate");

 } else {
      setUrgency("Routine");
      setRoutineCount((prev) => prev + 1);
      setRisk("Low Risk");
      setAction("Monitor symptoms and follow up if needed");

      setConditions([
      "Common Cold",
      "Seasonal Allergy",
      "Minor Infection"
      ]);

      setSeverity(3);
      setRiskLevel("Low");
  }
  setHistory((prev) => [
   ...prev,
   {
     name,
     department:
      symptoms.toLowerCase().includes("chest pain") ||
      symptoms.toLowerCase().includes("heart")
        ? "Cardiology"
        : symptoms.toLowerCase().includes("skin") ||
          symptoms.toLowerCase().includes("rash")
        ? "Dermatology"
        : "General Medicine",

     urgency:
      symptoms.toLowerCase().includes("chest pain") ||
      symptoms.toLowerCase().includes("difficulty breathing")
        ? "Emergency"
        : symptoms.toLowerCase().includes("high fever") ||
          symptoms.toLowerCase().includes("severe pain")
        ? "Urgent"
        : "Routine",
    },
  ]);
};

  const downloadReport = () => {
   const doc = new jsPDF();

   // ... (lines 130 and 131 remain as: const doc = new jsPDF();)

   // ===== HEADER =====
   doc.setFillColor(220, 240, 255);
   doc.rect(0, 0, 210, 30, "F");

   doc.setFontSize(20);
   // FIX: setTextColor is now a separate, standalone line
   doc.setTextColor(0, 70, 140);
   doc.text("MediBridge AI HOSPITAL", 20, 15);

   doc.setFontSize(11);
   doc.setTextColor(80);
   doc.text("Smart Clinical Triage & Risk Assessment Report", 20, 23);

   // ===== REPORT INFO BOX (Restore the missing Patient Data) =====
   doc.setDrawColor(0);
   doc.rect(15, 40, 180, 50);

   doc.setFontSize(12);
   doc.setTextColor(0);

   // Use the existing scope variables
   doc.text(`Patient Name: ${name || 'N/A'}`, 20, 50);
   doc.text(`Symptoms: ${symptoms || 'N/A'}`, 20, 60);
   doc.text(`Department: ${department}`, 20, 70);
   doc.text(`Report ID: ${Math.floor(Math.random() * 100000)}`, 20, 80);

   // ===== URGENCY HIGHLIGHT BOX =====
   let urgencyColor = [0, 0, 0];

   if (urgency === "High") urgencyColor = [200, 0, 0];
   else if (urgency === "Medium") urgencyColor = [255, 140, 0];
   else urgencyColor = [0, 120, 0];

   doc.setFillColor(...urgencyColor);
   doc.setTextColor(255);
   doc.rect(140, 55, 50, 20, "F");
   doc.text(`Urgency: ${urgency}`, 142, 68);

   // Reset text color for subsequent sections
   doc.setTextColor(0);

   // ===== CLINICAL DETAILS BOX =====
   doc.rect(15, 95, 180, 70);

   // FIX: Restore the missing Risk Level display
   doc.text("Risk Level:", 20, 105);
   doc.text(`${riskLevel}`, 60, 105);

   doc.text("Risk Assessment:", 20, 115);
   // Map 'risk' from original scope to 'riskAssessment' used in styled layout
   doc.text(doc.splitTextToSize(risk, 120), 60, 115);

   doc.text("Recommended Action:", 20, 135);
   // Map 'action' from original scope to 'recommendedAction' used in styled layout
   doc.text(doc.splitTextToSize(action, 120), 60, 135);

   // ===== POSSIBLE CONDITIONS BOX =====
   doc.rect(15, 170, 180, 50);

   doc.setFontSize(12);
   doc.text("Possible Conditions:", 20, 180);

   doc.setFontSize(11);
   doc.text(
     doc.splitTextToSize(conditions.join(", "), 170),
     20,
     190
   );

   // ===== FOOTER =====
   doc.setDrawColor(150);
   doc.line(15, 260, 195, 260);

   doc.setFontSize(9);
   doc.setTextColor(100);

   doc.text("Generated by MediBridge AI System", 20, 270);
   doc.text(
     "Disclaimer: This report is for informational purposes only and not a medical diagnosis.",
      20,
      278
   );

   // Ensure this remains at the very end of the function
   doc.save("MediBridge_Report.pdf");

};

  return (
   <div className="container">
    <div className="header">
      <h1>🏥 MediBridge AI</h1>
      <p>AI-Powered Healthcare Triage & Risk Assessment Platform</p>
    </div>

    <div className="result">
     <h2>📊 Analytics Dashboard</h2>

     <p>Patients Analyzed: {totalPatients}</p>

     <p>🔴 Emergency Cases: {emergencyCount}</p>

     <p>🟠 Urgent Cases: {urgentCount}</p>

     <p>🟢 Routine Cases: {routineCount}</p>
    </div>

    <div className="card">
      <h2>Patient Information</h2>

      <input
        className="input"
        type="text"
        placeholder="Patient Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <textarea
        className="textarea"
        placeholder="Describe symptoms..."
        rows="5"
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
      />

      <button
        className="button"
        onClick={generateSummary}
      >
        Generate Analysis
      </button>

      <button
       className="button"
       onClick={downloadReport}
       style={{ marginLeft: "10px" }}
      >
        Download Report
      </button>
     </div>
     
   <div className="card">
      <h2>📋 Patient History</h2>

      {history.map((patient, index) => (
       <div key={index} className="history-item">
         <strong>👤 {patient.name}</strong>
         <br />
         🏥 {patient.department}
         <br />
         🚨 {patient.urgency}
       </div>
     ))}
    </div>

    <div className="card">
     <p style={{ textAlign: "center" }}>
     Developed by Team VitalSync 🚀
     </p>

     <p
      style={{
      textAlign: "center",
      fontSize: "14px",
      opacity: "0.8",
     }}
     >
     MediBridge AI is designed for preliminary healthcare assistance
     and is not a substitute for professional medical diagnosis.
     </p>
    </div>

    <div className="card">
      <h2>Results</h2>

      <div className="result">
        <strong>Patient:</strong> {name || "Not Provided"}
      </div>

      <div className="result">
        <strong>Summary:</strong> {summary || "No Summary Yet"}
      </div>

      <div className="result">
        <strong>Department:</strong> {department || "Not Assigned"}
      </div>

      <div className="result">
        <strong>Urgency:</strong> {""}
        {urgency === "Emergency"
         ? "🔴 Emergency"
         : urgency === "Urgent"
         ? "🟠 Urgent"
         : urgency === "Routine"
         ? "🟢 Routine"
         : "Not Determined"}
     </div>

      <div className="result">
       <strong>Severity Score:</strong> {severity}/10
      </div>

      <div className="result">
       <strong>Risk Level:</strong>{" "}
       {riskLevel === "High"
       ? "🔴 High"
       : riskLevel === "Moderate"
       ? "🟠 Moderate"
       : riskLevel === "Low"
       ? "🟢 Low"
       : "Not Available"}
     </div>

      <div className="result">
       <strong>Risk Assessment:</strong> {risk || "Not Available"}
      </div>

      <div className="result">
       <strong>Recommended Action:</strong> {action || "Not Available"}
      </div>

      <div className="result">
       <strong>Possible Conditions:</strong>

       <ul>
         {conditions.map((condition, index) => (
        <li key={index}>{condition}</li>
         ))}
       </ul>

       <small>
        This is not a medical diagnosis.
       </small>
     </div>
   </div>
 </div>
);
}

export default App;
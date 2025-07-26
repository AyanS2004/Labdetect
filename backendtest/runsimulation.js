// Replace with your ngrok backend URL
const backendUrl = "https://4ac26a29eb3b.ngrok-free.app/run_test";

// The payload with MITRE technique ID
const payload = {
  technique_id: "T1059.003"  // Example: Command and Scripting Interpreter
};

// Send POST request to FastAPI backend
fetch(backendUrl, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(payload)
})
.then(response => {
  if (!response.ok) {
    throw new Error("Network response was not OK");
  }
  return response.json();
})
.then(data => {
  console.log("✅ Response from backend:", data);
  alert("Simulation Triggered: " + JSON.stringify(data));
})
.catch(error => {
  console.error("❌ Error triggering simulation:", error);
  alert("Failed to trigger simulation: " + error.message);
});
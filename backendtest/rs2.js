async function runSimulation(techniqueId) {
    try {
      const response = await fetch("https://d9d2048e7cce.ngrok-free.app/run_test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ technique_id: techniqueId })
      });
  
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Simulation Output:", data);
    } catch (error) {
      console.error("Error during simulation:", error.message);
    }
  }
  
  // 🔁 Call the function with a technique ID
  runSimulation("T1059.003");
  
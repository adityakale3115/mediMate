export async function checkSymptoms(symptoms) {
  try {
    const res = await fetch("http://localhost:5000/api/symptoms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptoms }),
    });
    return await res.json();
  } catch (error) {
    console.error("Symptom check failed:", error);
    return { diagnoses: ["Unable to fetch suggestions"] };
  }
}

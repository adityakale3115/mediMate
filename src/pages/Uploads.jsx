import React, { useState } from "react";
import { storage, db } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const Uploads = () => {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const extractTextFromPDF = async (file) => {
    const pdfjsLib = await import("pdfjs-dist/build/pdf");
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        const typedArray = new Uint8Array(reader.result);
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const text = content.items.map(item => item.str).join(" ");
          fullText += text + "\n";
        }
        resolve(fullText);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const extractTextFromImage = async (file) => {
    const Tesseract = await import("tesseract.js");
    const { data: { text } } = await Tesseract.recognize(file, 'eng');
    return text;
  };

  const sendMessageToMedibot = async (extractedText, fileType) => {
    const prefix = fileType === "pdf"
      ? "A user uploaded a medical report or diagnostic result."
      : "A user uploaded a handwritten or printed medical prescription image.";

    const prompt = `
You are Medibot, a medical assistant for users in India. ${prefix}
Based on the extracted content below, do the following:

- Summarize the health condition if identifiable.
- Explain what each medicine or instruction is likely for.
- Suggest precautions or advise follow-up with a doctor.
- Keep your response under 6 lines, in simple language.

Prescription or Report:
${extractedText}
    `.trim();

    const response = await fetch("http://localhost:5000/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: prompt }),
    });

    const data = await response.json();
    return data.response || "Unable to get a response from Medibot.";
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file.");
    setLoading(true);

    try {
      const storageRef = ref(storage, `uploads/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      let extractedText = "";
      let medibotSummary = "";

      if (file.type === "application/pdf") {
        extractedText = await extractTextFromPDF(file);
        medibotSummary = await sendMessageToMedibot(extractedText, "pdf");
      } else if (file.type.startsWith("image/")) {
        extractedText = await extractTextFromImage(file);
        medibotSummary = await sendMessageToMedibot(extractedText, "image");
      } else {
        medibotSummary = "Unsupported file type. Please upload a PDF or image.";
      }

      setSummary(medibotSummary);

      await addDoc(collection(db, "uploads"), {
        fileName: file.name,
        fileUrl: url,
        summary: medibotSummary,
        uploadedAt: serverTimestamp()
      });

    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed!");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Upload Medical Report or Prescription</h2>
      <input type="file" accept=".pdf,image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading} style={{ marginTop: "10px" }}>
        {loading ? "Processing..." : "Upload & Get Suggestions"}
      </button>

      {summary && (
        <div style={{ marginTop: "20px", background: "#f9f9f9", padding: "15px", borderRadius: "8px" }}>
          <h3>Medibot’s Suggestions:</h3>
          <p style={{ whiteSpace: "pre-wrap" }}>{summary}</p>
        </div>
      )}
    </div>
  );
};

export default Uploads;

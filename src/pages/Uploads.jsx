import React, { useState, useEffect } from "react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "firebase/storage";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  where
} from "firebase/firestore";
import { storage, db, auth } from "../firebase";
import "../styles/main.css";

export default function Uploads() {
  const [file, setFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState(""); // success | error
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      if (u) {
        fetchUploadedFiles(u.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const showPopup = (message, type = "success") => {
    setPopupMessage(message);
    setPopupType(type);
    setTimeout(() => {
      setPopupMessage("");
    }, 3000);
  };

  const fetchUploadedFiles = async (uid) => {
    const q = query(
      collection(db, "uploads"),
      where("uid", "==", uid),
      orderBy("timestamp", "desc")
    );
    const snapshot = await getDocs(q);
    const files = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    }));
    setUploadedFiles(files);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setUploadStatus("");

    if (selectedFile) {
      const fileType = selectedFile.type;
      if (fileType.startsWith("image/") || fileType === "application/pdf") {
        setPreviewURL(URL.createObjectURL(selectedFile));
      } else {
        setPreviewURL(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!user) {
      showPopup("❗ Please log in to upload files.", "error");
      return;
    }

    if (!file) {
      showPopup("❗ Please choose a file first.", "error");
      return;
    }

    const filename = `${Date.now()}-${file.name}`;
    const storageRef = ref(storage, `uploads/${user.uid}/${filename}`);

    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      await addDoc(collection(db, "uploads"), {
        uid: user.uid,
        userEmail: user.email,
        userName: user.displayName || "",
        name: file.name,
        type: file.type,
        url: downloadURL,
        storagePath: `uploads/${user.uid}/${filename}`,
        timestamp: new Date()
      });

      showPopup("✅ File uploaded successfully!");
      setFile(null);
      setPreviewURL(null);
      fetchUploadedFiles(user.uid);
    } catch (error) {
      console.error("Upload failed:", error);
      showPopup("❌ Upload failed.", "error");
    }
  };

  const handleDelete = async (fileId, storagePath) => {
    try {
      const fileRef = ref(storage, storagePath);
      await deleteObject(fileRef);
      await deleteDoc(doc(db, "uploads", fileId));
      fetchUploadedFiles(user.uid);
      showPopup("🗑️ File deleted successfully.");
    } catch (error) {
      console.error("Delete failed:", error);
      showPopup("❌ Failed to delete file.", "error");
    }
  };

  return (
    <div className="upload-container">
      {/* Top popup */}
      {popupMessage && (
        <div className={`popup-bar ${popupType}`}>
          {popupMessage}
        </div>
      )}

      <h2 className="upload-heading">Upload Your Medical Reports</h2>

      {!user ? (
        <p className="upload-subtext">🔒 Please log in to upload and manage files.</p>
      ) : (
        <>
          <p className="upload-subtext">
            Upload prescriptions, reports, or lab files for doctor review and faster check-ins.
          </p>

          <label htmlFor="file-upload" className="upload-label">
            Choose File
            <input
              type="file"
              id="file-upload"
              className="file-input"
              onChange={handleFileChange}
            />
          </label>

          {file && (
            <p className="selected-file">
              📎 Selected file: <strong>{file.name}</strong>
            </p>
          )}

          {previewURL && (
            <div className="file-preview">
              {file.type.startsWith("image/") ? (
                <img src={previewURL} alt="preview" className="preview-image" />
              ) : file.type === "application/pdf" ? (
                <iframe
                  src={previewURL}
                  title="PDF Preview"
                  className="preview-pdf"
                  frameBorder="0"
                ></iframe>
              ) : null}
            </div>
          )}

          <button onClick={handleUpload} className="upload-button">Upload</button>
          <div className="upload-note">Accepted formats: PDF, JPG, PNG, DOCX</div>
        </>
      )}

      {user && (
        <>
          <h3 className="uploaded-files-title">🗂️ Your Uploads</h3>
          <ul className="uploaded-files-list">
            {uploadedFiles.map((f) => (
              <li key={f.id} className="uploaded-file-item">
                <a href={f.url} target="_blank" rel="noreferrer">{f.name}</a>
                <button
                  onClick={() => handleDelete(f.id, f.storagePath)}
                  className="delete-button"
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

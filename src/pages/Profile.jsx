import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import "../styles/profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [medicalDetails, setMedicalDetails] = useState({
    age: "",
    gender: "",
    bloodGroup: "",
    allergies: "",
    medications: "",
    conditions: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      fetchMedicalData(currentUser.uid);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchMedicalData = async (uid) => {
    try {
      const docRef = doc(db, "users", uid, "profileDetails", "basic");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setMedicalDetails(docSnap.data());
        setHasData(true);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching medical details:", error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setMedicalDetails({ ...medicalDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      const docRef = doc(db, "users", user.uid, "profileDetails", "basic");
      await setDoc(docRef, medicalDetails);
      setSubmitted(true);
      setHasData(true);
      setEditMode(false);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error("Error saving medical details:", error);
    }
  };

  if (loading) return <div className="profile-loading">Loading...</div>;
  if (!user) return <div className="profile-error">Please log in to view your profile.</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>User Profile</h2>
        <div className="profile-userinfo">
          {user.photoURL && (
            <img src={user.photoURL} alt="Profile" className="profile-avatar" />
          )}
          <div className="profile-basic">
            <p><strong>Name:</strong> {user.displayName || "N/A"}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        </div>
        <hr />

        {hasData && !editMode ? (
          <>
            <h3>Medical Information</h3>
            <div className="profile-medical-display">
              <p><strong>Age:</strong> {medicalDetails.age}</p>
              <p><strong>Gender:</strong> {medicalDetails.gender}</p>
              <p><strong>Blood Group:</strong> {medicalDetails.bloodGroup}</p>
              <p><strong>Allergies:</strong> {medicalDetails.allergies || "None"}</p>
              <p><strong>Medications:</strong> {medicalDetails.medications || "None"}</p>
              <p><strong>Conditions:</strong> {medicalDetails.conditions || "None"}</p>
              <button className="profile-button" onClick={() => setEditMode(true)}>Edit Medical Info</button>
            </div>
          </>
        ) : (
          <>
            <h3>{hasData ? "Edit Medical Information" : "Add Medical Information"}</h3>
            <form onSubmit={handleSubmit} className="profile-form">
              <label>Age</label>
              <input type="number" name="age" value={medicalDetails.age} onChange={handleChange} required />

              <label>Gender</label>
              <select name="gender" value={medicalDetails.gender} onChange={handleChange} required>
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>

              <label>Blood Group</label>
              <input type="text" name="bloodGroup" value={medicalDetails.bloodGroup} onChange={handleChange} required />

              <label>Allergies</label>
              <input type="text" name="allergies" value={medicalDetails.allergies} onChange={handleChange} />

              <label>Current Medications</label>
              <input type="text" name="medications" value={medicalDetails.medications} onChange={handleChange} />

              <label>Existing Conditions</label>
              <input type="text" name="conditions" value={medicalDetails.conditions} onChange={handleChange} />

              <div className="profile-buttons">
                <button type="submit" className="profile-button">Save</button>
                {hasData && (
                  <button type="button" className="profile-button cancel" onClick={() => setEditMode(false)}>Cancel</button>
                )}
              </div>
              {submitted && <p className="success-message">✅ Details saved successfully!</p>}
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;

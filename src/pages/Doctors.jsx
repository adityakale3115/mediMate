import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, doc, addDoc, getDoc, query, where } from "firebase/firestore";
import "../styles/doctors.css";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUserId(user ? user.uid : null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "doctors"));
        const doctorsData = await Promise.all(
          querySnapshot.docs.map(async (doctorDoc) => {
            const doctor = doctorDoc.data();
            doctor.id = doctorDoc.id;

            const appointmentsRef = collection(db, "doctors", doctorDoc.id, "appointments");
            const appointmentsSnap = await getDocs(appointmentsRef);

            const bookedSlotInfo = appointmentsSnap.docs
              .filter(doc => ["accepted", "pending"].includes(doc.data().status))
              .map(doc => ({
                slot: doc.data().slot,
                status: doc.data().status,
                userId: doc.data().userId
              }));

            return {
              ...doctor,
              bookedSlotInfo,
            };
          })
        );
        setDoctors(doctorsData);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const requestSlot = async (doctorId, slot) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please login to book a slot.");
      return;
    }

    const appointmentsRef = collection(db, "doctors", doctorId, "appointments");

    try {
      const existing = await getDocs(
        query(appointmentsRef, where("userId", "==", user.uid), where("slot", "==", slot))
      );
      if (!existing.empty) {
        alert("You’ve already requested this slot.");
        return;
      }

      await addDoc(appointmentsRef, {
        userId: user.uid,
        slot,
        status: "pending",
        requestedAt: new Date()
      });

      alert("Slot requested successfully!");
    } catch (err) {
      console.error("Error requesting slot:", err);
      alert("Failed to request slot.");
    }
  };

  const getSlotStatus = (slot, bookedSlotInfo) => {
    const slotEntry = bookedSlotInfo.find(b => b.slot === slot);
    if (!slotEntry) return "available";
    if (slotEntry.status === "accepted") {
      return slotEntry.userId === currentUserId ? "confirmed" : "booked";
    }
    return "booked"; // for pending
  };

  return (
    <div className="doctors-container">
      <h2>Available Doctors</h2>
      {loading ? (
        <p>Loading doctors...</p>
      ) : doctors.length === 0 ? (
        <p>No doctors available right now.</p>
      ) : (
        <div className="doctor-list">
          {doctors.map((doc, idx) => (
            <div key={idx} className="doctor-card">
              <h3>{doc.name}</h3>
              <p><strong>Email:</strong> {doc.email}</p>
              <p><strong>Specialization:</strong> {doc.specialization}</p>

              <div>
                <strong>Available Slots:</strong>
                <ul>
                  {doc.slots && doc.slots.length > 0 ? (
                    doc.slots.map((slot, i) => {
                      const status = getSlotStatus(slot, doc.bookedSlotInfo);
                      return (
                        <li key={i}>
                          {slot}
                          {status === "confirmed" ? (
                            <span style={{ color: "green", marginLeft: "1rem" }}>Confirmed ✅</span>
                          ) : status === "booked" ? (
                            <span style={{ color: "gray", marginLeft: "1rem" }}>Booked ❌</span>
                          ) : (
                            <button
                              style={{ marginLeft: "1rem" }}
                              onClick={() => requestSlot(doc.id, slot)}
                            >
                              Request Slot
                            </button>
                          )}
                        </li>
                      );
                    })
                  ) : (
                    <li>No slots listed.</li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

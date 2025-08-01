# 🧠 MediMate.Ai

Your personal AI-powered healthcare companion.

MediMate is a multi-platform health assistant that connects patients with doctors,  
provides instant medical advice through a chatbot, and helps in emergencies with  
one-tap alerts to nearby ambulances or nurses.

---

## 📦 Features

- ✅ Real-time available doctors listing  
- ✅ Emergency Help Request System  
- ✅ AI ChatBot (FAQ-based or LLM-integrated)  
- ✅ Firebase Authentication (Google & Email/Password)  
- ✅ React-based Web Admin Portal  
- ✅ Native Android App for Patients  
- ✅ Firestore as primary database  


---

## 🛠 Tech Stack

| Layer         | Technologies                         |
|---------------|--------------------------------------|
| Frontend      | ReactJS, Android (Java)              |
| Backend       | Firebase (Firestore, Auth, Hosting)  |
| AI Chatbot    | Predefined QnA / Ollama (Offline LLM)|
| Authentication| Firebase Auth (Google, Email/Pass)   |
| Hosting       | Firebase Hosting                     |

---

## 🔧 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project: `MediMate`
3. Enable the following:
   - Firestore Database
   - Firebase Authentication (Google, Email/Password)
   - Firebase Hosting
4. Add a Web App:
   - Copy the config and paste it into `client/src/firebase.js`
5. Add an Android App:
   - Use a package name like `com.medimate.patient`
   - Download `google-services.json` and place it in `mobile/app/`

---

## 🚀 Run Locally

### Web App (React)

      ```
      cd client
      npm install
      npm start


🤖 Chatbot Basic Flow
Suggested Prompts:

"What is the normal body temperature?"

"Can I take paracetamol and ibuprofen together?"

"Symptoms of dengue?"

Response Logic:

If the question matches predefined keywords → return direct answer

Otherwise → fallback: "Please consult a doctor."

Advanced (Offline LLM):

Use Ollama with MiniLM / Mistral

Host the model locally on CPU

---



🔐 Security
Firestore access rules for role-based data access

Input validation on chatbot

No sensitive info stored in client

Secure Google Sign-In via Firebase

📅 Future Enhancements
🎙️ Voice-based interaction (speech-to-text)

📄 OCR for medical prescriptions

🗺️ Nearby clinic/hospital map integration

📆 Doctor appointment booking system

🔔 Push notifications for updates/emergencies

---

## 👨‍💻 Team

👤 Aditya Kale – Full Stack Developer & Architect

👤 Samiksha Pawar – Web Developer

👤 Poorva Sonawane – Android Developer

👤 Riya Somani – Android Developer

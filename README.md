# 🧠 MediMate.Ai

Your personal AI-powered healthcare companion.

MediMate is a multi-platform health assistant that connects patients with doctors,
provides instant medical advice through a chatbot, and helps in emergencies with
one-tap alerts to nearby ambulances or nurses.

─────────────────────────────────────────────────────────────
📦 FEATURES
─────────────────────────────────────────────────────────────
✅ Real-time available doctors listing
✅ Emergency Help Request System
✅ AI ChatBot (FAQ-based or LLM-integrated)
✅ Firebase Authentication (Google & Email/Password)
✅ React-based Web Admin Portal
✅ Native Android App for Patients
✅ Firestore as primary database

─────────────────────────────────────────────────────────────
📁 PROJECT STRUCTURE
─────────────────────────────────────────────────────────────
medimate/
├── client/                 → ReactJS Web App (Doctors/Admin)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── firebase.js
│   │   └── App.js
│   └── public/
│
├── mobile/                 → Android App (Java)
│   ├── app/
│   ├── java/
│   └── google-services.json
│
├── functions/              → Firebase Functions (optional)
├── firestore.rules         → Firebase DB Rules
└── README.md

─────────────────────────────────────────────────────────────
🛠 TECH STACK
─────────────────────────────────────────────────────────────
Frontend      : ReactJS, Android (Java)
Backend       : Firebase (Firestore, Auth, Hosting)
AI Chatbot    : Predefined QnA / Ollama (offline LLM)
Authentication: Firebase Auth (Google, Email/Pass)
Hosting       : Firebase Hosting (Web App)

─────────────────────────────────────────────────────────────
🔧 FIREBASE SETUP
─────────────────────────────────────────────────────────────
1. Go to https://console.firebase.google.com/
2. Create new project: "MediMate"
3. Enable:
   → Firestore
   → Firebase Auth (Email, Google)
   → Firebase Hosting
4. Add Web App:
   → Get Config & paste in client/src/firebase.js
5. Add Android App:
   → Package name (e.g., com.medimate.patient)
   → Download google-services.json & place in mobile/app/

─────────────────────────────────────────────────────────────
🚀 RUN LOCALLY
─────────────────────────────────────────────────────────────

# Run Web App (React)
$ cd client
$ npm install
$ npm start

# Run Android App
1. Open Android Studio
2. Open 'mobile/' project
3. Sync Gradle & Run on emulator/device

─────────────────────────────────────────────────────────────
🤖 CHATBOT BASIC FLOW (Suggestion-Based)
─────────────────────────────────────────────────────────────
Suggested Prompts:
  - "What is the normal body temperature?"
  - "Can I take paracetamol and ibuprofen together?"
  - "Symptoms of dengue?"

Response logic:
  → If question matches predefined keywords → show answer
  → Else fallback to default: "Please consult a doctor."

Advanced Option (Offline LLM):
  → Use Ollama + MiniLM/Mistral
  → Run backend inference locally

─────────────────────────────────────────────────────────────
🌟 DEMO ACCOUNTS (Optional)
─────────────────────────────────────────────────────────────
# Web (Doctor/Admin)
Email   : demo@medimate.com
Password: medimate123

# Android (Patient)
Email   : patient@medimate.com
Password: med1234

─────────────────────────────────────────────────────────────
🔐 SECURITY
─────────────────────────────────────────────────────────────
- Firebase Firestore rules
- Input validation on chatbot
- Auth role-based access control (doctor, patient, admin)

─────────────────────────────────────────────────────────────
📅 FUTURE ENHANCEMENTS
─────────────────────────────────────────────────────────────
- Voice interaction (speech-to-text)
- OCR for prescriptions
- Map-based nearest clinic display
- Doctor appointment booking system
- Push notifications for chat/emergency updates

─────────────────────────────────────────────────────────────
👨‍💻 TEAM
─────────────────────────────────────────────────────────────
👤 Aditya Kale – Full Stack Developer & Architect
👤 Samiksha Pawar – Web Developer
👤 Poorva Sonawane – Android Developer
👤 Riya Somani – Android Developer


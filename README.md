# MediMate.Ai 🩺

**MediMate.Ai** is a smart medical assistant web platform designed to simplify health data handling, allow users to upload reports, and get intelligent insights with the help of an AI-powered chatbot.

This is **Phase 1** of the project, focused on frontend development using **React**, with integration of **Firebase** and **AI-based features**.

---

## 🚀 Live Features (Phase 1 Complete)

### ✅ Core Functionalities
- 🏠 **Home Page** with welcome banner and navigation
- 🔐 **Authentication (Firebase)**: Email/password login, logout, and protected routes
- 📄 **Upload Medical Reports** with support for:
  - All file types (.pdf, .docx, .jpg, .png, etc.)
  - Real-time upload to **Firebase Storage**
  - Automatic summary input box for uploaded documents
  - Storage of metadata (URL, summary, timestamp) in **Firebase Firestore**
- 🧾 **Uploads Page**:
  - Lists all uploaded files
  - Shows summary and download links
- 💬 **AI ChatBot (MediBot)**:
  - React-based medical chatbot UI
  - AI-backed response system via backend
  - Health-related suggestions (e.g., "symptoms of diabetes", "dosage of amoxicillin")
  - Typewriter-style typing animation
- 🌐 **Navigation** using `React Router` for seamless routing
- 📌 **Sticky Footer** with contact info and useful links

---

## 🧠 Tech Stack

- **Frontend**: React (Create React App)
- **State**: React Hooks
- **Styling**: CSS
- **Auth & DB**: Firebase Authentication, Firebase Firestore, Firebase Storage
- **Chatbot Backend**: Express + Python API (hosted on Docker/EC2)
- **Deployment**: `npm run build` ready

---

## 📷 Preview

![MediMate UI](./screenshots/homepage.png)

---

## 🛠 Getting Started

### Clone & Setup

    ```
    git clone https://github.com/your-username/MediMate.Ai.git
    cd MediMate.Ai
    npm install


Start Development Server
    
    npm start

App will run on http://localhost:3000

      ```
    import { initializeApp } from 'firebase/app';
    import { getStorage } from 'firebase/storage';
    import { getFirestore } from 'firebase/firestore';
    import { getAuth } from 'firebase/auth';

    const firebaseConfig = {
      apiKey: "...",
      authDomain: "...",
      projectId: "...",
      storageBucket: "...",
      messagingSenderId: "...",
      appId: "..."
    };

    const app = initializeApp(firebaseConfig);
    export const storage = getStorage(app);
    export const db = getFirestore(app);
    export const auth = getAuth(app);


### 💡 Coming Soon (Phase 2)
🧠 Offline-compatible AI summary generation

📊 Health dashboard (PDF analysis, graphs, trends)

🧬 Disease prediction module

🔒 Role-based dashboard for doctors & patients

📱 Mobile-friendly PWA version

🤝 Contributors
Aditya Kale — Frontend, Firebase, AI Integration
Poorva Sonawanne - Backend And AIML
Riya Somani - Backend And AIML
Samiksha Pawar - Frontend, Firebase, AI Integration

Special thanks to: OpenAI, Firebase, React, Node.js



💬 Contact
Got questions or feedback? Reach us at: aditya.kale23@vit.edu


---

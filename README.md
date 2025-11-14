# 🌟 StorePulse – Intelligent Store Rating & Review Management Platform

StorePulse is a modern and intelligent platform designed to streamline store reviews, analyze customer sentiment, and empower businesses with real-time insights. With a clean UI and robust backend architecture, StorePulse helps brands monitor performance and enhance customer experience effortlessly.

---

## 🚀 Features

### 🛒 Customer-Facing
- ⭐ Submit store ratings and detailed feedback  
- 📱 Simple, clean, and responsive UI  
- ⚡ Instant validation and fast performance  

### 🛠️ Admin Dashboard
- 🔐 Secure authentication  
- 📊 Real-time review and rating management  
- 🎯 AI-powered insights and sentiment analysis  
- 🔎 Advanced filtering and search  

### 🤖 AI Engine
- 📝 Sentiment analysis of every review  
- 📈 Summary generation  
- 🛡️ Detect unusual or biased review patterns  

### 🧱 Backend
- Node.js + Express  
- Sequelize ORM  
- JWT Auth  
- Centralized error handling  

---

## 🧰 Tech Stack

### 🎨 Frontend
- React.js  
- Tailwind CSS / Material UI  
- Axios  
- React Router DOM  
- Framer Motion  

### ⚙️ Backend
- Node.js / Express  
- Sequelize ORM  
- PostgreSQL / MySQL / MongoDB  
- JWT  
- dotenv  

---

## 📁 Project Structure

```
StorePulse/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── config/
│   ├── server.js / app.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation & Setup

### ▶️ Frontend Setup
```
cd frontend
npm install
npm run dev
```

### ▶️ Backend Setup
```
cd backend
npm install
npm start
```

### 🔑 Environment Variables
Create a `.env` file:

```
PORT=4000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=store_rating_system
DB_USER=root
DB_PASS=
JWT_SECRET=supersecret_jwt_key
SALT_ROUNDS=10
```

---

## 🔐 Authentication Flow
- User logs in with email & password  
- Backend returns a JWT token  
- Token is stored securely  
- Protected routes require token verification  

---

## 🤖 AI Review Processing
- Classifies reviews as positive, negative, or neutral  
- Generates short performance summaries  
- Detects unusual rating patterns  

---

## 🧪 Testing
```
npm test
```

---

## 🖼️ Snapshots (Screenshots)

Add your project screenshots here:

### 🏠 Home Page  
<img width="1919" height="944" alt="image" src="https://github.com/user-attachments/assets/ac3ed68e-3d43-41ff-bb3d-2c7e1252d5a7" />


### 📊 Admin Dashboard  
<img width="1915" height="951" alt="image" src="https://github.com/user-attachments/assets/e36079b0-a97f-4e65-ab24-4204e5be8307" />


### 📝User DashBoard
<img width="1915" height="938" alt="image" src="https://github.com/user-attachments/assets/d007d9b0-2392-42b7-a3c8-414df4b08ecb" />




---

## 🤝 Contributing
Feel free to submit issues or pull requests to improve the platform.

---

## 📄 License
MIT License  

---

## 📬 Contact
**Developer:** Kalpesh Mahajan  
📧 Email: *kalpeshmahajan325@gmail.com*  

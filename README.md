🛡️ SMS Shield – Anti SMS Bomber Protection

SMS Shield is a secure full-stack web application built to protect users' phone numbers from SMS bombing attacks. It uses a secure Express.js backend with rate limiting and stores data in MongoDB Atlas. The frontend is clean, responsive, and written in vanilla HTML, CSS, and JavaScript.

🚀 Built with ❤️ by aft0b

-----------------------------
📸 Project Preview


-----------------------------
🧩 Features

✅ Protects users from SMS bombers  
✅ Prevents repeated requests using rate limiting  
✅ MongoDB stores only verified entries  
✅ Helmet secures HTTP headers  
✅ Clean and easy frontend

-----------------------------
🧱 Tech Stack

Frontend: HTML, CSS, JavaScript  
Backend: Node.js, Express.js  
Database: MongoDB Atlas  
Security: express-rate-limit, helmet, dotenv  
Hosting: GitHub Pages / Render

-----------------------------
📂 Folder Structure

sms-shield/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── .env
├── .gitignore
└── README.md

-----------------------------
⚙️ How to Run Locally

1. Clone the repo:
   git clone https://github.com/aft0b/sms-shield.git
   cd sms-shield/backend

2. Install dependencies:
   npm install

3. Create a .env file with:
   PORT=5000  
   MONGO_URI=your_mongodb_atlas_connection_string

4. Start the server:
   npx nodemon server.js

5. Open frontend/index.html in browser or use Live Server in VS Code

-----------------------------
🌍 Live Hosting (Optional)

Frontend: https://aft0b.github.io/sms-shield  
Backend: https://sms-shield-backend.onrender.com

-----------------------------
💡 Future Ideas

- OTP verification system  
- Admin dashboard for logs  
- SMS gateway integration  
- Email alert on attacks

-----------------------------
📣 Credits

- Node.js
- Express.js
- MongoDB Atlas
- Helmet
- dotenv

-----------------------------
⭐️ Show Some Love

If you liked this project, please ⭐️ star the repo.  
Follow me on GitHub: https://github.com/aft0b  
Connect on LinkedIn: (Add your LinkedIn link)

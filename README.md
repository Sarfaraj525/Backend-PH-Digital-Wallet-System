LIVE LINK: https://backend-ph-digital-wallet-system.vercel.app/

📮 API Endpoints Summary--------------------------------

Base URL: http://localhost:5000/api/v1

✅ Auth Endpoints
Method	   Endpoint	                   Description
POST	  /auth/register	          -Register as user/agent
POST	  /auth/login	              -Login and get JWT
POST      /auth/refresh-token         -New access token or refresh token

👤 User Endpoints
🔐 Requires role: User

Method	Endpoint	                Description
POST    /user/register            -Initial Registration
PATCH   /user/:userID             -Update a user
GET     /user/all-users           -Initial all users

wallet related with user...........

POST	  /wallet/me/add-money	      Add money to own wallet
POST      /wallet/:userID             -add money
POST	  /wallet/me/withdraw 	      -Withdraw from wallet
POST	  /wallet/me/send-money	      -Send money to another user
GET	      /wallet/me	              -View own wallet

Transactions History................

GET     /wallet/my-transactions    -get all own transactions history

🧑‍💼 Agent Endpoints
🔐 Requires role: Agent

Method	    Endpoint	                      Description
POST	    /transaction/cash-in	      -Cash-in to user wallet
POST	    /transaction/cash-out	      -Cash-out from user wallet


🛠 Admin Endpoints
🔐 Requires role: Admin

Method	Endpoint	                          Description
GET	    /admin/users	                      -View all users and agents
GET	    /admin/wallets	                      -View all wallets
GET	    /admin/transactions	                  -View all transactions
PATCH	 /admin/wallets/block/:walletID	      -Block a wallet
PATCH	 /admin/wallets/unblock/:walletID	  -Unblock a wallet
PATCH	 /admin/agents/approve/:agentId	      -Approve an agent
PATCH	 /admin/agents/suspend/:agentId	      -Suspend an agent



# 💸 Digital Wallet System API

A secure, modular, role-based backend API for a digital wallet system — inspired by platforms like **Bkash** or **Nagad**. Users can manage their wallets, agents can perform cash-in/out operations, and admins have full system control.

---

## 📌 Project Overview

This project implements a complete backend system for a digital wallet application. It supports:

- Secure user registration and login with JWT authentication.
- Role-based access control (Admin, User, Agent).
- Wallet creation and management.
- Core financial operations (add money, withdraw, send, cash-in, cash-out).
- Admin control over users, agents, wallets, and transactions.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access (User, Agent, Admin)
- Secure password hashing with bcrypt

### 👤 User
- Auto wallet creation (initial balance: ৳50)
- Add money, withdraw money, send money
- View personal wallet and transaction history

### 🧑‍💼 Agent
- Cash-in (add money to users)
- Cash-out (withdraw from users)
- View own transaction history (commission optional)

### 🛠️ Admin
- View all users, agents, wallets, transactions
- Block/unblock wallets
- Approve/suspend agents

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Language**: TypeScript
- **Security**: JWT, bcrypt
- **Tools**: Postman, Zod (optional), Dotenv, ts-node-dev

---

## ⚙️ Setup & Installation

1. **Clone the repository**
  
Install dependencies

npm install -D typescript
tsc --init
npm i express mongoose zod jsonwebtoken cors dotenv
npm i -D ts-node-dev @types/express @types/cors @types/dotenv @types/jsonwebtoken
Setup environment variables

Create a .env file with:

PORT=5000
DB_URL=your_mongodb_connection_url
JWT_SECRET=your_jwt_secret
Run the project in dev mode

TERMINAL:
npm run dev
(Optional) Build for production

npm run build


🧪 Testing (Postman)

Use the /auth/login endpoint to get a JWT.

Use the JWT in Authorization: Bearer <token> header to access protected routes.

📁 Project Structure

src/
├── app.ts
├── server.ts
├── config/
├── modules/
│   ├── auth/
│   ├── user/
│   ├── wallet/
│   ├── transaction/
│   └── admin/
├── middlewares/
├── utils/


🧑‍💻 Author
Sarfaraj Nawaz Chowdhury
Digital Wallet System API — Backend Developer
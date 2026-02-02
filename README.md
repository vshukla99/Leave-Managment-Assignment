# Leave Management System

A full‑stack **Leave Management System** built with **Node.js, Express, Prisma, MySQL** on the backend and **React + TypeScript + Vite** on the frontend.

---

## 🧩 Tech Stack

### Backend

* Node.js
* Express.js
* TypeScript
* Prisma ORM
* MySQL
* JWT Authentication
* Rate Limiter
* Cron Jobs

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router
* Axios

---

## 📂 Project Structure

```
backend/
frontend/
```

---

## ⚙️ Backend Setup

### 1️⃣ Install dependencies

```bash
cd backend
npm install
```

### 2️⃣ Environment Variables

Create a `.env` file inside `backend/`:

```
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/leave_management"
JWT_SECRET=your_jwt_secret
```

---

### 3️⃣ Prisma Setup

```bash
npx prisma generate
npx prisma migrate dev
```

(Optional) Open Prisma Studio:

```bash
npx prisma studio
```

---

### 4️⃣ Run Backend Server

```bash
npm start
```

Backend will run on:

```
http://localhost:4000
```

---

## 📑 API Documentation (Swagger)

Swagger UI is available once the backend is running.

Open in browser:

```
http://localhost:4000/api/docs/
```

---

## 🔐 Admin Setup (Important)

After user registration, **all users are created with role `USER` by default**.

To make an **ADMIN**:

1. Open **Prisma Studio** or your database
2. Update the user role manually:

```
role = ADMIN
```

> This admin user will be able to manage users and leaves.

---

## 🛠 Backend Features

* ✅ User Authentication (JWT)
* ✅ Role‑based Access Control (USER / ADMIN)
* ✅ Leave FIFO deduction logic
* ✅ PTO (Paid Time Off) handling
* ✅ Leave credit management
* ✅ Rate Limiter for APIs
* ✅ Cron Job for scheduled tasks

---

## 🎨 Frontend Setup

### 1️⃣ Install dependencies

```bash
cd frontend
npm install
```

---

### 2️⃣ Run Frontend

```bash
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

## 👤 User Features

* ✅ User Registration
* ✅ User Login
* ✅ View own profile
* ✅ Request leave
* ✅ View own leave list

---

## 🧑‍💼 Admin Features

* ✅ View all users
* ✅ View all applied leaves
* ✅ View admin profile
* ✅ Add leave credits to users
* ✅ Manage leave requests

---

## 🚀 Notes

* Make sure backend is running **before** starting frontend
* Role changes must be done directly in the database
* Prisma migrations must be applied before first run

---

## 📌 Future Improvements

* Refresh token support
* Email notifications
* Approval workflow with comments
* Dashboard analytics

---

## 👨‍💻 Author

Developed as a full‑stack Leave Management System project.

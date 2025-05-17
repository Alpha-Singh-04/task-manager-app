
# 📋 Task Management System

A full-stack Task Management System built with **Next.js (frontend)**, **Express.js (backend)**, and **MongoDB (database)** — featuring role-based access control, task assignment, real-time notifications, and more.

---

## 🔧 Tech Stack

| Layer     | Tech Used                      |
|-----------|--------------------------------|
| Frontend  | Next.js, Tailwind CSS   |
| Backend   | Express.js, Node.js            |
| Database  | MongoDB + Mongoose             |
| Auth      | JWT, Bcrypt                    |
| Real-Time | Socket.io                      |
| Deployment| Vercel (frontend), Render (backend) |

---

## 👥 Roles

- **Admin** – Can view all users, tasks, and manage everything.
- **Manager** – Can assign tasks to users.
- **User** – Can view and complete tasks assigned to them.

---

## 🔐 Features

- ✅ User Authentication (Login/Register with JWT)
- ✅ Role-Based Access Control (RBAC)
- ✅ CRUD Tasks with priority, status, and deadlines
- ✅ Assign tasks to users/managers
- ✅ Real-Time Notifications via Socket.io
- ✅ Notification System with unread badges
- ✅ Responsive UI for all devices
- ✅ Unit Tests using Jest + Supertest

---

## 🧪 Run Locally

### 1. Clone the repo

```bash
git clone https://github.com/Alpha-Singh-04/task-manager.git
cd task-manager


# Install dependencies
# For frontend
cd client
npm install

# For backend
cd ../server
npm install

# Setup Environment Variables
# .env in server/
PORT=5000
MONGODB_URI=your_mongo_uri
JWT_SECRET=your_secret

# Run development servers

# for client/ and server/
 - npm run dev


🧪 Run Tests
````
- cd server
- npm test

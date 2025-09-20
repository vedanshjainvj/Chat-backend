# Real-Time Chat Application (MERN + Microservices)

A scalable, production-ready real-time chat application built using the MERN stack, RabbitMQ, and microservices architecture. This project features OTP-based authentication, Redis caching, and full deployment on AWS.

---

## Features

- **Real-time Chat** using Socket.IO
- **OTP-based Email Authentication**
- **Microservices Architecture** with RabbitMQ for service communication
- **Redis Caching** for improved performance
- **Scalable and Modular Backend**
- **Responsive UI** with Next.js
- **Fully Deployed** on AWS

---

## Tech Stack

- **Frontend:** Next.js
- **Backend Services:** Node.js, Express
- **Database:** MongoDB
- **Messaging Queue:** RabbitMQ
- **Caching:** Redis
- **Deployment:** AWS
- **Real-time Communication:** Socket.IO

---


---

## Setup

### 1. Clone the Repository
```bash
git clone <repo-url>
cd backend
cd chat
npm install
cd ../mail
npm install
cd ../user
npm install
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
RABBITMQ_URI=<your_rabbitmq_connection_string>
REDIS_URI=<your_redis_connection_string>
# Start User Service
cd user
npm run dev

# Start Mail Service
cd ../mail
npm run dev

# Start Chat Service
cd ../chat
npm run dev
```

Deployment

The app is fully deployable on AWS.

Each service is modular, making scaling and maintenance easy.


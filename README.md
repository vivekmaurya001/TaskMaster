# TaskMaster

## 🚀 About the Project

This is the frontend for **AutoChronos**, a distributed job scheduling platform that supports both periodic and one-time jobs. Users can input shell commands via this web interface, which are then scheduled and executed by distributed worker nodes through a powerful backend system.

## 🛠️ Backend Overview

The backend of AutoChronos is designed to handle job scheduling and execution with high efficiency and scalability. It uses **Node.js**, **Redis**, and **BullMQ** to manage a job queue system. When a command is submitted through the frontend, it is passed to the backend via API calls. The backend then schedules the job and assigns it to a worker, which executes the command on its local system. Periodic jobs are managed using cron expressions. The backend is deployed using **Render**, and supports containerization via **Docker Swarm** for distributed execution.

👉 [Backend Repository](https://github.com/Srajan-Sanjay-Saxena/AutoChronos)

---

## ⚙️ Technologies Used

- [Next.js](https://nextjs.org/) – React-based framework for fast frontend development
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS for styling
- [Axios](https://axios-http.com/) – For making API requests to the backend
- [Vercel](https://vercel.com/) – Deployment platform for hosting the frontend

---

## 📦 Setup Instructions

1. **Clone the repository**
    ```bash
    git clone https://github.com/vivekmaurya001/TaskMaster
    cd TaskMaster
    ```

2. **Install dependencies**
    ```bash
    pnpm install
    ```

3. **Run the development server**
    ```bash
    pnpm dev
    ```

5. Open [http://localhost:3001](http://localhost:3000) to view the site.

---

## 🌐 Deployed Links

- **Frontend (Vercel):** [http://localhost:3001](http://localhost:3000)
- **Backend (Render):** [http://localhost:3000](http://localhost:3001)

---

## 👨‍💻 Contributors

- [Srajan Sanjay Saxena](https://github.com/Srajan-Sanjay-Saxena)
- [Siddhant Baranwal](https://github.com/Siddhant-Baranwal)
- [Vivek Maurya](https://github.com/vivekmaurya001)
- [Saksham Chauhan](https://github.com/kaneki003)

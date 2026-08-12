# PeopleSync — Human Resource Management System

**PeopleSync** is a full-stack Human Resource Management System designed to simplify and centralize essential HR operations such as employee management, attendance, leave, payroll, and payment processing.

## ✨ Features

* 👥 **Employee Management** — Manage employee profiles and information
* 🏢 **Department Management** — Create and manage departments
* 🕐 **Attendance Management** — Track employee attendance and clock-in/clock-out
* 🏖️ **Leave Management** — Apply, approve, reject, and track leaves
* 💰 **Payroll Management** — Manage employee payroll records
* 💳 **Payment Service** — Razorpay payment integration using ASP.NET Core
* 🔐 **Authentication & Authorization** — JWT-based authentication with role-based access
* 📊 **Dashboard** — View important HR statistics and information

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router
* Axios
* Framer Motion

### Backend

* Java
* Spring Boot
* Spring Data JPA / Hibernate
* Spring Security
* JWT
* MySQL
* Maven

### Payment Service

* C#
* ASP.NET Core
* Entity Framework Core
* MySQL
* Razorpay

## 🏗️ Architecture

```text
                    ┌─────────────────┐
                    │   React.js UI   │
                    └────────┬────────┘
                             │
                         REST APIs
                             │
                    ┌────────▼────────┐
                    │  Spring Boot    │
                    │     Backend     │
                    └────────┬────────┘
                             │
                         MySQL DB
                             │
                    ┌────────▼────────┐
                    │ ASP.NET Core    │
                    │ Payment Service │
                    └────────┬────────┘
                             │
                         Razorpay
```

## 📂 Project Structure

```text
PeopleSync-HRMS/
│
├── backend/                 # Spring Boot HRMS backend
├── frontend/                # React frontend
├── payment-service-dotnet/  # ASP.NET Core payment service
└── README.md
```

## 🔐 Security

* JWT-based authentication
* Role-based authorization
* Protected REST APIs
* DTO-based request validation
* Secure payment processing
* Sensitive credentials excluded from source control

## 🚀 Getting Started

### Backend

```bash
cd backend
mvn spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Payment Service

```bash
cd payment-service-dotnet/Payment-module
dotnet restore
dotnet run
```

> Configure your local database and Razorpay credentials before running the applications. **Do not commit secrets or passwords to GitHub.**

## 🔮 Future Scope

* Cloud deployment
* Docker containerization
* Employee self-service portal
* Email notifications
* Advanced HR analytics
* Automated payslip generation
* Mobile application

## 👨‍💻 Project

**PeopleSync — Human Resource Management System**

Built using **React.js, Spring Boot, MySQL, ASP.NET Core, and Razorpay**.

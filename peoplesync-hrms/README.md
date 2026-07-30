# 🌿 PeopleSync HRMS - Enterprise Human Resource Management System

PeopleSync HRMS is a modern, enterprise-grade Human Resource Management System built for medium to large organizations. It brings the sleek, high-aesthetic SaaS design language of Linear, Notion, and BambooHR to enterprise workforce management.

---

## 🎨 Color Palette & Design System
- **Primary**: Deep Green (`#1F4D3B`)
- **Secondary**: Rich Brown (`#6B4F3B`)
- **Accent**: Forest Green (`#2E7D57`)
- **Background**: Cool Gray (`#F5F7F6`)
- **Surface**: White (`#FFFFFF`) / Dark Slate (`#18221D`)
- **Corner Radius**: `16px` (`rounded-2xl`) & soft ambient shadows (`shadow-soft`)
- **Dark Mode**: Built-in toggle with persistent state

---

## 🛠️ Tech Stack

### Frontend
- **React 19** + **Vite 6**
- **TailwindCSS 3.4** + PostCSS
- **Framer Motion** (Spring animations, page transitions, toast alerts)
- **Recharts** (Attendance area charts, dept pie charts, salary distribution bars)
- **Lucide React** (Minimal modern icon set)
- **Axios** (API layer with JWT interceptor & embedded mock storage fallback)
- **React Router DOM 6**

### Backend
- **Java 21** + **Spring Boot 3.2**
- **Spring Security 6** + **JWT Authentication**
- **Spring Data JPA** + **Hibernate**
- **H2 / MySQL Database** (Zero-config instant dev execution with H2 in-memory DB)
- **ModelMapper** & **Lombok**
- **Global Exception Handling** with `ApiResponseDTO<T>`

---

## 🚀 Quick Start Instructions

### 1. Run Frontend Application
```bash
cd frontend
npm install
npm run dev
```
The frontend will launch at `http://localhost:3000` (or `http://localhost:5173`).

> **Note**: The frontend works out-of-the-box with full interactivity (CRUD, Check-In clock, Leave approval, Salary slips, Role switching) in embedded demo mode, and seamlessly proxies `/api` calls to the Spring Boot backend when running!

### 2. Run Java 21 Spring Boot Backend
```bash
cd backend
mvn spring-boot:run
```
The REST API server will start on port `8080`.
- H2 Console available at: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:peoplesyncdb`, user: `sa`)

---

## ⚡ Role-Based Authorization Views
Click the **Role Switcher** dropdown in the top navigation header to test views for all 4 roles:
1. **ADMIN**: Full access to workforce CRUD, department creation, payroll generation, and system settings.
2. **HR**: Staff onboarding, leave approvals, salary slips review, and reports export.
3. **MANAGER**: Department team view, leave request review with decision comments, team attendance.
4. **EMPLOYEE**: Personal dashboard, live check-in/check-out, leave application, personal payslip download.

---

## 📁 Key Feature Modules
- **Authentication**: JWT Login, Logout, Forgot Password, Reset Email simulation, Quick Demo Role login pills.
- **Employee Directory**: Paginated & sortable DataTable, Grid/Table view toggle, Add/Edit modals with photo preview, Delete with **Undo Toast**.
- **Departments**: Head of Dept cards, employee headcount, annual budget, team location tracking.
- **Attendance**: Interactive Live Clock In/Out widget, daily logs table, monthly status calendar.
- **Leave Management**: Balance cards (Casual, Sick, Annual, Paid), Apply for leave modal, Manager Approve/Reject workflow with comments.
- **Payroll System**: Run monthly payroll action, employee salary table, downloadable printable payslip modal.
- **Executive Analytics**: Recharts attendance performance area chart, department roster donut chart, salary bands, hiring & attrition velocity.
- **Profile Settings**: Information edit, photo upload preview, password strength validator, notification preferences.

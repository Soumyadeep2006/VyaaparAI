# 🚀 VyaparAI — AI-Powered Smart Business Management Platform

**VyaparAI** is a modern, AI-powered business management platform designed to help small businesses manage their **billing, inventory, customers, suppliers, payments, and business analytics** from one centralized system.

The platform combines traditional business management tools with **AI-powered insights** to help business owners understand their data and make smarter decisions.

---

## 🌐 Project Links

| Resource                 | Link                                                                                |
| ------------------------ | ----------------------------------------------------------------------------------- |
| 🚀 **Live Demo**         | https://vyapar-ai-ruby.vercel.app                                                   |
| 💻 **GitHub Repository** | https://github.com/algorhythm11/VyaparAI                                            |
| ⚙️ **Backend API**       | https://vyaparai-backend-vdko.onrender.com                                          |
| 🎥 **Demo Video**        | https://drive.google.com/file/d/1rnQ-TNym-MmbRZ4lcdKOsKRrWaX_RRQ4/view?usp=drivesdk |


---

# 🎯 Problem Statement

Small businesses often manage their daily operations using notebooks, spreadsheets, or multiple disconnected applications.

This creates several problems:

* Manual billing and record keeping
* Difficulty tracking inventory
* Lack of visibility into low-stock products
* Difficult customer outstanding-payment tracking
* Supplier payment management issues
* Business information spread across multiple systems
* Limited access to meaningful business analytics
* Difficulty converting business data into actionable decisions

### Our Goal

Build a single platform that allows business owners to manage their daily operations while using AI to turn business data into useful insights.

---

# 💡 Our Solution

**VyaparAI** brings essential business operations into one intelligent platform.

```text
                    ┌───────────────────┐
                    │     VyaparAI      │
                    │ Smart Business AI │
                    └─────────┬─────────┘
                              │
       ┌──────────┬───────────┼───────────┬──────────┐
       │          │           │           │          │
    Billing   Inventory   Customers   Suppliers   Analytics
       │          │           │           │          │
       └──────────┴───────────┼───────────┴──────────┘
                              │
                       ┌──────▼──────┐
                       │ AI Insights │
                       └─────────────┘
```

VyaparAI helps business owners:

**Record → Track → Analyze → Understand → Decide**

---

# ✨ Key Features

## 🧾 Smart Billing

* Create invoices
* Add multiple products
* Calculate invoice totals
* Track invoice status
* Payment states:

  * ✅ Paid
  * 🟡 Pending
  * ❌ Cancelled
* View recent transactions

---

## 📦 Inventory Management

* Add products
* Manage product details
* Track stock quantities
* Monitor product availability
* Identify low-stock products
* Update and delete inventory items

---

## 👥 Customer Management

Manage customer information including:

* Customer name
* Phone number
* Email
* Address
* Total purchases
* Outstanding amount
* Payment status

Payment status can be tracked as:

* **Paid**
* **Pending**
* **Cancelled**

---

## 🏢 Supplier Management

Manage supplier information including:

* Supplier name
* Company
* Phone
* Email
* Address
* Total purchases
* Pending payments

---

## 📊 Reports & Analytics

VyaparAI provides business analytics such as:

* Total sales
* Total orders
* Daily sales
* Monthly sales
* Average order value
* Paid orders
* Pending orders
* Cancelled orders
* Monthly revenue
* Product performance
* Recent transactions

---

# 🤖 AI-Powered Business Intelligence

The key differentiator of VyaparAI is the integration of AI with business data.

Instead of forcing business owners to manually interpret charts and numbers, the AI layer can help convert business information into understandable insights.

### Example Questions

```text
"How is my business performing?"

"Which products are selling the most?"

"Which products need restocking?"

"What are my pending payments?"

"How are my sales this month?"
```

The AI can transform business data into:

**Raw Business Data → AI Analysis → Business Insight → Actionable Recommendation**

---

# 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │      React UI       │
                    │    TypeScript       │
                    │    Tailwind CSS     │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │       FastAPI       │
                    │     REST Backend    │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        ┌───────────┐    ┌───────────┐   ┌───────────┐
        │ Customers │    │  Billing  │   │ Inventory │
        └───────────┘    └───────────┘   └───────────┘
              │                │                │
              └────────────────┼────────────────┘
                               ▼
                    ┌─────────────────────┐
                    │       MongoDB       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    AI / Analytics   │
                    │ Business Insights   │
                    └─────────────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

* **React**
* **TypeScript**
* **Tailwind CSS**
* **React Router**
* **TanStack Query**
* **Axios**
* **Lucide React**
* **Recharts**

## Backend

* **Python**
* **FastAPI**
* **Pydantic**
* **Motor**
* **MongoDB**
* REST APIs
* Authentication & protected routes

## AI

* **Google Gemini / Generative AI**
* AI-powered business insights
* Natural-language business assistance

## Database

* **MongoDB**

## Deployment

* **Frontend:** Vercel
* **Backend:** Render
* **Source Code:** GitHub

---

# 📁 Project Structure

```text
VyaparAI/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   │   ├── billing/
│   │   │   ├── customers/
│   │   │   ├── inventory/
│   │   │   ├── suppliers/
│   │   │   ├── reports/
│   │   │   └── layout/
│   │   │
│   │   ├── pages/
│   │   │   ├── dashboard/
│   │   │   ├── billing/
│   │   │   ├── customers/
│   │   │   ├── inventory/
│   │   │   ├── suppliers/
│   │   │   └── reports/
│   │   │
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── context/
│   │   └── constants/
│   │
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   ├── services/
│   │   ├── schemas/
│   │   ├── models/
│   │   ├── utils/
│   │   ├── database.py
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── .env
│
└── README.md
```

---

# 🔐 Authentication & Security

VyaparAI uses authenticated API requests to ensure that business information belongs to the correct user.

The backend uses:

* Authentication
* Protected API routes
* User-specific data filtering
* Environment variables for secrets
* MongoDB access through backend services

Sensitive credentials such as API keys and database URLs should **never be committed to GitHub**.

---

# 🚀 Running the Project Locally

## 1. Clone the Repository

```bash
git clone https://github.com/algorhythm11/VyaparAI.git

cd VyaparAI
```

---

# ⚙️ Backend Setup

Go to the backend:

```bash
cd backend
```

Create a virtual environment:

### Windows

```powershell
python -m venv venv
```

Activate it:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

Create a `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
DATABASE_NAME=vyaparai
GEMINI_API_KEY=your_gemini_api_key
```

Start FastAPI:

```powershell
python -m uvicorn app.main:app --reload
```

Backend will normally be available at:

```text
http://127.0.0.1:8000
```

---

# 💻 Frontend Setup

Open another terminal:

```powershell
cd frontend
```

Install dependencies:

```powershell
npm install
```

Create `.env` if required:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Start the frontend:

```powershell
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# 🔄 Application Workflow

```text
User Login
     ↓
Dashboard
     ↓
┌───────────────────────────────┐
│                               │
▼                               ▼
Inventory                    Customers
│                               │
▼                               ▼
Billing  ────────────────► Payments
│
▼
Reports & Analytics
│
▼
AI-Powered Business Insights
```

---

# 📈 Reports & Analytics

The reporting system analyzes invoice data to provide:

### Sales Metrics

* Total sales
* Total orders
* Average order value

### Payment Metrics

* Paid orders
* Pending orders
* Cancelled orders

### Time-Based Analytics

* Daily sales
* Monthly sales
* Monthly revenue trends

### Product Analytics

* Product quantity sold
* Product revenue
* Top-performing products

### Transactions

* Recent invoices
* Customer
* Amount
* Payment status
* Transaction date

---

# 🧠 AI + Analytics Flow

```text
Customer / Billing / Inventory Data
                 ↓
              MongoDB
                 ↓
        Backend Analytics
                 ↓
             AI Layer
                 ↓
      Business Understanding
                 ↓
      Recommendations / Insights
```

This makes VyaparAI more than a traditional CRUD application.

---

# 🎥 Demo Video

Watch the complete VyaparAI demonstration:

**Google Drive Demo Video**

https://drive.google.com/file/d/1rnQ-TNym-MmbRZ4lcdKOsKRrWaX_RRQ4/view?usp=drivesdk

The demo demonstrates:

* Login
* Dashboard
* Inventory
* Billing
* Customer management
* Supplier management
* Reports & Analytics
* AI-powered functionality

---

# 🏆 Hackathon Value Proposition

### Traditional Business Management

```text
Manual Data
     ↓
Multiple Records
     ↓
Difficult Analysis
     ↓
Delayed Decisions
```

### VyaparAI

```text
Centralized Data
     ↓
Automated Analytics
     ↓
AI-Powered Insights
     ↓
Smarter Decisions
```

### Why VyaparAI?

**One platform for the complete business workflow.**

VyaparAI combines:

> **Billing + Inventory + Customers + Suppliers + Analytics + AI**

into a single intelligent platform.

---

# 🔮 Future Scope

## Phase 1 — AI Expansion

* Conversational AI business assistant
* Natural-language analytics
* Smart business recommendations

## Phase 2 — Predictive Intelligence

* Sales forecasting
* Demand prediction
* Inventory forecasting
* Smart restocking suggestions
* Customer behavior analysis

## Phase 3 — Business Automation

* Automated payment reminders
* WhatsApp business notifications
* GST automation
* Automated invoice generation
* Voice-based business operations

## Phase 4 — Advanced Intelligence

* AI financial assistant
* Business health score
* Personalized growth recommendations
* Advanced forecasting dashboards

---

# 🎯 Vision

Our vision is to make advanced business intelligence accessible to small businesses without requiring them to understand complex analytics.

### **VyaparAI**

**“From Business Data to Intelligent Decisions.”**

---

# 👨‍💻 Project

**VyaparAI — AI-Powered Smart Business Management Platform**

Built as a hackathon project with a focus on:

* Artificial Intelligence
* Business Intelligence
* Full-Stack Development
* Automation
* Small Business Digitization

---

## ⭐ If you like VyaparAI

Consider giving the repository a ⭐ on GitHub.

**Live Demo:**
https://vyapar-ai-ruby.vercel.app

**Source Code:**
https://github.com/algorhythm11/VyaparAI

**Demo Video:**
https://drive.google.com/file/d/1rnQ-TNym-MmbRZ4lcdKOsKRrWaX_RRQ4/view?usp=drivesdk

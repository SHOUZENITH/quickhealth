# 🏥 QuickHealth

A modern healthcare superapp integrating **telemedicine**, **pharmacy e-commerce**, and **population health analytics** into one unified platform.

QuickHealth reduces fragmentation in patient care by bringing together:  
**Health Tracking**, **Telemedicine**, and **E-commerce**, all backed by secure PostgreSQL Row Level Security (RLS).

---

## 📖 Overview

QuickHealth includes a powerful **Admin Command Center** for:

- Managing pharmacy orders  
- Viewing population health insights  
- Handling CRM and user data  
- Monitoring health trends and risk factors  

Security is designed with strict **Role-Based Access Control (RBAC)** enforced via **Supabase RLS policies**, ensuring complete data isolation between patients and administrators.

---

## ✨ Key Features

### **🛠 Admin Command Center**
- **CRM Dashboard:** View user profiles and medical history summaries  
- **Analytics Hub:** Real-time charts for BMI distribution, population risk levels, health score trends  
- **Order Management:** Update pharmacy order statuses (Pending → Shipped)

---

### **💊 Pharmacy E-commerce**
- Full shopping cart (persistent using Local Storage)  
- Category-based browsing and medication search  
- Smooth checkout experience  

---

### **🩺 Telemedicine**
- Find doctors by specialty, rating, and availability  
- Mock video appointment booking flow  
- Health calculators:  
  - **BMI** (Body Mass Index)  
  - **BMR** (Basal Metabolic Rate)  
- Personalized health recommendations  

---

### **🔐 Security**
- **Row Level Security (RLS)** ensures each user only accesses their own medical data  
- **Admins** have elevated access through email-based rules  
- Zero-trust client architecture  

---

## 🛠️ Tech Stack

### **Frontend**
- Next.js 14 (App Router & Server Components)  
- Tailwind CSS (Dark/Light Mode)  
- Lucide Icons  
- Recharts (Health analytics visualizations)

### **Backend & Database**
- Supabase (Auth, Database, Storage)  
- PostgreSQL  
- Row Level Security (RLS) Policies  

---

## 📸 Gallery

_(Insert screenshots or GIFs here as needed)_

- **Admin Command Center**  
- **Pharmacy Store (Dark Mode)**  
- **Doctor Booking Flow**  
- **E-commerce Checkout**

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js (v18+)  
- Supabase Project (Free Tier)

---

### **1. Clone the Repository**

```bash
git clone https://github.com/yourusername/quickhealth.git
cd quickhealth
```

---

### **2. Install Dependencies**

```bash
npm install
```

---

### **3. Environment Variables**

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

### **4. Database Setup**

Run the SQL schema located at:

```
/supabase/schema.sql
```

This includes:
- Tables  
- RLS Policies  
- Triggers  

---

### **5. Run the Application**

```bash
npm run dev
```

Your app will be available at:

👉 **http://localhost:3000**

---

## 🔐 Security Architecture

QuickHealth follows a **Zero Trust** model.  
All security enforcement happens directly in **PostgreSQL RLS**:

| Role | Permissions |
|------|-------------|
| **Public** | View products & articles |
| **Authenticated Users** | View & edit *only their own* profile + orders |
| **Admins** | Full access via email-based RLS bypass rules |

No sensitive logic is trusted on the client.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to open a PR or start a discussion.

---

## 📄 License

This project is open-source under the **MIT License**.


# ⚡ Agentflow AI — Intelligent Customer Support & Ticketing Platform

**Agentflow AI** is a full-stack, AI-driven customer support and ticketing system built with **Laravel** and **React (Inertia.js)**. It streamlines customer operations by combining automated Large Language Model (LLM) responses with a seamless **Human-in-the-Loop (Human Takeover)** escalation workflow.

---

## 🌐 Live Demo & Test Credentials

🚀 **Live Application:** [https://agentflow-ai-px0s.onrender.com](https://agentflow-ai-px0s.onrender.com)

You can test the platform immediately using the following pre-configured accounts (or register a new account):

| Role | Email | Password | Capabilities |
| :--- | :--- | :--- | :--- |
| **Customer (User)** | `user@demo.com` | `password123` | Create tickets, chat with AI, upload attachments |
| **Support Agent (Admin)** | `admin@demo.com` | `password123` | View all tickets, trigger **Human Takeover**, close tickets |

---

## ✨ Key Engineering Features

- **🤖 Automated AI Support Agent:** Instant, context-aware responses powered by LLMs (Groq API) to resolve common technical and billing queries automatically.
- **🛑 Human Takeover Mode (Human-in-the-Loop):** Support administrators can monitor live conversations and intervene at any time. Once an admin replies, the AI automatically yields control for that specific ticket.
- **🔄 Real-Time State Synchronization:** Built-in resilient polling architecture via Inertia.js partial reloads (`only: ['messages']`), ensuring smooth, error-free live chat updates across cloud proxies without dropping connections.
- **📝 Rich Markdown & Code Highlighting:** Integrated `react-markdown` and `remark-gfm` to cleanly render code blocks, lists, and formatted technical solutions inside chat bubbles.
- **📎 Media & File Attachments:** Customers and admins can attach images and documents directly within the conversation thread with inline image previews.
- **🎨 Dual-Theme UI Experience:** Clean light-mode interface for customers and a high-contrast dark-mode command center for administrators built with **Tailwind CSS**.

---

## 🛠️ Tech Stack & Infrastructure

- **Backend:** PHP 8.3, Laravel, Eloquent ORM, RESTful Routing
- **Frontend:** React 18, Inertia.js (SPA Monolith), Tailwind CSS
- **AI Integration:** Groq LLM API
- **Database:** PostgreSQL (Neon Serverless / Render) & MySQL compatible
- **DevOps & Deployment:** Docker (`php:8.3-fpm`), Nginx, Supervisor, deployed on Render Cloud

---

## 💻 Local Installation & Setup

To run this project locally on your machine, follow these steps:

```bash
# 1. Clone the repository
git clone https://github.com/izadyar-amirreza/agentflow-ai.git
cd agentflow-ai

# 2. Install PHP & JavaScript dependencies
composer install
npm install

# 3. Configure environment variables
cp .env.example .env
php artisan key:generate

# 4. Set up your database and AI API key in the .env file
# DB_CONNECTION=mysql (or pgsql)
# GROQ_API_KEY=your_api_key_here

# 5. Run migrations and link storage for file attachments
php artisan migrate
php artisan storage:link

# 6. Start the development servers
php artisan serve
npm run dev
```
# 🚀 AI-Powered Hybrid Ticketing System

A modern, real-time IT support ticketing system built with Laravel 11, React, and Inertia.js. This project seamlessly integrates Agentic AI for automated responses while allowing a seamless "Human Takeover" when administrative intervention is required.

## ✨ Key Features
* **🤖 AI First-Line Support:** Automated, context-aware ticket responses powered by the Groq API (Qwen 27b model).
* **🛑 Human Takeover Mechanism:** Admins can instantly override the AI, locking the bot out of the conversation to handle complex issues manually.
* **⚡ Real-Time Chat:** Instant message delivery and UI updates without page reloads, powered by **Laravel Reverb** (WebSockets).
* **📎 Secure Attachments:** Full support for uploading, validating, and previewing image and document attachments in the chat.
* **🔒 Role-Based Access Control:** Strict separation of concerns between standard users and system administrators.

## 🛠️ Tech Stack
* **Backend:** Laravel 11, MySQL
* **Frontend:** React.js, Inertia.js, Tailwind CSS
* **Broadcasting:** Laravel Reverb & Laravel Echo
* **AI Integration:** Groq API

## ⚙️ Installation & Setup
1. Clone the repository.
2. Run `composer install` and `npm install`.
3. Copy `.env.example` to `.env` and configure your database, `GROQ_API_KEY`, and Reverb credentials.
4. Run `php artisan key:generate` and `php artisan storage:link`.
5. Run migrations: `php artisan migrate`.
6. Start the necessary servers:
   - `php artisan serve`
   - `npm run dev`
   - `php artisan reverb:start`
# GrindChain - Task Management Application 🚀

![GrindChain Banner](https://via.placeholder.com/1200x400?text=GrindChain+Banner) <!-- Replace with actual banner image -->

GrindChain is a comprehensive task management application designed to help users efficiently organize, prioritize, and track tasks. It features a user-friendly interface built with React, real-time updates, and AI-powered automation.

## 🌟 Key Features

- **User Authentication**: Secure login, signup, and logout using JWT and cookies
- **AI-Powered Task Generation**: AI chatbot assists in creating tasks from natural language
- **Real-time Communication**: Socket.IO enables live updates for tasks and notifications
- **Dashboard**: Personalized overview with statistics and upcoming tasks
- **Task Management**: Create, update, delete, and track progress of tasks
- **Profile Management**: Edit/view your profile, avatar, and description
- **Chatroom**: Real-time chat for individuals and groups
- **Analytics**: Visual performance insights with charts and graphs
- **Responsive Design**: Fully functional across all devices
- **Protected Routes**: Auth-gated pages with lazy loading for optimal performance

## 🛠️ Tech Stack

### Frontend
- **Framework**: React with React Router DOM
- **Styling**: Tailwind CSS, Heroicons, Heroui
- **Animation**: Framer Motion, GSAP, OGL
- **Visualization**: React Circular Progressbar, Recharts
- **Real-time**: Socket.IO Client
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js with Express.js
- **Real-time**: Socket.IO
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## 🚀 Getting Started

### Prerequisites
- Node.js (>=16.x)
- npm (>=8.x)
- MongoDB Atlas account or local MongoDB instance

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/GrindChain.git
cd GrindChain
```

2. Install dependencies for both frontend and backend:
```bash
cd frontend && npm install
cd ../backend && npm install
```

3. Set up environment variables (see below)

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application should now be running:
- Frontend: http://localhost:5173
- Backend: http://localhost:5001

## 🔐 Environment Configuration

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=5001
FRONTEND_URL=http://localhost:5173

# Authentication
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRE=24h

# Database
MONGODB_URI=your_mongodb_connection_string

# AI Services
GEMINI_API_KEY=your_gemini_api_key
```

## 📂 Project Structure

```
GrindChain/
├── backend/                  # Backend server code
│   ├── controllers/          # Route controllers
│   ├── models/               # MongoDB models
│   ├── routes/               # API routes
│   ├── utils/                # Utility functions
│   ├── app.js                # Express app configuration
│   ├── server.js             # Server entry point
│   └── .env                  # Environment variables
│
├── frontend/                 # Frontend React application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── API/              # API communication
│   │   ├── assets/           # Images, icons, etc.
│   │   ├── components/       # Reusable components
│   │   ├── contexts/         # React contexts
│   │   ├── pages/            # Application pages
│   │   ├── App.jsx           # Main app component
│   │   └── main.jsx          # Entry point
│   ├── vite.config.js        # Vite configuration
│   └── package.json
│
├── .gitignore
└── README.md
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## 📬 Contact

For questions or suggestions, please contact:

- **Garvit Thakral** - [thakralgarvit1@gmail.com](mailto:thakralgarvit1@gmail.com)
- **GitHub**: [@garvitthakral](https://github.com/garvitthakral)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

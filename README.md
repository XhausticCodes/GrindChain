# GrindChain
# Task Management Application 🚀

This project is a comprehensive task management application designed to help users efficiently organize, prioritize, and track their tasks. It features a user-friendly interface built with React, a robust backend API, and real-time communication capabilities using Socket.IO. The application provides features like user authentication, AI-powered task generation, progress tracking, and team collaboration tools.

## 🚀 Key Features

- **User Authentication:** Secure login, signup, and logout functionality using JWT and cookie-based session management.
- **AI-Powered Task Generation:** An AI chatbot assists users in creating tasks based on natural language input.
- **Real-time Communication:** Socket.IO enables real-time updates for tasks, chat messages, and notifications.
- **Dashboard Overview:** A personalized dashboard displays key statistics, upcoming tasks, and team summaries.
- **Task Management:** Users can create, update, delete, and track the progress of their tasks.
- **Profile Management:** Users can view and edit their profile information, including avatar and description.
- **Chatroom:** Real-time chat functionality for individual and group conversations.
- **Analytics:** Visual representation of user and team performance through charts and graphs.
- **Responsive Design:** The application is designed to be responsive and accessible on various devices.
- **Protected Routes:** Ensures that only authenticated users can access certain parts of the application.
- **Lazy Loading:** Improves initial load time by loading components only when they are needed.

## 🛠️ Tech Stack

- **Frontend:**
    - React
    - React Router DOM
    - Tailwind CSS
    - Heroicons
    - Heroui (@heroui/calendar, @heroui/system, @heroui/theme)
    - Framer Motion
    - GSAP
    - OGL
    - React Circular Progressbar
    - Recharts
    - Socket.IO Client
    - Vite
- **Backend:** (Not detailed in provided summaries, but implied)
    - Node.js (Likely)
    - Express.js (Likely)
    - Socket.IO (Likely)
- **Authentication:**
    - JWT (JSON Web Tokens)
- **Build Tool:**
    - Vite
- **Linting:**
    - ESLint
- **Other:**
    - TypeScript (Types for React)

## 📦 Getting Started / Setup Instructions

### Prerequisites

- Node.js (>=16)
- npm

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    cd frontend
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

### Running Locally

1.  Start the development server:

    ```bash
    npm run dev
    ```

    This will start the frontend development server, typically on `http://localhost:5173`.  Make sure your backend is running as well, likely on `http://localhost:5001` as configured in `vite.config.js`.

## 📂 Project Structure

```
frontend/
├── src/
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # Entry point for React
│   ├── routes.jsx          # Defines application routes
│   ├── index.css           # Global styles
│   ├── contexts/
│   │   └── AuthContext.jsx   # Authentication context
│   ├── pages/
│   │   ├── LoginPage.jsx     # Login page
│   │   ├── SignupPage.jsx    # Signup page
│   │   ├── Dashboard.jsx     # Dashboard page
│   │   ├── Tasks.jsx         # Tasks page
│   │   ├── Analytics.jsx     # Analytics page (Lazy Loaded)
│   │   ├── Chatroom.jsx      # Chatroom page
│   │   ├── Notifications.jsx # Notifications page (Lazy Loaded)
│   │   ├── Profile.jsx       # Profile page
│   │   ├── GroupChat.jsx     # Group Chat page (Lazy Loaded)
│   │   └── CreateGroup.jsx   # Create Group page (Lazy Loaded)
│   ├── components/
│   │   ├── Layout.jsx        # Layout component
│   │   ├── chatroom/         # Chatroom related components
│   │   ├── tasks/            # Task related components
│   │   └── profile/          # Profile related components
│   ├── assets/             # Static assets (images, etc.)
│   └── API/
│   │   └── socketApi.js      # Socket.IO API (MISSING)
│   └── ...
├── vite.config.js        # Vite configuration
├── package.json          # Project dependencies and scripts
├── public/               # Public assets
└── ...
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive messages.
4.  Push your changes to your fork.
5.  Submit a pull request to the main repository.

## 📬 Contact

If you have any questions or suggestions, feel free to contact me at [thakralgarvit1@gmail.com](mailto:thakralgarvit1@gmail.com).

## 💖 Thanks Message

Thank you for checking out this project! I hope it helps you manage your tasks more efficiently. Your feedback and contributions are highly appreciated.

This is written by [readme.ai](https://readme-generator-phi.vercel.app/).

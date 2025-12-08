# MyCafe - Full-Stack Cafe Management Application

Welcome to the MyCafe project! This is a full-stack web application designed as a modern, intuitive management system for a cafe. It features a complete backend API and a responsive user-facing frontend.

## 🚀 Live Demo

Check out the live version of the application deployed on Vercel:

**[MyCafe Live Demo](https://my-cafe-ebon.vercel.app/)**

---

## ✨ Features

- **Full-Stack Architecture**: A decoupled frontend and backend for scalability and maintainability.
- **User Authentication**: Secure user registration and login with JSON Web Tokens (JWT).
- **Dynamic Menu Management**: Full CRUD (Create, Read, Update, Delete) for menu items, manageable by admins.
- **Seamless Order Processing**: Customers can browse the menu, add items to their cart, and place orders.
- **Order History**: Users can view their past orders.

---

## 🛠️ Tech Stack

This project is built with modern technologies to deliver a fast and reliable experience.

### Frontend
- **Framework**: React.js
- **Styling**: (e.g., CSS Modules, Styled Components, or a framework like Tailwind CSS)
- **State Management**: (e.g., React Context, Redux)
- **API Communication**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT) & bcrypt

---

## 📂 Project Structure

This repository is a monorepo containing two main directories:

- **/Frontend**: Contains the React.js client-side application.
- **/Backend**: Contains the Node.js/Express REST API server.

Each directory is a self-contained project with its own dependencies and scripts.

---

## <caption> Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/en/download/) (v18.x or higher recommended)
- [npm](https://www.npmjs.com/get-npm) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/try/download/community) (or a MongoDB Atlas account for a cloud-hosted DB)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/my-cafe.git
    cd my-cafe
    ```

2.  **Set up the Backend:**

    ```sh
    # Navigate to the backend directory
    cd Backend

    # Install dependencies
    npm install

    # Create a .env file and add your environment variables
    # (see Backend/README.md for more details)
    cp .env.example .env

    # Start the backend server (runs on http://localhost:5000 by default)
    npm run dev
    ```

3.  **Set up the Frontend:**

    Open a new terminal window for this step.
    ```sh
    # Navigate to the frontend directory from the root
    cd Frontend

    # Install dependencies
    npm install

    # Create a .env file to point to your local backend API
    echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

    # Start the frontend development server (runs on http://localhost:3000)
    npm start
    ```

4.  **You're all set!**
    Open your browser and navigate to `http://localhost:3000` to see the application running locally.

---

## 📝 API Endpoints

The backend provides several API endpoints for managing users, menu items, and orders. For a detailed list of available routes, please refer to the Backend README.

---


# MyCafe - Frontend

This directory contains the frontend source code for the **MyCafe** application. It is a single-page application built with React, providing a modern and responsive user interface for customers and administrators.

## 🚀 Live Demo

You can see the full application in action at the following link:

**[MyCafe Live Demo](https://my-cafe-ebon.vercel.app/)**

---

## ✨ Features

- **Responsive Design**: A mobile-first design that looks great on any device, from desktops to smartphones.
- **Dynamic Menu**: Browse a rich, dynamic menu of available food and drinks.
- **Shopping Cart**: Easily add and remove items from the cart before placing an order.
- **User Authentication**: Simple and secure registration and login for a personalized experience.
- **Order History**: Logged-in users can view a history of their past orders.
- **Admin Dashboard**: A dedicated interface for administrators to manage menu items.

---

## 🛠️ Tech Stack

- **Framework**: [React.js](https://reactjs.org/)
- **API Communication**: [Axios](https://axios-http.com/)
- **State Management**: React Context API
- **Styling**: CSS Modules / Standard CSS

---

## <caption> Getting Started

Follow these instructions to get a local copy of the frontend up and running for development and testing purposes.

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/en/download/) (v18.x or higher recommended)
- [npm](https://www.npmjs.com/get-npm) (comes with Node.js)

> **Note:** The backend server must be running for the frontend application to function correctly. Please see the [Backend README](../Backend/README.md) for setup instructions.

### Installation & Setup

1.  **Navigate to the directory:**
    From the project root, move into the `Frontend` directory.
    ```sh
    cd Frontend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the `Frontend` root directory. This file will tell your React app where to find the backend API.

    ```sh
    # For a local backend server running on port 5000
    echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
    ```

4.  **Run the development server:**

    This command starts the React development server, usually on `http://localhost:3000`.
    ```sh
    npm start
    ```

You can now open your browser and navigate to `http://localhost:3000` to see the application running.

---

## 📜 Available Scripts

In the project directory, you can run:

- `npm start`: Runs the app in development mode.
- `npm test`: Launches the test runner in interactive watch mode.
- `npm run build`: Builds the app for production to the `build` folder.

---

## 📄 License

This project is licensed under the MIT License.
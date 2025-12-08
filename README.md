# MyCafe - Backend

This repository contains the backend source code for the **MyCafe** application. It is a RESTful API built with Node.js and Express, designed to handle all the business logic for a modern cafe management system.

## 🚀 Live Demo

You can see the full application in action, powered by this backend, at the following link:

**[MyCafe Live Demo](https://my-cafe-ebon.vercel.app/)**

---

## ✨ Features

- **User Authentication**: Secure user registration and login using JSON Web Tokens (JWT).
- **Menu Management**: Full CRUD (Create, Read, Update, Delete) functionality for menu items.
- **Order Processing**: System for creating, viewing, and managing customer orders.
- **Scalable Architecture**: Clean and organized codebase for easy maintenance and future expansion.

## 🛠️ Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) for object data modeling.
- **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/)
- **Development**: [Nodemon](https://nodemon.io/) for automatic server restarts during development.

---

## <caption> Getting Started

Follow these instructions to get a local copy of the backend up and running for development and testing purposes.

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/en/download/) (v18.x or higher recommended)
- [npm](https://www.npmjs.com/get-npm) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/try/download/community) (or a MongoDB Atlas account)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone <your-repository-url>
    cd Backend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the `Backend` root directory. Copy the contents of `.env.example` into it and fill in your specific configuration details (like your database connection string and JWT secret).

    ```ini
    # .env.example

    # MongoDB Connection URI
    MONGO_URI=mongodb://localhost:27017/mycafe

    # Port for the server to run on
    PORT=5000

    # JWT Secret for signing tokens
    JWT_SECRET=your_super_secret_key
    ```

4.  **Run the development server:**

    This command uses `nodemon` to start the server, which will automatically restart when you make changes to the code.
    ```sh
    npm run dev
    ```

The API server should now be running on `http://localhost:5000` (or whatever port you specified in your `.env` file).

---

## 📝 API Endpoints

Here are some of the primary API routes available:

- `POST /api/auth/register` - Register a new user.
- `POST /api/auth/login` - Log in a user and receive a JWT.
- `GET /api/menu` - Fetch all menu items.
- `POST /api/menu` - Create a new menu item (admin only).
- `POST /api/orders` - Create a new order.
- `GET /api/orders/my-orders` - Get orders for the logged-in user.

## 📄 License

This project is licensed under the MIT License.
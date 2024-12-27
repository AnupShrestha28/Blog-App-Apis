# Blogging Platform Backend  

A robust and scalable backend solution for a blogging platform, built with **Node.js** and **TypeScript**. This project includes essential functionalities such as user authentication, blog post management, comment handling, image uploads, and more, leveraging **PostgreSQL** with **Prisma ORM** for database management. Swagger is integrated for seamless API documentation.

---

## Table of Contents  

1. [Features](#features)  
2. [Tech Stack](#tech-stack)  
3. [Installation](#installation)  
4. [Usage](#usage)  
5. [API Documentation](#api-documentation)  
6. [API Endpoints](#api-endpoints)    

---

## Features  

- **Super Admin Initialization**: Pre-seeded super admin user with secure password hashing,view all users and delete the users along with their related post, image and comment.  
- **User Authentication**: Registration, login, and token-based authentication.  
- **Blog Post Management**: Create, read, and optionally update or delete blog posts.  
- **Comment Handling**: Add, update, delete and view comments for blog posts.  
- **Image Upload**: Single image upload functionality with update and delete with a proper validation.  
- **Authentication Middleware**: Protect API routes with token verification.  
- **User Profiles**: View and update user profile information.  
- **Error Handling**: Comprehensive error messages for invalid requests.  
- **Swagger Documentation**: Integrated Swagger for exploring and testing APIs.  

---

## Tech Stack  

- **Node.js** (Backend runtime)  
- **TypeScript** (Type-safe programming)  
- **PostgreSQL** (Database)  
- **Prisma ORM** (Database management)  
- **bcrypt** (Password hashing)  
- **JSON Web Token (JWT)** (Authentication)  
- **Multer** (Image uploads)  
- **Swagger** (API Documentation)  

---

## Installation  

### Prerequisites  

- Node.js (v14 or later)  
- PostgreSQL  

### Steps  

1. **Clone the repository**:  
   ```bash  
   git clone git@github.com:AnupShrestha28/associate-blog-app.git 
   cd blog-app

3. Set up environment variables:
Create a .env file in the root directory with the following:
   ```bash
   DATABASE_URL=your_postgres_database_url  
JWT_SECRET=your_secret_key  
PORT=your_preferred_port  
   
2. Install dependencies:
   ```bash
   npm install  

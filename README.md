# Blogging Platform  

A scalable backend solution for a blogging platform, built with **Node.js** and **TypeScript**. This project includes essential functionalities such as user authentication, blog post management, comment handling, image uploads, and more, leveraging **PostgreSQL** with **Prisma ORM** for database management. Swagger is integrated for seamless API documentation.

---

## Table of Contents  

1. [Features](#features)  
2. [Tech Stack](#tech-stack)  
3. [Installation](#installation)  
4. [API Documentation](#api-documentation)  
5. [API Endpoints](#api-endpoints)    

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
   
2. Install dependencies:
   ```bash
   npm install

3. Set up environment variables:
   Create a .env file in the root directory with the following:
   ```bash
   DATABASE_URL=postgresql://postgres:<password>@localhost:5432/blogapp?schema=public  
   JWT_SECRET=your_secret_key  
   PORT=your_port

   SUPERADMIN_USERNAME="superadmin"
   SUPERADMIN_EMAIL="superadmin@gmail.com"
   SUPERADMIN_PASSWORD="admin123"

4. Migrate the database:
   ```bash
   npx prisma generate

5. Run database migrations:
   ```bash
   npx prisma migrate dev

6. Seed the database with Super Admin user:
   Run the following command to seed the Super Admin user:
   ```bash
   npx ts-node src/scripts/seedSuperAdmin.ts

7. Start the server:
   ```bash
   npm run dev

## API Documentation

Swagger has been integrated to provide a detailed, interactive API documentation.

### Accessing Swagger Documentation

1. **Start the server**:
   Run the following command to start the server:
   ```bash
   npm run dev
2. Open your browser and navigate to:
   ```bash
   http://localhost:<PORT>/api-docs

## API Endpoints

### Authentication
- **Register**: `POST /api/users/register`
- **Login**: `POST /api/users/login`

### Blog Posts
- **Create Post**: `POST /api/posts`
- **Get All Posts**: `GET /api/posts`
- **Get Post by ID**: `GET /api/posts/:id`
- **Update Post**: `PUT /api/posts/:id`
- **Delete Post**: `DELETE /api/posts/:id`

### Comments
- **Add Comment**: `POST /api/posts/:postId/comments`
- **Update Comment**: `PATCH /api/posts/delete/:commentId`
- **Delete Comment**: `DELETE /api/posts/delete/:commentId`
- **Get Comments**: `GET /api/posts/:postId/comments`

### Image Upload
- **Upload Image**: `POST /api/posts/:postId/images`
- **Update Image**: `PUT /api/posts/:postId/images/:imageId`
- **Delete Image**: `DELETE /api/posts/:postId/images/:imageId`

### User Profiles
- **View Profile**: `GET /api/users/profile`
- **Update Profile**: `PATCH /api/users/profile`

### Admin Access (Super Admin)
- **View All Users**: `GET /api/users`
- **Delete User**: `DELETE /api/users/:id`
- **View a User by ID**: `GET /api/users/:id`
  Fetched a user by their ID, along with their posts and related images.


## Database Design
You can view the **[Database Design](https://docs.google.com/spreadsheets/d/1TS0P98fkaPfpy-1nxk1lgsul3GFN-E5cANbp7bhFVEA/edit?gid=0#gid=0)** on Google Sheets for a detailed structure of the database.




<p align="center">
  <img src="https://res.cloudinary.com/dudarfssg/image/upload/c_crop,ar_16:9/v1757495999/readify_logo_2_1_xiihak.png" alt="Readify Logo" width="250"/>
  <h1 style="text-align:center">READIFY</h1>
</p>

**Readify** is a library management system built with **Node.js** and **Express**, with plans to be extended into a fullstack application including a modern frontend UI.

---

## Project Overview

Readify provides an online library platform where admins can manage books and users can browse, preview, download, rate, and review books. The system is designed to be scalable, with clear separation of concerns and a modular architecture.

---

## ✨ Features (Work in Progress)

* [x] Basic backend setup (Node.js + Express)
* [x] Centralized error handling
* [ ] Book management (add, delete by admin)
* [ ] User management (CRUD, profile, password reset)
* [x] Authentication & Authorization (JWT)
* [ ] Upload files (image, pdf)
* [x] Role-based access control (Admin, User)
* [x] API features (search, filtering, pagination, sorting, projection)
* [ ] Book preview system (read book in a small preview window)
* [ ] Book download functionality
* [ ] Ratings system (users can rate books)
* [ ] Reviews system (users can add reviews on books)
* [ ] Admin dashboard (basic statistics, book/user management)
* [ ] API documentation (Swagger/Postman)
* [ ] Responsive frontend UI (HTML, CSS, Bootstrap)

---

## 🛠 Tech Stack

* **Backend:** Node.js, Express
* **Frontend:** HTML, CSS, Bootstrap
* **Database:** MongoDB (Mongoose)
* **Package Manager:** pnpm
* **Tools:** ESLint, Prettier, Git

---

## 📂 Folder Structure

```bash
backend/
│
├── src/
│   ├── config/            # Configuration files
│   ├── middlewares/       # Express middlewares
│   ├── modules/
│   │   ├── book/          # Book module (controller, model, route)
│   │   ├── user/          # User module (controller, model, route)
│   │   ├── category/      # Category module
│   │   └── review/        # Review module
│   └── utils/             # Utility functions
│       └── error/         # Error handling (AppError, handlers)
│
├── app.js                 # Express app setup
├── server.js              # Server entry point
└── package.json
```

---

## 📌 API Endpoints (Planned)

| Resource | Method | Endpoint                       | Description                      |
| -------- | ------ | ------------------------------ | -------------------------------- |
| Books    | GET    | `/api/v1/books`                | Get all books                    |
| Books    | POST   | `/api/v1/books`                | Add a new book (admin only)      |
| Books    | PUT    | `/api/v1/books/:id`            | Edit a book (admin only)         |
| Books    | DELETE | `/api/v1/books/:id`            | Delete a book (admin only)       |
| Books    | GET    | `/api/v1/books/:id/preview`    | Preview book content             |
| Books    | GET    | `/api/v1/books/:id/download`   | Download a book                  |
| Auth     | POST   | `/api/v1/auth/signup`          | Register a new user              |
| Auth     | POST   | `/api/v1/auth/login`           | Login                            |
| Auth     | POST   | `/api/v1/auth/forgot-password` | Request password reset link      |
| Auth     | PATCH  | `/api/v1/auth/reset-password`  | Reset password with token        |
| Auth     | PATCH  | `/api/v1/auth/update-password` | Update password (logged-in user) |
| Users    | GET    | `/api/v1/users`                | Get all users (admin only)       |
| Users    | POST   | `/api/v1/users`                | Add a new user (admin only)      |
| Users    | DELETE | `/api/v1/users/:id`            | Delete a user (admin only)       |
| Reviews  | GET    | `/api/v1/reviews`              | Get all reviews on books         |
| Reviews  | POST   | `/api/v1/reviews`              | Add a review on a book           |
| Reviews  | PUT    | `/api/v1/reviews/:id`          | Edit a review (owner only)       |
| Reviews  | DELETE | `/api/v1/reviews/:id`          | Delete a review (admin or owner) |

*(More endpoints will be added as development continues...)*


---
## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/amrmohamed-dev/Readify.git
   ```

2. **Navigate to the backend folder & install dependencies**

   ```bash
   cd backend
   pnpm install
   ```

3. **Run the project in development mode**

   ```bash
   pnpm dev
   ```

4. **Run the project in production mode**

   ```bash
   pnpm prod
   ```

5. **Start the project normally**

   ```bash
   pnpm start
   ```

6. **Debug the project**

   ```bash
   pnpm debug
   ```

---

## License

This project is licensed under the MIT License.

---

**Developed by [Amr Mohammed](https://github.com/amrmohamed-dev/)**
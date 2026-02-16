# ZeroHunger Server

This is the backend server for the **ZeroHunger MERN project**, built with **Node.js** and **Express**. It connects to MongoDB using Mongoose.

---

## Dependencies

- **express** (^5.2.1) - Web framework for building APIs and handling routes

- **mongoose** (^9.2.1) - MongoDB object modeling tool

- **dotenv** (^17.3.1) - Loads environment variables from `.env`

- **cors** (^2.8.6) - Enables cross-origin requests (important for frontend integration)

- **nodemon** (^3.1.11) - Automatically restarts the server on file changes

---

## Project Structure

```
ZeroHunger/server/
|__ node_modules/       # Project dependencies
|__ src/                # Source code
│   |__ modules/        # Models, controllers and routes
│   |__ server.js       # Entry point for the Express application
|   
|__.env                # Environment variables
|__package.json        # Project metadata and dependencies
|__package-lock.json   
|__README.md           # Project documentation
```

---

## Scripts
Defined in `package.json`:

- `npm run dev` - Starts the server with **nodemon** (development mode)

- `npm start` - Starts the server with **node** (production mode)

---

## Getting Started

1. Install dependencies:
   ```bash
   npm install

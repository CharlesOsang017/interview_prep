import "dotenv/config";
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.route.js";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


const app = express()

// Middleware to handle CORS
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

// middleware
app.use(express.json())

// Routes
app.use("/api/auth", authRoutes)
// app.use("/api/sessions", sessionRoutes)
// app.use("/api/questions", questionRoutes)


// app.use("/api/ai/generate-questions", protect, generateInterviewQuestions)
// app.use("/api/ai/generate-explanation", protect, generateConceptExplanation)
// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    connectDB()
})
import "dotenv/config";
import express from 'express'
import cors from 'cors'
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import sessionRoutes from "./routes/session.route.js";
import questionRoutes from "./routes/question.route.js";
import { protect } from "./middlewares/auth.middleware.js";
import { generateConceptExplanation, generateInterviewQuestions } from "./controllers/ai.controller.js";

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
app.use("/api/sessions", sessionRoutes)
app.use("/api/questions", questionRoutes)


app.use("/api/ai/generate-questions", protect, generateInterviewQuestions)
app.use("/api/ai/generate-explanation", protect, generateConceptExplanation)

// start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    connectDB()
})
import express from "express";
import {
  addQuestionsToSession,
  togglePinQuestion,
  updateQuestionNote,
  deleteQuestionNote,
  explainQuestion,
  generateAnswerTip,
} from "../controllers/question.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/add", protect, addQuestionsToSession);
router.post("/:id/pin", protect, togglePinQuestion);
router.post("/:id/note", protect, updateQuestionNote);
router.delete("/:id/note", protect, deleteQuestionNote);
router.post("/:id/explain", protect, explainQuestion);
router.post("/:id/answer-tip", protect, generateAnswerTip);

export default router;

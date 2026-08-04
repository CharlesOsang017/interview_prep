// @desc Add questions to an existing session
// @route POST /api/questions/add

import { GoogleGenAI } from "@google/genai";
import Session from "../models/session.model.js";
import Question from "../models/question.model.js";
import { conceptExplainPrompt, answerTipPrompt } from "../utils/prompts.js";

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

// @access Private
export const addQuestionsToSession = async (req, res) => {
  try {
    const { sessionId, questions } = req.body;
    if (!sessionId || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ message: "Invalid input data" });
    }
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    //   Create new questions
    const createQuestions = await Question.insertMany(
      questions.map((q) => ({
        session: sessionId,
        question: q.question,
        answer: q.answer,
      })),
    );
    // Update session to include new question IDs
    session.questions.push(...createQuestions.map((q) => q._id));
    await session.save();

    res.status(201).json(createQuestions);
  } catch (error) {
    console.log("error in addQuestionsToSession", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @des Pin or unpin a question
// @route POST /api/questions/:id/pin
// @access Private
export const togglePinQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    question.isPinned = !question.isPinned;
    await question.save();
    res.status(200).json({ success: true, question });
  } catch (error) {
    console.log("error in togglePinQuestion", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update a note for a question
// @route POST /api/questions/:id/note
// @access Private
export const updateQuestionNote = async (req, res) => {
  try {
    const { note } = req.body;
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const normalizedNote = typeof note === "string" ? note.trim() : "";
    question.note = normalizedNote;
    await question.save();
    res.status(200).json({ success: true, question });
  } catch (error) {
    console.log("error in updateQuestionNote", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Delete a note from a question
// @route DELETE /api/questions/:id/note
// @access Private
export const deleteQuestionNote = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    question.note = "";
    await question.save();
    res.status(200).json({ success: true, question });
  } catch (error) {
    console.log("error in deleteQuestionNote", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Gemini JSON parsing helpers (same as ai.controller.js) ───
function sanitizeJSON(rawText) {
  if (!rawText) return rawText;
  let cleaned = rawText.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
  try { JSON.parse(cleaned); return cleaned; } catch { /* continue */ }
  let result = "";
  let i = 0;
  while (i < cleaned.length) {
    if (cleaned[i] === "\\" && i + 1 < cleaned.length) {
      const next = cleaned[i + 1];
      if ('"\\/bfnrtu'.includes(next)) { result += "\\" + next; i += 2; }
      else { result += "\\\\" + next; i += 2; }
    } else { result += cleaned[i]; i++; }
  }
  cleaned = result;
  return cleaned;
}

function parseGeminiResponse(rawText) {
  const sanitized = sanitizeJSON(rawText);
  let data;
  try { data = JSON.parse(sanitized); }
  catch (parseErr) {
    const jsonMatch = sanitized.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
    if (jsonMatch) data = JSON.parse(jsonMatch[0]);
    else throw new Error(`Failed to parse Gemini response: ${parseErr.message}`);
  }
  return data;
}

// @desc Generate and persist concept explanation for a question (one-time)
// @route POST /api/questions/:id/explain
// @access Private
export const explainQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // If already explained, return persisted data (no new API call)
    if (question.explanation?.title && question.explanation?.explanation) {
      return res.status(200).json({ success: true, question });
    }

    // Generate explanation via AI
    const prompt = conceptExplainPrompt(question.question);
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    const data = parseGeminiResponse(response.text);

    // Persist the explanation
    question.explanation = {
      title: data.title || '',
      explanation: data.explanation || '',
    };
    await question.save();

    res.status(200).json({ success: true, question });
  } catch (error) {
    console.log("error in explainQuestion", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Generate and persist answer tips for a question (one-time)
// @route POST /api/questions/:id/answer-tip
// @access Private
export const generateAnswerTip = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // If already have a tip, return persisted data (no new API call)
    if (question.answerTip) {
      return res.status(200).json({ success: true, question });
    }

    // Generate answer tip via AI
    const prompt = answerTipPrompt(question.question);
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    const data = parseGeminiResponse(response.text);

    // Persist the tip
    question.answerTip = data.tip || '';
    await question.save();

    res.status(200).json({ success: true, question });
  } catch (error) {
    console.log("error in generateAnswerTip", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

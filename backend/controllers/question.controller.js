// @desc Add questional questions to an existing session
// @route POST /api/questions/add

import Session from "../models/session.model.js";
import Question from "../models/question.model.js";

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
    const {note} = req.body;
    const question = await Question.findById(req.params.id);
    if(!question){
      return res.status(404).json({message: "Question not found"});
    }
    question.note = note || "";
    await question.save();
    res.status(200).json({success: true, question});
  } catch (error) {
    console.log("error in updateQuestionNote", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

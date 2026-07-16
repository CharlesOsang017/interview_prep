import Question from "../models/question.model.js";
import Session from "../models/session.model.js";

// desc Create a new session and linked questions
// @route POST /api/sessions/create
// @access Private
export const createSession = async (req, res) => {
  try {
    const { role, experience, topicsToFocusOn, questions, description } =
      req.body;
    const userId = req.user._id; // Assuming you have a middleware setting req.user

    // Create session
    const session = new Session({
      user: userId,
      role,
      experience,
      topicsToFocusOn,
      questions,
      description,
    });

    const questionDocs = await Promise.all(
      questions.map(async (q) => {
        const question = await Question.create({
          session: session._id,
          question: q.question,
          answer: q.answer,
        });
        return question._id;
      }),
    );

    session.questions = questionDocs;
    await session.save();

    res.status(201).json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating session" });
  }
};

// desc Get all sessions for the logged in user
// @route GET /api/sessions/my-sessions
// @access Private
export const getMySessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate("questions");
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Error getting sessions" });
  }
};

// desc Get a single session by ID
// @route GET /api/sessions/:id
// @access Private
export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate({
        path: "questions",
        options: { sort: { isPinned: -1, createdAt: 1 } },
      })
      .exec();
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    res.status(200).json({success: true, session});
  } catch (error) {
    res.status(500).json({ message: "Error getting session" });
  }
};


// desc Delete a session
// @route DELETE /api/sessions/:id
// @access Private
export const deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // check if the logged-in user owns this season
    if(session.user.toString() !== req.user.id){
        return res.status(401).json({message: "Not authorized to delete this session"})
    }
    // First, delete all questions linked to this session
    await Question.deleteMany({ session: session._id });
    // Then, delete the session
    await session.deleteOne();
    res.status(200).json({ message: "Session deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting session" });
  }
};

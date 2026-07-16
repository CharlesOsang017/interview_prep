import { GoogleGenAI } from "@google/genai";
import { conceptExplainPrompt, questionAnswerPrompt } from "../utils/prompts.js";
import { response } from "express";


const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

// @desc Generate interview questions
// @route POST /api/ai/generate-questions
// @access Private
export const generateInterviewQuestions = async (req, res) => {
    try {
       const {role, experience, topicsToFocusOn, numberOfQuestions} = req.body;
       if(!role || !experience || !topicsToFocusOn || !numberOfQuestions){
        return res.status(400).json({message: "Invalid input data"});
       }
       const prompt = questionAnswerPrompt(role, experience, topicsToFocusOn, numberOfQuestions);
       const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
       });
       let rawText = response.text;

    //    clean it: Remove ```json and ``` from beginning and end
    const cleanText = rawText.replace(/^```json\s*/, "").replace(/```$/, "").trim();

    // Now safely parse it
    const data = JSON.parse(cleanText);
    
       res.status(200).json(data);
    } catch (error) {
        console.log("error in generateInterviewQuestions", error.message);
        res.status(500).json({success: false, message: error.message});
    }
}

// @desc Generate concept explanation
// @route POST /api/ai/generate-explanation
// @access Private
export const generateConceptExplanation = async (req, res) => {
    try {
       const {question} = req.body;
       if(!question){
        return res.status(400).json({message: "Missing required fields"})
       }
       const prompt = conceptExplainPrompt(question);
       const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
       })
       let rawText = response.text;
       const cleanedText = rawText.replace(/^```json\s*/, "").replace(/```$/, "").trim();
       const data = JSON.parse(cleanedText);
       res.status(200).json(data);
    } catch (error) {
        console.log("error in generateConceptExplanation", error.message);
        res.status(500).json({success: false, message: error.message});
    }
}

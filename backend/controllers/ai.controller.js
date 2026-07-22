import { GoogleGenAI } from "@google/genai";
import { conceptExplainPrompt, questionAnswerPrompt } from "../utils/prompts.js";


const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

/**
 * Sanitize a raw text string containing JSON to handle common Gemini quirks:
 * - Bad escape sequences like \d, \s, \n (literal inside a string, not actual newline)
 * - Triple-backtick fences around the JSON
 * - Trailing commas
 * - Unquoted control characters
 * Returns a clean string ready for JSON.parse.
 */
function sanitizeJSON(rawText) {
  if (!rawText) return rawText;

  // Step 1: Remove triple-backtick fenced code blocks (```json ... ``` or just ``` ... ```)
  let cleaned = rawText.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();

  // Step 2: Try JSON.parse directly — if it works, no sanitization needed
  try {
    JSON.parse(cleaned);
    return cleaned;
  } catch {
    // fall through — we need to sanitize
  }

  // Step 3: Repair bad escape sequences.
  // Valid JSON escape chars: " \ / b f n r t u.
  // Any \x where x is NOT one of those valid chars needs its backslash escaped.
  // We walk char-by-char to handle this precisely.
  let result = "";
  let i = 0;
  while (i < cleaned.length) {
    if (cleaned[i] === "\\" && i + 1 < cleaned.length) {
      const next = cleaned[i + 1];
      // valid JSON escape characters
      if ('"\\/bfnrtu'.includes(next)) {
        // Keep as-is — it's valid JSON
        result += "\\" + next;
        i += 2;
      } else {
        // Invalid escape — escape the backslash
        result += "\\\\" + next;
        i += 2;
      }
    } else {
      result += cleaned[i];
      i++;
    }
  }
  cleaned = result;

  return cleaned;
}

/**
 * Parse Gemini JSON response with robust error handling.
 */
function parseGeminiResponse(rawText) {
  const sanitized = sanitizeJSON(rawText);

  // Attempt to parse
  let data;
  try {
    data = JSON.parse(sanitized);
  } catch (parseErr) {
    // Last resort: try to find any JSON-like structure with regex
    const jsonMatch = sanitized.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
    if (jsonMatch) {
      data = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error(`Failed to parse Gemini response: ${parseErr.message}`);
    }
  }

  return data;
}

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
        model: "gemini-3.5-flash-lite",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
       });
       const rawText = response.text;
       const data = parseGeminiResponse(rawText);
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
        model: "gemini-3.5-flash-lite",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
       });
       const rawText = response.text;
       const data = parseGeminiResponse(rawText);
       res.status(200).json(data);
    } catch (error) {
        console.log("error in generateConceptExplanation", error.message);
        res.status(500).json({success: false, message: error.message});
    }
}

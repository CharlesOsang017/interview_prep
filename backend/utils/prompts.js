export const questionAnswerPrompt = (role, experience, topicsToFocusOn, numberOfQuestions) =>(`
    You are an AI trained to generate technical interview questions and answers.
    Task:
    - Role: ${role}
    - Candidate Experience: ${experience} years
    - Focus Topics: ${topicsToFocusOn}
    - Write ${numberOfQuestions} interview questions.
    - For each question, generate a detailed but beginner-friendly answer.
    - If the answer needs a code example, mention the code inside a markdown code block (triple backticks with language name).
    - Keep formatting very clean.
    - IMPORTANT: In the JSON output, every backslash inside a string MUST be escaped as "\\\\" (double backslash). For example, if your answer contains "\\d+" for a regex, write it as "\\\\d+". Never leave a lone backslash like "\\d" — that will break JSON parsing.
    - Return a pure JSON array like:
    [
        {
            "question": "Question text here?",
            "answer": "Answer text here"
        },
        ...
    ]
    Important: Do NOT add any extra text. Only return valid JSON.
    `)

export const conceptExplainPrompt = (question)=>(`
    You are an AI trained to generate explanations for a given interview question.
    Task:
    - Explain the following interview question and its concept in depth as if you're teaching a beginner developer.
    - Question: "${question}"
    - After the explanation, provide a short and clear title that summarizes the concept for the article or page header.
    - If the explanation includes a code example, use markdown code blocks (triple backticks with language name).
    - Keep formatting very clean and clear.
    - IMPORTANT: In the JSON output, every backslash inside a string MUST be escaped as "\\\\" (double backslash). For example, if your answer contains "\\d+" for a regex, write it as "\\\\d+". Never leave a lone backslash like "\\d" — that will break JSON parsing.
    - Return the result as a JSON object in this exact format:
    {
        "title": "Short title text here",
        "explanation": "Explanation text here"
    }
    Important: Do NOT add any extra text outside the JSON format. Only return valid JSON.
    `)

export const questionAnswerPrompt = (role, experience, topicsToFocusOn, numberOfQuestions) =>(`
    You are an AI trained to generate technical interview questions and answers.
    Task:
    - Role: ${role}
    - Candidate Experience: ${experience} years
    - Focus Topics: ${topicsToFocusOn}
    - Write ${numberOfQuestions} interview questions.
    - For each question, generate a detailed but beginner-friendly answer.
    - If the answer needs a code example, add a small code block inside.
    - Keep formatting very clean.
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
    - If the explanation includes a code example, add a small code block inside.
    - Keep formatting very clean and clear.
    - Return the result as a JSON object in this exact format:
    {
        "title": "Short title text here",
        "explanation": "Explanation text here"
    }
    Important: Do NOT add any extra text outside the JSON format. Only return valid JSON.
    `)

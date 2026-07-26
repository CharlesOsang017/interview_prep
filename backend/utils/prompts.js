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
    - Explain the following interview question and its underlying concept in depth. The audience is an intermediate developer — be precise, avoid hand-holding, and focus on the core concepts.
    - Question: "${question}"
    - After the explanation, provide a short and clear title that summarizes the concept for the article or page header.
    - Use concrete, concise examples to illustrate the concept. Include code snippets where relevant using markdown code blocks (triple backticks with language name).
    - Keep the explanation tightly scoped to the concepts being asked about. Do not pad with general advice or motivation.
    - IMPORTANT: In the JSON output, every backslash inside a string MUST be escaped as "\\\\" (double backslash). For example, if your answer contains "\\d+" for a regex, write it as "\\\\d+". Never leave a lone backslash like "\\d" — that will break JSON parsing.
    - Return the result as a JSON object in this exact format:
    {
        "title": "Short title text here",
        "explanation": "Explanation text here"
    }
    Important: Do NOT add any extra text outside the JSON format. Only return valid JSON.
    `)

export const answerTipPrompt = (question)=>(`
    You are an AI interview coach. Given the following interview question, provide actionable tips on how to answer it effectively in an interview.

    Question: "${question}"

    Consider:
    - What the interviewer is really looking for with this question
    - How to structure the answer (e.g., STAR method for behavioral, problem-solution-impact for technical)
    - Key points to include
    - Common mistakes to avoid
    - Whether the answer should focus on technical depth, behavioral examples, or a mix of both

    Keep the tips concise, practical, and focused on helping the candidate deliver a strong, confident answer. Use markdown for formatting if helpful (bold, bullet points, etc.).

    Return the result as a JSON object in this exact format:
    {
        "tip": "Your answer tips here"
    }

    IMPORTANT: In the JSON output, every backslash inside a string MUST be escaped as "\\\\" (double backslash).
    Only return valid JSON. No extra text.
    `)

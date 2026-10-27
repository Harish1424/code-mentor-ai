const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// =========================
// CODE REVIEW
// =========================
const reviewCode = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide code to review.",
      });
    }

    const prompt = `
You are CodeMentor AI, an expert programming mentor.

Review the following code.

Provide:
1. Problems or bugs
2. Code quality issues
3. Security issues if any
4. Performance improvements
5. A corrected/improved version

Explain everything in a simple way that a beginner can understand.

Code:
${code}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
    });

    res.json({
      success: true,
      review: response.text,
    });
  } catch (error) {
    console.error("AI Review Error:", error);

    res.status(500).json({
      success: false,
      message: "AI code review failed.",
      error: error.message,
    });
  }
};

// =========================
// EXPLAIN CODE
// =========================
const explainCode = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide code to explain.",
      });
    }

    const prompt = `
You are CodeMentor AI, an expert programming teacher.

Explain the following code in a simple and beginner-friendly way.

Provide:
1. What the code does
2. Step-by-step explanation
3. Explanation of important functions, variables, and logic
4. Example of how the code works
5. Any important concepts the beginner should understand

Do not make the explanation unnecessarily complicated.

Code:
${code}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
    });

    res.json({
      success: true,
      explanation: response.text,
    });
  } catch (error) {
    console.error("AI Explain Error:", error);

    res.status(500).json({
      success: false,
      message: "AI code explanation failed.",
      error: error.message,
    });
  }
};
// =========================
// DEBUG CODE
// =========================
const debugCode = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide code to debug.",
      });
    }

    const prompt = `
You are CodeMentor AI, an expert programming debugger.

Analyze the following code and help the user debug it.

Provide:
1. Errors or bugs in the code
2. Explain why each error happens
3. Corrected version of the code
4. Explain what you changed
5. Give simple beginner-friendly advice to avoid similar errors

Code:
${code}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
    });

    res.json({
      success: true,
      debug: response.text,
    });
  } catch (error) {
    console.error("AI Debug Error:", error);

    res.status(500).json({
      success: false,
      message: "AI code debugging failed.",
      error: error.message,
    });
  }
};
// =========================
// IMPROVE CODE
// =========================
const improveCode = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide code to improve.",
      });
    }

    const prompt = `
You are CodeMentor AI, an expert software engineer and programming mentor.

Improve the following code while preserving its original purpose and behavior.

Provide:

1. Improved version of the code
2. Readability improvements
3. Performance improvements where appropriate
4. Better coding practices
5. Explanation of the important changes
6. Any trade-offs or things the beginner should understand

Important:
- Do not change the intended functionality.
- Do not add unnecessary complexity.
- Keep the result beginner-friendly.
- If the original code is already good, say so and make only useful improvements.

Code:
${code}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
    });

    res.json({
      success: true,
      improvedCode: response.text,
    });
  } catch (error) {
    console.error("AI Improve Error:", error);

    res.status(500).json({
      success: false,
      message: "AI code improvement failed.",
      error: error.message,
    });
  }
};

module.exports = {
  reviewCode,
  explainCode,
  debugCode,
  improveCode,
};
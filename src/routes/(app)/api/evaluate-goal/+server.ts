import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { json } from "@sveltejs/kit";

const apiKey = process.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

const generationConfig = {
  temperature: 0.5,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export const POST = async ({ request }) => {
  try {
    const { target, evaluation } = await request.json();

    if (!target || !evaluation) {
      return json(
        { error: "Target and evaluation are required." },
        { status: 400 }
      );
    }

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              text: `The target is: "${target}". Based on the following evaluation: "${evaluation}", analyze whether the goal has been achieved. Your explanation must:
1. Ensure all provided data is evaluated strictly against the target criteria, avoiding assumptions or misinterpretations.
2. Verify that each element of the target (quantitative and qualitative) is addressed explicitly, and confirm whether the data satisfies, exceeds, or falls short of the requirements.
3. Highlight any inconsistencies, missing details, or misalignments between the evaluation, the data, and the target criteria.
4. Avoid introducing unrelated information or interpretations beyond what is provided in the target or data.
5. Be meticolous with typographical errors, grammar, and punctuation.

Respond in a concise, logical paragraph that directly analyzes the data and evaluation. Do not use phrases such as "yes" or "no" to start the explanation. Avoid structured formats like bullet points, and focus solely on the provided details to ensure clarity and accuracy.`,
            },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage(
      "Please analyze the evaluation and provide feedback."
    );

    if (!result?.response?.text) {
      return json(
        { error: "No response received from the AI model." },
        { status: 500 }
      );
    }

    return json({ aiEvaluation: result.response.text() });
  } catch (error) {
    console.error("Error during chat session:", error);
    return json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
};

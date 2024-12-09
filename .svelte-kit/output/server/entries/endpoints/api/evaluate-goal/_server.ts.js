import { GoogleGenerativeAI } from "@google/generative-ai";
import { j as json } from "../../../../chunks/index2.js";
const API_KEY = process.env.VITE_GEMINI_API_KEY || "";
const client = new GoogleGenerativeAI(API_KEY);
const POST = async ({ request }) => {
  try {
    const { target, evaluation } = await request.json();
    if (!target || !evaluation) {
      return json({ error: "Target and evaluation are required" }, { status: 400 });
    }
    const model = client.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `The target is: ${target}. Based on the following evaluation: "${evaluation}", determine if the goal has been achieved and explain why. only do the statement in paragraph form.`;
    const result = await model.generateContent(prompt);
    console.log("[DEBUG] AI API Response:", result);
    const aiEvaluation = result.response?.text?.();
    if (!aiEvaluation) {
      throw new Error("No response received from the AI model.");
    }
    return json({ aiEvaluation });
  } catch (error) {
    console.error("[ERROR] AI API Error:", error);
    return json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
};
export {
  POST
};

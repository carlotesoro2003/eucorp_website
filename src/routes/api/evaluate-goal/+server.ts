import { GoogleGenerativeAI } from '@google/generative-ai';
import { json } from '@sveltejs/kit';

const API_KEY = process.env.VITE_GEMINI_API_KEY || '';
const client = new GoogleGenerativeAI(API_KEY);

export const POST = async ({ request }: { request: Request }) => {
    try {
        const { target, evaluation } = await request.json();

        if (!target || !evaluation) {
            return json({ error: 'Target and evaluation are required' }, { status: 400 });
        }

        const model = client.getGenerativeModel({ model: 'gemini-pro' });
        const prompt = `The target is: ${target}. Based on the following evaluation: "${evaluation}", determine if the goal has been achieved and explain why. only do the statement in paragraph form.`;

        const result = await model.generateContent(prompt);

        console.log('[DEBUG] AI API Response:', result);

        const aiEvaluation =  result.response?.text?.(); // Extract the text
        if (!aiEvaluation) {
            throw new Error('No response received from the AI model.');
        }

        return json({ aiEvaluation });
    } catch (error) {
        console.error('[ERROR] AI API Error:', error as Error);
        return json({ error: 'Internal Server Error', details: (error as Error).message }, { status: 500 });
    }
};

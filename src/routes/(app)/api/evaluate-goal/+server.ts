import { GoogleGenerativeAI } from '@google/generative-ai';
import { json } from '@sveltejs/kit';

const API_KEY = process.env.VITE_GEMINI_API_KEY || '';
const client = new GoogleGenerativeAI(API_KEY);

export const POST = async ({ request }: { request: Request }) => {
    try {
        const { target, evaluation } = await request.json();

        if (!target || !evaluation) {
            return json(
                { error: 'Target and evaluation are required' },
                { status: 400 }
            );
        }

        const model = client.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `The target is: ${target}. Based on the following evaluation: "${evaluation}", analyze whether the goal has been achieved. Your explanation must:
1. Ensure all provided data is evaluated strictly against the target criteria, avoiding assumptions or misinterpretations.
2. Verify that each element of the target (quantitative and qualitative) is addressed explicitly, and confirm whether the data satisfies, exceeds, or falls short of the requirements.
3. Highlight any inconsistencies, missing details, or misalignments between the evaluation, the data, and the target criteria.
4. Avoid introducing unrelated information or interpretations beyond what is provided in the target or data.

Respond in a concise, logical paragraph that directly analyzes the data and evaluation. Do not use phrases such as "yes" or "no" to start the explanation. Avoid structured formats like bullet points, and focus solely on the provided details to ensure clarity and accuracy.`;

        // const prompt = `The target is: ${target}. Based on the following actions taken: "${evaluation}", analyze whether the goal has been achieved. Ensure your reasoning strictly verifies the alignment of context (e.g., categories and relevance) and that all numerical targets are fully met without falling short. Provide a concise and clear explanation in paragraph form, ensuring strict adherence to the provided details. Avoid structured formats like bullet points or lists, and do not start with phrases such as "yes" or "no". Highlight any misalignments, shortfalls, or uncertainties in the information while keeping the response precise and focused.`;

        // const prompt = `The target is: ${target}. Based on the following evaluation: "${evaluation}", analyze whether the goal has been achieved. Ensure that your reasoning verifies both the alignment of the context (e.g., categories and relevance) and the numbers against the target. Provide a concise and clear explanation in paragraph form, ensuring strict adherence to the provided details. Avoid structured formats like bullet points or lists, and do not start with phrases such as "yes" or "no". Highlight any misalignments, gaps, or uncertainties in the information while keeping the response precise and focused.`;

        // const prompt = `The target is: ${target}. Based on the following evaluation: "${evaluation}", analyze whether the goal has been achieved. Provide a clear and detailed explanation in paragraph form, ensuring your reasoning is directly based on the provided information. Do not use structured formats like bullet points or lists, and avoid beginning the explanation with phrases such as "yes" or "no". Focus on logical analysis and clarity. Keep and concise and focused`;

        const result = await model.generateContent(prompt);

        console.log('[DEBUG] AI API Response:', result);

        const aiEvaluation = result.response?.text?.(); // Extract the text
        if (!aiEvaluation) {
            throw new Error('No response received from the AI model.');
        }

        return json({ aiEvaluation });
    } catch (error) {
        console.error('[ERROR] AI API Error:', error as Error);
        return json(
            {
                error: 'Internal Server Error',
                details: (error as Error).message,
            },
            { status: 500 }
        );
    }
};

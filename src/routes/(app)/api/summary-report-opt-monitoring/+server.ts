import { GoogleGenerativeAI } from '@google/generative-ai';
import { json } from '@sveltejs/kit';

// Load environment variable for API key
const API_KEY = process.env.VITE_GEMINI_API_KEY || '';

// Initialize the Google Generative AI client
const client = new GoogleGenerativeAI(API_KEY);

export const POST = async ({ request }: { request: Request }) => {
    try {
        const { opportunities } = await request.json();

        if (!opportunities || !Array.isArray(opportunities) || opportunities.length === 0) {
            return json(
                { error: 'Opportunities data is required and must be a non-empty array.' },
                { status: 400 }
            );
        }

        // Format the opportunities into descriptive text for the AI prompt
        const formattedOpportunities = opportunities
            .map(
                (opportunity) =>
                    `Opportunity: "${opportunity.opt_statement}". The key performance indicator (KPI) was "${opportunity.kpi}". The planned actions were: "${opportunity.planned_actions}". This opportunity was ${opportunity.achieved ? 'successfully achieved' : 'not achieved'}, with the following evaluation: "${opportunity.evaluation || 'Pending evaluation'}".`
            )
            .join(' ');

        // AI prompt to generate a cohesive narrative summary
        const prompt = `
            You are a professional analyst tasked with creating a summary report based on the provided opportunities monitoring data. Here is the data for the opportunities:
            \n${formattedOpportunities}\n
            Please write a detailed, cohesive, and professional narrative summarizing the overall performance of the opportunities. Highlight key achievements, areas needing improvement, and overall insights in essay format for stakeholders. 
            Only use paragraph form, avoid bullet points and unnecessary asterisks, and ensure the tone is formal and professional.
        `;

        // Generate the summary report using the AI model
        const model = client.getGenerativeModel({ model: 'gemini-pro' });
        const response = await model.generateContent(prompt);

        const summaryReport = response.response?.text?.();
        if (!summaryReport) {
            throw new Error('No response received from the AI model.');
        }

        return json({ summaryReport });
    } catch (error: any) {
        console.error('[ERROR] Error generating summary report for opportunities:', error);
        return json(
            { error: 'Internal Server Error', details: error.message || String(error) },
            { status: 500 }
        );
    }
};

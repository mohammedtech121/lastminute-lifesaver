export const config = {
  runtime: 'edge', // Using Edge runtime for lightning fast, error-free execution
};

export default async function handler(req) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    try {
        // Safe Edge-runtime compliant body extraction
        const { taskInput } = await req.json();

        if (!taskInput) {
            return new Response(JSON.stringify({ error: 'Missing taskInput parameter' }), { status: 400 });
        }

        const systemInstruction = "You are an autonomous productivity saving agent. The user will give a task/deadline. Break it down into a clean HTML format. Output: 1. **Priority Score** (High/Medium/Low based on context), 2. **Action Plan** (3 clear immediate actionable steps), 3. **Proactive Blocker** (One warning about what usually goes wrong or causes delay). Avoid conversational filler, output raw clean structured breakdown with HTML tags like <p>, <ul>, <li>.";

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `${systemInstruction}\n\nUser Task: ${taskInput}` }]
                }]
            })
        });

        const data = await response.json();
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: 'Internal Serverless Exception' }), { status: 500 });
    }
}
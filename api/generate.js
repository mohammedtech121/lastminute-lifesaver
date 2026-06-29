export default async function handler(req, res) {
    // Vercel me hum variable ka naam GEMINI_API_KEY rakhenge
    const apiKey = process.env.GEMINI_API_KEY; 

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { taskInput } = req.body;

    const systemInstruction = "You are an autonomous productivity saving agent. The user will give a task/deadline. Break it down into a clean HTML format. Output: 1. **Priority Score** (High/Medium/Low based on context), 2. **Action Plan** (3 clear immediate actionable steps), 3. **Proactive Blocker** (One warning about what usually goes wrong or causes delay). Avoid conversational filler, output raw clean structured breakdown with HTML tags like <p>, <ul>, <li>.";

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `${systemInstruction}\n\nUser Task: ${taskInput}` }]
                }]
            })
        });

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to communicate with Gemini API' });
    }
}
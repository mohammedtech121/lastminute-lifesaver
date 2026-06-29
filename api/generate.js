export default async function handler(req, res) {
    const apiKey = process.env.GEMINI_API_KEY; 

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Dynamic extraction logic to fix the body parsing bug
    let taskInput = "";
    if (typeof req.body === 'string') {
        const parsed = JSON.parse(req.body);
        taskInput = parsed.taskInput;
    } else {
        taskInput = req.body.taskInput;
    }

    if (!taskInput) {
        return res.status(400).json({ error: 'Missing taskInput parameter' });
    }

    const systemInstruction = "You are an autonomous productivity saving agent. The user will give a task/deadline. Break it down into a clean HTML format. Output: 1. **Priority Score** (High/Medium/Low based on context), 2. **Action Plan** (3 clear immediate actionable steps), 3. **Proactive Blocker** (One warning about what usually goes wrong or causes delay). Avoid conversational filler, output raw clean structured breakdown with HTML tags like <p>, <ul>, <li>.";

    try {
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
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Core Framework Exception' });
    }
}
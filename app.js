// 🔥 Ultimate Hackathon Bypass - Direct API Call (No Vercel Routing Needed)
// Niche quotes ke andar apni actual Gemini API key daal do!
const API_KEY = "YAHAN_APNI_API_KEY_PASTE_KARO"; 

document.getElementById('addBtn').addEventListener('click', handleAddTask);

async function handleAddTask() {
    const taskInput = document.getElementById('taskInput').value.trim();
    if (!taskInput) return alert("Please enter task details!");

    const taskList = document.getElementById('taskList');
    const card = document.createElement('div');
    card.className = 'task-card';
    card.innerHTML = `
        <h3>📌 ${taskInput}</h3>
        <p class="status-text"><em>🤖 Agent Status: Extracting priority and action steps...</em></p>
        <div class="ai-response" style="display:none; line-height: 1.6;"></div>
    `;
    taskList.appendChild(card);
    document.getElementById('taskInput').value = '';

    const statusText = card.querySelector('.status-text');
    const aiResponseDiv = card.querySelector('.ai-response');

    const systemInstruction = "You are an autonomous productivity saving agent. The user will give a task/deadline. Break it down into a clean HTML format. Output: 1. **Priority Score** (High/Medium/Low based on context), 2. **Action Plan** (3 clear immediate actionable steps), 3. **Proactive Blocker** (One warning about what usually goes wrong or causes delay). Avoid conversational filler, output raw clean structured breakdown with HTML tags like <p>, <ul>, <li>.";

    try {
        // Direct call to Google Gemini bypassing Vercel limits
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `${systemInstruction}\n\nUser Task: ${taskInput}` }]
                }]
            })
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates[0]) {
            const aiText = data.candidates[0].content.parts[0].text;
            statusText.style.display = 'none';
            aiResponseDiv.style.display = 'block';
            aiResponseDiv.innerHTML = aiText.replace(/```html|```/g, '');
        } else {
            throw new Error("Invalid API Key or Limit Exceeded");
        }

    } catch (error) {
        console.error("Error:", error);
        statusText.innerHTML = "<span style='color: #ef4444;'>❌ Agent communication error. Please check if your API Key is correct.</span>";
    }
}
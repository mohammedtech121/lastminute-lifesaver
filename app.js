document.getElementById('addBtn').addEventListener('click', handleAddTask);

async function handleAddTask() {
    const taskInput = document.getElementById('taskInput').value.trim();
    if (!taskInput) return alert("Please enter task details!");

    const taskList = document.getElementById('taskList');
    
    // Create UI Card container
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

    try {
        // Hitting our local Vercel serverless proxy endpoint
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ taskInput })
        });

        if (!response.ok) throw new Error('Failed to fetch data from API route');

        const data = await response.json();
        
        // Extracting text safely from Gemini response JSON structure
        const aiText = data.candidates[0].content.parts[0].text;
        
        // Clean out formatting wraps and inject HTML
        statusText.style.display = 'none';
        aiResponseDiv.style.display = 'block';
        aiResponseDiv.innerHTML = aiText.replace(/```html|```/g, '');

    } catch (error) {
        console.error("API Error:", error);
        statusText.innerHTML = "<span style='color: #ef4444;'>❌ Agent communication error. Run via Vercel CLI or check deployed version logs.</span>";
    }
}
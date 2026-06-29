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

    try {
        // Automatic serverless internal routing hit
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskInput })
        });

        if (!response.ok) throw new Error('Backend communication failure');

        const data = await response.json();
        const aiText = data.candidates[0].content.parts[0].text;
        
        statusText.style.display = 'none';
        aiResponseDiv.style.display = 'block';
        aiResponseDiv.innerHTML = aiText.replace(/```html|```/g, '');

    } catch (error) {
        console.error("API Error:", error);
        statusText.innerHTML = "<span style='color: #ef4444;'>❌ Agent communication error. Please check your network connection.</span>";
    }
}
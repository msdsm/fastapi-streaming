// JSON Streaming functionality

let reader = null;
let isStreaming = false;

async function startJsonStream() {
    const outputDiv = document.getElementById('output');
    const statusDiv = document.getElementById('status');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    
    if (isStreaming) {
        return;
    }
    
    isStreaming = true;
    startBtn.disabled = true;
    stopBtn.disabled = false;
    statusDiv.textContent = 'Starting stream...';
    outputDiv.innerHTML = '';
    
    try {
        const response = await fetch('/api/stream-json');
        reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        statusDiv.textContent = 'Streaming...';
        
        while (true) {
            const { done, value } = await reader.read();
            
            if (done) break;
            
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.trim());
            
            lines.forEach(line => {
                try {
                    const data = JSON.parse(line);
                    const itemElement = document.createElement('div');
                    itemElement.className = 'json-item';
                    itemElement.innerHTML = `
                        <strong>ID:</strong> ${data.id}<br>
                        <strong>Message:</strong> ${data.message}<br>
                        <strong>Timestamp:</strong> ${new Date(data.timestamp * 1000).toLocaleString()}
                    `;
                    outputDiv.appendChild(itemElement);
                    outputDiv.scrollTop = outputDiv.scrollHeight;
                } catch (e) {
                    console.error('JSON parsing error:', e);
                }
            });
        }
        
        statusDiv.textContent = 'Stream completed';
        
    } catch (error) {
        console.error('Streaming error:', error);
        statusDiv.textContent = 'Stream error';
    } finally {
        isStreaming = false;
        startBtn.disabled = false;
        stopBtn.disabled = true;
    }
}

function stopJsonStream() {
    if (reader) {
        reader.cancel();
        reader = null;
    }
    isStreaming = false;
    document.getElementById('startBtn').disabled = false;
    document.getElementById('stopBtn').disabled = true;
    document.getElementById('status').textContent = 'Stream stopped';
}

function clearJsonOutput() {
    document.getElementById('output').innerHTML = '';
    document.getElementById('status').textContent = 'Ready';
}

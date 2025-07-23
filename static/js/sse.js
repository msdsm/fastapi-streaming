// SSE (Server-Sent Events) functionality

let eventSource = null;

function startSSE() {
    const messagesDiv = document.getElementById('messages');
    const statusDiv = document.getElementById('status');
    
    if (eventSource) {
        eventSource.close();
    }
    
    statusDiv.textContent = 'Connecting...';
    messagesDiv.innerHTML = '';
    
    eventSource = new EventSource('/api/stream-sse');
    
    eventSource.onopen = function(event) {
        statusDiv.textContent = 'Connected - Receiving messages...';
    };
    
    eventSource.onmessage = function(event) {
        const data = JSON.parse(event.data);
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.innerHTML = `
            <strong>${data.timestamp}</strong>: ${data.message} 
            <span style="color: #666;">(Count: ${data.count})</span>
        `;
        messagesDiv.appendChild(messageElement);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    };
    
    eventSource.onerror = function(event) {
        console.error('SSE error:', event);
        statusDiv.textContent = 'Connection error';
        eventSource.close();
    };
}

function stopSSE() {
    if (eventSource) {
        eventSource.close();
        eventSource = null;
        document.getElementById('status').textContent = 'Disconnected';
    }
}

function clearMessages() {
    document.getElementById('messages').innerHTML = '';
    document.getElementById('status').textContent = 'Ready';
}

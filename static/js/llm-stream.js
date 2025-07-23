// LLM-like streaming functionality

let eventSource = null;
let isStreaming = false;

function updateStatus(message) {
    document.getElementById('status').textContent = message;
}

function updateButtons(streaming) {
    document.getElementById('startBtn').disabled = streaming;
    document.getElementById('stopBtn').disabled = !streaming;
    isStreaming = streaming;
}

async function startLLMStream() {
    const prompt = document.getElementById('prompt').value;
    const responseArea = document.getElementById('response-area');
    
    if (!prompt.trim()) {
        alert('Please enter a prompt');
        return;
    }
    
    updateButtons(true);
    updateStatus('Starting stream...');
    responseArea.innerHTML = '';
    
    try {
        eventSource = new EventSource(`/api/stream-llm-like?prompt=${encodeURIComponent(prompt)}`);
        
        eventSource.onmessage = function(event) {
            try {
                const data = JSON.parse(event.data);
                
                if (data.complete) {
                    updateStatus('Complete');
                    updateButtons(false);
                    responseArea.innerHTML = data.content;
                    eventSource.close();
                } else {
                    updateStatus('Responding...');
                    responseArea.innerHTML = data.content + '<span class="typing-cursor">|</span>';
                    responseArea.scrollTop = responseArea.scrollHeight;
                }
            } catch (e) {
                console.error('JSON parsing error:', e);
            }
        };
        
        eventSource.onerror = function(event) {
            console.error('EventSource error:', event);
            updateStatus('An error occurred');
            updateButtons(false);
            eventSource.close();
        };
        
    } catch (error) {
        console.error('Streaming error:', error);
        updateStatus('An error occurred');
        updateButtons(false);
    }
}

function stopLLMStream() {
    if (eventSource) {
        eventSource.close();
        updateStatus('Stopped');
        updateButtons(false);
    }
}

function clearLLMResponse() {
    document.getElementById('response-area').innerHTML = '';
    updateStatus('Ready');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Start streaming with Enter key
    const promptInput = document.getElementById('prompt');
    if (promptInput) {
        promptInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !isStreaming) {
                startLLMStream();
            }
        });
    }
});

// Chatbot UI Elements
const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const closeChat = document.querySelector('.close-chat');
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendMessage = document.getElementById('send-message');

// Knowledge Base
const knowledgeBase = {
    // Diet and Nutrition
    'diet': {
        keywords: ['diet', 'food', 'eat', 'nutrition', 'meal'],
        response: "For a balanced diet, focus on:\n• Lean proteins (chicken, fish, legumes)\n• Complex carbs (whole grains, vegetables)\n• Healthy fats (avocados, nuts, olive oil)\n• Stay hydrated with 8 glasses of water daily"
    },
    'protein': {
        keywords: ['protein', 'muscle', 'meat', 'vegetarian', 'vegan'],
        response: "Good protein sources:\n• Meat: Chicken, fish, lean beef\n• Vegetarian: Eggs, tofu, legumes\n• Vegan: Quinoa, lentils, chickpeas\nAim for 0.8-1g of protein per kg of body weight"
    },
    'calories': {
        keywords: ['calories', 'calorie', 'weight loss', 'deficit'],
        response: "Calorie guidelines:\n• Weight loss: 500 calorie deficit\n• Weight gain: 500 calorie surplus\n• Maintenance: Match your daily expenditure\nUse our calorie tracker to monitor your intake!"
    },
    
    // Exercise
    'workout': {
        keywords: ['workout', 'exercise', 'training', 'gym'],
        response: "Recommended workout structure:\n• 3-5 sessions per week\n• Mix cardio and strength training\n• Include rest days for recovery\n• Start with 30-45 minute sessions"
    },
    'cardio': {
        keywords: ['cardio', 'running', 'jogging', 'swimming'],
        response: "Cardio recommendations:\n• Start with 20-30 minutes\n• 3-5 times per week\n• Include mix of high and low intensity\n• Options: running, cycling, swimming, brisk walking"
    },
    'strength': {
        keywords: ['strength', 'weights', 'lifting', 'muscles'],
        response: "Strength training tips:\n• Focus on compound exercises\n• Start with bodyweight exercises\n• Gradually increase weights\n• Allow 48h recovery between muscle groups"
    },

    // Weight Management
    'weight loss': {
        keywords: ['weight loss', 'lose weight', 'fat loss', 'burning fat'],
        response: "Weight loss essentials:\n• Create calorie deficit\n• Increase protein intake\n• Regular exercise\n• Get adequate sleep\n• Stay hydrated\n• Be consistent"
    },
    'muscle gain': {
        keywords: ['muscle gain', 'bulk', 'building muscle', 'mass'],
        response: "Muscle building basics:\n• Eat calorie surplus\n• High protein intake\n• Progressive overload in training\n• Adequate rest and recovery\n• Focus on compound exercises"
    },

    // General Health
    'sleep': {
        keywords: ['sleep', 'rest', 'recovery', 'tired'],
        response: "Sleep recommendations:\n• Aim for 7-9 hours\n• Consistent sleep schedule\n• Dark, quiet environment\n• Avoid screens before bed\n• No caffeine late in day"
    },
    'motivation': {
        keywords: ['motivation', 'lazy', 'tired', 'dont want to'],
        response: "Staying motivated:\n• Set realistic goals\n• Track your progress\n• Find a workout buddy\n• Reward yourself\n• Remember why you started\n• Take progress photos"
    }
};

// Chatbot State
let isChatOpen = false;

// Toggle Chat Window
chatToggle.addEventListener('click', () => {
    isChatOpen = !isChatOpen;
    chatWindow.classList.toggle('active');
    if (isChatOpen && chatMessages.children.length === 0) {
        addMessage('bot', 'Hello! I\'m your virtual fitness assistant. How can I help you today? You can ask me about:\n• Diet and nutrition\n• Workout plans\n• Weight loss/gain\n• Exercise techniques\n• General health tips');
    }
});

closeChat.addEventListener('click', () => {
    isChatOpen = false;
    chatWindow.classList.remove('active');
});

// Send Message
sendMessage.addEventListener('click', handleUserMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleUserMessage();
    }
});

function handleUserMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessage('user', message);
    userInput.value = '';

    // Show typing indicator
    const typingIndicator = addTypingIndicator();

    // Process message and get response
    setTimeout(() => {
        typingIndicator.remove();
        const response = findResponse(message.toLowerCase());
        addMessage('bot', response);
    }, 1000); // Simulate processing time
}

function findResponse(message) {
    // Check each topic in knowledge base
    for (const topic of Object.values(knowledgeBase)) {
        if (topic.keywords.some(keyword => message.includes(keyword))) {
            return topic.response;
        }
    }

    // Default response if no match found
    return "I'm not sure about that, but I can help you with:\n• Diet and nutrition advice\n• Workout recommendations\n• Weight loss/gain tips\n• Exercise techniques\n• General health guidelines\n\nTry asking about one of these topics!";
}

function addMessage(sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('message', 'bot', 'typing');
    typingDiv.innerHTML = `
        <div class="message-content">
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typingDiv;
}

// Add some CSS for the chatbot
const style = document.createElement('style');
style.textContent = `
    .message {
        margin: 10px 0;
        max-width: 80%;
    }

    .message.user {
        margin-left: auto;
    }

    .message.bot {
        margin-right: auto;
    }

    .message-content {
        padding: 10px 15px;
        border-radius: 15px;
        background: #f0f0f0;
    }

    .message.user .message-content {
        background: var(--primary-color);
        color: white;
    }

    .typing-indicator {
        display: flex;
        gap: 5px;
    }

    .typing-indicator span {
        width: 8px;
        height: 8px;
        background: #666;
        border-radius: 50%;
        animation: typing 1s infinite ease-in-out;
    }

    .typing-indicator span:nth-child(2) {
        animation-delay: 0.2s;
    }

    .typing-indicator span:nth-child(3) {
        animation-delay: 0.4s;
    }

    @keyframes typing {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-5px);
        }
    }
`;
document.head.appendChild(style); 
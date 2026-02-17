// Google Gemini AI Service with Rate Limit Handling
import { GoogleGenAI } from '@google/genai';

const GEMINI_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Initialize SDK client
const ai = GEMINI_KEY ? new GoogleGenAI({ apiKey: GEMINI_KEY }) : null;

// Rate limit tracking
let rateLimitUntil = null;
let requestCount = 0;
const MAX_REQUESTS_PER_MINUTE = 15; // Free tier limit

const callGemini = async (prompt, options = {}) => {
  if (!ai) {
    console.warn('Gemini API key not configured');
    return null;
  }

  // Check if we're rate limited
  if (rateLimitUntil && Date.now() < rateLimitUntil) {
    const waitSeconds = Math.ceil((rateLimitUntil - Date.now()) / 1000);
    console.warn(`Rate limited. Please wait ${waitSeconds} seconds.`);
    return null;
  }

  // Check request count
  if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
    console.warn('Request limit reached. Using fallback responses.');
    return null;
  }

  try {
    requestCount++;
    
    const response = await ai.models.generateContent({
      model: 'gemini-pro',
      contents: prompt,
      generationConfig: {
        temperature: options.temperature || 0.7,
        maxOutputTokens: options.maxOutputTokens || 1024,
        topK: options.topK || 40,
        topP: options.topP || 0.95,
      },
    });

    // Check for blocked content
    if (response.promptFeedback?.blockReason) {
      console.warn(`Content blocked: ${response.promptFeedback.blockReason}`);
      return null;
    }

    // Check for valid response
    if (!response.text) {
      console.warn('No response generated');
      return null;
    }
    
    // Reset request count after successful request
    setTimeout(() => { requestCount = Math.max(0, requestCount - 1); }, 60000);
    
    return response.text;
  } catch (error) {
    // Handle quota/rate limit errors
    if (error.message?.includes('quota') || error.status === 429) {
      console.warn('Rate limit exceeded. Using fallback responses.');
      rateLimitUntil = Date.now() + 60000;
      return null;
    }
    
    console.error('Gemini error:', error);
    return null;
  }
};

const fallback = (msg) => {
  const m = msg.toLowerCase();
  
  // Greetings
  if (m.includes('hello') || m.includes('hi') || m.includes('hey')) {
    return "Hello! I'm your AI study assistant. I can help you understand concepts, generate quizzes, and answer your study questions. What would you like to learn about today?";
  }
  
  // Quiz requests
  if (m.includes('quiz') || m.includes('test') || m.includes('practice')) {
    return "I can help you generate practice quizzes! Just tell me the topic and difficulty level (easy, medium, or hard), and I'll create custom questions for you.";
  }
  
  // Explanation requests
  if (m.includes('explain') || m.includes('what is') || m.includes('how does')) {
    return "I'd be happy to explain that concept! Please provide more details about what you'd like to learn, and I'll break it down into easy-to-understand parts.";
  }
  
  // Study help
  if (m.includes('study') || m.includes('learn') || m.includes('help')) {
    return "I'm here to help you study! You can ask me to:\n\n• Explain concepts and topics\n• Generate practice quizzes\n• Create flashcards\n• Provide study tips\n• Answer specific questions\n\nWhat would you like to focus on?";
  }
  
  // Math/Science
  if (m.includes('math') || m.includes('science') || m.includes('physics') || m.includes('chemistry')) {
    return "I can help with math and science topics! Please ask me a specific question or tell me what concept you'd like to understand better.";
  }
  
  // Default response
  return "I'm your AI study assistant! I can help you with:\n\n• Understanding difficult concepts\n• Generating practice quizzes\n• Creating study materials\n• Answering your questions\n\nNote: I'm currently using fallback responses due to API rate limits. For best results, try again in a few minutes or ask specific questions that I can help with!";
};

export const sendMessageToAI = async (message, history = []) => {
  const ctx = history.slice(-3).map(m => `${m.type === 'user' ? 'User' : 'AI'}: ${m.text}`).join('\n');
  const prompt = `You are a helpful study assistant. Be concise and clear.\n${ctx}\nUser: ${message}\nAssistant:`;
  
  const response = await callGemini(prompt);
  
  // Use fallback if API fails or rate limited
  const finalResponse = response || fallback(message);
  
  return { 
    success: true, 
    message: finalResponse, 
    timestamp: new Date(),
    usingFallback: !response,
  };
};

export const generateQuiz = async (topic, difficulty = 'medium', count = 5) => {
  const prompt = `Create ${count} ${difficulty} multiple-choice questions about ${topic}. Return ONLY a JSON array with this format: [{"question":"...","options":["A","B","C","D"],"correctAnswer":0,"explanation":"..."}]`;
  const response = await callGemini(prompt);
  
  if (response) {
    try {
      const parsed = JSON.parse(response.match(/\[[\s\S]*\]/)?.[0] || '[]');
      if (parsed.length > 0) {
        return {
          success: true,
          quiz: {
            id: `quiz_${Date.now()}`,
            topic,
            difficulty,
            questions: parsed.slice(0, count).map((q, i) => ({ 
              id: `q${i + 1}`, 
              ...q, 
              difficulty 
            })),
            createdAt: new Date(),
          },
        };
      }
    } catch (e) {
      console.error('Parse error:', e);
    }
  }
  
  // Enhanced fallback with better sample questions
  const sampleQuestions = {
    easy: [
      { q: `What is the basic concept of ${topic}?`, a: 'Fundamental principle', b: 'Advanced theory', c: 'Complex algorithm', d: 'None of the above', correct: 0 },
      { q: `Which of these relates to ${topic}?`, a: 'Related concept A', b: 'Related concept B', c: 'Unrelated concept', d: 'All of the above', correct: 0 },
    ],
    medium: [
      { q: `How does ${topic} work in practice?`, a: 'Through systematic application', b: 'Random process', c: 'No specific method', d: 'Unknown', correct: 0 },
      { q: `What is an important aspect of ${topic}?`, a: 'Key principle', b: 'Minor detail', c: 'Irrelevant factor', d: 'Optional feature', correct: 0 },
    ],
    hard: [
      { q: `What are the advanced implications of ${topic}?`, a: 'Complex theoretical framework', b: 'Simple application', c: 'Basic concept', d: 'Elementary principle', correct: 0 },
      { q: `How does ${topic} integrate with related concepts?`, a: 'Through sophisticated mechanisms', b: 'No integration', c: 'Simple connection', d: 'Random association', correct: 0 },
    ],
  };
  
  const templates = sampleQuestions[difficulty] || sampleQuestions.medium;
  
  return {
    success: true,
    quiz: {
      id: `quiz_${Date.now()}`,
      topic,
      difficulty,
      questions: Array.from({ length: count }, (_, i) => {
        const template = templates[i % templates.length];
        return {
          id: `q${i + 1}`,
          question: template.q,
          options: [template.a, template.b, template.c, template.d],
          correctAnswer: template.correct,
          explanation: `This question tests your understanding of ${topic}. The correct answer demonstrates key knowledge in this area.`,
          difficulty,
        };
      }),
      createdAt: new Date(),
      usingFallback: true,
    },
  };
};

export const explainConcept = async (concept, level = 'beginner') => {
  const prompt = `Explain "${concept}" at ${level} level in 2-3 paragraphs.`;
  const explanation = await callGemini(prompt) || `Here's an explanation of "${concept}"...`;
  return { success: true, explanation, relatedTopics: ['Topic 1', 'Topic 2'] };
};

export const getStudySuggestions = async () => {
  return {
    success: true,
    suggestions: [
      { id: 1, title: 'Review weak areas', description: 'Focus on topics below 70%', priority: 'high' },
      { id: 2, title: 'Practice quizzes', description: 'Take 3 more quizzes this week', priority: 'medium' },
    ],
  };
};

export const generateFlashcards = async (topic, count = 10) => {
  return {
    success: true,
    flashcards: Array.from({ length: count }, (_, i) => ({
      id: `card_${i + 1}`,
      front: `Question ${i + 1} about ${topic}`,
      back: `Answer ${i + 1}`,
      topic,
    })),
  };
};

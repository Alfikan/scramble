// Google Gemini AI Service
const GEMINI_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

const callGemini = async (prompt) => {
  if (!GEMINI_KEY) return null;
  try {
    const res = await fetch(`${API_URL}?key=${GEMINI_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
      }),
    });
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text;
  } catch (e) {
    console.error('Gemini error:', e);
    return null;
  }
};

const fallback = (msg) => {
  const m = msg.toLowerCase();
  if (m.includes('hello') || m.includes('hi')) return "Hello! I'm your AI study assistant.";
  if (m.includes('quiz')) return "I can generate quizzes! What topic?";
  return "I'm here to help with your studies!";
};

export const sendMessageToAI = async (message, history = []) => {
  const ctx = history.slice(-5).map(m => `${m.type === 'user' ? 'User' : 'AI'}: ${m.text}`).join('\n');
  const prompt = `You are a study assistant.\n${ctx}\nUser: ${message}\nAssistant:`;
  const response = await callGemini(prompt) || fallback(message);
  return { success: true, message: response, timestamp: new Date() };
};

export const generateQuiz = async (topic, difficulty = 'medium', count = 5) => {
  const prompt = `Generate ${count} ${difficulty} multiple-choice questions about ${topic}. Format as JSON array with: question, options (array of 4), correctAnswer (index 0-3), explanation.`;
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
            questions: parsed.map((q, i) => ({ id: `q${i + 1}`, ...q, difficulty })),
            createdAt: new Date(),
          },
        };
      }
    } catch (e) {
      console.error('Parse error:', e);
    }
  }
  
  // Fallback
  return {
    success: true,
    quiz: {
      id: `quiz_${Date.now()}`,
      topic,
      difficulty,
      questions: Array.from({ length: count }, (_, i) => ({
        id: `q${i + 1}`,
        question: `Sample question ${i + 1} about ${topic}?`,
        options: [`Option A`, `Option B`, `Option C`, `Option D`],
        correctAnswer: 0,
        explanation: `Explanation for question ${i + 1}.`,
        difficulty,
      })),
      createdAt: new Date(),
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

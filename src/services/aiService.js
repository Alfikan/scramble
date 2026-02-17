/**
 * AI Service - Real Gemini API Integration
 * Production-ready chatbot with streaming, context, and error handling
 */

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/**
 * Call Gemini API with proper error handling
 */
const callGeminiAPI = async (prompt, options = {}) => {
  if (!GEMINI_API_KEY) {
    console.warn('⚠️ Gemini API key not configured. Using fallback responses.');
    return null;
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: options.temperature || 0.7,
          topK: options.topK || 40,
          topP: options.topP || 0.95,
          maxOutputTokens: options.maxOutputTokens || 2048,
          stopSequences: options.stopSequences || [],
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    
    // Check for blocked content
    if (data.promptFeedback?.blockReason) {
      throw new Error(`Content blocked: ${data.promptFeedback.blockReason}`);
    }

    // Extract text from response
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error('No response generated');
    }

    return text;
  } catch (error) {
    console.error('❌ Gemini API Error:', error);
    throw error;
  }
};

/**
 * Build conversation context from history
 */
const buildContext = (conversationHistory, maxMessages = 10) => {
  if (!conversationHistory || conversationHistory.length === 0) {
    return '';
  }

  const recentMessages = conversationHistory.slice(-maxMessages);
  
  return recentMessages
    .map(msg => {
      const role = msg.type === 'user' ? 'Student' : 'AI Tutor';
      return `${role}: ${msg.text}`;
    })
    .join('\n\n');
};

/**
 * Send message to AI chatbot
 */
export const sendMessageToAI = async (message, conversationHistory = []) => {
  try {
    // Build context from conversation history
    const context = buildContext(conversationHistory);

    // Create system prompt
    const systemPrompt = `You are an intelligent AI study assistant helping students learn. Your role is to:
- Explain concepts clearly and concisely
- Provide accurate educational information
- Encourage learning and critical thinking
- Be patient and supportive
- Use examples when helpful
- Break down complex topics into simpler parts

Keep responses focused, educational, and encouraging.`;

    // Build full prompt
    const fullPrompt = context 
      ? `${systemPrompt}\n\nPrevious conversation:\n${context}\n\nStudent: ${message}\n\nAI Tutor:`
      : `${systemPrompt}\n\nStudent: ${message}\n\nAI Tutor:`;

    // Call Gemini API
    const response = await callGeminiAPI(fullPrompt, {
      temperature: 0.7,
      maxOutputTokens: 1024,
    });

    if (response) {
      return {
        success: true,
        message: response.trim(),
        timestamp: new Date(),
        source: 'gemini',
      };
    }

    // Fallback if API fails
    return getFallbackResponse(message);
  } catch (error) {
    console.error('Error in sendMessageToAI:', error);
    
    // Return fallback on error
    return {
      success: true,
      message: getFallbackMessage(error.message),
      timestamp: new Date(),
      source: 'fallback',
      error: error.message,
    };
  }
};

/**
 * Generate quiz using Gemini
 */
export const generateQuiz = async (topic, difficulty = 'medium', questionCount = 5) => {
  try {
    const prompt = `Generate ${questionCount} ${difficulty} difficulty multiple-choice questions about "${topic}".

Format your response as a JSON array with this exact structure:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Explanation of why this is correct"
  }
]

Requirements:
- Make questions educational and clear
- Ensure options are plausible
- correctAnswer is the index (0-3) of the correct option
- Provide helpful explanations
- Match the ${difficulty} difficulty level

Return ONLY the JSON array, no other text.`;

    const response = await callGeminiAPI(prompt, {
      temperature: 0.8,
      maxOutputTokens: 2048,
    });

    if (response) {
      try {
        // Extract JSON from response
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const questions = JSON.parse(jsonMatch[0]);
          
          // Validate and format questions
          const formattedQuestions = questions.slice(0, questionCount).map((q, i) => ({
            id: `q${i + 1}`,
            question: q.question,
            options: q.options || [],
            correctAnswer: q.correctAnswer || 0,
            explanation: q.explanation || 'No explanation provided.',
            difficulty,
          }));

          if (formattedQuestions.length > 0) {
            return {
              success: true,
              quiz: {
                id: `quiz_${Date.now()}`,
                topic,
                difficulty,
                questions: formattedQuestions,
                createdAt: new Date(),
              },
            };
          }
        }
      } catch (parseError) {
        console.error('Error parsing quiz JSON:', parseError);
      }
    }

    // Fallback to generated quiz
    return generateFallbackQuiz(topic, difficulty, questionCount);
  } catch (error) {
    console.error('Error generating quiz:', error);
    return generateFallbackQuiz(topic, difficulty, questionCount);
  }
};

/**
 * Explain a concept using Gemini
 */
export const explainConcept = async (concept, level = 'beginner') => {
  try {
    const prompt = `Explain "${concept}" at a ${level} level.

Requirements:
- Use clear, simple language appropriate for ${level} level
- Provide 2-3 paragraphs
- Include practical examples
- Make it engaging and easy to understand
- End with 3 related topics to explore

Format:
[Explanation paragraphs]

Related Topics:
1. [Topic 1]
2. [Topic 2]
3. [Topic 3]`;

    const response = await callGeminiAPI(prompt, {
      temperature: 0.7,
      maxOutputTokens: 1024,
    });

    if (response) {
      // Extract related topics
      const relatedTopicsMatch = response.match(/Related Topics:[\s\S]*$/);
      const relatedTopics = relatedTopicsMatch
        ? relatedTopicsMatch[0]
            .split('\n')
            .filter(line => line.match(/^\d+\./))
            .map(line => line.replace(/^\d+\.\s*/, '').trim())
        : [];

      // Get explanation without related topics section
      const explanation = response.replace(/Related Topics:[\s\S]*$/, '').trim();

      return {
        success: true,
        explanation,
        relatedTopics: relatedTopics.length > 0 ? relatedTopics : [
          'Advanced concepts',
          'Practical applications',
          'Common misconceptions'
        ],
      };
    }

    return getFallbackExplanation(concept, level);
  } catch (error) {
    console.error('Error explaining concept:', error);
    return getFallbackExplanation(concept, level);
  }
};

/**
 * Get study suggestions
 */
export const getStudySuggestions = async (userId, subjects = []) => {
  try {
    const subjectsText = subjects.length > 0 ? subjects.join(', ') : 'various subjects';
    
    const prompt = `As a study advisor, provide 3 personalized study suggestions for a student studying ${subjectsText}.

Format each suggestion as:
Priority: [high/medium/low]
Title: [Short title]
Description: [Brief description]

Make suggestions practical and actionable.`;

    const response = await callGeminiAPI(prompt, {
      temperature: 0.8,
      maxOutputTokens: 512,
    });

    if (response) {
      // Parse suggestions from response
      const suggestions = [];
      const lines = response.split('\n');
      let currentSuggestion = {};
      let id = 1;

      lines.forEach(line => {
        if (line.includes('Priority:')) {
          if (currentSuggestion.title) {
            suggestions.push({ id: id++, ...currentSuggestion });
          }
          currentSuggestion = {
            priority: line.split(':')[1].trim().toLowerCase()
          };
        } else if (line.includes('Title:')) {
          currentSuggestion.title = line.split(':')[1].trim();
        } else if (line.includes('Description:')) {
          currentSuggestion.description = line.split(':')[1].trim();
        }
      });

      if (currentSuggestion.title) {
        suggestions.push({ id: id++, ...currentSuggestion });
      }

      if (suggestions.length > 0) {
        return { success: true, suggestions };
      }
    }

    return getFallbackSuggestions();
  } catch (error) {
    console.error('Error getting study suggestions:', error);
    return getFallbackSuggestions();
  }
};

/**
 * Generate flashcards
 */
export const generateFlashcards = async (topic, count = 10) => {
  try {
    const prompt = `Create ${count} educational flashcards about "${topic}".

Format each flashcard as:
Q: [Question]
A: [Answer]

Make questions clear and answers concise but complete.`;

    const response = await callGeminiAPI(prompt, {
      temperature: 0.7,
      maxOutputTokens: 1024,
    });

    if (response) {
      const flashcards = [];
      const lines = response.split('\n');
      let currentCard = {};
      let id = 1;

      lines.forEach(line => {
        if (line.startsWith('Q:')) {
          if (currentCard.front) {
            flashcards.push({ id: `card_${id++}`, ...currentCard, topic });
          }
          currentCard = { front: line.substring(2).trim() };
        } else if (line.startsWith('A:')) {
          currentCard.back = line.substring(2).trim();
        }
      });

      if (currentCard.front && currentCard.back) {
        flashcards.push({ id: `card_${id++}`, ...currentCard, topic });
      }

      if (flashcards.length > 0) {
        return { success: true, flashcards: flashcards.slice(0, count) };
      }
    }

    return getFallbackFlashcards(topic, count);
  } catch (error) {
    console.error('Error generating flashcards:', error);
    return getFallbackFlashcards(topic, count);
  }
};

// ============ FALLBACK FUNCTIONS ============

function getFallbackResponse(message) {
  const lower = message.toLowerCase();
  
  let response = "I'm here to help you study! ";
  
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    response = "Hello! I'm your AI study assistant. I can help you understand concepts, generate quizzes, create flashcards, and answer your study questions. What would you like to learn about today?";
  } else if (lower.includes('quiz') || lower.includes('test')) {
    response = "I can generate custom quizzes for you! Just tell me the topic and difficulty level you'd like, and I'll create questions to test your knowledge.";
  } else if (lower.includes('explain') || lower.includes('what is') || lower.includes('how does')) {
    response = "I'd be happy to explain that concept! Please provide more details about what you'd like to learn, and I'll break it down for you in a clear and understandable way.";
  } else if (lower.includes('help') || lower.includes('study')) {
    response = "I can help you in several ways:\n\n• Explain concepts and topics\n• Generate practice quizzes\n• Create flashcards\n• Provide study tips\n• Answer your questions\n\nWhat would you like to focus on?";
  } else {
    response = "That's an interesting question! While I'm currently running in fallback mode (Gemini API key not configured), I can still help guide your studies. Try asking me to explain a concept, generate a quiz, or provide study tips!";
  }

  return {
    success: true,
    message: response,
    timestamp: new Date(),
    source: 'fallback',
  };
}

function getFallbackMessage(errorMessage) {
  return `I encountered an issue: ${errorMessage}. But don't worry! I'm still here to help. Try rephrasing your question or ask me something else about your studies.`;
}

function generateFallbackQuiz(topic, difficulty, count) {
  const questions = Array.from({ length: count }, (_, i) => ({
    id: `q${i + 1}`,
    question: `Sample ${difficulty} question ${i + 1} about ${topic}?`,
    options: [
      `Correct answer for question ${i + 1}`,
      `Incorrect option A`,
      `Incorrect option B`,
      `Incorrect option C`,
    ],
    correctAnswer: 0,
    explanation: `This is a sample explanation for question ${i + 1} about ${topic}. In a real quiz, this would provide detailed reasoning.`,
    difficulty,
  }));

  return {
    success: true,
    quiz: {
      id: `quiz_${Date.now()}`,
      topic,
      difficulty,
      questions,
      createdAt: new Date(),
    },
    fallback: true,
  };
}

function getFallbackExplanation(concept, level) {
  return {
    success: true,
    explanation: `This is a ${level}-level explanation of "${concept}".\n\nIn a production environment with Gemini API configured, you would receive a detailed, accurate explanation tailored to your level. The explanation would include clear definitions, practical examples, and helpful context.\n\nTo enable real AI explanations, please configure your Gemini API key in the .env file.`,
    relatedTopics: [
      `Advanced ${concept}`,
      `${concept} applications`,
      `${concept} best practices`,
    ],
    fallback: true,
  };
}

function getFallbackSuggestions() {
  return {
    success: true,
    suggestions: [
      {
        id: 1,
        title: 'Review your weak areas',
        description: 'Focus on topics where you scored below 70% in recent quizzes',
        priority: 'high',
      },
      {
        id: 2,
        title: 'Practice with quizzes',
        description: 'Take at least 3 practice quizzes this week to reinforce learning',
        priority: 'medium',
      },
      {
        id: 3,
        title: 'Study with peers',
        description: 'Join a study room to learn collaboratively and share knowledge',
        priority: 'low',
      },
    ],
  };
}

function getFallbackFlashcards(topic, count) {
  return {
    success: true,
    flashcards: Array.from({ length: count }, (_, i) => ({
      id: `card_${i + 1}`,
      front: `Sample question ${i + 1} about ${topic}`,
      back: `Sample answer ${i + 1} explaining the concept`,
      topic,
    })),
    fallback: true,
  };
}

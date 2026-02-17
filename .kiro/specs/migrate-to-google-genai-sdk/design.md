# Design Document: Migrate to Google Generative AI SDK

## Overview

This design outlines the migration from direct REST API calls to the official Google Generative AI SDK (@google/genai) for the AI service layer. The migration will modernize the codebase while maintaining complete backward compatibility with existing components.

The current implementation uses manual fetch() calls to the Gemini REST API across two service files. The new implementation will leverage the official SDK's features including built-in error handling, type safety, and simplified API interactions. All existing functionality—rate limiting, fallback responses, conversation context, and response formatting—will be preserved.

### Key Design Principles

1. **Zero Breaking Changes**: All function signatures and response formats remain identical
2. **Preserve Business Logic**: Rate limiting, fallback responses, and context handling stay the same
3. **Incremental Adoption**: SDK methods replace fetch calls while maintaining the same control flow
4. **Enhanced Error Handling**: Leverage SDK's error types while maintaining fallback behavior

## Architecture

### Current Architecture

```
AIChatPage.jsx ──┐
                 ├──> aiService.js ──> fetch() ──> Gemini REST API
AIQuizPage.jsx ──┤
                 └──> geminiAI.js ──> fetch() ──> Gemini REST API
```

### New Architecture

```
AIChatPage.jsx ──┐
                 ├──> aiService.js ──> @google/genai SDK ──> Gemini API
AIQuizPage.jsx ──┤
                 └──> geminiAI.js ──> @google/genai SDK ──> Gemini API
```

### Migration Strategy

The migration follows a wrapper pattern where SDK calls replace fetch calls within the existing function structure:

1. Initialize SDK client at module level
2. Replace fetch-based callGemini/callGeminiAPI functions with SDK-based implementations
3. Maintain all existing wrapper functions (sendMessageToAI, generateQuiz, etc.)
4. Preserve rate limiting and fallback logic around SDK calls

## Components and Interfaces

### SDK Client Initialization

Both service files will initialize the SDK client at the module level:

```javascript
import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const ai = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;
```

### Core API Call Function

Replace the current fetch-based implementation with SDK-based calls:

**Current (geminiAI.js):**
```javascript
const callGemini = async (prompt) => {
  // Rate limit checks...
  const res = await fetch(`${API_URL}?key=${GEMINI_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [...], generationConfig: {...} })
  });
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text;
};
```

**New (SDK-based):**
```javascript
const callGemini = async (prompt, options = {}) => {
  if (!ai) {
    console.warn('Gemini API key not configured');
    return null;
  }

  // Rate limit checks (preserved)...
  
  try {
    requestCount++;
    
    const response = await ai.models.generateContent({
      model: "gemini-pro",
      contents: prompt,
      generationConfig: {
        temperature: options.temperature || 0.7,
        maxOutputTokens: options.maxOutputTokens || 1024,
        topK: options.topK || 40,
        topP: options.topP || 0.95,
      },
    });
    
    // Reset request count after successful request
    setTimeout(() => { requestCount = Math.max(0, requestCount - 1); }, 60000);
    
    return response.text;
  } catch (error) {
    // Handle SDK errors
    if (error.message?.includes('quota') || error.status === 429) {
      console.warn('Rate limit exceeded. Using fallback responses.');
      rateLimitUntil = Date.now() + 60000;
      return null;
    }
    console.error('Gemini error:', error);
    return null;
  }
};
```

### Function Signatures (Unchanged)

All exported functions maintain their exact signatures:

```javascript
// geminiAI.js
export const sendMessageToAI = async (message, history = []) => { ... }
export const generateQuiz = async (topic, difficulty = 'medium', count = 5) => { ... }
export const explainConcept = async (concept, level = 'beginner') => { ... }
export const getStudySuggestions = async () => { ... }
export const generateFlashcards = async (topic, count = 10) => { ... }

// aiService.js
export const sendMessageToAI = async (message, conversationHistory = []) => { ... }
export const generateQuiz = async (topic, difficulty = 'medium', questionCount = 5) => { ... }
export const explainConcept = async (concept, level = 'beginner') => { ... }
export const getStudySuggestions = async (userId, subjects = []) => { ... }
export const generateFlashcards = async (topic, count = 10) => { ... }
```

### Rate Limiting (Preserved)

The rate limiting logic remains unchanged:

```javascript
let rateLimitUntil = null;
let requestCount = 0;
const MAX_REQUESTS_PER_MINUTE = 15;

// Check rate limit before SDK call
if (rateLimitUntil && Date.now() < rateLimitUntil) {
  const waitSeconds = Math.ceil((rateLimitUntil - Date.now()) / 1000);
  console.warn(`Rate limited. Please wait ${waitSeconds} seconds.`);
  return null;
}

if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
  console.warn('Request limit reached. Using fallback responses.');
  return null;
}
```

### Fallback Response System (Preserved)

All fallback functions remain unchanged:

```javascript
// geminiAI.js
const fallback = (msg) => { ... } // Unchanged

// aiService.js
function getFallbackResponse(message) { ... } // Unchanged
function generateFallbackQuiz(topic, difficulty, count) { ... } // Unchanged
function getFallbackExplanation(concept, level) { ... } // Unchanged
// ... other fallback functions unchanged
```

## Data Models

### SDK Request Format

The SDK uses a simplified request format compared to REST:

```javascript
// REST API format (current)
{
  contents: [{ parts: [{ text: prompt }] }],
  generationConfig: { temperature: 0.7, ... }
}

// SDK format (new)
{
  model: "gemini-pro",
  contents: prompt,  // Simplified: can be string or structured content
  generationConfig: { temperature: 0.7, ... }
}
```

### SDK Response Format

The SDK provides a simplified response object:

```javascript
// REST API response (current)
{
  candidates: [{
    content: {
      parts: [{ text: "response text" }]
    }
  }]
}

// SDK response (new)
{
  text: "response text",  // Direct access via .text property
  candidates: [...],       // Still available if needed
  promptFeedback: {...}    // Safety/blocking information
}
```

### Response Objects (Unchanged)

All response objects returned to UI components remain identical:

```javascript
// sendMessageToAI response
{
  success: true,
  message: "AI response text",
  timestamp: Date,
  source: "gemini" | "fallback",
  usingFallback: boolean  // geminiAI.js only
}

// generateQuiz response
{
  success: true,
  quiz: {
    id: string,
    topic: string,
    difficulty: string,
    questions: [{
      id: string,
      question: string,
      options: string[],
      correctAnswer: number,
      explanation: string,
      difficulty: string
    }],
    createdAt: Date
  },
  fallback: boolean  // aiService.js only
}

// explainConcept response
{
  success: true,
  explanation: string,
  relatedTopics: string[],
  fallback: boolean  // aiService.js only
}

// generateFlashcards response
{
  success: true,
  flashcards: [{
    id: string,
    front: string,
    back: string,
    topic: string
  }],
  fallback: boolean  // aiService.js only
}
```

## Correctness Properties


A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: SDK Package Installation

*For any* project with the migration applied, the @google/genai package should be present in package.json dependencies and importable in the codebase.

**Validates: Requirements 1.1, 2.1**

### Property 2: SDK Configuration with Environment Variable

*For any* environment where REACT_APP_GEMINI_API_KEY is set, the SDK client should be initialized with that API key value.

**Validates: Requirements 1.2**

### Property 3: Model Selection Preservation

*For any* AI service function call, the SDK should use the correct model name (gemini-pro for geminiAI.js, gemini-2.0-flash for aiService.js) matching the current implementation.

**Validates: Requirements 2.5**

### Property 4: Rate Limiting Enforcement

*For any* sequence of API calls, when the rate limit is exceeded (15 requests per minute or rateLimitUntil is set), subsequent calls should return null without making SDK requests, and the rate limit should reset after 60 seconds.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

### Property 5: Fallback Response Activation

*For any* API call that fails or returns null, the system should use fallback response logic and set the usingFallback or fallback flag to true in the response object.

**Validates: Requirements 4.1, 4.3**

### Property 6: Function Signature Compatibility

*For any* exported AI service function (sendMessageToAI, generateQuiz, explainConcept, getStudySuggestions, generateFlashcards), the function should accept the same parameters as the current implementation and be callable with those parameters.

**Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5**

### Property 7: Response Object Structure Preservation

*For any* AI service function call, the returned response object should contain all properties expected by UI components (success, message/quiz/explanation/etc., timestamp, source/fallback flags).

**Validates: Requirements 5.6, 9.5, 10.3**

### Property 8: Generation Configuration Preservation

*For any* AI service function, the SDK call should use the correct generation configuration parameters (temperature: 0.7 for chat/0.8 for quiz, maxOutputTokens: 1024 for chat/2048 for quiz, topK: 40, topP: 0.95).

**Validates: Requirements 6.1, 6.2, 6.3**

### Property 9: Conversation Context Building

*For any* sendMessageToAI call with conversation history, the system should build context from recent messages (last 3-10 messages), format it with role labels (User/AI or Student/AI Tutor), and include system prompts in the final prompt sent to the SDK.

**Validates: Requirements 7.1, 7.2, 7.3, 7.4**

### Property 10: SDK Error Handling with Fallbacks

*For any* SDK error (including blocked content, quota errors, network errors), the system should catch the error, log it appropriately, and return a fallback response with the correct error response format.

**Validates: Requirements 8.1, 8.2, 8.3, 8.4**

### Property 11: Quiz Response Parsing

*For any* generateQuiz call, the system should extract and parse JSON from the SDK response and format questions with all required fields (id, question, options, correctAnswer, explanation, difficulty).

**Validates: Requirements 9.1, 9.2**

### Property 12: Concept Explanation Parsing

*For any* explainConcept call, the system should extract related topics from the SDK response and return them in the relatedTopics array.

**Validates: Requirements 9.3**

### Property 13: Flashcard Parsing

*For any* generateFlashcards call, the system should parse Q:/A: format from the SDK response and create flashcard objects with front, back, id, and topic fields.

**Validates: Requirements 9.4**

### Property 14: Async Function Behavior

*For any* exported AI service function, the function should be async and return a Promise that resolves to the expected response object.

**Validates: Requirements 10.5**

## Error Handling

### SDK Error Types

The SDK may throw several types of errors that must be handled:

1. **Quota/Rate Limit Errors**: When API quota is exceeded
   - Error message contains "quota" or status is 429
   - Set rateLimitUntil timestamp
   - Return null to trigger fallback

2. **Blocked Content Errors**: When safety settings block content
   - Check response.promptFeedback.blockReason
   - Return user-friendly error message
   - Log the block reason

3. **Network Errors**: When network connectivity fails
   - Catch network exceptions
   - Return null to trigger fallback
   - Log error details

4. **Invalid Response Errors**: When SDK returns unexpected format
   - Check for missing text property
   - Return null to trigger fallback
   - Log parsing errors

### Error Handling Pattern

```javascript
try {
  const response = await ai.models.generateContent({...});
  
  // Check for blocked content
  if (response.promptFeedback?.blockReason) {
    throw new Error(`Content blocked: ${response.promptFeedback.blockReason}`);
  }
  
  // Check for valid response
  if (!response.text) {
    throw new Error('No response generated');
  }
  
  return response.text;
} catch (error) {
  // Handle quota errors
  if (error.message?.includes('quota') || error.status === 429) {
    rateLimitUntil = Date.now() + 60000;
    return null;
  }
  
  // Log and return null for fallback
  console.error('SDK error:', error);
  return null;
}
```

### Fallback Behavior

When SDK calls return null or throw errors:

1. **sendMessageToAI**: Use fallback() function with pattern matching
2. **generateQuiz**: Use generateFallbackQuiz() with sample questions
3. **explainConcept**: Use getFallbackExplanation() with generic explanation
4. **getStudySuggestions**: Use getFallbackSuggestions() with default suggestions
5. **generateFlashcards**: Use getFallbackFlashcards() with sample cards

All fallback responses maintain the same structure as successful responses but include a fallback/usingFallback flag.

## Testing Strategy

### Dual Testing Approach

The migration requires both unit tests and property-based tests to ensure correctness:

**Unit Tests** focus on:
- Specific examples of SDK initialization
- Specific error scenarios (quota exceeded, blocked content, network failure)
- Specific fallback response patterns (greetings, quiz requests, etc.)
- Integration with UI components (AIChatPage, AIQuizPage)
- Edge cases (empty history, invalid parameters, missing API key)

**Property-Based Tests** focus on:
- Rate limiting behavior across many request sequences
- Response structure consistency across all functions
- Fallback activation across all error types
- Context building across various history lengths
- Configuration preservation across all function calls

### Property-Based Testing Configuration

- **Library**: Use fast-check for JavaScript property-based testing
- **Iterations**: Minimum 100 iterations per property test
- **Tagging**: Each test references its design property
  - Format: `// Feature: migrate-to-google-genai-sdk, Property N: [property text]`

### Test Coverage Requirements

1. **SDK Integration Tests**
   - Test SDK client initialization with valid/invalid API keys
   - Test SDK method calls with various prompts
   - Test SDK error handling for each error type

2. **Rate Limiting Tests**
   - Test request counting and limit enforcement
   - Test rate limit reset after timeout
   - Test rateLimitUntil timestamp behavior

3. **Fallback Tests**
   - Test fallback activation on null responses
   - Test fallback activation on SDK errors
   - Test fallback response patterns for each function

4. **Response Format Tests**
   - Test response structure for each function
   - Test metadata fields (timestamp, source, flags)
   - Test backward compatibility with UI components

5. **Context Building Tests**
   - Test context building with various history lengths
   - Test role label formatting
   - Test system prompt inclusion

6. **Configuration Tests**
   - Test generation config parameters for each function
   - Test model selection for each service file
   - Test safety settings configuration

### Integration Testing

After migration, verify:
- AIChatPage.jsx chat flow works identically
- AIQuizPage.jsx quiz generation works identically
- All AI features accessible from UI function correctly
- Error states display appropriately in UI
- Fallback responses display correctly in UI

### Manual Testing Checklist

- [ ] Chat conversation with multiple turns
- [ ] Quiz generation with different difficulties
- [ ] Concept explanation requests
- [ ] Flashcard generation
- [ ] Rate limit behavior (trigger and recovery)
- [ ] Error handling (disconnect network, invalid API key)
- [ ] Fallback responses display correctly

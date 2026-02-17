# Requirements Document

## Introduction

This document specifies the requirements for migrating the AI service from direct REST API calls to the official Google Generative AI SDK (@google/genai). The current implementation uses fetch-based calls to the Gemini REST API across two service files (geminiAI.js and aiService.js). The migration will modernize the codebase, improve maintainability, and leverage SDK features while preserving all existing functionality.

## Glossary

- **AI_Service**: The application's AI service layer that provides chat, quiz generation, concept explanation, and other AI-powered features
- **SDK**: The official @google/genai Software Development Kit provided by Google
- **REST_API**: The current implementation using direct HTTP fetch calls to Gemini endpoints
- **Rate_Limiter**: The current rate limiting mechanism that tracks request counts and enforces limits
- **Fallback_Response**: Pre-defined responses used when API calls fail or rate limits are exceeded
- **Conversation_Context**: The message history passed to AI for maintaining conversation continuity
- **Generation_Config**: Configuration parameters for AI content generation (temperature, maxOutputTokens, etc.)

## Requirements

### Requirement 1: SDK Installation and Configuration

**User Story:** As a developer, I want to install and configure the official Google Generative AI SDK, so that the application can use modern SDK methods instead of direct REST calls.

#### Acceptance Criteria

1. THE System SHALL install the @google/genai package as a project dependency
2. THE System SHALL configure the SDK to use the existing REACT_APP_GEMINI_API_KEY environment variable
3. THE System SHALL initialize the SDK client in both service files (geminiAI.js and aiService.js)
4. THE System SHALL use the same API key configuration pattern as the current implementation

### Requirement 2: Replace REST API Calls with SDK Methods

**User Story:** As a developer, I want to replace all fetch-based API calls with SDK methods, so that the codebase uses the official supported implementation.

#### Acceptance Criteria

1. WHEN the AI_Service generates content, THE System SHALL use SDK's generateContent method instead of fetch calls
2. THE System SHALL replace all direct REST API URL construction with SDK method calls
3. THE System SHALL remove manual HTTP request/response handling code
4. THE System SHALL update both geminiAI.js and aiService.js consistently with SDK methods
5. THE System SHALL maintain the same model selection (gemini-pro, gemini-2.0-flash) as currently configured

### Requirement 3: Preserve Rate Limiting Logic

**User Story:** As a developer, I want to maintain the existing rate limiting functionality, so that the application continues to respect API quotas and prevent excessive requests.

#### Acceptance Criteria

1. WHEN the Rate_Limiter detects quota exceeded, THE System SHALL prevent additional API calls
2. THE System SHALL maintain the current request counting mechanism (MAX_REQUESTS_PER_MINUTE = 15)
3. THE System SHALL preserve the rateLimitUntil timestamp tracking
4. THE System SHALL continue to return null when rate limited
5. THE System SHALL reset request counts after the configured time period (60 seconds)

### Requirement 4: Maintain Fallback Response System

**User Story:** As a user, I want to receive helpful fallback responses when the API is unavailable, so that the application remains functional during rate limiting or errors.

#### Acceptance Criteria

1. WHEN an API call fails or returns null, THE System SHALL use the existing fallback response logic
2. THE System SHALL preserve all current fallback response patterns (greetings, quiz requests, explanations, etc.)
3. THE System SHALL maintain the usingFallback flag in response objects
4. THE System SHALL continue to provide contextual fallback messages based on user input

### Requirement 5: Preserve Function Signatures

**User Story:** As a developer, I want all existing function signatures to remain unchanged, so that no breaking changes are introduced to components using the AI service.

#### Acceptance Criteria

1. THE System SHALL maintain the sendMessageToAI(message, history) function signature
2. THE System SHALL maintain the generateQuiz(topic, difficulty, count) function signature
3. THE System SHALL maintain the explainConcept(concept, level) function signature
4. THE System SHALL maintain the getStudySuggestions() function signature
5. THE System SHALL maintain the generateFlashcards(topic, count) function signature
6. THE System SHALL return response objects with the same structure as current implementation

### Requirement 6: Preserve Generation Configuration

**User Story:** As a developer, I want to maintain the same AI generation parameters, so that the quality and behavior of AI responses remain consistent.

#### Acceptance Criteria

1. THE System SHALL preserve temperature settings (0.7 for chat, 0.8 for quiz generation)
2. THE System SHALL preserve maxOutputTokens settings (1024 for chat, 2048 for quiz)
3. THE System SHALL preserve topK (40) and topP (0.95) parameters
4. THE System SHALL use SDK's generationConfig parameter to set these values
5. THE System SHALL maintain safety settings configuration from aiService.js

### Requirement 7: Maintain Conversation Context Handling

**User Story:** As a user, I want the AI to remember our conversation context, so that I can have coherent multi-turn conversations.

#### Acceptance Criteria

1. WHEN sendMessageToAI receives conversation history, THE System SHALL build context from recent messages
2. THE System SHALL maintain the current context building logic (last 3-10 messages)
3. THE System SHALL format context with role labels (User/AI, Student/AI Tutor)
4. THE System SHALL include system prompts in the conversation context
5. THE System SHALL pass the complete prompt to the SDK's generateContent method

### Requirement 8: Improve Error Handling

**User Story:** As a developer, I want to leverage SDK's built-in error handling, so that errors are caught and handled more reliably.

#### Acceptance Criteria

1. WHEN the SDK throws an error, THE System SHALL catch and log it appropriately
2. THE System SHALL handle SDK-specific error types (blocked content, quota errors, network errors)
3. THE System SHALL maintain backward compatibility with current error response format
4. THE System SHALL continue to return fallback responses on SDK errors
5. WHEN content is blocked by safety settings, THE System SHALL provide a user-friendly error message

### Requirement 9: Preserve Response Parsing Logic

**User Story:** As a developer, I want to maintain the current response parsing and formatting, so that components receive data in the expected format.

#### Acceptance Criteria

1. WHEN generating quizzes, THE System SHALL extract and parse JSON from SDK responses
2. THE System SHALL maintain the current quiz question formatting (id, question, options, correctAnswer, explanation)
3. WHEN explaining concepts, THE System SHALL extract related topics from responses
4. WHEN generating flashcards, THE System SHALL parse Q:/A: format from responses
5. THE System SHALL preserve all response metadata (timestamp, source, success flags)

### Requirement 10: Maintain Backward Compatibility

**User Story:** As a developer, I want the migration to be transparent to existing components, so that AIChatPage.jsx and AIQuizPage.jsx continue to work without modifications.

#### Acceptance Criteria

1. THE System SHALL ensure AIChatPage.jsx functions identically after migration
2. THE System SHALL ensure AIQuizPage.jsx functions identically after migration
3. THE System SHALL maintain all response object properties expected by UI components
4. THE System SHALL preserve the success/error response patterns
5. THE System SHALL maintain the same async/await patterns for all exported functions

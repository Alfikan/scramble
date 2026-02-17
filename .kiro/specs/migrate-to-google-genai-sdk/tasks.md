# Implementation Plan: Migrate to Google Generative AI SDK

## Overview

This implementation plan guides the migration from direct REST API calls to the official @google/genai SDK. The migration will be performed incrementally, starting with package installation, then updating each service file, and finally testing the integration. All existing functionality will be preserved with zero breaking changes.

## Tasks

- [x] 1. Install and configure the Google Generative AI SDK
  - Install @google/genai package via npm
  - Verify package appears in package.json dependencies
  - Test that the package can be imported successfully
  - _Requirements: 1.1_

- [ ] 2. Migrate geminiAI.js to use SDK
  - [x] 2.1 Add SDK import and initialize client
    - Import GoogleGenAI from @google/genai
    - Initialize SDK client with REACT_APP_GEMINI_API_KEY
    - Add null check for missing API key
    - _Requirements: 1.2, 1.3_
  
  - [x] 2.2 Replace callGemini function with SDK-based implementation
    - Replace fetch() call with ai.models.generateContent()
    - Update to use SDK's simplified request format
    - Extract response text using response.text property
    - Preserve rate limiting checks before SDK call
    - Preserve request count increment/decrement logic
    - Handle SDK errors (quota, blocked content, network)
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5, 8.1, 8.2_
  
  - [-] 2.3 Write property test for rate limiting
    - **Property 4: Rate Limiting Enforcement**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**
  
  - [~] 2.4 Write property test for fallback activation
    - **Property 5: Fallback Response Activation**
    - **Validates: Requirements 4.1, 4.3**
  
  - [~] 2.5 Update sendMessageToAI to use new callGemini
    - Verify function signature unchanged
    - Verify context building logic preserved
    - Verify fallback logic preserved
    - Verify response object structure unchanged
    - _Requirements: 5.1, 5.6, 7.1, 7.2, 7.3, 7.4, 9.5_
  
  - [~] 2.6 Write property test for conversation context building
    - **Property 9: Conversation Context Building**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4**
  
  - [~] 2.7 Update generateQuiz to use new callGemini
    - Verify function signature unchanged
    - Verify JSON parsing logic preserved
    - Verify quiz formatting logic preserved
    - Verify fallback quiz generation preserved
    - Update generation config (temperature: 0.8, maxOutputTokens: 2048)
    - _Requirements: 5.2, 5.6, 6.1, 6.2, 9.1, 9.2, 9.5_
  
  - [~] 2.8 Write property test for quiz response parsing
    - **Property 11: Quiz Response Parsing**
    - **Validates: Requirements 9.1, 9.2**
  
  - [~] 2.9 Update explainConcept to use new callGemini
    - Verify function signature unchanged
    - Verify related topics extraction preserved
    - Verify fallback explanation preserved
    - _Requirements: 5.3, 5.6, 9.3, 9.5_
  
  - [~] 2.10 Update generateFlashcards to use new callGemini
    - Verify function signature unchanged
    - Verify Q:/A: parsing logic preserved
    - Verify fallback flashcards preserved
    - _Requirements: 5.5, 5.6, 9.4, 9.5_
  
  - [~] 2.11 Remove old REST API constants and code
    - Remove API_URL constant
    - Remove manual HTTP header construction
    - Verify no fetch() calls to Gemini API remain
    - _Requirements: 2.2, 2.3_

- [ ] 3. Checkpoint - Test geminiAI.js migration
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Migrate aiService.js to use SDK
  - [~] 4.1 Add SDK import and initialize client
    - Import GoogleGenAI from @google/genai
    - Initialize SDK client with REACT_APP_GEMINI_API_KEY
    - Add null check for missing API key
    - _Requirements: 1.2, 1.3_
  
  - [~] 4.2 Replace callGeminiAPI function with SDK-based implementation
    - Replace fetch() call with ai.models.generateContent()
    - Update to use SDK's simplified request format
    - Extract response text using response.text property
    - Handle SDK errors (quota, blocked content, network)
    - Check promptFeedback.blockReason for safety blocks
    - Update model name to gemini-2.0-flash
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 8.1, 8.2, 8.5_
  
  - [~] 4.3 Write property test for SDK error handling
    - **Property 10: SDK Error Handling with Fallbacks**
    - **Validates: Requirements 8.1, 8.2, 8.3, 8.4**
  
  - [~] 4.4 Update buildContext helper function
    - Verify context building logic unchanged
    - Verify maxMessages parameter preserved
    - Verify role formatting preserved
    - _Requirements: 7.1, 7.2, 7.3_
  
  - [~] 4.5 Update sendMessageToAI to use new callGeminiAPI
    - Verify function signature unchanged (message, conversationHistory)
    - Verify system prompt preserved
    - Verify context building with buildContext()
    - Verify fallback logic preserved
    - Verify response object structure unchanged
    - Update generation config (temperature: 0.7, maxOutputTokens: 1024)
    - _Requirements: 5.1, 5.6, 6.1, 6.2, 7.4, 9.5_
  
  - [~] 4.6 Write property test for response object structure
    - **Property 7: Response Object Structure Preservation**
    - **Validates: Requirements 5.6, 9.5, 10.3**
  
  - [~] 4.7 Update generateQuiz to use new callGeminiAPI
    - Verify function signature unchanged (topic, difficulty, questionCount)
    - Verify JSON extraction and parsing preserved
    - Verify question formatting preserved
    - Verify fallback quiz generation preserved
    - Update generation config (temperature: 0.8, maxOutputTokens: 2048)
    - _Requirements: 5.2, 5.6, 6.1, 6.2, 9.1, 9.2, 9.5_
  
  - [~] 4.8 Update explainConcept to use new callGeminiAPI
    - Verify function signature unchanged (concept, level)
    - Verify related topics extraction preserved
    - Verify fallback explanation preserved
    - Update generation config (temperature: 0.7, maxOutputTokens: 1024)
    - _Requirements: 5.3, 5.6, 6.1, 6.2, 9.3, 9.5_
  
  - [~] 4.9 Write property test for concept explanation parsing
    - **Property 12: Concept Explanation Parsing**
    - **Validates: Requirements 9.3**
  
  - [~] 4.10 Update getStudySuggestions to use new callGeminiAPI
    - Verify function signature unchanged (userId, subjects)
    - Verify suggestion parsing preserved
    - Verify fallback suggestions preserved
    - _Requirements: 5.4, 5.6, 9.5_
  
  - [~] 4.11 Update generateFlashcards to use new callGeminiAPI
    - Verify function signature unchanged (topic, count)
    - Verify Q:/A: parsing preserved
    - Verify fallback flashcards preserved
    - _Requirements: 5.5, 5.6, 9.4, 9.5_
  
  - [~] 4.12 Write property test for flashcard parsing
    - **Property 13: Flashcard Parsing**
    - **Validates: Requirements 9.4**
  
  - [~] 4.13 Add safety settings to SDK calls
    - Add safetySettings array to generateContent calls
    - Configure HARM_CATEGORY_HARASSMENT threshold
    - Configure HARM_CATEGORY_HATE_SPEECH threshold
    - Configure HARM_CATEGORY_SEXUALLY_EXPLICIT threshold
    - Configure HARM_CATEGORY_DANGEROUS_CONTENT threshold
    - _Requirements: 6.5_
  
  - [~] 4.14 Remove old REST API constants and code
    - Remove GEMINI_API_URL constant
    - Remove manual HTTP header construction
    - Verify no fetch() calls to Gemini API remain
    - _Requirements: 2.2, 2.3_

- [ ] 5. Checkpoint - Test aiService.js migration
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Integration testing and verification
  - [~] 6.1 Write unit test for AIChatPage integration
    - Test chat flow with SDK-based service
    - Test conversation history handling
    - Test error states and fallback display
    - **Validates: Requirements 10.1**
  
  - [~] 6.2 Write unit test for AIQuizPage integration
    - Test quiz generation flow with SDK-based service
    - Test quiz display and interaction
    - Test error states and fallback display
    - **Validates: Requirements 10.2**
  
  - [~] 6.3 Write property test for function signature compatibility
    - **Property 6: Function Signature Compatibility**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5**
  
  - [~] 6.4 Write property test for generation configuration
    - **Property 8: Generation Configuration Preservation**
    - **Validates: Requirements 6.1, 6.2, 6.3**
  
  - [~] 6.5 Write property test for async function behavior
    - **Property 14: Async Function Behavior**
    - **Validates: Requirements 10.5**

- [ ] 7. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The migration preserves all existing functionality with zero breaking changes
- Rate limiting and fallback logic remain unchanged
- All function signatures and response formats remain identical

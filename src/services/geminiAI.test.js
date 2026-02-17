// Property-Based Tests for geminiAI.js
// Feature: migrate-to-google-genai-sdk
import * as fc from 'fast-check';

// Mock the @google/genai module
const mockGenerateContent = jest.fn();
jest.mock('@google/genai', () => ({
  GoogleGenAI: jest.fn(() => ({
    models: {
      generateContent: mockGenerateContent,
    },
  })),
}));

// Set API key before importing
process.env.REACT_APP_GEMINI_API_KEY = 'test-api-key';

// Import geminiAI after mocks are set up
const geminiAI = require('./geminiAI.js');

describe('geminiAI Service - Property-Based Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGenerateContent.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Property 4: Rate Limiting Enforcement', () => {
    /**
     * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**
     * 
     * This property test verifies that:
     * 1. When rate limit is exceeded (15 requests per minute), subsequent calls return null
     * 2. When rateLimitUntil is set, subsequent calls return null without making SDK requests
     * 3. Rate limit resets after 60 seconds
     */
    
    test('should enforce request count limit of 15 requests per minute', async () => {
      // Mock successful SDK responses
      mockGenerateContent.mockResolvedValue({
        text: 'Test response',
        promptFeedback: null,
      });

      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 16, max: 20 }), // Test with more than 15 requests
          async (totalRequests) => {
            // Reset module to clear rate limiting state
            jest.resetModules();
            mockGenerateContent.mockClear();
            
            // Re-setup mock
            mockGenerateContent.mockResolvedValue({
              text: 'Test response',
              promptFeedback: null,
            });
            
            // Re-import service with fresh state
            const service = require('./geminiAI.js');
            
            // Make requests
            const results = [];
            for (let i = 0; i < totalRequests; i++) {
              const result = await service.sendMessageToAI(`Test message ${i}`);
              results.push(result);
            }
            
            // First 15 should not use fallback
            for (let i = 0; i < 15 && i < results.length; i++) {
              expect(results[i].success).toBe(true);
              expect(results[i].usingFallback).toBe(false);
            }
            
            // Requests after 15 should use fallback (rate limited)
            for (let i = 15; i < results.length; i++) {
              expect(results[i].success).toBe(true);
              expect(results[i].usingFallback).toBe(true);
            }
            
            // SDK should only be called 15 times max
            expect(mockGenerateContent.mock.calls.length).toBeLessThanOrEqual(15);
          }
        ),
        { numRuns: 5 }
      );
    });

    test('should block requests when rateLimitUntil is set after quota error', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 2, max: 5 }), // Number of requests to make after quota error
          async (attemptCount) => {
            // Reset module state
            jest.resetModules();
            mockGenerateContent.mockClear();
            
            // Mock SDK to throw quota error
            mockGenerateContent.mockRejectedValueOnce({
              message: 'quota exceeded',
              status: 429,
            });
            
            // Re-import the service
            const service = require('./geminiAI.js');
            
            // First request triggers quota error
            const firstResult = await service.sendMessageToAI('Trigger quota error');
            expect(firstResult.usingFallback).toBe(true);
            
            const callCountAfterFirst = mockGenerateContent.mock.calls.length;
            
            // Subsequent requests should use fallback without calling SDK
            for (let i = 0; i < attemptCount; i++) {
              const result = await service.sendMessageToAI(`Attempt ${i}`);
              expect(result.usingFallback).toBe(true);
            }
            
            // SDK should not be called again after the first quota error
            expect(mockGenerateContent.mock.calls.length).toBe(callCountAfterFirst);
          }
        ),
        { numRuns: 5 }
      );
    });

    test('should reset rate limit after 60 seconds', async () => {
      jest.useFakeTimers();
      
      // Reset module
      jest.resetModules();
      mockGenerateContent.mockClear();
      
      // First call throws quota error, then succeeds
      mockGenerateContent
        .mockRejectedValueOnce({
          message: 'quota exceeded',
          status: 429,
        })
        .mockResolvedValue({
          text: 'Test response after reset',
          promptFeedback: null,
        });
      
      // Re-import the service
      const service = require('./geminiAI.js');
      
      // First request triggers quota error
      const firstResult = await service.sendMessageToAI('Trigger quota error');
      expect(firstResult.usingFallback).toBe(true);
      
      // Immediate retry should still be rate limited
      const immediateRetry = await service.sendMessageToAI('Immediate retry');
      expect(immediateRetry.usingFallback).toBe(true);
      
      const callsBeforeReset = mockGenerateContent.mock.calls.length;
      
      // Advance time by 60 seconds
      jest.advanceTimersByTime(60000);
      
      // Request after 60 seconds should succeed
      const afterReset = await service.sendMessageToAI('After reset');
      expect(afterReset.usingFallback).toBe(false);
      
      // SDK should have been called again after reset
      expect(mockGenerateContent.mock.calls.length).toBeGreaterThan(callsBeforeReset);
      
      jest.useRealTimers();
    });
  });
});

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  CheckCircle,
  XCircle,
  Clock,
  Trophy,
  ArrowRight,
  RotateCcw,
  BookOpen,
} from 'lucide-react';

import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { generateQuiz } from '../services/aiService';

/**
 * AI Quiz Page - Take AI-generated quizzes
 */
const AIQuizPage = () => {
  const [quizState, setQuizState] = useState('setup'); // 'setup', 'loading', 'active', 'results'
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [questionCount, setQuestionCount] = useState(5);
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const handleStartQuiz = async () => {
    if (!topic.trim()) return;

    setQuizState('loading');
    const result = await generateQuiz(topic, difficulty, questionCount);

    if (result.success) {
      setQuiz(result.quiz);
      setQuizState('active');
      setTimerActive(true);
      setTimeElapsed(0);
    } else {
      alert('Failed to generate quiz');
      setQuizState('setup');
    }
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers({
      ...answers,
      [questionId]: answerIndex,
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = () => {
    if (Object.keys(answers).length < quiz.questions.length) {
      if (!window.confirm('You have unanswered questions. Submit anyway?')) {
        return;
      }
    }
    setTimerActive(false);
    setQuizState('results');
  };

  const handleRestart = () => {
    setQuizState('setup');
    setQuiz(null);
    setCurrentQuestion(0);
    setAnswers({});
    setTimeElapsed(0);
    setTimerActive(false);
  };

  const calculateScore = () => {
    if (!quiz) return { correct: 0, total: 0, percentage: 0 };

    let correct = 0;
    quiz.questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    return {
      correct,
      total: quiz.questions.length,
      percentage: Math.round((correct / quiz.questions.length) * 100),
    };
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Setup Screen
  if (quizState === 'setup') {
    return (
      <div className="min-h-screen bg-cool-blue-gray">
        <div className="bg-white shadow-sm border-b border-muted-gray border-opacity-20">
          <div className="container-app py-4 md:py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-info-blue to-soft-purple rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-3xl font-bold text-primary-black">
                  AI Quiz Generator
                </h1>
                <p className="text-xs md:text-sm text-muted-gray">
                  Test your knowledge with AI-generated quizzes
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container-app py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-primary-black mb-6">
                Create Your Quiz
              </h2>

              <div className="space-y-6">
                <Input
                  label="Topic"
                  placeholder="e.g., JavaScript, Biology, History..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  leftIcon={<BookOpen size={20} />}
                />

                <div>
                  <label className="block text-sm font-medium text-primary-black mb-3">
                    Difficulty Level
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['easy', 'medium', 'hard'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setDifficulty(level)}
                        className={`px-4 py-3 rounded-lg border-2 transition-all capitalize ${
                          difficulty === level
                            ? 'border-vibrant-orange bg-vibrant-orange text-white'
                            : 'border-muted-gray border-opacity-30 hover:border-vibrant-orange'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-black mb-3">
                    Number of Questions: {questionCount}
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="20"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-gray mt-1">
                    <span>3</span>
                    <span>20</span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleStartQuiz}
                  disabled={!topic.trim()}
                  leftIcon={<Brain size={18} />}
                >
                  Generate Quiz
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Loading Screen
  if (quizState === 'loading') {
    return (
      <div className="min-h-screen bg-cool-blue-gray flex items-center justify-center">
        <Card className="text-center p-8">
          <LoadingSpinner size="lg" />
          <p className="text-primary-black font-medium mt-4">
            Generating your quiz...
          </p>
          <p className="text-muted-gray text-sm mt-2">
            Creating {questionCount} questions about {topic}
          </p>
        </Card>
      </div>
    );
  }

  // Active Quiz Screen
  if (quizState === 'active' && quiz) {
    const question = quiz.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

    return (
      <div className="min-h-screen bg-cool-blue-gray">
        <div className="bg-white shadow-sm border-b border-muted-gray border-opacity-20">
          <div className="container-app py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-primary-black">
                  {quiz.topic}
                </h1>
                <p className="text-xs md:text-sm text-muted-gray">
                  Question {currentQuestion + 1} of {quiz.questions.length}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-muted-gray">
                  <Clock size={18} />
                  <span className="font-mono text-sm md:text-base">
                    {formatTime(timeElapsed)}
                  </span>
                </div>
                <Badge variant="info" className="hidden md:inline-flex">
                  {difficulty}
                </Badge>
              </div>
            </div>
            <div className="w-full bg-light-cream rounded-full h-2">
              <div
                className="bg-vibrant-orange h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="container-app py-6 md:py-8">
          <div className="max-w-3xl mx-auto">
            <Card className="p-6 md:p-8 mb-6">
              <h2 className="text-lg md:text-xl font-semibold text-primary-black mb-6">
                {question.question}
              </h2>

              <div className="space-y-3">
                {question.options.map((option, index) => {
                  const isSelected = answers[question.id] === index;
                  return (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswerSelect(question.id, index)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-vibrant-orange bg-vibrant-orange bg-opacity-10'
                          : 'border-muted-gray border-opacity-30 hover:border-vibrant-orange'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            isSelected
                              ? 'border-vibrant-orange bg-vibrant-orange'
                              : 'border-muted-gray'
                          }`}
                        >
                          {isSelected && (
                            <CheckCircle size={16} className="text-white" />
                          )}
                        </div>
                        <span className="text-sm md:text-base">{option}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </Card>

            <div className="flex justify-between">
              <Button
                variant="ghost"
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>

              {currentQuestion === quiz.questions.length - 1 ? (
                <Button
                  variant="primary"
                  onClick={handleSubmitQuiz}
                  leftIcon={<CheckCircle size={18} />}
                >
                  Submit Quiz
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleNextQuestion}
                  rightIcon={<ArrowRight size={18} />}
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (quizState === 'results' && quiz) {
    const score = calculateScore();

    return (
      <div className="min-h-screen bg-cool-blue-gray">
        <div className="bg-white shadow-sm border-b border-muted-gray border-opacity-20">
          <div className="container-app py-6">
            <h1 className="text-2xl md:text-3xl font-bold text-primary-black">
              Quiz Results
            </h1>
          </div>
        </div>

        <div className="container-app py-8">
          <div className="max-w-3xl mx-auto">
            <Card className="p-6 md:p-8 mb-6 text-center">
              <Trophy className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 text-vibrant-orange" />
              <h2 className="text-3xl md:text-4xl font-bold text-primary-black mb-2">
                {score.percentage}%
              </h2>
              <p className="text-lg text-muted-gray mb-4">
                {score.correct} out of {score.total} correct
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-muted-gray">
                <div className="flex items-center space-x-2">
                  <Clock size={16} />
                  <span>{formatTime(timeElapsed)}</span>
                </div>
                <span>•</span>
                <Badge variant={score.percentage >= 70 ? 'success' : 'warning'}>
                  {score.percentage >= 70 ? 'Passed' : 'Keep Practicing'}
                </Badge>
              </div>
            </Card>

            <Card className="p-6 md:p-8 mb-6">
              <h3 className="text-xl font-bold text-primary-black mb-4">
                Review Answers
              </h3>
              <div className="space-y-6">
                {quiz.questions.map((question, index) => {
                  const userAnswer = answers[question.id];
                  const isCorrect = userAnswer === question.correctAnswer;

                  return (
                    <div
                      key={question.id}
                      className="pb-6 border-b border-muted-gray border-opacity-20 last:border-0"
                    >
                      <div className="flex items-start space-x-3 mb-3">
                        {isCorrect ? (
                          <CheckCircle className="w-6 h-6 text-success-green flex-shrink-0 mt-1" />
                        ) : (
                          <XCircle className="w-6 h-6 text-warning-red flex-shrink-0 mt-1" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-primary-black mb-2">
                            {index + 1}. {question.question}
                          </p>
                          <div className="space-y-2 text-sm">
                            <p>
                              <span className="text-muted-gray">Your answer: </span>
                              <span
                                className={
                                  isCorrect ? 'text-success-green' : 'text-warning-red'
                                }
                              >
                                {userAnswer !== undefined
                                  ? question.options[userAnswer]
                                  : 'Not answered'}
                              </span>
                            </p>
                            {!isCorrect && (
                              <p>
                                <span className="text-muted-gray">Correct answer: </span>
                                <span className="text-success-green">
                                  {question.options[question.correctAnswer]}
                                </span>
                              </p>
                            )}
                            <p className="text-muted-gray italic">
                              {question.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleRestart}
                leftIcon={<RotateCcw size={18} />}
              >
                Take Another Quiz
              </Button>
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => window.history.back()}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default AIQuizPage;

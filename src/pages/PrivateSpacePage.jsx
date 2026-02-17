import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Play, 
  Pause, 
  Square,
  Coffee,
  Plus,
  Check,
  Trash2,
  BarChart3,
  Calendar,
  Target,
  TrendingUp,
  BookOpen
} from 'lucide-react';

import Button from '../components/common/Button';
import Card, { CardHeader, CardTitle, CardContent } from '../components/common/Card';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import { useAuth } from '../contexts/AuthContext';
import { useStudySession } from '../hooks/useStudySession';
import LoadingSpinner from '../components/common/LoadingSpinner';

/**
 * Private Space Page - Personal study sanctuary
 * Features: Pomodoro timer, to-do list, study analytics
 */
const PrivateSpacePage = () => {
  const { user } = useAuth();
  const {
    activeSession,
    loading: sessionLoading,
    elapsedTime,
    formattedTime,
    isOnBreak,
    startSession,
    endSession,
    startBreak,
    endBreak,
  } = useStudySession();

  const [activeTab, setActiveTab] = useState('timer'); // 'timer', 'todos', 'analytics'
  const [showStartModal, setShowStartModal] = useState(false);
  const [sessionSubject, setSessionSubject] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  
  // Todo state
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  const handleStartSession = async () => {
    if (!sessionSubject.trim()) return;
    
    const result = await startSession({
      subject: sessionSubject,
      notes: sessionNotes,
    });
    
    if (result.success) {
      setShowStartModal(false);
      setSessionSubject('');
      setSessionNotes('');
    }
  };

  const handleEndSession = async () => {
    const result = await endSession();
    
    if (result.success) {
      // Show success message with XP earned
      alert(`Session ended! You earned ${result.xpEarned} XP!`);
    }
  };

  const handleAddTodo = () => {
    if (!newTodo.trim()) return;
    
    const todo = {
      id: Date.now(),
      text: newTodo,
      completed: false,
      priority: 'medium',
    };
    
    setTodos([...todos, todo]);
    setNewTodo('');
  };

  const handleToggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const completedTodos = todos.filter(t => t.completed).length;
  const totalTodos = todos.length;

  return (
    <div className="min-h-screen bg-cool-blue-gray">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-muted-gray border-opacity-20">
        <div className="container-app py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary-black">Private Study Space</h1>
              <p className="text-muted-gray mt-1">
                Your personal sanctuary for focused learning
              </p>
            </div>
            
            {activeSession && !isOnBreak && (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-muted-gray">Current Session</p>
                  <p className="text-2xl font-bold text-vibrant-orange">
                    {formattedTime.formatted}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container-app py-8">
        {/* Tabs */}
        <div className="flex space-x-2 mb-8 border-b border-muted-gray border-opacity-20">
          <button
            onClick={() => setActiveTab('timer')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'timer'
                ? 'border-vibrant-orange text-vibrant-orange'
                : 'border-transparent text-muted-gray hover:text-primary-black'
            }`}
          >
            <Clock className="w-5 h-5 inline-block mr-2" />
            Study Timer
          </button>
          <button
            onClick={() => setActiveTab('todos')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'todos'
                ? 'border-vibrant-orange text-vibrant-orange'
                : 'border-transparent text-muted-gray hover:text-primary-black'
            }`}
          >
            <Check className="w-5 h-5 inline-block mr-2" />
            To-Do List
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'analytics'
                ? 'border-vibrant-orange text-vibrant-orange'
                : 'border-transparent text-muted-gray hover:text-primary-black'
            }`}
          >
            <BarChart3 className="w-5 h-5 inline-block mr-2" />
            Analytics
          </button>
        </div>

        {/* Timer Tab */}
        {activeTab === 'timer' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="text-center">
              <div className="py-12">
                {/* Timer Display */}
                <div className="mb-8">
                  <div className="w-64 h-64 mx-auto rounded-full bg-gradient-to-br from-vibrant-orange to-soft-purple flex items-center justify-center shadow-card-xl">
                    <div className="w-56 h-56 rounded-full bg-white flex items-center justify-center">
                      <div>
                        <p className="text-6xl font-bold text-primary-black mb-2">
                          {activeSession ? formattedTime.formatted : '00:00:00'}
                        </p>
                        {activeSession && (
                          <p className="text-sm text-muted-gray">
                            {isOnBreak ? 'On Break' : activeSession.subject}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timer Controls */}
                <div className="flex justify-center space-x-4">
                  {!activeSession ? (
                    <Button
                      variant="primary"
                      size="lg"
                      leftIcon={<Play size={20} />}
                      onClick={() => setShowStartModal(true)}
                    >
                      Start Study Session
                    </Button>
                  ) : (
                    <>
                      {!isOnBreak ? (
                        <>
                          <Button
                            variant="ghost"
                            size="lg"
                            leftIcon={<Coffee size={20} />}
                            onClick={startBreak}
                            disabled={sessionLoading}
                          >
                            Take Break
                          </Button>
                          <Button
                            variant="primary"
                            size="lg"
                            leftIcon={<Square size={20} />}
                            onClick={handleEndSession}
                            disabled={sessionLoading}
                          >
                            End Session
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="primary"
                          size="lg"
                          leftIcon={<Play size={20} />}
                          onClick={endBreak}
                          disabled={sessionLoading}
                        >
                          Resume Studying
                        </Button>
                      )}
                    </>
                  )}
                </div>

                {/* Session Info */}
                {activeSession && (
                  <div className="mt-8 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                    <div className="p-4 bg-light-cream rounded-lg">
                      <p className="text-sm text-muted-gray mb-1">Subject</p>
                      <p className="font-semibold text-primary-black">
                        {activeSession.subject}
                      </p>
                    </div>
                    <div className="p-4 bg-light-cream rounded-lg">
                      <p className="text-sm text-muted-gray mb-1">Breaks</p>
                      <p className="font-semibold text-primary-black">
                        {activeSession.breaks?.length || 0}
                      </p>
                    </div>
                    <div className="p-4 bg-light-cream rounded-lg">
                      <p className="text-sm text-muted-gray mb-1">XP Earned</p>
                      <p className="font-semibold text-vibrant-orange">
                        {Math.floor(elapsedTime / 900) * 10} XP
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Pomodoro Presets */}
            {!activeSession && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <Card hoverable clickable onClick={() => setShowStartModal(true)}>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-vibrant-orange bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-vibrant-orange" />
                    </div>
                    <h3 className="font-semibold text-primary-black mb-2">
                      Pomodoro (25 min)
                    </h3>
                    <p className="text-sm text-muted-gray">
                      Classic 25-minute focus session
                    </p>
                  </div>
                </Card>

                <Card hoverable clickable onClick={() => setShowStartModal(true)}>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-soft-purple bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-soft-purple" />
                    </div>
                    <h3 className="font-semibold text-primary-black mb-2">
                      Deep Work (50 min)
                    </h3>
                    <p className="text-sm text-muted-gray">
                      Extended focus for complex tasks
                    </p>
                  </div>
                </Card>

                <Card hoverable clickable onClick={() => setShowStartModal(true)}>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-info-blue bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-8 h-8 text-info-blue" />
                    </div>
                    <h3 className="font-semibold text-primary-black mb-2">
                      Quick Review (15 min)
                    </h3>
                    <p className="text-sm text-muted-gray">
                      Short session for quick reviews
                    </p>
                  </div>
                </Card>
              </div>
            )}
          </motion.div>
        )}

        {/* To-Do List Tab */}
        {activeTab === 'todos' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Study Tasks</CardTitle>
                  <Badge variant="info">
                    {completedTodos} / {totalTodos} completed
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Add Todo */}
                <div className="flex space-x-2 mb-6">
                  <Input
                    placeholder="Add a new task..."
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
                  />
                  <Button
                    variant="primary"
                    leftIcon={<Plus size={18} />}
                    onClick={handleAddTodo}
                  >
                    Add
                  </Button>
                </div>

                {/* Todo List */}
                <div className="space-y-3">
                  {todos.length > 0 ? (
                    todos.map((todo) => (
                      <motion.div
                        key={todo.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors ${
                          todo.completed
                            ? 'bg-success-green bg-opacity-5 border-success-green border-opacity-20'
                            : 'bg-white border-muted-gray border-opacity-20 hover:border-opacity-40'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => handleToggleTodo(todo.id)}
                          className="w-5 h-5 rounded border-muted-gray text-vibrant-orange focus:ring-vibrant-orange"
                        />
                        <p
                          className={`flex-1 ${
                            todo.completed
                              ? 'line-through text-muted-gray'
                              : 'text-primary-black'
                          }`}
                        >
                          {todo.text}
                        </p>
                        {todo.priority === 'high' && !todo.completed && (
                          <Badge variant="warning" size="sm">
                            High Priority
                          </Badge>
                        )}
                        <button
                          onClick={() => handleDeleteTodo(todo.id)}
                          className="p-2 hover:bg-warning-red hover:bg-opacity-10 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} className="text-warning-red" />
                        </button>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-gray">
                      <Check className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>No tasks yet. Add your first task above!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <div className="text-center">
                  <div className="w-12 h-12 bg-warm-yellow bg-opacity-10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-warm-yellow" />
                  </div>
                  <p className="text-sm text-muted-gray mb-1">Total Study Time</p>
                  <p className="text-2xl font-bold text-primary-black">
                    {Math.floor(user?.stats?.totalStudyHours || 0)}h
                  </p>
                </div>
              </Card>

              <Card>
                <div className="text-center">
                  <div className="w-12 h-12 bg-vibrant-orange bg-opacity-10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-vibrant-orange" />
                  </div>
                  <p className="text-sm text-muted-gray mb-1">Current Streak</p>
                  <p className="text-2xl font-bold text-primary-black">
                    {user?.stats?.currentStreak || 0} days
                  </p>
                </div>
              </Card>

              <Card>
                <div className="text-center">
                  <div className="w-12 h-12 bg-soft-purple bg-opacity-10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-soft-purple" />
                  </div>
                  <p className="text-sm text-muted-gray mb-1">XP Points</p>
                  <p className="text-2xl font-bold text-primary-black">
                    {user?.stats?.xp || 0}
                  </p>
                </div>
              </Card>

              <Card>
                <div className="text-center">
                  <div className="w-12 h-12 bg-success-green bg-opacity-10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="w-6 h-6 text-success-green" />
                  </div>
                  <p className="text-sm text-muted-gray mb-1">Level</p>
                  <p className="text-2xl font-bold text-primary-black">
                    {user?.stats?.level || 1}
                  </p>
                </div>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Study Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-gray">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="mb-2">Detailed analytics coming soon!</p>
                  <p className="text-sm">
                    Track your study patterns, productivity trends, and more.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Start Session Modal */}
      <AnimatePresence>
        {showStartModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-primary-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowStartModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-card-xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold text-primary-black mb-6">
                  Start Study Session
                </h2>

                <div className="space-y-4">
                  <Input
                    label="What are you studying?"
                    placeholder="e.g., Computer Science, Mathematics"
                    value={sessionSubject}
                    onChange={(e) => setSessionSubject(e.target.value)}
                    leftIcon={<BookOpen size={20} />}
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-primary-black mb-2">
                      Session Notes (Optional)
                    </label>
                    <textarea
                      className="w-full px-4 py-3 rounded-lg border border-muted-gray border-opacity-30 focus:border-vibrant-orange focus:outline-none transition-colors resize-none"
                      rows="3"
                      placeholder="Add any notes or goals for this session..."
                      value={sessionNotes}
                      onChange={(e) => setSessionNotes(e.target.value)}
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button
                      variant="ghost"
                      className="flex-1"
                      onClick={() => setShowStartModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={handleStartSession}
                      disabled={!sessionSubject.trim() || sessionLoading}
                      leftIcon={<Play size={18} />}
                    >
                      Start
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PrivateSpacePage;
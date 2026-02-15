import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HelpCircle,
  Search,
  Book,
  MessageCircle,
  Mail,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

/**
 * Help & Support Page
 * FAQ and support resources
 */
const HelpPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      category: 'Getting Started',
      question: 'How do I create a study room?',
      answer:
        'Navigate to the Study Rooms page and click the "Create Room" button. Fill in the room details including name, subject, and description. You can make it public or private, and set the maximum number of members.',
    },
    {
      id: 2,
      category: 'Getting Started',
      question: 'How do I join a study room?',
      answer:
        'Go to the Study Rooms page and browse available rooms. Click "Join" on any room that interests you. If the room is full, you\'ll need to wait for a spot to open up.',
    },
    {
      id: 3,
      category: 'Video Calls',
      question: 'How do I start a video call?',
      answer:
        'Inside any study room, click the "Start Call" button. A Google Meet window will open. Share the meeting link with other room members so they can join.',
    },
    {
      id: 4,
      category: 'Video Calls',
      question: 'Can I record video calls?',
      answer:
        'Yes! Google Meet supports recording. During a call, click the three dots menu and select "Record meeting". Note that recording requires a Google Workspace account.',
    },
    {
      id: 5,
      category: 'AI Features',
      question: 'How does the AI Assistant work?',
      answer:
        'The AI Assistant can help you understand concepts, generate quizzes, and provide study tips. Simply type your question in the chat and the AI will respond with helpful information.',
    },
    {
      id: 6,
      category: 'AI Features',
      question: 'How do I take an AI-generated quiz?',
      answer:
        'Go to the AI Quiz page, enter a topic, select difficulty level, and choose the number of questions. The AI will generate a custom quiz for you to take.',
    },
    {
      id: 7,
      category: 'Account',
      question: 'How do I update my profile?',
      answer:
        'Click on your profile picture in the sidebar and select "Profile". From there, you can update your display name, bio, and other information.',
    },
    {
      id: 8,
      category: 'Account',
      question: 'How do I change my password?',
      answer:
        'Go to Settings > Security and click "Change Password". You\'ll need to enter your current password and then your new password twice.',
    },
    {
      id: 9,
      category: 'Leaderboard',
      question: 'How do I earn XP and level up?',
      answer:
        'You earn XP by completing quizzes, studying in rooms, maintaining streaks, and achieving milestones. The more active you are, the faster you\'ll level up!',
    },
    {
      id: 10,
      category: 'Leaderboard',
      question: 'What are achievements?',
      answer:
        'Achievements are special badges you earn by completing specific tasks like taking your first quiz, maintaining a 7-day streak, or reaching the top 10 on the leaderboard.',
    },
  ];

  const categories = [...new Set(faqs.map((faq) => faq.category))];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-cool-blue-gray">
      {/* Header */}
      <div className="bg-gradient-to-r from-info-blue to-soft-purple text-white">
        <div className="container-app py-12 md:py-16">
          <div className="text-center max-w-3xl mx-auto">
            <HelpCircle className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              How can we help you?
            </h1>
            <p className="text-white text-opacity-90 mb-8">
              Search our knowledge base or browse frequently asked questions
            </p>
            <div className="max-w-2xl mx-auto">
              <Input
                placeholder="Search for help..."
                leftIcon={<Search size={20} />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container-app py-8 md:py-12">
        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <Book className="w-12 h-12 mx-auto mb-4 text-vibrant-orange" />
            <h3 className="font-semibold text-primary-black mb-2">
              Documentation
            </h3>
            <p className="text-sm text-muted-gray mb-4">
              Comprehensive guides and tutorials
            </p>
            <Button variant="ghost" size="sm" rightIcon={<ExternalLink size={16} />}>
              View Docs
            </Button>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-info-blue" />
            <h3 className="font-semibold text-primary-black mb-2">
              Community Forum
            </h3>
            <p className="text-sm text-muted-gray mb-4">
              Ask questions and get answers
            </p>
            <Button variant="ghost" size="sm" rightIcon={<ExternalLink size={16} />}>
              Visit Forum
            </Button>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <Mail className="w-12 h-12 mx-auto mb-4 text-success-green" />
            <h3 className="font-semibold text-primary-black mb-2">
              Contact Support
            </h3>
            <p className="text-sm text-muted-gray mb-4">
              Get help from our support team
            </p>
            <Button variant="ghost" size="sm" rightIcon={<ExternalLink size={16} />}>
              Email Us
            </Button>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-black mb-8">
            Frequently Asked Questions
          </h2>

          {categories.map((category) => {
            const categoryFaqs = filteredFaqs.filter(
              (faq) => faq.category === category
            );

            if (categoryFaqs.length === 0) return null;

            return (
              <div key={category} className="mb-8">
                <h3 className="text-xl font-semibold text-primary-black mb-4">
                  {category}
                </h3>
                <div className="space-y-3">
                  {categoryFaqs.map((faq, index) => (
                    <motion.div
                      key={faq.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card>
                        <button
                          onClick={() => toggleFaq(faq.id)}
                          className="w-full p-4 md:p-6 flex items-center justify-between text-left hover:bg-light-cream transition-colors"
                        >
                          <h4 className="font-semibold text-primary-black pr-4">
                            {faq.question}
                          </h4>
                          {expandedFaq === faq.id ? (
                            <ChevronUp className="w-5 h-5 text-muted-gray flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-muted-gray flex-shrink-0" />
                          )}
                        </button>
                        {expandedFaq === faq.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="px-4 md:px-6 pb-4 md:pb-6"
                          >
                            <p className="text-muted-gray">{faq.answer}</p>
                          </motion.div>
                        )}
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <Card className="p-12 text-center">
              <HelpCircle className="w-16 h-16 mx-auto mb-4 text-muted-gray opacity-50" />
              <h3 className="text-xl font-semibold text-primary-black mb-2">
                No results found
              </h3>
              <p className="text-muted-gray mb-6">
                Try different keywords or browse all questions
              </p>
              <Button variant="ghost" onClick={() => setSearchTerm('')}>
                Clear Search
              </Button>
            </Card>
          )}
        </div>

        {/* Still Need Help */}
        <Card className="mt-12 p-8 text-center bg-gradient-to-r from-vibrant-orange to-soft-purple text-white">
          <h2 className="text-2xl font-bold mb-2">Still need help?</h2>
          <p className="mb-6 text-white text-opacity-90">
            Our support team is here to assist you
          </p>
          <Button variant="secondary">Contact Support</Button>
        </Card>
      </div>
    </div>
  );
};

export default HelpPage;

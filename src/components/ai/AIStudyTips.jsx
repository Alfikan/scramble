import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, CheckCircle, TrendingUp, Target } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

/**
 * AI Study Tips Component
 * Displays personalized study recommendations
 */
const AIStudyTips = ({ suggestions = [] }) => {
  const priorityConfig = {
    high: {
      color: 'warning',
      icon: Target,
      label: 'High Priority',
    },
    medium: {
      color: 'info',
      icon: TrendingUp,
      label: 'Medium Priority',
    },
    low: {
      color: 'success',
      icon: CheckCircle,
      label: 'Low Priority',
    },
  };

  if (!suggestions || suggestions.length === 0) {
    return (
      <Card className="text-center p-8">
        <Lightbulb className="w-12 h-12 mx-auto mb-4 text-muted-gray opacity-50" />
        <p className="text-muted-gray">No study tips available yet</p>
        <p className="text-sm text-muted-gray mt-2">
          Complete some quizzes to get personalized recommendations
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {suggestions.map((suggestion, index) => {
        const config = priorityConfig[suggestion.priority] || priorityConfig.medium;
        const Icon = config.icon;

        return (
          <motion.div
            key={suggestion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hoverable className="p-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-light-cream flex items-center justify-center">
                    <Icon className="w-5 h-5 text-vibrant-orange" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-primary-black">
                      {suggestion.title}
                    </h3>
                    <Badge variant={config.color} size="sm">
                      {config.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-gray">
                    {suggestion.description}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default AIStudyTips;

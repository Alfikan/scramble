import React from 'react';
import { motion } from 'framer-motion';
import Card from '../components/common/Card';

const PrivateSpacePage = () => {
  return (
    <div className="min-h-screen bg-cool-blue-gray p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container-app"
      >
        <Card className="text-center">
          <h1 className="text-3xl font-bold text-primary-black mb-4">
            Private Study Space
          </h1>
          <p className="text-muted-gray mb-8">
            Your personal study sanctuary with timers, to-dos, and analytics.
          </p>
          <p className="text-sm text-muted-gray">
            🚧 This page is under construction. Coming soon!
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default PrivateSpacePage;
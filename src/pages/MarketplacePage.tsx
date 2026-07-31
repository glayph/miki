import React from 'react';
import { motion } from 'motion/react';
import { SkillMarketplace } from '../components/SkillMarketplace';

export const MarketplacePage: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#0A0A0B]"
    >
      <SkillMarketplace />
    </motion.div>
  );
};

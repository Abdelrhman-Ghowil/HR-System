import React from 'react';
import { Button } from './button';
import { Sparkles } from 'lucide-react';

interface SmartEvaluationButtonProps {
  onClick: () => void;
  className?: string;
}

export const SmartEvaluationButton: React.FC<SmartEvaluationButtonProps> = ({ 
  onClick, 
  className = '' 
}) => {
  return (
    <Button
      onClick={onClick}
      className={`bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 ${className}`}
    >
      <Sparkles className="h-4 w-4 mr-2" />
      Smart Evaluation
    </Button>
  );
};
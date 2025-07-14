import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './dialog';
import { Card, CardContent } from './card';
import { Upload, FileText, Bot } from 'lucide-react';
import { Button } from './button';

interface SmartEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (option: 'upload-excel' | 'saved-template' | 'ai-prombot') => void;
}

interface OptionCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
}

const OptionCard: React.FC<OptionCardProps> = ({ icon, title, subtitle, onClick }) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-2 hover:border-purple-300 group"
      onClick={onClick}
    >
      <CardContent className="p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full group-hover:from-purple-200 group-hover:to-indigo-200 transition-all duration-200">
            {icon}
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </CardContent>
    </Card>
  );
};

export const SmartEvaluationModal: React.FC<SmartEvaluationModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const handleOptionSelect = (option: 'upload-excel' | 'saved-template' | 'ai-prombot') => {
    onSelect(option);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Smart Evaluation Options
          </DialogTitle>
          <p className="text-gray-600 mt-2">
            Choose how you'd like to create or enhance your evaluation
          </p>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <OptionCard
            icon={<Upload className="h-6 w-6 text-purple-600" />}
            title="Upload Excel"
            subtitle="Import evaluation data from an Excel spreadsheet"
            onClick={() => handleOptionSelect('upload-excel')}
          />
          
          <OptionCard
            icon={<FileText className="h-6 w-6 text-purple-600" />}
            title="Use Saved Template"
            subtitle="Start with a pre-configured evaluation template"
            onClick={() => handleOptionSelect('saved-template')}
          />
          
          <OptionCard
            icon={<Bot className="h-6 w-6 text-purple-600" />}
            title="Use AI via Prombot"
            subtitle="Generate evaluation content using AI assistance"
            onClick={() => handleOptionSelect('ai-prombot')}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
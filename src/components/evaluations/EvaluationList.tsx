
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Plus, Calendar, User } from 'lucide-react';

const EvaluationList = () => {
  const evaluations = [
    {
      id: '1',
      employeeName: 'Sarah Johnson',
      type: 'Annual Review',
      status: 'completed',
      score: 8.5,
      date: '2024-06-15',
      reviewer: 'Michael Chen'
    },
    {
      id: '2',
      employeeName: 'David Kim',
      type: 'Quarterly Review',
      status: 'pending',
      score: null,
      date: '2024-06-20',
      reviewer: 'Emily Rodriguez'
    },
    {
      id: '3',
      employeeName: 'Lisa Wang',
      type: 'Performance Review',
      status: 'in-progress',
      score: null,
      date: '2024-06-18',
      reviewer: 'Michael Chen'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Evaluations</h2>
          <p className="text-gray-600">Track and manage employee evaluations</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
          <Plus className="h-4 w-4 mr-2" />
          New Evaluation
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {evaluations.map((evaluation) => (
          <Card key={evaluation.id} className="hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{evaluation.employeeName}</h3>
                    <p className="text-sm text-gray-600">{evaluation.type}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Badge 
                    variant={
                      evaluation.status === 'completed' ? 'default' : 
                      evaluation.status === 'in-progress' ? 'secondary' : 'outline'
                    }
                    className={
                      evaluation.status === 'completed' ? 'bg-green-100 text-green-800' :
                      evaluation.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }
                  >
                    {evaluation.status}
                  </Badge>
                  
                  {evaluation.score && (
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{evaluation.score}</div>
                      <div className="text-xs text-gray-500">Score</div>
                    </div>
                  )}
                  
                  <div className="text-right space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(evaluation.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="h-4 w-4 mr-1" />
                      {evaluation.reviewer}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EvaluationList;

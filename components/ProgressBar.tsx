import React from 'react';
import { Progress } from 'components/ui/progress';

interface ProgressBarProps {
  value: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
  return (
    <div className="space-y-4">
      <Progress value={value} className="h-2" />
      <p className="text-sm text-muted-foreground text-right">
        {Math.round(value)}% abgeschlossen
      </p>
    </div>
  );
};

export default ProgressBar;

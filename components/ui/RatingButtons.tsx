import React from 'react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { RATING_SCALE } from '@/constants/digitalFitCheck';

interface RatingButtonsProps {
  onSelect: (rating: number) => void;
  selectedRating: number | null;
  disabled?: boolean;
}

export const RatingButtons: React.FC<RatingButtonsProps> = ({
  onSelect,
  selectedRating,
  disabled = false
}) => {
  const ratings = Array.from({ length: RATING_SCALE.MAX }, (_, i) => i + 1);

  return (
    <div className="space-y-4">
      <div className="flex justify-between gap-2">
        {ratings.map((value) => (
          <Button
            key={value}
            variant={selectedRating === value ? "default" : "outline"}
            onClick={() => onSelect(value)}
            disabled={disabled}
            className={cn(
              "flex-1 h-12 font-medium",
              selectedRating === value && "bg-black hover:bg-black/90 text-white"
            )}
          >
            {value}
          </Button>
        ))}
      </div>
      <div className="flex justify-between text-sm text-gray-500">
        <span>{RATING_SCALE.LABELS[1]}</span>
        <span>{RATING_SCALE.LABELS[5]}</span>
      </div>
    </div>
  );
};

import React from 'react';
import { Button } from 'components/ui/button';
import { cn } from 'lib/utils';

interface RatingButtonsProps {
  selectedRating: number | null;
  onRatingSelect: (rating: number) => void;
}

const RatingButtons: React.FC<RatingButtonsProps> = ({ selectedRating, onRatingSelect }) => {
  return (
    <div className="flex justify-center space-x-4">
      {[1, 2, 3, 4, 5].map((rating) => (
        <Button
          key={rating}
          onClick={() => onRatingSelect(rating)}
          className={cn(
            "w-12 h-12 text-black", // Ensure text color is black for visibility
            selectedRating === rating ? "bg-primary text-white" : "bg-secondary"
          )}
        >
          {rating}
        </Button>
      ))}
    </div>
  );
};

export default RatingButtons;

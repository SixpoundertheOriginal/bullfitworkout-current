
import React from 'react';
import { Exercise } from '@/types/exercise';
import { CommonExerciseCard } from '../exercises/CommonExerciseCard';

interface ExerciseCardProps {
  exercise: Exercise;
  onAdd?: (exercise: Exercise) => void;
}

export const ExerciseCard = React.memo<ExerciseCardProps>(({ exercise, onAdd }) => {
  return (
    <CommonExerciseCard
      exercise={exercise}
      variant="workout-add"
      onAdd={onAdd}
    />
  );
});

ExerciseCard.displayName = 'ExerciseCard';

export default ExerciseCard;

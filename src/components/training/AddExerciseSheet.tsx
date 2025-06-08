
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Search, Plus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Exercise } from "@/types/exercise";
import { useExerciseSuggestions } from "@/hooks/useExerciseSuggestions";
import { useWorkoutHistory } from "@/hooks/useWorkoutHistory";
import { useExercises } from "@/hooks/useExercises";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AllExercisesPage from "@/pages/AllExercisesPage";

interface AddExerciseSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectExercise: (exercise: string | Exercise) => void;
  trainingType?: string;
}

export const AddExerciseSheet: React.FC<AddExerciseSheetProps> = ({
  open,
  onOpenChange,
  onSelectExercise,
  trainingType = ""
}) => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<string>("suggested");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { suggestedExercises } = useExerciseSuggestions(trainingType);
  const { workouts } = useWorkoutHistory();
  const { exercises: allExercises } = useExercises();
  const [showAllExercises, setShowAllExercises] = useState(false);

  // Extract recently used exercises from workout history with Phase 1 crash fixes
  const recentExercises = React.useMemo(() => {
    // Phase 1 Fix: Add comprehensive null guards
    if (!workouts?.length || !Array.isArray(allExercises)) return [];
    
    const exerciseMap = new Map<string, Exercise>();
    
    // Get unique exercise names from recent workouts
    workouts.slice(0, 8).forEach(workout => {
      const exerciseNames = new Set<string>();
      
      // Phase 1 Fix: Add null guard for exerciseSets
      if (workout?.exerciseSets && Array.isArray(workout.exerciseSets)) {
        workout.exerciseSets.forEach(set => {
          if (set?.exercise_name) {
            exerciseNames.add(set.exercise_name);
          }
        });
      }
      
      exerciseNames.forEach(name => {
        const exercise = allExercises.find(e => e?.name === name);
        if (exercise && !exerciseMap.has(exercise.id)) {
          exerciseMap.set(exercise.id, exercise);
        }
      });
    });
    
    // Phase 1 Fix: Safe Array.from with fallback
    return exerciseMap.size > 0 ? Array.from(exerciseMap.values()) : [];
  }, [workouts, allExercises]);

  // Filter exercises based on search query with null guards
  const filteredSuggested = React.useMemo(() => {
    const safeSuggested = Array.isArray(suggestedExercises) ? suggestedExercises : [];
    return searchQuery
      ? safeSuggested.filter(e => 
          e?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (Array.isArray(e?.primary_muscle_groups) && e.primary_muscle_groups.some(m => m?.toLowerCase().includes(searchQuery.toLowerCase())))
        )
      : safeSuggested;
  }, [suggestedExercises, searchQuery]);

  const filteredRecent = React.useMemo(() => {
    const safeRecent = Array.isArray(recentExercises) ? recentExercises : [];
    return searchQuery
      ? safeRecent.filter(e => 
          e?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (Array.isArray(e?.primary_muscle_groups) && e.primary_muscle_groups.some(m => m?.toLowerCase().includes(searchQuery.toLowerCase())))
        )
      : safeRecent;
  }, [recentExercises, searchQuery]);

  const handleAddExercise = (exercise: Exercise | string) => {
    const exerciseName = typeof exercise === 'string' ? exercise : exercise?.name || 'Unknown Exercise';
    onSelectExercise(exercise);
    
    // Close the sheet immediately after selecting an exercise
    onOpenChange(false);
    
    // Show toast notification
    toast({
      title: "Exercise added",
      description: `Added ${exerciseName} to your workout`
    });
  };

  const renderExerciseCard = (exercise: Exercise) => {
    if (!exercise) return null;
    
    const muscleGroups = Array.isArray(exercise.primary_muscle_groups) 
      ? exercise.primary_muscle_groups.slice(0, 2).join(', ')
      : 'Unknown';
    
    return (
      <div key={exercise.id} className="flex items-center justify-between p-3 mb-2 bg-gray-800/50 rounded-lg border border-gray-700/50">
        <div className="flex flex-col flex-1 mr-2">
          <span className="font-medium text-white">{exercise.name}</span>
          <span className="text-sm text-gray-400">{muscleGroups}</span>
        </div>
        <Button
          onClick={() => handleAddExercise(exercise)}
          size="sm"
          variant="outline"
          className="h-9 px-3 rounded-full bg-purple-900/30 border-purple-500/30 hover:bg-purple-800/50"
        >
          <Plus size={16} className="mr-1" />
          Add
        </Button>
      </div>
    );
  };

  if (showAllExercises) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent 
          side="bottom" 
          className="h-[90vh] rounded-t-xl border-t border-gray-700 bg-gray-900 p-0"
        >
          <AllExercisesPage 
            onSelectExercise={handleAddExercise}
            standalone={false}
            onBack={() => setShowAllExercises(false)}
          />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="h-[80vh] rounded-t-xl border-t border-gray-700 bg-gray-900 p-0"
      >
        <div className="flex flex-col h-full">
          {/* Handle for dragging */}
          <div className="flex justify-center pt-2 pb-1">
            <div className="w-12 h-1.5 bg-gray-700 rounded-full"></div>
          </div>
          
          <div className="px-4 pb-2 h-full flex flex-col">
            <SheetHeader className="mb-4">
              <SheetTitle className="text-xl font-bold text-center">Add an Exercise</SheetTitle>
            </SheetHeader>
            
            {/* Search bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search exercises..."
                className="pl-9 bg-gray-800 border-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Tabs */}
            <Tabs defaultValue="suggested" className="w-full flex-1 flex flex-col" onValueChange={setActiveTab} value={activeTab}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="suggested">Suggested</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="browse" onClick={() => setShowAllExercises(true)}>Browse All</TabsTrigger>
              </TabsList>
              
              <TabsContent value="suggested" className="mt-0 flex-1 overflow-auto">
                <div className="overflow-y-auto max-h-[calc(80vh-170px)]">
                  {filteredSuggested.length > 0 ? (
                    filteredSuggested.map(exercise => exercise ? renderExerciseCard(exercise) : null).filter(Boolean)
                  ) : (
                    <div className="text-center py-6 text-gray-400">
                      No suggested exercises found
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="recent" className="mt-0 flex-1 overflow-auto">
                <div className="overflow-y-auto max-h-[calc(80vh-170px)]">
                  {filteredRecent.length > 0 ? (
                    filteredRecent.map(exercise => exercise ? renderExerciseCard(exercise) : null).filter(Boolean)
                  ) : (
                    <div className="text-center py-6 text-gray-400">
                      No recent exercises found
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

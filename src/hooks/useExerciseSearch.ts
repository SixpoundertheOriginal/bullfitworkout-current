
import { Exercise } from '@/types/exercise';
import { SearchFilters } from '@/types/search';
import { concurrentExerciseSearchEngine } from '@/lib/global/index';
import { concurrencyManager } from '@/lib/concurrency/ConcurrencyManager';
import { createSearchHook } from '@/lib/search/createSearchHook';
import { useExercises } from '@/hooks/useExercises';

// Create the exercise search hook using the factory
const useExerciseSearchBase = createSearchHook<Exercise>({
  searchEngine: concurrentExerciseSearchEngine,
  concurrencyManager,
  hookId: 'exercises'
});

export interface UseExerciseSearchOptions {
  initialQuery?: string;
  initialFilters?: SearchFilters;
  debounceMs?: number;
  autoSearch?: boolean;
}

export interface UseExerciseSearchReturn {
  results: Exercise[];
  isSearching: boolean;
  search: (query: string, filters?: SearchFilters) => Promise<void>;
  searchDebounced: (query: string, filters?: SearchFilters) => void;
  query: string;
  filters: SearchFilters;
  setQuery: (query: string) => void;
  setFilters: (filters: SearchFilters) => void;
  clearSearch: () => void;
  isIndexed: boolean;
  fromCache: boolean;
  fromWorker: boolean;
  workerStatus: { ready: boolean; available: boolean };
}

export function useExerciseSearch(options: UseExerciseSearchOptions = {}): UseExerciseSearchReturn {
  const { exercises } = useExercises();
  
  return useExerciseSearchBase(exercises, {
    ...options,
    enableIndexing: true
  });
}

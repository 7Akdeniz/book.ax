import {useAppDispatch, useAppSelector} from '@store/hooks';
import {
  setFilters as setFiltersAction,
  searchStart,
  searchSuccess,
  searchFailure,
  clearResults,
  resetFilters as resetFiltersAction,
} from '../searchSlice';
import {searchService} from '../searchService';
import {SearchFilters} from '../../../types/models';

export const useSearch = () => {
  const dispatch = useAppDispatch();
  const {filters, results, isLoading, error, hasSearched} = useAppSelector(
    state => state.search,
  );

  const setFilters = (newFilters: Partial<SearchFilters>) => {
    dispatch(setFiltersAction(newFilters));
  };

  const searchHotels = async () => {
    try {
      dispatch(searchStart());
      const hotels = await searchService.searchHotels(filters);
      dispatch(searchSuccess(hotels));
      return {success: true, data: hotels};
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Suche fehlgeschlagen';
      dispatch(searchFailure(errorMessage));
      return {success: false, error: errorMessage};
    }
  };

  const resetFilters = () => {
    dispatch(resetFiltersAction());
  };

  const clearSearchResults = () => {
    dispatch(clearResults());
  };

  return {
    filters,
    results,
    isLoading,
    error,
    hasSearched,
    setFilters,
    searchHotels,
    resetFilters,
    clearSearchResults,
  };
};

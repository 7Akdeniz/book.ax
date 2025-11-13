import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Hotel, SearchFilters} from '../../types/models';

interface SearchState {
  filters: SearchFilters;
  results: Hotel[];
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
}

const initialState: SearchState = {
  filters: {
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    minPrice: undefined,
    maxPrice: undefined,
    rating: undefined,
    amenities: [],
  },
  results: [],
  isLoading: false,
  error: null,
  hasSearched: false,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<SearchFilters>>) => {
      state.filters = {...state.filters, ...action.payload};
    },
    searchStart: state => {
      state.isLoading = true;
      state.error = null;
    },
    searchSuccess: (state, action: PayloadAction<Hotel[]>) => {
      state.isLoading = false;
      state.results = action.payload;
      state.hasSearched = true;
      state.error = null;
    },
    searchFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearResults: state => {
      state.results = [];
      state.hasSearched = false;
      state.error = null;
    },
    resetFilters: state => {
      state.filters = initialState.filters;
    },
  },
});

export const {
  setFilters,
  searchStart,
  searchSuccess,
  searchFailure,
  clearResults,
  resetFilters,
} = searchSlice.actions;

export default searchSlice.reducer;

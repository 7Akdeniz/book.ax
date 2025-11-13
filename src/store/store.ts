import {configureStore} from '@reduxjs/toolkit';
import authReducer from '@features/auth/authSlice';
import searchReducer from '@features/search/searchSlice';
import bookingReducer from '@features/search/bookingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    search: searchReducer,
    booking: bookingReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

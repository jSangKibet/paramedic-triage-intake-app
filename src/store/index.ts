import { configureStore } from '@reduxjs/toolkit';

import connectivityReducer from './connectivitySlice';
import triageReducer from './triageSlice';

export const store = configureStore({
  reducer: {
    triage: triageReducer,
    connectivity: connectivityReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

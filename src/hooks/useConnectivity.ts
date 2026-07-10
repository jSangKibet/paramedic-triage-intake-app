import { useEffect, useRef } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useSQLiteContext } from 'expo-sqlite';

import { setOnline } from '@/store/connectivitySlice';
import { syncPendingTriages } from '@/store/triageSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export function useConnectivity() {
  const dispatch = useAppDispatch();
  const db = useSQLiteContext();
  const wasOnline = useRef(true);

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      const isOnline = state.isConnected ?? false;
      wasOnline.current = isOnline;
      dispatch(setOnline(isOnline));
    });

    const unsubscribe = NetInfo.addEventListener((state) => {
      const isOnline = state.isConnected ?? false;
      dispatch(setOnline(isOnline));

      if (!wasOnline.current && isOnline) {
        dispatch(syncPendingTriages({ db }));
      }

      wasOnline.current = isOnline;
    });

    return () => unsubscribe();
  }, [dispatch, db]);

  return useAppSelector((state) => state.connectivity.isOnline);
}

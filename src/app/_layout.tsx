import { DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider } from 'expo-sqlite';
import { Provider } from 'react-redux';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { migrateDbIfNeeded } from '@/database/schema';
import { useConnectivity } from '@/hooks/useConnectivity';
import { store } from '@/store';

SplashScreen.preventAutoHideAsync();

function ConnectivityListener() {
  useConnectivity();
  return null;
}

export default function TabLayout() {
  return (
    <SQLiteProvider databaseName="triage.db" onInit={migrateDbIfNeeded}>
      <Provider store={store}>
        <ThemeProvider value={DefaultTheme}>
          <ConnectivityListener />
          <AnimatedSplashOverlay />
          <AppTabs />
        </ThemeProvider>
      </Provider>
    </SQLiteProvider>
  );
}

# Paramedic Triage Intake App

A React Native app for field paramedics to log patient triage data with offline-first persistence. Built with Expo SDK 57, Redux Toolkit, and SQLite.

## Architecture

- **Framework:** Expo SDK 57 (React Native 0.86, TypeScript)
- **UI Layer:** Expo Router screens and form components
- **State Management:** Redux Toolkit (triage slice + connectivity slice)
- **Persistence:** expo-sqlite with WAL mode
- **Network:** @react-native-community/netinfo for connectivity monitoring, mock API simulating a 2-second delay with random failures

## Sync Queue

1. User submits the intake form
2. The triage record is written to SQLite immediately with `synced = 0` — this always succeeds regardless of connectivity
3. The record is added to the Redux store and the sync queue
4. **If online:** the mock API is called right away. On success, the record is marked `synced = 1` in SQLite and removed from the sync queue in Redux. If the API call fails, the record stays pending
5. **If offline:** no API call is attempted. The record sits in SQLite with `synced = 0`
6. NetInfo listens for connectivity changes in the background. When the device comes back online, `syncPendingTriages` reads all unsynced records from SQLite, submits each to the mock API, and marks them synced one by one
7. If the app is killed and reopened, `loadTriages` reads all records from SQLite into Redux, and the NetInfo listener triggers sync on the next online check

## Project Structure

```
src/
├── app/
│   ├── _layout.tsx            Root providers (SQLite, Redux, Theme) + connectivity listener
│   ├── index.tsx              Triage form screen
│   └── history.tsx            History list with sync status
├── components/
│   ├── TriageForm.tsx         Form with validation
│   ├── PriorityPicker.tsx     Tappable 1-5 priority chips
│   ├── StatusPicker.tsx       Pending / In-Transit segmented toggle
│   ├── SyncIndicator.tsx      Online/offline/syncing badge
│   └── TriageCard.tsx         History list item
├── database/
│   ├── schema.ts              Table DDL + migrations
│   └── triage-repository.ts   CRUD operations
├── services/
│   ├── mock-api.ts            Simulated POST endpoint (2s delay, 15% failure)
│   └── sync-engine.ts         Queue processing
├── store/
│   ├── index.ts               Store configuration
│   ├── hooks.ts               Typed useAppSelector/useAppDispatch
│   ├── triageSlice.ts         Records + sync queue + thunks
│   └── connectivitySlice.ts   Network state
├── hooks/
│   ├── useConnectivity.ts     NetInfo → Redux bridge
│   └── useSQLite.ts           SQLite context hook
├── constants/
│   ├── theme.ts               Colors, fonts, spacing
│   └── colors.ts              Priority color mapping
└── types/
    └── triage.ts              Domain types
```

## Quick Usage
Download 'app-debug.apk' from the releases section and install on an android device.

## Setup

Requires Node.js 22.13+ and the Expo CLI.

```bash
npm install
npx expo start
```

Press `a` for Android emulator, `i` for iOS simulator, or scan the QR code with Expo Go on a physical device.

## Tests

```bash
npx jest
```

Tests cover Redux slice reducers (state transitions for adding/syncing triages), the sync engine (empty queue, full success, partial failures), and the mock API (response format, timing, failure behavior).

## Airplane Mode Demo

1. Fill the form and submit while online — record syncs immediately
2. Enable Airplane Mode — indicator turns red
3. Submit another triage — saves locally, shows "Pending sync" in History
4. Disable Airplane Mode — indicator turns yellow "Syncing...", then the pending record flips to "Synced"

## Dependencies

- `expo` ~57.0.4, `react-native` 0.86
- `expo-sqlite` — local database
- `@react-native-community/netinfo` — connectivity monitoring
- `@reduxjs/toolkit` + `react-redux` — state management
- `expo-router` — file-based navigation
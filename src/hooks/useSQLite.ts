import { useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';

export function useSQLite(): SQLiteDatabase {
  return useSQLiteContext();
}

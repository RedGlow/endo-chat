// from https://usehooks.com/useLocalStorage/
import { useCallback, useState } from "react";
import throws from "../throws";

export enum StorageType {
  Local,
  Session,
}

const getStorage = (s: StorageType) =>
  s === StorageType.Local
    ? window.localStorage
    : s === StorageType.Session
    ? window.sessionStorage
    : throws<Storage>("Unknown storage type");

export default function useStorage<T>(
  storageType: StorageType,
  key: string,
  initialValue: T
) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      // Get from local storage by key
      const item = getStorage(storageType).getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = useCallback(
    (value: T) => {
      try {
        // Save state
        setStoredValue(value);
        // Save to local storage
        if (typeof window !== "undefined") {
          getStorage(storageType).setItem(key, JSON.stringify(value));
        }
      } catch (error) {
        // A more advanced implementation would handle the error case
        console.log(error);
      }
    },
    [storageType]
  );
  return [storedValue, setValue] as const;
}

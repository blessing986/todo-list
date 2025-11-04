import Constants from 'expo-constants';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import TodoApp from './TodoApp';

// Get the Convex URL from environment or config
const CONVEX_URL = 
  process.env.EXPO_PUBLIC_CONVEX_URL || 
  Constants.expoConfig?.extra?.convexUrl || 
  '';

console.log('Connecting to Convex URL:', CONVEX_URL); // Debug log

if (!CONVEX_URL) {
  console.error('CONVEX_URL is not defined!');
}

// Initialize Convex client
const convex = new ConvexReactClient(CONVEX_URL, {
  unsavedChangesWarning: false,
});

export default function App() {
  return (
    <ConvexProvider client={convex}>
      <TodoApp />
    </ConvexProvider>
  );
}



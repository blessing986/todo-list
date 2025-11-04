// ConvexClientProvider.tsx
import React from 'react';
import { ConvexProvider, ConvexReactClient } from '@convex-dev/react';
import { CONVEX_URL } from '@env'; // Use environment variables for safety

// Import your generated API functions
import ConvexClient from '../convex/_generated/client';

// If not using @env, replace with your URL: new ConvexReactClient("YOUR_CONVEX_URL");
const convex = ConvexClient;

export default function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}

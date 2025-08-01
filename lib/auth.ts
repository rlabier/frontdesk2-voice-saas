// Authentication helper for Vercel/Supabase deployment
// This file should be placed at /lib/auth.ts

import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getUser() {
  try {
    // For now, return a mock user since we're migrating from Replit Auth
    // In production, this would integrate with Supabase Auth or your auth system
    return {
      id: 'migration-user-123', // Temporary user ID for migration
      email: 'migration@example.com'
    };
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export async function requireUser() {
  const user = await getUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

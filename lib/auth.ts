// Authentication utilities for Next.js application
// This provides helper functions for authentication

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getUser() {
  try {
    // This will be called on the client side to get current user
    const response = await fetch('/api/auth/user', {
      credentials: 'include'
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export async function signIn(email: string, password: string) {
  try {
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }
    
    return data;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    const response = await fetch('/api/auth/signout', {
      method: 'POST',
      credentials: 'include'
    });
    
    if (response.ok) {
      window.location.href = '/';
    }
  } catch (error) {
    console.error('Sign out error:', error);
  }
}

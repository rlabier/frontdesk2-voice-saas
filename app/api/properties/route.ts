// API Route for Properties CRUD operations - Vercel/Supabase
// /app/api/properties/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Temporary auth function for migration
async function getUser() {
  try {
    return {
      id: 'migration-user-123',
      email: 'migration@example.com'
    };
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

// Property schema validation (inline for now)
import { z } from 'zod';

const insertPropertySchema = z.object({
  UNITID: z.string().min(6).max(6),
  LOCKCODE: z.string().optional(),
  LOCKBOX: z.string().optional(),
  GATECODE: z.string().optional(),
  NETWORKNAME: z.string().optional(),
  PASSCODE: z.string().optional(),
  MANAGEREMAIL: z.string().email().optional(),
  GUESTBOOK: z.string().optional(),
  LAUNDRY: z.string().optional(),
  PETS: z.string().optional(),
  SMOKING: z.string().optional(),
  CHILDREN: z.string().optional(),
  PARTIES: z.string().optional(),
  GUESTPOLICY: z.string().optional(),
  CHECKIN: z.string().optional(),
  CHECKOUT: z.string().optional(),
  EARLYARR: z.string().optional(),
  LATEDEP: z.string().optional(),
  KEYLOCATION: z.string().optional(),
  SPECIALINSTR: z.string().optional(),
  LOCALAREAS: z.string().optional(),
  RESTURANTS: z.string().optional(),
  EMERGENCY: z.string().optional(),
  TAXI: z.string().optional(),
  WEATHER: z.string().optional(),
  BEACHINFO: z.string().optional(),
  SKIINFO: z.string().optional(),
  GOLFINFO: z.string().optional(),
  ATTRACTIONS: z.string().optional(),
  SHOPPING: z.string().optional(),
  ADDITIONALTIPS: z.string().optional(),
  status: z.enum(['draft', 'active', 'paused']).default('draft')
});

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: properties, error } = await supabase
      .from('properties')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching properties:', error);
      return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
    }

    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error in GET /api/properties:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = insertPropertySchema.parse(body);

    // Check if UNITID already exists
    const { data: existing } = await supabase
      .from('properties')
      .select('UNITID')
      .eq('UNITID', validatedData.UNITID)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Unit ID already exists' }, { status: 400 });
    }

    const { data: property, error } = await supabase
      .from('properties')
      .insert({
        ...validatedData,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating property:', error);
      return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
    }

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/properties:', error);
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
}

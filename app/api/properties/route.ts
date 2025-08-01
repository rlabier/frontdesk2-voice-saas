// API Route for Properties CRUD operations - Vercel/Supabase
// /app/api/properties/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { insertPropertySchema } from '@/lib/vercel-property-schema';
import { getUser } from '@/lib/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

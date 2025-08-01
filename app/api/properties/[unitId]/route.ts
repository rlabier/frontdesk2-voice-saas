// API Route for Individual Property operations - Vercel/Supabase  
// /app/api/properties/[unitId]/route.ts

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

const updatePropertySchema = z.object({
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
  status: z.enum(['draft', 'active', 'paused']).optional()
});

export async function GET(
  request: NextRequest,
  { params }: { params: { unitId: string } }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: property, error } = await supabase
      .from('properties')
      .select('*')
      .eq('UNITID', params.unitId)
      .eq('user_id', user.id)
      .single();

    if (error || !property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error('Error in GET /api/properties/[unitId]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { unitId: string } }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updatePropertySchema.parse(body);

    const { data: property, error } = await supabase
      .from('properties')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq('UNITID', params.unitId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error || !property) {
      return NextResponse.json({ error: 'Property not found or failed to update' }, { status: 404 });
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error('Error in PUT /api/properties/[unitId]:', error);
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { unitId: string } }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('UNITID', params.unitId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting property:', error);
      return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/properties/[unitId]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

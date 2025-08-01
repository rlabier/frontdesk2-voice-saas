// API Route for Individual Property operations - Vercel/Supabase  
// /app/api/properties/[unitId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { updatePropertySchema } from '@/lib/vercel-property-schema';
import { getUser } from '@/lib/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

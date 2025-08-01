// VAPI Interaction Logging API - Vercel/Supabase  
// /app/api/vapi/frontdesk/interaction/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const VALID_SQUAD_ID = "20bdbfcb-0fee-4ffe-bf30-a74424ccfa10";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      UNITID, 
      squadId, 
      interactionType, 
      issue,
      CALLERNAME,
      GUESTEMAIL,
      PHONENUMBER 
    } = body;

    // Validate required fields
    if (!UNITID || !interactionType) {
      return NextResponse.json({ 
        error: 'UNITID and interactionType are required',
        success: false 
      }, { status: 400 });
    }

    if (!squadId || squadId !== VALID_SQUAD_ID) {
      return NextResponse.json({ 
        error: 'Invalid or missing squadId',
        success: false 
      }, { status: 401 });
    }

    // Verify property exists
    const { data: property } = await supabase
      .from('properties')
      .select('UNITID')
      .eq('UNITID', UNITID.toUpperCase())
      .single();

    if (!property) {
      return NextResponse.json({
        error: `Property ${UNITID} not found`,
        success: false
      }, { status: 404 });
    }

    // Log the interaction
    const { data: interaction, error } = await supabase
      .from('voice_interactions')
      .insert({
        UNITID: UNITID.toUpperCase(),
        interaction_type: interactionType,
        issue: issue || null,
        CALLERNAME: CALLERNAME || null,
        GUESTEMAIL: GUESTEMAIL || null,
        PHONENUMBER: PHONENUMBER || null,
        timestamp: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error logging interaction:', error);
      return NextResponse.json({
        error: 'Failed to log interaction',
        success: false
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      interactionId: interaction.id,
      UNITID: interaction.UNITID,
      logged: {
        interactionType: interaction.interaction_type,
        issue: interaction.issue,
        callerInfo: {
          name: interaction.CALLERNAME,
          email: interaction.GUESTEMAIL,
          phone: interaction.PHONENUMBER
        },
        timestamp: interaction.timestamp
      },
      metadata: {
        squadId: squadId
      }
    });
    
  } catch (error) {
    console.error('Error in VAPI interaction logging:', error);
    return NextResponse.json({
      error: 'Internal server error during interaction logging',
      success: false
    }, { status: 500 });
  }
}

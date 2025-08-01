// VAPI Property Lookup API - Vercel/Supabase
// /app/api/vapi/frontdesk/lookup/route.ts

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
    const { UNITID, squadId } = body;

    // Validate request
    if (!UNITID) {
      return NextResponse.json({ 
        error: 'UNITID is required',
        success: false 
      }, { status: 400 });
    }

    if (!squadId || squadId !== VALID_SQUAD_ID) {
      return NextResponse.json({ 
        error: 'Invalid or missing squadId',
        success: false 
      }, { status: 401 });
    }

    // Fetch property from database
    const { data: property, error } = await supabase
      .from('properties')
      .select('*')
      .eq('UNITID', UNITID.toUpperCase())
      .eq('status', 'active')
      .single();

    if (error || !property) {
      return NextResponse.json({
        error: `Property ${UNITID} not found or inactive`,
        success: false
      }, { status: 404 });
    }

    // Increment voice call counter
    await supabase
      .from('properties')
      .update({ 
        voice_calls_this_week: (property.voice_calls_this_week || 0) + 1,
        updated_at: new Date().toISOString()
      })
      .eq('UNITID', UNITID.toUpperCase());

    // Return formatted property data for VAPI
    const response = {
      success: true,
      UNITID: property.UNITID,
      propertyInfo: {
        // Access & Security
        lockCode: property.LOCKCODE,
        lockBox: property.LOCKBOX,
        lockInstructions: property.LOCKINFO,
        gateCode: property.GATECODE,
        gateInstructions: property.GATEINFO,
        
        // Network & Technology
        wifiNetwork: property.NETWORKNAME,
        wifiPassword: property.PASSCODE,
        routerInfo: property.ROUTERINFO,
        tvInfo: property.TVINFO,
        noSignalHelp: property.NOSIG,
        
        // Amenities & Supplies
        linenInfo: property.LINENINFO,
        washclothPolicy: property.WASHCLOTHS,
        packNPlayInfo: property.PACKNPLAY,
        suppliesPolicy: property.EXSUPPLYINFO,
        dishwasherInstructions: property.DISHWASHER,
        coffeeMakerInfo: property.COFFEEMAKER,
        
        // Maintenance & Operations
        garbageInfo: property.GARBAGEINFO,
        jacuzziInstructions: property.JACUZZI,
        poolHeatingInfo: property.POOLHEAT,
        lostAndFoundPolicy: property.LOSTANDFOUND,
        
        // Community Access
        communityPassLocation: property.PASSLOC,
        parkingInfo: property.PARKING,
        poolCode: property.POOLCODE,
        communityPoolLocation: property.COMPOOLLOC,
        clubhouseInfo: property.CLUBHOUSE,
        
        // Management & Contact
        managerEmail: property.MANAGEREMAIL,
        managerPhone: property.MANAGERTXT,
        checkInTime: property.CHECKIN,
        checkOutTime: property.CHECKOUT,
        
        // Policies
        deliveryPolicy: property.DELIVERYINFO,
        petPolicy: property.PET,
        parkingPolicy: property.PARKINGINFO
      },
      metadata: {
        status: property.status,
        voiceCallsThisWeek: property.voice_calls_this_week + 1,
        lastUpdated: property.updated_at,
        squadId: squadId
      }
    };

    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Error in VAPI lookup:', error);
    return NextResponse.json({
      error: 'Internal server error during property lookup',
      success: false
    }, { status: 500 });
  }
}
